
import React from "react";
import MainLayout from "@/layouts/MainLayout";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              By using the BiteBuzz platform, you agree to these terms and conditions.
            </p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the BiteBuzz platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use the BiteBuzz platform for personal, non-commercial purposes only. This is the grant of a license, not a transfer of title.
            </p>
            
            <h2>3. User Accounts</h2>
            <p>
              To use certain features of our platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2>4. Privacy Policy</h2>
            <p>
              Your use of BiteBuzz is also governed by our Privacy Policy, which can be found <a href="/privacy" className="text-primary hover:underline">here</a>.
            </p>
            
            <h2>5. Limitation of Liability</h2>
            <p>
              BiteBuzz shall not be liable for any direct, indirect, incidental, special, consequential or punitive damages resulting from your use or inability to use the service.
            </p>
            
            <h2>6. Changes to Terms</h2>
            <p>
              BiteBuzz reserves the right to modify these terms at any time. We will notify users of any significant changes to these terms.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@bitebuzz.com" className="text-primary hover:underline">legal@bitebuzz.com</a>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
