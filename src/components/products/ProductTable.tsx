import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, ArrowUpDown, Edit, Trash, Ellipsis, Eye } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import type { Product } from "@/types/product.types";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

export function ProductTable({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { tableDensity } = useUIStore();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return products;

    return [...products].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const densityPadding = cn(
    tableDensity === "compact" && "py-2",
    tableDensity === "normal" && "py-4",
    tableDensity === "spacious" && "py-6",
  );

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead
              onClick={() => handleSort("title")}
              className="cursor-pointer hover:text-foreground group"
            >
              <div className="flex items-center gap-1">
                Title{" "}
                <ArrowUpDown
                  size={14}
                  className="opacity-0 group-hover:opacity-100"
                />
              </div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead
              onClick={() => handleSort("price")}
              className="cursor-pointer hover:text-foreground group text-right"
            >
              <div className="flex items-center justify-end gap-1">
                Price{" "}
                <ArrowUpDown
                  size={14}
                  className="opacity-0 group-hover:opacity-100"
                />
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("stock")}
              className="cursor-pointer hover:text-foreground group text-right"
            >
              <div className="flex items-center justify-end gap-1">
                Stock{" "}
                <ArrowUpDown
                  size={14}
                  className="opacity-0 group-hover:opacity-100"
                />
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("rating")}
              className="cursor-pointer hover:text-foreground group text-right"
            >
              <div className="flex items-center justify-end gap-1">
                Rating{" "}
                <ArrowUpDown
                  size={14}
                  className="opacity-0 group-hover:opacity-100"
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j} className={densityPadding}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground italic"
              >
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className={densityPadding}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-10 h-10 rounded-md object-cover border"
                  />
                </TableCell>
                <TableCell className={cn("font-medium", densityPadding)}>
                  {product.title}
                </TableCell>
                <TableCell className={densityPadding}>
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className={cn("text-right", densityPadding)}>
                  ₹{Number(product.price).toFixed(2)}
                </TableCell>
                <TableCell className={cn("text-right", densityPadding)}>
                  <span
                    className={
                      product.stock < 10
                        ? "text-red-500 font-bold"
                        : "text-green-600 font-medium"
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className={cn("text-right", densityPadding)}>
                  <div className="flex items-center justify-end gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>{product.rating}</span>
                  </div>
                </TableCell>
                <TableCell className={cn("text-right", densityPadding)}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Ellipsis size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(product)}>
                        <Eye size={14} className="mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit size={14} className="mr-2" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash size={14} className="mr-2" /> Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
