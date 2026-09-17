import dbConnect from './dbConnect';
import { Job } from './models/Job';
import { isJobClosedOrExpired } from './jobUtils';

export { isJobClosedOrExpired };

export async function fetchJobsData(filterOptions = {}) {
  const { city = 'All', niche = 'All', searchKeyword = '', page = 1, limit = 6 } = filterOptions;

  await dbConnect();

  const queryObj = {
    isClosed: { $ne: true }
  };

  if (city && city !== 'All') {
    queryObj.location = { $regex: city, $options: 'i' };
  }

  if (niche && niche !== 'All') {
    const niches = niche.split(',').map((n) => n.trim());
    queryObj.niche = { $in: niches };
  }

  if (searchKeyword) {
    queryObj.$and = [
      {
        $or: [
          { title: { $regex: searchKeyword, $options: 'i' } },
          { lengthyDescription: { $regex: searchKeyword, $options: 'i' } },
          { shortDescription: { $regex: searchKeyword, $options: 'i' } },
          { companyName: { $regex: searchKeyword, $options: 'i' } },
          { skills: { $regex: searchKeyword, $options: 'i' } }
        ]
      }
    ];
  }

  const rawJobs = await Job.find(queryObj)
    .select('-__v')
    .sort({ createdAt: -1 })
    .lean();

  // Filter out any expired jobs dynamically
  const openJobs = rawJobs.filter((j) => !isJobClosedOrExpired(j));

  const totalJobs = openJobs.length;
  const skip = (page - 1) * limit;
  const paginatedJobs = openJobs.slice(skip, skip + limit);

  return {
    jobs: JSON.parse(JSON.stringify(paginatedJobs)),
    totalJobs,
    totalPages: Math.ceil(totalJobs / limit)
  };
}

export async function fetchJobBySlug(slug) {
  await dbConnect();
  const job = await Job.findOne({ slug }).lean();
  return { job: job ? JSON.parse(JSON.stringify(job)) : null };
}

export async function fetchSimilarJobs(currentSlug, niche, limit = 4) {
  await dbConnect();

  const rawJobs = await Job.find({
    slug: { $ne: currentSlug },
    isClosed: { $ne: true }
  })
    .sort({ createdAt: -1 })
    .lean();

  const openJobs = rawJobs.filter((j) => !isJobClosedOrExpired(j));

  let similar = openJobs.filter((j) => j.niche === niche);
  if (similar.length < limit) {
    const existingIds = new Set(similar.map((j) => String(j._id)));
    const fallback = openJobs.filter((j) => !existingIds.has(String(j._id)));
    similar = [...similar, ...fallback];
  }

  return JSON.parse(JSON.stringify(similar.slice(0, limit)));
}
