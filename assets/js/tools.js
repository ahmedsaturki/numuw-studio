(function(){
  function num(value,fallback){var n=Number(value);return Number.isFinite(n)?n:(fallback||0)}
  function money(n){return Math.round(n).toLocaleString('en-EG')+' ج.م'}
  function bindRangeOutputs(root){
    root.querySelectorAll('input[type="range"]').forEach(function(input){
      var output=document.createElement('output');
      output.className='range-value';
      output.setAttribute('for',input.name||input.id);
      output.textContent=input.value+'/100';
      input.insertAdjacentElement('afterend',output);
      input.addEventListener('input',function(){output.textContent=input.max==='100'?input.value+'%':input.value+'/5'});
    });
  }
  function setupDiagnostic(){
    var f=document.getElementById('diagForm');
    if(!f)return;
    bindRangeOutputs(f);
    var map=[['وضوح العرض','offer'],['الظهور','visibility'],['الموقع','site'],['التقاط العملاء','capture'],['المتابعة','follow'],['العمليات','ops'],['الأتمتة','automation'],['القياس','data']];
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var values=map.map(function(x){return{name:x[0],value:num(f.elements[x[1]].value,1)}});
      var sum=values.reduce(function(a,x){return a+x.value},0);
      var score=Math.round(((sum-values.length)/(values.length*4))*100);
      document.getElementById('score').textContent=score+'/100';
      document.getElementById('scoreBar').style.width=score+'%';
      document.getElementById('scoreText').textContent=score<40?'الأساس يحتاج ترتيبًا واضحًا قبل التوسع.':score<70?'هناك أساس قابل للبناء، لكن توجد فجوات تستحق الأولوية.':'الأساس جيد؛ ركّز الآن على القياس والتحسين لا على إضافة أدوات بلا حاجة.';
      values.sort(function(a,b){return a.value-b.value});
      document.getElementById('priorities').innerHTML=values.slice(0,3).map(function(x){return'<li>'+x.name+' — '+x.value+'/5</li>'}).join('');
      var wa=document.getElementById('diagWa');
      if(wa)wa.href='https://wa.me/201127788810?text='+encodeURIComponent('مرحبًا NUMUW — نتيجة التشخيص الذاتي '+score+'/100. أكبر ثلاث فجوات: '+values.slice(0,3).map(function(x){return x.name}).join('، ')+'. أريد تحديد الخطوة التالية.');
    });
  }
  function setupAutomation(){
    var f=document.getElementById('autoForm');
    if(!f)return;
    bindRangeOutputs(f);
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var hours=num(f.elements.hours.value),days=num(f.elements.days.value),people=num(f.elements.people.value,1),rate=num(f.elements.rate.value),potential=Math.min(100,Math.max(0,num(f.elements.potential.value)));
      var monthlyHours=hours*days*people,monthlyCost=monthlyHours*rate,monthlyValue=monthlyCost*potential/100;
      var score=Math.round(Math.min(100,(monthlyHours/80)*35+(potential/100)*35+(people>=3?20:10)+(monthlyCost>=10000?10:0)));
      document.getElementById('autoHours').textContent=monthlyHours.toFixed(1);
      document.getElementById('autoCost').textContent=money(monthlyCost);
      document.getElementById('autoSave').textContent=money(monthlyValue);
      var label=document.getElementById('autoScore');
      if(!label){
        label=document.createElement('div');label.id='autoScore';label.className='score';label.style.marginTop='18px';label.setAttribute('role','status');label.setAttribute('aria-live','polite');
        var target=document.getElementById('autoSave');if(target)target.parentElement.insertAdjacentElement('afterend',label);
      }
      label.textContent='أولوية الأتمتة: '+score+'/100';
    });
  }
  function setupEstimator(){
    var list=document.getElementById('estList');
    if(!list)return;
    var items=[
      ['Landing page',8000,'one'],['موقع شركة',15000,'one'],['هوية بصرية',6000,'one'],['أتمتة عملية',8000,'one'],
      ['AI Workflow',8000,'one'],['SEO / Local',6000,'one'],['CRM',6000,'one'],['KPI Dashboard',12000,'one'],['Growth Partner شهري',6500,'monthly']
    ];
    var selected=[];
    list.innerHTML='';
    items.forEach(function(item){
      var b=document.createElement('button');b.className='card';b.type='button';b.setAttribute('aria-pressed','false');b.classList.add('tool-option');
      b.innerHTML='<div class="icon">＋</div><h3>'+item[0]+'</h3><p>'+(item[2]==='monthly'?'من ':'مرة واحدة من ')+item[1].toLocaleString('en-EG')+' ج.م</p>';
      b.addEventListener('click',function(){
        var i=selected.indexOf(item);
        if(i>-1){selected.splice(i,1);b.setAttribute('aria-pressed','false');b.classList.remove('is-selected');}
        else{selected.push(item);b.setAttribute('aria-pressed','true');b.classList.add('is-selected');}
        var one=selected.filter(function(x){return x[2]==='one'}).reduce(function(a,x){return a+x[1]},0);
        var monthly=selected.filter(function(x){return x[2]==='monthly'}).reduce(function(a,x){return a+x[1]},0);
        document.getElementById('estTotal').textContent=money(one);
        var recurring=document.getElementById('estRecurring');
        if(!recurring){recurring=document.createElement('div');recurring.id='estRecurring';recurring.className='notice';document.getElementById('estTotal').parentElement.appendChild(recurring)}
        recurring.textContent=monthly?'اشتراك/تشغيل شهري من '+money(monthly):'لا يوجد مكوّن شهري مختار.';
        var wa=document.getElementById('estWa');
        wa.href='https://wa.me/201127788810?text='+encodeURIComponent('مرحبًا NUMUW — مكونات البداية: '+selected.map(function(x){return x[0]}).join('، ')+'. التقدير مرة واحدة: '+money(one)+'، والتشغيل الشهري: '+(monthly?money(monthly):'غير موجود')+'. أريد تحديد النطاق.');
      });
      list.appendChild(b);
    });
  }
  function setupRoadmap(){
    var f=document.getElementById('roadForm');
    if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var g=f.elements.goal.value,m=f.elements.maturity.value;
      var phases;
      if(g==='تقليل العمل اليدوي')phases=[['01–30','قياس ورسم العملية الحالية','Gate: هل التكرار والتكلفة مفهومين؟'],['31–60','بناء واختبار Workflow واحد','Gate: هل تعمل الحالات الأساسية دون كسر التشغيل؟'],['61–90','توثيق وتحسين وتحديد الجولة التالية','Gate: هل الوفر/الاستقرار يستحقان الاستمرار؟']];
      else if(g==='بناء حضور رقمي')phases=[['01–30','تحديد العرض والرسالة والـbaseline','Gate: هل يعرف الفريق ما الذي نريد أن يحدث بعد الزيارة؟'],['31–60','بناء/تحسين الموقع والصفحات الأساسية','Gate: هل المسار قابل للفهم والتنفيذ على الهاتف؟'],['61–90','قياس الظهور والتحويل وتحسين الأولويات','Gate: هل لدينا بيانات كافية للخطوة التالية؟']];
      else if(g==='تنظيم المبيعات والمتابعة')phases=[['01–30','رسم رحلة الـLead وتعريف المراحل','Gate: هل نعرف أين تتوقف الفرص؟'],['31–60','Capture + CRM + Follow-up workflow','Gate: هل لا تضيع المتابعة بين الأشخاص؟'],['61–90','Pipeline review وتحسين نقاط الاختناق','Gate: هل تحسن الانضباط والوضوح؟']];
      else if(g==='تحسين التجارة الإلكترونية')phases=[['01–30','تدقيق العرض وتجربة الشراء','Gate: هل نعرف أكبر نقطة تسرب؟'],['31–60','تحسين صفحات المنتجات ومسار الدفع','Gate: هل التغيير قابل للقياس؟'],['61–90','اختبارات وتحسين retention','Gate: هل نحتفظ بالتحسين أم نغير الفرضية؟']];
      else phases=[['01–30','تحديد ICP والعرض والـbaseline','Gate: هل المشكلة محددة؟'],['31–60','تنفيذ أكبر تدخل قابل للاختبار','Gate: هل هناك أثر يمكن قياسه؟'],['61–90','قياس وتحسين وتحديد الجولة التالية','Gate: ما القرار المبني على البيانات؟']];
      var note=m==='مبتدئ'?'ابدأ بأصغر نطاق يمكن قياسه.':m==='متقدم'?'يمكن تسريع البناء بعد التحقق من الاعتماديات.':'وازن بين quick wins وبناء الأساس.';
      document.getElementById('road').innerHTML='<ol>'+phases.map(function(p){return'<li style="margin:14px 0"><strong>Days '+p[0]+'</strong><br>'+p[1]+'<br><small>'+p[2]+'</small></li>'}).join('')+'</ol><div class="notice">'+note+' الخريطة تخطيط أولي وليست التزامًا تعاقديًا.</div>';
    });
  }
  function setupROI(){
    var f=document.getElementById('roiForm');
    if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var inv=Math.max(0,num(f.elements.invest.value)),ben=Math.max(0,num(f.elements.benefit.value)),m=Math.max(1,num(f.elements.months.value,1)),ex=Math.max(0,num(f.elements.extra.value));
      var base=inv+ex,total=ben*m,net=total-base,roi=base?net/base*100:0,payback=ben?base/ben:null;
      var out=document.getElementById('roiBreak');
      document.getElementById('roiReturn').textContent=(roi>=0?'+':'')+roi.toFixed(1)+'%';
      out.textContent=ben?'تعادل نظري بعد '+payback.toFixed(1)+' شهر — إجمالي منفعة السيناريو '+money(total)+' — صافي السيناريو '+money(net):'أدخل منفعة شهرية موجبة لحساب نقطة التعادل.';
      var target=document.getElementById('roiSensitivity');
      if(!target){target=document.createElement('div');target.id='roiSensitivity';target.className='kpi';out.insertAdjacentElement('afterend',target)}
      var levels=[['حذر',0.5],['أساسي',1],['متحفظ/متفائل',1.5]];
      target.innerHTML=levels.map(function(x){var t=ben*m*x[1],n=t-base,r=base?n/base*100:0;return'<div class="card"><b>'+x[0]+'</b><p>ROI: '+r.toFixed(1)+'%</p><p>صافي: '+money(n)+'</p></div>'}).join('');
    });
  }
  function setupReadiness(){
    var f=document.getElementById('siteForm');if(!f)return;
    var checks=[
      ['رسالة العرض واضحة',12,'Message'],['CTA رئيسي واضح',10,'Conversion'],['طريقة تواصل سهلة',8,'Conversion'],['معلومات شركة موثوقة',8,'Trust'],
      ['صفحات خدمة مخصصة',7,'Content'],['روابط داخلية منطقية',7,'Content'],['صور محسنة',5,'Technical'],['Responsive mobile',10,'Technical'],
      ['HTTPS',8,'Technical'],['Canonical',8,'SEO'],['Structured data',7,'SEO'],['قياس واضح قبل التنفيذ',10,'Measurement']
    ];
    f.innerHTML=checks.map(function(x,i){return'<label class="check-row"><input type="checkbox" name="c'+i+'"><span>'+x[0]+'</span><small>'+x[2]+'</small></label>'}).join('');
    f.addEventListener('change',function(){
      var done=0;checks.forEach(function(x,i){if(f.elements['c'+i].checked)done+=x[1]});
      var missing=checks.filter(function(_,i){return !f.elements['c'+i].checked}).sort(function(a,b){return b[1]-a[1]}).slice(0,4);
      document.getElementById('siteScore').textContent=done+'/100';
      document.getElementById('siteBar').style.width=done+'%';
      document.getElementById('siteAdvice').innerHTML=(missing.length?missing.map(function(x){return'<li>'+x[0]+' <small>('+x[2]+')</small></li>'}):['الأساسيات الرئيسية مكتملة']).join('');
    });
  }
  function setupSolutionFinder(){
    var f=document.getElementById('finder'),r=document.getElementById('result');if(!f||!r)return;
    function pick(d){
      var goal=d.goal,clarity=d.clarity,speed=d.speed,biz=d.business;
      if(clarity==='low')return {title:'ابدأ بـ NUMUW Diagnostic',desc:'المشكلة تحتاج baseline قبل شراء تنفيذ محدد.',href:'../diagnostic/',label:'ابدأ التشخيص',why:['نحدد الاختناق بدل افتراض الحل','نرتب الأولويات حسب الأثر','نكتب المنتج بعد فهم الواقع']};
      if(speed==='ongoing')return {title:'ابدأ بـ Growth Partner',desc:'أنت تبحث عن إيقاع تحسين مستمر بدل مشروع منفرد.',href:'../../products/growth-partner/',label:'استعرض Growth Partner',why:['أولويات شهرية','قياس وتحسين متكرر','يتغير نطاق العمل مع البيانات']};
      if(goal==='automation')return {title:'ابدأ بـ Automation Sprint',desc:'لديك عملية محددة يمكن رسمها واختبارها وأتمتتها.',href:'../../landing/automation/',label:'استعرض الأتمتة',why:['Workflow واحد واضح','اختبار قبل التوسع','توثيق وتسليم']};
      if(goal==='website'){
        var route=biz==='manufacturing'?'../../landing/manufacturing/':biz==='b2b'?'../../landing/b2b/':biz==='realestate'?'../../landing/real-estate/':'../../landing/website/';
        return {title:'ابدأ بمسار الموقع الأنسب',desc:'الاحتياج يدور حول الموقع ومسار التحويل، مع مراعاة قطاعك.',href:route,label:'استعرض المسار',why:['عرض ورسالة أوضح','تحويل ومسار تواصل','تقليل اختلاف الاحتياجات حسب القطاع']};
      }
      if(goal==='system')return {title:'ابدأ بـ Growth System',desc:'عدة طبقات تحتاج أن تعمل تحت استراتيجية واحدة.',href:'../../products/growth-system/',label:'استعرض Growth System',why:['ربط الحضور بالتشغيل','تقليل الحلول المنفصلة','نطاق موحد واختبار وتسليم']};
      return {title:'ابدأ بالتشخيص',desc:'قبل اختيار منتج أكبر، ثبّت المشكلة والأولوية.',href:'../diagnostic/',label:'افتح التشخيص',why:['baseline','أولوية','scope']};
    }
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var d=Object.fromEntries(new FormData(f).entries()),p=pick(d);
      r.innerHTML='<h2 class="result-title">'+p.title+'</h2><p class="lead" style="margin-top:10px">'+p.desc+'</p><div class="why">'+p.why.map(function(x){return'<div>'+x+'</div>'}).join('')+'</div><div class="actions"><a class="btn btn-dark" href="'+p.href+'">'+p.label+'</a><a class="btn btn-outline" href="../brief-builder/">ابنِ Brief</a></div>';
    });
  }
  function setupBrief(){
    var f=document.getElementById('brief'),o=document.getElementById('output');if(!f||!o)return;
    function value(id){var e=document.getElementById(id);return e?e.value.trim():''}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var industry=value('industry'),goal=value('goal'),problem=value('problem'),success=value('success')||'لم أحدد معيار النجاح بعد',timeline=value('timeline'),source=value('source')||'غير محدد',owner=value('owner')||'غير محدد';
      var msg='مرحبًا NUMUW 👋\n\nنوع النشاط: '+industry+'\nالهدف: '+goal+'\nالمشكلة الحالية: '+problem+'\nمعيار النجاح: '+success+'\nالتوقيت: '+timeline+'\nمصدر الطلب الحالي: '+source+'\nصاحب القرار/المشاركون: '+owner+'\n\nأريد معرفة أفضل نقطة بداية والنطاق المناسب.';
      o.innerHTML='<h2>Brief جاهز للمراجعة</h2><div id="briefText" class="notice" style="white-space:pre-wrap;margin-top:16px"></div><div class="actions"><button id="copyBrief" class="btn btn-outline" type="button">نسخ الـBrief</button><a id="sendBrief" class="btn btn-primary" href="#" target="_blank" rel="noopener noreferrer">مراجعة ثم إرسال على WhatsApp</a><a class="btn btn-outline" href="../solution-finder/">اكتشف الحل أولًا</a></div>';
      document.getElementById('briefText').textContent=msg;
      document.getElementById('sendBrief').href='https://wa.me/201127788810?text='+encodeURIComponent(msg);
    });
    document.addEventListener('click',function(e){
      var b=e.target.closest('#copyBrief');if(!b)return;
      var el=document.getElementById('briefText');if(!el)return;
      navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(el.textContent).then(function(){b.textContent='تم النسخ ✓';setTimeout(function(){b.textContent='نسخ الـBrief'},1800)}).catch(function(){b.textContent='انسخ النص يدويًا'}):b.textContent='النسخ غير متاح هنا؛ انسخ النص يدويًا';
    });
  }
  var toolStarted={};
  function emitTool(name,event){
    var payload={tool:name};
    try{window.dispatchEvent(new CustomEvent('numuw:'+event,{detail:payload}))}catch(err){}
    if(Array.isArray(window.dataLayer)){try{window.dataLayer.push({event:'numuw_'+event,tool:name})}catch(err){}}
  }
  function watchTool(form,name){
    if(!form)return;
    form.addEventListener('input',function(){
      if(!toolStarted[name]){toolStarted[name]=true;emitTool(name,'tool_start');}
    });
    form.addEventListener('change',function(){
      if(!toolStarted[name]){toolStarted[name]=true;emitTool(name,'tool_start');}
    });
    form.addEventListener('submit',function(){emitTool(name,'tool_complete');});
  }
  watchTool(document.getElementById('diagForm'),'growth-diagnostic');
  watchTool(document.getElementById('autoForm'),'automation-finder');
  watchTool(document.getElementById('roadForm'),'90-day-roadmap');
  watchTool(document.getElementById('roiForm'),'roi-scenario');
  watchTool(document.getElementById('siteForm'),'website-readiness');
  watchTool(document.getElementById('finder'),'solution-finder');
  watchTool(document.getElementById('brief'),'brief-builder');

  setupDiagnostic();
  setupAutomation();
  setupEstimator();
  setupRoadmap();
  setupROI();
  setupReadiness();
  setupSolutionFinder();
  setupBrief();
})();