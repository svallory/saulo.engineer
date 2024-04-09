export async function GET({ params /*, request*/ }) {
  const schema = (await import(`../../../../assets/marko-json-schemas/schemas/${params['schema'].replace('.json','')}.json`)).default;
  return new Response(JSON.stringify(schema));
}

export function getStaticPaths() {
  return [
    { params: { schema: "marko-tag"} },
    { params: { schema: "marko"} },
    { params: { schema: "marko-tag.json"} },
    { params: { schema: "marko.json"} }
  ]
}