
import { Database } from "@/integrations/supabase/types";

export type ReturnItem = Database["public"]["Tables"]["return_items"]["Row"];

export type Return = Database["public"]["Tables"]["returns"]["Row"] & {
  return_items: ReturnItem[];
};
