create table favorites (
  id uuid primary key DEFAULT gen_random_uuid(),
  updated_at timestamp with time zone default now(),
  ownerId uuid references profiles(id),
  storyId uuid references stories(id)
);