
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                <p className="text-gray-500 mb-12">Last Updated: January 5, 2026</p>

                <div className="prose prose-stone max-w-none">

                    {/* Section 1 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To minimize risk and prioritize user privacy, FireWatch Global collects only the absolute minimum amount of data required to provide our service:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Email Address:</strong> Required solely for the delivery of our "Command Center Briefing" newsletter.</li>
                            <li><strong>Technical Logs:</strong> Minimal server logs (IP address, browser user-agent) for security and abuse prevention purposes.</li>
                        </ul>
                        <p className="text-gray-600 leading-relaxed mt-4">
                            We do <strong>not</strong> collect names, phone numbers, physical location data, or employment details.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Purpose of Use</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Your email address is used effectively for one single purpose:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li>To deliver our daily "Shift Change Report" and major operational alerts.</li>
                            <li>To safeguard our platform against spam or bot activity.</li>
                        </ul>
                        <p className="text-gray-600 leading-relaxed mt-4">
                            We will never sell your email address to advertisers, marketers, or third-party data brokers.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Storage & Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Your data is stored securely using <strong>Supabase</strong>, an enterprise-grade database provider with encryption at rest and in transit. Access to our user database is restricted to essential engineering personnel only.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Disclosure</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We utilize the following trusted third-party service providers to facilitate our operations:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Resend:</strong> Our transactional email partner. They process your email address locally to deliver our newsletters.</li>
                            <li><strong>Vercel:</strong> Our hosting provider, which safeguards traffic logs.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-12 bg-gray-50 p-6 border-l-4 border-emerald-600">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your User Rights</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Under the Australian Privacy Principles (APP) and GDPR guidelines, you have the right to:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Access:</strong> Request a copy of the data we hold on you (your email).</li>
                            <li><strong>Correction:</strong> Update your email address.</li>
                            <li><strong>Deletion:</strong> Request permanent deletion of your data ("Right to be Forgotten").</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from our newsletter at any time using the link in the footer of every email or by contacting us.</li>
                        </ul>
                        <p className="text-gray-600 leading-relaxed font-bold mt-6">
                            Privacy Officer Contact: <a href="mailto:privacy@firewatch.global" className="text-emerald-700 hover:underline">privacy@firewatch.global</a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
