
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailTemplate } from "@/types/email-template";
import { Constants } from "@/integrations/supabase/types";

const emailTemplateSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  subject: z.string().min(5, { message: "El asunto debe tener al menos 5 caracteres." }),
  body: z.string().min(10, { message: "El cuerpo debe tener al menos 10 caracteres." }),
  type: z.enum(Constants.public.Enums.email_template_type),
  status: z.enum(Constants.public.Enums.email_template_status),
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

interface EmailTemplateFormProps {
  onSubmit: (data: EmailTemplateFormValues) => void;
  initialData?: EmailTemplate | null;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EmailTemplateForm = ({ onSubmit, initialData, onCancel, isSubmitting }: EmailTemplateFormProps) => {
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: initialData?.name || "",
      subject: initialData?.subject || "",
      body: initialData?.body || "",
      type: initialData?.type || "Marketing",
      status: initialData?.status || "Borrador",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Bienvenida nuevo usuario" {...field} className="bg-gray-800 border-purple-700 text-purple-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Asunto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: ¡Bienvenido a bordo!" {...field} className="bg-gray-800 border-purple-700 text-purple-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-300">Cuerpo del Email (soporta HTML)</FormLabel>
              <FormControl>
                <Textarea placeholder="<p>Hola {{name}},</p>" {...field} rows={10} className="bg-gray-800 border-purple-700 text-purple-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-100">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-purple-700 text-purple-100">
                    {Constants.public.Enums.email_template_type.map(type => (
                      <SelectItem key={type} value={type} className="text-purple-200 focus:bg-purple-800">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-300">Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-100">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-purple-700 text-purple-100">
                    {Constants.public.Enums.email_template_status.map(status => (
                      <SelectItem key={status} value={status} className="text-purple-200 focus:bg-purple-800">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-purple-300 hover:bg-purple-900 hover:text-purple-100">Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-600 text-purple-100">
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
