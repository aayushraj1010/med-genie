import Layout from "@/components/layout";

export default function CookiePolicyPage() {
  return (
    <Layout>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
      <p className="mb-2">
        This Cookie Policy explains how Med-Genie uses cookies and similar technologies to
        enhance your experience on our platform.
      </p>
      <h2 className="text-xl font-semibold mt-4">What Are Cookies?</h2>
      <p className="mb-2">
        Cookies are small text files stored on your device to remember your preferences and
        improve website functionality.
      </p>
      <h2 className="text-xl font-semibold mt-4">How We Use Cookies</h2>
      <ul className="list-disc list-inside">
        <li>To keep you logged in securely</li>
        <li>To personalize your experience</li>
        <li>To analyze usage and improve performance</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4">Managing Cookies</h2>
      <p>
        You can disable cookies in your browser settings, but some features of Med-Genie may not
        function properly.
      </p>
    </div>
    </Layout>
  );
}

