
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, X, Filter } from 'lucide-react';
import { tipoOptions } from '../types/timeline';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar e Filtrar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, observações..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filtro por tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar por tipo
            </label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tipoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Indicador de resultados e limpar filtros */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {searchTerm && (
                  <span>Buscando por "<strong>{searchTerm}</strong>"</span>
                )}
                {searchTerm && selectedType !== 'all' && <span> • </span>}
                {selectedType !== 'all' && (
                  <span>Tipo: <strong>{tipoOptions.find(t => t.value === selectedType)?.label}</strong></span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
