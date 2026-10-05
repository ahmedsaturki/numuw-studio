(() => {
  const form = document.getElementById("autoForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const hoursPerDay = Math.max(0, Number(form.elements.hours.value));
    const days = Math.max(0, Number(form.elements.days.value));
    const people = Math.max(0, Number(form.elements.people.value));
    const rate = Math.max(0, Number(form.elements.rate.value));
    const potential = Math.min(100, Math.max(0, Number(form.elements.potential.value)));

    const hours = hoursPerDay * days * people;
    const cost = hours * rate;
    const saving = cost * (potential / 100);

    document.getElementById("autoHours").textContent = hours.toFixed(1);
    document.getElementById("autoCost").textContent =
      Math.round(cost).toLocaleString("en-EG") + " ج.م";
    document.getElementById("autoSave").textContent =
      Math.round(saving).toLocaleString("en-EG") + " ج.م";
  });
})();