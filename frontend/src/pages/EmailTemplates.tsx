
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { EmailTemplateStats } from "@/components/email-templates/EmailTemplateStats";
import { EmailTemplatesTable } from "@/components/email-templates/EmailTemplatesTable";
import { EmailTemplateFormModal } from "@/components/email-templates/EmailTemplateFormModal";
import { DeleteEmailTemplateDialog } from "@/components/email-templates/DeleteEmailTemplateDialog";
import { EmailTemplateDetailModal } from "@/components/email-templates/EmailTemplateDetailModal";

export const EmailTemplates = () => {
    const {
        filteredTemplates,
        stats,
        searchTerm,
        setSearchTerm,
        loading,
        isFormModalOpen,
        isDetailModalOpen,
        isDeleteDialogOpen,
        selectedTemplate,
        openFormModal,
        openDetailModal,
        openDeleteDialog,
        closeModals,
        deleteTemplate,
        upsertTemplate,
    } = useEmailTemplates();
    
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">Templates de Email</h1>
                    <p className="text-purple-400">Gestiona tus plantillas de email marketing</p>
                </div>
                <Button onClick={() => openFormModal(null)} className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2 text-purple-200" />
                    Nuevo Template
                </Button>
            </div>

            <EmailTemplateStats stats={stats} />

            <Card className="bg-gray-700 border-purple-700">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                    {loading ? (
                        <div className="p-4 space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full bg-gray-600" />
                            ))}
                        </div>
                    ) : (
                        <EmailTemplatesTable
                            templates={filteredTemplates}
                            onView={openDetailModal}
                            onEdit={openFormModal}
                            onDelete={openDeleteDialog}
                        />
                    )}
                </CardContent>
            </Card>
            
            <EmailTemplateFormModal
                isOpen={isFormModalOpen}
                onClose={closeModals}
                onSubmit={upsertTemplate}
                template={selectedTemplate}
            />

            <DeleteEmailTemplateDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeModals}
                onConfirm={() => selectedTemplate && deleteTemplate(selectedTemplate.id)}
                template={selectedTemplate}
            />

            <EmailTemplateDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeModals}
                template={selectedTemplate}
            />
        </div>
    );
};
