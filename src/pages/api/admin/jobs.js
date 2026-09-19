import dbConnect from "@/lib/dbConnect";
import { Job } from "@/lib/models/Job";

function generateSlug(title, companyName) {
  const t = (title || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const c = (companyName || "company").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${t}-${c}-${rand}`;
}

export default async function handler(req, res) {
  const adminSecret = process.env.ADMIN_SECRET_KEY || "applythisadmin2026";
  const clientSecret = req.headers["x-admin-secret"];

  if (!clientSecret || clientSecret !== adminSecret) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid admin secret key" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();
      const formattedJobs = jobs.map((j) => ({
        ...j,
        _id: j._id.toString(),
        createdAt: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: j.updatedAt ? new Date(j.updatedAt).toISOString() : undefined,
        expiryDate: j.expiryDate ? new Date(j.expiryDate).toISOString() : null,
      }));
      return res.status(200).json({ success: true, count: formattedJobs.length, data: formattedJobs });
    } catch (error) {
      console.error("Admin GET jobs error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      let inputJobs = [];

      if (Array.isArray(body)) {
        inputJobs = body;
      } else if (body && typeof body === "object") {
        inputJobs = [body];
      } else {
        return res.status(400).json({ success: false, message: "Invalid payload: Expected JSON object or array" });
      }

      const createdJobs = [];

      for (const item of inputJobs) {
        if (!item.title || !item.companyName || !item.applyLink) {
          return res.status(400).json({
            success: false,
            message: `Missing required fields (title, companyName, applyLink) in item: ${item.title || "Untitled"}`
          });
        }

        const slug = item.slug || generateSlug(item.title, item.companyName);

        // Normalize array fields if passed as comma strings
        const skills = Array.isArray(item.skills)
          ? item.skills
          : typeof item.skills === "string"
          ? item.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : ["General"];

        const location = Array.isArray(item.location)
          ? item.location
          : typeof item.location === "string"
          ? item.location.split(",").map((l) => l.trim()).filter(Boolean)
          : ["Remote"];

        const benefits = Array.isArray(item.benefits)
          ? item.benefits
          : typeof item.benefits === "string"
          ? item.benefits.split(",").map((b) => b.trim()).filter(Boolean)
          : [];

        const keywords = Array.isArray(item.keywords)
          ? item.keywords
          : typeof item.keywords === "string"
          ? item.keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : [];

        const newJob = await Job.create({
          title: item.title,
          companyName: item.companyName,
          companyLogo: item.companyLogo || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop",
          shortDescription: item.shortDescription || item.title,
          lengthyDescription: item.lengthyDescription || item.shortDescription || item.title,
          skills,
          location,
          jobType: item.jobType || "Full-time",
          salary: item.salary || "Competitive",
          niche: item.niche || "Software Engineering",
          applyLink: item.applyLink,
          companyDescription: item.companyDescription || item.companyName,
          industry: item.industry || "Technology",
          experienceLevel: ["Entry", "Mid", "Senior"].includes(item.experienceLevel) ? item.experienceLevel : "Mid",
          benefits,
          remoteOption: Boolean(item.remoteOption),
          companyWebsite: item.companyWebsite || "",
          featuredJob: Boolean(item.featuredJob),
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          isClosed: Boolean(item.isClosed),
          keywords,
          recruiterContact: {
            email: item.recruiterContact?.email || "",
            phone: item.recruiterContact?.phone || ""
          },
          slug
        });

        createdJobs.push(newJob);
      }

      return res.status(201).json({
        success: true,
        message: `Successfully created ${createdJobs.length} job(s)`,
        data: createdJobs
      });
    } catch (error) {
      console.error("Admin POST jobs error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
