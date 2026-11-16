import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 27, 2026</p>

      <p className="mb-6">
        Welcome to our Invoice Management Platform ("Service"). By accessing or using our Service, you agree to be bound
        by these Terms of Service ("Terms"). If you do not agree, you may not use the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">1. Definitions</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>"Company"</strong> refers to the provider of the Service.
        </li>
        <li>
          <strong>"User"</strong> refers to any individual or entity using the Service.
        </li>
        <li>
          <strong>"Content"</strong> includes invoices, financial data, and any information uploaded.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">2. Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old and capable of forming legally binding contracts to use this Service. By using
        the Service, you represent and warrant that you meet these requirements.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">3. Account Registration</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You agree to provide accurate and complete information.</li>
        <li>You are responsible for all activities under your account.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">4. Use of the Service</h2>
      <p className="mb-4">You agree to use the Service only for lawful purposes. You may not:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Use the Service for fraudulent billing or illegal financial activities.</li>
        <li>Attempt to gain unauthorized access to systems or data.</li>
        <li>Interfere with or disrupt the integrity of the Service.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">5. Financial Data & Responsibility</h2>
      <p className="mb-4">
        The Service provides tools for invoice creation, tracking, and reporting. We do not guarantee the accuracy of
        financial data entered by Users. You are solely responsible for:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Ensuring compliance with tax laws and regulations</li>
        <li>Verifying invoice accuracy</li>
        <li>Maintaining financial records</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">6. Payments & Subscriptions</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Some features may require payment or subscription.</li>
        <li>All fees are non-refundable unless stated otherwise.</li>
        <li>We may change pricing with reasonable notice.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">7. Data Ownership & Privacy</h2>
      <p className="mb-4">
        You retain ownership of your Content. By using the Service, you grant us a limited license to store, process,
        and display your data solely for providing the Service.
      </p>
      <p>Our data practices are governed by our Privacy Policy.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">8. Data Security</h2>
      <p>
        We implement reasonable security measures, but cannot guarantee absolute security. You acknowledge that use of
        the Service is at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">9. Third-Party Integrations</h2>
      <p>
        The Service may integrate with third-party tools (e.g., payment processors, accounting software). We are not
        responsible for third-party services or their policies.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">10. Termination</h2>
      <p className="mb-4">We may suspend or terminate your account at any time if you violate these Terms.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>You may terminate your account at any time.</li>
        <li>Data may be deleted upon termination after a retention period.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">11. Disclaimer of Warranties</h2>
      <p>The Service is provided "as is" and "as available" without warranties of any kind, express or implied.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">12. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential
        damages, including financial losses or data loss.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">13. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Company from any claims, damages, or expenses arising from your use
        of the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">14. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service constitutes acceptance of the updated
        Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">15. Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with applicable laws in your jurisdiction.</p>

      {/*<h2 className="text-2xl font-semibold mt-10 mb-4">16. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us at:</p>
      <p className="mt-2 font-medium">support@yourcompany.com</p>*/}
    </div>
  );
}

export const Route = createFileRoute("/_guest/terms-of-service/")({
  component: RouteComponent,
});
