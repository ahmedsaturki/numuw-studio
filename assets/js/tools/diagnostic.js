(() => {
  const form = document.getElementById("diagForm");
  if (!form) return;

  const dimensions = [
    ["وضوح العرض", "offer"],
    ["الظهور", "visibility"],
    ["الموقع", "site"],
    ["التقاط العملاء", "capture"],
    ["المتابعة", "follow"],
    ["العمليات", "ops"],
    ["الأتمتة", "automation"],
    ["القياس", "data"]
  ];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = dimensions.map(([name, key]) => ({
      name,
      value: Number(form.elements[key].value)
    }));

    const total = values.reduce((sum, item) => sum + item.value, 0);
    const score = Math.round((total / (dimensions.length * 5)) * 100);
    const priorities = [...values].sort((a, b) => a.value - b.value).slice(0, 3);

    document.getElementById("score").textContent = score + "/100";
    document.getElementById("scoreBar").style.width = score + "%";
    document.getElementById("scoreText").textContent =
      score < 55
        ? "الأساس يحتاج ترتيب أولويات قبل التوسع."
        : score < 75
          ? "هناك أساس جيد مع فرص واضحة للتحسين."
          : "الأساس جيد؛ ركز على القياس والتحسين المتدرج.";

    const priorityList = document.getElementById("priorities");
    priorityList.replaceChildren();
    priorities.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name + " - " + item.value + "/5";
      priorityList.appendChild(li);
    });

    const message =
      "مرحبًا NUMUW - نتيجتي في التشخيص الذاتي " +
      score +
      "/100. أكبر الفرص: " +
      priorities.map((item) => item.name).join("، ") +
      ". أريد الخطوة التالية.";

    document.getElementById("diagWa").href =
      "https://wa.me/201127788810?text=" + encodeURIComponent(message);
  });
})();