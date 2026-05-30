import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Terms & Conditions</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: May 1, 2024</p>

        <div className="space-y-8">
          {[
            { title: "1. Acceptance of Terms", content: "By accessing or using WriteFlow AI, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service." },
            { title: "2. Use of Service", content: "WriteFlow AI grants you a limited, non-exclusive, non-transferable license to use our platform for your personal or business content creation needs. You may not use the service for any illegal or unauthorized purpose." },
            { title: "3. Content Ownership", content: "You retain ownership of all content you create using WriteFlow AI. By using our service, you grant us a limited license to process your content solely for the purpose of providing the service." },
            { title: "4. Prohibited Uses", content: "You may not use WriteFlow AI to generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. We reserve the right to terminate accounts that violate these terms." },
            { title: "5. Subscription and Billing", content: "Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time. Refunds are provided at our discretion for unused portions of annual subscriptions." },
            { title: "6. Limitation of Liability", content: "WriteFlow AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service." },
            { title: "7. Changes to Terms", content: "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
