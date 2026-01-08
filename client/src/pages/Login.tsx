import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white border-4 border-black mb-4">
            <span className="text-3xl font-black">B</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Bonga<span className="text-green-600">Credit</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Admin Portal Access</p>
        </div>

        <Card className="brutalist-card bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="space-y-1 border-b-4 border-black bg-gray-50 pb-6">
            <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Secure Login
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-bold uppercase text-xs">Username</Label>
                <Input 
                  id="username" 
                  placeholder="ADMIN_USER" 
                  className="brutalist-input h-12 text-lg font-bold"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold uppercase text-xs">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="brutalist-input h-12 text-lg font-bold"
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Dashboard"}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase">
            Restricted Access • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
