import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/cakedetails.css";

function CakeDetails() {
  const { id } = useParams();

  const [cake, setCake] = useState(null);
  const [branches, setBranches] = useState([]);

  const weights = [0.5, 1, 1.5, 2];
  const [selectedWeight, setSelectedWeight] = useState(1);

  const [eggType, setEggType] = useState("egg");
  const [deliveryType, setDeliveryType] = useState("pickup");

  const [message, setMessage] = useState("");
  const [paymentType, setPaymentType] = useState("cod");

  const [step, setStep] = useState(1);

  // customer details
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");

  // delivery address
  const [address, setAddress] = useState("");

  // fetch cake
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cakes/${id}/`)
      .then(res => res.json())
      .then(data => setCake(data))
      .catch(err => console.log(err));
  }, [id]);

  // fetch branches
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/branches/")
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.log(err));
  }, []);

  if (!cake) return <h2>Loading...</h2>;

  /* PRICE */
  const basePrice = cake.price;
  const finalCakePrice = basePrice * selectedWeight;
  const deliveryCharge = deliveryType === "delivery" ? 60 : 0;
  const totalAmount = finalCakePrice + deliveryCharge;

  /* PLACE ORDER */
  const handlePlaceOrder = () => {
  fetch("http://127.0.0.1:8000/api/orders/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: customerName,
      phone: phone,
      cake: cake.id,
      weight: selectedWeight,
      egg_type: eggType,
      delivery_type: deliveryType,
      address: address,         
      total: totalAmount
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed! Order No: " + data.order_no);

      // ✅ go to Orders page
      window.location.href = "/orders";
    })
    .catch(err => console.log(err));
};

  return (
    <div className="cake-details-container">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="cake-left">
            <img
              src={`http://127.0.0.1:8000${cake.image}`}
              alt={cake.name}
            />
          </div>

          <div className="cake-right">
            <h2>{cake.name}</h2>
            <p>{cake.description}</p>

            <p><b>Base Price:</b> Rs. {cake.price} / KG</p>

            <h4>Select Weight</h4>
            <div className="option-row">
              {weights.map(w => (
                <button
                  key={w}
                  className={selectedWeight === w ? "active" : ""}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w} KG
                </button>
              ))}
            </div>

            <h4>Egg Type</h4>
            <div className="option-row">
              <button
                className={eggType === "egg" ? "active" : ""}
                onClick={() => setEggType("egg")}
              >
                Egg
              </button>
              <button
                className={eggType === "eggless" ? "active" : ""}
                onClick={() => setEggType("eggless")}
              >
                Eggless
              </button>
            </div>

            <input
              type="text"
              placeholder="Message on cake (optional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <h4>Delivery Type</h4>
            <label>
              <input
                type="radio"
                checked={deliveryType === "pickup"}
                onChange={() => setDeliveryType("pickup")}
              />
              Pickup
            </label>

            <label>
              <input
                type="radio"
                checked={deliveryType === "delivery"}
                onChange={() => setDeliveryType("delivery")}
              />
              Delivery
            </label>

            {deliveryType === "pickup" && (
              <select>
                <option>Select Branch</option>
                {branches.map(b => (
                  <option key={b.id}>{b.name}</option>
                ))}
              </select>
            )}

            {deliveryType === "delivery" && (
              <textarea
                placeholder="Enter delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            )}

            <h3>Total Amount: Rs. {totalAmount}</h3>

            <button className="next-btn" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="cake-right">
          <h2>Customer Details</h2>

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />

          <input
            placeholder="Mobile Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <input
            placeholder="Additional Number (optional)"
            value={altPhone}
            onChange={e => setAltPhone(e.target.value)}
          />

          <button className="next-btn" onClick={() => setStep(3)}>
            Proceed to Payment
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="cake-right">
          <h2>Payment</h2>

          <p><b>Cake:</b> {cake.name}</p>
          <p><b>Weight:</b> {selectedWeight} KG</p>
          <p><b>Total:</b> Rs. {totalAmount}</p>

          <label>
            <input
              type="radio"
              checked={paymentType === "cod"}
              onChange={() => setPaymentType("cod")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              checked={paymentType === "online"}
              onChange={() => setPaymentType("online")}
            />
            Online Payment
          </label>

          <button className="next-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}

    </div>
  );
}

export default CakeDetails;

