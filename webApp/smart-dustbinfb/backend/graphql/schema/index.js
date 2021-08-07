const {buildSchema} = require('graphql');

module.exports = buildSchema(`

    type Point {
        _id: ID!
        earn: Int
        redeem: Int
        createdAt: String!
        owner: User!
    }

    type PointOfAll {
        _id: ID!
        name: String!
        sumOfPoints: Int
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        mnumber: String!
        rfid: String!
        password: String
        sumOfPoints: Int
    }

    type AuthData {
        userId: ID!
        token: String!
    }

    type Dustbin {
        _id: ID!
        Id: Int!
        address: String!
        location: String!
        status: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Message {
        message: String!
    }

    input AddPointInput {
        earnPoint: Int!
        rfid: String!
    }

    input RemovePointInput {
        redeemPoint: Int!
    }

    input UserInput {
        name: String!
        email: String!
        mnumber: String!
        rfid: String!
        password: String!
    }

    input UpdateInput {
        name: String!
        email: String!
        mnumber: String!
        rfid: String!
    }

    input NewDustbinInput {
        Id: Int!
        lat: Float!
        lng: Float!
        address: String!
        status: Int!
    }

    input UpdateDustbinInput {
        Id: Int!
        lat: Float
        lng: Float
        address: String
        status: Int!
    }

    input ResetPassInput {
        token: String!
        newPassword: String!
    }

    type RootQuery {
        points: [PointOfAll!]!
        login(email: String!, password: String!): AuthData!
        profile: User!
        userTransaction: [Point!]!
        getDustbinDetails: [Dustbin!]!
        forgotPassword(email: String!): Message!
    }
    
    type RootMutation {
        addPoint(addPointInput: AddPointInput): Point
        removePoint(removePointInput: RemovePointInput): Point
        createUser(userInput: UserInput): User!
        updateProfile(updateInput: UpdateInput): User!
        addNewDustbin(newDustbinInput: NewDustbinInput): Dustbin!
        updateDustbinInput(updateDustbinInput: UpdateDustbinInput): Dustbin!
        verifyToken(resetPassInput: ResetPassInput): Message!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);