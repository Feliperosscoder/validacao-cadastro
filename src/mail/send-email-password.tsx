import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function SendEmailPassword() {
  const previewText = "Confirme seu código";
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465]">
            <Section className="mt-[32px] text-center">
              <span className="2xl">FELIPEEEE</span>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Confirme seu código de verificação para alterar sua senha
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              você solicitou um código de verificação de email para alterar sua
              senha
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
