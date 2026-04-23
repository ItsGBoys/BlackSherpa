import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MountainSilhouette from "@/components/MountainSilhouette";
import TentIcon from "@/components/TentIcon";
import { Eye, EyeOff, Mountain, Tent, Users } from "lucide-react";
import { useAuth, MOCK_USERS, ROLE_LABELS, ROLE_COLORS } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      toast({ title: "Login gagal", description: "Email atau password salah", variant: "destructive" });
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("admin123");
    const success = login(userEmail, "admin123");
    if (success) navigate("/dashboard");
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
              <Input id="email" type="email" placeholder="nama@blacksherpa.id" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/50 border-border focus:border-sherpa-mint focus:ring-sherpa-mint/20 placeholder:text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-muted/50 border-border focus:border-sherpa-mint focus:ring-sherpa-mint/20 pr-10 placeholder:text-muted-foreground/40" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-heading font-semibold tracking-wide hover:bg-primary/90 transition-all duration-300 glow-mint">
              <Tent className="mr-2 h-4 w-4" />Masuk ke Dashboard
            </Button>
          </form>

          <div className="mt-5">
            <button onClick={() => setShowAccounts(!showAccounts)} className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Users size={14} />
              <span>Akun Test (Klik untuk melihat)</span>
              <span className="ml-auto text-xs">{showAccounts ? "▲" : "▼"}</span>
            </button>

            {showAccounts && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.id}
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
                <p className="text-[10px] text-muted-foreground text-center pt-1">Password semua: <span className="font-mono text-foreground">admin123</span></p>
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
};

export default Login;
