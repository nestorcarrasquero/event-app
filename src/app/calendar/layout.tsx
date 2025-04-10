import { Toaster } from "@/components/ui/sonner";

export default function CalendarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex justify-center bg-gray-100">
            {children}
            <Toaster />
        </section>
    );
}