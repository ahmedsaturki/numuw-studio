(function(){
  function emitTool(name,event){
    var detail={tool:name,state:event};
    try{window.dispatchEvent(new CustomEvent('numuw:tool_'+event,{detail:detail}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push({event:'numuw_tool_'+event,tool:name})}catch(e){}
    }
  }
  function number(value,fallback){
    var n=Number(value);
    return Number.isFinite(n)?n:fallback;
  }
  function textNode(tag,text){
    var el=document.createElement(tag);
    el.textContent=text;
    return el;
  }
  function actionLink(href,label,kind){
    var a=document.createElement('a');
    a.className='btn '+(kind||'btn-outline');
    a.href=href;
    a.textContent=label;
    return a;
  }
  function addRangeOutput(input){
    if(!input||input.dataset.outputReady)return;
    input.dataset.outputReady='true';
    var parent=input.parentElement;
    if(parent){
      var row=document.createElement('div');
      row.className='range-row';
      var label=parent.querySelector('label');
      if(label)row.appendChild(label);
      var output=textNode('output',String(input.value));
      output.className='range-output';
      output.htmlFor=input.id||input.name||'';
      row.appendChild(output);
      parent.insertBefore(row,input);
      input.addEventListener('input',function(){output.textContent=input.value});
    }
  }

  function initAutomation(){
    var f=document.getElementById('autoForm');
    if(!f)return;
    var potential=f.elements.potential;
    addRangeOutput(potential);
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var hours=Math.max(0,number(f.elements.hours.value,0));
      var days=Math.max(0,number(f.elements.days.value,0));
      var people=Math.max(1,number(f.elements.people.value,1));
      var rate=Math.max(0,number(f.elements.rate.value,0));
      var pct=Math.min(100,Math.max(0,number(f.elements.potential.value,0)));
      var monthlyHours=hours*days*people;
      var monthlyCost=monthlyHours*rate;
      var potentialValue=monthlyCost*(pct/100);
      document.getElementById('autoHours').textContent=monthlyHours.toFixed(1);
      document.getElementById('autoCost').textContent=Math.round(monthlyCost).toLocaleString('en-EG')+' ج.م';
      document.getElementById('autoSave').textContent=Math.round(potentialValue).toLocaleString('en-EG')+' ج.م';
      emitTool('automation-finder','complete');
    });
  }

  function initDiagnostic(){
    var f=document.getElementById('diagForm');
    if(!f)return;
    ['offer','visibility','site','capture','follow','ops','automation','data'].forEach(function(name){
      addRangeOutput(f.elements[name]);
    });
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var d=[['وضوح العرض','offer'],['الظهور','visibility'],['الموقع','site'],['التقاط العملاء','capture'],['المتابعة','follow'],['العمليات','ops'],['الأتمتة','automation'],['القياس','data']];
      var values=d.map(function(item){return {name:item[0],value:Math.min(5,Math.max(1,number(f.elements[item[1]].value,3)))}});
      var score=Math.round(values.reduce(function(sum,item){return sum+item.value},0)/40*100);
      var scoreText=document.getElementById('scoreText');
      document.getElementById('score').textContent=score+'/100';
      if(scoreText)scoreText.textContent=score<55?'الأساس يحتاج ترتيب أولويات قبل التوسع.':score<75?'هناك أساس جيد مع فرص واضحة للتحسين.':'الأساس جيد؛ ركز على القياس والتحسين المتدرج.';
      var priorities=document.getElementById('priorities');
      if(priorities){
        priorities.replaceChildren();
        values.sort(function(a,b){return a.value-b.value});
        values.slice(0,3).forEach(function(item){
          var li=textNode('li',item.name+' - '+item.value+'/5');
          priorities.appendChild(li);
        });
      }
      var wa=document.getElementById('diagWa');
      if(wa){
        var message='مرحبًا NUMUW - نتيجتي في التشخيص الذاتي '+score+'/100. أكبر الفرص: '+values.slice(0,3).map(function(item){return item.name}).join('، ')+'. أريد الخطوة التالية.';
        wa.href='https://wa.me/201127788810?text='+encodeURIComponent(message);
      }
      emitTool('diagnostic','complete');
    });
  }

  function initEstimator(){
    var list=document.getElementById('estList');
    if(!list)return;
    var total=document.getElementById('estTotal');
    var wa=document.getElementById('estWa');
    var items=[['لاندنج بيدج',8000],['موقع شركة',15000],['هوية بصرية',6000],['أتمتة عملية',8000],['AI Workflow',8000],['SEO / Local',6000],['CRM',6000],['KPI Dashboard',12000],['Growth Partner شهري',6500]];
    var selected=[];
    list.replaceChildren();
    items.forEach(function(item){
      var button=document.createElement('button');
      button.className='card selectable';
      button.type='button';
      button.setAttribute('aria-pressed','false');
      button.appendChild(textNode('strong','+'));
      button.appendChild(textNode('h3',item[0]));
      button.appendChild(textNode('p','من '+item[1].toLocaleString('en-EG')+' ج.م'));
      button.addEventListener('click',function(){
        var index=selected.indexOf(item);
        if(index>-1){
          selected.splice(index,1);
          button.classList.remove('selected');
          button.setAttribute('aria-pressed','false');
        }else{
          selected.push(item);
          button.classList.add('selected');
          button.setAttribute('aria-pressed','true');
        }
        var sum=selected.reduce(function(totalValue,current){return totalValue+current[1]},0);
        total.textContent=sum.toLocaleString('en-EG')+' ج.م';
        var message=selected.length?'مرحبًا NUMUW - اخترت '+selected.map(function(x){return x[0]}).join('، ')+'؛ التقدير الأدنى '+sum.toLocaleString('en-EG')+' ج.م. أريد تحديد النطاق.':'مرحبًا NUMUW - أريد معرفة نقطة البداية المناسبة لمشروعي.';
        wa.href='https://wa.me/201127788810?text='+encodeURIComponent(message);
        emitTool('estimator','start');
      });
      list.appendChild(button);
    });
  }

  function initRoadmap(){
    var f=document.getElementById('roadForm');
    var output=document.getElementById('road');
    if(!f||!output)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var goal=f.elements.goal.value;
      var plans={
        'تقليل العمل اليدوي':['رسم العملية الحالية','تحديد ما يمكن تبسيطه','بناء Automation Sprint','اختبار الحالات والاستثناءات','توثيق وتسليم'],
        'بناء حضور رقمي':['تحديد العرض والـICP','بناء الصفحة/الموقع','SEO + local foundation','تحسين مسار التحويل','قياس الجولة الأولى'],
        'تنظيم المبيعات والمتابعة':['رسم رحلة الـlead','تحديد qualification','Lead capture + CRM','Follow-up ownership','Pipeline review'],
        'تحسين التجارة الإلكترونية':['تدقيق العرض والـUX','تحسين صفحات المنتجات','فحص checkout friction','قياس التحويل والاقتصاديات','Retention experiments']
      };
      var steps=plans[goal]||['تحديد ICP والعرض','Landing + lead capture','Follow-up + qualification','Measurement + optimization'];
      var phases=[
        {label:'Days 1-30',items:steps.slice(0,2)},
        {label:'Days 31-60',items:steps.slice(2,4)},
        {label:'Days 61-90',items:steps.slice(4,5)}
      ];
      output.replaceChildren();
      var ol=document.createElement('ol');
      phases.forEach(function(phase){
        var li=document.createElement('li');
        li.className='step-item';
        li.appendChild(textNode('strong',phase.label));
        phase.items.forEach(function(item,index){
          li.appendChild(document.createElement('br'));
          li.appendChild(document.createTextNode((index+1)+'. '+item));
        });
        ol.appendChild(li);
      });
      output.appendChild(ol);
      var notice=textNode('div','خطة أولية تحتاج baseline حقيقي قبل الالتزام بالتنفيذ.');
      notice.className='notice mt-md';
      output.appendChild(notice);
      emitTool('roadmap','complete');
    });
  }

  function initRoi(){
    var f=document.getElementById('roiForm');
    if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var investment=Math.max(0.01,number(f.elements.invest.value,25000));
      var monthlyBenefit=Math.max(0,number(f.elements.benefit.value,0));
      var months=Math.max(1,number(f.elements.months.value,12));
      var extra=Math.max(0,number(f.elements.extra.value,0));
      var totalBenefit=monthlyBenefit*months;
      var totalInvestment=investment+extra;
      var net=totalBenefit-totalInvestment;
      var roi=(net/totalInvestment)*100;
      document.getElementById('roiReturn').textContent=roi.toFixed(1)+'%';
      document.getElementById('roiBreak').textContent=monthlyBenefit>0?'نقطة التعادل الحسابية: '+(totalInvestment/monthlyBenefit).toFixed(1)+' شهر':'لا توجد منفعة شهرية مدخلة';
      emitTool('roi-calculator','complete');
    });
  }

  function initWebsiteReadiness(){
    var f=document.getElementById('siteForm');
    if(!f)return;
    var checks=['عنوان واضح','Meta description','Responsive mobile','CTA رئيسي','طريقة تواصل سهلة','معلومات شركة موثوقة','صفحات خدمة مخصصة','روابط داخلية','صور محسنة','HTTPS','Canonical','Structured data'];
    f.replaceChildren();
    checks.forEach(function(label,index){
      var row=document.createElement('label');
      var input=document.createElement('input');
      input.type='checkbox';
      input.name='c'+index;
      input.addEventListener('change',function(){updateReadiness()});
      row.appendChild(input);
      row.appendChild(document.createTextNode(' '+label));
      f.appendChild(row);
    });
    function updateReadiness(){
      var done=f.querySelectorAll('input:checked').length;
      var score=Math.round(done/checks.length*100);
      document.getElementById('siteScore').textContent=score+'/100';
      var advice=document.getElementById('siteAdvice');
      advice.replaceChildren();
      var missing=checks.filter(function(_,index){return !f.elements['c'+index].checked}).slice(0,4);
      (missing.length?missing:['الأساسيات المكتملة']).forEach(function(item){advice.appendChild(textNode('li',item))});
      emitTool('website-readiness','complete');
    }
    updateReadiness();
  }

  function initSolutionFinder(){
    var f=document.getElementById('finder');
    var result=document.getElementById('result');
    if(!f||!result)return;
    var map={
      clarity:{title:'ابدأ بـ NUMUW Diagnostic',desc:'المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.',href:'../diagnostic/',label:'ابدأ التشخيص',why:['ترتيب الأولويات أولًا','تقليل خطر بناء الشيء الخطأ','تحديد المنتج بعد فهم baseline']},
      website:{title:'ابدأ بـ Website / Landing',desc:'الاحتياج واضح حول الواجهة ومسار التحويل.',href:'../../landing/website/',label:'استعرض حل المواقع',why:['رسالة واضحة نسبيًا','نقطة التحويل هي الأولوية','يمكن تحديد النطاق قبل التنفيذ']},
      automation:{title:'ابدأ بـ Automation Sprint',desc:'لديك عملية متكررة يمكن رسمها واختبارها وأتمتتها.',href:'../../landing/automation/',label:'استعرض الأتمتة',why:['مشكلة عملية محددة','الأثر مرتبط بتكرار العمل','الأفضل اختبار workflow واحد أولًا']},
      system:{title:'ابدأ بـ Growth System',desc:'تحتاج أكثر من طبقة تعمل معًا تحت استراتيجية واحدة.',href:'../../products/growth-system/',label:'استعرض Growth System',why:['عدة طبقات مترابطة','الحاجة تتجاوز مشروعًا منفردًا','النطاق يحتاج تصميمًا موحدًا']}
    };
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var data=new FormData(f);
      var goal=data.get('goal'),clarity=data.get('clarity'),speed=data.get('speed'),business=data.get('business');
      var pick=map[goal]||map.clarity;
      if(clarity==='low'&&goal!=='clarity')pick=map.clarity;
      if(speed==='ongoing')pick={title:'ابدأ بـ Growth Partner',desc:'أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.',href:'../../products/growth-partner/',label:'استعرض Growth Partner',why:['تحسين مستمر','عدة مجالات قابلة للتحسين','القرار يتكرر مع البيانات']};
      result.replaceChildren();
      result.appendChild(textNode('h2',pick.title));
      result.appendChild(textNode('p',pick.desc+(business==='manufacturing'?' وصفحتك المتخصصة للمصانع':business==='b2b'?' ومسار B2B':business==='realestate'?' ومسار العقارات':'')));
      var why=document.createElement('div');
      why.className='tool-list';
      pick.why.forEach(function(item){var row=textNode('div','✓ '+item);why.appendChild(row)});
      result.appendChild(why);
      var actions=document.createElement('div');
      actions.className='output-actions';
      actions.appendChild(actionLink(pick.href,pick.label,'btn-dark'));
      actions.appendChild(actionLink('../brief-builder/','ابنِ Brief','btn-outline'));
      result.appendChild(actions);
      emitTool('solution-finder','complete');
    });
  }

  function initBriefBuilder(){
    var f=document.getElementById('brief'),output=document.getElementById('output');
    if(!f||!output)return;
    function value(id){return document.getElementById(id).value.trim()}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var industry=value('industry'),goal=value('goal'),problem=value('problem'),success=value('success')||'لم أحدد معيار النجاح بعد',timeline=value('timeline');
      var message='مرحبًا NUMUW 👋\n\nنوع النشاط: '+industry+'\nالهدف: '+goal+'\nالمشكلة الحالية: '+problem+'\nمعيار النجاح: '+success+'\nالتوقيت: '+timeline+'\n\nأريد معرفة أفضل نقطة بداية والنطاق المناسب.';
      output.replaceChildren();
      output.appendChild(textNode('h2','Brief جاهز للمراجعة'));
      var box=textNode('div',message);
      box.className='notice brief-output';
      output.appendChild(box);
      var actions=document.createElement('div');
      actions.className='output-actions';
      var copy=document.createElement('button');
      copy.className='btn btn-outline';
      copy.type='button';
      copy.textContent='نسخ الـBrief';
      copy.addEventListener('click',function(){
        if(navigator.clipboard&&window.isSecureContext){
          navigator.clipboard.writeText(message).then(function(){copy.textContent='تم النسخ ✓';setTimeout(function(){copy.textContent='نسخ الـBrief'},1800)}).catch(function(){copy.textContent='انسخ النص يدويًا'});
        }else{
          copy.textContent='انسخ النص يدويًا';
        }
      });
      actions.appendChild(copy);
      actions.appendChild(actionLink('https://wa.me/201127788810?text='+encodeURIComponent(message),'مراجعة ثم إرسال على WhatsApp','btn-primary'));
      actions.appendChild(actionLink('../solution-finder/','اكتشف الحل أولًا','btn-outline'));
      output.appendChild(actions);
      emitTool('brief-builder','complete');
    });
  }

  initAutomation();
  initDiagnostic();
  initEstimator();
  initRoadmap();
  initRoi();
  initWebsiteReadiness();
  initSolutionFinder();
  initBriefBuilder();
})();
