
import React, { useRef } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { TimelineItem } from '../types/timeline';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ExcelUploadProps {
  onDataImport: (items: TimelineItem[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onDataImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const timelineItems: TimelineItem[] = jsonData.map((row: any, index) => {
          // Mapear colunas possíveis (português e inglês)
          const data = row['Data'] || row['Date'] || row['data'] || row['date'] || '';
          const item = row['Item'] || row['item'] || row['Título'] || row['Title'] || '';
          const tipo = row['Tipo'] || row['Type'] || row['tipo'] || row['type'] || 'outro';
          const observacoes = row['Observações'] || row['Observacoes'] || row['Notes'] || row['observacoes'] || row['notes'] || '';

          // Normalizar tipo
          const tipoNormalizado = tipo.toLowerCase();
          let tipoFinal: 'trabalho' | 'educacao' | 'projeto' | 'certificacao' | 'outro' = 'outro';
          
          if (tipoNormalizado.includes('trabalho') || tipoNormalizado.includes('work') || tipoNormalizado.includes('job')) {
            tipoFinal = 'trabalho';
          } else if (tipoNormalizado.includes('educacao') || tipoNormalizado.includes('education') || tipoNormalizado.includes('escola') || tipoNormalizado.includes('university')) {
            tipoFinal = 'educacao';
          } else if (tipoNormalizado.includes('projeto') || tipoNormalizado.includes('project')) {
            tipoFinal = 'projeto';
          } else if (tipoNormalizado.includes('certificacao') || tipoNormalizado.includes('certification') || tipoNormalizado.includes('certificate')) {
            tipoFinal = 'certificacao';
          }

          // Converter data para formato ISO
          let dataFormatada = '';
          if (data) {
            try {
              const dateObj = new Date(data);
              if (!isNaN(dateObj.getTime())) {
                dataFormatada = dateObj.toISOString().split('T')[0];
              } else {
                dataFormatada = new Date().toISOString().split('T')[0];
              }
            } catch {
              dataFormatada = new Date().toISOString().split('T')[0];
            }
          }

          return {
            id: `imported-${Date.now()}-${index}`,
            data: dataFormatada,
            item: item.toString(),
            tipo: tipoFinal,
            observacoes: observacoes.toString()
          };
        }).filter(item => item.item); // Filtrar apenas itens com título

        if (timelineItems.length > 0) {
          onDataImport(timelineItems);
          toast({
            title: "Arquivo importado com sucesso!",
            description: `${timelineItems.length} itens foram adicionados ao timeline.`,
          });
        } else {
          toast({
            title: "Nenhum item encontrado",
            description: "Verifique se o arquivo possui as colunas: Data, Item, Tipo, Observações",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        toast({
          title: "Erro ao processar arquivo",
          description: "Verifique se o arquivo está no formato correto (Excel).",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
    
    // Limpar o input para permitir upload do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        onClick={triggerFileInput}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Importar Excel
      </Button>
      <div className="text-xs text-muted-foreground">
        <FileSpreadsheet className="w-3 h-3 inline mr-1" />
        .xlsx ou .xls
      </div>
    </div>
  );
};

export default ExcelUpload;
