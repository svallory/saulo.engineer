export async function GET({ params /*, request*/ }) {
  const schema = (await import(`../../../marko-json-schemas/schemas/property-groups/${params['schema'].replace('.json','')}.json`)).default;
  return new Response(JSON.stringify(schema));
}

export function getStaticPaths() {
  return [
    { params: { schema: "compiler-hooks"} },
    { params: { schema: "file-mappings"} },
    { params: { schema: "parse-options"} },
    { params: { schema: "shared"} },
    { params: { schema: "shorthands"} },
    { params: { schema: "compiler-hooks.json"} },
    { params: { schema: "file-mappings.json"} },
    { params: { schema: "parse-options.json"} },
    { params: { schema: "shared.json"} },
    { params: { schema: "shorthands.json"} }
  ]
}

