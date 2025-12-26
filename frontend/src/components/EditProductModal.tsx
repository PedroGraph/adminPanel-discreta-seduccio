
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "./products/ProductsProvider";
import { toast } from "sonner";

import { useI18n } from "@/hooks/use-i18n";

interface ProductImage {
  id: string;
  file?: File;
  url: string;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const EditProductModal = ({ open, onOpenChange, product }: EditProductModalProps) => {
  const t = useI18n();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    sku: "",
    tags: "",
    status: "",
  });

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        originalPrice: "",
        stock: product.stock.toString(),
        description: "",
        sku: "",
        tags: "",
        status: product.status,
      });

      // Cargar imagen existente
      setImages([{
        id: "existing-1",
        url: product.image,
        isMain: true,
      }]);
    }
  }, [product, open]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    addImages(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const newImages: ProductImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      isMain: images.length === 0,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (id: string) => {
    setImages(prev =>
      prev.map(img => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const { updateProduct } = useProducts();

  const handleSubmit = async () => {
    if (!product) return;

    try {
      const statusMap: Record<string, string> = {
        'Activo': 'active',
        'Inactivo': 'inactive',
        'Agotado': 'inactive',
      };

      // Prepare image URLs array
      let uploadedImageUrls: Array<{ imageUrl: string; isPrimary: boolean; sortOrder: number }> = [];

      // First, add all existing images (those without file property)
      const existingImages = images
        .filter(img => !img.file)
        .map((img) => ({
          imageUrl: img.url,
          isPrimary: img.isMain,
          sortOrder: images.indexOf(img)
        }));

      // Upload new images to Cloudinary (only those with file property)
      const newImages = images.filter(img => img.file);

      if (newImages.length > 0) {
        toast.info('Subiendo nuevas imágenes...');

        const { uploadMultipleImages } = await import('@/services/upload.service');
        const files = newImages.map(img => img.file).filter((f): f is File => f !== undefined);

        const uploadedImages = await uploadMultipleImages(files);

        // Map uploaded images with their isPrimary status
        const newUploadedImages = uploadedImages.map((img, index) => {
          const originalImage = newImages[index];
          return {
            imageUrl: img.url,
            isPrimary: originalImage.isMain,
            sortOrder: images.indexOf(originalImage)
          };
        });

        uploadedImageUrls = [...existingImages, ...newUploadedImages];
      } else {
        // No new images, just use existing ones
        uploadedImageUrls = existingImages;
      }

      // Sort by sortOrder
      uploadedImageUrls.sort((a, b) => a.sortOrder - b.sortOrder);

      const updates: any = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        price: parseFloat(formData.price) || 0,
        costPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock) || 0,
        description: formData.description || undefined,
        sku: formData.sku || undefined,
        status: statusMap[formData.status] || 'active',
      };

      if (formData.category && formData.category !== product.category) {
        updates.category = {
          name: formData.category,
          slug: formData.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          status: 'active'
        };
      }

      // Always include images if there are any
      if (uploadedImageUrls.length > 0) {
        updates.images = {
          create: uploadedImageUrls
        };
      }

      await updateProduct(product.id, updates);
      toast.success('Producto actualizado exitosamente');
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update product. Contact support.");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form cuando se cierra
    setFormData({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      sku: "",
      tags: "",
      status: "",
    });
    setImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-700 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-100">{(t("product_form") as any).edit_title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-purple-200">{(t("product_form") as any).name}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder={(t("product_form") as any).name_placeholder}
              />
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-purple-200">{(t("product_form") as any).category}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-200">
                  <SelectValue placeholder={(t("product_form") as any).category_placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-purple-100 border-purple-700">
                  <SelectItem value="Electrónicos">Electrónicos</SelectItem>
                  <SelectItem value="Computadoras">Computadoras</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Wearables">Wearables</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price" className="text-purple-200">{(t("product_form") as any).price}</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder={(t("product_form") as any).price_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="edit-originalPrice" className="text-purple-200">{(t("product_form") as any).original_price}</Label>
                <Input
                  id="edit-originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder={(t("product_form") as any).original_price_placeholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-stock" className="text-purple-200">{(t("product_form") as any).stock}</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder={(t("product_form") as any).stock_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="edit-sku" className="text-purple-200">{(t("product_form") as any).sku}</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder={(t("product_form") as any).sku_placeholder}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-status" className="text-purple-200">{(t("product_form") as any).status}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-200">
                  <SelectValue placeholder={(t("product_form") as any).status_placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-purple-100 border-purple-700">
                  <SelectItem value="Activo">{(t("product_status") as any).active}</SelectItem>
                  <SelectItem value="Inactivo">{(t("product_status") as any).inactive}</SelectItem>
                  <SelectItem value="Agotado">{(t("product_status") as any).inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-purple-200">{(t("product_form") as any).description}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder={(t("product_form") as any).description_placeholder}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-tags" className="text-purple-200">{(t("product_form") as any).tags}</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder={(t("product_form") as any).tags_placeholder}
              />
            </div>
          </div>

          {/* Sección de imágenes */}
          <div className="space-y-4">
            <Label className="text-purple-200">{(t("product_images") as any).title}</Label>

            {/* Zona de drag and drop */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
                ? "border-purple-400 bg-purple-900/20"
                : "border-purple-600 bg-gray-800"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <p className="text-purple-300 mb-2">
                {(t("product_images") as any).drag_drop}{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {(t("product_images") as any).select_files}
                </button>
              </p>
              <p className="text-sm text-purple-500">{(t("product_images") as any).formats}</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Vista previa de imágenes */}
            {images.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-purple-200 font-medium">{(t("product_images") as any).uploaded}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative bg-gray-800 rounded-lg p-2 border border-purple-700 cursor-pointer hover:border-purple-500 transition-colors"
                      onClick={() => setMainImage(image.id)}
                    >
                      <img
                        src={image.url}
                        alt="Vista previa"
                        className="w-full h-24 object-cover rounded"
                      />

                      {/* Badge de imagen principal */}
                      {image.isMain && (
                        <Badge className="absolute top-1 left-1 bg-purple-700 text-purple-100 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {(t("product_images") as any).main}
                        </Badge>
                      )}

                      {/* Botón de eliminar */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                        className="absolute top-1 right-1 h-6 w-6 p-0 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-purple-700 text-purple-400 hover:bg-purple-900"
          >
            {(t("product_form") as any).cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-700 hover:bg-purple-600 text-purple-100 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              (t("product_form") as any).save_changes
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
