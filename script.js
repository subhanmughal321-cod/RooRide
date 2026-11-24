
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
