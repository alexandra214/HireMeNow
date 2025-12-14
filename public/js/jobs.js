(async () => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/login.html");

  try {
    const res = await fetch("/api/jobs", {
      headers: { authorization: `Bearer ${token}` }  // Changed to lowercase
    });

    if (!res.ok) {
      console.error("Load jobs error:", res.status);
      alert("Failed to load jobs: " + res.status);
      return;
    }

    const jobs = await res.json();
    const list = document.getElementById("jobList");

    if (jobs.length === 0) {
      list.innerHTML = "<p>No jobs available.</p>";
      return;
    }

    list.innerHTML = jobs
      .map(
        (j) => `
      <div class="job-card">
        <h3>${j.title}</h3>
        <p>${j.description}</p>
        <p><strong>Type:</strong> ${j.type}</p>
        <p><strong>Salary:</strong> $${j.salary}</p>
        <button class="btn" data-job-id="${j.id}" onclick="applyToJob(this)">Apply</button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("Load jobs network error:", err);
    alert("Failed to load jobs: " + err.message);
  }
})();

async function applyToJob(button) {
  const jobId = button.dataset.jobId;
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login");

  try {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ jobId })
    });

    const data = await res.json();

    console.log("Apply response status:", res.status);
    console.log("Apply response data:", data);

    if (res.ok) {
      alert("Applied successfully!");
      button.disabled = true;
      button.textContent = "Applied";
    } else {
      alert(data.message || "Failed to apply: " + res.status);
    }
  } catch (err) {
    console.error("Apply network error:", err);
    alert("Network error: " + err.message);
  }
}