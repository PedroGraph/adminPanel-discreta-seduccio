
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCoupons, getCouponsStats, deleteCoupon, type Coupon, type CouponStats } from "@/services/coupons.service";

interface CouponsContextType {
  coupons: Coupon[];
  stats: CouponStats;
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  selectedCoupon: Coupon | null;
  isDetailModalOpen: boolean;
  loading: boolean;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: string) => void;
  setTypeFilter: (filter: string) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  fetchCoupons: () => Promise<void>;
  handleViewDetails: (coupon: Coupon) => void;
  handleEdit: (coupon: Coupon) => void;
  handleDelete: (id: string) => Promise<void>;
}

const CouponsContext = createContext<CouponsContextType | undefined>(undefined);

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error("useCoupons must be used within a CouponsProvider");
  }
  return context;
};

interface CouponsProviderProps {
  children: ReactNode;
}

export const CouponsProvider = ({ children }: CouponsProviderProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats>({
    total: 0,
    active: 0,
    inactive: 0,
    expired: 0,
    totalUsage: 0,
    totalSavings: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const result = await getCoupons({ search: searchTerm, status: statusFilter, type: typeFilter });
      const statsResult = await getCouponsStats();

      setCoupons(result.coupons);
      setStats(statsResult);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los cupones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    toast({
      title: "Función en desarrollo",
      description: "La funcionalidad de edición estará disponible pronto"
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);

      toast({
        title: "Éxito",
        description: "Cupón eliminado correctamente"
      });

      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cupón",
        variant: "destructive"
      });
    }
  };

  const value: CouponsContextType = {
    coupons,
    stats,
    searchTerm,
    statusFilter,
    typeFilter,
    selectedCoupon,
    isDetailModalOpen,
    loading,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setSelectedCoupon,
    setIsDetailModalOpen,
    fetchCoupons,
    handleViewDetails,
    handleEdit,
    handleDelete,
  };

  return (
    <CouponsContext.Provider value={value}>
      {children}
    </CouponsContext.Provider>
  );
};
