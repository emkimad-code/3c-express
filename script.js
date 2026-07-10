const slides = document.querySelectorAll(".hero-slide");

let current = 0;

window.addEventListener("load", () => {
  const delayedImages = [
    { slide: 1, src: "sea.webp" },
    { slide: 2, src: "road.webp" }
  ];

  delayedImages.forEach(({ slide, src }) => {
    if (!slides[slide]) return;

    const image = new Image();

    image.onload = () => {
      slides[slide].style.backgroundImage = `url("${src}")`;
    };

    image.src = src;
  });

  if (slides.length > 1) {
    setInterval(() => {
      slides[current].classList.remove("active");

      current++;

      if (current >= slides.length) {
        current = 0;
      }

      slides[current].classList.add("active");
    }, 3000);
  }
});

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

/* LANGUAGE DETECTION */
const isFrench = document.documentElement.lang === "fr";

const i18n = {
  packageLabel:      isFrench ? "Colis"                          : "Package",
  packageType:       isFrench ? "Type de Colis"                  : "Package Type",
  packageTypePH:     isFrench ? "Cartons, palettes, caisses..."  : "Cartons, pallets, crates...",
  quantity:          isFrench ? "Quantité"                       : "Quantity",
  weight:            isFrench ? "Poids Brut (kg)"                : "Gross Weight (kg)",
  dimensions:        isFrench ? "Dimensions (L × l × H cm)"      : "Dimensions (L × W × H cm)",
  removeBtn:         isFrench ? "Supprimer ce colis"             : "Remove this package",
  submitting:        isFrench ? "Envoi en cours..."              : "Submitting...",
  sendRequest:       isFrench ? "Envoyer la demande"             : "Send request",
  errorMsg:          isFrench ? "Une erreur est survenue. Veuillez réessayer ou nous contacter directement." : "An error occurred. Please try again or contact us directly.",
  thankYouPage:      isFrench ? "thank-you-fr.html"              : "thank-you.html",
};

if (addPackageBtn && packagesContainer) {
  addPackageBtn.addEventListener("click", () => {
    packageCount++;

    const packageBlock = document.createElement("div");
    packageBlock.classList.add("package-block");

    packageBlock.innerHTML = `
      <h4>${i18n.packageLabel} ${packageCount}</h4>

      <div class="package-grid">
        <div class="field">
          <label>${i18n.packageType} <span class="required">*</span></label>
          <input
            name="package_${packageCount}_type"
            type="text"
            placeholder="${i18n.packageTypePH}"
            required
          />
        </div>

        <div class="field">
          <label>${i18n.quantity} <span class="required">*</span></label>
          <input
            name="package_${packageCount}_quantity"
            type="number"
            placeholder="10"
            required
          />
        </div>

        <div class="field">
          <label>${i18n.weight} <span class="required">*</span></label>
          <input
            name="package_${packageCount}_weight"
            type="number"
            placeholder="500"
            required
          />
        </div>

        <div class="field">
          <label>${i18n.dimensions} <span class="required">*</span></label>
          <input
            name="package_${packageCount}_dimensions"
            type="text"
            placeholder="120 × 80 × 100"
            required
          />
        </div>
      </div>

      <button type="button" class="remove-package-btn">
        ${i18n.removeBtn}
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
      submitBtn.textContent = i18n.submitting;
      submitBtn.disabled = true;
    }

   const formData = new FormData(quoteForm);

const attachmentsInput = document.getElementById("attachments");
const attachments = [];

if (attachmentsInput && attachmentsInput.files.length > 0) {
  for (const file of attachmentsInput.files) {
    const base64 = await fileToBase64(file);

    attachments.push({
      filename: file.name,
      content: base64.split(",")[1],
      contentType: file.type
    });
  }
}

try {
  const data = Object.fromEntries(formData.entries());

  data.attachments = attachments;

  const response = await fetch("/.netlify/functions/send-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

      if (response.ok) {
        sessionStorage.setItem("request_id", requestId);
        window.location.href = `${i18n.thankYouPage}?ref=${requestId}`;
      } else {
        alert(i18n.errorMsg);

        if (submitBtn) {
          submitBtn.textContent = i18n.sendRequest;
          submitBtn.disabled = false;
        }
      }
    } catch (error) {
      alert(i18n.errorMsg);

      if (submitBtn) {
        submitBtn.textContent = i18n.sendRequest;
        submitBtn.disabled = false;
      }
    }
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

const serviceSelect = document.getElementById("service");
const operationField = document.getElementById("operation-field");
const operationSelect = document.getElementById("operation");

const noOperationServices = isFrench
  ? ["Fret Routier", "Dédouanement", "Entreposage & Stockage"]
  : ["Road Freight", "Customs Clearance", "Warehousing & Storage"];

if (serviceSelect && operationField && operationSelect) {

  serviceSelect.addEventListener("change", () => {

    const service = serviceSelect.value;

    if (noOperationServices.includes(service)) {

      operationField.style.display = "none";
      operationSelect.required = false;
      operationSelect.value = "";

    } else {

      operationField.style.display = "block";
      operationSelect.required = true;

    }

  });

}

window.addEventListener("load", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.querySelectorAll(".map-placeholder").forEach((mapBox) => {
  const button = mapBox.querySelector(".load-map-btn");

  if (!button) return;

  button.addEventListener("click", () => {
    const mapSrc = mapBox.dataset.mapSrc;

    if (!mapSrc) return;

    const iframe = document.createElement("iframe");

    iframe.src = mapSrc;
    iframe.title = document.documentElement.lang === "fr"
      ? "Localisation de 3C Express sur Google Maps"
      : "3C Express location on Google Maps";

    iframe.loading = "lazy";
    iframe.allowFullscreen = true;

    mapBox.replaceChildren(iframe);
  });
});