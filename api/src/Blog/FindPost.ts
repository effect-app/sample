import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { Effect } from "effect"
import { Option } from "effect-app"
import { BlogPostId } from "./models.js"
import { BlogPostRepo } from "./Repo.js"
import { BlogPostView } from "./views.js"

export class FindPost extends S.Req<FindPost>()("Blog.FindPost", {
  id: BlogPostId
}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.NullOr(BlogPostView)
}) {}

export default handlerFor(FindPost)({
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
