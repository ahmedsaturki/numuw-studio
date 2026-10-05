(() => {
  const list = document.getElementById("estList");
  const total = document.getElementById("estTotal");
  const wa = document.getElementById("estWa");
  if (!list || !total || !wa) return;

  const items = [
    ["لاندنج بيدج", 8000],
    ["موقع شركة", 15000],
    ["هوية بصرية", 6000],
    ["أتمتة عملية", 8000],
    ["AI Workflow", 8000],
    ["SEO / Local", 6000],
    ["CRM", 6000],
    ["KPI Dashboard", 12000],
    ["Growth Partner شهري", 6500]
  ];

  const selected = new Set();

  const render = () => {
    const entries = [...selected].map((index) => items[index]);
    const sum = entries.reduce((acc, [, price]) => acc + price, 0);

    total.textContent = sum.toLocaleString("en-EG") + " ج.م";

    entries.forEach(() => {});
    wa.href = "https://wa.me/201127788810?text=" + encodeURIComponent(
      "مرحبًا NUMUW - اخترت " +
      entries.map(([name]) => name).join("، ") +
      "؛ التقدير الأدنى " +
      sum.toLocaleString("en-EG") +
      " ج.م. أريد تحديد النطاق."
    );
  };

  items.forEach(([name, price], index) => {
    const button = document.createElement("button");
    button.className = "card selection-button";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML =
      '<div class="icon">＋</div><h3></h3><p></p>';
    button.querySelector("h3").textContent = name;
    button.querySelector("p").textContent =
      "من " + price.toLocaleString("en-EG") + " ج.م";

    button.addEventListener("click", () => {
      const isSelected = selected.has(index);
      if (isSelected) selected.delete(index);
      else selected.add(index);

      button.classList.toggle("is-selected", !isSelected);
      button.setAttribute("aria-pressed", String(!isSelected));
      button.querySelector(".icon").textContent = isSelected ? "＋" : "✓";
      render();
    });

    list.appendChild(button);
  });

  render();
})();