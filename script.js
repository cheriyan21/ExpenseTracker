document.addEventListener('DOMContentLoaded', function () {
  const balance = document.getElementById('balance');
  const money_plus = document.getElementById('money-plus');
  const money_minus = document.getElementById('money-minus');
  const list = document.getElementById('list');
  const form = document.getElementById('form');
  const text = document.getElementById('text');
  const amount = document.getElementById('amount');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');

  let transactions =
    JSON.parse(localStorage.getItem('transactions')) || [];

  function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
      alert('Please add a text and amount');
    } else {
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value,
      };

      transactions.push(transaction);

      addTransactionDOM(transaction);

      updateValues();

      updateLocalStorage();

      text.value = '';
      amount.value = '';
    }
  }

  function generateID() {
    return Math.floor(Math.random() * 100000000);
  }

  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    item.dataset.transactionId = transaction.id;

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
  }

  function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
  }

  function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
  }

  function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
  }

  function downloadTransactions() {
    const content = document.getElementById('list').outerHTML;

    html2pdf(content, {
      margin: 10,
      filename: 'transactions.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  }

  function clearAllTransactions() {
    transactions = [];
    updateLocalStorage();
    init();
  }

  form.addEventListener('submit', addTransaction);
  downloadBtn.addEventListener('click', downloadTransactions);
  clearBtn.addEventListener('click', clearAllTransactions);

  // Event delegation for dynamically added buttons
  list.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
      const transactionId = e.target.parentElement.dataset.transactionId;
      removeTransaction(parseInt(transactionId));
    }
  });

  init();
});
