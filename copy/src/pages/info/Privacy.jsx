
import React from "react";
import MainLayout from "@/layouts/MainLayout";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              This Privacy Policy describes how BiteBuzz collects, uses, and shares your personal information.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, phone number, delivery address, and payment information.
            </p>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, such as to process your orders, send you order updates, and respond to your inquiries.
            </p>
            
            <h2>Information Sharing</h2>
            <p>
              We may share your information with restaurants to fulfill your orders, with delivery partners to deliver your orders, and with service providers who perform services on our behalf.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to access, update, or delete your information.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@bitebuzz.com" className="text-primary hover:underline">privacy@bitebuzz.com</a>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
