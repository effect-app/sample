import { BlogPostId } from "@effect-app-boilerplate/models/Blog"
import { OperationId } from "../Views.js"

@allowAnonymous
@allowRoles("user")
export class PublishPostRequest extends Post("/blog/posts/:id/publish")<PublishPostRequest>()({
  id: BlogPostId
}) {}

export const PublishPostResponse = OperationId
