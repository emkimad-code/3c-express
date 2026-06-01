const slides = document.querySelectorAll(".hero-slide");

let current = 0;

setInterval(() => {
  slides[current].classList.remove("active");

  current++;

  if(current >= slides.length){
    current = 0;
  }

  slides[current].classList.add("active");

}, 3000);

/* ACTIVE MENU LINK ON SCROLL */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
});

/* ADD ANOTHER PACKAGE */

const addPackageBtn = document.getElementById("add-package-btn");
const packagesContainer = document.getElementById("packages-container");

let packageCount = 1;

if (addPackageBtn && packagesContainer) {
  addPackageBtn.addEventListener("click", () => {
    packageCount++;

    const packageBlock = document.createElement("div");
    packageBlock.classList.add("package-block");

    packageBlock.innerHTML = `
      <h4>Package ${packageCount}</h4>

      <div class="package-grid">
        <div class="field">
          <label>Package Type <span class="required">*</span></label>
          <input
            name="package_${packageCount}_type"
            type="text"
            placeholder="Cartons, pallets, crates..."
            required
          />
        </div>

        <div class="field">
          <label>Quantity <span class="required">*</span></label>
          <input
            name="package_${packageCount}_quantity"
            type="number"
            placeholder="10"
            required
          />
        </div>

        <div class="field">
          <label>Gross Weight (kg) <span class="required">*</span></label>
          <input
            name="package_${packageCount}_weight"
            type="number"
            placeholder="500"
            required
          />
        </div>

        <div class="field">
          <label>Dimensions (L × W × H cm) <span class="required">*</span></label>
          <input
            name="package_${packageCount}_dimensions"
            type="text"
            placeholder="120 × 80 × 100"
            required
          />
        </div>
      </div>

      <button type="button" class="remove-package-btn">
        Remove this package
      </button>
    `;

    packagesContainer.appendChild(packageBlock);

    packageBlock
      .querySelector(".remove-package-btn")
      .addEventListener("click", () => {
        packageBlock.remove();
      });
  });
}

/* REQUEST ID + FORM REDIRECT */

const quoteForm = document.getElementById("quote-form");
const requestIdInput = document.getElementById("request_id");
const submitBtn = document.getElementById("submit-btn");

function generateRequestId() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `3CE-${year}${month}${day}-${random}`;
}

if (quoteForm && requestIdInput) {
  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const requestId = generateRequestId();
    requestIdInput.value = requestId;

    if (submitBtn) {
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;
    }

    const formData = new FormData(quoteForm);

    try {
     const data = Object.fromEntries(formData.entries());

const response = await fetch("/.netlify/functions/send-quote", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});

      if (response.ok) {
        sessionStorage.setItem("request_id", requestId);
        window.location.href = `thank-you.html?ref=${requestId}`;
      } else {
        alert("An error occurred. Please try again or contact us directly.");

        if (submitBtn) {
          submitBtn.textContent = "Send request";
          submitBtn.disabled = false;
        }
      }
    } catch (error) {
      alert("An error occurred. Please try again or contact us directly.");

      if (submitBtn) {
        submitBtn.textContent = "Send request";
        submitBtn.disabled = false;
      }
    }
  });
}