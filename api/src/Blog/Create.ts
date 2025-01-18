import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { S } from "#api/resources/lib"
import { BlogPostRepo, Events, UserRepo } from "#api/services"
import { BlogPost, BlogPostId } from "#models/Blog"
import { Effect } from "effect-app"
import { InvalidStateError, NotFoundError, OptimisticConcurrencyException } from "effect-app/client"

export class Request extends S.Req<Request>()("Blog.CreatePost", BlogPost.pick("title", "body"), {
  allowRoles: ["user"],
  success: S.Struct({ id: BlogPostId }),
  failure: S.Union(NotFoundError, InvalidStateError, OptimisticConcurrencyException)
}) {}

export default handlerFor(Request)({
  dependencies: [
    BlogPostRepo.Default,
    UserRepo.Default,
    OperationsDefault,
    Events.Default
  ],
  effect: Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo
    const userRepo = yield* UserRepo

    return (req) =>
      userRepo
        .getCurrentUser
        .pipe(
          Effect.andThen((author) => (new BlogPost({ ...req, author }, true))),
          Effect.tap(blogPostRepo.save)
        )
  })
})
