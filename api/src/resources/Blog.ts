//// codegen:start {preset: barrel, include: ../Blog/*.ts, export: { as: 'PascalCase' }}
export { CreatePost } from "../Blog/CreatePost.resource.js"
export { FindPost } from "../Blog/FindPost.resource.js"
export { ListPosts } from "../Blog/ListPosts.resource.js"
export { PublishPost } from "../Blog/PublishPost.resource.js"
//// codegen:end

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Blog" } as const
// codegen:end
