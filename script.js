function switchTab(type) {
    const tabs = document.querySelectorAll(".tab");
    const form = document.getElementById("rideform");
    const button = document.getElementById("rideSubmit");

    tabs.forEach(tab => {
        tab.classList.remove("active");
        tab.setAttribute("aria-pressed", "false");
    });

    if (type === "find") {
        tabs[0].classList.add("active");
        tabs[0].setAttribute("aria-pressed", "true");
        button.textContent = "Search rides";
        form.action = "find-ride.html";
    } else {
        tabs[1].classList.add("active");
        tabs[1].setAttribute("aria-pressed", "true");
        button.textContent = "Offer a ride";
        form.action = "offer-ride.html";
    }
}

const navbar = document.querySelector(".navbar");

function updateNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", updateNavbar);
updateNavbar();


// Scroll reveal animation
const revealElements = document.querySelectorAll(
    ".fade-left, .fade-right, .fade-up"
);

if ("IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        element.classList.add("scroll-reveal");
        observer.observe(element);

        element.addEventListener("focusin", () => {
            element.classList.add("show");
            observer.unobserve(element);
        });
    });
}

// Send the selected popular trip to the login page.
const tripCards = document.querySelectorAll(".trip-card");

tripCards.forEach(function (card) {
    const link = card.querySelector(".trip-action");
    if (!link) return;

    const rideURL = new URL(link.href);
    rideURL.searchParams.set("intent", "booking");
    link.href = "login.html?" + rideURL.searchParams.toString();
    card.style.cursor = "pointer";

    card.addEventListener("click", function (event) {
        // The existing arrow link handles its own click.
        if (!event.target.closest("a")) {
            window.location.href = link.href;
        }
    });
});

// Connect the hero search form to rider login.
const rideForm = document.getElementById("rideform");

rideForm.addEventListener("submit", function (event) {
    // Keep the existing Offer a ride form action unchanged.
    if (document.getElementById("rideSubmit").textContent.trim() !== "Search rides") {
        return;
    }

    event.preventDefault();
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;
    const seats = document.getElementById("passengers").value;

    if (from === to) {
        alert("Departure and destination cannot be the same.");
        return;
    }

    const details = new URLSearchParams();
    details.set("intent", "booking");
    details.set("from", from);
    details.set("to", to);
    details.set("date", date);
    details.set("passengers", seats);

    window.location.href = "login.html?" + details.toString();
});
