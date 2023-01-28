import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ERROR_BAD_REQUEST, ERROR_USER_NOT_FOUND } from '../../utils/DB/errors/errorMessages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany()
    return reply.code(200).send(users)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id}) 
      if (!user) {
        return reply.code(404).send({message: ERROR_USER_NOT_FOUND})
      }
      return reply.code(200).send(user)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = await fastify.db.users.create(request.body)
      if (!newUser){
         reply.code(400).send({message: ERROR_BAD_REQUEST})
        }
      return reply.code(201).send(newUser)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user =  await fastify.db.users.findOne({key:'id', equals: request.params.id})
      if (!user) {
        return reply.code(400).send({message: ERROR_USER_NOT_FOUND})
      }
      
      const userProfiles = await fastify.db.profiles.findMany({key: 'userId', equals: user.id})
      userProfiles.forEach(async userProfile => {await fastify.db.profiles.delete(userProfile.id)}) 
      const userPosts = await fastify.db.posts.findMany({key: 'userId', equals: user.id})
      userPosts.forEach(async userPost => { await fastify.db.posts.delete(userPost.id)})
   
      const userSubscribedTo = await fastify.db.users.findMany({key: 'subscribedToUserIds', equals: [user.id]})
      userSubscribedTo.forEach(async subscriber => {
        await fastify.db.users.change(subscriber.id, { subscribedToUserIds: subscriber.subscribedToUserIds.filter(subId => subId !== user.id) })
      })

      await fastify.db.users.delete(user.id)
      return reply.code(204).send(user)
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({key:'id', equals: request.params.id})
      if (!user) {
        return reply.code(404).send({message: ERROR_USER_NOT_FOUND})
      }
      const subscribtion = await fastify.db.users.findOne({key:'id', equals: request.body.userId})
      if (!subscribtion) {
        return reply.code(400).send({message: ERROR_USER_NOT_FOUND})
      }

        await fastify.db.users.change(subscribtion.id, {subscribedToUserIds: [user.id, ...subscribtion.subscribedToUserIds] })


         const updateUser = await fastify.db.users.change(user.id, {subscribedToUserIds: [subscribtion.id, ...user.subscribedToUserIds] })

      
      return reply.code(200).send(updateUser)
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({key:'id', equals: request.params.id})
      if (!user) {
        return reply.code(404).send({message: ERROR_USER_NOT_FOUND})
      }
      const subscribtion = await fastify.db.users.findOne({key:'id', equals: request.body.userId})
      if (!subscribtion) {
        return reply.code(404).send({message: ERROR_USER_NOT_FOUND})
      }
      const isSubscription = user.subscribedToUserIds.includes(subscribtion.id)
      const isSubscriber = subscribtion.subscribedToUserIds.includes(user.id)
      if (!isSubscription || !isSubscriber) {
        return reply.code(400).send({message: ERROR_USER_NOT_FOUND})
      }
      await fastify.db.users.change(subscribtion.id, {subscribedToUserIds: subscribtion.subscribedToUserIds.filter(userId => userId !== user.id)})
      const updatedUser = await fastify.db.users.change(user.id, {subscribedToUserIds: user.subscribedToUserIds.filter(subscriberId => subscriberId !== subscribtion.id)})
      return reply.code(200).send(updatedUser)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({key:'id', equals: request.params.id})
      if (!user) {
        return reply.code(400).send({message: ERROR_USER_NOT_FOUND})
      } 
      const updatedUser = await fastify.db.users.change(user.id, request.body)
      return reply.code(200).send(updatedUser)
    }
  );
};

export default plugin;
