"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MountainSilhouette from "@/components/MountainSilhouette";
import TentIcon from "@/components/TentIcon";
import { Eye, EyeOff, Mountain, Tent, Users } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_PRODUKSI: "Admin Produksi",
  PIC_POTONG_GUDANG: "PIC Potong",
  PIC_PRODUKSI: "Produksi",
  PIC_QC: "Quality Control",
  PIC_SEAL: "Seal & Packing",
  PIC_PENGIRIMAN: "Pengiriman",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-primary text-primary-foreground",
  ADMIN_PRODUKSI: "bg-secondary text-secondary-foreground",
  PIC_POTONG_GUDANG: "bg-blue-600 text-foreground",
  PIC_PRODUKSI: "bg-emerald-600 text-foreground",
  PIC_QC: "bg-violet-600 text-foreground",
  PIC_SEAL: "bg-amber-600 text-foreground",
  PIC_PENGIRIMAN: "bg-cyan-600 text-foreground",
};

// These are for the test UI, in production they would come from the database
const MOCK_TEST_ACCOUNTS = [
  { name: "Andi Sherpa", email: "superadmin@blacksherpa.id", role: "SUPER_ADMIN" },
  { name: "Budi Produksi", email: "admin.produksi@blacksherpa.id", role: "ADMIN_PRODUKSI" },
  { name: "Citra Potong", email: "potong@blacksherpa.id", role: "PIC_POTONG_GUDANG" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login gagal", { 
          description: "Email atau password salah", 
        });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Kesalahan", { 
        description: "Terjadi kesalahan saat login", 
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword("admin123");
    setLoading(true);
    
    const result = await signIn("credentials", {
      email: userEmail,
      password: "admin123",
      redirect: false,
    });

    if (result?.error) {
      toast.error("Login gagal", { description: "Email atau password salah" });
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden fabric-texture">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sherpa-mint/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-sherpa-orange/5 rounded-full blur-[100px]" />
      <MountainSilhouette />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="flex flex-col items-center mb-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <TentIcon size={56} />
          <h1 className="mt-4 text-3xl font-heading font-bold tracking-tight">
            <span className="text-gradient-mint">Black Sherpa</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-body tracking-widest uppercase">Manufacturing OS</p>
        </motion.div>

        <motion.div className="rounded-xl border border-border bg-card/80 backdrop-blur-xl p-8 glow-mint" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <Input id="email" type="email" placeholder="nama@blacksherpa.id" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/50 border-border focus:border-sherpa-mint focus:ring-sherpa-mint/20 placeholder:text-muted-foreground/40" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted/50 border-border focus:border-sherpa-mint focus:ring-sherpa-mint/20 pr-10 placeholder:text-muted-foreground/40" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground font-heading font-semibold tracking-wide hover:bg-primary/90 transition-all duration-300 glow-mint">
              <Tent className="mr-2 h-4 w-4" />{loading ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <div className="mt-5">
            <button onClick={() => setShowAccounts(!showAccounts)} className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Users size={14} />
              <span>Akun Test (Database Real)</span>
              <span className="ml-auto text-xs">{showAccounts ? "▲" : "▼"}</span>
            </button>

            {showAccounts && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
                {MOCK_TEST_ACCOUNTS.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => quickLogin(u.email)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-all text-left group"
                  >
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role]}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </button>
                ))}
                <p className="text-[10px] text-muted-foreground text-center pt-1">Password: <span className="font-mono text-foreground">admin123</span></p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.p className="mt-8 text-center text-xs text-muted-foreground/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <Mountain className="inline h-3 w-3 mr-1" />PT Black Sherpa · Sukabumi, Indonesia
        </motion.p>
      </motion.div>
    </div>
  );
}
