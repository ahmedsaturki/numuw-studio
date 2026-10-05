(() => {
  const form = document.getElementById("brief");
  const output = document.getElementById("output");
  if (!form || !output) return;

  const value = (id) => document.getElementById(id).value.trim();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const industry = value("industry");
    const goal = value("goal");
    const problem = value("problem");
    const success = value("success") || "لم أحدد معيار النجاح بعد";
    const timeline = value("timeline");

    const message =
      "مرحبًا NUMUW 👋\n\n" +
      "نوع النشاط: " + industry + "\n" +
      "الهدف: " + goal + "\n" +
      "المشكلة الحالية: " + problem + "\n" +
      "معيار النجاح: " + success + "\n" +
      "التوقيت: " + timeline + "\n\n" +
      "أريد معرفة أفضل نقطة بداية والنطاق المناسب.";

    const url = "https://wa.me/201127788810?text=" + encodeURIComponent(message);

    output.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Brief جاهز للمراجعة";

    const preview = document.createElement("div");
    preview.id = "briefText";
    preview.className = "notice brief-output";
    preview.textContent = message;

    const actions = document.createElement("div");
    actions.className = "actions";

    const copy = document.createElement("button");
    copy.id = "copyBrief";
    copy.className = "btn btn-outline";
    copy.type = "button";
    copy.textContent = "نسخ الـBrief";

    copy.addEventListener("click", async () => {
      if (!navigator.clipboard || !window.isSecureContext) {
        copy.textContent = "النسخ غير متاح هنا؛ انسخ النص يدويًا";
        setTimeout(() => { copy.textContent = "نسخ الـBrief"; }, 2200);
        return;
      }

      try {
        await navigator.clipboard.writeText(message);
        copy.textContent = "تم نسخ الـBrief ✓";
        setTimeout(() => { copy.textContent = "نسخ الـBrief"; }, 1800);
      } catch {
        copy.textContent = "انسخ النص يدويًا";
        setTimeout(() => { copy.textContent = "نسخ الـBrief"; }, 2200);
      }
    });

    const send = document.createElement("a");
    send.className = "btn btn-primary";
    send.href = url;
    send.target = "_blank";
    send.rel = "noopener noreferrer";
    send.textContent = "مراجعة ثم إرسال على WhatsApp";

    const finder = document.createElement("a");
    finder.className = "btn btn-outline";
    finder.href = "../solution-finder/";
    finder.textContent = "اكتشف الحل أولًا";

    actions.append(copy, send, finder);
    output.append(title, preview, actions);
  });
})();