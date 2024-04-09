export async function GET({ params /*, request*/ }) {
  const schema = (await import(`../../../marko-json-schemas/schemas/models/${params['schema'].replace('.json','')}.json`)).default;
  return new Response(JSON.stringify(schema));
}

export function getStaticPaths() {
  return [
    { params: { schema: "attribute.base"} },
    { params: { schema: "attribute"} },
    { params: { schema: "attribute.object"} },
    { params: { schema: "attribute.string"} },
    { params: { schema: "tag.base"} },
    { params: { schema: "tag"} },
    { params: { schema: "tag.nested"} },
    { params: { schema: "attribute.json"} },
    { params: { schema: "attribute.base.json"} },
    { params: { schema: "attribute.object.json"} },
    { params: { schema: "attribute.string.json"} },
    { params: { schema: "tag.json"} },
    { params: { schema: "tag.base.json"} },
    { params: { schema: "tag.nested.json"} }
  ]
}
