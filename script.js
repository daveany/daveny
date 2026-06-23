(function () {
  const nav = document.getElementById("primaryNav");
  const toggle = document.getElementById("menuToggle");
  const toast = document.getElementById("toast");
  const form = document.querySelector(".booking-form");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "Guest";
    const date = data.get("date");
    const time = data.get("time");
    const guests = data.get("guests");
    showToast(`Thanks, ${name}. Reservation request sent for ${guests} on ${date} at ${time}.`);
    form.reset();
    form.querySelector('[name="guests"]').value = 2;
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 3600);
  }
})();
