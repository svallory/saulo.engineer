//@index('./*', f => `export { default as ${f.name.replaceAll(/(?:^|-)(\w)/g, (_,m) => m.toUpperCase() )} } from '${f.path}.astro'`)
export { default as TwoCols } from './two-cols.astro'
//@endindex
