import { either } from "@effect-app/prelude/schema"
import * as BlogRsc from "../Blog.js"
import { QueryErrors } from "../errors.js"
import { makeInput } from "./utils.js"

@useClassFeaturesForSchema
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

  FindBlogPost: makeInput(BlogRsc.FindPost.FindPostRequest).optional,
  GetAllBlogPosts: makeInput(BlogRsc.GetPosts.GetPostsRequest).optional
}) {}

@useClassFeaturesForSchema
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

  FindBlogPost: either(QueryErrors, BlogRsc.FindPost.FindPostResponse).optional
}) {}
