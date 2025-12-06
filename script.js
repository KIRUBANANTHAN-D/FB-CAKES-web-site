// ======================================================
// GENERATE BILL NUMBER (ALWAYS FIRST)
// ======================================================
function generateBillNo() {
  return Math.floor(1000 + Math.random() * 9000);
}



// ======================================================
// SELECTED CAKE → DETAILS PAGE
// ======================================================
function goToDetails(name, price, image) {
  let cake = { name, price, image };
  localStorage.setItem("selectedCake", JSON.stringify(cake));
  window.location.href = "order-form.html";
}



// ======================================================
// GLOBAL ELEMENTS
// ======================================================
const orderPanel = document.querySelector('.order-panel');
const closePanelBtn = document.getElementById('closePanel');

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const pName = document.getElementById('p-name');
const pImage = document.getElementById('p-image');
const pPrice = document.getElementById('p-price');
const pSize = document.getElementById('p-size');
const pMsg = document.getElementById('p-msg');
const pNotes = document.getElementById('p-notes');

const custName = document.getElementById('cust-name');
const custPhone = document.getElementById('cust-phone');
const custType = document.getElementById('cust-type');
const custBranch = document.getElementById('cust-branch');
const custTime = document.getElementById('cust-time');
const custAddress = document.getElementById('cust-address');

const summaryBox = document.getElementById('summary-box');
const billNoSpan = document.getElementById('bill-no');
const billName = document.getElementById('bill-name');
const billPhone = document.getElementById('bill-phone');
const paymentMethod = document.getElementById('payment-method');

const step1Next = document.getElementById('step1-next');
const step1Cancel = document.getElementById('step1-cancel');
const step2Next = document.getElementById('step2-next');
const step2Back = document.getElementById('step2-back');
const step2Cancel = document.getElementById('step2-cancel');
const step3Back = document.getElementById('step3-back');
const step3Cancel = document.getElementById('step3-cancel');
const placeOrderBtn = document.getElementById('place-order');

let currentCake = null;



// ======================================================
// OPEN PANEL
// ======================================================
function openOrderPanel(name, price, image) {
  currentCake = {
    name,
    price,
    image,
    billNo: generateBillNo()   // <--- BILL NO CREATED HERE ✔
  };

  pName.innerText = name;
  pImage.src = image;
  pPrice.innerText = "₹" + price;

  pSize.value = "1";
  pMsg.value = "";
  pNotes.value = "";

  billNoSpan.innerText = currentCake.billNo; // show in summary page later

  orderPanel.classList.add('open');
  showStep(1);
}



// ======================================================
// SHOW STEP
// ======================================================
function showStep(n) {
  step1.style.display = (n === 1) ? "block" : "none";
  step2.style.display = (n === 2) ? "block" : "none";
  step3.style.display = (n === 3) ? "block" : "none";
}



// ======================================================
// CLOSE PANEL
// ======================================================
function closePanel() {
  orderPanel.classList.remove('open');
  localStorage.removeItem("selectedCakeTemp");
}



// ======================================================
// STEP 1 → NEXT
// ======================================================
step1Next.addEventListener('click', () => {
  currentCake.size = pSize.value;
  currentCake.msg = pMsg.value.trim() || "-";
  currentCake.notes = pNotes.value.trim() || "-";

  localStorage.setItem("selectedCakeTemp", JSON.stringify(currentCake));

  showStep(2);
});

step1Cancel.addEventListener('click', closePanel);



// ======================================================
// STEP 2 → NEXT
// ======================================================
step2Next.addEventListener('click', () => {
  if (!custName.value.trim()) return alert("Enter customer name");
  if (!custPhone.value.trim()) return alert("Enter phone number");

  let cake = JSON.parse(localStorage.getItem("selectedCakeTemp"));

  cake.customerName = custName.value.trim();
  cake.customerPhone = custPhone.value.trim();
  cake.type = custType.value;
  cake.branch = custBranch.value;
  cake.time = custTime.value || new Date().toLocaleString();
  cake.address = custAddress.value.trim();

  localStorage.setItem("selectedCakeTemp", JSON.stringify(cake));

  prepareSummary(cake);
  showStep(3);
});

step2Back.addEventListener('click', () => showStep(1));
step2Cancel.addEventListener('click', closePanel);



// ======================================================
// SUMMARY BUILDER
// ======================================================
function prepareSummary(cake) {
  summaryBox.innerHTML = `
    <strong>${cake.name}</strong><br>
    Size: ${cake.size} Kg<br>
    Price: ₹${cake.price}<br>
    Message: ${cake.msg}<br>
    Notes: ${cake.notes}<br>
    Branch: ${cake.branch}<br>
    Time: ${cake.time}
  `;

  billName.value = cake.customerName;
  billPhone.value = cake.customerPhone;

  billNoSpan.innerText = cake.billNo;  // <--- BILL NO SHOWN HERE ✔
}



// ======================================================
// STEP 3 → PLACE ORDER
// ======================================================
placeOrderBtn.addEventListener('click', () => {
  let cake = JSON.parse(localStorage.getItem("selectedCakeTemp"));

  const finalOrder = {
    ...cake,
    billingName: billName.value.trim(),
    billingPhone: billPhone.value.trim(),
    paymentMethod: paymentMethod.value,
    placedAt: new Date().toLocaleString()
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(finalOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("ORDER PLACED! BILL NO: " + cake.billNo);

  closePanel();
});

step3Back.addEventListener('click', () => showStep(2));
step3Cancel.addEventListener('click', closePanel);



