import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Power, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "1.25GB Data (Midnight)", amount: 55, type: "Data", active: true, profit: 13 },
  { id: 2, name: "250MB Data (24hrs)", amount: 20, type: "Data", active: true, profit: 5 },
  { id: 3, name: "1GB Data (1hr)", amount: 19, type: "Data", active: true, profit: 4 },
  { id: 4, name: "1.5GB Data (3hrs)", amount: 50, type: "Data", active: true, profit: 11 },
  { id: 5, name: "1GB Data (24hrs)", amount: 99, type: "Data", active: true, profit: 22 },
  { id: 6, name: "350MB Data (7 days)", amount: 49, type: "Data", active: true, profit: 10 },
  { id: 7, name: "2.5GB Data (7 days)", amount: 300, type: "Data", active: true, profit: 65 },
  { id: 8, name: "20 SMS (24hrs)", amount: 5, type: "SMS", active: true, profit: 1.8 },
  { id: 9, name: "200 SMS (24hrs)", amount: 10, type: "SMS", active: true, profit: 3.6 },
  { id: 10, name: "1000 SMS (7 days)", amount: 30, type: "SMS", active: true, profit: 10 },
  { id: 11, name: "45 Mins (3hrs)", amount: 22, type: "Airtime", active: true, profit: 2 },
  { id: 12, name: "50 Mins (Midnight)", amount: 51, type: "Airtime", active: true, profit: 4 },
];

export default function Products() {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="brutalist-card bg-white relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-2 h-full ${product.type === "Data" ? "bg-blue-500" : product.type === "SMS" ? "bg-yellow-500" : "bg-green-500"}`} />
              <CardHeader className="pb-2 pl-6">
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold uppercase px-2 py-1 border border-black ${product.type === "Data" ? "bg-blue-100" : product.type === "SMS" ? "bg-yellow-100" : "bg-green-100"}`}>
                    {product.type}
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
                <CardTitle className="text-xl font-black mt-2">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="pl-6">
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Selling Price</p>
                    <p className="text-3xl font-black">KES {product.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Profit</p>
                    <p className="text-xl font-bold text-green-600">+KES {product.profit}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.active ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs font-bold uppercase">{product.active ? "Active" : "Inactive"}</span>
                  </div>
                  <button className="text-xs font-bold uppercase underline hover:text-black text-gray-500 flex items-center gap-1">
                    <Power className="w-3 h-3" />
                    {product.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
