// M&F STUDIO™ WEBSITE

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.textContent = isOpen ? "×" : "☰";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// BOOKING DATE
const bookingDate = document.getElementById("bookingDate");
const bookingType = document.getElementById("bookingType");
const bookingMessage = document.getElementById("bookingMessage");

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

bookingDate.min = localDateString(new Date());

function checkBookingDay() {
  if (!bookingDate.value || !bookingType.value) return true;

  const day = new Date(
    bookingDate.value + "T12:00:00"
  ).getDay();

  if (bookingType.value === "home" && day !== 0 && day !== 6) {
    bookingMessage.textContent =
      "Home service is available Saturday and Sunday. Please select a weekend date.";
    return false;
  }

  if (bookingType.value === "walkin" && (day === 0 || day === 6)) {
    bookingMessage.textContent =
      "Walk-in service is available Monday to Friday. Please select a weekday.";
    return false;
  }

  bookingMessage.textContent = "";
  return true;
}

bookingDate.addEventListener("change", () => {
  if (!bookingDate.value) return;

  const day = new Date(
    bookingDate.value + "T12:00:00"
  ).getDay();

  // Automatically suggest the correct appointment type.
  bookingType.value =
    day === 0 || day === 6 ? "home" : "walkin";

  checkBookingDay();
});

bookingType.addEventListener("change", checkBookingDay);

// CHOOSE A HAIRSTYLE
document.querySelectorAll(".style-book").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("bookingService").value =
      button.dataset.service;

    document.getElementById("booking").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// HAIRSTYLE SLIDER
const slider = document.getElementById("styleSlider");
const slides = Array.from(
  slider.querySelectorAll(".style-slide")
);
const dotsContainer = document.getElementById("sliderDots");

let currentSlide = 0;
let autoSlide;

slides.forEach((slide, index) => {
  const dot = document.createElement("button");

  dot.type = "button";
  dot.className = "slider-dot";
  dot.setAttribute("aria-label", `Show hairstyle ${index + 1}`);

  dot.addEventListener("click", () => {
    goToSlide(index);
  });

  dotsContainer.appendChild(dot);
});

const dots = Array.from(
  dotsContainer.querySelectorAll(".slider-dot")
);

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  slider.scrollTo({
    left: slides[currentSlide].offsetLeft - slides[0].offsetLeft,
    behavior: "smooth"
  });

  updateDots();
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

document.getElementById("nextBtn").addEventListener("click", () => {
  goToSlide(currentSlide + 1);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  goToSlide(currentSlide - 1);
});

// Update the active dot when the customer swipes.
slider.addEventListener("scroll", () => {
  const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  slides.forEach((slide, index) => {
    const center =
      slide.offsetLeft - slides[0].offsetLeft +
      slide.clientWidth / 2;

    const distance = Math.abs(sliderCenter - center);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  currentSlide = closestIndex;
  updateDots();
}, { passive: true });

// Automatic slider movement.
function startAutoSlide() {
  stopAutoSlide();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    autoSlide = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5500);
  }
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

slider.addEventListener("pointerenter", stopAutoSlide);
slider.addEventListener("pointerleave", startAutoSlide);
slider.addEventListener("focusin", stopAutoSlide);
slider.addEventListener("focusout", startAutoSlide);

goToSlide(0);
startAutoSlide();

// BOOKING FORM
document.getElementById("bookingForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const name =
      document.getElementById("bookingName").value.trim();

    const email =
      document.getElementById("bookingEmail").value.trim();

    const phone =
      document.getElementById("bookingPhone").value.trim();

    const service =
      document.getElementById("bookingService").value;

    const type = bookingType.value;
    const date = bookingDate.value;

    const time =
      document.getElementById("bookingTime").value;

    const address =
      document.getElementById("bookingAddress").value.trim();

    if (!name || !email || !phone || !service || !type || !date || !time) {
      bookingMessage.textContent =
        "Please complete all required fields.";
      return;
    }

    if (!checkBookingDay()) return;

    if (type === "home" && !address) {
      bookingMessage.textContent =
        "Please enter your address for home service.";
      return;
    }

    const readableDate = new Date(
      date + "T12:00:00"
    ).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    bookingMessage.textContent =
      `Thank you, ${name}! Your request for ${service} ` +
      `on ${readableDate} at ${time} is ready for confirmation. ` +
      "This demo has not sent your details to M&F Studio. " +
      "Please contact the studio directly until online submissions are connected.";
  }
);

// CUSTOMER REVIEWS
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");
const reviewMessage = document.getElementById("reviewMessage");
const averageRating = document.getElementById("averageRating");
const reviewCount = document.getElementById("reviewCount");

let reviews = [];

try {
  reviews = JSON.parse(
    localStorage.getItem("mfStudioReviews") || "[]"
  );
} catch {
  reviews = [];
}

// Display review text safely.
function renderReviews() {
  reviewList.replaceChildren();

  if (reviews.length === 0) {
    const empty = document.createElement("p");

    empty.className = "empty-reviews";
    empty.textContent =
      "No customer reviews have been submitted on this device yet.";

    reviewList.appendChild(empty);

    averageRating.textContent = "—";
    reviewCount.textContent = "0";
    return;
  }

  reviews.slice().reverse().forEach(review => {
    const card = document.createElement("article");
    card.className = "review-card";

    const stars = document.createElement("div");
    stars.className = "review-stars";
    stars.textContent =
      "★".repeat(Number(review.rating)) +
      "☆".repeat(5 - Number(review.rating));

    const text = document.createElement("p");
    text.textContent = `“${review.text}”`;

    const name = document.createElement("strong");
    name.textContent = `— ${review.name}`;

    card.append(stars, text, name);
    reviewList.appendChild(card);
  });

  const total = reviews.reduce(
    (sum, review) => sum + Number(review.rating),
    0
  );

  averageRating.textContent =
    (total / reviews.length).toFixed(1);

  reviewCount.textContent = reviews.length;
}

// Submit feedback.
reviewForm.addEventListener("submit", event => {
  event.preventDefault();

  const name =
    document.getElementById("reviewName").value.trim();

  const email =
    document.getElementById("reviewEmail").value.trim();

  const phone =
    document.getElementById("reviewPhone").value.trim();

  const rating =
    Number(document.getElementById("reviewRating").value);

  const text =
    document.getElementById("reviewText").value.trim();

  if (!name || !email || !rating || !text) {
    reviewMessage.textContent =
      "Please provide your name, email, rating, and feedback.";
    return;
  }

  const review = {
    name,
    email,
    phone,
    rating,
    text
  };

  reviews.push(review);

  try {
    localStorage.setItem(
      "mfStudioReviews",
      JSON.stringify(reviews)
    );
  } catch {
    reviewMessage.textContent =
      "Your browser could not save this review.";
    reviews.pop();
    return;
  }

  renderReviews();
  reviewForm.reset();

  reviewMessage.textContent =
    "Thank you for your feedback! It is saved on this device only. " +
    "It has not been sent to the studio.";
});

renderReviews();

// BACK TO TOP BUTTON
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.style.display =
    window.scrollY > 500 ? "block" : "none";
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
// Help the hero video play on mobile devices
const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;

  const tryPlayVideo = () => {
    heroVideo.play().catch(() => {
      // Autoplay may be blocked.
      // The visitor can tap the video controls to play it.
    });
  };

  window.addEventListener("load", tryPlayVideo);

  heroVideo.addEventListener("error", () => {
    console.error("Video failed to load. Check the file path and format.");
  });
}