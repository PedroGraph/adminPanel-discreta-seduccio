
import { getReturns } from "@/services/returns.service";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { Return } from "@/types/return";

type ReturnsContextType = {
  returns: Return[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const ReturnsContext = createContext<ReturnsContextType | undefined>(undefined);

export const ReturnsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: returns, isLoading, error, refetch } = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const response = await getReturns({ limit: 100 });
      return response.returns;
    },
  });

  return (
    <ReturnsContext.Provider value={{ returns: returns || [], isLoading, error, refetch }}>
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
