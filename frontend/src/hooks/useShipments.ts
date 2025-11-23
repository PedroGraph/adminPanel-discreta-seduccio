
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";

export const useShipments = () => {
  const queryClient = useQueryClient();

  // Leer todos los shipments (en orden descendente, más recientes primero)
  const { data, isLoading, error } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"shipments">[];
    },
  });

  // Mutación para crear un nuevo shipment
  const createShipment = useMutation({
    mutationFn: async (payload: TablesInsert<"shipments">) => {
      const { error } = await supabase.from("shipments").insert([payload]);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    }
  });

  return {
    shipments: data || [],
    isLoading,
    error,
    createShipment,
  };
};
