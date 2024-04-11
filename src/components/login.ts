import bcryptjs from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function Login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login/user",
    {
      schema: {
        body: z.object({
          nameOrEmail: z.string(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string().min(3),
              email: z.string().email(),
              password: z.string(),
              phone: z.string(),
              birthday: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { nameOrEmail, password } = request.body;

      if (!nameOrEmail) {
        throw new Error("Neither name nor email provided.");
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: nameOrEmail }, { name: nameOrEmail }],
        },
      });

      if (!user) throw new Error("Incorrect email/name or password");

      const passwordNormal = await bcryptjs.compare(password, user.password);

      if (!passwordNormal) throw new Error("Incorrect email/name or password");

      return reply.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          birthday: user.birthday,
        },
      });
    }
  );
}
