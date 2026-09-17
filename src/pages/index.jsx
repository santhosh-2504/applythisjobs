import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaLaptopHouse,
  FaCalendarAlt,
  FaBuilding,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { fetchJobsData } from '@/lib/getJobs';

export async function getServerSideProps(context) {
  const { query } = context;
  const searchKeyword = query.q || '';
  const city = query.city || 'All';
  const niche = query.niche || 'All';
  const page = parseInt(query.page || '1', 10);

  const data = await fetchJobsData({ city, niche, searchKeyword, page, limit: 6 });

  return {
    props: {
      jobs: data.jobs,
      totalJobs: data.totalJobs,
      totalPages: data.totalPages,
      currentPage: page,
      initialSearchKeyword: searchKeyword,
      initialCity: city,
      initialNiche: niche
    }
  };
}

export default function Home({
  jobs,
  totalJobs,
  totalPages,
  currentPage,
  initialSearchKeyword,
  initialCity,
  initialNiche
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [searchInput, setSearchInput] = useState(initialSearchKeyword);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedNiche, setSelectedNiche] = useState(initialNiche);

  // Debounced auto-search effect (400ms)
  useEffect(() => {
    const currentQueryQ = (router.query.q || '').trim();
    const cleanSearchInput = searchInput.trim();

    if (cleanSearchInput === currentQueryQ) return;

    const timer = setTimeout(() => {
      const query = { ...router.query };
      if (cleanSearchInput) {
        query.q = cleanSearchInput;
      } else {
        delete query.q;
      }
      query.page = 1;

      router.push({ pathname: '/', query }, undefined, { shallow: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, router]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = { ...router.query };
    if (searchInput && searchInput.trim()) {
      query.q = searchInput.trim();
    } else {
      delete query.q;
    }
    query.page = 1;

    router.push({ pathname: '/', query });
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setSelectedCity(val);
    const query = { ...router.query, city: val !== 'All' ? val : undefined, page: 1 };
    router.push({ pathname: '/', query });
  };

  const handleNicheChange = (e) => {
    const val = e.target.value;
    setSelectedNiche(val);
    const query = { ...router.query, niche: val !== 'All' ? val : undefined, page: 1 };
    router.push({ pathname: '/', query });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const activeSearchText = initialSearchKeyword;

  const jobCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPostingCollection',
    itemListElement: (jobs || []).map((job) => ({
      '@type': 'JobPosting',
      '@id': `${siteUrl}/jobs/${job.slug}`,
      title: job.title,
      description: job.shortDescription,
      employmentType: job.jobType === 'Full-Time' ? 'FULL_TIME' : 'CONTRACTOR',
      datePosted: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
      validThrough: job.expiryDate ? new Date(job.expiryDate).toISOString() : undefined,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName,
        sameAs: job.companyWebsite || siteUrl,
        logo: job.companyLogo
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: Array.isArray(job.location) ? job.location[0] : (job.location || 'India'),
          addressRegion: Array.isArray(job.location) ? job.location[1] : 'India',
          addressCountry: 'IN'
        }
      }
    }))
  };

  const sanitizeJSON = (data) =>
    JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <Head>
        <title>ApplyThisJobs | Find Software, Cloud & Engineering Jobs</title>
        <meta
          name="description"
          content={`Browse ${totalJobs} open software, cloud engineering, AI, and data science job listings. Apply directly to leading employers.`}
        />
        <link rel="canonical" href={siteUrl} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="ApplyThisJobs | Find Software, Cloud & Engineering Jobs" />
        <meta property="og:description" content="Browse open software, cloud engineering, AI, and data science job listings. Apply directly to leading tech employers." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ApplyThisJobs" />
        <meta property="og:image" content={`${siteUrl}/favicon.ico`} />
        <meta property="og:image:alt" content="ApplyThisJobs Logo" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ApplyThisJobs | Find Software, Cloud & Engineering Jobs" />
        <meta name="twitter:description" content="Browse open software, cloud engineering, AI, and data science job listings. Apply directly to leading tech employers." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJSON(jobCollectionSchema) }}
        />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 pb-16">
        {/* Hero & Search Header */}
        <section className="bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30">
              Verified Career Opportunities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Apply Direct To Your Next <span className="text-blue-400">Tech Career</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Search curated software development, cloud infrastructure, AI, data science, and remote job openings.
            </p>

            {/* Search Box - 50/50 Grid on Mobile, Flex on Desktop */}
            <form onSubmit={handleSearchSubmit} className="pt-4 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col md:flex-row gap-2 border border-gray-100 dark:border-gray-700">
                <div className="flex-1 flex items-center px-3.5 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
                  <FaSearch className="text-gray-400 mr-2 text-sm flex-shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by job title, company, skills (e.g. React, AWS)..."
                    className="w-full py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium outline-none border border-transparent focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="All">All Cities</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi NCR</option>
                  </select>

                  <select
                    value={selectedNiche}
                    onChange={handleNicheChange}
                    className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium outline-none border border-transparent focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Software Development">Software Dev</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Artificial Intelligence">AI & ML</option>
                    <option value="Web Development">Web UI</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud Computing">Cloud Architect</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeSearchText ? `Search Results for "${activeSearchText}"` : 'Latest Job Postings'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {jobs.length} of {totalJobs} active open positions
              </p>
            </div>

            {(activeSearchText || selectedCity !== 'All' || selectedNiche !== 'All') && (
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Clear Filters
              </Link>
            )}
          </div>

          {/* Jobs Grid */}
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <article
                  key={job._id || job.slug}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col justify-between ${
                    job.featuredJob ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div>
                    {/* Header: Logo & Title */}
                    <div className="flex items-start space-x-4 mb-4">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={`${job.companyName} logo`}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg flex-shrink-0">
                          <FaBuilding />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md mb-1">
                          {job.niche}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white truncate" title={job.title}>
                          {job.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.companyName}</p>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                      {job.shortDescription}
                    </p>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1.5 truncate">
                        <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" />
                        <span className="truncate">
                          {Array.isArray(job.location) ? job.location[0] : job.location}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 truncate">
                        <FaMoneyBillWave className="text-green-500 flex-shrink-0" />
                        <span className="truncate">{job.salary || 'Best in Industry'}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 truncate">
                        <FaBriefcase className="text-purple-500 flex-shrink-0" />
                        <span className="truncate">{job.jobType}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 truncate">
                        <FaLaptopHouse className="text-indigo-500 flex-shrink-0" />
                        <span className="truncate">{job.remoteOption ? 'Remote' : 'On-Site'}</span>
                      </div>
                    </div>

                    {/* Skills Pills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px] rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 text-[11px] rounded-md">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-2">
                    <span className="text-[11px] text-gray-400 flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" />
                      {formatDate(job.createdAt)}
                    </span>

                    <Link
                      href={`/jobs/${job.slug}`}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-base mb-4">
                No jobs matched your filter criteria. Try searching with different keywords.
              </p>
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                View All Available Jobs
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center space-x-1.5 sm:space-x-2">
              {currentPage > 1 ? (
                <Link
                  href={{ pathname: '/', query: { ...router.query, page: currentPage - 1 } }}
                  className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                >
                  <FaChevronLeft className="text-[10px]" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              ) : (
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800/50 text-gray-400 text-xs font-semibold rounded-lg border border-gray-100 dark:border-gray-800 cursor-not-allowed flex items-center space-x-1">
                  <FaChevronLeft className="text-[10px]" />
                  <span className="hidden sm:inline">Previous</span>
                </span>
              )}

              {getPageNumbers().map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-2 text-xs font-semibold text-gray-400">
                    ...
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={{ pathname: '/', query: { ...router.query, page: p } }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      p === currentPage
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              {currentPage < totalPages ? (
                <Link
                  href={{ pathname: '/', query: { ...router.query, page: currentPage + 1 } }}
                  className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="text-[10px]" />
                </Link>
              ) : (
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800/50 text-gray-400 text-xs font-semibold rounded-lg border border-gray-100 dark:border-gray-800 cursor-not-allowed flex items-center space-x-1">
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="text-[10px]" />
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
