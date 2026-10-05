(() => {
  const form = document.getElementById("siteForm");
  if (!form) return;

  const checks = [
    "عنوان واضح",
    "Meta description",
    "Responsive mobile",
    "CTA رئيسي",
    "طريقة تواصل سهلة",
    "معلومات شركة موثوقة",
    "صفحات خدمة مخصصة",
    "روابط داخلية",
    "صور محسنة",
    "HTTPS",
    "Canonical",
    "Structured data"
  ];

  form.replaceChildren();

  checks.forEach((label, index) => {
    const wrapper = document.createElement("label");
    wrapper.className = "check-row";
    wrapper.htmlFor = "readiness-" + index;

    const input = document.createElement("input");
    input.id = "readiness-" + index;
    input.name = "check-" + index;
    input.type = "checkbox";

    const text = document.createTextNode(label);

    wrapper.append(input, text);
    form.appendChild(wrapper);
  });

  const update = () => {
    const done = form.querySelectorAll("input:checked").length;
    const score = Math.round((done / checks.length) * 100);
    const missing = checks.filter((_, index) => !form.elements["check-" + index].checked).slice(0, 4);

    document.getElementById("siteScore").textContent = score + "/100";
    document.getElementById("siteBar").style.width = score + "%";

    const advice = document.getElementById("siteAdvice");
    advice.replaceChildren();

    (missing.length ? missing : ["الأساسيات المكتملة"]).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      advice.appendChild(li);
    });
  };

  form.addEventListener("change", update);
  update();
})();