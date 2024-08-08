import express from "express";
import ApiError from "../response/error.js";
import { database } from "../db/database.js";
import ApiSuccess from "../response/success.js";

const router = express.Router();

/*
  Create a new user, if the user already exists then do nothing
  Method: POST
  Endpoint: /user/add
  Body:
    {
        "ticketSwapUserId": Ticketswap user ID,
        "firstName": First name
        "lastName": First name
    }
  Response: ApiSuccess | ApiError
*/
router.post("/user/add", async (request, response) => {
    try {
        const ticketSwapUserId = validate(request.body.ticketSwapUserId, 'ticketSwapUserId')
        const firstName = validate(request.body.firstName, 'firstName')
        const lastName = validate(request.body.lastName, 'lastName')

        await database.addUser(ticketSwapUserId, firstName, lastName)

        response.status(200).send(new ApiSuccess('Done'))
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});

/*
  Edit a user's token amount
  Method: POST
  Endpoint: /user/:ticketSwapUserId/tokens
  Body:
    {
        "delta": [+/-]amount
        "reason" "Why this change"
    }
  Response: ApiSuccess | ApiError
*/
router.post("/user/:ticketSwapUserId/tokens", async (request, response) => {
    try {
        const ticketSwapUserId = validate(request.params.ticketSwapUserId, 'ticketSwapUserId')
        const reason = validate(request.body.reason, 'reason')
        const delta = validate(request.body.delta, 'delta')
        const deltaAmount = parseInt(delta, 10);
        if (isNaN(deltaAmount)) {
            throw new ApiError('Invalid delta amount');
        }

        await database.addUserTokenDelta(ticketSwapUserId, delta, reason)

        response.status(200).send(new ApiSuccess('Done'))
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});

/*
  Get a user's token amount
  Method: GET
  Endpoint: /user/:ticketSwapUserId/tokens
  Response:
    {
        "amount": amount
    }
*/
router.get("/user/:ticketSwapUserId/tokens", async (request, response) => {
    try {
        const ticketSwapUserId = validate(request.params.ticketSwapUserId, 'ticketSwapUserId')
        const amount = await database.getUserTokenAmount(ticketSwapUserId)
        response.status(200).send({
            amount
        })
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});

/*
  Get a user's token history
  Method: GET
  Endpoint: /user/:ticketSwapUserId/tokens
  Response:
    [
        {
            "amount": amount,
            "delta": delta,
            "reason": reason description
        }
    ]
*/
router.get("/user/:ticketSwapUserId/tokens/history", async (request, response) => {
    try {
        const ticketSwapUserId = validate(request.params.ticketSwapUserId, 'ticketSwapUserId')
        const history = await database.getUserTokenHistory(ticketSwapUserId)
        response.status(200).send(history)
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});

/*
  Get promoted listings
  Method: GET
  Endpoint: /listings
  Response:
    [ 
        {
            listingId
            listingHash
            eventId
            eventTypeId 
        }
        ...    
    ]
*/
router.get("/listings", async (_, response) => {
    try {
        const listings = await database.getPromotedListings()
        response.status(200).send(listings)
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});

/*
  Create a new promoted listing, if the user already exists then do nothing
  Method: POST
  Endpoint: /listings/add
  Body:
    {
        "listingId": TicketSwap listing id
        "listingHash": TicketSwap listing hash
        "eventId": TicketSwap event id
        "eventTypeId": TicketSwap event id
    }
  Response: ApiSuccess | ApiError
*/
router.post("/listings/add", async (request, response) => {
    try {
        const id = validate(request.body.listingId, 'listingId')
        const hash = validate(request.body.listingHash, 'listingHash')
        const eventId = validate(request.body.eventId, 'eventId')
        const eventTypeId = validate(request.body.eventTypeId, 'eventTypeId')

        await database.addPromotedListing(id, hash, eventId, eventTypeId)

        response.status(200).send(new ApiSuccess('Done'))
    } catch (error) {
        console.log(error)
        const message = error.message ?? "Error"
        const code = error.code ?? 500
        response.status(code).send({
            code: code,
            message: message
        })
    }
});


function validate(param, name) {
    if (typeof param === 'string' && param.length > 0) {
        return param
    } else {
        throw new ApiError(400, `Parameter ${name} is not valid`)
    }
}

export default router
