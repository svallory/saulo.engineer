import { Hono, Context } from "hono"
import { queryHandler } from './routes/query'
import { factsHandler } from './routes/facts'
import { HonoEnv } from './types/env'

const app = new Hono()

app.get('/query', queryHandler)
app.post('/facts', factsHandler)

app.onError((err: any, c: Context) => {
  return c.text(err)
})

import { vectorSearch } from "./lib/vectorSearch"
import { vector } from "./lib/knows-php"

app.get('/', async (c: Context<HonoEnv>) => {
	const result = await vectorSearch(c, vector)
	// const ai = new Ai(c.env.AI)

  // const answer = await ai.run(
  //   '@hf/thebloke/neural-chat-7b-v3-1-awq',
  //   {
  //     messages: [
  //       { role: 'user', content: `What is the square root of 9?` }
  //     ]
  //   }
  // )

  return c.json(result)
})

export default app
