document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");

  const btnTransfer = document.getElementById("btn-transfer");
  const btnPay = document.getElementById("btn-pay");
  const btnCard = document.getElementById("btn-card");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      showScreen("dashboard-screen");
      renderDashboard();
      showToast("Login realizado (modo demonstração) ✅");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      showScreen("login-screen");
      showToast("Sessão encerrada (fake) 👋");
    });
  }

  if (btnTransfer) {
    btnTransfer.addEventListener("click", () => {
      showToast("Função de transferência disponível apenas para demonstração 💸");
    });
  }

  if (btnPay) {
    btnPay.addEventListener("click", () => {
      showToast("Pagamento de contas indisponível neste ambiente fake 🧾");
    });
  }

  if (btnCard) {
    btnCard.addEventListener("click", () => {
      showToast("Cartão virtual gerado… na sua imaginação 😎");
    });
  }

  showScreen("login-screen");
});