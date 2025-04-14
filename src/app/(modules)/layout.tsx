import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex justify-center bg-gray-100 min-h-screen">
            {children}
            <Toaster />
        </section>
    );
}