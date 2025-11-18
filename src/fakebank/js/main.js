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

function getCurrentUser() {
  try {
    const stored = localStorage.getItem("fakebank_current_user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && parsed.email) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

function hasCurrentUser() {
  return getCurrentUser() !== null;
}

let currentModalType = null;

function formatTodayDateBR() {
  try {
    return new Date().toLocaleDateString("pt-BR");
  } catch (e) {
    return "Hoje";
  }
}

function generateInitialBalance() {
  const min = 3250.75;
  const max = 15000;
  const r = Math.random() * (max - min) + min;
  return Math.round(r * 100) / 100;
}

function saveSessionState(name, email) {
  try {
    const state = {
      name: name,
      email: email,
      balance: CURRENT_USER_BALANCE,
      transactions: CURRENT_TRANSACTIONS
    };
    sessionStorage.setItem("fakebank_session_state", JSON.stringify(state));
  } catch (e) {}
}

function restoreSessionStateIfAny() {
  try {
    const raw = sessionStorage.getItem("fakebank_session_state");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.balance !== "number" || !Array.isArray(parsed.transactions)) {
      return;
    }
    CURRENT_USER_BALANCE = parsed.balance;
    CURRENT_TRANSACTIONS = parsed.transactions;
  } catch (e) {}
}

function clearSessionState() {
  try {
    sessionStorage.removeItem("fakebank_session_state");
  } catch (e) {}
}

function startNewSessionForUser(name, email) {
  CURRENT_USER_BALANCE = generateInitialBalance();
  CURRENT_TRANSACTIONS = FAKE_TRANSACTIONS.slice();
  saveSessionState(name, email);
}

function openModal(type) {
  currentModalType = type;

  const overlay = document.getElementById("modal-overlay");
  const titleEl = document.getElementById("modal-title");
  const hintEl = document.getElementById("modal-hint");
  const descInput = document.getElementById("modal-description");
  const amountInput = document.getElementById("modal-amount");

  if (!overlay || !titleEl || !hintEl || !descInput || !amountInput) return;

  amountInput.value = "";
  descInput.value = "";

  if (type === "transfer") {
    titleEl.textContent = "Nova transferência";
    hintEl.textContent = "Esta operação é apenas simulação. O saldo será atualizado apenas na interface.";
    descInput.placeholder = "Nome ou chave do destinatário";
  } else if (type === "pay") {
    titleEl.textContent = "Pagamento de conta";
    hintEl.textContent = "Simulação de pagamento de conta. O valor será descontado do saldo exibido.";
    descInput.placeholder = "Descrição da conta";
  } else {
    titleEl.textContent = "Operação";
    hintEl.textContent = "";
    descInput.placeholder = "Descrição";
  }

  overlay.classList.add("modal-overlay--visible");
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("modal-overlay--visible");
  }
  currentModalType = null;
}

document.addEventListener("DOMContentLoaded", () => {
  restoreSessionStateIfAny();

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  const btnTransfer = document.getElementById("btn-transfer");
  const btnPay = document.getElementById("btn-pay");
  const btnCard = document.getElementById("btn-card");

  const toggleButtons = document.querySelectorAll(".auth-toggle-btn");
  const forms = document.querySelectorAll(".auth-form");

  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.getElementById("modal-close");
  const modalForm = document.getElementById("modal-form");
  const modalAmountInput = document.getElementById("modal-amount");
  const modalDescInput = document.getElementById("modal-description");

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
        const demoEmail = email || "demo@fakebank.local";
        const demoUser = { name: FAKE_USER.name, email: demoEmail };
        setCurrentUser(demoUser);
        startNewSessionForUser(demoUser.name, demoUser.email);
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
      startNewSessionForUser(found.name, found.email);
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
      clearSessionState();
      CURRENT_USER_BALANCE = FAKE_USER.balance;
      CURRENT_TRANSACTIONS = FAKE_TRANSACTIONS.slice();
      showScreen("login-screen");
      showToast("Sessão encerrada");
    });
  }

  if (btnTransfer) {
    btnTransfer.addEventListener("click", () => {
      openModal("transfer");
    });
  }

  if (btnPay) {
    btnPay.addEventListener("click", () => {
      openModal("pay");
    });
  }

  if (btnCard) {
    btnCard.addEventListener("click", () => {
      showToast("Cartão virtual simulado neste ambiente");
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      closeModal();
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!currentModalType) {
        closeModal();
        return;
      }

      if (!modalAmountInput || !modalDescInput) {
        closeModal();
        return;
      }

      const rawAmount = modalAmountInput.value.replace(",", ".").trim();
      const amount = parseFloat(rawAmount);
      const description = modalDescInput.value.trim();

      if (!amount || amount <= 0 || !description) {
        showToast("Informe um valor e descrição válidos");
        return;
      }

      if (amount > CURRENT_USER_BALANCE) {
        showToast("Saldo insuficiente para esta operação");
        return;
      }

      const date = formatTodayDateBR();
      let txDescription = description;

      if (currentModalType === "transfer") {
        txDescription = "Transferência para " + description;
      } else if (currentModalType === "pay") {
        txDescription = "Pagamento de " + description;
      }

      const newTransaction = {
        date: date,
        description: txDescription,
        type: "debit",
        amount: amount
      };

      CURRENT_USER_BALANCE = CURRENT_USER_BALANCE - amount;
      CURRENT_TRANSACTIONS.unshift(newTransaction);

      const currentUser = getCurrentUser();
      if (currentUser) {
        saveSessionState(currentUser.name, currentUser.email);
      } else {
        saveSessionState(FAKE_USER.name, "demo@fakebank.local");
      }

      renderDashboard();

      if (currentModalType === "transfer") {
        showToast("Transferência registrada na simulação");
      } else if (currentModalType === "pay") {
        showToast("Pagamento registrado na simulação");
      } else {
        showToast("Operação registrada na simulação");
      }

      closeModal();
    });
  }

  if (hasCurrentUser()) {
    showScreen("dashboard-screen");
    renderDashboard();
  } else {
    showScreen("login-screen");
  }
});