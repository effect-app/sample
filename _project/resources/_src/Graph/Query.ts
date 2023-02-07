import { either } from "@effect-app/prelude/schema"
import { QueryErrors } from "../errors.js"
import { BlogRsc } from "../index.js"
import { makeInput } from "./utils.js"

@useClassNameForSchema
@allowAnonymous
@allowRoles("user")
export class GraphQueryRequest extends Post("/graph/query")<GraphQueryRequest>()({
  // AllMe: optProp(makeInput(Me.All.GetMeRequest, true)),
  // AllMeEventlog: optProp(makeInput(Me.Eventlog.AllMeEventlogRequest, true)),
  // AllMeChangeRequests: optProp(
  //   makeInput(Me.ChangeRequests.AllMeChangeRequestsRequest, true)
  // ),
  // AllMeCommentActivity: optProp(
  //   makeInput(Me.CommentActivity.AllMeCommentActivityRequest, true)
  // ),
  // AllMeTasks: optProp(makeInput(Me.Tasks.AllMeTasksRequest, true)),

  FindBlogPost: optProp(makeInput(BlogRsc.FindPost.FindPostRequest)),
  GetAllBlogPosts: optProp(makeInput(BlogRsc.GetPosts.GetPostsRequest))
}) {}

@useClassNameForSchema
export class GraphQueryResponse extends Model<GraphQueryResponse>()({
  // AllMe: optProp(either(QueryErrors, Me.All.GetMeResponse)),
  // AllMeEventlog: optProp(either(QueryErrors, Me.Eventlog.AllMeEventlogResponse)),
  // AllMeChangeRequests: optProp(
  //   either(QueryErrors, Me.ChangeRequests.AllMeChangeRequestsResponse)
  // ),
  // AllMeCommentActivity: optProp(
  //   either(QueryErrors, Me.CommentActivity.AllMeCommentActivityResponse)
  // ),
  // AllMeTasks: optProp(either(QueryErrors, Me.Tasks.AllMeTasksResponse)),

  FindBlogPost: optProp(
    either(QueryErrors, BlogRsc.FindPost.FindPostResponse)
  )
}) {}
