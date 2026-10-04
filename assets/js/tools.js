(function(){
  'use strict';

  var nf=new Intl.NumberFormat('en-EG');
  function emit(name,detail){
    var payload=detail||{};
    try{window.dispatchEvent(new CustomEvent('numuw:'+name,{detail:payload}))}catch(e){}
    if(Array.isArray(window.dataLayer)){
      try{window.dataLayer.push(Object.assign({event:'numuw_'+name},payload))}catch(e){}
    }
  }
  function byId(id){return document.getElementById(id)}
  function val(form,name){return Number(form.elements[name]?.value||0)}
  function set(id,text){var el=byId(id);if(el)el.textContent=String(text)}
  function safeUrl(text){try{return encodeURIComponent(text)}catch(e){return ''}}
  function waUrl(text){return 'https://wa.me/201127788810?text='+safeUrl(text)}

  function setupDiagnostic(){
    var f=byId('diagForm');if(!f)return;
    var dims=[
      ['offer','وضوح العرض'],['visibility','الظهور'],['site','الموقع'],['capture','التقاط العملاء'],
      ['follow','المتابعة'],['ops','العمليات'],['automation','الأتمتة'],['data','القياس']
    ];
    dims.forEach(function(d){
      var input=f.elements[d[0]];
      var value=byId(d[0]+'Value');
      if(input&&value){
        var sync=function(){value.textContent=input.value+'/5'};
        input.addEventListener('input',sync);sync();
      }
    });
    f.addEventListener('submit',function(e){
      e.preventDefault();
      emit('tool_start',{tool:'growth-diagnostic'});
      var v=dims.map(function(d){return {key:d[0],name:d[1],v:val(f,d[0])}});
      var score=Math.round(v.reduce(function(a,x){return a+x.v},0)/40*100);
      v.sort(function(a,b){return a.v-b.v});
      set('score',score+'/100');
      var bar=byId('scoreBar');if(bar)bar.style.width=score+'%';
      set('scoreText',score<55?'الأساس يحتاج ترتيب أولويات قبل التوسع.':score<75?'هناك أساس جيد مع فرص واضحة للتحسين.':'الأساس جيد؛ ركز على القياس والتحسين المتدرج.');
      var list=byId('priorities');if(list){
        list.replaceChildren();
        v.slice(0,3).forEach(function(x){
          var li=document.createElement('li');
          li.textContent=x.name+' — '+x.v+'/5';
          list.appendChild(li);
        });
      }
      var msg='مرحبًا NUMUW — نتيجتي في التشخيص الذاتي '+score+'/100. أكبر فرص التحسين: '+v.slice(0,3).map(function(x){return x.name}).join('، ')+'. أريد الخطوة التالية.';
      var a=byId('diagWa');if(a)a.href=waUrl(msg);
      emit('tool_complete',{tool:'growth-diagnostic'});
    });
  }

  function setupAutomation(){
    var f=byId('autoForm');if(!f)return;
    var input=f.elements.potential,value=byId('potentialValue');
    if(input&&value){
      var sync=function(){value.textContent=input.value+'%'};
      input.addEventListener('input',sync);sync();
    }
    f.addEventListener('submit',function(e){
      e.preventDefault();
      emit('tool_start',{tool:'automation-finder'});
      var monthlyHours=val(f,'hours')*val(f,'days')*val(f,'people');
      var timeCost=monthlyHours*val(f,'rate');
      var saving=timeCost*(val(f,'potential')/100);
      var buildCost=val(f,'automationCost');
      var payback=saving>0&&buildCost>0?buildCost/saving:null;
      set('autoHours',monthlyHours.toFixed(1));
      set('autoCost',nf.format(Math.round(timeCost))+' ج.م');
      set('autoSave',nf.format(Math.round(saving))+' ج.م');
      set('autoPayback',payback===null?'أدخل تكلفة الأتمتة لرؤية نقطة التعادل':payback.toFixed(1)+' شهر');
      var note=byId('autoDecision');
      if(note){
        note.textContent=buildCost===0?'أدخل تكلفة تقديرية للأتمتة قبل اتخاذ قرار مالي.':
          saving<=0?'لا يظهر وفر في هذا السيناريو.':
          payback<=6?'السيناريو يستحق مراجعة عملية الأتمتة واختبارها.':
          'راجع التعقيد والصيانة قبل اعتبار الأتمتة مجدية.';
      }
      emit('tool_complete',{tool:'automation-finder'});
    });
  }

  function setupROI(){
    var f=byId('roiForm');if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      emit('tool_start',{tool:'roi-calculator'});
      var inv=val(f,'invest'),benefit=val(f,'benefit'),months=val(f,'months'),extra=val(f,'extra');
      var total=benefit*months,totalCost=inv+extra,net=total-totalCost;
      var roi=totalCost>0?(net/totalCost)*100:null;
      var payback=benefit>0?totalCost/benefit:null;
      set('roiReturn',roi===null?'—':roi.toFixed(1)+'%');
      set('roiTotal',nf.format(Math.round(total))+' ج.م');
      set('roiNet',(net>=0?'+':'')+nf.format(Math.round(net))+' ج.م');
      set('roiBreak',payback===null?'لا توجد منفعة شهرية مدخلة':'نقطة التعادل الحسابية: '+payback.toFixed(1)+' شهر');
      var warning=byId('roiWarning');
      if(warning)warning.textContent=roi!==null&&roi<0?'هذا السيناريو سلبي تحت افتراضات الإدخال الحالية.':'غيّر الافتراضات واختبر حساسية السيناريو قبل استخدامه في قرار مالي.';
      emit('tool_complete',{tool:'roi-calculator'});
    });
  }

  function setupEstimator(){
    var list=byId('estList');if(!list)return;
    var oneTime=[
      ['Landing page',7900],['Corporate website',15000],['Brand foundation',6000],
      ['Automation Sprint',8000],['AI workflow',8000],['SEO / Local foundation',6000]
    ];
    var monthly=[['Growth Partner',6500]];
    var selectedOne=[],selectedMonthly=[];
    var oneOut=byId('estOneTime'),monthOut=byId('estMonthly'),totalOut=byId('estTotal'),wa=byId('estWa');
    function makeButton(item,type){
      var b=document.createElement('button');
      b.type='button';b.className='card estimator-option';b.setAttribute('aria-pressed','false');
      var title=document.createElement('h3');title.textContent=item[0];
      var p=document.createElement('p');p.textContent='من '+nf.format(item[1])+' ج.م'+(type==='monthly'?' / شهر':'');
      var icon=document.createElement('div');icon.className='icon';icon.textContent='＋';
      b.append(icon,title,p);
      b.addEventListener('click',function(){
        var arr=type==='monthly'?selectedMonthly:selectedOne,idx=arr.indexOf(item);
        if(idx>-1){arr.splice(idx,1);b.setAttribute('aria-pressed','false');}
        else{arr.push(item);b.setAttribute('aria-pressed','true');}
        var one=selectedOne.reduce(function(a,x){return a+x[1]},0);
        var mon=selectedMonthly.reduce(function(a,x){return a+x[1]},0);
        set('estOneTime',nf.format(one)+' ج.م');
        set('estMonthly',nf.format(mon)+' ج.م / شهر');
        set('estTotal',nf.format(one)+' ج.م');
        if(wa){
          var parts=[];
          if(selectedOne.length)parts.push('مرة واحدة: '+selectedOne.map(function(x){return x[0]}).join('، '));
          if(selectedMonthly.length)parts.push('شهري: '+selectedMonthly.map(function(x){return x[0]}).join('، '));
          wa.href=parts.length?waUrl('مرحبًا NUMUW — اختياراتي:\n'+parts.join('\n')+'\nأريد تحويلها إلى نطاق مكتوب.'):'https://wa.me/201127788810';
        }
        emit('tool_complete',{tool:'estimator'});
      });
      return b;
    }
    oneTime.forEach(function(x){list.appendChild(makeButton(x,'one-time'))});
    monthly.forEach(function(x){list.appendChild(makeButton(x,'monthly'))});
    set('estOneTime','0 ج.م');set('estMonthly','0 ج.م / شهر');
    if(oneOut)oneOut.setAttribute('aria-live','polite');if(monthOut)monthOut.setAttribute('aria-live','polite');if(totalOut)totalOut.setAttribute('aria-live','polite');
  }

  function setupRoadmap(){
    var f=byId('roadForm'),out=byId('road');if(!f||!out)return;
    var map={
      'زيادة العملاء المحتملين':['تحديد ICP والعرض','Landing + Lead capture','Follow-up + qualification','Measurement + optimization'],
      'تقليل العمل اليدوي':['رسم العملية الحالية','تبسيط نقاط الاختناق','بناء Automation Sprint','اختبار الحالات + التوثيق'],
      'بناء حضور رقمي':['تحديد العرض','بناء الصفحة/الموقع','Search + SEO foundation','قياس وتحسين'],
      'تنظيم المبيعات والمتابعة':['رسم رحلة الـlead','Lead capture + CRM','Follow-up workflow','Pipeline review'],
      'تحسين التجارة الإلكترونية':['تدقيق العرض والـUX','تحسين صفحات المنتجات','قياس التحويل','Retention experiments']
    };
    f.addEventListener('submit',function(e){
      e.preventDefault();emit('tool_start',{tool:'90-day-roadmap'});
      var goal=f.elements.goal.value,steps=map[goal]||map['زيادة العملاء المحتملين'];
      out.replaceChildren();
      var ol=document.createElement('ol');
      steps.forEach(function(step,i){
        var li=document.createElement('li');
        li.style.margin='12px 0';
        var strong=document.createElement('strong');strong.textContent='Days '+(i*30+1)+'-'+((i+1)*30);
        li.append(strong,document.createTextNode(' — '+step));ol.appendChild(li);
      });
      out.appendChild(ol);
      var notice=document.createElement('div');notice.className='notice';notice.style.marginTop='18px';notice.textContent='خطة أولية تحتاج baseline حقيقي قبل الالتزام بالتنفيذ.';out.appendChild(notice);
      emit('tool_complete',{tool:'90-day-roadmap'});
    });
  }

  function setupReadiness(){
    var f=byId('siteForm');if(!f)return;
    var checks=['عنوان واضح','Meta description','Responsive mobile','CTA رئيسي','طريقة تواصل سهلة','معلومات شركة موثوقة','صفحات خدمة مخصصة','روابط داخلية','صور محسنة','HTTPS','Canonical','Structured data'];
    checks.forEach(function(label,i){
      var row=document.createElement('label');row.className='check-row';
      var input=document.createElement('input');input.type='checkbox';input.name='c'+i;input.id='siteCheck'+i;
      var span=document.createElement('span');span.textContent=label;
      row.append(input,span);f.appendChild(row);
    });
    function update(){
      var done=checks.filter(function(_,i){return f.elements['c'+i].checked}).length;
      var score=Math.round(done/checks.length*100);
      set('siteScore',score+'/100');
      var bar=byId('siteBar');if(bar)bar.style.width=score+'%';
      var advice=byId('siteAdvice');if(advice){
        advice.replaceChildren();
        var missing=checks.filter(function(_,i){return !f.elements['c'+i].checked}).slice(0,4);
        (missing.length?missing:['الأساسيات مكتملة']).forEach(function(x){var li=document.createElement('li');li.textContent=x;advice.appendChild(li)});
      }
      emit('tool_complete',{tool:'website-readiness'});
    }
    f.addEventListener('change',update);update();
  }

  function setupSolutionFinder(){
    var f=byId('finder'),r=byId('result');if(!f||!r)return;
    var map={
      clarity:{title:'ابدأ بـ NUMUW Diagnostic',desc:'المشكلة أو الأولويات تحتاج تحققًا قبل شراء التنفيذ.',href:'../../products/diagnostic/',label:'افتح Diagnostic',why:['ترتيب الأولويات أولًا','تقليل خطر بناء الشيء الخطأ','تحديد المنتج بعد فهم baseline']},
      website:{title:'ابدأ بـ Digital Kickoff',desc:'الاحتياج واضح حول الواجهة ومسار التحويل.',href:'../../products/digital-kickoff/',label:'افتح Digital Kickoff',why:['رسالة أوضح','نقطة التحويل هي الأولوية','نطاق يمكن التحكم فيه']},
      automation:{title:'ابدأ بـ Automation Sprint',desc:'لديك عملية متكررة يمكن رسمها واختبارها وأتمتتها.',href:'../../products/automation-sprint/',label:'افتح Automation Sprint',why:['مشكلة عملية محددة','الأثر مرتبط بتكرار العمل','الأفضل اختبار Workflow واحد أولًا']},
      system:{title:'ابدأ بـ Growth System',desc:'تحتاج أكثر من طبقة تعمل معًا تحت استراتيجية واحدة.',href:'../../products/growth-system/',label:'افتح Growth System',why:['عدة طبقات مترابطة','الحاجة تتجاوز مشروعًا منفردًا','النطاق يحتاج تصميمًا موحدًا']}
    };
    f.addEventListener('submit',function(e){
      e.preventDefault();emit('tool_start',{tool:'solution-finder'});
      var d=new FormData(f),goal=d.get('goal'),clarity=d.get('clarity'),speed=d.get('speed'),business=d.get('business');
      var pick=map[goal]||map.clarity;
      if(clarity==='low'&&goal!=='clarity')pick=map.clarity;
      if(speed==='ongoing')pick={title:'ابدأ بـ Growth Partner',desc:'أنت تبحث عن إيقاع تحسين مستمر أكثر من مشروع منفرد.',href:'../../products/growth-partner/',label:'افتح Growth Partner',why:['تحسين مستمر','عدة مجالات قابلة للتحسين','القرار يتكرر مع البيانات']};
      var segment=business==='manufacturing'?'المصانع':business==='b2b'?'B2B':business==='realestate'?'العقارات':'';
      r.replaceChildren();
      var h=document.createElement('h2');h.className='result-title';h.textContent=pick.title;
      var p=document.createElement('p');p.className='lead';p.style.marginTop='10px';p.textContent=pick.desc+(segment?' · المسار الأقرب لقطاع '+segment:'');
      var why=document.createElement('div');why.className='why';
      pick.why.forEach(function(x){var item=document.createElement('div');item.textContent=x;why.appendChild(item)});
      var actions=document.createElement('div');actions.className='actions';
      var primary=document.createElement('a');primary.className='btn btn-dark';primary.href=pick.href;primary.textContent=pick.label;
      var brief=document.createElement('a');brief.className='btn btn-outline';brief.href='../brief-builder/';brief.textContent='ابنِ Brief';
      actions.append(primary,brief);r.append(h,p,why,actions);
      emit('tool_complete',{tool:'solution-finder'});
    });
  }

  function setupBriefBuilder(){
    var f=byId('brief'),o=byId('output');if(!f||!o)return;
    function v(id){return (byId(id)?.value||'').trim()}
    f.addEventListener('submit',function(e){
      e.preventDefault();emit('tool_start',{tool:'brief-builder'});
      var industry=v('industry'),goal=v('goal'),problem=v('problem'),success=v('success')||'لم أحدد معيار النجاح بعد',timeline=v('timeline');
      var msg='مرحبًا NUMUW 👋\n\nنوع النشاط: '+industry+'\nالهدف: '+goal+'\nالمشكلة الحالية: '+problem+'\nمعيار النجاح: '+success+'\nالتوقيت: '+timeline+'\n\nأريد معرفة أفضل نقطة بداية والنطاق المناسب.';
      o.replaceChildren();
      var h=document.createElement('h2');h.textContent='Brief جاهز للمراجعة';
      var pre=document.createElement('div');pre.id='briefText';pre.className='notice';pre.style.whiteSpace='pre-wrap';pre.style.marginTop='16px';pre.textContent=msg;
      var actions=document.createElement('div');actions.className='actions';
      var copy=document.createElement('button');copy.type='button';copy.id='copyBrief';copy.className='btn btn-outline';copy.textContent='نسخ الـBrief';
      copy.addEventListener('click',function(){
        if(navigator.clipboard&&window.isSecureContext){
          navigator.clipboard.writeText(msg).then(function(){copy.textContent='تم نسخ الـBrief ✓';setTimeout(function(){copy.textContent='نسخ الـBrief'},1800)}).catch(function(){copy.textContent='انسخ النص يدويًا'});
        }else copy.textContent='النسخ غير متاح هنا؛ انسخ النص يدويًا';
      });
      var send=document.createElement('a');send.className='btn btn-primary';send.href=waUrl(msg);send.target='_blank';send.rel='noopener noreferrer';send.textContent='مراجعة ثم إرسال على WhatsApp';
      var finder=document.createElement('a');finder.className='btn btn-outline';finder.href='../solution-finder/';finder.textContent='اكتشف الحل أولًا';
      actions.append(copy,send,finder);o.append(h,pre,actions);
      emit('tool_complete',{tool:'brief-builder'});
    });
  }

  setupDiagnostic();
  setupAutomation();
  setupROI();
  setupEstimator();
  setupRoadmap();
  setupReadiness();
  setupSolutionFinder();
  setupBriefBuilder();
})();