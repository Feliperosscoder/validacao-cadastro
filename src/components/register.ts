import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs"

export async function Register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register/user",
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
          password: z.string(),
          phone: z.string(),
          birthday: z.string(),
        }),
        response: {
          201: z.object({
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
      const { name, email, password, phone, birthday } = request.body;

      const userFromEmail = await prisma.user.findFirst({
        where: {
          email: {
            equals: email
          }
        },
      });

      if (userFromEmail !== null) {
        throw new Error("this email is already registered.");
      }

      const passwordHash = await bcryptjs.hash(password, 8)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          phone,
          birthday,
        },
      });

      return reply.status(201).send({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          birthday: user.birthday
        }
       });
    }
  );
}
