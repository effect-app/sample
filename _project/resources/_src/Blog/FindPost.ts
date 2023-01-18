import { BlogPost, BlogPostId } from "@effect-app-boilerplate/models/Blog"

@allowAnonymous
@allowRoles("user")
export class FindPostRequest extends Get("/blog/posts/:id")<FindPostRequest>()({
  id: BlogPostId
}) {}

export const FindPostResponse = nullable(BlogPost)
