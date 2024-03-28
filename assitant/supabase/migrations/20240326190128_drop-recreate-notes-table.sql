drop table "docs"."notes";

-- Create tables
create table "docs"."notes" (
  id bigserial primary key not null,
  content text not null,
  token_count int,
  embedding vector(768),
  checksum text,
  meta jsonb,
  type text,
  source text,
  "version" uuid,
  "last_refresh" timestamptz
);

alter table "docs"."notes" enable row level security;

drop function if exists "docs"."match_notes";

-- Create embedding similarity search functions
create or replace function "docs"."match_notes"(embedding vector(768), match_threshold float, match_count int, min_content_length int)
returns table (id bigint, content text, token_count int, similarity float)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    notes.id,
    notes.content,
    notes.token_count,
    (notes.embedding <=> embedding) as similarity
  from notes

  -- We only care about sections that have a useful amount of content
  where length(notes.content) >= min_content_length

  and (notes.embedding <=> embedding) > match_threshold

  -- ONLY USE dot product for OpenAI
  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  --    inner product (<#>)
  --    cosine distance (<=>)
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by notes.embedding <=> embedding

  limit match_count;
end;
$$;
