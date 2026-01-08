import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Power, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  product_name: string;
  amount: number;
  product_type: string;
  is_active: boolean;
  profit: number;
  cost_price: number;
  selling_price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      if (response.data.status === "success") {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      let response;
      if (currentStatus) {
        // If currently active, deactivate it (DELETE endpoint performs soft delete)
        response = await api.delete(`/products/${id}`);
      } else {
        // If currently inactive, activate it
        response = await api.post(`/products/${id}/activate`);
      }

      if (response.data.status === "success") {
        toast.success(`Product ${currentStatus ? "deactivated" : "activated"} successfully`);
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to toggle product status:", error);
      toast.error("Failed to update product status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Product Management</h1>
          <button className="brutalist-btn px-4 py-2 text-sm flex items-center gap-2 bg-black text-white border-black hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 font-bold text-xl">Loading products...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="brutalist-card bg-white relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-2 h-full ${product.product_type === "data" ? "bg-blue-500" : product.product_type === "sms" ? "bg-yellow-500" : "bg-green-500"}`} />
                <CardHeader className="pb-2 pl-6">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold uppercase px-2 py-1 border border-black ${product.product_type === "data" ? "bg-blue-100" : product.product_type === "sms" ? "bg-yellow-100" : "bg-green-100"}`}>
                      {product.product_type}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-100 border border-transparent hover:border-black transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-red-100 text-red-600 border border-transparent hover:border-red-600 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-black mt-2">{product.product_name}</CardTitle>
                </CardHeader>
                <CardContent className="pl-6">
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Selling Price</p>
                      <p className="text-3xl font-black">KES {product.selling_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase">Profit</p>
                      <p className="text-xl font-bold text-green-600">
                        +KES {(product.selling_price - product.cost_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${product.is_active ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-xs font-bold uppercase">{product.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <button 
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                      className="text-xs font-bold uppercase underline hover:text-black text-gray-500 flex items-center gap-1"
                    >
                      <Power className="w-3 h-3" />
                      {product.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
