
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import { Activity, ActivityFromDB } from "@/types/activity";
import { User, Package, ShoppingCart, Settings as SettingsIcon } from "lucide-react";
import { format } from 'date-fns';

const getIconAndColor = (category: string) => {
    switch (category) {
        case "producto": return { icon: Package, color: "blue" };
        case "orden": return { icon: ShoppingCart, color: "green" };
        case "usuario": return { icon: User, color: "red" };
        case "configuracion": return { icon: SettingsIcon, color: "purple" };
        case "sistema": return { icon: Package, color: "red" };
        default: return { icon: Package, color: "gray" };
    }
};

const mapActivity = (dbActivity: ActivityFromDB): Activity => {
    const { icon, color } = getIconAndColor(dbActivity.category);
    return {
        id: dbActivity.id,
        user: dbActivity.user_name,
        action: dbActivity.action,
        target: dbActivity.target,
        category: dbActivity.category,
        level: dbActivity.level,
        timestamp: format(new Date(dbActivity.created_at), "yyyy-MM-dd HH:mm:ss"),
        details: dbActivity.details || "No hay detalles.",
        icon,
        color,
    };
};

type ActivityContextType = {
  activities: Activity[];
  isLoading: boolean;
  error: Error | null;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data ? data.map(mapActivity) : [];
    },
  });

  return (
    <ActivityContext.Provider value={{ activities: data || [], isLoading, error }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
};
