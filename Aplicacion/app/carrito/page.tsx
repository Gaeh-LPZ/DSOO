"use client";

import { useState } from "react";

interface CartItem {
  id: number;
  category: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    category: "ACCESORIOS",
    name: "Bolso Tote de Piel Estructurada",
    price: 42500.0,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDe1QE90V3ar2HAaFawuLFooNY9OT0zv_zHR6-MIg_GyBdvm68Dx8GAsO23Fss1Ew7D4WQUjoN73fouxYBP1WZ3LdgcdRmWKU_R9BUWcCdkjU3gC_0TrI16fl0ACXrxI4hKt-An2KgX_LbgPgu_S0d2UmKmag7QmGdGMaVTQtmQpRAeCFVpmZx6sHp4CK0eRzvKaraMH1XQagZOpyoNv-butfO1dReV5M0hhbkhrA_fN1W132kcc2bsuG5Cl4bhENtmRsS913tH_Uw",
    imageAlt:
      "Bolso de lujo de piel estructurada en verde bosque con herrajes dorados",
  },
  {
    id: 2,
    category: "ACCESORIOS",
    name: "Lentes de Sol Oversized",
    price: 8900.0,
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp8iKXm_-LNg3tgzcBNaKShqbwMuYLBRpbbCYz-rvf9CxcptxMc9hAUb9HuPQ26LnAxi_OmRGXobIY0N1j5CXSV-8TK5T66EdstyudnB9cBxWgQF0TEsGtPqVSiUYjUZYQZCLiKJ_LJHZAT0y-TxTNFhr66agnbwBpJnLNAyydgi8oZ3U4ejqoFOPcL7EynaMGpmrGmaDKivmOAuI0l22pZu81b8Lp-N3kFWxYk-YSo7yqnxtCz16xaNJpurZ0fnfUzUFlF_oJ7fM",
    imageAlt: "Lentes de sol de diseñador oversized sobre mármol blanco",
  },
];

// tasa de descuento cuando aplica cupón (10%)
const DISCOUNT_RATE = 0.1;
// IVA estándar en México
const IVA_RATE = 0.16;
// el único cupón válido por ahorita
const VALID_COUPON = "LUXURY10";

