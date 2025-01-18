import { handlerFor } from "#api/lib/handler"
import { S } from "#api/resources/lib"
import { BlogPostView } from "#api/resources/views"
import { BlogPostRepo } from "#api/services"
import { BlogPostId } from "#models/Blog"
import { Effect } from "effect"
import { Option } from "effect-app"

export class Request extends S.Req<Request>()("Blog.FindPost", {
  id: BlogPostId
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.NullOr(BlogPostView)
}) {}

export default handlerFor(Request)({
  dependencies: [
    BlogPostRepo.Default
  ],
  effect: Effect.gen(function*() {
    const blogPostRepo = yield* BlogPostRepo

    return (req) =>
      blogPostRepo
        .find(req.id)
        .pipe(Effect.andThen(Option.getOrNull))
  })
})
