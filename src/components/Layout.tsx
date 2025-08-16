import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/search", icon: Search, label: "Buscar" },
  { href: "/announce", icon: PlusSquare, label: "Anunciar" },
  { href: "/notifications", icon: Bell, label: "Notificações" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
          <h1 className="text-xl font-bold text-center">{title}</h1>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white dark:bg-black border-t">
          <nav className="flex justify-around items-center p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center p-2 transition-colors",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className={cn(
                  "text-xs",
                  location.pathname === item.href ? "font-medium" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
};