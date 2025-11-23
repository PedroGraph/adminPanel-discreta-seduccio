
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Review, ReviewStats } from "@/types/review";

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const calculateStats = (reviewsData: Review[]) => {
    const total = reviewsData.length;
    const approved = reviewsData.filter(r => r.status === 'approved').length;
    const pending = reviewsData.filter(r => r.status === 'pending').length;
    const rejected = reviewsData.filter(r => r.status === 'rejected').length;
    const averageRating = total > 0 
      ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / total 
      : 0;

    setStats({ total, approved, pending, rejected, averageRating });
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as Review[];
      setReviews(typedData);
      calculateStats(typedData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reseñas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const filterReviews = () => {
      let filtered = reviews;

      if (searchTerm) {
        filtered = filtered.filter(review =>
          review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (statusFilter !== 'all') {
        filtered = filtered.filter(review => review.status === statusFilter);
      }

      if (ratingFilter !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
      }

      setFilteredReviews(filtered);
    };

    filterReviews();
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Reseña aprobada correctamente"
      });

      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: "No se pudo aprobar la reseña",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Reseña rechazada correctamente"
      });

      fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar la reseña",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  return {
    reviews,
    filteredReviews,
    stats,
    searchTerm,
    statusFilter,
    ratingFilter,
    selectedReview,
    isDetailModalOpen,
    loading,
    setSearchTerm,
    setStatusFilter,
    setRatingFilter,
    setIsDetailModalOpen,
    fetchReviews,
    handleApprove,
    handleReject,
    handleViewDetails,
  };
};
