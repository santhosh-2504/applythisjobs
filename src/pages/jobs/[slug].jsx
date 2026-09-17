import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaLaptopHouse,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaBan
} from 'react-icons/fa';
import { fetchJobBySlug, fetchSimilarJobs } from '@/lib/getJobs';
import { isJobClosedOrExpired } from '@/lib/jobUtils';

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const { job } = await fetchJobBySlug(slug);

  if (!job) {
    return {
      notFound: true
    };
  }

  const similarJobs = await fetchSimilarJobs(slug, job.niche, 4);

  return {
    props: {
      job,
      similarJobs
    }
  };
}

export default function JobDetails({ job, similarJobs }) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/jobs/${job.slug}`;

  const isClosed = isJobClosedOrExpired(job);

  const safeIsoDate = (dateVal) => {
    if (!dateVal) return undefined;
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };

  const mapEmploymentType = (type) => {
    if (!type) return 'FULL_TIME';
    const lower = type.toLowerCase();
    if (lower.includes('part')) return 'PART_TIME';
    if (lower.includes('contract')) return 'CONTRACTOR';
    if (lower.includes('intern')) return 'INTERN';
    return 'FULL_TIME';
  };

  // Structured Data (Schema.org JobPosting for Google Jobs Rich Results)
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.lengthyDescription || job.shortDescription,
    employmentType: mapEmploymentType(job.jobType),
    datePosted: safeIsoDate(job.createdAt) || new Date().toISOString(),
    validThrough: safeIsoDate(job.expiryDate),
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
    },
    ...(job.remoteOption ? { jobLocationType: 'TELECOMMUTE' } : {}),
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        unitText: 'YEAR',
        value: job.salary || 'Competitive'
      }
    },
    skills: job.skills ? job.skills.join(', ') : '',
    industry: job.industry,
    experienceRequirements: job.experienceLevel ? `${job.experienceLevel} Level` : 'Entry Level'
  };

  const sanitizeJSON = (data) =>
    JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

  return (
    <>
      <Head>
        <title>{`${job.title} at ${job.companyName} | ApplyThisJobs`}</title>
        <meta
          name="description"
          content={job.shortDescription || `Apply for ${job.title} position at ${job.companyName}. Location: ${job.location}`}
        />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${job.title} at ${job.companyName} | ApplyThisJobs`} />
        <meta property="og:description" content={job.shortDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ApplyThisJobs" />
        {job.companyLogo && <meta property="og:image" content={job.companyLogo} />}
        {job.companyLogo && <meta property="og:image:alt" content={`${job.companyName} logo`} />}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${job.title} at ${job.companyName} | ApplyThisJobs`} />
        <meta name="twitter:description" content={job.shortDescription} />
        {job.companyLogo && <meta name="twitter:image" content={job.companyLogo} />}

        {/* Schema.org JobPosting JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJSON(jobPostingSchema) }}
        />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to All Jobs
          </button>

          {/* Job Closed / Expired Alert Banner */}
          {isClosed && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 text-amber-900 dark:text-amber-200 flex items-start space-x-3 shadow-md">
              <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <strong className="font-bold">Applications Closed:</strong> This job posting has expired or is no longer accepting new responses. You can explore active recommendations below.
              </div>
            </div>
          )}

          {/* Main Hero Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={`${job.companyName} logo`}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100 dark:border-gray-700 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl flex-shrink-0">
                    <FaBuilding />
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-block text-xs uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-md">
                      {job.niche}
                    </span>
                    {isClosed && (
                      <span className="inline-block text-xs uppercase font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 px-2.5 py-0.5 rounded-md">
                        Closed
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {job.title}
                  </h1>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {job.companyName}
                  </p>
                </div>
              </div>

              {/* Apply Action / Disabled State */}
              {isClosed ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold text-sm rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FaBan className="text-xs text-red-500" />
                  <span>Not Accepting Responses</span>
                </button>
              ) : (
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Apply Now</span>
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              )}
            </div>

            {/* Quick Meta Grid */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <span className="text-gray-400 block mb-1">Location</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-1.5" />
                  {Array.isArray(job.location) ? job.location.join(', ') : job.location}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <span className="text-gray-400 block mb-1">Salary</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaMoneyBillWave className="text-green-500 mr-1.5" />
                  {job.salary}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <span className="text-gray-400 block mb-1">Job Type</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaBriefcase className="text-purple-500 mr-1.5" />
                  {job.jobType}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <span className="text-gray-400 block mb-1">Work Setup</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaLaptopHouse className="text-indigo-500 mr-1.5" />
                  {job.remoteOption ? 'Remote' : 'On-Site'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Main Column: Detailed Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Short Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Job Summary</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {job.shortDescription}
                </p>
              </div>

              {/* Detailed Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detailed Description & Requirements</h2>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
                  {job.lengthyDescription}
                </div>
              </div>

              {/* Required Skills & Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center mb-3">
                    <FaGraduationCap className="text-blue-500 mr-2" />
                    Required Skills & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center mb-3">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      Job Perks & Benefits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((b, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-lg border border-green-100 dark:border-green-800"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* About Employer Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">About {job.companyName}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {job.companyDescription || 'Leading technology employer providing software solutions and digital products.'}
                </p>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-xs">
                  {job.industry && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Industry:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{job.industry}</span>
                    </div>
                  )}

                  {job.experienceLevel && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Level:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{job.experienceLevel} Level</span>
                    </div>
                  )}

                  {job.companyWebsite && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400 pt-1">
                      <span>Website:</span>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline font-semibold truncate max-w-[150px]"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Recruiter Contact if available */}
              {job.recruiterContact && (job.recruiterContact.email || job.recruiterContact.phone) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Recruiter Contact</h3>
                  {job.recruiterContact.email && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                      <FaEnvelope className="text-blue-500" />
                      <a href={`mailto:${job.recruiterContact.email}`} className="hover:underline">
                        {job.recruiterContact.email}
                      </a>
                    </div>
                  )}
                  {job.recruiterContact.phone && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                      <FaPhone className="text-blue-500" />
                      <a href={`tel:${job.recruiterContact.phone}`} className="hover:underline">
                        {job.recruiterContact.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Apply Sidebar Action */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold">
                  {isClosed ? 'Position Status' : 'Ready to Apply?'}
                </h3>
                <p className="text-xs text-blue-200 leading-relaxed">
                  {isClosed
                    ? 'This job posting has been closed by the recruiter.'
                    : 'Click below to open the official employer application page directly in a new tab.'}
                </p>
                {isClosed ? (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-700 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <FaBan className="text-xs text-red-400" />
                    <span>Applications Closed</span>
                  </button>
                ) : (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Continue Application</span>
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Similar / Related Jobs Section */}
          {similarJobs.length > 0 && (
            <div className="pt-10 border-t border-gray-200 dark:border-gray-800 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Similar Active Jobs You Might Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarJobs.map((simJob) => (
                  <Link
                    key={simJob._id || simJob.slug}
                    href={`/jobs/${simJob.slug}`}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all block"
                  >
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                      {simJob.niche}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate mt-2">{simJob.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{simJob.companyName}</p>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">View Position →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
