const FAKE_USER = {
  name: "João Albero",
  balance: 3250.75,
  account: "0001-1"
};

const FAKE_TRANSACTIONS = [
  {
    date: "12/11/2025",
    description: "PIX • Bar do Russo",
    type: "debit",
    amount: 89.9
  },
  {
    date: "11/11/2025",
    description: "Crédito salário • Livestrong",
    type: "credit",
    amount: 3500.0
  },
  {
    date: "10/11/2025",
    description: "Netflix",
    type: "debit",
    amount: 39.9
  },
  {
    date: "08/11/2025",
    description: "Compra online • Kabum",
    type: "debit",
    amount: 579.99
  }
];

const FAKE_SPENDING_CATEGORIES = [
  { label: "Fixas", amount: 800 },
  { label: "Mercado", amount: 450 },
  { label: "Lazer", amount: 250 },
  { label: "Online", amount: 160 }
];

let CURRENT_USER_BALANCE = FAKE_USER.balance;
let CURRENT_TRANSACTIONS = FAKE_TRANSACTIONS.slice();