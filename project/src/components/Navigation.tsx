interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const pages = [
    { id: 'home', label: 'Accueil' },
    { id: 'products', label: 'Produits & Commande' },
    { id: 'tracking', label: 'Suivi' },
    { id: 'statistics', label: 'Statistiques' },
  ];

  return (
    <nav className="bg-[#3C1D0E] text-[#FDFDFD] py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-[#D38A00]">
          Raven Slaughterhouse
        </div>
        <div className="flex gap-6">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === page.id
                  ? 'bg-[#D38A00] text-[#000000] font-semibold'
                  : 'hover:bg-[#D38A00] hover:text-[#000000]'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
