
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import TimelineFilters from '../components/TimelineFilters';
import AddItemForm from '../components/AddItemForm';
import { TimelineItem } from '../types/timeline';
import { Toaster } from '../components/ui/toaster';
import { useToast } from '../components/ui/use-toast';

const Index = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { toast } = useToast();

  // Dados iniciais de exemplo
  useEffect(() => {
    const initialItems: TimelineItem[] = [
      {
        id: '1',
        data: '2024-01-15',
        item: 'Desenvolvedor Full Stack na TechCorp',
        tipo: 'trabalho',
        observacoes: 'Desenvolvimento de aplicações web com React, Node.js e PostgreSQL. Liderança de equipe de 3 desenvolvedores.'
      },
      {
        id: '2',
        data: '2023-08-20',
        item: 'Certificação AWS Solutions Architect',
        tipo: 'certificacao',
        observacoes: 'Certificação em arquitetura de soluções na nuvem AWS, focando em escalabilidade e segurança.'
      },
      {
        id: '3',
        data: '2023-03-10',
        item: 'MBA em Gestão de Projetos',
        tipo: 'educacao',
        observacoes: 'Pós-graduação focada em metodologias ágeis, gestão de equipes e entrega de projetos de tecnologia.'
      },
      {
        id: '4',
        data: '2022-11-05',
        item: 'E-commerce Platform',
        tipo: 'projeto',
        observacoes: 'Desenvolvimento completo de plataforma de e-commerce com React, Next.js e Stripe integration.'
      }
    ];
    setTimelineItems(initialItems);
  }, []);

  // Filtrar itens baseado na busca e tipo
  const filteredItems = useMemo(() => {
    return timelineItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.observacoes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || item.tipo === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [timelineItems, searchTerm, selectedType]);

  const handleAddItem = (newItem: Omit<TimelineItem, 'id'>) => {
    const item: TimelineItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setTimelineItems(prev => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setTimelineItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removido",
      description: "O item foi removido do timeline com sucesso.",
    });
  };

  const handleDataImport = (importedItems: TimelineItem[]) => {
    setTimelineItems(prev => [...importedItems, ...prev]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'all';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <Header />
        
        <main className="pb-20">
          <TimelineFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          
          {filteredItems.length > 0 ? (
            <Timeline items={filteredItems} onDeleteItem={handleDeleteItem} />
          ) : timelineItems.length > 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Nenhum item encontrado</h2>
              <p className="text-muted-foreground mb-6">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">Seu timeline está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Comece adicionando seus primeiros itens profissionais ou importe um arquivo Excel
              </p>
            </div>
          )}
        </main>
      </div>
      
      <AddItemForm onAddItem={handleAddItem} onDataImport={handleDataImport} />
      <Toaster />
    </div>
  );
};

export default Index;
