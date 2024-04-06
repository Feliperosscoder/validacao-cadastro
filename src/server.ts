import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { RecoverPassword } from "./components/recover-passowrd";


const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(Register)
app.register(Login)
app.register(RecoverPassword)

app.listen({port: 3333}).then(() => console.log("Running in server"))