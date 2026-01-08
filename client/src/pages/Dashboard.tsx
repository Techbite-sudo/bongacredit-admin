import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, DollarSign, Smartphone, Users, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, txnsRes] = await Promise.all([
        api.get("/transactions/stats"),
        api.get("/transactions?pageSize=5")
      ]);

      if (statsRes.data.status === "success") {
        setStats(statsRes.data.data);
      }
      
      if (txnsRes.data.status === "success") {
        setRecentTransactions(txnsRes.data.data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mock chart data for now as backend doesn't return time-series yet
  const chartData = [
    { name: "Mon", total: 1200 },
    { name: "Tue", total: 2100 },
    { name: "Wed", total: 1800 },
    { name: "Thu", total: 2400 },
    { name: "Fri", total: 3200 },
    { name: "Sat", total: 4500 },
    { name: "Sun", total: 3800 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
          <div className="flex gap-2">
            <button className="brutalist-btn px-4 py-2 text-sm">Download Report</button>
            <button 
              onClick={fetchData}
              className="brutalist-btn px-4 py-2 text-sm bg-black text-white border-black hover:bg-gray-800"
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">KES {stats?.total_revenue || 0}</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">{stats?.total_transactions || 0}</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">{stats?.unique_customers || 0}</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Success Rate</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">
                {stats?.total_transactions > 0 
                  ? Math.round((stats?.successful_transactions / stats?.total_transactions) * 100) 
                  : 0}%
              </div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +0% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart */}
          <Card className="col-span-4 brutalist-card bg-white">
            <CardHeader className="border-b-2 border-black bg-gray-50">
              <CardTitle className="uppercase font-black">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#000000" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    fontWeight="bold"
                  />
                  <YAxis 
                    stroke="#000000" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `K${value}`}
                    fontWeight="bold"
                  />
                  <Tooltip 
                    cursor={{fill: '#f5f5f5'}}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 'bold',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Bar dataKey="total" fill="#43B02A" radius={[0, 0, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="col-span-3 brutalist-card bg-white">
            <CardHeader className="border-b-2 border-black bg-gray-50">
              <CardTitle className="uppercase font-black">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-2 divide-gray-100">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center border-2 border-black ${txn.product_type === "data" ? "bg-blue-100" : txn.product_type === "sms" ? "bg-yellow-100" : "bg-green-100"}`}>
                          {txn.product_type === "data" ? <Wifi className="w-5 h-5" /> : txn.product_type === "sms" ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{txn.product_name || "Unknown Product"}</p>
                          <p className="text-xs text-gray-500 font-mono">{txn.phone_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black">KES {txn.amount}</p>
                        <p className={`text-xs font-bold uppercase ${txn.status === "completed" ? "text-green-600" : "text-red-600"}`}>
                          {txn.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-bold">
                    No transactions yet
                  </div>
                )}
              </div>
              <div className="p-4 border-t-2 border-black bg-gray-50">
                <button className="w-full brutalist-btn py-2 text-xs">View All Transactions</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
