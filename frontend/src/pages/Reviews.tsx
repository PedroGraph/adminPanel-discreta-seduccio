
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewsStats } from "@/components/reviews/ReviewsStats";
import { ReviewsFilters } from "@/components/reviews/ReviewsFilters";
import { ReviewsTable } from "@/components/reviews/ReviewsTable";
import { ReviewDetailModal } from "@/components/reviews/ReviewDetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviews } from "@/hooks/use-reviews";

export const Reviews = () => {
  const {
    loading,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    fetchReviews,
    filteredReviews,
    reviews,
    handleApprove,
    handleReject,
    handleViewDetails,
    selectedReview,
    isDetailModalOpen,
    setIsDetailModalOpen,
  } = useReviews();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-200">Reseñas</h1>
        <p className="text-purple-400">Gestiona las reseñas de productos de tu tienda</p>
      </div>

      <ReviewsStats stats={stats} />

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-200">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
            onRefresh={fetchReviews}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-200">
            Reseñas ({loading ? "..." : filteredReviews.length} de {loading ? "..." : reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ReviewsTable
              reviews={filteredReviews}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      <ReviewDetailModal
        review={selectedReview}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
