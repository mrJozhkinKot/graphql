import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, buildSchema, parse } from 'graphql';
import { validate } from 'graphql/validation'
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ID, UserWithInfo, UserWithSubscribeTo, UsersWithSubscribersAndSubscriptions, UserInput, ProfileInput, PostInput, UserUpdateInput, ProfileUpdateInput, PostUpdateInput, MemberTypeUpdateInput, SubscribeInput } from './types';
import DataLoader = require('dataloader');
import depthLimit = require('graphql-depth-limit');
import { ERROR_REQUEST_LIMIT } from '../../utils/DB/errors/errorMessages';


const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {

  const depth = 3

  const loadUserPosts = async (keys: readonly string[]) => {
    return keys.map((key) =>
      fastify.db.posts.findMany({ key: 'userId', equals: key })
    );
  };
  
  const userPostLoader = new DataLoader(loadUserPosts)


  const  schema = buildSchema(`
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
    userWithSubscribers(id: ID): [UserWithSubscribers]
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


const  rootValue = {
  users: async () => await fastify.db.users.findMany(),
  profiles: async () => await fastify.db.profiles.findMany(),
  posts:  async () => await fastify.db.posts.findMany(),
  memberTypes: async () => await fastify.db.memberTypes.findMany(),
  user: async ({id}:ID) =>  {return await fastify.db.users.findOne({key: 'id', equals: id})},
  profile: async ({id}:ID) =>  {return await fastify.db.profiles.findOne({key: 'id', equals: id})}, 
  post: async ({id}:ID) =>  {return await fastify.db.posts.findOne({key: 'id', equals: id})},
  memberType: async ({id}:ID) =>  {return await fastify.db.memberTypes.findOne({key: 'id', equals: id})}, 
  usersWithInfo: async () => {
    const users = await fastify.db.users.findMany()
    const usersWithInfo: Promise<UserWithInfo>[] = users.map(async(user) => {
      const userProfile =  await fastify.db.profiles.findOne({key: 'userId', equals: user.id})
      const userPosts = await userPostLoader.load(user.id)
      const memberType = userProfile? await fastify.db.memberTypes.findOne({key: 'id', equals: userProfile.memberTypeId}): null
      return {...user,
      profile: userProfile,
      posts: userPosts,
      memberType: memberType
      }
    })
    return usersWithInfo
  },
  userWithInfo: async ({id}:ID) => {
    const user = await fastify.db.users.findOne({key: 'id', equals: id})
    const userProfile = user? await fastify.db.profiles.findOne({key: 'userId', equals: user.id}): null
    const userPosts = user?  await userPostLoader.load(user.id): null
    const memberType = userProfile? await fastify.db.memberTypes.findOne({key: 'id', equals: userProfile.memberTypeId}): null
    return {...user, 
      profile: userProfile,
      posts: userPosts,
      memberType: memberType
    }
  },
  usersWithSubscribeTo: async () => {
    const users = await fastify.db.users.findMany()
    const usersWithSubscribeTo: Promise<UserWithSubscribeTo>[] = users.map(async(user) => {
      const userSubscribeTo: UserEntity[] = []
      user.subscribedToUserIds.forEach((id: string) => {
        users.forEach(userST => {
          if (userST.id === id) {
             userSubscribeTo.push(userST)
          }
        })
      })
      const userProfile = await fastify.db.profiles.findOne({key: 'userId', equals: user.id})
      return {...user,
      userSubscribeTo: userSubscribeTo,
      profile: userProfile
      }
    })
    return usersWithSubscribeTo
  },
  userWithSubscribers: async ({id}: ID) => {
    const users = await fastify.db.users.findMany()
    const user = await fastify.db.users.findOne({key: 'id', equals: id})
    const userPosts = user?  await userPostLoader.load(user.id): null
    const subscribers: UserEntity[] = []
    users.forEach((userSub: UserEntity) => {
      if (user) { 
        if (userSub.subscribedToUserIds.includes(user.id)) {
          subscribers.push(userSub)
        }
      }
    })
    return {...user, 
      subscribedToUser: subscribers,
      posts: userPosts,
    }
  },
  usersWithSubscribersAndSubscriptions: async () => {
    const users = await fastify.db.users.findMany()
    const usersWithSubscribersAndSubscriptions: Promise<UsersWithSubscribersAndSubscriptions>[] = users.map(async(user) => {
      const userSubscribeTo: UserEntity[] = []
      const subscribers: UserEntity[] = []
      user.subscribedToUserIds.forEach((id: string) => {
        users.forEach(userST => {
          if (userST.id === id) {
             userSubscribeTo.push(userST)
          }
        })
      })
      users.forEach((userSub: UserEntity) => {
        if (user) { 
          if (userSub.subscribedToUserIds.includes(user.id)) {
            subscribers.push(userSub)
          }
        }
      })
      return {...user,
      userSubscribeTo: userSubscribeTo,
      subscribedToUser: subscribers,
      }
    })
    return usersWithSubscribersAndSubscriptions
  },
  createUser: async ({input}: UserInput) => await fastify.db.users.create(input),
  createProfile: async ({input}: ProfileInput) => await fastify.db.profiles.create(input),
  createPost: async ({input}: PostInput) => await fastify.db.posts.create(input),
  updateUser: async ({input}: UserUpdateInput) => await fastify.db.users.change(input.id, input),
  updateProfile: async ({input}: ProfileUpdateInput) => await fastify.db.profiles.change(input.id, input),
  updatePost: async ({input}: PostUpdateInput) => await fastify.db.posts.change(input.id, input),
  updateMemberType: async ({input}: MemberTypeUpdateInput) => await fastify.db.memberTypes.change(input.id, input),
  subscribeTo: async ({input}: SubscribeInput) => {
    const user = await fastify.db.users.findOne({key:'id', equals: input.id})
    const subscribtion = await fastify.db.users.findOne({key:'id', equals: input.userId})
    if (!subscribtion || !user) {
      return null
    }
    await fastify.db.users.change(subscribtion.id, {subscribedToUserIds: [user.id, ...subscribtion.subscribedToUserIds] })
    const updatedUser = await fastify.db.users.change(user.id, {subscribedToUserIds: [subscribtion.id, ...user.subscribedToUserIds]})
    return updatedUser 
  },
  unsubscribeFrom: async ({input}: SubscribeInput) => {
    const user = await fastify.db.users.findOne({key:'id', equals: input.id})
    const subscribtion = await fastify.db.users.findOne({key:'id', equals: input.userId})
      if (!user || !subscribtion) {
        return null
      }
      const isSubscription = user.subscribedToUserIds.includes(subscribtion.id)
      const isSubscriber = subscribtion.subscribedToUserIds.includes(user.id)
      if (!isSubscription || !isSubscriber) {
        return null
      }
      await fastify.db.users.change(subscribtion.id, {subscribedToUserIds: subscribtion.subscribedToUserIds.filter(userId => userId !== user.id)})
      const updatedUser = await fastify.db.users.change(user.id, {subscribedToUserIds: user.subscribedToUserIds.filter(subscriberId => subscriberId !== subscribtion.id)})
      return updatedUser
  }
};


  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
        if(request.body.query) {
          const validateDepth = validate(
            schema,
            parse(request.body.query),  
            [depthLimit(depth)]
          )
          if(validateDepth.length) {
             throw new Error(ERROR_REQUEST_LIMIT)
          }
          const res = await graphql({ 
          schema,
          source: request.body.query,
          variableValues: request.body.variables,
          rootValue
        })
          reply.send(res)
        }
    }
  );
};

export default plugin;
