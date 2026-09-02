import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { GensetProduct } from '../types';

interface SearchableProductSelectProps {
  products: GensetProduct[];
  selectedId: string;
  onSelect: (product: GensetProduct) => void;
  className?: string;
}

export const SearchableProductSelect: React.FC<SearchableProductSelectProps> = ({
  products,
  selectedId,
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'genset' | 'ac' | 'paket'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected product
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedId) || products[0];
  }, [products, selectedId]);

  // Filter products based on search query and category tabs
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter(product => {
      // Category tab filter
      if (activeFilter === 'genset') {
        if (product.category === 'ac' || product.category === 'paket') return false;
      } else if (activeFilter === 'ac') {
        if (product.category !== 'ac') return false;
      } else if (activeFilter === 'paket') {
        if (product.category !== 'paket') return false;
      }

      // Search keyword filter
      if (!query) return true;

      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.engineBrand.toLowerCase().includes(query);
      const tagMatch = product.tag ? product.tag.toLowerCase().includes(query) : false;
      const kvaMatch = product.kva ? product.kva.toString().includes(query) || `${product.kva}kva`.includes(query) || `${product.kva} kva`.includes(query) : false;
      const kwMatch = product.kw ? product.kw.toString().includes(query) || `${product.kw}kw`.includes(query) : false;
      const pkMatch = product.pk ? product.pk.toString().includes(query) || `${product.pk}pk`.includes(query) || `${product.pk} pk`.includes(query) : false;
      const catLabelMatch = product.categoryLabel.toLowerCase().includes(query);
      const idealMatch = product.idealFor.some(item => item.toLowerCase().includes(query));

      return nameMatch || brandMatch || tagMatch || kvaMatch || kwMatch || pkMatch || catLabelMatch || idealMatch;
    });
  }, [products, searchQuery, activeFilter]);

  // Group filtered products
  const groupedProducts = useMemo(() => {
    const gensets = filteredProducts.filter(p => p.category !== 'ac' && p.category !== 'paket');
    const acs = filteredProducts.filter(p => p.category === 'ac');
    const pakets = filteredProducts.filter(p => p.category === 'paket');

    return { gensets, acs, pakets };
  }, [filteredProducts]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelectProduct = (product: GensetProduct) => {
    onSelect(product);
    setIsOpen(false);
  };

  const renderProductItem = (product: GensetProduct) => {
    const isSelected = product.id === selectedId;
    return (
      <button
        key={product.id}
        type="button"
        onClick={() => handleSelectProduct(product)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${isSelected
          ? 'bg-amber-50 dark:bg-amber-950/40 text-slate-900 dark:text-white'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
          }`}
      >
        <div className="min-w-0 flex-1">
          <div className={`text-xs sm:text-sm truncate ${isSelected ? 'font-bold text-amber-950 dark:text-amber-200' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
            {product.name}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
            {product.startingPriceEstimate}
          </div>
        </div>

        {isSelected && (
          <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 stroke-[2.5]" />
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button displaying current selected unit - Clean Name & Price Only */}
      <button
        type="button"
        id="searchable-product-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer bg-white dark:bg-slate-800 ${isOpen
          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 shadow-2xs'
          }`}
      >
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {selectedProduct?.name || 'Pilih Unit / Paket'}
          </div>
          {selectedProduct?.startingPriceEstimate && (
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
              {selectedProduct.startingPriceEstimate}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
        </div>
      </button>

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ maxHeight: '440px' }}
        >
          {/* Search Header Bar */}
          <div className="p-3 bg-slate-50/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari unit atau paket sewa..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
              {[
                { id: 'all', label: 'Semua Unit' },
                { id: 'genset', label: 'Genset Silent' },
                { id: 'ac', label: 'AC Standing' },
                { id: 'paket', label: 'Paket Wedding' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${activeFilter === f.id
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Products (Scrollable) */}
          <div className="overflow-y-auto max-h-[310px] p-2 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <SlidersHorizontal className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Tidak ada unit yang cocok dengan "{searchQuery}"</p>
                <p className="text-[11px] text-slate-400">Coba gunakan kata kunci kVA (misal 20, 60, 100), AC 5 PK, atau Paket Wedding.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 mt-2 cursor-pointer inline-block"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* Group 1: Genset Silent */}
            {groupedProducts.gensets.length > 0 && (
              <div className="pt-2 first:pt-0 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Genset Silent ({groupedProducts.gensets.length})
                </div>
                {groupedProducts.gensets.map(renderProductItem)}
              </div>
            )}

            {/* Group 2: AC Standing & Pendingin Acara */}
            {groupedProducts.acs.length > 0 && (
              <div className="pt-2 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  AC Standing & Pendingin Acara ({groupedProducts.acs.length})
                </div>
                {groupedProducts.acs.map(renderProductItem)}
              </div>
            )}

            {/* Group 3: Paket Wedding */}
            {groupedProducts.pakets.length > 0 && (
              <div className="pt-2 space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Paket Wedding ({groupedProducts.pakets.length})
                </div>
                {groupedProducts.pakets.map(renderProductItem)}
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
