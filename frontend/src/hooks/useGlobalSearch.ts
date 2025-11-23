
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  type: 'product' | 'user' | 'order' | 'review' | 'coupon';
  title: string;
  subtitle?: string;
  url: string;
}

export const useGlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults: SearchResult[] = [];

        // Buscar en productos
        const { data: products } = await supabase
          .from('products')
          .select('id, name, slug, category, price')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,slug.ilike.%${query}%`)
          .limit(5);

        if (products) {
          products.forEach(product => {
            searchResults.push({
              id: product.id.toString(),
              type: 'product',
              title: product.name,
              subtitle: `${product.category} - $${product.price}`,
              url: `/products/${product.slug}`
            });
          });
        }

        // Buscar en usuarios
        const { data: users } = await supabase
          .from('users')
          .select('id, name, email, role')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5);

        if (users) {
          users.forEach(user => {
            searchResults.push({
              id: user.id,
              type: 'user',
              title: user.name,
              subtitle: `${user.email} - ${user.role}`,
              url: `/users`
            });
          });
        }

        // Buscar en órdenes
        const { data: orders } = await supabase
          .from('orders')
          .select('id, customer_name, customer_email, total')
          .or(`id.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`)
          .limit(5);

        if (orders) {
          orders.forEach(order => {
            searchResults.push({
              id: order.id,
              type: 'order',
              title: `Orden ${order.id}`,
              subtitle: `${order.customer_name} - $${order.total}`,
              url: `/orders`
            });
          });
        }

        // Buscar en reseñas
        const { data: reviews } = await supabase
          .from('reviews')
          .select('id, title, customer_name, product_name')
          .or(`title.ilike.%${query}%,customer_name.ilike.%${query}%,product_name.ilike.%${query}%`)
          .limit(3);

        if (reviews) {
          reviews.forEach(review => {
            searchResults.push({
              id: review.id,
              type: 'review',
              title: review.title,
              subtitle: `${review.customer_name} - ${review.product_name}`,
              url: `/reviews`
            });
          });
        }

        // Buscar en cupones
        const { data: coupons } = await supabase
          .from('coupons')
          .select('id, name, type, value')
          .or(`id.ilike.%${query}%,name.ilike.%${query}%`)
          .limit(3);

        if (coupons) {
          coupons.forEach(coupon => {
            searchResults.push({
              id: coupon.id,
              type: 'coupon',
              title: coupon.name,
              subtitle: `${coupon.type} - ${coupon.value}%`,
              url: `/coupons`
            });
          });
        }

        setResults(searchResults);
      } catch (error) {
        console.error("Error searching:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading
  };
};
