import Navbar from "@/components/landing_page/NavBar";
import FAQs from "@/components/landing_page/FAQ";
import Footer from "@/components/landing_page/Footer";
import Layout from "@/components/layout";

export const metadata = {
  title: "FAQ | MedGenie",
  description: "Frequently Asked Questions about MedGenie AI health assistant.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#090909]">
        <Layout>
          <div className="py-12">
            <FAQs />
          </div>
        </Layout>
      </main>
      <Footer />
    </>
  );
}
