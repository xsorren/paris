import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'Paris Negocios Inmobiliarios';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    
    document.title = fullTitle;
    
    // También actualizar el favicon si es necesario
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = '/logoINMO.png';
    } else {
      // Crear el favicon si no existe
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = '/logoINMO.png';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
  }, [title]);
};

export default usePageTitle;
