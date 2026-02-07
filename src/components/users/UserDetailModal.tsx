import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, Briefcase } from "lucide-react";
import type { User } from "@/types/user.types";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-primary/5 p-8 border-b">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={user.image} alt={user.firstName} />
              <AvatarFallback className="text-2xl">
                {user.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </DialogTitle>
              <DialogDescription className="text-lg mt-1">
                @{user.username}
              </DialogDescription>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="capitalize">
                  {user.gender}
                </Badge>
                <Badge variant="outline">{user.age} years old</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contact Info
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Personal Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Born: {user.birthDate}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Company Info
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="italic text-xs">
                    Information limited in API
                  </span>
                </div>
              </div>
            </section>

            <section className="bg-muted/30 p-4 rounded-xl border border-border/50">
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">
                System Identity
              </h4>
              <p className="text-xs font-mono text-muted-foreground">
                Internal ID: {user.id}
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
