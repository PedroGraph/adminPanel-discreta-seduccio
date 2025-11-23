import { Return } from "@/types/return";



export const mockOrderProducts = [
  {
    orderId: "#ORD001",
    products: [
      { id: "P001", name: "Smartphone Galaxy S24", quantity: 2, price: 899.99 },
      { id: "P002", name: "Funda Protectora", quantity: 2, price: 149.99 },
      { id: "P008", name: "Cargador Inalámbrico", quantity: 1, price: 79.99 }
    ]
  },
  {
    orderId: "#ORD003",
    products: [
      { id: "P003", name: "Auriculares Bluetooth", quantity: 1, price: 199.99 },
      { id: "P009", name: "Cable USB-C", quantity: 3, price: 29.99 }
    ]
  },
  {
    orderId: "#ORD005",
    products: [
      { id: "P004", name: "Reloj Inteligente", quantity: 1, price: 299.99 }
    ]
  },
  {
    orderId: "#ORD002",
    products: [
      { id: "P005", name: "Laptop Dell XPS 13", quantity: 1, price: 1299.99 },
      { id: "P006", name: "Mouse Inalámbrico", quantity: 2, price: 49.99 },
      { id: "P007", name: "Teclado Mecánico", quantity: 1, price: 149.99 },
      { id: "P010", name: "Monitor 24 pulgadas", quantity: 1, price: 399.99 }
    ]
  }
];
