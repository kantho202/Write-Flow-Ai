import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: May 1, 2024</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          {[
            { title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes your name, email address, and content you create using WriteFlow AI. We also collect usage data to improve our services." },
            { title: "2. How We Use Your Information", content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions. We do not sell your personal information to third parties." },
            { title: "3. AI and Your Content", content: "Content you create using WriteFlow AI is yours. We do not use your content to train our AI models without your explicit consent. Your prompts and generated content are processed by our AI providers (OpenAI) under their privacy policies." },
            { title: "4. Data Security", content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest." },
            { title: "5. Data Retention", content: "We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us." },
            { title: "6. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at privacy@writeflow.ai." },
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
