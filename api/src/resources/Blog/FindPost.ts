import { BlogPostId } from "models/Blog.js"
import { S } from "resources/lib.js"
import { BlogPostView } from "../Views.js"

export class FindPostRequest extends S.Req({ allowAnonymous: true, allowRoles: ["user"] })<FindPostRequest>()({
  id: BlogPostId
}) {}

export const FindPostResponse = S.NullOr(BlogPostView)
