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
}