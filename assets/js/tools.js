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
      b.appendChild(make('span',{class:'icon','aria-hidden':'true'},item.type==='monthly'?'M':'＋'));
      b.appendChild(make('strong',{class:'estimate-title'},item.name));
      b.appendChild(make('span',{class:'estimate-price'},'من '+formatEGP(item.price)+(item.type==='monthly'?' شهريًا':'')));
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
    var catalog={
      diagnostic:{title:'ابدأ بـ NUMUW Diagnostic',desc:'المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.',href:'../diagnostic/',label:'ابدأ التشخيص',type:'Diagnostic',why:['ترتيب الأولويات أولًا','تعريف baseline قبل الحكم على النتيجة','تقليل خطر بناء الشيء الخطأ']},
      kickoff:{title:'ابدأ بـ Digital Kickoff',desc:'تحتاج أساسًا رقميًا واضحًا ومحدودًا قبل التوسع.',href:'../../products/digital-kickoff/',label:'استعرض Digital Kickoff',type:'Digital Kickoff',why:['حاجة تأسيسية واضحة','نطاق أصغر من منظومة كاملة','أصل يمكن البناء عليه لاحقًا']},
      automation:{title:'ابدأ بـ Automation Sprint',desc:'لديك عملية متكررة تستحق الرسم والاختبار والأتمتة.',href:'../../products/automation-sprint/',label:'استعرض Automation Sprint',type:'Automation Sprint',why:['مشكلة تشغيلية محددة','أثر التكرار قابل للقياس','الأفضل اختبار workflow واحد أولًا']},
      system:{title:'ابدأ بـ Growth System',desc:'تحتاج عدة طبقات تعمل تحت منطق واحد.',href:'../../products/growth-system/',label:'استعرض Growth System',type:'Growth System',why:['عدة طبقات مترابطة','الاحتياج يتجاوز تدخلًا منفردًا','النطاق يحتاج تصميمًا موحدًا']},
      partner:{title:'ابدأ بـ Growth Partner',desc:'أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.',href:'../../products/growth-partner/',label:'استعرض Growth Partner',type:'Growth Partner',why:['تحسين مستمر','قرار شهري مبني على البيانات','السعة والأولوية تُدار بوضوح']}
    };
    var sectors={
      b2b:{label:'B2B',href:'../../landing/b2b/'},
      manufacturing:{label:'المصانع والصناعة',href:'../../landing/manufacturing/'},
      realestate:{label:'العقارات',href:'../../landing/real-estate/'},
      ecommerce:{label:'التجارة الإلكترونية',href:'../../landing/ecommerce/'},
      other:null
    };
    function rank(goal,clarity,speed,business){
      var score={diagnostic:0,kickoff:0,automation:0,system:0,partner:0};
      var reasons={diagnostic:[],kickoff:[],automation:[],system:[],partner:[]};
      function add(key,n,reason){score[key]+=n;if(reason)reasons[key].push(reason);}
      if(clarity==='low'){add('diagnostic',6,'وضوح المشكلة منخفض')}
      if(goal==='clarity')add('diagnostic',5,'الهدف نفسه هو ترتيب الأولويات');
      if(goal==='website'){add('kickoff',5,'الواجهة ومسار التحويل هما الهدف');add('system',1,'قد تحتاج طبقات مرتبطة لاحقًا');}
      if(goal==='automation')add('automation',6,'الهدف هو تقليل العمل المتكرر');
      if(goal==='system')add('system',6,'الهدف يحتاج طبقات مترابطة');
      if(speed==='ongoing')add('partner',7,'الاختيار المستمر أهم من مشروع منفرد');
      if(speed==='starter')add('kickoff',3,'تفضيل بداية محددة وصغيرة');
      if(speed==='sprint')add('automation',2,'تفضيل مشروع مركز وسريع');
      if(speed==='system')add('system',3,'تفضيل عدة طبقات مترابطة');
      if(clarity==='high'&&goal==='website')add('kickoff',1,'المشكلة محددة بما يكفي لتحديد نطاق أولي');
      if(clarity==='high'&&goal==='automation')add('automation',1,'العملية محددة بما يكفي لـSprint');
      if(business==='b2b')add('system',1,'سياق B2B قد يستفيد من ربط الطلب والمتابعة والقرار');
      if(business==='manufacturing'){add('automation',1,'السياق الصناعي يرفع قيمة تحسين العمليات');add('system',1,'السياق الصناعي قد يحتاج أكثر من طبقة');}
      if(business==='realestate'){add('kickoff',1,'الحضور ومسار الـLead مهمان في العقارات');add('system',1,'المتابعة والتشغيل قد تصبح جزءًا من الاختناق');}
      if(business==='ecommerce'){add('kickoff',2,'مسار الشراء يبدأ من أصل رقمي قابل للتحويل');add('system',1,'التحويل والاحتفاظ والقياس قد تحتاج طبقات مترابطة');}
      var ranked=Object.keys(score).sort(function(a,b){return score[b]-score[a]});
      if(ranked[0]==='diagnostic' && clarity==='high' && goal!=='clarity') ranked.push('kickoff');
      return {ranked:ranked,score:score,reasons:reasons};
    }
    finder.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(finder);
      var goal=d.get('goal'),clarity=d.get('clarity'),speed=d.get('speed'),business=d.get('business');
      var ranking=rank(goal,clarity,speed,business),primary=ranking.ranked[0],pick=catalog[primary];
      var second=ranking.ranked[1],confidence=Math.min(96,Math.max(52,62+(ranking.score[primary]-ranking.score[second])*5));
      result.replaceChildren();
      result.appendChild(make('h2',{class:'result-title'},pick.title));
      result.appendChild(make('p',{class:'lead'},pick.desc));
      var confidenceBox=make('div',{class:'notice u-mt-18'},'درجة الملاءمة المبدئية: '+confidence+'% — هذه توصية توجيهية وليست تشخيصًا نهائيًا.');
      result.appendChild(confidenceBox);
      var why=make('div',{class:'why'});
      pick.why.forEach(function(x){why.appendChild(make('div',{},x))});
      result.appendChild(why);
      var directReason=ranking.reasons[primary].slice(0,2);
      if(directReason.length){var reasonBox=make('div',{class:'notice u-mt-18'},'لماذا هذا المسار؟ '+directReason.join(' · '));result.appendChild(reasonBox);}
      var sector=sectors[business];
      if(sector)result.appendChild(make('p',{class:'notice u-mt-18'},'السياق المقترح: '+sector.label));
      var actions=make('div',{class:'actions'});
      actions.appendChild(make('a',{class:'btn btn-dark',href:pick.href},pick.label));
      if(sector)actions.appendChild(make('a',{class:'btn btn-outline',href:sector.href},'افتح مسار القطاع'));
      actions.appendChild(make('a',{class:'btn btn-outline',href:'../brief-builder/'},'ابنِ Brief'));
      result.appendChild(actions);
      var alt=make('p',{class:'note u-mt-18'},'بديل قريب: '+catalog[second].type+' — '+catalog[second].desc);
      result.appendChild(alt);
      try{window.dispatchEvent(new CustomEvent('numuw:tool_complete',{detail:{tool:'solution-finder',state:'complete'}}))}catch(err){}
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