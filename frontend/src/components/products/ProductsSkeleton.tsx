import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProductsStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-gray-700 border-gray-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24 bg-gray-600" />
                        <Skeleton className="h-4 w-4 bg-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-1 bg-gray-600" />
                        <Skeleton className="h-3 w-32 bg-gray-600" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export const ProductsTableSkeleton = () => {
    return (
        <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-0">
                <div className="space-y-4 p-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-lg bg-gray-600" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px] bg-gray-600" />
                                <Skeleton className="h-4 w-[200px] bg-gray-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
