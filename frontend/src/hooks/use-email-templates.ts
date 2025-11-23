import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { EmailTemplate, EmailTemplateStats } from "@/types/email-template";
import { TablesInsert } from "@/integrations/supabase/types";

export const useEmailTemplates = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [stats, setStats] = useState<EmailTemplateStats>({ total: 0, active: 0, draft: 0, archived: 0, avgOpens: 0, avgClicks: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

    const { toast } = useToast();

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast({ title: "Error", description: "No se pudieron cargar las plantillas.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const calculateStats = (templatesData: EmailTemplate[]) => {
        const total = templatesData.length;
        const active = templatesData.filter(t => t.status === 'Activo').length;
        const draft = templatesData.filter(t => t.status === 'Borrador').length;
        const archived = templatesData.filter(t => t.status === 'Archivado').length;
        const totalOpens = templatesData.reduce((sum, t) => sum + (Number(t.opens) || 0), 0);
        const totalClicks = templatesData.reduce((sum, t) => sum + (Number(t.clicks) || 0), 0);
        const avgOpens = total > 0 ? totalOpens / total : 0;
        const avgClicks = total > 0 ? totalClicks / total : 0;
        setStats({ total, active, draft, archived, avgOpens, avgClicks });
    };

    useEffect(() => {
        calculateStats(templates);
    }, [templates]);

    const filteredTemplates = useMemo(() => {
        if (!searchTerm) return templates;
        return templates.filter(template =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [templates, searchTerm]);

    const openFormModal = (template: EmailTemplate | null = null) => {
        setSelectedTemplate(template);
        setIsFormModalOpen(true);
    };
    
    const openDetailModal = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        setIsDetailModalOpen(true);
    };

    const openDeleteDialog = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        setIsDeleteDialogOpen(true);
    };
    
    const closeModals = () => {
        setIsFormModalOpen(false);
        setIsDetailModalOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedTemplate(null);
    };

    const upsertTemplate = async (templateData: TablesInsert<'email_templates'>) => {
        try {
            const { error } = await supabase.from('email_templates').upsert(templateData);
            if (error) throw error;
            
            toast({ title: "Éxito", description: `Plantilla guardada correctamente.` });
            await fetchTemplates();
            closeModals();
        } catch (error) {
            console.error("Error upserting template:", error);
            toast({ title: "Error", description: "No se pudo guardar la plantilla.", variant: "destructive" });
        }
    };

    const deleteTemplate = async (id: string) => {
        try {
            const { error } = await supabase.from('email_templates').delete().eq('id', id);
            if (error) throw error;
            toast({ title: "Éxito", description: "Plantilla eliminada correctamente." });
            await fetchTemplates();
            closeModals();
        } catch (error) {
            console.error("Error deleting template:", error);
            toast({ title: "Error", description: "No se pudo eliminar la plantilla.", variant: "destructive" });
        }
    };

    return {
        templates,
        filteredTemplates,
        stats,
        searchTerm,
        loading,
        isFormModalOpen,
        isDetailModalOpen,
        isDeleteDialogOpen,
        selectedTemplate,
        setSearchTerm,
        fetchTemplates,
        deleteTemplate,
        openFormModal,
        openDetailModal,
        openDeleteDialog,
        closeModals,
        upsertTemplate,
    };
};
