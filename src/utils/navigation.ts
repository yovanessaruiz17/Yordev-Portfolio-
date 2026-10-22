/**
 * Utilidades de navegación y desplazamiento suave sin exponer los IDs en la URL
 */

export const cleanUrlHash = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }
};

export const scrollToSection = (sectionId: string, customOffset = 80) => {
  if (typeof window === 'undefined') return;

  // Limpiar cualquier hash existente en la URL de inmediato
  cleanUrlHash();

  if (!sectionId || sectionId === 'inicio') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  // Quitar el caracter '#' si viene incluido
  const cleanId = sectionId.startsWith('#') ? sectionId.slice(1) : sectionId;
  const element = document.getElementById(cleanId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - customOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  // Asegurar que tras el scroll ningún navegador añada el hash
  cleanUrlHash();
};
