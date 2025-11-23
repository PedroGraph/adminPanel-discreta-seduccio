
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { Return } from "@/types/return";

type ReturnsContextType = {
  returns: Return[];
  isLoading: boolean;
  error: Error | null;
};

const ReturnsContext = createContext<ReturnsContextType | undefined>(undefined);

export const ReturnsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: returns, isLoading, error } = useQuery<Return[]>({
    queryKey: ['returns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('returns')
        .select('*, return_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
  });

  return (
    <ReturnsContext.Provider value={{ returns: returns || [], isLoading, error }}>
      {children}
    </ReturnsContext.Provider>
  );
};

export const useReturns = () => {
  const context = useContext(ReturnsContext);
  if (context === undefined) {
    throw new Error('useReturns must be used within a ReturnsProvider');
  }
  return context;
};
