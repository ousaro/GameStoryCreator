

drop table stories;
drop type character_area_type;

-- Create a table for stories with JSONB fields for characters and areas
create table stories (
  id uuid not null primary key ,
  updated_at timestamp with time zone default now(),
  thumbnail text,
  ownerId uuid references profiles(id),
  title text not null,
  story text not null,
  characters jsonb,
  areas jsonb
);