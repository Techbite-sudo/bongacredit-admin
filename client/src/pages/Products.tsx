import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Power, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  product_name: string;
  amount: number;
  product_type: string;
  is_active: boolean;
  profit: number;
  cost_price: number;
  selling_price: number;
  product_details: string; // JSON string
}

interface ProductFormData {
  product_name: string;
  product_type: string;
  cost_price: string;
  selling_price: string;
  amount: string; // This is actually the payment amount trigger
  validity: string; // For data bundles
  count: string; // For data size (MB/GB)
}

const initialFormData: ProductFormData = {
  product_name: "",
  product_type: "data",
  cost_price: "",
  selling_price: "",
  amount: "",
  validity: "24 Hours",
  count: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentProduct(null);
  };

  const openEditModal = (product: Product) => {
    let details = { validity: "24 Hours", count: "" };
    try {
      if (product.product_details) {
        const parsed = JSON.parse(product.product_details);
        details = { ...details, ...parsed };
      }
    } catch (e) {
      console.error("Error parsing details", e);
    }

    setFormData({
      product_name: product.product_name,
      product_type: product.product_type,
      cost_price: product.cost_price.toString(),
      selling_price: product.selling_price.toString(),
      amount: product.amount.toString(),
      validity: details.validity,
      count: details.count || "",
    });
    setCurrentProduct(product);
    setIsEditOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        product_name: formData.product_name,
        product_type: formData.product_type,
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price),
        amount: parseFloat(formData.amount),
        product_details: JSON.stringify({
          validity: formData.validity,
          count: formData.count,
          unit: formData.product_type === "data" ? "MB" : "KES"
        })
      };

      let response;
      if (currentProduct) {
        // Edit mode
        response = await api.put(`/products/${currentProduct.id}`, payload);
      } else {
        // Add mode
        response = await api.post("/products", payload);
      }

      if (response.data.status === "success") {
        toast.success(`Product ${currentProduct ? "updated" : "created"} successfully`);
        setIsAddOpen(false);
        setIsEditOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentProduct) return;
    setSubmitting(true);
    try {
      // Hard delete via API (assuming backend supports DELETE /products/{id}/hard or similar, 
      // but standard DELETE is soft delete. For now we use the standard DELETE which deactivates)
      // If you implemented a hard delete endpoint, use that. Otherwise, this just deactivates.
      // Let's assume for "Delete" action we want to remove it from the list or deactivate it permanently.
      const response = await api.delete(`/products/${currentProduct.id}`);
      if (response.data.status === "success") {
        toast.success("Product deleted successfully");
        setIsDeleteOpen(false);
        setCurrentProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      let response;
      if (currentStatus) {
        response = await api.delete(`/products/${id}`);
      } else {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your airtime and data bundles</p>
          </div>
          <Button 
            onClick={() => { resetForm(); setIsAddOpen(true); }}
            className="bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="modern-card group overflow-hidden border-l-4 border-l-transparent hover:border-l-primary transition-all">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-full tracking-wide",
                      product.product_type === "data" 
                        ? "bg-blue-50 text-blue-700 border border-blue-100" 
                        : "bg-green-50 text-green-700 border border-green-100"
                    )}>
                      {product.product_type}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => openEditModal(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600" onClick={() => openDeleteModal(product)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold mt-3 leading-tight">{product.product_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Price</p>
                      <p className="text-2xl font-bold text-gray-900">KES {product.selling_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Profit</p>
                      <p className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block">
                        +{(product.selling_price - product.cost_price).toFixed(0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", product.is_active ? "bg-green-500" : "bg-gray-300")} />
                      <span className="text-xs font-medium text-gray-600">{product.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                      className={cn(
                        "h-7 text-xs font-medium",
                        product.is_active ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"
                      )}
                    >
                      <Power className="w-3 h-3 mr-1.5" />
                      {product.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => { if(!open) { setIsAddOpen(false); setIsEditOpen(false); resetForm(); } }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditOpen ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_type">Type</Label>
                  <Select 
                    value={formData.product_type} 
                    onValueChange={(val) => handleSelectChange("product_type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data">Data Bundle</SelectItem>
                      <SelectItem value="airtime">Airtime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Trigger Amount (KES)</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    placeholder="e.g. 55" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input 
                  id="product_name" 
                  name="product_name" 
                  placeholder="e.g. 1.25GB Daily Data" 
                  value={formData.product_name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price</Label>
                  <Input 
                    id="selling_price" 
                    name="selling_price" 
                    type="number" 
                    placeholder="e.g. 55" 
                    value={formData.selling_price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input 
                    id="cost_price" 
                    name="cost_price" 
                    type="number" 
                    placeholder="e.g. 42" 
                    value={formData.cost_price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              {formData.product_type === "data" && (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="space-y-2">
                    <Label htmlFor="count">Data Size (MB/GB)</Label>
                    <Input 
                      id="count" 
                      name="count" 
                      placeholder="e.g. 1250MB" 
                      value={formData.count} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validity">Validity</Label>
                    <Select 
                      value={formData.validity} 
                      onValueChange={(val) => handleSelectChange("validity", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select validity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24 Hours">24 Hours</SelectItem>
                        <SelectItem value="7 Days">7 Days</SelectItem>
                        <SelectItem value="30 Days">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditOpen ? "Save Changes" : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Delete Product
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold text-gray-900">{currentProduct?.product_name}</span>?
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
