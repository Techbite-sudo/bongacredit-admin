import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, DollarSign, Smartphone, Users, Wifi } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", total: 1200 },
  { name: "Tue", total: 2100 },
  { name: "Wed", total: 1800 },
  { name: "Thu", total: 2400 },
  { name: "Fri", total: 3200 },
  { name: "Sat", total: 4500 },
  { name: "Sun", total: 3800 },
];

const recentTransactions = [
  { id: "TXN-8923", phone: "0712***456", amount: "KES 55", product: "1.25GB Data", status: "Success", time: "2 min ago" },
  { id: "TXN-8922", phone: "0722***789", amount: "KES 20", product: "250MB Data", status: "Success", time: "5 min ago" },
  { id: "TXN-8921", phone: "0799***123", amount: "KES 100", product: "Airtime", status: "Failed", time: "12 min ago" },
  { id: "TXN-8920", phone: "0755***999", amount: "KES 55", product: "1.25GB Data", status: "Success", time: "15 min ago" },
  { id: "TXN-8919", phone: "0110***000", amount: "KES 10", product: "200 SMS", status: "Success", time: "22 min ago" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
          <div className="flex gap-2">
            <button className="brutalist-btn px-4 py-2 text-sm">Download Report</button>
            <button className="brutalist-btn px-4 py-2 text-sm bg-black text-white border-black hover:bg-gray-800">Refresh Data</button>
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
              <div className="text-3xl font-black">KES 45,231</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">+2,350</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">+12,234</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +19% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="brutalist-card bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-black bg-gray-50">
              <CardTitle className="text-sm font-bold uppercase">Success Rate</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">98.2%</div>
              <p className="text-xs font-bold text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.4% from last month
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
                <BarChart data={data}>
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
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center border-2 border-black ${txn.product.includes("Data") ? "bg-blue-100" : txn.product.includes("SMS") ? "bg-yellow-100" : "bg-green-100"}`}>
                        {txn.product.includes("Data") ? <Wifi className="w-5 h-5" /> : txn.product.includes("SMS") ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{txn.product}</p>
                        <p className="text-xs text-gray-500 font-mono">{txn.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black">{txn.amount}</p>
                      <p className={`text-xs font-bold uppercase ${txn.status === "Success" ? "text-green-600" : "text-red-600"}`}>{txn.status}</p>
                    </div>
                  </div>
                ))}
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
