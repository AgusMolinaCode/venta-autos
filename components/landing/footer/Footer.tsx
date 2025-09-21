import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Bs.As Cars</h3>
            <p className="text-gray-400">
              Tu socio confiable para encontrar el auto usado perfecto con
              calidad garantizada.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Av. Principal 123, Ciudad</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ info@autoselect.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Horario</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Lun-Vie: 9:00 AM - 7:00 PM</li>
              <li>Sáb: 10:00 AM - 5:00 PM</li>
              <li>Dom: Cerrado</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bs.As Cars. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
