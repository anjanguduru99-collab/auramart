import React from 'react';
import { 
  Grid, Cpu, Shirt, Home, Gamepad2, Dumbbell, BookOpen, Sparkles 
} from 'lucide-react';

const CATEGORY_ICONS = {
  all: Grid,
  electronics: Cpu,
  fashion: Shirt,
  home: Home,
  gaming: Gamepad2,
  fitness: Dumbbell,
  books: BookOpen
};

export default function CategoryBar({ categories = [], activeCategory = 'all', onSelectCategory }) {
  const allCategories = [
    { id: 'all', name: 'All Products', count: '100+' },
    ...categories
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-none">
      <div className="flex items-center justify-start md:justify-center gap-3 min-w-max px-2">
        {allCategories.map(cat => {
          const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-105' 
                  : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:text-indigo-500 hover:scale-102'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-500'}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span>{cat.name}</span>
              {cat.count && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
