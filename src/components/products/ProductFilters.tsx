import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCategories } from "@/hooks/useProducts";
// Simple debounce implementation below

interface ProductFiltersProps {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: ProductFiltersProps) {
  const { data: categories } = useCategories();
  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search update
  const debouncedSearchChange = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 300),
    [onSearchChange],
  );

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearchChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search products..."
          value={localSearch}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center">
              <Filter size={16} />
              {category || "All Categories"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onCategoryChange("")}>
              All Categories
            </DropdownMenuItem>
            {categories?.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className="capitalize"
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(search || category) && (
          <Button variant="ghost" size="icon" onClick={onClearFilters}>
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

// Simple debounce implementation in case lodash is not available
function debounce(func: Function, wait: number) {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
