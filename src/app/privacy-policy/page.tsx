export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Last Updated: October 19, 2025
      </p>
      
      <p className="mb-4">
        Welcome to <strong>Med-Genie</strong>. Your privacy is important to us. This Privacy Policy 
        explains how we collect, use, store, and protect your information when you use our AI-powered 
        health assistant services. By using Med-Genie, you agree to the terms outlined here.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">1. Introduction</h2>
      <p className="mb-4">
        Med-Genie is committed to protecting your personal information and your right to privacy. 
        This policy applies to all information collected through our platform and services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
      <p className="mb-2">We may collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          <strong>Personal Information:</strong> Name, email address, phone number, and location 
          (if provided voluntarily for emergency guidance or local recommendations)
        </li>
        <li>
          <strong>Health-Related Information:</strong> Symptoms or health concerns you share with 
          the assistant and any medical history details you choose to provide
        </li>
        <li>
          <strong>Technical Information:</strong> Device type, operating system, browser type, 
          IP address, general geolocation, app usage statistics, and interaction logs
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
      <p className="mb-2">We use the collected information to:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Provide accurate, relevant, and personalized health guidance</li>
        <li>Improve AI responses and overall service quality</li>
        <li>Assist with emergencies when requested or required</li>
        <li>Ensure platform security, detect abuse, and prevent misuse</li>
      </ul>
      <p className="mb-4">
        <strong>We do not sell</strong> your personal or health information to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Storage & Security</h2>
      <p className="mb-2">We implement robust security measures to protect your data:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Data is transmitted and stored using encryption (in transit and at rest)</li>
        <li>Access is limited to authorized personnel under confidentiality obligations</li>
        <li>
          Security measures are reviewed regularly to prevent unauthorized access, alteration, 
          disclosure, or destruction
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Sharing of Information</h2>
      <p className="mb-2">We may share your information in the following circumstances:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          <strong>With your consent:</strong> For connecting you with healthcare professionals 
          or emergency services
        </li>
        <li>
          <strong>Legal compliance:</strong> When required by law, regulation, or court order
        </li>
        <li>
          <strong>Service providers:</strong> Trusted partners who assist in operating the 
          platform under strict data protection agreements
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Your Rights</h2>
      <p className="mb-2">You have the following rights regarding your personal data:</p>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>Access, correct, or delete your personal data</li>
        <li>Withdraw consent for processing at any time</li>
        <li>Request a copy of your stored data</li>
      </ul>
      <p className="mb-4">
        To exercise these rights, please contact us at:{" "}
        <a 
          href="mailto:privacy@medgenie.ai" 
          className="text-primary hover:underline"
        >
          privacy@medgenie.ai
        </a>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Use of AI & Limitations</h2>
      <p className="mb-4">
        Med-Genie uses AI to provide general health information. It is{" "}
        <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. 
        Always consult a qualified healthcare provider for serious health concerns.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">8. Cookies & Tracking</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          We use cookies and similar technologies to enhance user experience and analyze usage trends
        </li>
        <li>You can control cookie preferences via your browser settings</li>
        <li>
          For more information, please see our{" "}
          <a href="/cookie-policy" className="text-primary hover:underline">
            Cookie Policy
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">9. Data Retention</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          Health-related queries may be anonymized and retained to improve our AI
        </li>
        <li>
          Personally identifiable information is retained only as long as necessary for 
          service delivery or legal compliance
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">10. Third-Party Services</h2>
      <p className="mb-4">
        Our platform may integrate with third-party services (such as authentication providers, 
        analytics tools, or payment processors). These services have their own privacy policies, 
        and we encourage you to review them.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">11. Children's Privacy</h2>
      <p className="mb-4">
        Med-Genie is not intended for children under 13 years of age. We do not knowingly 
        collect personal information from children. If you believe we have inadvertently 
        collected such information, please contact us immediately.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">12. International Data Transfers</h2>
      <p className="mb-4">
        Your information may be transferred to and processed in countries other than your own. 
        We ensure appropriate safeguards are in place to protect your data in compliance with 
        applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">13. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically to reflect improvements, legal changes, 
        or new practices. Updates will be posted with the revised "Last Updated" date above. 
        We encourage you to review this policy regularly.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">14. Contact Us</h2>
      <p className="mb-2">
        If you have any questions or concerns about this Privacy Policy, please contact us:
      </p>
      <div className="mb-4 ml-4">
        <p><strong>Med-Genie Privacy Team</strong></p>
        <p>
          Email:{" "}
          <a 
            href="mailto:privacy@medgenie.ai" 
            className="text-primary hover:underline"
          >
            privacy@medgenie.ai
          </a>
        </p>
        <p>
          Website:{" "}
          <a 
            href="https://med-genie-five.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.medgenie.ai
          </a>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
        <p>
          This Privacy Policy is intended to be globally readable. Depending on your location, 
          additional rights and disclosures may apply under local laws (e.g., GDPR, CCPA). 
          Where required, Med-Genie will provide region-specific notices and mechanisms to 
          exercise your rights.
        </p>
      </div>
    </div>
  );
}
