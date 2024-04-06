import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { resend } from "../lib/resend";

export async function RecoverPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user/recover-password",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const AllUsers = await prisma.user.findMany();
      console.log(AllUsers)

      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (!user) {
        throw new Error("Icorrect Email");
      }

      const { error } = await resend.emails.send({
        from: "delivered@resend.dev",
        to: user.email,
        subject: "hello world",
        html: "<strong>it works!</strong>",
      });

      if (error) {
        return reply.status(400).send({ error });
      }
    }
  );
}
