# NUMUW Information Architecture

## Canonical site map

```
Home
├── Solutions
│   ├── Conversion Websites
│   ├── Automation
│   ├── Practical AI
│   ├── Search & Local
│   ├── Brand
│   └── Growth Partner
├── Industries
│   ├── B2B
│   ├── Manufacturing
│   ├── Real Estate
│   └── E-commerce
├── Tools
│   ├── Diagnostic
│   ├── Automation Finder
│   ├── Estimator
│   ├── ROI Scenario
│   ├── Roadmap
│   ├── Website Readiness
│   ├── Solution Finder
│   └── Brief Builder
├── Products
│   ├── Diagnostic
│   ├── Digital Kickoff
│   ├── Automation Sprint
│   ├── Growth System
│   └── Growth Partner
├── Company
│   ├── About
│   ├── Method
│   ├── Proof
│   ├── Case Studies
│   └── Contact
└── Resources
    ├── Business Library
    ├── Playbooks
    ├── Insights
    ├── Resources
    └── Media Kit
```

## Navigation rule

Use one site-wide primary navigation:

**الرئيسية / الحلول / الأدوات / المنتجات / الشركة / المصادر / التواصل**

The page context belongs inside the page through breadcrumbs, hub links and section navigation.

Do not make Products, Tools, Landing Pages or Business Library each feel like a separate mini-site.

## URL compatibility

Existing public URLs are preserved. New hubs are additive unless a migration plan exists.

Existing `/landing/` routes remain acquisition pages for compatibility. Their content should map to the canonical Solutions / Industries model.

## Page-intent rule

Every indexable route must answer one primary question.

Examples:
- Solution page → “هل هذا capability يعالج مشكلتي؟”
- Industry page → “هل تفهم واقعي الصناعي / العقاري / B2B؟”
- Product page → “هل أشتري هذا الآن؟”
- Tool page → “ما القرار الذي أستطيع تحسينه الآن؟”
- Company page → “هل أستطيع الوثوق بهذا الطرف؟”
- Document → “هل أستطيع استخدام هذا في عملية الشراء أو التشغيل؟”

## Hubs

Hubs should compare and route. They should not repeat the same sales copy from every child page.

## Breadcrumbs

Every non-home indexable page should expose a visible breadcrumb:
**الرئيسية → القسم → الصفحة**

The breadcrumb is navigation support, not a substitute for the main navigation.

## Cross-linking

Use deliberate links:
- Solution → relevant product
- Industry → relevant solutions + tools
- Tool → relevant product
- Product → proof + proposal + contact
- Company → proof + method
- Document → related commercial next step

Avoid indiscriminate “related links” blocks.
