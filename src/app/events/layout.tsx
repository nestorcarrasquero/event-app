import { Toaster } from "@/components/ui/sonner";

export default function EventsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex justify-center h-screen bg-gray-100">
            {children}
            <Toaster />
        </section>
    );
}