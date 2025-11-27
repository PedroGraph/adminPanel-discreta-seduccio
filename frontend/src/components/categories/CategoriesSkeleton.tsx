import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CategoriesSkeleton = () => {
    return (
        <div className="p-6 bg-gray-800 min-h-screen">
            <div className="mb-6">
                <Skeleton className="h-9 w-64 mb-2 bg-gray-700" />
                <Skeleton className="h-5 w-96 bg-gray-700" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[1, 2, 3].map((i) => (
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

            {/* Search and Actions */}
            <Card className="bg-gray-700 border-gray-600 mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <Skeleton className="h-10 w-full bg-gray-600" />
                        </div>
                        <Skeleton className="h-10 w-40 bg-gray-600" />
                    </div>
                </CardContent>
            </Card>

            {/* Categories Table */}
            <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                    <Skeleton className="h-6 w-40 bg-gray-600" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="flex justify-between border-b border-gray-600 pb-4 px-3">
                            <Skeleton className="h-4 w-1/4 bg-gray-600" />
                            <Skeleton className="h-4 w-1/4 bg-gray-600" />
                            <Skeleton className="h-4 w-1/6 bg-gray-600" />
                            <Skeleton className="h-4 w-1/6 bg-gray-600" />
                            <Skeleton className="h-4 w-1/6 bg-gray-600" />
                        </div>

                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-700 last:border-0 px-3">
                                <div className="w-1/4 pr-4">
                                    <Skeleton className="h-5 w-32 mb-2 bg-gray-600" />
                                    <Skeleton className="h-3 w-20 bg-gray-600" />
                                </div>
                                <div className="w-1/4 pr-4">
                                    <Skeleton className="h-4 w-full bg-gray-600" />
                                </div>
                                <div className="w-1/6 flex justify-center">
                                    <Skeleton className="h-6 w-12 rounded-full bg-gray-600" />
                                </div>
                                <div className="w-1/6 flex justify-center">
                                    <Skeleton className="h-6 w-16 rounded-full bg-gray-600" />
                                </div>
                                <div className="w-1/6 flex justify-center gap-2">
                                    <Skeleton className="h-8 w-8 bg-gray-600" />
                                    <Skeleton className="h-8 w-8 bg-gray-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
