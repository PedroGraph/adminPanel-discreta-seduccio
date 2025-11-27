import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getInventory, 
  getMovements, 
  createMovement as createMovementService, 
  getInventoryStats,
  InventoryProduct, 
  InventoryMovement,
  InventoryStats
} from "@/services/inventory.service";

export type { InventoryProduct, InventoryMovement };

export const useInventory = () => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalValue: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  
  const { toast } = useToast();

  const fetchInventory = useCallback(async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}) => {
    try {
      setLoading(true);
      const data = await getInventory(params);
      setProducts(data.products);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchRecentMovements = useCallback(async () => {
    try {
      const data = await getMovements();
      setMovements(data);
    } catch (error) {
      console.error('Error fetching movements:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los movimientos",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getInventoryStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const createMovement = async (movement: {
    product_id: string; 
    movement_type: string;
    quantity: number;
    reason: string;
    cost_per_unit?: number;
  }) => {
    try {
      await createMovementService({
        productId: parseInt(movement.product_id),
        type: movement.movement_type,
        quantity: movement.quantity,
        reason: movement.reason,
        cost: movement.cost_per_unit
      });

      toast({
        title: "Éxito",
        description: "Movimiento creado correctamente",
      });

      await Promise.all([
        fetchInventory({ page: pagination.page, limit: pagination.limit }), 
        fetchRecentMovements(),
        fetchStats()
      ]);
      return true;
    } catch (error) {
      console.error('Error creating movement:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el movimiento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchInventory(), 
        fetchRecentMovements(),
        fetchStats()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchInventory, fetchRecentMovements, fetchStats]);

  return {
    products,
    movements,
    stats,
    loading,
    pagination,
    fetchInventory,
    fetchMovements: fetchRecentMovements,
    createMovement,
  };
};
