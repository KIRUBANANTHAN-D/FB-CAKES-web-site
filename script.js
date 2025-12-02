// ======================================================
// SAVE SELECTED CAKE & GO TO DETAILS PAGE
// ======================================================
function goToDetails(name, price, image) {
  let cake = { name, price, image };
  localStorage.setItem("selectedCake", JSON.stringify(cake));
  window.location.href = "order-form.html";   // your next page
}


// ======================================================
// REMOVE ONE ORDER
// ======================================================
function removeOrder(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}

// ---------- PANEL + STEPS HANDLER ----------
const orderPanel = document.querySelector('.order-panel') || document.getElementById('orderPanel');
const closePanelBtn = document.getElementById('closePanel');
const pageTarget = document.querySelector('.page-blur-target') || document.body;

// step elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

// inputs inside panel
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
const deliveryLabel = document.getElementById('delivery-location-label');

const summaryBox = document.getElementById('summary-box');
const billNoSpan = document.getElementById('bill-no');
const billName = document.getElementById('bill-name');
const billPhone = document.getElementById('bill-phone');
const paymentMethod = document.getElementById('payment-method');

// navigation buttons
const step1Next = document.getElementById('step1-next');
const step1Cancel = document.getElementById('step1-cancel');
const step2Back = document.getElementById('step2-back');
const step2Next = document.getElementById('step2-next');
const step2Cancel = document.getElementById('step2-cancel');
const step3Back = document.getElementById('step3-back');
const placeOrderBtn = document.getElementById('place-order');
const step3Cancel = document.getElementById('step3-cancel');

let currentCake = null;

// OPEN panel with cake data
function openOrderPanel(name, price, image) {
  currentCake = { name, price, image };

  // populate step1
  pName.innerText = name;
  pImage.src = image;
  pPrice.innerText = "₹" + price;

  // reset inputs
  pSize.value = "1";
  pMsg.value = "";
  pNotes.value = "";

  // show panel and step1
  orderPanel.classList.add('open');
  pageTarget.classList.add('blur');

  showStep(1);
  orderPanel.setAttribute('aria-hidden','false');
}

// show specific step inside panel
function showStep(n) {
  step1.style.display = (n === 1) ? 'block' : 'none';
  step2.style.display = (n === 2) ? 'block' : 'none';
  step3.style.display = (n === 3) ? 'block' : 'none';
}

// close panel
function closePanel() {
  orderPanel.classList.remove('open');
  pageTarget.classList.remove('blur');
  orderPanel.setAttribute('aria-hidden','true');
  // optional: clear selectedCake temp
  localStorage.removeItem('selectedCakeTemp');
}

// STEP 1 next
step1Next && step1Next.addEventListener('click', () => {
  // save choices to currentCake
  currentCake.size = pSize.value;
  currentCake.msg = pMsg.value.trim();
  currentCake.notes = pNotes.value.trim();

  // store temporarily so order-form or later steps can use
  localStorage.setItem('selectedCakeTemp', JSON.stringify(currentCake));

  // prefill some customer defaults (if any)
  custName.value = "";
  custPhone.value = "";
  custType.value = "pickup";
  custBranch.value = custBranch.options[0].value || "";
  custTime.value = "";
  custAddress.value = "";

  showStep(2);
});

// cancel handlers
step1Cancel && step1Cancel.addEventListener('click', closePanel);
step2Cancel && step2Cancel.addEventListener('click', closePanel);
step3Cancel && step3Cancel.addEventListener('click', closePanel);

// step2 back
step2Back && step2Back.addEventListener('click', () => showStep(1));

// step2 next -> validate
step2Next && step2Next.addEventListener('click', () => {
  // basic validation
  if (!custName.value.trim()) { alert('Please enter your name'); return; }
  if (!custPhone.value.trim()) { alert('Please enter phone number'); return; }

  // get temp cake
  let cake = JSON.parse(localStorage.getItem('selectedCakeTemp') || '{}');

  cake.customerName = custName.value.trim();
  cake.customerPhone = custPhone.value.trim();
  cake.type = custType.value;
  cake.branch = custBranch.value;
  cake.time = custTime.value || new Date().toLocaleString();
  cake.address = custAddress.value.trim();

  // store back to temp
  localStorage.setItem('selectedCakeTemp', JSON.stringify(cake));

  // prepare summary
  prepareSummary(cake);

  showStep(3);
});

// step3 back
step3Back && step3Back.addEventListener('click', () => showStep(2));

// place order -> final save
placeOrderBtn && placeOrderBtn.addEventListener('click', () => {
  // basic billing info
  const bname = billName.value.trim() || custName.value.trim() || 'Customer';
  const bphone = billPhone.value.trim() || custPhone.value.trim() || '';

  const cake = JSON.parse(localStorage.getItem('selectedCakeTemp') || '{}');
  if (!cake || !cake.name) { alert('No cake selected'); return; }

  const billNo = Math.floor(1000 + Math.random()*9000);
  billNoSpan.innerText = billNo;

  const finalOrder = {
    ...cake,
    billingName: bname,
    billingPhone: bphone,
    paymentMethod: paymentMethod.value,
    billNo,
    placedAt: new Date().toLocaleString()
  };

  // save to orders array
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(finalOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  // cleanup
  localStorage.removeItem('selectedCakeTemp');

  // optional: show success and close/redirect
  alert('Order placed! Bill No: ' + billNo);
  closePanel();
  // if user wants to go to orders page:
  // window.location.href = 'order.html';
});

// close button
closePanelBtn && closePanelBtn.addEventListener('click', closePanel);

// when pickup/delivery toggles show/hide address
custType && custType.addEventListener('change', (e) => {
  if (e.target.value === 'delivery') {
    document.getElementById('delivery-location-label').style.display = 'block';
    custAddress.style.display = 'block';
  } else {
    document.getElementById('delivery-location-label').style.display = 'none';
    custAddress.style.display = 'none';
  }
});

// helper: prepare summary box
function prepareSummary(cake) {
  const html = `
    <strong>${cake.name}</strong><br>
    Size: ${cake.size} Kg<br>
    Price: ₹${cake.price}<br>
    Message: ${cake.msg || '-'}<br>
    Notes: ${cake.notes || '-'}<br>
    Branch: ${cake.branch || '-'}<br>
    Preferred Time: ${cake.time || '-'}
  `;
  summaryBox.innerHTML = html;

  // autopopulate billing fields
  billName.value = cake.customerName || '';
  billPhone.value = cake.customerPhone || '';
  // set bill no placeholder
  billNoSpan.innerText = Math.floor(1000 + Math.random()*9000);
}

// Utility: If you also call goToDetails (separate details page), call openOrderPanel first to reuse
function goToDetails(name, price, image) {
  openOrderPanel(name, price, image);
}

// remove order function used in order.html (keep)
function removeOrder(index) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.splice(index,1);
  localStorage.setItem('orders', JSON.stringify(orders));
  // if order list visible on current page refresh UI or call a loader function
  if (typeof loadOrders === 'function') loadOrders();
}
