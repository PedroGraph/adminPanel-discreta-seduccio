import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, AlertTriangle } from 'lucide-react';
import { useI18n } from "@/hooks/use-i18n";

interface ProductInfoProps {
  products: {
    top_selling: Array<{
      name: string;
      sales: number;
      price: number;
    }>;
    low_stock: Array<{
      name: string;
      stock: number;
      threshold: number;
    }>;
  } | null;
}

export const ProductInfo = ({ products }: ProductInfoProps) => {
  const t = useI18n();

  if (!products) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-700 border-blue-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-300 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {t("top_products")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.top_selling.map((product, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center text-blue-400 font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-purple-100 text-sm">{product.name}</p>
                  <p className="text-xs text-blue-400">{product.sales} {t("sales")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-orange-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t("low_stock")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.low_stock.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center text-orange-400">
                    !
                  </div>
                  <div>
                    <p className="font-medium text-purple-100 text-sm">{product.name}</p>
                    <p className="text-xs text-purple-400">{t("threshold")}: {product.threshold}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-orange-400">{t("remaining")}: {product.stock}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
