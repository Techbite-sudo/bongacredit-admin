import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3, Box, CreditCard, LayoutDashboard, LogOut, Menu, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: CreditCard, label: "Transactions", href: "/transactions" },
    { icon: Box, label: "Products", href: "/products" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex font-mono">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transition-transform duration-300 ease-in-out border-r-4 border-black",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-white">
              <span className="font-bold text-black text-xl">B</span>
            </div>
            <span className="font-bold text-xl tracking-tighter">BONGA<span className="text-primary">CREDIT</span></span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-2 border-transparent hover:border-white/50 hover:bg-white/10",
                    isActive && "bg-primary text-black border-primary font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white hover:bg-red-600 hover:text-white border-2 border-transparent hover:border-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="uppercase tracking-wider">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-black flex items-center justify-between px-6 sticky top-0 z-40">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-sm font-bold border-2 border-black">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
            <div className="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
