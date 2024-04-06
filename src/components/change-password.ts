import bcryptjs from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function ChangePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/password-reset/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().uuid(),
        }),
        body: z.object({
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const { password } = request.body;

      const passwordHash = await bcryptjs.hash(password, 8);

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: passwordHash,
        },
      });

      return reply.status(200).send({ user });
    }
  );
}
