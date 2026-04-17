# ملخص مشروع نظام إدارة الشحن

## فكرة المشروع

المشروع عبارة عن واجهة أمامية متكاملة لنظام إدارة الشحن واللوجستيات، مبنية باستخدام `Next.js 16` و`TypeScript` و`Redux Toolkit` و`RTK Query` و`React Hook Form` و`Yup` و`Tailwind CSS`، مع تكامل مباشر مع backend مبني بـ`.NET`.

المميز هنا أن المشروع ليس مجرد صفحات CRUD تقليدية، بل نظام تشغيلي كامل يخدم أكثر من نوع مستخدم داخل نفس المنصة:

- `Admin`
- `Employee`
- `Merchant`
- `Delivery`

وكل دور له تجربة استخدام مختلفة، dashboard مختلفة، وصلاحيات ومسارات عمل مناسبة له.

## ماذا أنجزت داخل المشروع

اشتغلت على بناء نظام frontend يعكس فعليًا دورة العمل داخل شركة شحن، بداية من تسجيل الدخول والوصول للنظام، مرورًا بإنشاء الطلبات وإدارة التجار والمندوبين والفروع والمناطق، وحتى التقارير ولوحات المتابعة.

أهم ما تم تنفيذه:

- نظام تسجيل دخول كامل مع `login` و`forgot password` و`OTP verification` و`reset password`.
- حماية الصفحات وإدارة الجلسة عن طريق `cookies` و`JWT decoding` واسترجاع بيانات المستخدم داخل Redux.
- Dashboards مختلفة حسب نوع المستخدم: Admin / Merchant / Delivery.
- Setup Wizard متعدد الخطوات لتهيئة بيانات النظام الأساسية مثل الفروع والمحافظات والمدن والتجار.
- Order Management flow كاملة تشمل:
  - إنشاء الطلب
  - عرض الطلبات
  - التصفية حسب الحالة
  - عرض التفاصيل
  - حذف الطلب
  - تغيير الحالة
  - إسناد الطلب لمندوب
  - معالجة حالات الرفض والتسليم
- Views مخصصة للتاجر والمندوب بناءً على المستخدم الحالي.
- صفحة تقارير مع filters بالبحث والحالة والتاريخ.
- صفحات إعدادات تشمل shipping types وpricing وroles وpermissions وgeneral settings.
- إدارة الملف الشخصي ورفع صورة البروفايل.
- دعم Dark / Light mode وتحسين الشكل العام للـdashboard.

## النقاط التقنية القوية في المشروع

المشروع يوضح شغل قوي في الـfrontend architecture وليس فقط في الـUI:

- استخدام `App Router` في Next.js مع تنظيم feature-based واضح.
- الاعتماد على `Redux Toolkit` لإدارة الحالة العامة و`RTK Query` لإدارة استدعاءات الـAPI والـcache والـmutations.
- بناء `API slice` موحد يغطي auth وorders وmerchants وdeliveries وbranches وreports وprofile وsettings وroles وpermissions.
- ربط الـfrontend مع backend حقيقي مع مراعاة اختلافات شكل الـresponses والتعامل معها بشكل دفاعي.
- بناء forms متقدمة باستخدام `React Hook Form + Yup` تتضمن:
  - cascading selects
  - nested product lists
  - multi-select branches
  - dynamic payload construction
  - validation حقيقية على مستوى الـbusiness rules
- تنفيذ setup wizard بذكاء في الانتقال بين الخطوات حسب dependencies الفعلية بين البيانات.
- بناء dashboards تحليلية باستخدام `Recharts` لعرض اتجاه الطلبات والإيرادات وتوزيع المدن وأداء التجار وتغطية المندوبين.
- إنشاء reusable components كثيرة لتحسين قابلية التوسع مثل:
  - stat cards
  - loaders
  - empty states
  - pagination
  - dialogs
  - sidebar
  - theme toggle

## أهم Features تبرز قوة الشغل

