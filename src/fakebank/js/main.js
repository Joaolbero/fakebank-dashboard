document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      showScreen("dashboard-screen");
      renderDashboard();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      showScreen("login-screen");
    });
  }
  
  showScreen("login-screen");
});
