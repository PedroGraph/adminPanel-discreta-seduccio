
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Coupon, CouponStats } from "@/types/coupon";

interface CouponsContextType {
  coupons: Coupon[];
  filteredCoupons: Coupon[];
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
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
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
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, statusFilter, typeFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as Coupon[];
      setCoupons(typedData);
      calculateStats(typedData);
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

  const calculateStats = (couponsData: Coupon[]) => {
    const total = couponsData.length;
    const active = couponsData.filter(c => c.status === 'active').length;
    const inactive = couponsData.filter(c => c.status === 'inactive').length;
    const expired = couponsData.filter(c => c.status === 'expired').length;
    const totalUsage = couponsData.reduce((sum, c) => sum + (c.usage_count || 0), 0);
    
    const totalSavings = couponsData.reduce((sum, c) => {
      const usage = c.usage_count || 0;
      const avgSaving = c.type === 'percentage' ? c.value : c.value;
      return sum + (usage * avgSaving);
    }, 0);

    setStats({ total, active, inactive, expired, totalUsage, totalSavings });
  };

  const filterCoupons = () => {
    let filtered = coupons;

    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coupon.category && coupon.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.type === typeFilter);
    }

    setFilteredCoupons(filtered);
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
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
    filteredCoupons,
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
