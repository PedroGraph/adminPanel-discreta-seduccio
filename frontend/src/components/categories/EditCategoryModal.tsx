
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, Category } from "@/hooks/useCategories";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess?: () => void;
}

import { useI18n } from "@/hooks/use-i18n";

export const EditCategoryModal = ({ open, onOpenChange, category, onSuccess }: EditCategoryModalProps) => {
  const t = useI18n();
  const { categories, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: null as number | null,
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parentId: category.parentId,
        status: category.status,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);

    const success = await updateCategory(category.id, formData);

    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }

    setLoading(false);
  };

  if (!category) return null;

  const parentCategories = categories.filter(cat => cat.parentId === null && cat.id !== category.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{(t("category_form") as any).edit_title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">{(t("category_form") as any).name}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="text-white">{(t("category_form") as any).slug}</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">{(t("category_form") as any).description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="parentId" className="text-white">{(t("category_form") as any).parent_category}</Label>
            <Select
              value={formData.parentId?.toString() || "none"}
              onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? null : parseInt(value) })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder={(t("category_form") as any).select_parent} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="none" className="text-white hover:bg-gray-700 focus:bg-gray-700">{(t("category_form") as any).no_parent}</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="status" className="text-white">{(t("category_form") as any).status}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="active" className="text-white hover:bg-gray-700 focus:bg-gray-700">{(t("category_form") as any).active}</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-gray-700 focus:bg-gray-700">{(t("category_form") as any).inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              {(t("category_form") as any).cancel}
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? (t("category_form") as any).updating : (t("category_form") as any).update_button}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
