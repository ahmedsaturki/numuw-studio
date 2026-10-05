(() => {
  const form = document.getElementById("roiForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const investment = Math.max(1, Number(form.elements.invest.value));
    const benefit = Math.max(0, Number(form.elements.benefit.value));
    const months = Math.max(1, Number(form.elements.months.value));
    const extra = Math.max(0, Number(form.elements.extra.value));

    const totalInvestment = investment + extra;
    const totalBenefit = benefit * months;
    const net = totalBenefit - totalInvestment;
    const roi = (net / totalInvestment) * 100;

    document.getElementById("roiReturn").textContent =
      roi.toFixed(1) + "%";

    document.getElementById("roiBreak").textContent =
      benefit > 0
        ? "نقطة التعادل الحسابية: " + (totalInvestment / benefit).toFixed(1) + " شهر"
        : "لا توجد منفعة شهرية مدخلة؛ لا يمكن حساب نقطة التعادل.";
  });
})();