- Multi-role architecture داخل نفس المنتج.
- Order lifecycle حقيقية وليست مجرد عرض بيانات.
- Setup workflow مرتبط فعليًا بمنطق التشغيل.
- Dynamic forms بمدخلات مترابطة ومعقدة.
- Analytics dashboards مبنية على بيانات live من الـAPI.
- Role-based navigation وتجارب مختلفة حسب نوع المستخدم.
- هيكلة مشروع قابلة للتوسع مع فصل واضح بين hooks وcomponents وschemas وtypes.

## لماذا المشروع يبان قوي أمام Senior أو Hiring Manager

الذي يميز هذا المشروع أنه لا يعكس فقط القدرة على بناء واجهات، بل يعكس فهمًا للمنتج والـbusiness flow:

- تم التعامل مع أكثر من persona داخل نفس النظام.
- تم بناء flows تشغيلية حقيقية مثل إسناد الطلبات وتغيير حالتها وتتبع ما يراه كل مستخدم.
- تم تنظيم الكود بشكل scalable بدلًا من تجميع كل شيء داخل الصفحات.
- تم استخدام typing وvalidation وstate management بشكل منظم.
- تم الجمع بين الـUX والـlogic والـintegration في نفس الوقت.

## نسخة جاهزة للنشر على LinkedIn

أنهيت مؤخرًا العمل على مشروع `Shipping Management System` كواجهة أمامية متكاملة باستخدام `Next.js 16`, `TypeScript`, `Redux Toolkit`, `RTK Query`, `React Hook Form`, `Yup`, و`Tailwind CSS`، مع تكامل مباشر مع backend مبني بـ`.NET`.

المشروع لم يكن مجرد CRUD dashboard، بل نظام تشغيلي فعلي لإدارة عمليات الشحن يخدم أكثر من دور داخل نفس المنصة مثل `Admin`, `Employee`, `Merchant`, و`Delivery`، مع اختلاف الصلاحيات والـdashboards والـworkflows لكل دور.

من أبرز الأجزاء التي عملت عليها:

- Authentication flow كاملة تشمل login وforgot password وOTP verification وreset password
- Route protection وsession restoration
- Role-based dashboards وتجارب استخدام مختلفة حسب نوع المستخدم
- Order management flow كاملة تشمل الإنشاء والتصفية والإسناد للمندوب وتحديث الحالة والرفض وعرض التفاصيل
- Setup wizard لإعداد الفروع والمحافظات والمدن والتجار
- Reports وanalytics مرتبطة ببيانات حقيقية من الـAPI
- Dynamic forms مع validation وcascading dropdowns وnested data handling
- Reusable UI architecture تسهّل التوسع والصيانة

أكثر شيء أفتخر به في المشروع هو أنه جعلني أتعامل مع frontend بمنظور product + system design، وليس فقط منظور تنفيذ واجهات. كان عليّ التفكير في الـarchitecture والـroles والـstate management والـAPI integration والـusability في نفس الوقت.

وأنا حاليًا أبحث عن فرصة Frontend Developer أقدر أساهم فيها ببناء منتجات حقيقية scalable ومبنية بعقلية هندسية قوية.

## نقاط مختصرة تنفع للسيرة الذاتية أو البورتفوليو

- طورت نظام إدارة شحن متكامل متعدد الأدوار باستخدام `Next.js` و`TypeScript` و`Redux Toolkit`.
- نفذت دورة حياة الطلب بالكامل من الإنشاء وحتى الإسناد وتغيير الحالة والتقارير.
- بنيت dashboards مختلفة حسب نوع المستخدم مع analytics وvisualization للبيانات.
- أنشأت setup wizard لإعداد البيانات الأساسية للنظام بشكل مترابط.
- بنيت forms ديناميكية مع validation متقدم وpayloads معقدة.
- نفذت تكاملًا مباشرًا مع backend API مع إدارة للحالة والـcache والتعامل مع الـedge cases.
