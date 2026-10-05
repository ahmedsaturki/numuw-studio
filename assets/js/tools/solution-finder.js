(() => {
  const form = document.getElementById("finder");
  const result = document.getElementById("result");
  if (!form || !result) return;

  const recommendations = {
    clarity: {
      title: "ابدأ بـ NUMUW Diagnostic",
      desc: "المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.",
      href: "../diagnostic/",
      label: "ابدأ التشخيص",
      why: ["ترتيب الأولويات أولًا", "تقليل خطر بناء الشيء الخطأ", "تحديد المنتج بعد فهم baseline"]
    },
    website: {
      title: "ابدأ بـ Website / Landing",
      desc: "الاحتياج واضح حول الواجهة ومسار التحويل.",
      href: "../../landing/website/",
      label: "استعرض حل المواقع",
      why: ["رسالة واضحة نسبيًا", "نقطة التحويل هي الأولوية", "يمكن تحديد النطاق قبل التنفيذ"]
    },
    automation: {
      title: "ابدأ بـ Automation Sprint",
      desc: "لديك عملية متكررة يمكن رسمها واختبارها وأتمتتها.",
      href: "../../landing/automation/",
      label: "استعرض الأتمتة",
      why: ["مشكلة عملية محددة", "الأثر مرتبط بتكرار العمل", "الأفضل اختبار workflow واحد أولًا"]
    },
    system: {
      title: "ابدأ بـ Growth System",
      desc: "تحتاج أكثر من طبقة تعمل معًا تحت استراتيجية واحدة.",
      href: "../../products/growth-system/",
      label: "استعرض Growth System",
      why: ["عدة طبقات مترابطة", "الحاجة تتجاوز مشروعًا منفردًا", "النطاق يحتاج تصميمًا موحدًا"]
    }
  };

  const render = (pick, business) => {
    result.replaceChildren();

    const title = document.createElement("h2");
    title.className = "result-title";
    title.textContent = pick.title;

    const description = document.createElement("p");
    description.className = "lead result-copy";
    description.textContent =
      pick.desc +
      (business === "manufacturing"
        ? " ومسار المصانع"
        : business === "b2b"
          ? " ومسار B2B"
          : business === "realestate"
            ? " ومسار العقارات"
            : "");

    const why = document.createElement("div");
    why.className = "why";
    pick.why.forEach((item) => {
      const line = document.createElement("div");
      line.textContent = item;
      why.appendChild(line);
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    const primary = document.createElement("a");
    primary.className = "btn btn-dark";
    primary.href = pick.href;
    primary.textContent = pick.label;

    const brief = document.createElement("a");
    brief.className = "btn btn-outline";
    brief.href = "../brief-builder/";
    brief.textContent = "ابنِ Brief";

    actions.append(primary, brief);
    result.append(title, description, why, actions);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let pick = recommendations[data.get("goal")] || recommendations.clarity;
    const clarity = data.get("clarity");
    const speed = data.get("speed");
    const business = data.get("business");

    if (clarity === "low" && data.get("goal") !== "clarity") {
      pick = recommendations.clarity;
    }

    if (speed === "ongoing") {
      pick = {
        title: "ابدأ بـ Growth Partner",
        desc: "أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.",
        href: "../../products/growth-partner/",
        label: "استعرض Growth Partner",
        why: ["تحسين مستمر", "عدة مجالات قابلة للتحسين", "القرار يتكرر مع البيانات"]
      };
    }

    render(pick, business);
  });
})();