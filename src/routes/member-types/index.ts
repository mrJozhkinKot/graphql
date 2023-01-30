import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { ERROR_BAD_REQUEST, ERROR_MEMBER_TYPE_NOT_FOUND } from '../../utils/DB/errors/errorMessages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const type = await fastify.db.memberTypes.findOne({key: 'id', equals: request.params.id})
      if (!type) {
        return reply.code(404).send({message: ERROR_MEMBER_TYPE_NOT_FOUND})
      }
      return reply.code(200).send(type)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const type = await fastify.db.memberTypes.findOne({key: 'id', equals: request.params.id})
      if (!type) {
        return reply.code(400).send({message: ERROR_MEMBER_TYPE_NOT_FOUND})
      }
      const updatedType = await fastify.db.memberTypes.change(type.id, request.body)
      if (!updatedType) {
        return reply.code(400).send({message: ERROR_BAD_REQUEST})
      }
      return reply.code(200).send(updatedType)
    }
  );
};

export default plugin;
