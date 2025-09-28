export default function TermsOfUsePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p className="mb-2">
        Welcome to Med-Genie. By using our platform, you agree to the following terms and
        conditions:
      </p>
      <h2 className="text-xl font-semibold mt-4">1. Use of Service</h2>
      <p className="mb-2">
        Med-Genie provides AI-powered health insights. Our services are not a replacement for
        professional medical advice.
      </p>
      <h2 className="text-xl font-semibold mt-4">2. User Responsibilities</h2>
      <ul className="list-disc list-inside">
        <li>You must provide accurate information when registering.</li>
        <li>You are responsible for maintaining your account security.</li>
        <li>You agree not to misuse or exploit the service.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4">3. Disclaimer</h2>
      <p>
        Med-Genie is for informational purposes only and should not replace consultations with
        qualified healthcare professionals.
      </p>
    </div>
  );
}
