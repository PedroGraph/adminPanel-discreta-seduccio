
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, ShoppingCart, Star, Percent } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'product' | 'user' | 'order' | 'review' | 'coupon';
  title: string;
  subtitle?: string;
  url: string;
}

interface GlobalSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'user':
      return <User className="h-4 w-4" />;
    case 'order':
      return <ShoppingCart className="h-4 w-4" />;
    case 'review':
      return <Star className="h-4 w-4" />;
    case 'coupon':
      return <Percent className="h-4 w-4" />;
    default:
      return null;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'product':
      return "bg-blue-600";
    case 'user':
      return "bg-green-600";
    case 'order':
      return "bg-orange-600";
    case 'review':
      return "bg-yellow-600";
    case 'coupon':
      return "bg-purple-600";
    default:
      return "bg-gray-600";
  }
};

export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({
  results,
  isLoading,
  onResultClick
}) => {
  const navigate = useNavigate();

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onResultClick();
  };

  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border-gray-600 z-50">
        <CardContent className="p-4">
          <div className="text-center text-gray-400">Buscando...</div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border-gray-600 z-50 max-h-96 overflow-y-auto">
      <CardContent className="p-2">
        {results.map((result) => (
          <div
            key={`${result.type}-${result.id}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer rounded-md transition-colors"
            onClick={() => handleResultClick(result)}
          >
            <div className="flex items-center gap-2">
              {getIcon(result.type)}
              <Badge 
                className={`text-xs text-white ${getTypeBadgeColor(result.type)}`}
              >
                {result.type}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{result.title}</div>
              {result.subtitle && (
                <div className="text-gray-400 text-sm truncate">{result.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
