"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements, } from "@stripe/react-stripe-js";
import { payOnlineSaleAction} from "@/modules/sale/sale.actions";

// Inicializa Stripe 
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

// Tipos
interface CheckoutFormProps {
  saleId: string;
  total: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Formateador MXN 
function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Componente interno: el formulario real con PaymentElement
function StripePaymentForm({ total, saleId, onSuccess, onCancel }: { //  Agregamos saleId aquí
  total: number;
  saleId: string; // <--- Y definimos su tipo aquí
  onSuccess?: () => void;
  onCancel?: () => void;
}){
  const stripe = useStripe();       // Hook de Stripe — acceso a stripe.confirmPayment
  const elements = useElements();   // Hook de Stripe — acceso al PaymentElement montado

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Cambiamos aquí para extraer también el paymentIntent
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/resultado`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message ?? "Ocurrió un error al procesar el pago.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await payOnlineSaleAction({
          saleId: saleId, // Pasamos el ID de la venta que recibimos por props
          amount: total,  // Pasamos el total que recibimos por props
          method: "CARD", // El método según tu Enum de Prisma
        });
        
        // Si el backend responde bien, mostramos la pantalla de éxito
        onSuccess?.();
      } catch (backendError: any) {
        console.error("Error al registrar pago en BD:", backendError);
        setErrorMessage("El pago se realizó, pero hubo un error al registrarlo en el sistema.");
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      {/* PaymentElement renderiza el formulario de Stripe (tarjeta, OXXO, etc.)
          Stripe lo estiliza automáticamente según el 'appearance' que pasaste a <Elements> */}
      <div style={{ marginBottom: "24px" }}>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error de pago */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#991b1b",
            lineHeight: "1.5",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Total y botón de pago */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderTop: "1px solid rgba(193,200,194,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "Noto Serif, serif",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1a1c19",
            }}
          >
            Total a pagar
          </span>
          <span
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "18px",
              fontWeight: "800",
              color: "#1a1c19",
            }}
          >
            {formatMXN(total)} MXN
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!stripe || isProcessing}
        style={{
          width: "100%",
          padding: "20px",
          backgroundColor: isProcessing ? "#727974" : "#042419",
          color: "#ffffff",
          border: "none",
          borderRadius: "0",
          fontSize: "12px",
          fontWeight: "700",
          fontFamily: "Manrope, sans-serif",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          cursor: isProcessing ? "not-allowed" : "pointer",
          transition: "opacity 0.2s, background-color 0.3s",
        }}
      >
        {isProcessing ? "Procesando..." : "Confirmar Pago"}
      </button>

      {onCancel && (
        <button
          onClick={onCancel}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "transparent",
            color: "#727974",
            border: "none",
            fontSize: "10px",
            fontFamily: "Manrope, sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            marginTop: "12px",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationColor: "rgba(193,200,194,0.4)",
          }}
        >
          Volver al carrito
        </button>
      )}
    </div>
  );
}

export default function CheckoutForm({ saleId, total, onSuccess, onCancel, }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  // Al montar el componente pedimos el PaymentIntent
  useEffect(() => {
    async function createIntent() {
      try {
        const res = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ saleId }),
        });

        if (!res.ok) {
          throw new Error("No se pudo iniciar el proceso de pago.");
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setFetchError(err.message ?? "Error desconocido.");
      } finally {
        setLoading(false);
      }
    }
    createIntent();
  }, [saleId]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#042419",
      colorBackground: "#fafaf5",
      colorText: "#1a1c19",
      colorDanger: "#991b1b",
      fontFamily: "Manrope, sans-serif",
      borderRadius: "0px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: "1px solid #c1c8c2",
        padding: "12px 14px",
        fontSize: "14px",
      },
      ".Input:focus": {
        border: "1px solid #042419",
        boxShadow: "none",
        outline: "none",
      },
      ".Label": {
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#414844",
        marginBottom: "8px",
      },
      ".Tab": {
        border: "1px solid #c1c8c2",
        borderRadius: "0px",
      },
      ".Tab--selected": {
        border: "1px solid #042419",
        color: "#042419",
      },
      ".Tab:hover": {
        color: "#042419",
      },
    },
  };

  // Estados de carga / error 
  if (loading) {
    return (
      <div
        style={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Manrope, sans-serif",
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#727974",
          backgroundColor: "#fafaf5",
        }}
      >
        Preparando pago...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        style={{
          padding: "32px",
          backgroundColor: "#fafaf5",
          fontFamily: "Manrope, sans-serif",
          color: "#991b1b",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        {fetchError}
      </div>
    );
  }

  // Pantalla de éxito 
  if (paid) {
    return (
      <div
        style={{
          minHeight: "400px",
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
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#042419",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#fff", fontSize: "32px" }}
          >
            check
          </span>
        </div>
        <h2
          style={{
            fontFamily: "Noto Serif, serif",
            fontSize: "24px",
            fontWeight: "700",
            color: "#1a1c19",
            marginBottom: "12px",
          }}
        >
          Pago exitoso
        </h2>
        <p
          style={{
            color: "#727974",
            fontSize: "13px",
            letterSpacing: "0.05em",
            marginBottom: "32px",
          }}
        >
          Tu pedido ha sido confirmado.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "16px 48px",
            backgroundColor: "#042419",
            color: "#fff",
            border: "none",
            fontSize: "11px",
            fontWeight: "700",
            fontFamily: "Manrope, sans-serif",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  // Formulario principal
  return (
    <div
      style={{
        backgroundColor: "#fafaf5",
        fontFamily: "Manrope, sans-serif",
        minHeight: "100vh",
        paddingBottom: "48px",
      }}
    >
      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Título */}
        <h1
          style={{
            fontFamily: "Noto Serif, serif",
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "#1a1c19",
            marginBottom: "8px",
          }}
        >
          Pago seguro
        </h1>
        <p
          style={{
            fontSize: "12px",
            color: "#727974",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Procesado por Stripe
        </p>

        {/* Card del formulario */}
        <div
          style={{
            backgroundColor: "#f4f4ef",
            padding: "32px",
            marginBottom: "24px",
          }}
        >
          {/* Elements envuelve todo — sin él useStripe() y useElements() no funcionan */}
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance,
                locale: "es-419", // Español latinoamericano
              }}
            >
              <StripePaymentForm
                total={total}
                onSuccess={() => setPaid(true)}
                onCancel={onCancel}
                saleId={saleId}
              />
            </Elements>
          )}
        </div>

        {/* Sellos de seguridad */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "10px",
              color: "rgba(65,72,68,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px" }}
            >
              lock
            </span>
            Pago 100% seguro y encriptado
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              opacity: 0.4,
              filter: "grayscale(1)",
            }}
          >
            <span className="material-symbols-outlined">credit_card</span>
            <span className="material-symbols-outlined">account_balance</span>
            <span className="material-symbols-outlined">contactless</span>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Manrope:wght@300;400;500;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }

        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}