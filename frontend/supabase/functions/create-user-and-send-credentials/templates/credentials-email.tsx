
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.12";
import * as React from "npm:react@18.2.0";

interface CredentialsEmailProps {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
}

export const CredentialsEmail = ({
  name,
  email,
  password,
  loginUrl,
}: CredentialsEmailProps) => (
  <Html>
    <Head />
    <Preview>Tus credenciales de acceso</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={title}>¡Hola, {name}!</Heading>
        <Section style={box}>
          <Text style={paragraph}>
            Se ha creado una cuenta para ti en nuestra plataforma. Aquí están tus credenciales de acceso:
          </Text>
          <Text style={paragraph}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={paragraph}>
            <strong>Contraseña Temporal:</strong>{" "}
            <code style={code}>{password}</code>
          </Text>
          <Text style={paragraph}>
            Te recomendamos cambiar tu contraseña después de iniciar sesión por
            primera vez.
          </Text>
          <Button style={button} href={loginUrl}>
            Iniciar Sesión
          </Button>
        </Section>
        <Text style={footer}>
          Si no esperabas este correo, puedes ignorarlo de forma segura.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default CredentialsEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const box = {
  padding: "0 48px",
};

const title = {
  ...box,
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#484848",
};

const paragraph = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 20px",
};

const code = {
  fontFamily: "monospace",
  backgroundColor: "#f4f4f4",
  padding: "2px 6px",
  borderRadius: "3px",
  fontWeight: "bold",
};

