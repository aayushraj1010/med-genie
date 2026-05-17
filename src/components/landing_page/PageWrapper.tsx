export default function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <main className="pt-[90px]">
            {children}
        </main>
    );
}