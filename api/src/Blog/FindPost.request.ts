import { S } from "#resources/lib"
import { BlogPostId } from "./models.js"
import { BlogPostView } from "./views.js"

export class FindPost extends S.Req<FindPost>()("Blog.FindPost", {
  id: BlogPostId
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.NullOr(BlogPostView)
}) {}
