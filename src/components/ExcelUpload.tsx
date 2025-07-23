
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

        console.log('Dados brutos do Excel:', jsonData);

        const timelineItems: TimelineItem[] = jsonData.map((row: any, index) => {
          console.log('Processando linha:', row);
          
          // Mapear colunas possíveis (português e inglês) - case insensitive
          const keys = Object.keys(row);
          
          const dataKey = keys.find(key => 
            key.toLowerCase().includes('data') || 
            key.toLowerCase().includes('date')
          );
          
          const itemKey = keys.find(key => 
            key.toLowerCase().includes('item') || 
            key.toLowerCase().includes('título') || 
            key.toLowerCase().includes('titulo') || 
            key.toLowerCase().includes('title') ||
            key.toLowerCase().includes('nome') ||
            key.toLowerCase().includes('name')
          );
          
          const tipoKey = keys.find(key => 
            key.toLowerCase().includes('tipo') || 
            key.toLowerCase().includes('type') ||
            key.toLowerCase().includes('categoria') ||
            key.toLowerCase().includes('category')
          );
          
          const observacoesKey = keys.find(key => 
            key.toLowerCase().includes('observaç') || 
            key.toLowerCase().includes('observac') || 
            key.toLowerCase().includes('notes') || 
            key.toLowerCase().includes('note') ||
            key.toLowerCase().includes('descrição') ||
            key.toLowerCase().includes('descricao') ||
            key.toLowerCase().includes('description')
          );

          const data = dataKey ? row[dataKey] : '';
          const item = itemKey ? row[itemKey] : '';
          const tipo = tipoKey ? row[tipoKey] : '';
          const observacoes = observacoesKey ? row[observacoesKey] : '';

          console.log('Valores extraídos:', { data, item, tipo, observacoes });

          // Normalizar tipo de forma mais precisa
          const tipoNormalizado = String(tipo).toLowerCase().trim();
          let tipoFinal: 'trabalho' | 'educacao' | 'projeto' | 'certificacao' | 'outro' = 'outro';
          
          if (tipoNormalizado.includes('trabalho') || 
              tipoNormalizado.includes('work') || 
              tipoNormalizado.includes('job') ||
              tipoNormalizado.includes('experiência') ||
              tipoNormalizado.includes('experiencia') ||
              tipoNormalizado.includes('experience') ||
              tipoNormalizado.includes('profissional')) {
            tipoFinal = 'trabalho';
          } else if (tipoNormalizado.includes('educacao') || 
                     tipoNormalizado.includes('educação') ||
                     tipoNormalizado.includes('education') || 
                     tipoNormalizado.includes('escola') || 
                     tipoNormalizado.includes('university') ||
                     tipoNormalizado.includes('universidade') ||
                     tipoNormalizado.includes('formação') ||
                     tipoNormalizado.includes('formacao') ||
                     tipoNormalizado.includes('acadêmica') ||
                     tipoNormalizado.includes('academica')) {
            tipoFinal = 'educacao';
          } else if (tipoNormalizado.includes('projeto') || 
                     tipoNormalizado.includes('project') ||
                     tipoNormalizado.includes('realização') ||
                     tipoNormalizado.includes('realizacao')) {
            tipoFinal = 'projeto';
          } else if (tipoNormalizado.includes('certificacao') || 
                     tipoNormalizado.includes('certificação') ||
                     tipoNormalizado.includes('certification') || 
                     tipoNormalizado.includes('certificate') ||
                     tipoNormalizado.includes('certific')) {
            tipoFinal = 'certificacao';
          }

          console.log('Tipo normalizado:', tipoNormalizado, '-> Tipo final:', tipoFinal);

          // Converter data do Excel para formato ISO
          let dataFormatada = '';
          if (data) {
            try {
              // Se for um número (data do Excel)
              if (typeof data === 'number') {
                // Excel usa dias desde 1/1/1900
                const excelDate = new Date((data - 25569) * 86400 * 1000);
                dataFormatada = excelDate.toISOString().split('T')[0];
              } else {
                // Se for string, tentar converter
                const dateObj = new Date(data);
                if (!isNaN(dateObj.getTime())) {
                  dataFormatada = dateObj.toISOString().split('T')[0];
                } else {
                  // Tentar formatos brasileiros dd/mm/yyyy
                  const parts = String(data).split('/');
                  if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Mês começa em 0
                    const year = parseInt(parts[2]);
                    const brDate = new Date(year, month, day);
                    if (!isNaN(brDate.getTime())) {
                      dataFormatada = brDate.toISOString().split('T')[0];
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Erro ao converter data:', error);
              dataFormatada = new Date().toISOString().split('T')[0];
            }
          }

          if (!dataFormatada) {
            dataFormatada = new Date().toISOString().split('T')[0];
          }

          console.log('Data formatada:', dataFormatada);

          return {
            id: `imported-${Date.now()}-${index}`,
            data: dataFormatada,
            item: String(item),
            tipo: tipoFinal,
            observacoes: String(observacoes)
          };
        }).filter(item => item.item && item.item.trim() !== ''); // Filtrar apenas itens com título

        console.log('Itens finais:', timelineItems);

        if (timelineItems.length > 0) {
          onDataImport(timelineItems);
          toast({
            title: "Arquivo importado com sucesso!",
            description: `${timelineItems.length} itens foram adicionados ao timeline.`,
          });
        } else {
          toast({
            title: "Nenhum item encontrado",
            description: "Verifique se o arquivo possui as colunas necessárias com dados válidos",
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        onClick={triggerFileInput}
        className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
        size="icon"
      >
        <Upload className="w-5 h-5" />
      </Button>
    </>
  );
};

export default ExcelUpload;
