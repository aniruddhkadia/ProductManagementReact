import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUsers } from "@/hooks/use-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserDetailModal } from "@/components/users/UserDetailModal";
import { useUIStore } from "@/stores/uiStore";
import type { User } from "@/types/user.types";
import { cn } from "@/lib/utils";

export default function UserListPage() {
  const { tableDensity } = useUIStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  const { data, isLoading } = useUsers({ limit, skip, search });

  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("search", value);
      else prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  return (
    <div className=" max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email..."
                className="pl-9"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(limit)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full bg-muted animate-pulse",
                          tableDensity === "compact" && "h-8 w-8",
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-48 bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-muted animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-8 ml-auto bg-muted animate-pulse rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground italic"
                  >
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                data?.users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      <Avatar
                        className={cn(
                          "h-10 w-10 border",
                          tableDensity === "compact" && "h-8 w-8",
                        )}
                      >
                        <AvatarImage src={user.image} alt={user.firstName} />
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      <span className="font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      {user.phone}
                    </TableCell>
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {user.company?.name || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {user.company?.title || "Staff"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      <span className="text-sm font-medium">
                        {user.address?.city || "Remote"}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right",
                        tableDensity === "compact" && "py-2",
                        tableDensity === "spacious" && "py-6",
                      )}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedUser(user)}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{skip + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(skip + limit, total)}
                </span>{" "}
                of <span className="font-medium">{total}</span> users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
