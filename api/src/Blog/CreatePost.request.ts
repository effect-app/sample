import { S } from "#resources/lib"
import { InvalidStateError, NotFoundError, OptimisticConcurrencyException } from "effect-app/client"
import { BlogPost, BlogPostId } from "./models.js"

export class CreatePost extends S.Req<CreatePost>()("Blog.Create", BlogPost.pick("title", "body"), {
  allowRoles: ["user"],
  success: S.Struct({ id: BlogPostId }),
  failure: S.Union(NotFoundError, InvalidStateError, OptimisticConcurrencyException)
}) {}
