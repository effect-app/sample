import { UserRepo } from "#Accounts/UserRepo"
import { handlerFor } from "#api/lib/handler"
import { OperationsDefault } from "#api/lib/layers"
import { Events } from "#api/services"
import { S } from "#resources/lib"
import { Effect } from "effect-app"
import { InvalidStateError, NotFoundError, OptimisticConcurrencyException } from "effect-app/client"
import { BlogPost, BlogPostId } from "./models.js"
import { BlogPostRepo } from "./Repo.js"

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
