import dbConnect from "@/lib/dbConnect";
import { Job } from "@/lib/models/Job";

export default async function handler(req, res) {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const clientSecret = req.headers["x-admin-secret"];

  if (!adminSecret || !clientSecret || clientSecret !== adminSecret) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or unconfigured admin secret key" });
  }


  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "Missing job ID" });
  }

  await dbConnect();

  if (req.method === "PUT") {
    try {
      const updateData = { ...req.body };

      // Process arrays if passed as strings
      if (typeof updateData.skills === "string") {
        updateData.skills = updateData.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (typeof updateData.location === "string") {
        updateData.location = updateData.location.split(",").map((l) => l.trim()).filter(Boolean);
      }
      if (typeof updateData.benefits === "string") {
        updateData.benefits = updateData.benefits.split(",").map((b) => b.trim()).filter(Boolean);
      }
      if (typeof updateData.keywords === "string") {
        updateData.keywords = updateData.keywords.split(",").map((k) => k.trim()).filter(Boolean);
      }
      if (updateData.expiryDate) {
        updateData.expiryDate = new Date(updateData.expiryDate);
      } else if (updateData.expiryDate === "" || updateData.expiryDate === null) {
        updateData.expiryDate = null;
      }

      const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updatedJob) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: updatedJob
      });
    } catch (error) {
      console.error("Admin PUT job error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { isClosed, expiryDate } = req.body;
      const patchData = {};

      if (typeof isClosed === "boolean") patchData.isClosed = isClosed;
      if (expiryDate !== undefined) patchData.expiryDate = expiryDate ? new Date(expiryDate) : null;

      const updatedJob = await Job.findByIdAndUpdate(id, patchData, { new: true });

      if (!updatedJob) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      return res.status(200).json({
        success: true,
        message: `Job status updated (isClosed: ${updatedJob.isClosed})`,
        data: updatedJob
      });
    } catch (error) {
      console.error("Admin PATCH job error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedJob = await Job.findByIdAndDelete(id);

      if (!deletedJob) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully"
      });
    } catch (error) {
      console.error("Admin DELETE job error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
