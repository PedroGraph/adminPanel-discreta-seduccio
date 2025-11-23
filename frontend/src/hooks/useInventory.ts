
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  cost: number;
  sell_price: number;
  supplier: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  reason: string;
  reference_id: string | null;
  cost_per_unit: number | null;
  total_cost: number | null;
  created_by: string | null;
  created_at: string;
}

export const useInventory = () => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    }
  };

  const fetchMovements = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMovements(data || []);
    } catch (error) {
      console.error('Error fetching movements:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los movimientos",
        variant: "destructive",
      });
    }
  };

  const createMovement = async (movement: {
    product_id: string;
    movement_type: string;
    quantity: number;
    reason: string;
    cost_per_unit?: number;
  }) => {
    try {
      const { error } = await supabase
        .from('inventory_movements')
        .insert([{
          ...movement,
          total_cost: movement.cost_per_unit ? movement.cost_per_unit * movement.quantity : null,
          created_by: 'Admin' // En un futuro se puede obtener del usuario actual
        }]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Movimiento creado correctamente",
      });

      // Refrescar datos
      await Promise.all([fetchProducts(), fetchMovements()]);
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
      await Promise.all([fetchProducts(), fetchMovements()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    products,
    movements,
    loading,
    fetchProducts,
    fetchMovements,
    createMovement,
  };
};
