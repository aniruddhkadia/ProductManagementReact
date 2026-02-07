import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCategories } from "@/hooks/use-products";
import type { Category } from "@/types/product.types";

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
      <div className="relative w-full sm:w-64">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search products..."
          value={localSearch}
          onChange={handleSearchChange}
          className="pl-10 h-10"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={category || "all"}
          onValueChange={(val: string) =>
            onCategoryChange(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-full sm:w-48 capitalize">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat: Category) => (
              <SelectItem
                key={cat.slug}
                value={cat.slug}
                className="capitalize"
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
