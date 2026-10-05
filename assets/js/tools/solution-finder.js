(function(){var f=document.getElementById("finder"),r=document.getElementById("result");if(!f||!r)return;
var map={
clarity:{title:"ابدأ بـ NUMUW Diagnostic",desc:"المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.",href:"../diagnostic/",label:"ابدأ التشخيص الذاتي",why:["ترتيب الأولويات أولًا","تقليل خطر بناء الشيء الخطأ","تحديد المنتج بعد فهم الوضع الحالي"]},
website:{title:"ابدأ بـ Digital Kickoff",desc:"الاحتياج أصبح أوضح حول الواجهة ومسار التحويل، ويمكن الانتقال إلى تأسيس رقمي محدد.",href:"../../products/digital-kickoff/",label:"استعرض Digital Kickoff",why:["الهدف واضح نسبيًا","الأصل الرقمي هو نقطة الاختناق","النطاق يمكن كتابته قبل التنفيذ"]},
websiteExplore:{title:"ابدأ من Website / Landing",desc:"الاحتياج واضح حول الواجهة، لكن الأفضل الآن فهم جاهزية الموقع والنطاق قبل الالتزام بمنتج.",href:"../../landing/website/",label:"استكشف Web & Conversion",why:["نقطة التحويل هي الأولوية","يمكن فحص الجاهزية قبل البناء","تحديد النطاق يقلل المفاجآت"]},
automation:{title:"ابدأ بـ Automation Finder",desc:"هناك workflow متكرر يستحق القياس قبل البناء.",href:"../automation-finder/",label:"اختبر فرصة الأتمتة",why:["مشكلة عملية قابلة للقياس","الأثر مرتبط بتكرار العمل","اختبار workflow واحد أولًا"]},
automationProduct:{title:"ابدأ بـ Automation Sprint",desc:"لديك workflow محدد بما يكفي للانتقال من الفرصة إلى نطاق بناء واختبار.",href:"../../products/automation-sprint/",label:"استعرض Automation Sprint",why:["workflow واضح","التعقيد يمكن حصره","القبول والاختبار جزء من المنتج"]},
system:{title:"ابدأ بـ Growth System",desc:"تحتاج عدة طبقات مترابطة تحت استراتيجية واحدة بدل مشاريع منفصلة.",href:"../../products/growth-system/",label:"استعرض Growth System",why:["عدة طبقات مترابطة","المشكلة تتجاوز مشروعًا منفردًا","النطاق يحتاج تصميمًا موحدًا"]},
partner:{title:"ابدأ بـ Growth Partner",desc:"أنت تبحث عن إيقاع تحسين مستمر بعد وجود أساس يمكن قياسه.",href:"../../products/growth-partner/",label:"استعرض Growth Partner",why:["تحسين مستمر","القرار يتكرر مع البيانات","الأنسب بعد وجود baseline مفيد"]}
};
var segments={
manufacturing:{label:"سياق المصانع",href:"../../landing/manufacturing/"},
b2b:{label:"سياق B2B",href:"../../landing/b2b/"},
realestate:{label:"سياق العقارات",href:"../../landing/real-estate/"}
};
function render(pick,segment){
 r.replaceChildren();
 var title=document.createElement("h2");title.className="result-title";title.textContent=pick.title;
 var desc=document.createElement("p");desc.className="lead tool-note";desc.textContent=pick.desc;
 var why=document.createElement("div");why.className="why";
 pick.why.forEach(function(x){var item=document.createElement("div");item.textContent=x;why.appendChild(item)});
 var actions=document.createElement("div");actions.className="actions";
 var a=document.createElement("a");a.className="btn btn-dark";a.href=pick.href;a.textContent=pick.label;actions.appendChild(a);
 var b=document.createElement("a");b.className="btn btn-outline";b.href="../brief-builder/";b.textContent="ابنِ Brief";actions.appendChild(b);
 if(segment){var s=document.createElement("a");s.className="btn btn-outline";s.href=segment.href;s.textContent=segment.label;actions.appendChild(s)}
 r.append(title,desc,why,actions);
}
f.addEventListener("submit",function(e){
 e.preventDefault();
 var d=new FormData(f),goal=d.get("goal"),clarity=d.get("clarity"),speed=d.get("speed"),business=d.get("business");
 var pick=map.clarity;
 if(clarity==="low"){pick=map.clarity}
 else if(speed==="ongoing"){pick=map.partner}
 else if(goal==="automation"){pick=speed==="sprint"&&clarity==="high"?map.automationProduct:map.automation}
 else if(goal==="website"){pick=clarity==="high"&&speed!=="starter"?map.website:map.websiteExplore}
 else if(goal==="system"){pick=clarity==="high"&&speed==="system"?map.system:map.websiteExplore}
 else if(goal==="clarity"){pick=map.clarity}
 render(pick,segments[business]||null);
});})();