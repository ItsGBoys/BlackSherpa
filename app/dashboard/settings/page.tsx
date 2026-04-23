import { Settings, Bell, Shield, Smartphone } from "lucide-react";
import ClientMotionDiv from "@/components/ClientMotionDiv";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <ClientMotionDiv>
        <div className="flex items-center gap-3 mb-1">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Global Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">Konfigurasi sistem dan integrasi API</p>
      </ClientMotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="text-primary" size={20} />
            <h3 className="font-heading font-bold">WhatsApp Business API</h3>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-bold">Status Koneksi</p>
            <p className="text-sm text-primary font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Connected (Ready)
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Template notifikasi otomatis aktif untuk Release JO, Low Stock, dan QC Fail.</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-primary" size={20} />
            <h3 className="font-heading font-bold">System Thresholds</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">WIP Alert Threshold</span>
              <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">48 Jam</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Stock Safety Margin</span>
              <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
