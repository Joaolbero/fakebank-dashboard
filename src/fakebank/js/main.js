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
let CURRENT_THEME = "dark";

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

function generateCardNumber() {
  const groups = [];
  for (let i = 0; i < 4; i += 1) {
    const n = Math.floor(Math.random() * 10000);
    const s = ("0000" + n).slice(-4);
    groups.push(s);
  }
  return groups.join(" ");
}

function generateExpiry() {
  const now = new Date();
  const year = now.getFullYear() + 3;
  const month = now.getMonth() + 1;
  const mm = ("0" + month).slice(-2);
  return mm + "/" + String(year).slice(-2);
}

function generateCVV() {
  const n = Math.floor(Math.random() * 900) + 100;
  return String(n);
}

function openCardModal() {
  const overlay = document.getElementById("card-overlay");
  const numberEl = document.getElementById("card-number");
  const nameEl = document.getElementById("card-holder");
  const expiryEl = document.getElementById("card-expiry");
  const cvvEl = document.getElementById("card-cvv");

  if (!overlay || !numberEl || !nameEl || !expiryEl || !cvvEl) return;

  const user = getCurrentUser();
  const holderName = user && user.name ? user.name : FAKE_USER.name;

  const cardNumber = generateCardNumber();
  const expiry = generateExpiry();
  const cvv = generateCVV();

  numberEl.textContent = cardNumber;
  nameEl.textContent = holderName.toUpperCase();
  expiryEl.textContent = expiry;
  cvvEl.textContent = cvv;

  overlay.classList.add("modal-overlay--visible");
}

function closeCardModal() {
  const overlay = document.getElementById("card-overlay");
  if (overlay) {
    overlay.classList.remove("modal-overlay--visible");
  }
}

function getStoredTheme() {
  try {
    const t = localStorage.getItem("fakebank_theme");
    if (t === "light" || t === "dark") return t;
  } catch (e) {}
  return "dark";
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("fakebank_theme", theme);
  } catch (e) {}
}

function applyTheme(theme) {
  const body = document.body;
  if (theme === "light") {
    body.classList.add("theme-light");
  } else {
    body.classList.remove("theme-light");
  }
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "light" ? "Tema claro" : "Tema escuro";
  }
}

function showLoadingOverlay(message) {
  const overlay = document.getElementById("loading-overlay");
  const textEl = document.getElementById("loading-text");
  if (!overlay) return;
  if (textEl && message) {
    textEl.textContent = message;
  }
  overlay.classList.add("loading-overlay--visible");
}

function hideLoadingOverlay() {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;
  overlay.classList.remove("loading-overlay--visible");
}

document.addEventListener("DOMContentLoaded", () => {
  restoreSessionStateIfAny();
  CURRENT_THEME = getStoredTheme();
  applyTheme(CURRENT_THEME);

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

  const cardOverlay = document.getElementById("card-overlay");
  const cardClose = document.getElementById("card-close");

  const themeToggle = document.getElementById("theme-toggle");

  const profileForm = document.getElementById("profile-form");
  const profileNameInput = document.getElementById("profile-name-input");

  const filterButtons = document.querySelectorAll(".transactions-filter-btn");

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

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      CURRENT_THEME = CURRENT_THEME === "light" ? "dark" : "light";
      setStoredTheme(CURRENT_THEME);
      applyTheme(CURRENT_THEME);
    });
  }

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
        showLoadingOverlay("Carregando sua conta de demonstração...");
        setTimeout(() => {
          hideLoadingOverlay();
          showScreen("dashboard-screen");
          renderDashboard();
          showToast("Login em modo demonstração");
        }, 700);
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
      showLoadingOverlay("Carregando sua conta...");
      setTimeout(() => {
        hideLoadingOverlay();
        showScreen("dashboard-screen");
        renderDashboard();
        showToast("Login realizado");
      }, 700);
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
      openCardModal();
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

  if (cardClose) {
    cardClose.addEventListener("click", () => {
      closeCardModal();
    });
  }

  if (cardOverlay) {
    cardOverlay.addEventListener("click", (event) => {
      if (event.target === cardOverlay) {
        closeCardModal();
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

      const user = getCurrentUser();
      if (user) {
        saveSessionState(user.name, user.email);
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

  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!profileNameInput) return;

      const newName = profileNameInput.value.trim();
      if (!newName) {
        showToast("Informe um nome válido");
        return;
      }

      const user = getCurrentUser();
      if (user) {
        user.name = newName;
        setCurrentUser(user);

        const users = getStoredUsers();
        const index = users.findIndex(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
        if (index !== -1) {
          users[index].name = newName;
          setStoredUsers(users);
        }

        saveSessionState(user.name, user.email);
      }

      renderDashboard();
      showToast("Nome de exibição atualizado");
    });
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-filter") || "all";
        CURRENT_FILTER = value;
        filterButtons.forEach((b) =>
          b.classList.remove("transactions-filter-btn--active")
        );
        btn.classList.add("transactions-filter-btn--active");
        renderDashboard();
      });
    });
  }

  if (hasCurrentUser()) {
    showLoadingOverlay("Reconectando à sua conta...");
    setTimeout(() => {
      hideLoadingOverlay();
      showScreen("dashboard-screen");
      renderDashboard();
    }, 600);
  } else {
    showScreen("login-screen");
  }
});