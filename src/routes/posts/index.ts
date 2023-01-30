import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validateId } from '../../utils/helpers/validateId';
import { ERROR_BAD_REQUEST, ERROR_ID_INVALID, ERROR_POST_NOT_FOUND } from '../../utils/DB/errors/errorMessages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id})
      if (!validateId) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      if (!post) {
        return reply.code(404).send({message: ERROR_POST_NOT_FOUND})
      }
      return reply.code(200).send(post)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (!validateId(request.body.userId)) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      const newPost = await fastify.db.posts.create(request.body)
      if (!newPost) {
        return reply.code(400).send({message: ERROR_BAD_REQUEST})
      }
       return reply.code(201).send(newPost)
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (!validateId(request.params.id)) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      const post =  await fastify.db.posts.findOne({key:"id", equals: request.params.id})
      if (!post) {
        return reply.code(400).send({message: ERROR_POST_NOT_FOUND})
      }
        const deletedPost = await fastify.db.posts.delete(post.id)
        return reply.code(204).send(deletedPost)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (!validateId(request.params.id)) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      const post = await fastify.db.posts.findOne({key:"id", equals: request.params.id})
      if (!post) {
        return reply.code(400).send({message: ERROR_POST_NOT_FOUND})
      } 
        const updatedPost = await fastify.db.posts.change(post.id, request.body)
        return reply.code(200).send(updatedPost)
    }
  );
};

export default plugin;
