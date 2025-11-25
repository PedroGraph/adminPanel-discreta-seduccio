
import { useState, useRef } from "react";
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

interface ProductImage {
  id: string;
  file: File;
  url: string;
  isMain: boolean;
}

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProductModal = ({ open, onOpenChange }: AddProductModalProps) => {
  const { addProduct } = useProducts();
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
  });

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
      isMain: images.length === 0, // Primera imagen será la principal
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Si eliminamos la imagen principal, hacer que la primera sea la nueva principal
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Validación de campos obligatorios
      if (!formData.name.trim()) {
        toast.error('El nombre del producto es obligatorio');
        setIsSubmitting(false);
        return;
      }

      if (!formData.category) {
        toast.error('La categoría es obligatoria');
        setIsSubmitting(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('El precio debe ser mayor a 0');
        setIsSubmitting(false);
        return;
      }

      if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
        toast.error('El precio original es obligatorio y debe ser mayor a 0');
        setIsSubmitting(false);
        return;
      }

      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error('El stock es obligatorio y debe ser mayor o igual a 0');
        setIsSubmitting(false);
        return;
      }

      if (!formData.sku.trim()) {
        toast.error('El SKU es obligatorio');
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        toast.error('Debes agregar al menos una imagen del producto');
        setIsSubmitting(false);
        return;
      }

      // Generate a slug from the name
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      // Upload images to Cloudinary first
      let uploadedImageUrls: Array<{ imageUrl: string; isPrimary: boolean; sortOrder: number }> = [];

      if (images.length > 0) {
        toast.info('Subiendo imágenes...');

        const { uploadMultipleImages } = await import('@/services/upload.service');
        const files = images.map(img => img.file).filter((f): f is File => f !== undefined);

        const uploadedImages = await uploadMultipleImages(files);

        uploadedImageUrls = uploadedImages.map((img, index) => ({
          imageUrl: img.url,
          isPrimary: images[index].isMain,
          sortOrder: index
        }));
      }

      const newProduct = {
        name: formData.name,
        slug,
        price: parseFloat(formData.price) || 0,
        costPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock) || 0,
        description: formData.description || undefined,
        sku: formData.sku || `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'active' as const,

        // Handle Category
        ...(formData.category && {
          category: {
            name: formData.category,
            slug: formData.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            status: 'active' as const
          }
        }),

        // Handle Images with real Cloudinary URLs
        ...(uploadedImageUrls.length > 0 && {
          images: {
            create: uploadedImageUrls
          }
        }),

        // Handle Tags as Attributes
        ...(formData.tags && {
          attributes: {
            create: formData.tags.split(',').map(tag => ({
              attributeName: 'tag',
              attributeValue: tag.trim()
            }))
          }
        })
      };

      await addProduct(newProduct);

      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        stock: "",
        description: "",
        sku: "",
        tags: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add product. Contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-700 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-100">Añadir Nuevo Producto</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder="Ingresa el nombre del producto"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-purple-200">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-200">
                  <SelectValue placeholder="Selecciona una categoría" />
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
                <Label htmlFor="price" className="text-purple-200">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice" className="text-purple-200">Precio Original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock" className="text-purple-200">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="sku" className="text-purple-200">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="bg-gray-800 border-purple-700 text-purple-100"
                  placeholder="SKU-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-purple-200">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder="Describe el producto..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-purple-200">Etiquetas</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-gray-800 border-purple-700 text-purple-100"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* Sección de imágenes */}
          <div className="space-y-4">
            <Label className="text-purple-200">Imágenes del Producto</Label>

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
                Arrastra las imágenes aquí o{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  selecciona archivos
                </button>
              </p>
              <p className="text-sm text-purple-500">Formatos: JPG, PNG, GIF (máx. 5MB cada una)</p>
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
                <h4 className="text-purple-200 font-medium">Imágenes Subidas</h4>
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
                          Principal
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
            onClick={() => onOpenChange(false)}
            className="border-purple-700 text-purple-400 hover:bg-purple-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-600 text-purple-100"
          >
            Añadir Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
