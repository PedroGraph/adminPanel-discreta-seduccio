import { ReturnsProvider } from "@/components/returns/ReturnsProvider";
import { ReturnsContent } from "@/components/returns/ReturnsContent";

const Returns = () => {
  return (
    <ReturnsProvider>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-100">Devoluciones</h1>
        </div>

        <ReturnsContent />
      </div>
    </ReturnsProvider>
  );
};

export default Returns;
