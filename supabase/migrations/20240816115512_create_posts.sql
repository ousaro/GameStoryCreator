
-- Create the composite type for character and area
create type character_area_type as (
    image text,
    name text,
    description text
);

-- Create a table for stories
create table stories (
  id uuid not null primary key,
  updated_at timestamp with time zone default now(),
  thumbnail text,
  ownerId uuid references profiles(id),
  title text not null,
  story text not null,
  characters character_area_type[],
  areas character_area_type[]

);


insert into storage.buckets (id, name)
  values (gen_random_uuid(), 'story_images');
