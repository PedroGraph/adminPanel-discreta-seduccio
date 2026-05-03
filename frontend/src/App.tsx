
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { Users } from "./pages/Users";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Inventory } from "./pages/Inventory";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import { Reviews } from "./pages/Reviews";
import { Coupons } from "./pages/Coupons";
import { Shipments } from "./pages/Shipments";
import { Support } from "./pages/Support";
import VirtualChat from "./pages/VirtualChat";
import { ChatHistory } from "./pages/ChatHistory";
import { ActivityLog } from "./pages/ActivityLog";
import { EmailTemplates } from "./pages/EmailTemplates";
import { Reports } from "./pages/Reports";
import { Categories } from "./pages/Categories";
import { Suppliers } from "./pages/Suppliers";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Auth } from "./pages/Auth";
import { UsersProvider } from "./components/users/UsersProvider";
import { ActivityProvider } from "./components/activity/ActivityProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ChatProvider } from "./context/ChatContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <ChatProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/"
                    element={
                      <UsersProvider>
                        <ActivityProvider>
                          <Layout />
                        </ActivityProvider>
                      </UsersProvider>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="returns" element={<Returns />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="shipments" element={<Shipments />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="support" element={<Support />} />
                    <Route path="virtual-chat" element={<VirtualChat />} />

                    <Route path="activity" element={<ActivityLog />} />
                    <Route path="email-templates" element={<EmailTemplates />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
