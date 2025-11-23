
import { Database } from "@/integrations/supabase/types";

export type ActivityFromDB = Database["public"]["Tables"]["activities"]["Row"];

export interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  category: string;
  level: "INFO" | "WARN" | "ERROR";
  timestamp: string;
  icon: React.ElementType;
  color: string;
  details: string;
}
