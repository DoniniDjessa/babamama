import { create } from 'zustand';

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  inStockAbidjan: boolean;
  priceRange: [number, number];
  sortBy: SortOption;
  selectedSubcategories: string[];
  priceChip?: string; // Quick price chip selection
}

interface FilterActions {
  toggleStock: () => void;
  setPriceRange: (range: [number, number]) => void;
  setSort: (sort: SortOption) => void;
  setPriceChip: (chip: string | undefined) => void;
  toggleSubcategory: (subcategory: string) => void;
  reset: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

interface FilterStore extends FilterState, FilterActions {
  // Computed
  getActiveFiltersCount: () => number;
}

const defaultFilters: FilterState = {
  inStockAbidjan: false,
  priceRange: [1000, 100000],
  sortBy: 'popular',
  selectedSubcategories: [],
  priceChip: undefined,
};

export const useProductFilters = create<FilterStore>((set, get) => ({
  ...defaultFilters,

  toggleStock: () => set((state) => ({ inStockAbidjan: !state.inStockAbidjan })),

  setPriceRange: (range) => set({ priceRange: range, priceChip: undefined }),

  setSort: (sort) => set({ sortBy: sort }),

  setPriceChip: (chip) => {
    const priceRanges: Record<string, [number, number]> = {
      'under-5k': [1000, 5000],
      '5k-15k': [5000, 15000],
      '15k-50k': [15000, 50000],
      'premium': [50000, 1000000],
    };
    
    if (chip && priceRanges[chip]) {
      set({ priceChip: chip, priceRange: priceRanges[chip] });
    } else {
      set({ priceChip: undefined });
    }
  },

  toggleSubcategory: (subcategory) =>
    set((state) => {
      const isSelected = state.selectedSubcategories.includes(subcategory);
      return {
        selectedSubcategories: isSelected
          ? state.selectedSubcategories.filter((s) => s !== subcategory)
          : [...state.selectedSubcategories, subcategory],
      };
    }),

  reset: () => set(defaultFilters),

  setFilters: (filters) => set((state) => ({ ...state, ...filters })),

  getActiveFiltersCount: () => {
    const state = get();
    let count = 0;
    if (state.inStockAbidjan) count++;
    if (state.selectedSubcategories.length > 0) count++;
    if (state.priceChip || state.priceRange[0] !== defaultFilters.priceRange[0] || 
        state.priceRange[1] !== defaultFilters.priceRange[1]) count++;
    return count;
  },
}));

