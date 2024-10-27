import { UserViewFromId } from "api/Accounts/UserResolver.js"
import { BlogPost } from "Domain/Blog.js"
import { S } from "lib/resources.js"

export class BlogPostView extends S.ExtendedClass<BlogPostView, BlogPostView.From>()({
  ...BlogPost.omit("author"),
  author: S.propertySignature(UserViewFromId).pipe(S.fromKey("authorId"))
}) {}

// codegen:start {preset: model}
//
/* eslint-disable */
export namespace BlogPostView {
  export interface From extends S.Struct.Encoded<typeof BlogPostView["fields"]> {}
}
/* eslint-enable */
//
// codegen:end
