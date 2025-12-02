let orderList = document.getElementById("order-list");
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function loadBranches() {
    let branchCards = document.querySelectorAll(".branch-card h3");
    let branchSelect = document.getElementById("cust-branch");

    branchSelect.innerHTML = ""; // clear

    branchCards.forEach(card => {
        let name = card.innerText.replace("FB Cakes – ", "");
        branchSelect.innerHTML += `<option>${name}</option>`;
    });
}

let currentOrder = null;

function openEdit(button) {
  currentOrder = button.closest(".order-item");

  document.getElementById("editName").value =
    currentOrder.querySelector(".cake-name").innerText;

  document.getElementById("editFlavor").value =
    currentOrder.querySelector(".cake-flavor").innerText.replace("Flavor: ", "");

  document.getElementById("editPrice").value =
    currentOrder.querySelector(".cake-price").innerText.replace("Price: ₹", "");

  document.getElementById("editLocation").value =
    currentOrder.querySelector(".cake-location").innerText.replace("Location: ", "");

  document.getElementById("editPopup").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editPopup").style.display = "none";
}

function saveEdit() {
  currentOrder.querySelector(".cake-name").innerText =
    document.getElementById("editName").value;

  currentOrder.querySelector(".cake-flavor").innerText =
    "Flavor: " + document.getElementById("editFlavor").value;

  currentOrder.querySelector(".cake-price").innerText =
    "Price: ₹" + document.getElementById("editPrice").value;

  currentOrder.querySelector(".cake-location").innerText =
    "Location: " + document.getElementById("editLocation").value;

  closeEdit();
}
