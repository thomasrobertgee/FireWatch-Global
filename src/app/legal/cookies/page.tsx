
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
                <p className="text-gray-500 mb-12">Last Updated: January 5, 2026</p>

                <div className="prose prose-stone max-w-none">
                    <p className="text-gray-600 leading-relaxed mb-8">
                        FireWatch Global uses cookies and similar technologies to ensure our website functions correctly and to improve your user experience. This policy explains what cookies are, how we use them, and your choices.
                    </p>

                    {/* Section 1 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Strictly Necessary Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These cookies are essential for the website to function. Without them, certain services cannot be provided.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Security:</strong> Used to protect against CSRF attacks and secure your session.</li>
                            <li><strong>Consent:</strong> Stores your preference regarding the cookie banner itself (so it doesn't pop up every time).</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Analytics & Performance</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use these tracking identifiers to understand how visitors interact with our content.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Usage Metrics:</strong> Counting page views, reading time, and popular articles anonymously.</li>
                            <li><strong>Error Logging:</strong> Helping us identify broken links or crashes.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Functional Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These allow the website to remember choices you make to provide a more personalized experience.
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-600">
                            <li><strong>Region Preferences:</strong> Remembering if you prefer "Global" or distinct regional news.</li>
                            <li><strong>Theme:</strong> Remembering dark/light mode preferences (if applicable).</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-12 bg-gray-50 p-6 border-l-4 border-stone-400">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Managing Cookies</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            You can control and/or delete cookies as you wish using your browser settings. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
