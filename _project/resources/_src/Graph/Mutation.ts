import { BlogPost } from "@effect-app-boilerplate/models/Blog"
import { either } from "@effect-app/prelude/schema"
import { CreatePost } from "../Blog.js"
import { MutationErrors } from "../errors.js"
import { GraphQueryRequest, GraphQueryResponse } from "./Query.js"
import { makeMutationInput } from "./utils.js"

const makeMutationInput_ = makeMutationInput(GraphQueryRequest.Api.props)

// TODO: Add The follow-up Graph Query
// - parse inputs, when string and starts with $, take from mutation output.
@useClassNameForSchema
@allowAnonymous
@allowRoles("user")
export class GraphMutationRequest extends Post("/graph/mutate")<GraphMutationRequest>()(
  {
    CreatePost: optProp(
      makeMutationInput_(CreatePost.CreatePostRequest)
    )
    // UpdatePurchaseOrder: optProp(
    //   makeMutationInput_(PurchaseOrders.Update.UpdatePurchaseOrderRequest)
    // )
  }
) {}

const PostResult = props({
  ...GraphQueryResponse.Api.props,
  result: optProp(BlogPost)
})

@useClassNameForSchema
export class GraphMutationResponse extends Model<GraphMutationResponse>()({
  // TODO: Support guaranteed optional sub-queries, like on Create/Update of PO
  // guarantee an optional return of PurchaseOrder
  // first must enable PO cache for guarantee.
  CreatePost: optProp(
    either(
      MutationErrors,
      props({
        response: prop(CreatePost.CreatePostResponse),
        query: optProp(PostResult)
      })
    )
  )
  // UpdatePurchaseOrder: optProp(
  //   either(
  //     MutationErrors,
  //     props({
  //       response: optProp(Void),
  //       query: optProp(POResult)
  //     })
  //   )
  // )
}) {}
