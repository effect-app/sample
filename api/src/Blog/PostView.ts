import { BlogPost } from "api/Domain/Blog.js"
import { S } from "api/lib.js"
import { UserViewFromId } from "api/Users/UserResolver.js"

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
