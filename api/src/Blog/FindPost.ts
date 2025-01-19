import { handlerFor } from "#api/lib/handler"
import { Effect } from "effect"
import { Option } from "effect-app"
import { FindPost } from "./FindPost.request.js"
import { BlogPostRepo } from "./Repo.js"

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
