(function(){
  function n(value, fallback){
    var x=Number(value);
    return Number.isFinite(x)?x:(fallback||0);
  }
  function formatEGP(value){
    return Math.round(value).toLocaleString('en-EG')+' ج.م';
  }
  function qs(root,selector){return root.querySelector(selector)}
  function announce(el,text){
    if(el)el.textContent=text;
  }
  function make(tag,attrs,text){
    var el=document.createElement(tag);
    Object.keys(attrs||{}).forEach(function(k){el.setAttribute(k,attrs[k])});
    if(text!==undefined)el.textContent=text;
    return el;
  }

  var main=document.querySelector('main[data-tool]');
  if(!main)return;
  var tool=main.getAttribute('data-tool');

  if(tool==='automation-finder'){
    var form=qs(main,'#autoForm');
    if(!form)return;
    var potential=qs(form,'[name="potential"]');
    var potentialOut=qs(main,'#autoPotential');
    function calc(){
      var hours=n(form.elements.hours.value);
      var days=n(form.elements.days.value);
      var people=n(form.elements.people.value);
      var rate=n(form.elements.rate.value);
      var pct=n(form.elements.potential.value);
      var automationCost=n(form.elements.automationCost?form.elements.automationCost.value:0);
      var hoursMonth=hours*days*people;
      var laborCost=hoursMonth*rate;
      var savings=laborCost*(pct/100);
      var payback=savings>0&&automationCost>0?automationCost/savings:null;
      announce(qs(main,'#autoHours'),hoursMonth.toFixed(1));
      announce(qs(main,'#autoCost'),formatEGP(laborCost));
      announce(qs(main,'#autoSave'),formatEGP(savings));
      announce(qs(main,'#autoPayback'),payback===null?(automationCost===0?'أدخل تكلفة الأتمتة لاختبار الاسترداد.':'لا يوجد وفر شهري مفترض.'):(payback.toFixed(1)+' شهر'));
      if(potentialOut)potentialOut.textContent=pct+'%';
    }
    form.addEventListener('input',calc);
    form.addEventListener('submit',function(e){e.preventDefault();calc()});
    calc();
  }

  if(tool==='diagnostic'){
    var form=qs(main,'#diagForm');
    if(!form)return;
    var fields=[
      ['وضوح العرض','offer'],['الحضور في Google','visibility'],['الموقع / Landing','site'],
      ['التقاط العملاء','capture'],['المتابعة','follow'],['العمليات','ops'],
      ['الأتمتة','automation'],['القياس','data']
    ];
    function calc(){
      var values=fields.map(function(x){return {name:x[0],value:n(form.elements[x[1]].value,3)}});
      var total=values.reduce(function(a,x){return a+x.value},0);
      var score=Math.round(total/40*100);
      announce(qs(main,'#score'),score+'/100');
      announce(qs(main,'#scoreText'),score<55?'الأساس يحتاج ترتيب أولويات قبل التوسع.':score<75?'هناك أساس جيد مع فرص واضحة للتحسين.':'الأساس جيد؛ ركز على القياس والتحسين المتدرج.');
      var bar=qs(main,'#scoreBar');if(bar)bar.style.width=score+'%';
      var list=qs(main,'#priorities');if(list){
        list.replaceChildren();
        values.sort(function(a,b){return a.value-b.value}).slice(0,3).forEach(function(x){
          list.appendChild(make('li',{},x.name+' — '+x.value+'/5'));
        });
      }
      var wa=qs(main,'#diagWa');
      if(wa){
        var msg='مرحبًا NUMUW — نتيجتي في التشخيص الذاتي '+score+'/100. أكبر فرص التحسين: '+values.slice(0,3).map(function(x){return x.name}).join('، ')+'. أريد الخطوة التالية.';
        wa.href='https://wa.me/201127788810?text='+encodeURIComponent(msg);
      }
    }
    form.addEventListener('input',calc);
    form.addEventListener('change',calc);
    form.addEventListener('submit',function(e){e.preventDefault();calc()});
    calc();
  }

  if(tool==='estimator'){
    var list=qs(main,'#estList');
    if(!list)return;
    var items=[
      {name:'Landing Page',price:8000,type:'one-time'},
      {name:'Corporate Website',price:15000,type:'one-time'},
      {name:'Visual Identity',price:6000,type:'one-time'},
      {name:'Automation Workflow',price:8000,type:'one-time'},
      {name:'AI Workflow',price:8000,type:'one-time'},
      {name:'SEO / Local Foundation',price:6000,type:'one-time'},
      {name:'CRM Setup',price:6000,type:'one-time'},
      {name:'KPI Dashboard',price:12000,type:'one-time'},
      {name:'Growth Partner',price:6500,type:'monthly'}
    ];
    var selected=[];
    list.replaceChildren();
    items.forEach(function(item){
      var b=make('button',{class:'card estimate-option',type:'button','aria-pressed':'false'});
      b.appendChild(make('div',{class:'icon'},item.type==='monthly'?'M':'＋'));
      b.appendChild(make('h3',{},item.name));
      b.appendChild(make('p',{},'من '+formatEGP(item.price)+(item.type==='monthly'?' شهريًا':'')));
      b.addEventListener('click',function(){
        var i=selected.indexOf(item);
        if(i>=0){selected.splice(i,1);b.setAttribute('aria-pressed','false');b.classList.remove('is-selected');}
        else{selected.push(item);b.setAttribute('aria-pressed','true');b.classList.add('is-selected');}
        render();
      });
      list.appendChild(b);
    });
    function render(){
      var one=selected.filter(function(x){return x.type==='one-time'}).reduce(function(a,x){return a+x.price},0);
      var monthly=selected.filter(function(x){return x.type==='monthly'}).reduce(function(a,x){return a+x.price},0);
      announce(qs(main,'#estOneTime'),formatEGP(one));
      announce(qs(main,'#estMonthly'),monthly?formatEGP(monthly)+' / شهر':'—');
      announce(qs(main,'#estCount'),String(selected.length));
      var wa=qs(main,'#estWa');
      if(wa){
        var msg='مرحبًا NUMUW — اخترت: '+(selected.map(function(x){return x.name}).join('، ')||'لا شيء بعد')+'؛ إجمالي البداية '+formatEGP(one)+(monthly?' + '+formatEGP(monthly)+' شهريًا':'')+'. أريد تحديد النطاق.';
        wa.href='https://wa.me/201127788810?text='+encodeURIComponent(msg);
      }
    }
    render();
  }

  if(tool==='roadmap'){
    var form=qs(main,'#roadForm');
    if(!form)return;
    function plan(goal,maturity){
      var base={
        'زيادة العملاء المحتملين':['توضيح ICP والعرض','إصلاح مسار Lead capture','تنظيم qualification والمتابعة','قياس جودة الطلبات والتحويل'],
        'تقليل العمل اليدوي':['رسم العملية الحالية','تبسيط الخطوات والقواعد','بناء واختبار Workflow واحد','توثيق وتشغيل ومراجعة'],
        'بناء حضور رقمي':['تحديد الرسالة والعرض','بناء الصفحة/الموقع الأساسي','Search/SEO foundation','قياس التحويل وتحسينه'],
        'تنظيم المبيعات والمتابعة':['رسم رحلة الـLead','توحيد حقول ومراحل CRM','بناء Follow-up workflow','Pipeline review وتحسين'],
        'تحسين التجارة الإلكترونية':['تدقيق العرض والـUX','تحسين صفحات المنتجات ومسار الدفع','قياس التحويل والسلال','Retention / experimentation']
      }[goal]||['تحديد الأولوية','بناء أول أصل','اختبار المسار','قياس وتحسين'];
      if(maturity==='مبتدئ')return [base[0],base[1],base[2],base[3]];
      if(maturity==='متوسط')return [base[1],base[2],base[3],'اختبار تحسين ثانٍ وربط القياس'];
      return ['مراجعة baseline المتقدم والاختناقات','اختبار فرضية ذات أثر أعلى','توسيع ما أثبت جدواه','بناء دورة تحسين مستمرة'];
    }
    function render(){
      var phases=plan(form.elements.goal.value,form.elements.maturity.value);
      var road=qs(main,'#road');if(!road)return;
      road.replaceChildren();
      var ol=make('ol',{class:'roadmap-list'});
      phases.forEach(function(x,i){
        var li=make('li',{class:'roadmap-item'});
        li.appendChild(make('strong',{},'Days '+(i*30+1)+'–'+((i+1)*30)));
        li.appendChild(document.createTextNode(' — '+x));
        ol.appendChild(li);
      });
      road.appendChild(ol);
      road.appendChild(make('div',{class:'notice u-mt-18'},'الخريطة أولية؛ تتحول إلى خطة تنفيذ بعد تثبيت baseline والنطاق والاعتماديات.'));
    }
    form.addEventListener('change',render);
    form.addEventListener('submit',function(e){e.preventDefault();render()});
    render();
  }

  if(tool==='roi-calculator'){
    var form=qs(main,'#roiForm');
    if(!form)return;
    function calc(){
      var investment=n(form.elements.invest.value);
      var benefit=n(form.elements.benefit.value);
      var months=Math.max(1,n(form.elements.months.value,1));
      var extra=n(form.elements.extra.value);
      var totalCost=investment+extra;
      var totalBenefit=benefit*months;
      var net=totalBenefit-totalCost;
      var roi=(net/totalCost)*100;
      var payback=benefit>0?totalCost/benefit:null;
      announce(qs(main,'#roiReturn'),roi.toFixed(1)+'%');
      announce(qs(main,'#roiTotalBenefit'),formatEGP(totalBenefit));
      announce(qs(main,'#roiNet'),formatEGP(net));
      announce(qs(main,'#roiBreak'),payback===null?'لا توجد منفعة شهرية مدخلة':'نقطة التعادل الحسابية: '+payback.toFixed(1)+' شهر');
    }
    form.addEventListener('input',calc);
    form.addEventListener('submit',function(e){e.preventDefault();calc()});
    calc();
  }

  if(tool==='website-readiness'){
    var form=qs(main,'#siteForm');
    if(!form)return;
    var checks=[
      'عنوان واضح','Meta description','Responsive mobile','CTA رئيسي','طريقة تواصل سهلة',
      'معلومات شركة موثوقة','صفحات خدمة مخصصة','روابط داخلية','صور محسنة','HTTPS',
      'Canonical','Structured data'
    ];
    form.replaceChildren();
    checks.forEach(function(labelText,i){
      var wrapper=make('label',{class:'check-row'});
      var input=make('input',{type:'checkbox',name:'c'+i,id:'site-c'+i});
      var text=make('span',{},labelText);
      wrapper.appendChild(input);wrapper.appendChild(text);form.appendChild(wrapper);
    });
    function render(){
      var done=form.querySelectorAll('input:checked').length;
      var score=Math.round(done/checks.length*100);
      announce(qs(main,'#siteScore'),score+'/100');
      var bar=qs(main,'#siteBar');if(bar)bar.style.width=score+'%';
      var advice=qs(main,'#siteAdvice');if(advice){
        advice.replaceChildren();
        var missing=checks.filter(function(_,i){return !form.elements['c'+i].checked}).slice(0,4);
        (missing.length?missing:['الأساسيات المكتملة']).forEach(function(x){advice.appendChild(make('li',{},x))});
      }
    }
    form.addEventListener('change',render);
    render();
  }

  if(tool==='solution-finder'){
    var finder=qs(main,'#finder'),result=qs(main,'#result');
    if(!finder||!result)return;
    var map={
      clarity:{title:'ابدأ بـ NUMUW Diagnostic',desc:'المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.',href:'../diagnostic/',label:'ابدأ التشخيص',why:['ترتيب الأولويات أولًا','تقليل خطر بناء الشيء الخطأ','تعريف baseline قبل القياس']},
      website:{title:'ابدأ بـ Conversion Website',desc:'الواجهة ومسار التحويل هما نقطة البداية الأقرب.',href:'../../landing/website/',label:'استعرض حلول المواقع',why:['الرسالة تحتاج وضوحًا في الواجهة','نقطة التحويل أولوية','يمكن تحديد النطاق قبل التنفيذ']},
      automation:{title:'ابدأ بـ Automation Sprint',desc:'لديك عملية متكررة تستحق الرسم والاختبار والأتمتة.',href:'../../landing/automation/',label:'استعرض الأتمتة',why:['مشكلة عملية محددة','أثر التكرار واضح','الأفضل اختبار workflow واحد أولًا']},
      system:{title:'ابدأ بـ Growth System',desc:'تحتاج عدة طبقات تعمل تحت منطق واحد.',href:'../../products/growth-system/',label:'استعرض Growth System',why:['عدة طبقات مترابطة','الاحتياج يتجاوز مشروعًا منفردًا','النطاق يحتاج تصميمًا موحدًا']}
    };
    var sectors={
      b2b:{label:'B2B',href:'../../landing/b2b/'},
      manufacturing:{label:'المصانع والصناعة',href:'../../landing/manufacturing/'},
      realestate:{label:'العقارات',href:'../../landing/real-estate/'},
      other:null
    };
    finder.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(finder);
      var goal=d.get('goal'),clarity=d.get('clarity'),speed=d.get('speed'),business=d.get('business');
      var pick=map[goal]||map.clarity;
      if(clarity==='low'&&goal!=='clarity')pick=map.clarity;
      if(speed==='ongoing')pick={title:'ابدأ بـ Growth Partner',desc:'أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.',href:'../../products/growth-partner/',label:'استعرض Growth Partner',why:['تحسين مستمر','القرار يتكرر مع البيانات','النطاق والسعة يحددان الأولويات']};
      var sector=sectors[business];
      result.replaceChildren();
      result.appendChild(make('h2',{class:'result-title'},pick.title));
      result.appendChild(make('p',{class:'lead'},pick.desc));
      var why=make('div',{class:'why'});pick.why.forEach(function(x){why.appendChild(make('div',{},x))});result.appendChild(why);
      if(sector){result.appendChild(make('p',{class:'notice u-mt-18'},'السياق المقترح: '+sector.label));}
      var actions=make('div',{class:'actions'});
      actions.appendChild(make('a',{class:'btn btn-dark',href:pick.href},pick.label));
      if(sector)actions.appendChild(make('a',{class:'btn btn-outline',href:sector.href},'افتح مسار القطاع'));
      actions.appendChild(make('a',{class:'btn btn-outline',href:'../brief-builder/'},'ابنِ Brief'));
      result.appendChild(actions);
    });
  }

  if(tool==='brief-builder'){
    var form=qs(main,'#brief'),output=qs(main,'#output');
    if(!form||!output)return;
    function val(id){return (qs(form,'#'+id)?.value||'').trim()}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var industry=val('industry'),goal=val('goal'),problem=val('problem'),current=val('current'),success=val('success')||'لم أحدد معيار النجاح بعد',timeline=val('timeline');
      var msg='مرحبًا NUMUW 👋\n\nنوع النشاط: '+industry+'\nالهدف: '+goal+'\nالمشكلة الحالية: '+problem+'\nما هو موجود حاليًا: '+(current||'لم أحدد بعد')+'\nمعيار النجاح: '+success+'\nالتوقيت: '+timeline+'\n\nأريد معرفة أفضل نقطة بداية والنطاق المناسب.';
      output.replaceChildren();
      output.appendChild(make('h2',{},'Brief جاهز للمراجعة'));
      output.appendChild(make('div',{id:'briefText',class:'notice brief-output'},msg));
      var actions=make('div',{class:'actions'});
      var copy=make('button',{id:'copyBrief',class:'btn btn-outline',type:'button'},'نسخ الـBrief');
      var wa=make('a',{class:'btn btn-primary',href:'https://wa.me/201127788810?text='+encodeURIComponent(msg),target:'_blank',rel:'noopener noreferrer'},'مراجعة ثم إرسال على WhatsApp');
      actions.appendChild(copy);actions.appendChild(wa);actions.appendChild(make('a',{class:'btn btn-outline',href:'../solution-finder/'},'اكتشف الحل أولًا'));
      output.appendChild(actions);
      copy.addEventListener('click',function(){
        if(navigator.clipboard&&window.isSecureContext){
          navigator.clipboard.writeText(msg).then(function(){copy.textContent='تم نسخ الـBrief ✓';setTimeout(function(){copy.textContent='نسخ الـBrief'},1800)}).catch(function(){copy.textContent='انسخ النص يدويًا'});
        }else{copy.textContent='النسخ غير متاح هنا؛ انسخ النص يدويًا'}
      });
    });
  }
})();