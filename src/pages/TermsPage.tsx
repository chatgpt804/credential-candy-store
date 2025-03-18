
import MainLayout from "@/components/layout/MainLayout";

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Credential Store, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          
          <h2>2. Account Sharing Policy</h2>
          <p>
            The accounts provided through Credential Store are meant for personal use only. By using our service, you agree to:
          </p>
          <ul>
            <li>Not share the accounts with others</li>
            <li>Not change account passwords</li>
            <li>Not add additional profiles to streaming accounts</li>
            <li>Only use accounts for personal, non-commercial purposes</li>
            <li>Respect the terms of service of the platforms for which accounts are provided</li>
          </ul>
          
          <h2>3. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2>4. Service Availability</h2>
          <p>
            We do not guarantee that accounts will be available at all times. Accounts may become unavailable due to various factors including but not limited to service changes, password changes, or other circumstances beyond our control.
          </p>
          
          <h2>5. Modification of Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of Credential Store following the posting of changes will be considered your acceptance of those changes.
          </p>
          
          <h2>6. Disclaimer</h2>
          <p>
            The service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted or error-free.
          </p>
          
          <h2>7. Limitation of Liability</h2>
          <p>
            Credential Store shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from your use or inability to use the service.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms of Service.
          </p>
          
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws applicable in the jurisdiction where the service is provided, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
