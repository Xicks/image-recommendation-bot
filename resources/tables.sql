create table if not exists public.terms(id SERIAL primary key, term text unique not null);
create table if not exists public.terms_images(id serial, image_url text not null, term_id INT, foreign key (term_id) references public.terms(id) on delete cascade);
