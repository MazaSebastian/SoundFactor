import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-8 pb-20 overflow-hidden">
            {/* Ambient background for admin */}
            <div className="ambient-orb ambient-orb-purple w-[600px] h-[600px] -top-40 -left-40 animate-pulse-glow" />
            <div
                className="ambient-orb ambient-orb-green w-[400px] h-[400px] bottom-40 -right-40 animate-pulse-glow"
                style={{ animationDelay: "2s" }}
            />

            <div className="section-container relative z-10">
                <AdminHeader />

                <div className="flex flex-col lg:flex-row" style={{ gap: '2rem', marginTop: '4rem' }}>
                    <AdminSidebar />
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
