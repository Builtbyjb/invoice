import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last Updated: April 27, 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-3">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
          invoice management web application ("Service"). By accessing or using the Service, you agree to the terms of
          this Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <h3 className="font-semibold mt-4 mb-2">a. Personal Information</h3>
        <ul className="list-disc ml-6 mb-3">
          <li>Name, email address, phone number</li>
          <li>Billing and payment details</li>
          <li>Business information (company name, address, tax IDs)</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-2">b. Invoice and Financial Data</h3>
        <ul className="list-disc ml-6 mb-3">
          <li>Invoice details (amounts, dates, recipients)</li>
          <li>Transaction and payment status</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-2">c. Automatically Collected Information</h3>
        <ul className="list-disc ml-6 mb-3">
          <li>IP address, browser type, device information</li>
          <li>Usage data and analytics</li>
          <li>Cookies and tracking technologies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc ml-6">
          <li>To provide, operate, and maintain the Service</li>
          <li>To process invoices and transactions</li>
          <li>To improve user experience and functionality</li>
          <li>To communicate with users, including support and updates</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Legal Basis for Processing (GDPR)</h2>
        <ul className="list-disc ml-6">
          <li>Consent</li>
          <li>Performance of a contract</li>
          <li>Legal obligations</li>
          <li>Legitimate interests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Sharing Your Information</h2>
        <p className="mb-3">We do not sell your personal data. We may share information with:</p>
        <ul className="list-disc ml-6">
          <li>Service providers (hosting, payment processors, analytics)</li>
          <li>Legal authorities when required by law</li>
          <li>Business transfers (mergers, acquisitions)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
        <p>
          We retain your information only as long as necessary to fulfill the purposes outlined in this policy, unless a
          longer retention period is required or permitted by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your data, including encryption,
          secure servers, and access controls. However, no system is completely secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Your Rights</h2>
        <ul className="list-disc ml-6">
          <li>Access and correction</li>
          <li>Data portability</li>
          <li>Deletion ("right to be forgotten")</li>
          <li>Restriction and objection to processing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">9. Cookies and Tracking Technologies</h2>
        <p>We use cookies to enhance your experience. You can control cookie settings through your browser.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">10. Third-Party Services</h2>
        <p>
          Our Service may contain links to third-party websites. We are not responsible for their privacy practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">11. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries outside your jurisdiction, where data
          protection laws may differ.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">12. Children's Privacy</h2>
        <p>Our Service is not intended for individuals under 18. We do not knowingly collect data from children.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">13. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
        </p>
      </section>

      {/*<section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">14. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, contact us at:</p>
        <p className="mt-2">Email: support@example.com</p>
      </section>*/}
    </div>
  );
}

export const Route = createFileRoute("/_guest/privacy-policy/")({
  component: RouteComponent,
});
