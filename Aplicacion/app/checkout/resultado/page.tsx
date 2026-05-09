import { redirect } from "next/navigation";

interface ResultadoPageProps {
  searchParams: {
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string; // "succeeded" | "processing" | "requires_payment_method"
  };
}

export default function ResultadoPage({ searchParams }: ResultadoPageProps) {
  const status = searchParams.redirect_status;

  if (status === "succeeded") {
    // Pago exitoso vía redirect (OXXO, etc.)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafaf5",
          fontFamily: "Manrope, sans-serif",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Noto Serif, serif",
            fontSize: "28px",
            fontWeight: "700",
            color: "#1a1c19",
            marginBottom: "12px",
          }}
        >
          Pago confirmado
        </h1>
        <p style={{ color: "#727974", fontSize: "13px", letterSpacing: "0.05em" }}>
          Tu pedido ha sido procesado exitosamente.
        </p>
        <a
          href="/"
          style={{
            marginTop: "32px",
            padding: "16px 48px",
            backgroundColor: "#042419",
            color: "#fff",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Ir al inicio
        </a>
      </div>
    );
  }

  // Falló o está procesando → de vuelta al inicio
  redirect("/");
}