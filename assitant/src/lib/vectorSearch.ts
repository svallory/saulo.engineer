import { Context } from 'hono';
import { HonoEnv, SIMILARITY_CUTOFF } from '../types/env';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { DbFnMatchNotesReturn } from '../routes/query';

/**
 * Performs a vector search against the database to find the top matching notes.
 *
 * @param c - The Hono context containing the environment variables.
 * @param embedding - The embedding vector to search with.
 * @returns A promise resolving to the matched notes, or an empty array if none found.
 */
export async function vectorSearch(
  c: Context<HonoEnv>,
  embedding: number[],
): Promise<DbFnMatchNotesReturn> {
  const supabaseClient = createClient<Database, "docs", Database["docs"]>(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_KEY,
    {
      db: { schema: "docs" },
    },
  );

  console.log("------------------ Vector Search ------------------");
  console.log("Embeddings:", JSON.stringify(embedding, null, 2));
  const { error: matchError, data: notes, count } = await supabaseClient.rpc(
    "match_notes",
    {
      embedding: JSON.stringify(embedding),
      match_threshold: 0.3,
      match_count: 10,
      min_content_length: 1,
    },
  );

  if (matchError) {
    throw new Error(`Failed to match page sections: ${matchError}`);
  }

  console.log("Embedding matches found:", count);

  console.log("----------------- / Vector Search ------------------");
  return notes || [];
}
