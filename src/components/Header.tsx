
import React from 'react';
import { Clock, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative py-16 text-center fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Timeline
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transforme seu currículo em uma experiência visual interativa
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Seu percurso profissional em destaque</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
