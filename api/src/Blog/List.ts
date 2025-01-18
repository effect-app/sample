import { handlerFor } from "#api/lib/handler"
import { S } from "#api/resources/lib"
import { BlogPostView } from "#api/resources/views"
import { BlogPostRepo } from "#api/services"
import { Effect } from "effect-app"

export class Request extends S.Req<Request>()("Blog.List", {}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    items: S.Array(BlogPostView)
  })
}) {}

export default handlerFor(Request)({
  dependencies: [
    BlogPostRepo.Default
  ],
  effect: Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo

    return blogPostRepo
      .all
      .pipe(Effect.andThen((items) => ({ items })))
  })
})
