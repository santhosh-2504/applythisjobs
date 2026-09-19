import React, { useState, useEffect } from "react";

export default function EditJobModal({ job, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyLogo: "",
    shortDescription: "",
    lengthyDescription: "",
    skills: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    niche: "Software Engineering",
    applyLink: "",
    companyDescription: "",
    industry: "Technology",
    experienceLevel: "Mid",
    benefits: "",
    remoteOption: false,
    companyWebsite: "",
    featuredJob: false,
    expiryDate: "",
    isClosed: false,
    keywords: "",
    recruiterEmail: "",
    recruiterPhone: ""
  });

  const [activeTab, setActiveTab] = useState("basic"); // "basic" | "descriptions" | "extra"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job) {
      setTimeout(() => {
        setFormData({
          title: job.title || "",
          companyName: job.companyName || "",
          companyLogo: job.companyLogo || "",
          shortDescription: job.shortDescription || "",
          lengthyDescription: job.lengthyDescription || "",
          skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
          location: Array.isArray(job.location) ? job.location.join(", ") : job.location || "",
          jobType: job.jobType || "Full-time",
          salary: job.salary || "",
          niche: job.niche || "Software Engineering",
          applyLink: job.applyLink || "",
          companyDescription: job.companyDescription || "",
          industry: job.industry || "Technology",
          experienceLevel: job.experienceLevel || "Mid",
          benefits: Array.isArray(job.benefits) ? job.benefits.join(", ") : job.benefits || "",
          remoteOption: Boolean(job.remoteOption),
          companyWebsite: job.companyWebsite || "",
          featuredJob: Boolean(job.featuredJob),
          expiryDate: job.expiryDate ? new Date(job.expiryDate).toISOString().split("T")[0] : "",
          isClosed: Boolean(job.isClosed),
          keywords: Array.isArray(job.keywords) ? job.keywords.join(", ") : job.keywords || "",
          recruiterEmail: job.recruiterContact?.email || "",
          recruiterPhone: job.recruiterContact?.phone || ""
        });
      }, 0);
    }
  }, [job]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const adminSecret = localStorage.getItem("admin_secret") || "";

    const payload = {
      title: formData.title,
      companyName: formData.companyName,
      companyLogo: formData.companyLogo,
      shortDescription: formData.shortDescription,
      lengthyDescription: formData.lengthyDescription,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      location: formData.location.split(",").map((l) => l.trim()).filter(Boolean),
      jobType: formData.jobType,
      salary: formData.salary,
      niche: formData.niche,
      applyLink: formData.applyLink,
      companyDescription: formData.companyDescription,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,
      benefits: formData.benefits.split(",").map((b) => b.trim()).filter(Boolean),
      remoteOption: formData.remoteOption,
      companyWebsite: formData.companyWebsite,
      featuredJob: formData.featuredJob,
      expiryDate: formData.expiryDate ? formData.expiryDate : null,
      isClosed: formData.isClosed,
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      recruiterContact: {
        email: formData.recruiterEmail,
        phone: formData.recruiterPhone
      }
    };

    try {
      const res = await fetch(`/api/admin/jobs/${job._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update job");
      }

      onSaveSuccess(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>✏️ Edit Job Listing</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {job._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "basic"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            📋 Basic Info & Links
          </button>
          <button
            onClick={() => setActiveTab("descriptions")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "descriptions"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            📝 Job Descriptions
          </button>
          <button
            onClick={() => setActiveTab("extra")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === "extra"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚙️ Extra Details & Status
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 p-4 m-6 mb-0 text-sm rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-200">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Apply Link (URL) *</label>
                <input
                  type="url"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Logo (URL) *</label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range *</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. $120,000 - $150,000/yr"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Niche *</label>
                <input
                  type="text"
                  name="niche"
                  value={formData.niche}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineering"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location (comma-separated)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote, San Francisco, CA"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Next.js, Node.js, MongoDB"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {activeTab === "descriptions" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (Cards & Snippets) *</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lengthy Description (Full Job Details) *</label>
                <textarea
                  name="lengthyDescription"
                  value={formData.lengthyDescription}
                  onChange={handleChange}
                  rows={8}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {activeTab === "extra" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website (URL)</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Benefits (comma-separated)</label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="e.g. Health Insurance, 401k, Unlimited PTO"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g. frontend, remote, javascript"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recruiter Email</label>
                <input
                  type="email"
                  name="recruiterEmail"
                  value={formData.recruiterEmail}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remoteOption"
                    checked={formData.remoteOption}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-200">🌐 Remote Allowed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featuredJob"
                    checked={formData.featuredJob}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-medium text-amber-300">⭐ Featured Job</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isClosed"
                    checked={formData.isClosed}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-medium text-rose-300">🔴 Mark Job Closed</span>
                </label>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-lg transition flex items-center gap-2"
            >
              {loading ? "Saving Changes..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
