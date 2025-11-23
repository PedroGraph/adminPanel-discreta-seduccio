
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatReadableDate(dateString: string | null): string {
  if (!dateString) return "Nunca";
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "Fecha inválida";
  }
}
