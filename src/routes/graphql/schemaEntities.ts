import { buildSchema } from 'graphql';

  export const schemaEntities = buildSchema(`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [String]
  }
  type Profile {
    id: ID
    avatar: String
    sex: String
    birthday: Float
    country: String
    street: String
    city: String
    memberTypeId: String
    userId: ID
  }
  type Post {
    id: String
    title: String
    content: String
    userId: String
  }
  type MemberType {
    id: String
    discount: Float
    monthPostsLimit: Float
  }
  type UserWithInfo {
    id: ID
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [String]
    profile: Profile
    posts: [Post]
    memberType: MemberType
  }
  type UserWithSubscribeTo {
    id: ID
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [String]
    userSubscribeTo: [User]
    profile: Profile
  }
  type UserWithSubscribers {
    id: ID
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [String]
    subscribedToUser: [User]
    posts: [Post]
  }
  type UserWithSubscribersAndSubscriptions {
    id: ID
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [String]
    subscribedToUser: [User]
    userSubscribeTo: [User]
  }
  type Query {
    users: [User]
    profiles: [Profile]
    posts: [Post]
    memberTypes: [MemberType]
    user(id: ID): User
    profile(id: ID): Profile
    post(id: ID): Post
    memberType(id: ID): MemberType
    usersWithInfo: [UserWithInfo]
    userWithInfo(id: ID): UserWithInfo
    usersWithSubscribeTo: [UserWithSubscribeTo]
    userWithSubscribers(id: ID): UserWithSubscribers
    usersWithSubscribersAndSubscriptions: [UserWithSubscribersAndSubscriptions]
  }
  input UserInput {
    id: ID
    firstName: String!
    lastName: String!
    email: String!
    subscribedToUserIds: [String]
  }
  input ProfileInput {
    id: ID
    avatar: String!
    sex: String!
    birthday: Float!
    country: String!
    street: String!
    city: String!
    memberTypeId: String!
    userId: ID!
  }
  input PostInput {
    id: String
    title: String!
    content: String!
    userId: String!
  }
  input MemberTypeInput {
    id: String
    discount: Float
    monthPostsLimit: Float
  }
  input SubscribeInput {
    id: String,
    userId: String
  }
  type Mutation {
    createUser(input: UserInput): User
    createProfile(input: ProfileInput): Profile
    createPost(input: PostInput): Post
    updateUser(input: UserInput): User
    updateProfile(input: ProfileInput): Profile
    updatePost(input: PostInput): Post
    updateMemberType(input: MemberTypeInput): MemberType
    subscribeTo(input: SubscribeInput): User
    unsubscribeFrom(input: SubscribeInput): User
  }
`);