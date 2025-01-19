//// codegen:start {preset: barrel, include: ../Blog/*.ts, export: { as: 'PascalCase' }}
export { CreatePost } from "../Blog/CreatePost.js"
export { FindPost } from "../Blog/FindPost.js"
export { ListPosts } from "../Blog/ListPosts.js"
export { PublishPost } from "../Blog/PublishPost.js"
//// codegen:end

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Blog" } as const
// codegen:end
