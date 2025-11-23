
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, Star } from "lucide-react";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteProductModal } from "@/components/products/DeleteProductModal";
import { ProductsProvider, useProducts } from "@/components/products/ProductsProvider";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug } = useProducts();
  
  const [product, setProduct] = useState<Tables<'products'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("variants");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const data = await getProductBySlug(slug);
      setProduct(data);
      setIsLoading(false);
    };

    fetchProduct();
  }, [slug, getProductBySlug]);
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full bg-gray-800" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-gray-800" />
            <Skeleton className="h-6 w-1/2 bg-gray-800" />
            <Skeleton className="h-10 w-1/4 bg-gray-800" />
            <Skeleton className="h-24 w-full bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center text-purple-400 py-12 text-lg">
          Producto no encontrado.
        </div>
      </div>
    );
  }

  const savings = product.original_price ? product.original_price - product.price : 0;

  const handleEditProduct = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting product with ID: ${product.id}`);
    navigate("/products");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="text-purple-400 hover:bg-purple-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Productos
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-700 text-purple-400 hover:bg-purple-900"
            onClick={handleEditProduct}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDeleteProduct}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="bg-gray-700 border-purple-700">
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={product.image ?? ''}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-gray-600 rounded border-2 border-purple-500"></div>
              <div className="w-16 h-16 bg-gray-500 rounded"></div>
              <div className="w-16 h-16 bg-gray-500 rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-purple-100">{product.name}</h1>
              <Badge className="bg-gray-800 text-purple-100 border border-purple-500">
                {product.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-purple-100 ml-1">{product.rating}</span>
                <span className="text-purple-400 ml-1">({product.reviews} reseñas)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-purple-100">${product.price}</span>
              {product.original_price && <span className="text-lg text-gray-400 line-through">${product.original_price}</span>}
            </div>
            {product.original_price && <div className="text-green-400 text-sm mb-6">Ahorras ${savings.toFixed(2)}</div>}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-purple-400">Stock:</span>
                <span className="text-purple-100 ml-2">{product.stock} unidades</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400">SKU:</span>
                <span className="text-purple-100 ml-2">{product.sku}</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400">Agregado:</span>
                <span className="text-purple-100 ml-2">{product.date_added}</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400">Ventas:</span>
                <span className="text-purple-100 ml-2">{product.sales} unidades</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-100 mb-2">Descripción</h3>
              <p className="text-purple-300">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-100 mb-2">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Card className="bg-gray-700 border-purple-700">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="variants" className="text-purple-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                Variantes
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-purple-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                Especificaciones
              </TabsTrigger>
              <TabsTrigger value="sales" className="text-purple-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white">
                Datos de Ventas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variants" className="mt-6">
              <div className="space-y-4">
                {product.variants && typeof product.variants === 'object' && !Array.isArray(product.variants) && (
                  Object.entries(product.variants as Record<string, string[]>).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-semibold text-purple-100 mb-2 capitalize">{key}</h4>
                      <div className="flex gap-2">
                        {value.map((item, index) => (
                          <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="text-purple-300">
                <p>Las especificaciones detalladas de {product.name} se mostrarían aquí.</p>
                <p className="mt-2">Esta sección puede incluir detalles técnicos, dimensiones, información de garantía y más.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <h5 className="text-purple-100 font-semibold">Ventas Totales</h5>
                  <p className="text-2xl font-bold text-purple-200">{product.sales}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h5 className="text-purple-100 font-semibold">Ingresos</h5>
                  <p className="text-2xl font-bold text-purple-200">${(product.sales && product.price) ? (product.sales * product.price).toLocaleString() : 0}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={product}
      />

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={product}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export const ProductDetail = () => {
  return (
    <ProductsProvider>
      <ProductDetailContent />
    </ProductsProvider>
  )
};