// formatea cualquier número como pesos mexicanos
function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CartPage() {
  // estado de los productos en el carrito
  const [items, setItems] = useState<CartItem[]>(initialItems);
  // lo que el usuario escribe en el campo del cupón
  const [couponCode, setCouponCode] = useState("");
  // true si el cupón ya fue aplicado correctamente
  const [couponApplied, setCouponApplied] = useState(false);
  // mensaje de error si el cupón no sirve
  const [couponError, setCouponError] = useState("");

  // sube o baja la cantidad de un producto; si llega a 0 lo quita del carrito
  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // elimina un producto del carrito por su id
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // cálculos del resumen del pedido
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = couponApplied ? subtotal * DISCOUNT_RATE : 0;
  const taxable = subtotal - discount;
  const iva = taxable * IVA_RATE;
  const total = taxable + iva;

  // valida el cupón y aplica el descuento si es correcto
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Código no válido. Intente con LUXURY10.");
    }
  };

  return (
    <div
      className="min-h-screen text-[#1a1c19] antialiased pb-24"
      style={{ backgroundColor: "#fafaf5", fontFamily: "Manrope, sans-serif" }}
    >
      {/* el header ya lo pone el layout, aquí no hace falta */}

      {/* aquí va todo el contenido de la página */}
      <main className="pt-8 px-6 max-w-lg mx-auto">
        {/* título de la página */}
        <h1
          className="text-3xl font-bold tracking-tight mb-8"
          style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
        >
          Bolsa de Compras
        </h1>

        {/* lista de productos en el carrito */}
        <section className="mb-12 space-y-8">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p
                className="text-sm uppercase tracking-widest"
                style={{ color: "#727974", letterSpacing: "0.2em" }}
              >
                Su bolsa está vacía
              </p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-5 items-start">
                  {/* foto del producto */}
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                      width: "128px",
                      height: "160px",
                      backgroundColor: "#eeeee9",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* nombre, categoría, precio y cantidad */}
                  <div className="flex flex-col flex-grow min-h-[160px]">
                    <span
                      className="text-[10px] font-bold uppercase mb-1"
                      style={{
                        letterSpacing: "0.2em",
                        color: "#414844",
                      }}
                    >
                      {item.category}
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

                    {/* botones para subir/bajar cantidad y el precio */}
                    <div className="flex items-center justify-between mt-auto">
                      <div
                        className="flex items-center"
                        style={{ border: "1px solid #c1c8c2" }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
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
                          style={{ minWidth: "32px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
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

                      <span className="text-sm font-bold">
                        {formatMXN(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* botón para quitar el producto del carrito */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] uppercase text-left mt-4 transition-opacity hover:opacity-60"
                      style={{
                        letterSpacing: "0.1em",
                        color: "#727974",
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        textDecorationColor: "rgba(193,200,194,0.4)",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* línea separadora entre productos */}
                {index < items.length - 1 && (
                  <div
                    className="mt-8"
                    style={{
                      height: "1px",
                      backgroundColor: "rgba(193,200,194,0.25)",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </section>

        {/* campo para meter el cupón de descuento */}
        <section className="mb-12">
          <div className="flex items-end gap-4">
            <div className="flex-grow">
              <label
                className="block text-[10px] font-bold uppercase mb-2"
                style={{ letterSpacing: "0.2em", color: "#414844" }}
              >
                Código Promocional
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="INGRESE SU CÓDIGO"
                className="w-full bg-transparent py-2 px-0 text-sm outline-none transition-colors"
                style={{
                  borderBottom: "1px solid #c1c8c2",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: "0",
                  color: "#1a1c19",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderBottomColor = "#042419")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderBottomColor = "#c1c8c2")
                }
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              className="text-[10px] font-bold uppercase pb-2 transition-opacity hover:opacity-60"
              style={{
                letterSpacing: "0.2em",
                borderBottom: "1px solid #042419",
                color: "#042419",
              }}
            >
              Aplicar
            </button>
          </div>
          {couponApplied && (
            <p
              className="text-[10px] mt-2 uppercase tracking-wider"
              style={{ color: "#456556" }}
            >
              ✓ Descuento del 10% aplicado
            </p>
          )}
          {couponError && (
            <p
              className="text-[10px] mt-2 uppercase tracking-wider"
              style={{ color: "#ba1a1a" }}
            >
              {couponError}
            </p>
          )}
        </section>

        {/* resumen de lo que va a pagar el cliente */}
        <section className="mb-12 p-8" style={{ backgroundColor: "#f4f4ef" }}>
          <h3
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "Noto Serif, serif" }}
          >
            Resumen del Pedido
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#414844" }} className="font-medium">
                Subtotal
              </span>
              <span className="font-bold">{formatMXN(subtotal)}</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between" style={{ color: "#042419" }}>
                <span className="font-medium">Descuento (10%)</span>
                <span className="font-bold">-{formatMXN(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span style={{ color: "#414844" }} className="font-medium">
                Envío
              </span>
              <span
                className="font-bold text-[10px] uppercase"
                style={{ letterSpacing: "0.15em", alignSelf: "center" }}
              >
                Gratis
              </span>
            </div>

            <div className="flex justify-between">
              <span style={{ color: "#414844" }} className="font-medium">
                Impuestos (IVA 16%)
              </span>
              <span className="font-bold">{formatMXN(iva)}</span>
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: "rgba(193,200,194,0.4)",
                margin: "16px 0",
              }}
            />

            <div className="flex justify-between text-lg">
              <span
                className="font-bold"
                style={{ fontFamily: "Noto Serif, serif" }}
              >
                Total
              </span>
              <span className="font-extrabold">{formatMXN(total)} MXN</span>
            </div>
          </div>
        </section>

        {/* botón principal para ir a pagar */}
        <div className="space-y-8">
          <button
            className="w-full py-5 text-[12px] font-bold uppercase text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "#042419",
              letterSpacing: "0.3em",
              borderRadius: "0",
            }}
          >
            Proceder al Pago
          </button>

          {/* mensaje de seguridad e iconos de pago */}
          <div className="flex flex-col items-center gap-5">
            <div
              className="flex items-center gap-2 text-[10px] uppercase"
              style={{ color: "rgba(65,72,68,0.6)", letterSpacing: "0.1em" }}
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
              style={{ opacity: 0.4, filter: "grayscale(1)" }}
            >
              <span className="material-symbols-outlined">credit_card</span>
              <span className="material-symbols-outlined">account_balance</span>
              <span className="material-symbols-outlined">contactless</span>
            </div>
          </div>
        </div>
      </main>

      {/* barra de navegación de abajo, fija en pantalla */}
      <nav
        className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 z-50"
        style={{
          backgroundColor: "rgba(250,250,245,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(26,28,25,0.06)",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        {[
          { icon: "storefront", label: "BOUTIQUE", active: false },
          { icon: "search", label: "SEARCH", active: false },
          { icon: "shopping_bag", label: "CART", active: true, filled: true },
          { icon: "person", label: "PROFILE", active: false },
        ].map(({ icon, label, active, filled }) => (
          <button
            key={label}
            className="flex flex-col items-center pt-2 transition-opacity active:opacity-60"
            style={{ color: active ? "#042419" : "rgba(26,28,25,0.35)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                fontVariationSettings: filled
                  ? "'FILL' 1"
                  : "'FILL' 0",
              }}
            >
              {icon}
            </span>
            <span
              className="uppercase mt-1"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                fontWeight: active ? 700 : 400,
                borderTop: active ? "2px solid #042419" : "none",
                paddingTop: active ? "2px" : "0",
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>

      {/* fuentes de Google y los íconos de Material*/}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Manrope:wght@300;400;500;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        input::placeholder { color: rgba(114,121,116,0.4); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}