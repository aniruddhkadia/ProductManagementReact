import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  Search,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/uiStore";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

import { useMediaQuery } from "@/hooks/use-media-query";

const AppLayout: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { sidebarExpanded, toggleSidebar, setSidebarExpanded } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setSidebarExpanded(false);
    }
  }, [isMobile, setSidebarExpanded]);

  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("sidebar-expanded", JSON.stringify(sidebarExpanded));
    }
  }, [sidebarExpanded, isDesktop]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentPath = location.pathname;
  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 flex overflow-hidden">
      {/* Sidebar - Desktop/Tablet */}
      {!isMobile && (
        <aside
          className={cn(
            "flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out z-30",
            sidebarExpanded ? "w-64" : "w-20",
          )}
        >
          <div className="h-16 flex items-center px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                <Package size={20} />
              </div>
              {sidebarExpanded && (
                <span className="font-bold text-lg tracking-tight truncate">
                  ProManager
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-accent-foreground",
                    )}
                  />
                  {sidebarExpanded && (
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                  )}
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-border">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <div className="flex flex-col h-full bg-background">
                  <div className="flex items-center justify-between p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                        <Package size={24} />
                      </div>
                      <span className="font-bold text-xl tracking-tight">
                        ProManager
                      </span>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-2 px-4">
                    {navItems.map((item) => {
                      const isActive = currentPath === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <item.icon size={22} />
                          <span className="font-semibold">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="p-4 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <LogOut size={22} />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex text-muted-foreground"
            >
              {sidebarExpanded ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </Button>

            <div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground truncate">
              <span className="hover:text-foreground cursor-pointer">App</span>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <span className="mx-2">/</span>
                  <span
                    className={cn(
                      i === breadcrumbs.length - 1
                        ? "text-gray-900 dark:text-white capitalize"
                        : "hover:text-gray-900 dark:hover:text-white cursor-pointer capitalize",
                    )}
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
              {breadcrumbs.length === 0 && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 dark:text-white capitalize">
                    Dashboard
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search anything..."
                className="bg-gray-100 dark:bg-white/5 border-transparent focus-visible:ring-blue-500/50 pl-10 w-64 shadow-none"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-2 cursor-pointer outline-none">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Administrator
                    </p>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                      {user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
    </div>
  );
};

export default AppLayout;
