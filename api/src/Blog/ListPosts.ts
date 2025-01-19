import { handlerFor } from "#api/lib/handler"
import { Effect } from "effect-app"
import { ListPosts } from "./ListPosts.request.js"
import { BlogPostRepo } from "./Repo.js"

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
