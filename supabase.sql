-- Run this ONCE: Supabase dashboard > SQL Editor > New query > paste > Run

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text, title_fa text,
  excerpt_en text, excerpt_fa text,
  body_en text, body_fa text,
  category text,
  tags text[] default '{}',
  cover_url text,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  desc_en text, desc_fa text,
  features_en text[] default '{}', features_fa text[] default '{}',
  tech text[] default '{}',
  image_url text, live_url text, code_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table posts enable row level security;
alter table projects enable row level security;

-- everyone can read published articles and all projects; only the signed-in admin can change anything
create policy "read published posts" on posts for select using (published or auth.role() = 'authenticated');
create policy "admin manages posts" on posts for all to authenticated using (true) with check (true);
create policy "read projects" on projects for select using (true);
create policy "admin manages projects" on projects for all to authenticated using (true) with check (true);

-- image storage bucket
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
create policy "read images" on storage.objects for select using (bucket_id = 'images');
create policy "admin uploads images" on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "admin updates images" on storage.objects for update to authenticated using (bucket_id = 'images');
create policy "admin deletes images" on storage.objects for delete to authenticated using (bucket_id = 'images');

-- your 3 course projects
insert into projects (title, image_url, live_url, tech, sort_order, desc_en, desc_fa, features_en, features_fa) values
('Guesthouse Stay Planner', '/images/guesthouse.webp', 'https://react-hotel-hmgw.vercel.app/', array['React','Tailwind CSS'], 1,
 'A guesthouse website where visitors browse rooms, add them to a stay plan and instantly see the estimated cost of their nights. It also has a page to manage the list of rooms.',
 'سایت یک مهمان‌پذیر که کاربر اتاق‌ها را می‌بیند، به برنامه اقامت اضافه می‌کند و هزینه تقریبی شب‌ها را فوراً می‌بیند. یک صفحه برای مدیریت اتاق‌ها هم دارد.',
 array['Browse the list of rooms','Add rooms to your stay plan','See the estimated cost of your nights instantly','A page to manage the list of rooms'],
 array['دیدن فهرست اتاق‌ها','اضافه‌کردن اتاق‌ها به برنامه اقامت','دیدن فوری هزینه تقریبی شب‌ها','صفحه‌ای برای مدیریت فهرست اتاق‌ها']),
('Little Lemon Reservations', '/images/little-lemon.webp', 'https://react-products-s6hq.vercel.app/', array['React','Tailwind CSS','Form validation'], 2,
 'A restaurant website with a table reservation form: name, date, time, number of guests and occasion, with required-field checks and a clear-form button.',
 'سایت یک رستوران با فرم رزرو میز: نام، تاریخ، ساعت، تعداد مهمان و مناسبت، همراه با بررسی فیلدهای اجباری و دکمه پاک‌کردن فرم.',
 array['Table reservation form','Name, date, time, guests and occasion','Required-field checks','Clear-form button'],
 array['فرم رزرو میز','نام، تاریخ، ساعت، تعداد مهمان و مناسبت','بررسی فیلدهای اجباری','دکمه پاک‌کردن فرم']),
('Prescripto', '/images/prescripto.webp', 'https://react-hospital-pro.vercel.app/', array['React','Tailwind CSS'], 3,
 'A doctor appointment website where users find doctors by speciality, see who is available and start booking an appointment.',
 'سایت نوبت‌گیری پزشک که کاربر پزشکان را بر اساس تخصص پیدا می‌کند، موجود بودن آن‌ها را می‌بیند و نوبت می‌گیرد.',
 array['Find doctors by speciality','See which doctors are available','Start booking an appointment'],
 array['پیدا کردن پزشک بر اساس تخصص','دیدن پزشکان موجود','شروع نوبت‌گیری']);
