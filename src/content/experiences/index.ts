//@index('./*', f => `export { default as ${f.name.replaceAll(/(?:^|-|\s)(\w)/g, (_,m) => m.toUpperCase() )} } from '${f.path}.md'`)
export { default as Camiseteria } from './camiseteria.md'
export { default as Cleanify } from './cleanify.md'
export { default as Crossover } from './crossover.md'
export { default as Cva } from './cva.md'
export { default as Doare } from './doare.md'
export { default as Dreamflare } from './dreamflare.md'
export { default as RocketMoney } from './rocket-money.md'
export { default as Softo } from './softo.md'
export { default as TokiLabs } from './toki-labs.astro'
//@endindex
