
interface CouponDetailInfoProps {
  id: string;
  name: string;
}

export const CouponDetailInfo = ({ id, name }: CouponDetailInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-300 mb-2">Código</h3>
        <p className="text-xl font-bold font-mono text-purple-100">{id}</p>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-300 mb-2">Nombre</h3>
        <p className="text-lg text-purple-100">{name}</p>
      </div>
    </div>
  );
};
