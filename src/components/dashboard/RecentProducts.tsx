import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ExternalLink, Star } from "lucide-react";
import type { Product } from "@/types";

interface RecentProductsProps {
  products: Product[];
  loading: boolean;
}

export function RecentProducts({ products, loading }: RecentProductsProps) {
  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded mb-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>
            Latest 5 products added to the inventory
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/products" className="flex items-center gap-2">
            View All <ExternalLink size={16} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>
                  <span
                    className={
                      product.stock < 10
                        ? "text-red-500 font-bold"
                        : "text-green-600"
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>{product.rating}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
