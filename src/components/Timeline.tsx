
import React, { useEffect, useRef } from 'react';
import { TimelineItem } from '../types/timeline';
import { Calendar, Briefcase, GraduationCap, Code, Award, Star, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface TimelineProps {
  items: TimelineItem[];
  onDeleteItem: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ items, onDeleteItem }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    timelineItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [items]);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'trabalho': return <Briefcase className="w-3 h-3" />;
      case 'educacao': return <GraduationCap className="w-3 h-3" />;
      case 'projeto': return <Code className="w-3 h-3" />;
      case 'certificacao': return <Award className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const sortedItems = [...items].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="relative max-w-3xl mx-auto px-4" ref={timelineRef}>
      {/* Linha principal do timeline */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 timeline-line h-full"></div>
      
      {sortedItems.map((item, index) => (
        <div key={item.id} className={`timeline-item relative mb-3 ${index % 2 === 0 ? 'pr-5 text-right' : 'pl-5 text-left'}`}>
          {/* Dot do timeline */}
          <div className={`absolute top-2 ${index % 2 === 0 ? 'right-0' : 'left-0'} transform ${index % 2 === 0 ? 'translate-x-1/2' : '-translate-x-1/2'} timeline-dot flex items-center justify-center text-primary`}>
            {getIcon(item.tipo)}
          </div>
          
          {/* Card do item */}
          <div className={`timeline-card group relative ${index % 2 === 0 ? 'mr-5' : 'ml-5'} type-${item.tipo}`}>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 ${index % 2 === 0 ? 'left-2' : 'right-2'} h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-destructive/10 hover:bg-destructive/20 text-destructive`}
              onClick={() => onDeleteItem(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Coluna 1: Data e Tipo */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getIcon(item.tipo)}
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                    {item.tipo}
                  </span>
                </div>
              </div>
              
              {/* Coluna 2: Título e Observações */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground leading-tight">{item.item}</h3>
                {item.observacoes && (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.observacoes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
