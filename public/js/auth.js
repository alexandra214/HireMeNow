async function setupAuth() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch(e) {
    console.error("Invalid user data in localStorage");
  }

  const nav = document.getElementById("navLinks");
  if (!nav) return;

  if (!token || !user) {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
    return null;
  }

  let dashboardUrl = "";
  if (user.role === "student") dashboardUrl = "/student-dashboard.html";
  else if (user.role === "employer") dashboardUrl = "/employer-dashboard.html";
  else if (user.role === "admin") dashboardUrl = "/admin-dashboard.html";

  nav.innerHTML = `
    <a href="about-us.html">Home</a>
    ${user.role === "student" ? '<a href="jobs.html">Jobs</a>' : ""}
    ${user.role === "employer" ? '<a href="post-job.html">Post Job</a>' : ""}
    <a href="${dashboardUrl}">Dashboard</a>
    <a href="#" id="logoutLink">Logout</a>
  `;

  document.getElementById("logoutLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/login.html";
  });

  if (user.role === "employer" && document.getElementById("postJobLink")) {
    document.getElementById("postJobLink").style.display = "inline";
  }

  return user;
}

setupAuth();