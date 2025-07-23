
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import ExcelUpload from './ExcelUpload';
import { TimelineItem } from '../types/timeline';

interface HeaderProps {
  onDataImport?: (items: TimelineItem[]) => void;
}

const Header: React.FC<HeaderProps> = ({ onDataImport }) => {
  return (
    <header className="text-center py-12 mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Timeline Profissional
        </h1>
      </div>
      
      <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
        Organize sua trajetória profissional de forma visual e interativa
      </p>

      {onDataImport && (
        <div className="flex justify-center">
          <ExcelUpload onDataImport={onDataImport} />
        </div>
      )}
    </header>
  );
};

export default Header;
