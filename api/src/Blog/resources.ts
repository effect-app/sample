import { UserViewFromId } from "#api/Accounts/resolvers"
import { S } from "#resources/lib"
import { InvalidStateError, NotFoundError, OptimisticConcurrencyException } from "effect-app/client"
import { OperationId } from "effect-app/Operations"
import { BlogPost, BlogPostId } from "./models.js"

export class BlogPostView extends S.ExtendedClass<BlogPostView, BlogPostView.Encoded>()({
  ...BlogPost.omit("author"),
  author: S.propertySignature(UserViewFromId).pipe(S.fromKey("authorId"))
}) {}

export class CreatePost extends S.Req<CreatePost>()("CreatePost", BlogPost.pick("title", "body"), {
  allowRoles: ["user"],
  success: S.Struct({ id: BlogPostId }),
  failure: S.Union(NotFoundError, InvalidStateError, OptimisticConcurrencyException)
}) {}

export class FindPost extends S.Req<FindPost>()("FindPost", {
  id: BlogPostId
}, { allowAnonymous: true, allowRoles: ["user"], success: S.NullOr(BlogPostView) }) {}

export class GetPosts extends S.Req<GetPosts>()("GetPosts", {}, {
  allowAnonymous: true,
  allowRoles: ["user"],
  success: S.Struct({
    items: S.Array(BlogPostView)
  })
}) {}

export class PublishPost extends S.Req<PublishPost>()("PublishPost", {
  id: BlogPostId
}, { allowRoles: ["user"], success: OperationId, failure: S.Union(NotFoundError) }) {}

// codegen:start {preset: meta, sourcePrefix: src/}
export const meta = { moduleName: "Blog" } as const
// codegen:end

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace BlogPostView {
  export interface Encoded extends S.Struct.Encoded<typeof BlogPostView["fields"]> {}
}
/* eslint-enable */
//
// codegen:end

export * as BlogRsc from "./resources.js"
