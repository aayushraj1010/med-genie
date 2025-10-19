import NavBar from "./landing_page/NavBar";
import Footer from "./landing_page/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
