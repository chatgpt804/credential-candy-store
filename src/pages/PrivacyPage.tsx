
import MainLayout from "@/components/layout/MainLayout";

const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <p className="lead">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
          
          <h2>1. Information We Collect</h2>
          <p>
            When you use Credential Store, we collect the following types of information:
          </p>
          <ul>
            <li>Personal information you provide (e.g., email address when you register)</li>
            <li>Information about your account usage</li>
            <li>Log data and device information</li>
            <li>Cookies and similar technologies</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and manage your account</li>
            <li>Send you technical notices and support messages</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Protect against fraudulent or unauthorized activities</li>
          </ul>
          
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your information in the following situations:
          </p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a business transfer or transaction</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul>
            <li>Access to your data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your data</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
          </ul>
          
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website or through other communication channels.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@credentialstore.com.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;
