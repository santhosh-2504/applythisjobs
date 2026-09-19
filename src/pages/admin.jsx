import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";

const EditJobModal = dynamic(() => import("@/components/EditJobModal"), { ssr: false });

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // "form" | "json" | "manage"
  const [adminSearch, setAdminSearch] = useState("");

  const [editingJob, setEditingJob] = useState(null);


  // Form State
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop",
    shortDescription: "",
    lengthyDescription: "",
    skills: "React, Node.js",
    location: "Remote",
    jobType: "Full-time",
    salary: "$100,000 - $130,000/year",
    niche: "Software Engineering",
    applyLink: "",
    companyDescription: "Leading technology innovation platform.",
    industry: "Technology",
    experienceLevel: "Mid",
    benefits: "Health Insurance, 401k, Unlimited PTO",
    remoteOption: true,
    companyWebsite: "",
    featuredJob: false,
    expiryDate: "",
    isClosed: false,
    keywords: "developer, remote, software engineering"
  });

  // JSON Raw State
  const [jsonInput, setJsonInput] = useState("");

  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const verifySecret = async (secretToVerify) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { "x-admin-secret": secretToVerify }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminSecret(secretToVerify);
        localStorage.setItem("admin_secret", secretToVerify);
        setJobs(data.data || []);
      } else {
        setIsAuthenticated(false);
        setAuthError(data.message || "Invalid Admin Passkey");
        localStorage.removeItem("admin_secret");
      }
    } catch (err) {
      setIsAuthenticated(false);
      setAuthError(err.message || "Failed to authenticate");
    } finally {
      setAuthLoading(false);
    }
  };

  // Check saved admin secret on mount
  useEffect(() => {
    const savedSecret = localStorage.getItem("admin_secret");
    if (savedSecret) {
      setTimeout(() => {
        setAdminSecret(savedSecret);
        verifySecret(savedSecret);
      }, 0);
    }
  }, []);


  const handleAuthSubmit = (e) => {
    e.preventDefault();
    verifySecret(inputSecret);
  };

  const handleLockAdmin = () => {
    localStorage.removeItem("admin_secret");
    setAdminSecret("");
    setIsAuthenticated(false);
  };

  const fetchJobs = async () => {
    if (!adminSecret) return;
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { "x-admin-secret": adminSecret }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.data || []);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    let payload;

    if (activeTab === "form") {
      payload = {
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
        keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      };
    } else if (activeTab === "json") {
      try {
        payload = JSON.parse(jsonInput);
      } catch (err) {
        setSubmitError("Invalid JSON syntax: " + err.message);
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create job");
      }

      setSubmitMessage(`✅ ${data.message}`);
      if (activeTab === "json") setJsonInput("");
      fetchJobs();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleClosed = async (jobId, currentClosed) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret
        },
        body: JSON.stringify({ isClosed: !currentClosed })
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret }
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Head>
        <title>Admin Portal | ApplyThisJobs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>ApplyThis<span className="text-purple-400">Jobs</span></span>
          <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-700/50">Admin</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-3 text-xs">
            <Link href="/" className="text-slate-400 hover:text-white transition">
              ← View Public Site
            </Link>
            <button
              onClick={handleLockAdmin}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg transition"
            >
              🔒 Lock Admin
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isAuthenticated ? (
          /* Password Unlock Screen */
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🔐</span>
              <h1 className="text-2xl font-bold text-white">Admin Portal Lock</h1>
              <p className="text-xs text-slate-400 mt-1">Enter your admin secret key to manage jobs.</p>
            </div>

            {authError && (
              <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 p-3 mb-4 text-xs rounded">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Passkey / Secret Key</label>
                <input
                  type="password"
                  value={inputSecret}
                  onChange={(e) => setInputSecret(e.target.value)}
                  placeholder="Enter secret key..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg disabled:opacity-50"
              >
                {authLoading ? "Verifying..." : "Unlock Portal"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-8">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-2">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-5 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === "form"
                    ? "border-purple-500 text-purple-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                ➕ Add Job (Visual Form)
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-5 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === "json"
                    ? "border-purple-500 text-purple-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                📋 Add Jobs (Raw JSON Paste)
              </button>
              <button
                onClick={() => {
                  setActiveTab("manage");
                  fetchJobs();
                }}
                className={`px-5 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === "manage"
                    ? "border-purple-500 text-purple-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚙️ Manage All Jobs ({jobs.length})
              </button>
            </div>

            {/* Notification Messages */}
            {submitMessage && (
              <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-300 p-4 text-xs rounded">
                {submitMessage}
              </div>
            )}
            {submitError && (
              <div className="bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 p-4 text-xs rounded">
                {submitError}
              </div>
            )}

            {/* TAB 1: VISUAL FORM INPUT */}
            {activeTab === "form" && (
              <form onSubmit={handleCreateJob} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Add New Job Listing</h2>
                  <span className="text-xs text-slate-400">Fill in details and click Publish</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. TechCorp Inc."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Apply Link (URL) *</label>
                    <input
                      type="url"
                      name="applyLink"
                      value={formData.applyLink}
                      onChange={handleFormChange}
                      required
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Logo (URL) *</label>
                    <input
                      type="url"
                      name="companyLogo"
                      value={formData.companyLogo}
                      onChange={handleFormChange}
                      required
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Salary *</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. $120,000 - $150,000/yr"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Niche *</label>
                    <input
                      type="text"
                      name="niche"
                      value={formData.niche}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Software Engineering"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location (comma-separated)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder="Remote, San Francisco, CA"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleFormChange}
                      placeholder="React, Next.js, TypeScript"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleFormChange}
                      rows={2}
                      required
                      placeholder="Brief overview of the role..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Lengthy Description (Full Details) *</label>
                    <textarea
                      name="lengthyDescription"
                      value={formData.lengthyDescription}
                      onChange={handleFormChange}
                      rows={6}
                      required
                      placeholder="Full job responsibilities and requirements..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 font-semibold text-sm rounded-lg shadow-lg transition"
                  >
                    {submitting ? "Publishing..." : "🚀 Publish Job"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: RAW JSON PASTE */}
            {activeTab === "json" && (
              <form onSubmit={handleCreateJob} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Paste Raw JSON Job Object or Array</h2>
                  <p className="text-xs text-slate-400">
                    Paste a single job object `{"{ ... }"}` or an array `[{"{ ... }"}, {"{ ... }"}]`.
                  </p>
                </div>

                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={14}
                  placeholder={`[\n  {\n    "title": "Senior React Developer",\n    "companyName": "Acme Corp",\n    "applyLink": "https://company.com/apply",\n    "salary": "$140k - $160k",\n    "skills": ["React", "TypeScript"]\n  }\n]`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !jsonInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 font-semibold text-sm rounded-lg shadow-lg transition"
                  >
                    {submitting ? "Processing JSON..." : "⚡ Submit JSON Jobs"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: MANAGE ALL JOBS TABLE */}
            {activeTab === "manage" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Database Job Records</h2>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
                      {jobs.filter((j) => {
                        if (!adminSearch.trim()) return true;
                        const q = adminSearch.toLowerCase().trim();
                        return (
                          (j.title || "").toLowerCase().includes(q) ||
                          (j.companyName || "").toLowerCase().includes(q) ||
                          (j.niche || "").toLowerCase().includes(q) ||
                          (Array.isArray(j.location) ? j.location.join(" ") : j.location || "").toLowerCase().includes(q)
                        );
                      }).length} of {jobs.length} jobs
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-80">
                      <input
                        type="text"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        placeholder="🔍 Search title, company, niche, location..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      />
                      {adminSearch && (
                        <button
                          onClick={() => setAdminSearch("")}
                          className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      onClick={fetchJobs}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {loadingJobs ? (
                  <div className="py-12 text-center text-slate-400 text-sm">Loading jobs from database...</div>
                ) : jobs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">No jobs found in database.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-700">
                        <tr>
                          <th className="px-4 py-3">Job Title & Company</th>
                          <th className="px-4 py-3">Location & Niche</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {jobs
                          .filter((j) => {
                            if (!adminSearch.trim()) return true;
                            const q = adminSearch.toLowerCase().trim();
                            return (
                              (j.title || "").toLowerCase().includes(q) ||
                              (j.companyName || "").toLowerCase().includes(q) ||
                              (j.niche || "").toLowerCase().includes(q) ||
                              (Array.isArray(j.location) ? j.location.join(" ") : j.location || "").toLowerCase().includes(q)
                            );
                          })
                          .map((j) => (
                          <tr key={j._id} className="hover:bg-slate-800/40 transition">

                            <td className="px-4 py-3 font-medium text-white">
                              <div className="flex items-center gap-3">
                                <img
                                  src={j.companyLogo}
                                  alt=""
                                  className="w-8 h-8 rounded object-cover border border-slate-700 bg-slate-800"
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop"; }}
                                />
                                <div>
                                  <Link href={`/jobs/${j.slug}`} target="_blank" className="hover:underline font-bold text-slate-100">
                                    {j.title}
                                  </Link>
                                  <div className="text-slate-400 text-[11px]">{j.companyName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div>{Array.isArray(j.location) ? j.location.join(", ") : j.location}</div>
                              <div className="text-purple-400 text-[11px]">{j.niche}</div>
                            </td>
                            <td className="px-4 py-3">
                              {j.isClosed ? (
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                                  🔴 Closed
                                </span>
                              ) : (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold text-[10px]">
                                  🟢 Open
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingJob(j)}
                                  className="bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 px-2.5 py-1 rounded transition"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleToggleClosed(j._id, j.isClosed)}
                                  className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 px-2.5 py-1 rounded transition"
                                >
                                  {j.isClosed ? "🟢 Re-open" : "🔴 Close"}
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(j._id, j.title)}
                                  className="bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 px-2 py-1 rounded transition"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Modal for editing selected job */}
            {editingJob && (
              <EditJobModal
                job={editingJob}
                onClose={() => setEditingJob(null)}
                onSaveSuccess={() => {
                  fetchJobs();
                  setEditingJob(null);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
