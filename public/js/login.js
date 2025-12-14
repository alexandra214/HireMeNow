// public/js/login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Fill all fields");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/about-us.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Network error");
  }
});

// Auto-redirect if already logged in
if (localStorage.getItem("token")) window.location.href = "/about-us.html";