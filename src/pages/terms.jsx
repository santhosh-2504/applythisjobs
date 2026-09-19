import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sections = [
    {
      title: "Introduction",
      content: "Welcome to www.fresherapply.com. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully. If you do not agree, please refrain from using the platform. Our service is supported by advertising through Google AdSense."
    },
    {
      title: "Services Provided",
      content: `www.fresherapply.com is a job portal offering:
1. Links to job applications and fresher career listings
2. Targeted advertising content through Google AdSense

Users can browse, search, and apply for jobs without creating an account.`
    },
    {
      title: "Advertising and Google AdSense",
      content: `Our platform includes advertising served through Google AdSense. By using our platform, you agree that:

1. You will see advertisements while using our services
2. Advertisements may be personalized based on:
   - Your browsing behavior
   - Geographic location
   - Device information
   - Other factors as described in our Privacy Policy
3. You understand that:
   - We are not responsible for advertiser content
   - Clicking ads will take you to external websites
   - Your interaction with ads is subject to Google's policies
   - You will not engage in invalid click activity
   - You will not interfere with ad delivery

For more information about ad personalization, visit Google's Ad Settings page at https://adssettings.google.com`
    },
    {
      title: "Eligibility",
      content: "To use our services, you must be at least 16 years old. By using www.fresherapply.com, you confirm that you meet this age requirement."
    },
    {
      title: "Intellectual Property",
      content: `All content on www.fresherapply.com, including text, graphics, and logos, is either:
• Original content created by our team
• Licensed content used with permission
• Public domain content appropriately attributed

Users may:
• Access job application links for personal career advancement
• Share content with appropriate attribution
• Provide feedback and suggestions

Users may not:
• Use content commercially without permission
• Modify or create derivative works
• Remove copyright notices or attributions
• Redistribute content on other platforms

Any unauthorized use of our content may result in legal action.`
    },
    {
      title: "External Links",
      content: "Our platform contains links to external websites for job applications and advertisements. These links are provided for convenience, and we are not responsible for the content, accuracy, or practices of third-party sites. We regularly verify and update external links, but users should exercise caution when visiting external sites."
    },
    {
      title: "User Responsibilities",
      content: `By using www.fresherapply.com, you agree to:
1. Provide accurate information when contacting or interacting with the platform
2. Use the platform only for lawful purposes
3. Avoid engaging in fraudulent, malicious, or harmful activities
4. Not interfere with the delivery or display of advertisements
5. Not use automated tools or scripts to interact with ads
6. Not engage in invalid click activity
7. Respect intellectual property rights
8. Follow Google AdSense program policies

You must not disrupt the platform's functionality or compromise the experience of other users.`
    },
    {
      title: "Privacy",
      content: (
        <span>
          By using www.fresherapply.com, you agree to the collection and use of your personal information as described in our{' '}
          <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 font-semibold">
            Privacy Policy
          </Link>
          . This includes information collected for advertising purposes through Google AdSense. Please read our Privacy Policy to understand how we protect and manage your data.
        </span>
      )
    },
    {
      title: "Disclaimer and Limitation of Liability",
      content: "While www.fresherapply.com strives to provide accurate and helpful information, we are not responsible for any damages, losses, or issues that may arise from using our platform, including external job links or advertisements. We do not endorse specific products or services advertised through Google AdSense. Users should verify information independently and use all resources at their own risk."
    },
    {
      title: "Content and Quality Standards",
      content: `We maintain high standards for all content on our platform:
1. Job listings and external links:
   - Regularly verified for validity
   - Checked for appropriate content
   - Promptly updated when necessary
2. Advertising content:
   - Delivered through Google AdSense
   - Subject to Google's content policies
   - Monitored for quality and relevance`
    },
    {
      title: "Governing Law and Jurisdiction",
      content: "These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of this platform will be subject to the exclusive jurisdiction of the courts in India. While the platform primarily targets users in India, it is accessible globally, and users from other regions must comply with their local laws."
    },
    {
      title: "Amendments to Terms",
      content: "www.fresherapply.com reserves the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the updated Terms will take effect immediately upon posting. Users are encouraged to review the Terms periodically to stay informed of any changes."
    }
  ];

  return (
    <>
      <Head>
        <title>Terms and Conditions | FresherApply</title>
        <meta
          name="description"
          content="Terms and Conditions for www.fresherapply.com outlining service terms, Google AdSense disclosures, and user responsibilities."
        />
        <link rel="canonical" href={`${siteUrl}/terms`} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                Terms and Conditions
              </h1>
              
              <div className="text-gray-600 dark:text-gray-300 mb-8">
                Effective Date: January 6, 2025
              </div>

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

              <div className="mt-8 text-gray-600 dark:text-gray-300 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                Thank you for using www.fresherapply.com. If you have any questions or concerns, feel free to contact us at{' '}
                <a href="mailto:fresherapply@gmail.com" className="text-blue-600 dark:text-blue-400 font-semibold underline">
                  fresherapply@gmail.com
                </a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
