(function(){
  function byId(id){return document.getElementById(id)}
  function ready(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fn,{once:true});else fn()}
  function money(value){return Math.round(value).toLocaleString("en-EG")+" ج.م"}
  function waUrl(message){return "https://wa.me/201127788810?text="+encodeURIComponent(message)}
  function node(tag,className,text){
    var el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=text;
    return el
  }

  function initAutomation(){
    var f=byId("autoForm");if(!f)return;
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var hours=Math.max(0,Number(f.hours.value)||0);
      var days=Math.max(0,Number(f.days.value)||0);
      var people=Math.max(0,Number(f.people.value)||0);
      var rate=Math.max(0,Number(f.rate.value)||0);
      var potential=Math.min(100,Math.max(0,Number(f.potential.value)||0));
      var monthly=hours*days*people,total=monthly*rate,saving=total*(potential/100);
      byId("autoHours").textContent=monthly.toFixed(1);
      byId("autoCost").textContent=money(total);
      byId("autoSave").textContent=money(saving)
    })
  }

  function initDiagnostic(){
    var f=byId("diagForm");if(!f)return;
    var dimensions=[["وضوح العرض","offer"],["الظهور","visibility"],["الموقع","site"],["التقاط العملاء","capture"],["المتابعة","follow"],["العمليات","ops"],["الأتمتة","automation"],["القياس","data"]];
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var values=dimensions.map(function(x){return {name:x[0],value:Math.min(5,Math.max(0,Number(f.elements[x[1]].value)||0))}});
      var score=Math.round(values.reduce(function(sum,x){return sum+x.value},0)/(dimensions.length*5)*100);
      byId("score").textContent=score+"/100";
      byId("scoreBar").style.width=score+"%";
      byId("scoreText").textContent=score<55?"الأساس يحتاج ترتيب أولويات قبل التوسع.":score<75?"هناك أساس جيد مع فرص واضحة للتحسين.":"الأساس جيد؛ ركز على القياس والتحسين المتدرج.";
      values.sort(function(a,b){return a.value-b.value});
      var list=byId("priorities");list.replaceChildren();
      values.slice(0,3).forEach(function(x){list.appendChild(node("li","",x.name+" - "+x.value+"/5"))});
      byId("diagWa").href=waUrl("مرحبًا NUMUW - نتيجتي في التشخيص الذاتي "+score+"/100. أكبر الفرص: "+values.slice(0,3).map(function(x){return x.name}).join("، ")+". أريد الخطوة التالية.")
    })
  }

  function initEstimator(){
    var list=byId("estList"),total=byId("estTotal"),wa=byId("estWa");if(!list||!total||!wa)return;
    var items=[
      {name:"لاندنج بيدج",price:8000,billing:"one-time"},
      {name:"موقع شركة",price:15000,billing:"one-time"},
      {name:"هوية بصرية",price:6000,billing:"one-time"},
      {name:"أتمتة عملية",price:8000,billing:"one-time"},
      {name:"AI Workflow",price:8000,billing:"one-time"},
      {name:"SEO / Local",price:6000,billing:"one-time"},
      {name:"CRM",price:6000,billing:"one-time"},
      {name:"KPI Dashboard",price:12000,billing:"one-time"},
      {name:"Growth Partner شهري",price:6500,billing:"monthly"}
    ];
    var selected=[];
    function renderEstimate(){
      var oneTime=selected.filter(function(x){return x.billing==="one-time"}).reduce(function(s,x){return s+x.price},0);
      var monthly=selected.filter(function(x){return x.billing==="monthly"}).reduce(function(s,x){return s+x.price},0);
      total.replaceChildren();
      if(!selected.length){total.textContent="0 ج.م";return}
      total.appendChild(node("strong","",money(oneTime)));
      if(oneTime)total.appendChild(document.createElement("br"));
      if(monthly)total.appendChild(node("span","estimate-monthly",(oneTime?" + ":"")+money(monthly)+" / شهر"));
      wa.href=waUrl("مرحبًا NUMUW - اخترت "+selected.map(function(x){return x.name}).join("، ")+"؛ التقدير المبدئي: مرة واحدة "+money(oneTime)+ (monthly?"، و"+money(monthly)+" شهريًا":"")+". أريد تحديد النطاق.");
    }
    items.forEach(function(item){
      var button=node("button","card tool-choice");
      button.type="button";button.setAttribute("aria-pressed","false");
      button.appendChild(node("div","icon","＋"));
      button.appendChild(node("h3","",item.name));
      button.appendChild(node("p","", "من "+money(item.price)+(item.billing==="monthly"?" / شهر":"")));
      button.addEventListener("click",function(){
        var i=selected.indexOf(item);
        if(i>-1){selected.splice(i,1);button.classList.remove("selected");button.setAttribute("aria-pressed","false")}
        else{selected.push(item);button.classList.add("selected");button.setAttribute("aria-pressed","true")}
        renderEstimate();
      });
      list.appendChild(button)
    })
  }

  function initRoadmap(){
    var f=byId("roadForm");if(!f)return;
    var road=byId("road");
    var maps={
      "زيادة العملاء المحتملين":["Baseline + ICP + offer","Landing / CTA + lead capture","Follow-up + measurement + next experiment"],
      "تقليل العمل اليدوي":["Process map + baseline","Workflow build + test","Handover + measurement + refinement"],
      "بناء حضور رقمي":["Offer + asset audit","Site / landing + search foundation","Conversion testing + measurement"],
      "تنظيم المبيعات والمتابعة":["Pipeline + baseline","CRM + qualification + follow-up","Pipeline review + optimization"],
      "تحسين التجارة الإلكترونية":["Offer + UX audit","Product / checkout improvements","Conversion + retention experiments"]
    };
    var maturityLabels={
      "مبتدئ":["تثبيت الأساس","تنفيذ تدريجي","قياس أولي"],
      "متوسط":["ترتيب وتحسين","تنفيذ واختبار","قياس وتحسين"],
      "متقدم":["تدقيق أعمق","تكامل وتحسين","تجارب وتحسين مركب"]
    };
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var steps=maps[f.goal.value]||["Baseline + priorities","Build the biggest improvement","Measure + define the next cycle"];
      var labels=maturityLabels[f.maturity.value]||maturityLabels["مبتدئ"];
      var cycles=steps.map(function(step,i){return labels[i]+": "+step});
      road.replaceChildren();
      var list=node("ol");
      cycles.forEach(function(step,i){
        var li=node("li","tool-roadmap-item");
        li.appendChild(node("strong","","Days "+(i*30+1)+"-"+((i+1)*30)));
        li.appendChild(document.createTextNode(" - "+step));
        list.appendChild(li)
      });
      road.appendChild(list);
      road.appendChild(node("div","notice mt-18","خطة أولية من ثلاث دورات. تحتاج baseline حقيقي واعتماديات واضحة قبل الالتزام بالتنفيذ."));
    })
  }

  function initRoi(){
    var f=byId("roiForm");if(!f)return;
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var inv=Math.max(1,Number(f.invest.value)||0),ben=Math.max(0,Number(f.benefit.value)||0),months=Math.max(1,Number(f.months.value)||0),extra=Math.max(0,Number(f.extra.value)||0);
      var total=ben*months,net=total-inv-extra;
      byId("roiReturn").textContent=((net/(inv+extra))*100).toFixed(1)+"%";
      byId("roiBreak").textContent=ben>0?"نقطة التعادل الحسابية: "+((inv+extra)/ben).toFixed(1)+" شهر":"لا توجد منفعة شهرية مدخلة"
    })
  }

  function initWebsite(){
    var f=byId("siteForm");if(!f)return;
    var checks=["عنوان واضح","Meta description","Responsive mobile","CTA رئيسي","طريقة تواصل سهلة","معلومات شركة موثوقة","صفحات خدمة مخصصة","روابط داخلية","صور محسنة","HTTPS","Canonical","Structured data"];
    f.replaceChildren();
    checks.forEach(function(labelText,i){
      var id="site-check-"+i,label=node("label","tool-check-label"),input=document.createElement("input");
      input.id=id;input.type="checkbox";input.name="c"+i;label.htmlFor=id;label.appendChild(input);label.appendChild(document.createTextNode(" "+labelText));f.appendChild(label)
    });
    function update(){
      var checked=checks.filter(function(_,i){return f.elements["c"+i].checked}).length;
      var score=Math.round(checked/checks.length*100);
      byId("siteScore").textContent=score+"/100";
      byId("siteBar").style.width=score+"%";
      var advice=byId("siteAdvice");advice.replaceChildren();
      var missing=checks.filter(function(_,i){return !f.elements["c"+i].checked}).slice(0,4);
      (missing.length?missing:["الأساسيات المكتملة"]).forEach(function(item){advice.appendChild(node("li","",item))})
    }
    f.addEventListener("change",update);update()
  }

  function initBrief(){
    var f=byId("brief"),o=byId("output");if(!f||!o)return;
    function value(id){return (byId(id)?.value||"").trim()}
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var industry=value("industry"),goal=value("goal"),problem=value("problem"),success=value("success")||"لم أحدد معيار النجاح بعد",timeline=value("timeline");
      var msg="مرحبًا NUMUW 👋\n\nنوع النشاط: "+industry+"\nالهدف: "+goal+"\nالمشكلة الحالية: "+problem+"\nمعيار النجاح: "+success+"\nالتوقيت: "+timeline+"\n\nأريد معرفة أفضل نقطة بداية والنطاق المناسب.";
      o.replaceChildren();
      o.appendChild(node("h2","", "Brief جاهز للمراجعة"));
      o.appendChild(node("div","notice brief-output",msg));
      var actions=node("div","actions"),copy=node("button","btn btn-outline","نسخ الـBrief"),send=document.createElement("a"),finder=document.createElement("a");
      copy.type="button";copy.id="copyBrief";
      send.className="btn btn-primary";send.href=waUrl(msg);send.target="_blank";send.rel="noopener noreferrer";send.textContent="مراجعة ثم إرسال على WhatsApp";
      finder.className="btn btn-outline";finder.href="../solution-finder/";finder.textContent="اكتشف الحل أولًا";
      actions.appendChild(copy);actions.appendChild(send);actions.appendChild(finder);o.appendChild(actions);
      copy.addEventListener("click",function(){
        var textValue=msg;
        if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(textValue).then(function(){copy.textContent="تم نسخ الـBrief ✓"}).catch(function(){copy.textContent="انسخ النص يدويًا"})}
        else copy.textContent="النسخ غير متاح هنا؛ انسخ النص يدويًا";
      })
    })
  }

  function initSolutionFinder(){
    var f=byId("finder"),r=byId("result");if(!f||!r)return;
    var map={
      clarity:{title:"ابدأ بـ NUMUW Diagnostic",desc:"المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.",href:"../diagnostic/",label:"ابدأ التشخيص",why:["ترتيب الأولويات أولًا","تقليل خطر بناء الشيء الخطأ","تحديد المنتج بعد فهم baseline"]},
      website:{title:"ابدأ بـ Website / Landing",desc:"الاحتياج واضح حول الواجهة ومسار التحويل.",href:"../../landing/website/",label:"استعرض حل المواقع",why:["رسالة واضحة نسبيًا","نقطة التحويل هي الأولوية","يمكن تحديد النطاق قبل التنفيذ"]},
      automation:{title:"ابدأ بـ Automation Sprint",desc:"لديك عملية متكررة يمكن رسمها واختبارها وأتمتتها.",href:"../../landing/automation/",label:"استعرض الأتمتة",why:["مشكلة عملية محددة","الأثر مرتبط بتكرار العمل","الأفضل اختبار workflow واحد أولًا"]},
      system:{title:"ابدأ بـ Growth System",desc:"تحتاج أكثر من طبقة تعمل معًا تحت استراتيجية واحدة.",href:"../../products/growth-system/",label:"استعرض Growth System",why:["عدة طبقات مترابطة","الحاجة تتجاوز مشروعًا منفردًا","النطاق يحتاج تصميمًا موحدًا"]}
    };
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var d=new FormData(f),pick=map[d.get("goal")];
      if(d.get("clarity")==="low"&&d.get("goal")!=="clarity")pick=map.clarity;
      if(d.get("speed")==="ongoing")pick={title:"ابدأ بـ Growth Partner",desc:"أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.",href:"../../products/growth-partner/",label:"استعرض Growth Partner",why:["تحسين مستمر","عدة مجالات قابلة للتحسين","القرار يتكرر مع البيانات"]};
      if(!pick)pick=map.clarity;
      r.replaceChildren();
      r.appendChild(node("h2","result-title",pick.title));
      r.appendChild(node("p","lead mt-10",pick.desc+(d.get("business")==="manufacturing"?" وصفحتك المتخصصة للمصانع":d.get("business")==="b2b"?" ومسار B2B":d.get("business")==="realestate"?" ومسار العقارات":"")));
      var why=node("div","why");pick.why.forEach(function(x){why.appendChild(node("div","",x))});r.appendChild(why);
      var actions=node("div","actions"),primary=document.createElement("a"),brief=document.createElement("a");
      primary.className="btn btn-dark";primary.href=pick.href;primary.textContent=pick.label;
      brief.className="btn btn-outline";brief.href="../brief-builder/";brief.textContent="ابنِ Brief";
      actions.appendChild(primary);actions.appendChild(brief);r.appendChild(actions)
    })
  }

  ready(function(){
    initAutomation();initDiagnostic();initEstimator();initRoadmap();initRoi();initWebsite();initBrief();initSolutionFinder()
  })
})();