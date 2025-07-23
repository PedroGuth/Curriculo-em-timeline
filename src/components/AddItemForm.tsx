import React, { useState } from 'react';
import { TimelineItem, tipoOptions } from '../types/timeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, FileText, Tag, MessageSquare, Upload, Search } from 'lucide-react';
import ExcelUpload from './ExcelUpload';
import SearchModal from './SearchModal';

interface AddItemFormProps {
  onAddItem: (item: Omit<TimelineItem, 'id'>) => void;
  onDataImport: (items: TimelineItem[]) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onAddItem, 
  onDataImport,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHoverOptions, setShowHoverOptions] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    data: '',
    item: '',
    tipo: '' as TimelineItem['tipo'],
    observacoes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.data && formData.item && formData.tipo) {
      onAddItem(formData);
      setFormData({ data: '', item: '', tipo: '' as TimelineItem['tipo'], observacoes: '' });
      setIsOpen(false);
    }
  };

  const handlePlusClick = () => {
    if (showHoverOptions) {
      setShowHoverOptions(false);
    } else {
      setShowHoverOptions(true);
    }
  };

  if (!isOpen && !showHoverOptions) {
    return (
      <>
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handlePlusClick}
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl"
            size="icon"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>
        
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </>
    );
  }

  if (showHoverOptions) {
    return (
      <>
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex flex-col items-end gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-lg shadow-sm">
                Buscar
              </span>
              <Button
                onClick={() => {
                  setShowHoverOptions(false);
                  setIsSearchModalOpen(true);
                }}
                className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
                size="icon"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-lg shadow-sm">
                Importar Excel
              </span>
              <ExcelUpload onDataImport={onDataImport} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-lg shadow-sm">
                Adicionar Item
              </span>
              <Button
                onClick={() => {
                  setShowHoverOptions(false);
                  setIsOpen(true);
                }}
                className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
                size="icon"
              >
                <FileText className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handlePlusClick}
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl rotate-45"
            size="icon"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>
        
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md timeline-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Item ao Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Item
                </label>
                <Input
                  placeholder="Ex: Desenvolvedor Frontend na Empresa X"
                  value={formData.item}
                  onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tipo
                </label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as TimelineItem['tipo'] }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Observações
                </label>
                <Textarea
                  placeholder="Detalhes adicionais sobre este item..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="bg-background/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Adicionar
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </>
  );
};

export default AddItemForm;
