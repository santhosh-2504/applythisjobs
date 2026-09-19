import dbConnect from '@/lib/dbConnect';
import { Job } from '@/lib/models/Job';
import { fetchJobsData } from '@/lib/getJobs';

export default async function handler(req, res) {
  try {
    const { city, niche, q, page, limit, includeClosed } = req.query;

    // Fetch formatted jobs
    const data = await fetchJobsData({
      city: city || 'All',
      niche: niche || 'All',
      searchKeyword: q || '',
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '10', 10),
      includeClosed: includeClosed === 'true'
    });


    return res.status(200).json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('API /api/jobs error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
