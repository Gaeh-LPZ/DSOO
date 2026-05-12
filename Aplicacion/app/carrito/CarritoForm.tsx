"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCartAction, addToCartAction, removeCartItemAction, updateCartItemQuantityAction, } from "@/modules/carrito/carrito.actions";
import { cancelPendingSalesAction, createSaleFromCartAction } from "@/modules/sale/sale.actions";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

const IVA_RATE = 0.16;

function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CarritoForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCartAction();

      if (data && data.items) {
        setItems(data.items);
        setServerTotal(data.total);
      } else {
        setItems([]);
        setServerTotal(0);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasAddedRef = useRef(false);    //Agregarlo para no dos cargos de producto



  useEffect(() => {
    async function init() {
      setLoading(true);
      await cancelPendingSalesAction()

      if (productId && !hasAddedRef.current) {
        hasAddedRef.current = true;

        try {
          await addToCartAction({ productId });
          router.replace("/carrito");
        } catch (e) {
          console.error("Error al agregar producto");
        }
      }

      await refreshCart();
    }

    init();
  }, [productId, refreshCart, router]);

  const handleUpdateQuantity = async (pId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;

    if (newQty <= 0) return handleRemove(pId);

    try {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === pId
            ? { ...item, quantity: newQty }
            : item
        )
      );

      await updateCartItemQuantityAction({ productId: pId, quantity: newQty });

      await refreshCart();
    } catch (error) {
      await refreshCart();
    }
  };

  const handleRemove = async (pId: string) => {
    try {
      await removeCartItemAction({ productId: pId });
      await refreshCart();
    } catch (error) {
      console.error("Error al eliminar");
    }
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  if (loading && items.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-sm uppercase tracking-[0.2em]"
        style={{
          backgroundColor: "#fafaf5",
          color: "#727974",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        Actualizando bolsa...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-[#1a1c19] antialiased pb-24"
      style={{
        backgroundColor: "#fafaf5",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <main className="pt-8 px-6 max-w-lg mx-auto">
        <h1
          className="text-3xl font-bold tracking-tight mb-8"
          style={{
            fontFamily: "Noto Serif, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Bolsa de Compras
        </h1>

        <section className="mb-12 space-y-8">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p
                className="text-sm uppercase tracking-widest"
                style={{
                  color: "#727974",
                  letterSpacing: "0.2em",
                }}
              >
                Su bolsa está vacía
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-5 items-start">
                  {/* imagen */}
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                      width: "128px",
                      height: "160px",
                      backgroundColor: "#eeeee9",
                    }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* info */}
                  <div className="flex flex-col flex-grow min-h-[160px]">
                    <span
                      className="text-[10px] font-bold uppercase mb-1"
                      style={{
                        letterSpacing: "0.2em",
                        color: "#414844",
                      }}
                    >
                      Producto
                    </span>

                    <h2
                      className="text-lg font-bold leading-tight mb-4"
                      style={{
                        fontFamily: "Noto Serif, serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.name}
                    </h2>

                    <div className="flex items-center justify-between mt-auto">
                      {/* cantidad */}
                      <div
                        className="flex items-center"
                        style={{
                          border: "1px solid #c1c8c2",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity,
                              -1
                            )
                          }
                          className="flex items-center justify-center w-8 h-8 transition-colors hover:bg-[#eeeee9]"
                          aria-label="Disminuir cantidad"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            remove
                          </span>
                        </button>

                        <span
                          className="px-3 text-sm font-medium"
                          style={{
                            minWidth: "32px",
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity,
                              1
                            )
                          }
                          className="flex items-center justify-center w-8 h-8 transition-colors hover:bg-[#eeeee9]"
                          aria-label="Aumentar cantidad"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            add
                          </span>
                        </button>
                      </div>

                      {/* precio */}
                      <span className="text-sm font-bold">
                        {formatMXN(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* eliminar */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-[10px] uppercase text-left mt-4 transition-opacity hover:opacity-60"
                      style={{
                        letterSpacing: "0.1em",
                        color: "#727974",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        textDecorationColor:
                          "rgba(193,200,194,0.4)",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {index < items.length - 1 && (
                  <div
                    className="mt-8"
                    style={{
                      height: "1px",
                      backgroundColor:
                        "rgba(193,200,194,0.25)",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </section>

        {/* resumen */}
        {items.length > 0 && (
          <section
            className="mb-12 p-8"
            style={{ backgroundColor: "#f4f4ef" }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              Resumen del Pedido
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span
                  className="font-medium"
                  style={{ color: "#414844" }}
                >
                  Subtotal
                </span>

                <span className="font-bold">
                  {formatMXN(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span
                  className="font-medium"
                  style={{ color: "#414844" }}
                >
                  Envío
                </span>

                <span
                  className="font-bold text-[10px] uppercase"
                  style={{
                    letterSpacing: "0.15em",
                    alignSelf: "center",
                  }}
                >
                  Gratis
                </span>
              </div>

              <div className="flex justify-between">
                <span
                  className="font-medium"
                  style={{ color: "#414844" }}
                >
                  Impuestos (IVA 16%)
                </span>

                <span className="font-bold">
                  {formatMXN(iva)}
                </span>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor:
                    "rgba(193,200,194,0.4)",
                  margin: "16px 0",
                }}
              />

              <div className="flex justify-between text-lg">
                <span
                  className="font-bold"
                  style={{
                    fontFamily: "Noto Serif, serif",
                  }}
                >
                  Total
                </span>

                <span className="font-extrabold">
                  {formatMXN(total)} MXN
                </span>
              </div>
            </div>
          </section>
        )}

        {/* checkout */}
        {items.length > 0 && (
          <div className="space-y-8">
            {/* Dirección de envío */}
            <section className="mb-6 p-8" style={{ backgroundColor: "#f4f4ef" }}>
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: "Noto Serif, serif" }}
              >
                Dirección de envío
              </h3>

              <label
                className="block text-[10px] font-bold uppercase mb-2"
                style={{ letterSpacing: "0.2em", color: "#414844" }}
              >
                Dirección completa
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (e.target.value.trim()) setAddressError(false);
                }}
                placeholder="Calle, número, colonia, ciudad, estado..."
                className="w-full px-4 py-3 text-sm"
                style={{
                  border: addressError ? "1px solid #c0392b" : "1px solid #c1c8c2",
                  borderRadius: 0,
                  backgroundColor: "#fafaf5",
                  outline: "none",
                }}
              />

              {addressError && (
                <p className="text-xs mt-2" style={{ color: "#c0392b", letterSpacing: "0.05em" }}>
                  Ingresa una dirección para continuar
                </p>
              )}
            </section>

            <button
              onClick={async () => {
                if (!address.trim()) {
                  setAddressError(true);
                  return;
                }
                const saleId = await createSaleFromCartAction();
                router.push(`/checkout?saleId=${saleId}`);
              }}
              className="w-full py-5 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: address.trim() ? "#042419" : "#9aaa9e",
                letterSpacing: "0.3em",
                borderRadius: "0",
                cursor: address.trim() ? "pointer" : "not-allowed",
              }}
            >
              Proceder al Pago
            </button>

            <div className="flex flex-col items-center gap-5">
              <div
                className="flex items-center gap-2 text-[10px] uppercase"
                style={{
                  color: "rgba(65,72,68,0.6)",
                  letterSpacing: "0.1em",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "14px" }}
                >
                  lock
                </span>

                Pago 100% Seguro y Encriptado
              </div>

              <div
                className="flex gap-5"
                style={{
                  opacity: 0.4,
                  filter: "grayscale(1)",
                }}
              >
                <span className="material-symbols-outlined">
                  credit_card
                </span>

                <span className="material-symbols-outlined">
                  account_balance
                </span>

                <span className="material-symbols-outlined">
                  contactless
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Manrope:wght@300;400;500;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings:
            'FILL' 0,
            'wght' 300,
            'GRAD' 0,
            'opsz' 24;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}