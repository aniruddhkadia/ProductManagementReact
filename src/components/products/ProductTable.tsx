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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  Star,
  ArrowUpDown,
} from "lucide-react";
import type { Product } from "@/types";
import { useState, useMemo } from "react";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
}

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

export function ProductTable({
  products,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
}: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [products, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-md px-4">
          <span className="text-sm font-medium">
            {selectedIds.length} products selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onBulkDelete(selectedIds);
              setSelectedIds([]);
            }}
          >
            Bulk Delete
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
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
              <TableHead>Brand</TableHead>
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
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-10 h-10 rounded-md object-cover border border-border"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">₹{product.price}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      product.stock < 10
                        ? "text-destructive font-bold"
                        : "text-muted-foreground"
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>{product.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(product)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
