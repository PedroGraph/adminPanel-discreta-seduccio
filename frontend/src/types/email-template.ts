
import { Tables } from "@/integrations/supabase/types";

export type EmailTemplate = Tables<'email_templates'>;

export type EmailTemplateStats = {
  total: number;
  active: number;
  draft: number;
  archived: number;
  avgOpens: number;
  avgClicks: number;
};
