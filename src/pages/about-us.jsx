import Head from 'next/head';

export default function AboutUs() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sections = [
    {
      title: "Welcome to Apply This Jobs!",
      content: "At Apply This Jobs, we believe in empowering job seekers by providing them with the right tools and resources to achieve their career aspirations. Our platform is designed to bridge the gap between opportunity and preparation, ensuring that you have everything you need to thrive in your professional journey."
    },
    {
      title: "What We Do",
      content: `Job Opportunities:
• We curate job openings from various industries, providing direct links to applications.
• Our goal is to simplify your job search process and connect you to opportunities that match your skills and interests.`
    },
    {
      title: "Our Mission",
      content: "We aim to be the one-stop solution for individuals seeking professional growth. Whether you're looking for your dream job or charting your career path, Apply This Jobs is here to guide you every step of the way."
    },
    {
      title: "Why Choose Us?",
      content: `• Curated Content: We handpick job postings to ensure quality and relevance
• Ease of Use: Our intuitive platform makes navigation and interaction seamless
• No Account Required: Job browsing and searching are fully accessible without registration
• Committed to Your Privacy: Your data security is our priority`
    },
    {
      title: "Join Us on This Journey",
      content: "At Apply This Jobs, we are not just a platform; we are a community dedicated to your success. Explore our features, take advantage of our resources, and let us be your partner in professional growth.\n\nLet's shape your future, one opportunity at a time."
    }
  ];

  return (
    <>
      <Head>
        <title>About Us | ApplyThisJobs</title>
        <meta
          name="description"
          content="Learn about ApplyThisJobs.com, our mission to simplify job discovery, and how we connect job seekers directly to employers."
        />
        <link rel="canonical" href={`${siteUrl}/about-us`} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                About Us
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

