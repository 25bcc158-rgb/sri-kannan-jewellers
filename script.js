// Fetch live gold & silver rates and update product prices
async function fetchRates() {
  try {
    // Replace YOUR_API_KEY with your actual Metals-API key
    const response = await fetch("https://metals-api.com/api/latest?access_key=YOUR_API_KEY&base=INR&symbols=XAU,XAG");
    const data = await response.json();

    // Gold rate per gram (XAU = 1 troy ounce = 31.1035 grams)
    const goldRatePerGram = (data.rates.XAU / 31.1035).toFixed(2);

    // Silver rate per gram (XAG = 1 troy ounce = 31.1035 grams)
    const silverRatePerGram = (data.rates.XAG / 31.1035).toFixed(2);

    // Update all product prices dynamically
    document.querySelectorAll(".price").forEach(span => {
      const type = span.getAttribute("data-type");
      const weight = parseFloat(span.getAttribute("data-weight"));

      let price = 0;
      if (type === "gold") {
        price = goldRatePerGram * weight;
      } else if (type === "silver") {
        price = silverRatePerGram * weight;
      }

      span.textContent = `₹${price.toFixed(2)}`;
      span.setAttribute("data-price", price.toFixed(2)); // store price for payment
    });
  } catch (error) {
    console.error("Error fetching rates:", error);
    document.querySelectorAll(".price").forEach(span => {
      span.textContent = "Rate unavailable";
    });
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Razorpay Payment Integration
document.querySelectorAll(".pay-btn").forEach(button => {
  button.addEventListener("click", function() {
    const productName = this.getAttribute("data-name");
    const type = this.getAttribute("data-type");
    const weight = parseFloat(this.getAttribute("data-weight"));

    // Get the latest price from the span
    const priceSpan = document.querySelector(`.price[data-type="${type}"][data-weight="${weight}"]`);
    const amount = parseFloat(priceSpan.getAttribute("data-price")) * 100; // convert to paise

    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
      amount: amount, // in paise
      currency: "INR",
      name: "Sri Kannan Jewellers",
      description: productName,
      image: "images/logo.png",
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#b8860b"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
});

// Contact form alert
document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();
  alert("Thank you for contacting Sri Kannan Jewellers! We will get back to you soon.");
});

// Run on page load
fetchRates();
