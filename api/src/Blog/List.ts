import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { Effect } from "effect-app"
import { BlogPostView } from "./PostView.js"
import { BlogPostRepo } from "./Repo.js"

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
