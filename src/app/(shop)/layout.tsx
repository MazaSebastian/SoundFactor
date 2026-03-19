import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/tienda/CartDrawer";
import Link from "next/link";
import Image from "next/image";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>


            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingNavbar />
            <CartDrawer />
        </>
    );
}
