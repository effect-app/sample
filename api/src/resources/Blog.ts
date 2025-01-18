//// codegen:start {preset: barrel, include: ../Blog/*.ts, export: { as: 'PascalCase' }}
export { CreatePost } from "../Blog/Create.js"
export { FindPost } from "../Blog/Find.js"
export { ListPosts } from "../Blog/List.js"
export { PublishPost } from "../Blog/Publish.js"
//// codegen:end

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Blog" } as const
// codegen:end
