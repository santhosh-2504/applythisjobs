export function isJobClosedOrExpired(job) {
  if (!job) return false;
  if (job.isClosed === true) return true;
  if (job.expiryDate) {
    const expiry = new Date(job.expiryDate);
    if (!isNaN(expiry.getTime()) && expiry < new Date()) {
      return true;
    }
  }
  return false;
}
