
import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, X, Filter } from 'lucide-react';
import { tipoOptions } from '../types/timeline';

interface TimelineFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, observações..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 transition-all duration-200 focus:bg-background/80"
          />
        </div>
        
        {/* Filtro por tipo */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="bg-background/50 transition-all duration-200">
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
        
        {/* Limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
      
      {/* Indicador de resultados */}
      {(searchTerm || selectedType !== 'all') && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            {searchTerm && (
              <span>Buscando por "<strong>{searchTerm}</strong>"</span>
            )}
            {searchTerm && selectedType !== 'all' && <span> • </span>}
            {selectedType !== 'all' && (
              <span>Tipo: <strong>{tipoOptions.find(t => t.value === selectedType)?.label}</strong></span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineFilters;
