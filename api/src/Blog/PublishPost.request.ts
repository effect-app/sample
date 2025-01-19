import { S } from "#resources/lib"
import { NotFoundError } from "effect-app/client"
import { OperationId } from "effect-app/Operations"
import { BlogPostId } from "./models.js"

export class PublishPost extends S.Req<PublishPost>()("Blog.PublishPost", {
  id: BlogPostId
}, { allowRoles: ["user"], success: OperationId, failure: S.Union(NotFoundError) }) {}
