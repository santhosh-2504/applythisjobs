import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sections = [
    {
      title: "Welcome to FresherApply",
      content: "Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal data when you use our website at www.fresherapply.com. By accessing or using our services, you agree to this Privacy Policy. We are committed to transparency and protecting your privacy rights while providing our services supported by advertising."
    },
    {
      title: "Eligibility",
      content: `• Our website is not intended for users under the age of 16
• We do not knowingly collect or store data from users under 16
• If we discover we have collected data from a user under 16, we will promptly delete it`
    },
    {
      title: "Information We Collect",
      content: `Technical & Advertising Data:
• Theme preferences (light/dark mode)
• Session information
• Browser type and version
• Device type and operating system
• Anonymous usage statistics
• IP address (for geographic targeting)
• Geographic location (country/city level)
• Ad interaction data
• Browser cookies and similar technologies`
    },
    {
      title: "Advertising and Google AdSense",
      content: `We use Google AdSense to display advertisements on our website. Google AdSense and its certified vendors may use cookies and similar technologies to:

• Show personalized ads based on:
  - Your previous visits to our site
  - Your interests and online behavior
  - Geographic location
  - Browser and device information

• Measure and improve ad performance:
  - Track ad impressions and clicks
  - Analyze user interactions
  - Optimize ad delivery

• Ensure quality and security:
  - Prevent repetitive ads
  - Combat fraud and abuse
  - Verify proper ad display

You can learn more about how Google uses data by visiting Google's Privacy & Terms page at https://policies.google.com/technologies/partner-sites

Ad Personalization Controls:
• Opt out via Google Ad Settings (https://adssettings.google.com)
• Use Network Advertising Initiative opt-out (http://www.networkadvertising.org/choices/)
• Adjust your browser's cookie settings
• Enable "Do Not Track" in your browser`
    },
    {
      title: "How We Use Your Information",
      content: `User Experience:
• Theme preferences for personalized display
• Anonymous analytics to improve website performance
• Session data for security and functionality

Advertising:
• Deliver relevant advertisements through Google AdSense
• Improve ad targeting and performance
• Ensure compliance with advertising policies

Communication:
• Support inquiries via fresherapplyofficial@gmail.com
• Important updates about our service`
    },
    {
      title: "User Rights",
      content: `Access & Control Rights:
• Request detailed information about data usage
• Manage cookie preferences
• Control email notifications and communications
• Opt out of analytics
• Modify theme preferences
• Control ad personalization through Google Ad Settings`
    },
    {
      title: "Data Retention Policy",
      content: `Technical & Advertising Data:
• Analytics data retained for max 26 months
• Session data deleted after session ends
• Advertising cookies per Google AdSense policies
• Cookies expire based on their specific purpose

Data Cleanup:
• Automated data minimization procedures
• Regular data cleanup processes`
    },
    {
      title: "Data Sharing and Third Parties",
      content: `Data Sharing Policy:
• We do not sell user data
• Limited sharing with essential service providers
• Data shared with Google for advertising purposes

Third-Party Services:
• Google AdSense:
  - Provides advertising services
  - Uses cookies for ad personalization
  - Has independent privacy policy
• Google Analytics with privacy-focused configuration:
  - IP anonymization enabled
  - Limited data retention
  - Strict cookie controls

Data Processing:
• All processing occurs on secure servers
• External processors limited to essential services
• Strict data access controls`
    },
    {
      title: "Contact Information",
      content: `For privacy-related inquiries:
• Email us at fresherapplyofficial@gmail.com
• Response within 48 business hours
• Official support channels listed in footer

For urgent concerns:
• Priority response for data-related issues
• Direct support via fresherapplyofficial@gmail.com

For advertising-related inquiries:
• Visit Google Ad Settings for personalization controls
• Email us for general ad questions
• Report inappropriate ads through Google AdSense`
    }
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy | FresherApply</title>
        <meta
          name="description"
          content="Privacy Policy for www.fresherapply.com including Google AdSense third-party cookie policies and user data rights."
        />
        <link rel="canonical" href={`${siteUrl}/privacy-policy`} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                Privacy Policy
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
