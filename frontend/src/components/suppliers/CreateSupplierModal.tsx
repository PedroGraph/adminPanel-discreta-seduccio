
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuppliers } from "@/hooks/useSuppliers";

interface CreateSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateSupplierModal = ({ open, onOpenChange }: CreateSupplierModalProps) => {
  const { createSupplier } = useSuppliers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    category: "",
    products_supplied: 0,
    rating: 0,
    status: "Activo",
    payment_terms: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await createSupplier(formData);

    if (success) {
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        category: "",
        products_supplied: 0,
        rating: 0,
        status: "Activo",
        payment_terms: "",
      });
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Crear Nuevo Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Nombre de la Empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="contact_person" className="text-white">Persona de Contacto *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-white">Dirección</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country" className="text-white">País</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="México" className="text-white hover:bg-gray-700 focus:bg-gray-700">México</SelectItem>
                  <SelectItem value="Estados Unidos" className="text-white hover:bg-gray-700 focus:bg-gray-700">Estados Unidos</SelectItem>
                  <SelectItem value="China" className="text-white hover:bg-gray-700 focus:bg-gray-700">China</SelectItem>
                  <SelectItem value="Alemania" className="text-white hover:bg-gray-700 focus:bg-gray-700">Alemania</SelectItem>
                  <SelectItem value="Japón" className="text-white hover:bg-gray-700 focus:bg-gray-700">Japón</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="text-white">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Electrónicos" className="text-white hover:bg-gray-700 focus:bg-gray-700">Electrónicos</SelectItem>
                  <SelectItem value="Ropa" className="text-white hover:bg-gray-700 focus:bg-gray-700">Ropa</SelectItem>
                  <SelectItem value="Hogar" className="text-white hover:bg-gray-700 focus:bg-gray-700">Hogar</SelectItem>
                  <SelectItem value="Deportes" className="text-white hover:bg-gray-700 focus:bg-gray-700">Deportes</SelectItem>
                  <SelectItem value="Juguetes" className="text-white hover:bg-gray-700 focus:bg-gray-700">Juguetes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-white">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Activo" className="text-white hover:bg-gray-700 focus:bg-gray-700">Activo</SelectItem>
                  <SelectItem value="Pendiente" className="text-white hover:bg-gray-700 focus:bg-gray-700">Pendiente</SelectItem>
                  <SelectItem value="Inactivo" className="text-white hover:bg-gray-700 focus:bg-gray-700">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_terms" className="text-white">Términos de Pago</Label>
              <Input
                id="payment_terms"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                placeholder="ej: 30 días"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? "Creando..." : "Crear Proveedor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
