// Fallback content. It is shown when Supabase (the CMS) is not connected yet.
export const info = {
  email: 'matintavakoli786@gmail.com',
  phone: '0792902903',
  github: 'https://github.com/AbdulMatin2007',
}

export const seedProjects = [
  {
    id: 'p1', sort_order: 1, title: 'Guesthouse Stay Planner',
    image_url: '/images/guesthouse.webp', live_url: 'https://react-hotel-hmgw.vercel.app/', code_url: '',
    tech: ['React', 'Tailwind CSS'],
    desc_en: 'A guesthouse website where visitors browse rooms, add them to a stay plan and instantly see the estimated cost of their nights. It also has a page to manage the list of rooms.',
    desc_fa: 'سایت یک مهمان‌پذیر که کاربر اتاق‌ها را می‌بیند، به برنامه اقامت اضافه می‌کند و هزینه تقریبی شب‌ها را فوراً می‌بیند. یک صفحه برای مدیریت اتاق‌ها هم دارد.',
    features_en: ['Browse the list of rooms', 'Add rooms to your stay plan', 'See the estimated cost of your nights instantly', 'A page to manage the list of rooms'],
    features_fa: ['دیدن فهرست اتاق‌ها', 'اضافه‌کردن اتاق‌ها به برنامه اقامت', 'دیدن فوری هزینه تقریبی شب‌ها', 'صفحه‌ای برای مدیریت فهرست اتاق‌ها'],
  },
  {
    id: 'p2', sort_order: 2, title: 'Little Lemon Reservations',
    image_url: '/images/little-lemon.webp', live_url: 'https://react-products-s6hq.vercel.app/', code_url: '',
    tech: ['React', 'Tailwind CSS', 'Form validation'],
    desc_en: 'A restaurant website with a table reservation form: name, date, time, number of guests and occasion, with required-field checks and a clear-form button.',
    desc_fa: 'سایت یک رستوران با فرم رزرو میز: نام، تاریخ، ساعت، تعداد مهمان و مناسبت، همراه با بررسی فیلدهای اجباری و دکمه پاک‌کردن فرم.',
    features_en: ['Table reservation form', 'Name, date, time, guests and occasion', 'Required-field checks', 'Clear-form button'],
    features_fa: ['فرم رزرو میز', 'نام، تاریخ، ساعت، تعداد مهمان و مناسبت', 'بررسی فیلدهای اجباری', 'دکمه پاک‌کردن فرم'],
  },
  {
    id: 'p3', sort_order: 3, title: 'Prescripto',
    image_url: '/images/prescripto.webp', live_url: 'https://react-hospital-pro.vercel.app/', code_url: '',
    tech: ['React', 'Tailwind CSS'],
    desc_en: 'A doctor appointment website where users find doctors by speciality, see who is available and start booking an appointment.',
    desc_fa: 'سایت نوبت‌گیری پزشک که کاربر پزشکان را بر اساس تخصص پیدا می‌کند، موجود بودن آن‌ها را می‌بیند و نوبت می‌گیرد.',
    features_en: ['Find doctors by speciality', 'See which doctors are available', 'Start booking an appointment'],
    features_fa: ['پیدا کردن پزشک بر اساس تخصص', 'دیدن پزشکان موجود', 'شروع نوبت‌گیری'],
  },
]

export const seedPosts = [
  {
    id: 's1', slug: 'my-first-steps-in-web-development', category: 'Career', tags: ['career', 'learning', 'react'],
    created_at: '2026-10-21T10:00:00Z', published: true, cover_url: '',
    title_en: 'My first steps in web development',
    title_fa: 'اولین قدم‌های من در توسعه وب',
    excerpt_en: 'How I started with Java in 2025 and moved to HTML, CSS, JavaScript and React.',
    excerpt_fa: 'چطور در ۲۰۲۵ با جاوا شروع کردم و به HTML، CSS، جاوااسکریپت و React رسیدم.',
    body_en: 'I started coding in 2025 with Java. After that I moved to web development and joined a four-month course.\n\n## What I learned\n\n- HTML and CSS for structure and style\n- JavaScript for behaviour\n- React for building interfaces\n- Git for managing my code\n\nAt the end of the course I built three projects and put them online. My goal is simple: keep improving every day.',
    body_fa: 'برنامه‌نویسی را از سال ۲۰۲۵ با جاوا شروع کردم. بعد به توسعه وب رسیدم و در یک دوره چهارماهه ثبت‌نام کردم.\n\n## چه چیزهایی یاد گرفتم\n\n- HTML و CSS برای ساختار و ظاهر\n- جاوااسکریپت برای رفتار صفحه\n- React برای ساخت رابط کاربری\n- Git برای مدیریت کد\n\nدر پایان دوره سه پروژه ساختم و آنلاین کردم. هدفم ساده است: هر روز بهتر شوم.',
  },
]

// level: 1 = Learning, 2 = Comfortable, 3 = Confident  (change these to match your real level)
export const skillGroups = [
  { key: 'frontend', items: [
    { n: 'HTML', l: 3, d: { en: 'Semantic structure and forms.', fa: 'ساختار معنادار صفحه و فرم‌ها.' } },
    { n: 'CSS', l: 2, d: { en: 'Flexbox, Grid and responsive layouts.', fa: 'Flexbox، Grid و طراحی واکنش‌گرا.' } },
    { n: 'JavaScript', l: 2, d: { en: 'ES6+, arrays and the DOM.', fa: 'ES6 به بعد، آرایه‌ها و DOM.' } },
    { n: 'React', l: 2, d: { en: 'Components, props, state and hooks.', fa: 'کامپوننت، props، state و هوک‌ها.' } },
  ] },
  { key: 'tools', items: [
    { n: 'Tailwind CSS', l: 2, d: { en: 'Utility-first styling for fast layouts.', fa: 'استایل‌دهی سریع با کلاس‌های ابزاری.' } },
    { n: 'Git & GitHub', l: 2, d: { en: 'Version control and sharing code.', fa: 'کنترل نسخه و اشتراک کد.' } },
    { n: 'Vercel', l: 2, d: { en: 'Putting projects online.', fa: 'آنلاین کردن پروژه‌ها.' } },
  ] },
  { key: 'prog', items: [
    { n: 'Java', l: 1, d: { en: 'Where I started coding in 2025.', fa: 'جایی که در ۲۰۲۵ برنامه‌نویسی را شروع کردم.' } },
  ] },
]
export const otherSkills = [
  { en: 'Hardware & software', fa: 'سخت‌افزار و نرم‌افزار' },
  { en: 'Wi-Fi & ISP networking', fa: 'شبکه Wi-Fi و ISP' },
  { en: 'Mathematics', fa: 'ریاضی' },
]
export const spokenLangs = [{ en: 'English', fa: 'انگلیسی' }, { en: 'Dari', fa: 'دری' }]
