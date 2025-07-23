
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import AddItemForm from '../components/AddItemForm';
import { TimelineItem } from '../types/timeline';

const Index = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

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

  const handleAddItem = (newItem: Omit<TimelineItem, 'id'>) => {
    const item: TimelineItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setTimelineItems(prev => [item, ...prev]);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <Header />
        
        <main className="pb-20">
          {timelineItems.length > 0 ? (
            <Timeline items={timelineItems} />
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">Seu timeline está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Comece adicionando seus primeiros itens profissionais
              </p>
            </div>
          )}
        </main>
      </div>
      
      <AddItemForm onAddItem={handleAddItem} />
    </div>
  );
};

export default Index;
