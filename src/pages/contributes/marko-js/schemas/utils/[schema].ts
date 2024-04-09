export async function GET({ params /*, request*/ }) {
  const schema = (await import(`../../../../../assets/marko-json-schemas/schemas/utils/${params['schema'].replace('.json','')}.json`)).default;
  return new Response(JSON.stringify(schema));
}

export function getStaticPaths() {
  return [
    { params: { schema: "maps"} },
    { params: { schema: "maps.json"} }
  ]
}