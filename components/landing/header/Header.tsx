import React from 'react';
import { ModeToggle } from '@/components/ui/ModeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-800">AutoSelect</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-800">Inicio</a>
          <a href="#" className="text-gray-600 hover:text-blue-800">Inventario</a>
          <a href="#" className="text-gray-600 hover:text-blue-800">Servicios</a>
          <a href="#" className="text-gray-600 hover:text-blue-800">Financiamiento</a>
          <a href="#" className="text-gray-600 hover:text-blue-800">Contacto</a>
        </nav>
        <button className="md:hidden text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;