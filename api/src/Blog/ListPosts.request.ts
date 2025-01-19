import { S } from "#resources/lib"
import { BlogPostView } from "./views.js"

export class ListPosts extends S.Req<ListPosts>()("Blog.List", {}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    items: S.Array(BlogPostView)
  })
}) {}
