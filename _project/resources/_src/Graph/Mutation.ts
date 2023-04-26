import { BlogPost } from "@effect-app-boilerplate/models/Blog"
import { either } from "@effect-app/prelude/schema"
import { CreatePost } from "../Blog.js"
import { MutationErrors } from "../errors.js"
import { GraphQueryRequest, GraphQueryResponse } from "./Query.js"
import { makeMutationInput } from "./utils.js"

const makeMutationInput_ = makeMutationInput(GraphQueryRequest.Api.props)

// TODO: Add The follow-up Graph Query
// - parse inputs, when string and starts with $, take from mutation output.
@useClassFeaturesForSchema
@allowAnonymous
@allowRoles("user")
export class GraphMutationRequest extends Post("/graph/mutate")<GraphMutationRequest>()(
  {
    CreatePost: makeMutationInput_(CreatePost.CreatePostRequest)
      .optional
    // UpdatePurchaseOrder: optProp(
    //   makeMutationInput_(PurchaseOrders.Update.UpdatePurchaseOrderRequest)
    // )
  }
) {}

const PostResult = props({
  ...GraphQueryResponse.Api.props,
  result: BlogPost.optional
})

@useClassFeaturesForSchema
export class GraphMutationResponse extends Model<GraphMutationResponse>()({
  // TODO: Support guaranteed optional sub-queries, like on Create/Update of PO
  // guarantee an optional return of PurchaseOrder
  // first must enable PO cache for guarantee.
  CreatePost: either(
    MutationErrors,
    props({
      response: CreatePost.CreatePostResponse,
      query: PostResult.optional
    })
  )
    .optional
  // UpdatePurchaseOrder: optProp(
  //   either(
  //     MutationErrors,
  //     props({
  //       response: Void.optional,
  //       query: POResult.optional
  //     })
  //   )
  // )
}) {}
