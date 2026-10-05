(() => {
  const form = document.getElementById("roadForm");
  const output = document.getElementById("road");
  if (!form || !output) return;

  const basePlans = {
    "زيادة العملاء المحتملين": [
      "تحديد ICP والعرض ومسار الطلب",
      "Landing + Lead capture",
      "Follow-up + qualification",
      "Measurement + optimization"
    ],
    "تقليل العمل اليدوي": [
      "رسم العملية الحالية",
      "تبسيط نقاط التكرار",
      "بناء Automation Sprint",
      "اختبار الحالات والتوثيق"
    ],
    "بناء حضور رقمي": [
      "تحديد العرض والرسالة",
      "بناء الصفحة / الموقع",
      "SEO + local foundation",
      "قياس وتحسين التحويل"
    ],
    "تنظيم المبيعات والمتابعة": [
      "رسم رحلة الـLead",
      "Lead capture + CRM",
      "Follow-up + qualification",
      "Pipeline review + optimization"
    ],
    "تحسين التجارة الإلكترونية": [
      "تدقيق العرض والـUX",
      "تحسين صفحات المنتجات",
      "قياس التحويل",
      "Retention experiments"
    ]
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const goal = form.elements.goal.value;
    const maturity = form.elements.maturity.value;
    const plan = [...(basePlans[goal] || basePlans["زيادة العملاء المحتملين"])];

    if (maturity === "مبتدئ") {
      plan[0] = "تثبيت الأساس: ICP + العرض + baseline";
    } else if (maturity === "متوسط") {
      plan[0] = "مراجعة baseline وتحديد أكبر عنق زجاجة";
    } else {
      plan[0] = "تحليل الأداء وتحديد أكبر فرصة تحسين قابلة للقياس";
    }

    output.innerHTML = "";
    const ol = document.createElement("ol");
    plan.forEach((item, index) => {
      const li = document.createElement("li");
      li.style.margin = "12px 0";
      const strong = document.createElement("strong");
      strong.textContent = "Days " + (index * 30 + 1) + "-" + ((index + 1) * 30);
      li.append(strong, document.createTextNode(" - " + item));
      ol.appendChild(li);
    });
    output.appendChild(ol);

    const note = document.createElement("div");
    note.className = "notice";
    note.style.marginTop = "18px";
    note.textContent =
      "خطة أولية لمستوى جاهزية " +
      maturity +
      ". تحتاج baseline حقيقي ونطاقًا وموارد قبل أن تصبح خطة تنفيذ تعاقدية.";
    output.appendChild(note);
  });
})();