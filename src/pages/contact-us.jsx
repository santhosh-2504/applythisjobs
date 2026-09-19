import Head from 'next/head';

export default function ContactUs() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sections = [
    {
      title: "We value your feedback and inquiries.",
      content: "Reach out to us for any questions, suggestions, or concerns!"
    },
    {
      title: "Feedback & Inquiries",
      content: `Feel free to email us directly for:

• Providing feedback for improving the website
• Reporting any issues you face while using the platform
• Recruiter and job posting inquiries`
    },
    {
      title: "External Content Owners",
      content: `If you are an external content owner and have queries or objections regarding job postings shared on our platform, please email us at:

fresherapply@gmail.com`
    },
    {
      title: "Response Time",
      content: "We typically respond within 24-48 hours to all inquiries."
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us | FresherApply</title>
        <meta
          name="description"
          content="Contact FresherApply for support, recruiter inquiries, feedback, or content ownership questions."
        />
        <link rel="canonical" href={`${siteUrl}/contact-us`} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                Contact Us
              </h1>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
