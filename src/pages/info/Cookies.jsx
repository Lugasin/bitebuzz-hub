
import React from "react";
import MainLayout from "@/layouts/MainLayout";

const Cookies = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              This Cookie Policy explains how BiteBuzz uses cookies and similar technologies.
            </p>
            
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you've been to the website before.
            </p>
            
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies for various purposes, including:
            </p>
            <ul>
              <li>Remembering your preferences and settings</li>
              <li>Keeping you signed in</li>
              <li>Understanding how you use our site</li>
              <li>Showing you content that is relevant to you</li>
              <li>Improving our services</li>
            </ul>
            
            <h2>Types of Cookies We Use</h2>
            <p>
              We use both session cookies (which expire once you close your browser) and persistent cookies (which stay on your device until you delete them).
            </p>
            
            <h2>Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "Options" or "Preferences" menu of your browser.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@bitebuzz.com" className="text-primary hover:underline">privacy@bitebuzz.com</a>.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cookies;
