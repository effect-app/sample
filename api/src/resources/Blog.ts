//// codegen:start {preset: barrel, include: ../Blog/*.ts, export: { as: 'PascalCase' }}
export { CreatePost } from "../Blog/CreatePost.request.js"
export { FindPost } from "../Blog/FindPost.request.js"
export { ListPosts } from "../Blog/ListPosts.request.js"
export { PublishPost } from "../Blog/PublishPost.request.js"
//// codegen:end

// codegen:start {preset: meta, sourcePrefix: src/resources/}
export const meta = { moduleName: "Blog" } as const
// codegen:end
