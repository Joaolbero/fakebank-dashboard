function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((s) => s.classList.remove("screen--active"));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("screen--active");
  }
}

function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function renderDashboard() {
  const nameEl = document.getElementById("user-name");
  const balanceEl = document.getElementById("current-balance");
  const tbody = document.getElementById("transactions-body");

  if (nameEl) {
    nameEl.textContent = `Olá, ${FAKE_USER.name}`;
  }

  if (balanceEl) {
    balanceEl.textContent = formatCurrencyBRL(FAKE_USER.balance);
  }

  if (tbody) {
    tbody.innerHTML = "";

    FAKE_TRANSACTIONS.forEach((tx) => {
      const tr = document.createElement("tr");

      const tdDate = document.createElement("td");
      tdDate.textContent = tx.date;

      const tdDesc = document.createElement("td");
      tdDesc.textContent = tx.description;

      const tdType = document.createElement("td");
      tdType.textContent = tx.type === "credit" ? "Crédito" : "Débito";

      const tdAmount = document.createElement("td");
      tdAmount.textContent = formatCurrencyBRL(tx.amount);
      tdAmount.classList.add(
        tx.type === "credit" ? "transaction--credit" : "transaction--debit"
      );

      tr.appendChild(tdDate);
      tr.appendChild(tdDesc);
      tr.appendChild(tdType);
      tr.appendChild(tdAmount);

      tbody.appendChild(tr);
    });
  }

  // 🔹 Aqui é o que faltava:
  renderSummary();
}

function renderSummary() {
  const summaryEl = document.getElementById("summary-month");
  if (!summaryEl) return;

  let totalIncome = 0;
  let totalExpense = 0;

  FAKE_TRANSACTIONS.forEach((tx) => {
    if (tx.type === "credit") {
      totalIncome += tx.amount;
    } else if (tx.type === "debit") {
      totalExpense += tx.amount;
    }
  });

  const net = totalIncome - totalExpense;

  summaryEl.innerHTML = `
    <div class="summary-line summary-line--income">
      <span>Entradas no período</span>
      <span>${formatCurrencyBRL(totalIncome)}</span>
    </div>
    <div class="summary-line summary-line--expense">
      <span>Saídas no período</span>
      <span>${formatCurrencyBRL(totalExpense)}</span>
    </div>
    <div class="summary-line summary-line--net">
      <span>Resultado</span>
      <span>${formatCurrencyBRL(net)}</span>
    </div>
  `;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("toast--visible");

  setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2500);
}