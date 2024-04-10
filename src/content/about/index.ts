//@index('./*', f => `export { default as ${f.name.replaceAll(/(?:^|-)(\w)/g, (_,m) => m.toUpperCase() )} } from '${f.path}.md'`)
export { default as Hobbies } from './hobbies.md'
export { default as Introduction } from './introduction.md'
export { default as OpenSourceContributions } from './open-source-contributions.md'
export { default as Personality } from './personality.md'
export { default as SocialContributions } from './social-contributions.md'
export { default as Stats } from './stats.md'
//@endindex
