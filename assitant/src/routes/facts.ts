import { Ai } from '@cloudflare/ai'
import { Context } from "hono";
import { EMBEDDINGS_MODEL, HonoEnv } from '../types/env';
import { createClient } from '@supabase/supabase-js';
import { type Database } from '../types/database';

/**
 * Receive a JSON with a text in the "content" property
 * @param c
 * @returns
 */
export async function factsHandler(c: Context<HonoEnv>) {
  const ai = new Ai(c.env.AI)
	const supabase = createClient<Database>(c.env.SUPABASE_URL, c.env.SUPABASE_KEY, {
		db: {
			schema: 'docs'
		}
	});

	const { content } = await c.req.json()

  if (!content) {
			return c.text("Missing required body parameter 'content'", 400);
  }

  const { data: vectors } = await ai.run(EMBEDDINGS_MODEL, { text: [content] })
	console.log('vectors', vectors)
  const values = vectors[0]

  if (!values) {
			return c.text("Failed to generate vector embedding", 500);
	}

	const note = {
		content,
		embedding: values,
	};

	const { data, error } = await supabase.from('notes')
		.insert(
			note
		)
		.select()

	if (error) {
		return c.json({
			error,
			operation: 'insert',
			data: [note]
		})
	}

	return c.json({
		status: 'success',
		operation: 'insert',
		data
	})
}
