(async () => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/login.html");

  try {
    const res = await fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = await res.json();
    const div = document.getElementById("profile");

    div.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
    `;
  } catch (err) {
    alert("Failed to load profile");
  }
})();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "/login.html";
});