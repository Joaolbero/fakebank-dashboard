function getStoredUsers() {
  try {
    const data = localStorage.getItem("fakebank_users");
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

function setStoredUsers(users) {
  try {
    localStorage.setItem("fakebank_users", JSON.stringify(users));
  } catch (e) {}
}

function setCurrentUser(user) {
  try {
    localStorage.setItem("fakebank_current_user", JSON.stringify(user));
  } catch (e) {}
}

function clearCurrentUser() {
  try {
    localStorage.removeItem("fakebank_current_user");
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  const btnTransfer = document.getElementById("btn-transfer");
  const btnPay = document.getElementById("btn-pay");
  const btnCard = document.getElementById("btn-card");

  const toggleButtons = document.querySelectorAll(".auth-toggle-btn");
  const forms = document.querySelectorAll(".auth-form");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-auth-target");

      toggleButtons.forEach((b) => b.classList.remove("auth-toggle-btn--active"));
      button.classList.add("auth-toggle-btn--active");

      forms.forEach((form) => {
        form.classList.remove("auth-form--active");
      });

      if (target === "login") {
        const f = document.getElementById("login-form");
        if (f) f.classList.add("auth-form--active");
      } else if (target === "register") {
        const f = document.getElementById("register-form");
        if (f) f.classList.add("auth-form--active");
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      const users = getStoredUsers();

      if (users.length === 0) {
        setCurrentUser({ name: FAKE_USER.name, email: email || "demo@fakebank.local" });
        showScreen("dashboard-screen");
        renderDashboard();
        showToast("Login em modo demonstração");
        return;
      }

      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        showToast("E-mail ou senha inválidos");
        return;
      }

      setCurrentUser({ name: found.name, email: found.email });
      showScreen("dashboard-screen");
      renderDashboard();
      showToast("Login realizado");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("register-name");
      const emailInput = document.getElementById("register-email");
      const passwordInput = document.getElementById("register-password");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (!name || !email || !password) {
        showToast("Preencha todos os campos");
        return;
      }

      const users = getStoredUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

      if (exists) {
        showToast("Já existe uma conta com este e-mail");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      setStoredUsers(users);

      if (emailInput) emailInput.value = "";
      if (passwordInput) passwordInput.value = "";
      if (nameInput) nameInput.value = "";

      const toggleLogin = document.querySelector('[data-auth-target="login"]');
      const toggleRegister = document.querySelector('[data-auth-target="register"]');
      if (toggleLogin && toggleRegister) {
        toggleRegister.classList.remove("auth-toggle-btn--active");
        toggleLogin.classList.add("auth-toggle-btn--active");
      }

      const loginFormEl = document.getElementById("login-form");
      const registerFormEl = document.getElementById("register-form");
      if (loginFormEl && registerFormEl) {
        registerFormEl.classList.remove("auth-form--active");
        loginFormEl.classList.add("auth-form--active");
      }

      const loginEmailInput = document.getElementById("login-email");
      if (loginEmailInput) {
        loginEmailInput.value = email;
      }

      showToast("Conta criada com sucesso");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearCurrentUser();
      showScreen("login-screen");
      showToast("Sessão encerrada");
    });
  }

  if (btnTransfer) {
    btnTransfer.addEventListener("click", () => {
      showToast("Função de transferência disponível apenas para demonstração");
    });
  }

  if (btnPay) {
    btnPay.addEventListener("click", () => {
      showToast("Pagamento de contas indisponível neste ambiente");
    });
  }

  if (btnCard) {
    btnCard.addEventListener("click", () => {
      showToast("Cartão virtual simulado neste ambiente");
    });
  }

  showScreen("login-screen");
});