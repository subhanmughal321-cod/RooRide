
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
