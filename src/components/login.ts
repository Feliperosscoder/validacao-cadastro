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
          email: z.string().email().nullish(),
          name: z.string().nullish(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            user: z.object({
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
      const { name, email, password } = request.body;

      let emailOrEmail: string | undefined = undefined;

      if (name) emailOrEmail = name;
      if (email) emailOrEmail = email;

      if (!emailOrEmail) {
        throw new Error("Neither name nor email provided.");
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: emailOrEmail }, { name: emailOrEmail }],
          password,
        },
      });

      if (!user) throw new Error("Incorrect email/name or password ");

      return reply.status(200).send({
        user: {
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
