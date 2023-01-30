import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { ERROR_BAD_REQUEST, ERROR_ID_INVALID, ERROR_PROFILE_EXIST, ERROR_PROFILE_NOT_FOUND } from '../../utils/DB/errors/errorMessages';
import { validateId } from '../../utils/helpers/validateId';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    const profiles = await fastify.db.profiles.findMany()
    return reply.code(200).send(profiles)
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({key: "id", equals: request.params.id})
      if (!profile) {
        return reply.code(404).send({message: ERROR_PROFILE_NOT_FOUND})
      }
      return reply.code(200).send(profile)
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
        if (!validateId(request.body.userId)) {
          return reply.code(404).send({message: ERROR_ID_INVALID})
        }
        const userProfiles = await fastify.db.profiles.findOne({key: "userId", equals: request.body.userId})
        if (userProfiles) {
          return reply.code(400).send({message: ERROR_PROFILE_EXIST})
        }
        const memberTypeId = await fastify.db.memberTypes.findOne({key: "id", equals: request.body.memberTypeId})
        if (!memberTypeId) {
          return reply.code(400).send({message: ERROR_BAD_REQUEST})
        }
        const newProfile = await fastify.db.profiles.create(request.body)
         return reply.code(201).send(newProfile)
  }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (!validateId(request.params.id)) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      const profile =  await fastify.db.profiles.findOne({key:"id", equals: request.params.id})
      if (!profile) {
        return reply.code(400).send({message: ERROR_PROFILE_NOT_FOUND})
      }
        const deletedProfile = await fastify.db.profiles.delete(profile.id)
        return reply.code(204).send(deletedProfile)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (!validateId(request.params.id)) {
        return reply.code(400).send({message: ERROR_ID_INVALID})
      }
      const profile = await fastify.db.profiles.findOne({key:"id", equals: request.params.id})
      if (!profile) {
        return reply.code(400).send({message: ERROR_PROFILE_NOT_FOUND})
      } 
        const updatedProfile = await fastify.db.profiles.change(profile.id, request.body)
        return reply.code(200).send(updatedProfile)
    }
  );
};

export default plugin;
