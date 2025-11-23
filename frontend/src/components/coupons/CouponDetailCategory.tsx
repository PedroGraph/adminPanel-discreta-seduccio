
import { Target } from "lucide-react";

interface CouponDetailCategoryProps {
  category: string | null;
}

export const CouponDetailCategory = ({ category }: CouponDetailCategoryProps) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center">
        <Target className="h-5 w-5 mr-2" />
        Categoría
      </h3>
      <p className="text-purple-100">{category || 'General'}</p>
    </div>
  );
};
