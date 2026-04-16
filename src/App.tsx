import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toaster";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthContext";
import Index from "@/features/landing/Index";
import ShuttleSearch from "@/features/shuttle/ShuttleSearch";
import ShuttleDetail from "@/features/shuttle/ShuttleDetail";
import RideSearch from "@/features/ride/RideSearch";
import RideBook from "@/features/ride/RideBook";
import RideStatus from "@/features/ride/RideStatus";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Orders from "@/features/orders/Orders";
import Help from "@/features/help/Help";
import NotFound from "@/shared/components/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shuttle" element={<ShuttleSearch />} />
            <Route path="/shuttle/:id" element={<ShuttleDetail />} />
            <Route path="/ride" element={<RideSearch />} />
            <Route path="/ride/book" element={<RideBook />} />
            <Route path="/ride/status/:id" element={<RideStatus />} />
            <Route path="/login" element={<Login />} />
            <Route path="/daftar" element={<Register />} />
            <Route path="/pesanan" element={<Orders />} />
            <Route path="/bantuan" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
