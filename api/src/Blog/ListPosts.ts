import { handlerFor } from "#api/lib/handler"
import { S } from "#resources/lib"
import { Effect } from "effect-app"
import { BlogPostRepo } from "./Repo.js"
import { BlogPostView } from "./views.js"

export class ListPosts extends S.Req<ListPosts>()("Blog.List", {}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    items: S.Array(BlogPostView)
  })
}) {}

export default handlerFor(ListPosts)({
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
