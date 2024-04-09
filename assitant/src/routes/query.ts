import { Ai } from '@cloudflare/ai'
import { Context } from 'hono';
import { AI_MODEL, EMBEDDINGS_MODEL, HonoEnv } from '../types/env';
import { stream } from 'hono/streaming';
import { Database, Json } from '../types/database';
import { RoleScopedChatInput } from '@cloudflare/ai/dist/ai/tasks/text-generation';
import { agentInstructions, formatContext, formatUserQuestion, tasks } from '../lib/messages';
import { stripIndents } from 'common-tags';
import { vectorSearch } from '../lib/vectorSearch';

export type DbFnMatchNotesReturn = Database['docs']['Functions']['match_notes']['Returns']

export async function queryHandler(c: Context<HonoEnv>) {
  const ai = new Ai(c.env.AI);

	const question = c.req.query('text')
	const q = c.req.json();

	const messages = [] as RoleScopedChatInput[];

	if (!question) {
		messages.push(
			{ role: 'system', content: agentInstructions },
			{ role: 'system', content: tasks.sayHi }
		)
	}
	else {
		const embeddings = await ai.run(EMBEDDINGS_MODEL, { text: question })
		const vectors = embeddings.data[0]

		const notes = await vectorSearch(c, vectors);

		messages.push(
			{ role: 'system', content: agentInstructions },
			{ role: 'system', content: formatContext(notes) },
			{ role: 'system', content: notes.length
				? tasks.answerWithContext
				: tasks.answerWithoutContext
			}
		);

		messages.push({ role: 'system', content: formatUserQuestion(question) })
	}

	console.log(stripIndents`
	---------------------- PROMPT ----------------------
	${messages.map(m => `
	[role]: ${m.role}
	[message]
	${m.content}
	[/message]
	`).join()}
	---------------------  /PROMPT ---------------------
	`)

	const modelResponse = await ai.run(AI_MODEL, {
		stream: true,
		messages,
	});

	if ("response" in modelResponse) {
		return c.text(modelResponse.response || "");
	}

	return stream(c, async (stream) => {
    // Write a process to be executed when aborted.
    stream.onAbort(() => {
      console.log('Aborted!')
    })
    // Write a Uint8Array.
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]))
    // Pipe a readable stream.
    await stream.pipe(modelResponse as ReadableStream<any>)
  })
}
