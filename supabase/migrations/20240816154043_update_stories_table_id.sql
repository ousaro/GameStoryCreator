

drop table stories;


-- Create a table for stories with JSONB fields for characters and areas
create table stories (
  id uuid primary key DEFAULT gen_random_uuid(),
  updated_at timestamp with time zone default now(),
  thumbnail text,
  ownerId uuid references profiles(id),
  title text not null,
  story text not null,
  characters jsonb,
  areas jsonb
);