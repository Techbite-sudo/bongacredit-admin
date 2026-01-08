import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, DollarSign, Smartphone, Users, Wifi, RefreshCw, Download, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your business performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </Button>
            <Button 
              onClick={fetchData}
              className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="modern-card overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</CardTitle>
              <div className="p-2 bg-green-50 rounded-full">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">KES {stats?.total_revenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="modern-card overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Transactions</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.total_transactions?.toLocaleString() || 0}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="modern-card overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</CardTitle>
              <div className="p-2 bg-purple-50 rounded-full">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.unique_customers?.toLocaleString() || 0}</div>
              <p className="text-xs text-purple-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +4.3% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="modern-card overflow-hidden border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Success Rate</CardTitle>
              <div className="p-2 bg-orange-50 rounded-full">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.total_transactions > 0 
                  ? Math.round((stats?.successful_transactions / stats?.total_transactions) * 100) 
                  : 0}%
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Based on {stats?.total_transactions || 0} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart */}
          <Card className="col-span-4 modern-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43B02A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#43B02A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `K${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: '#111827',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#43B02A" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="col-span-3 modern-card flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-gray-100">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          txn.product_type === "data" ? "bg-blue-50 text-blue-600" : 
                          txn.product_type === "sms" ? "bg-yellow-50 text-yellow-600" : 
                          "bg-green-50 text-green-600"
                        )}>
                          {txn.product_type === "data" ? <Wifi className="w-5 h-5" /> : 
                           txn.product_type === "sms" ? <Smartphone className="w-5 h-5" /> : 
                           <CreditCard className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{txn.product_name || "Unknown Product"}</p>
                          <p className="text-xs text-gray-500 font-mono">{txn.phone_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">KES {txn.amount}</p>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full",
                          txn.status === "completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        )}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">No transactions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 mt-auto">
              <Link href="/transactions">
                <Button variant="ghost" className="w-full text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5">
                  View All Transactions
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
