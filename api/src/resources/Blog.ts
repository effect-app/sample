//// codegen:start {preset: barrel, include: ../Blog/*.ts, export: { as: 'PascalCase' }}
export { Request as Create } from "../Blog/Create.js"
export { Request as Find } from "../Blog/Find.js"
export { Request as List } from "../Blog/List.js"
export { Request as Publish } from "../Blog/Publish.js"
//// codegen:end

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Blog" } as const
// codegen:end
