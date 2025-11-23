
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  RotateCcw,
  Star,
  Ticket,
  Truck,
  FileText,
  Settings,
  BarChart3,
  FolderOpen,
  Warehouse,
  MessageCircle,
  Activity,
  Mail,
  Users2,
  ChevronRight,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "dashboard", path: "/" },
  { icon: BarChart3, label: "analytics", path: "/analytics" },
  { icon: Users, label: "users", path: "/users" },
  { icon: Package, label: "products", path: "/products" },
  { icon: FolderOpen, label: "categories", path: "/categories" },
  { icon: Warehouse, label: "inventory", path: "/inventory" },
  { icon: ShoppingCart, label: "orders", path: "/orders" },
  { icon: RotateCcw, label: "returns", path: "/returns" },
  { icon: Star, label: "reviews", path: "/reviews" },
  { icon: Ticket, label: "coupons", path: "/coupons" },
  { icon: Truck, label: "shipments", path: "/shipments" },
  { icon: Users2, label: "suppliers", path: "/suppliers" },
  { icon: MessageCircle, label: "support", path: "/support" },
  { icon: MessageSquare, label: "virtual_chat", path: "/virtual-chat" },
  { icon: Activity, label: "activity_log", path: "/activity" },
  { icon: Mail, label: "email_templates", path: "/email-templates" },
  { icon: FileText, label: "reports", path: "/reports" },
  { icon: Settings, label: "settings", path: "/settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const t = useI18n();

  return (
    <div className={cn(
      "flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out border-r border-gray-700",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            EcommercePro
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-200",
            isCollapsed ? "rotate-0" : "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 hover:bg-gray-800",
                isActive ? "bg-purple-700 text-white shadow-lg" : "text-gray-300 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{t(item.label as any)}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
