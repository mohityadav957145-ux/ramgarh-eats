import React, { useState, useEffect, useCallback } from "react";
import { Plus, Minus, ShoppingBag, Store, ArrowLeft, ChefHat, Check, Clock, Package, X, Utensils } from "lucide-react";

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Rozha+One&family=Inter:wght@400;500;600;700;800&display=swap');
.font-display { font-family: 'Rozha One', serif; }
.font-body { font-family: 'Inter', sans-serif; }
`;

const MAROON = "#7A2E2E";
const MAROON_DARK = "#5C2222";
const MUSTARD = "#D9A32C";
const CREAM = "#F7EFDD";
const CHARCOAL = "#2A211C";
const FOREST = "#445E43";

const SEED_CAFES = [
  {
    id: "c1",
    name: "Arora Juice & Bakers",
    emoji: "🍕",
    tagline: "Bus Stand, Main Market Rd · Pizza, shakes
      style={{ color: MAROON }}
      >
        <ArrowLeft size={14} /> Sab cafes
      </button>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: CREAM }}>
          {cafe.emoji}
        </div>
        <div>
          <h2 className="font-display text-2xl" style={{ color: MAROON_DARK }}>{cafe.name}</h2>
          <p className="font-body text-xs" style={{ color: "#6b5f52" }}>{cafe.tagline}</p>
        </div>
      </div>
      <TicketDivider />
      <div className="mt-3 divide-y" style={{ borderColor: "#EAE0C8" }}>
        {cafe.menu.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <VegDot veg={item.veg} />
              <div className="min-w-0">
                <p className="font-body text-sm font-medium truncate" style={{ color: CHARCOAL }}>{item.name}</p>
                <p className="font-body text-xs" style={{ color: "#8a7a68" }}>₹{item.price}</p>
              </div>
            </div>
            {qtyFor(item.id) === 0 ? (
              <button
                onClick={() => changeQty(item, 1)}
                className="font-body text-xs font-bold px-3 py-1.5 rounded-full border-2 shrink-0"
                style={{ borderColor: MAROON, color: MAROON }}
              >
                ADD
              </button>
            ) : (
              <div
                className="flex items-center gap-2 rounded-full px-1 py-1 shrink-0"
                style={{ background: MAROON, color: CREAM }}
              >
                <button onClick={() => changeQty(item, -1)} className="w-6 h-6 flex items-center justify-center">
                  <Minus size={13} />
                </button>
                <span className="font-body text-xs font-bold w-4 text-center">{qtyFor(item.id)}</span>
                <button onClick={() => changeQty(item, 1)} className="w-6 h-6 flex items-center justify-center">
                  <Plus size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CartDrawer({ cart, setCart, onClose, onPlaceOrder }) {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const changeQty = (item, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[item.id]?.qty || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) delete next[item.id];
      else next[item.id] = { ...item, qty: newQty };
      return next;
    });
  };

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Naam, phone aur address bharo");
      return;
    }
    setError("");
    setPlacing(true);
    await onPlaceOrder({ name, phone, address });
    setPlacing(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] h-full overflow-y-auto" style={{ background: CREAM }}>
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b-2" style={{ borderColor: MAROON, background: CREAM }}>
          <h3 className="font-display text-lg" style={{ color: MAROON_DARK }}>Tumhara order</h3>
          <button onClick={onClose}><X size={20} color={MAROON} /></button>
        </div>

        {items.length === 0 ? (
          <p className="font-body text-sm text-center py-16" style={{ color: "#8a7a68" }}>Cart khaali hai</p>
        ) : (
          <div className="px-4 py-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#EAE0C8" }}>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: CHARCOAL }}>{item.name}</p>
                  <p className="font-body text-[11px]" style={{ color: "#8a7a68" }}>{item.cafeName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full px-1 py-0.5" style={{ background: MAROON, color: CREAM }}>
                    <button onClick={() => changeQty(item, -1)} className="w-5 h-5 flex items-center justify-center"><Minus size={11} /></button>
                    <span className="font-body text-xs font-bold w-3 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item, 1)} className="w-5 h-5 flex items-center justify-center"><Plus size={11} /></button>
                  </div>
                  <span className="font-body text-xs font-semibold w-10 text-right" style={{ color: CHARCOAL }}>₹{item.price * item.qty}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between py-3 font-body font-bold" style={{ color: MAROON_DARK }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <TicketDivider />

            <div className="mt-3 space-y-2">
              <input
                placeholder="Naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              <textarea
                placeholder="Delivery address (Ramgarh mein)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none resize-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              {error && <p className="font-body text-xs" style={{ color: MAROON }}>{error}</p>}
              <button
                onClick={submit}
                disabled={placing}
                className="w-full font-body text-sm font-bold py-3 rounded-lg mt-1 disabled:opacity-60"
                style={{ background: MAROON, color: CREAM }}
              >
                {placing ? "Order ja raha hai..." : `Order place karo · ₹${total}`}
              </button>
              <p className="font-body text-[10px] text-center" style={{ color: "#8a7a68" }}>
                Payment: Cash on delivery (demo mein online payment nahi hai)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderConfirmed({ order, onDone }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="rounded-xl border-2 bg-white p-6 text-center" style={{ borderColor: MAROON }}>
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: FOREST }}>
          <Check size={26} color="white" />
        </div>
        <h2 className="font-display text-2xl mb-1" style={{ color: MAROON_DARK }}>Order mil gaya!</h2>
        <p className="font-body text-xs mb-4" style={{ color: "#8a7a68" }}>Order ID: #{order.id}</p>
        <TicketDivider />
        <div className="text-left mt-3 space-y-1">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between font-body text-sm" style={{ color: CHARCOAL }}>
              <span>{it.qty} × {it.name}</span>
              <span>₹{it.price * it.qty}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-body font-bold mt-3 pt-2 border-t" style={{ borderColor: "#EAE0C8", color: MAROON_DARK }}>
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
        <p className="font-body text-xs mt-4" style={{ color: "#6b5f52" }}>
          {order.cafeName} tumhara order bana raha hai. Status "Track Order" mein dekho.
        </p>
        <button onClick={onDone} className="w-full font-body text-sm font-bold py-3 rounded-lg mt-4" style={{ background: MAROON, color: CREAM }}>
          Aur order karo
        </button>
      </div>
    </div>
  );
}

function TrackOrders({ orders, phone }) {
  const mine = orders.filter((o) => o.phone === phone).slice().reverse();
  if (!phone) {
    return <p className="font-body text-sm text-center py-10" style={{ color: "#8a7a68" }}>Order place karne ke baad yahan track kar sakte ho.</p>;
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="font-display text-2xl mb-2" style={{ color: MAROON_DARK }}>Tumhare orders</h2>
      {mine.length === 0 && <p className="font-body text-sm" style={{ color: "#8a7a68" }}>Koi order nahi mila.</p>}
      {mine.map((o) => {
        const stepIdx = STATUS_STEPS.indexOf(o.status);
        return (
          <div key={o.id} className="rounded-xl border-2 bg-white p-4" style={{ borderColor: "#E5D8BE" }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-display text-base" style={{ color: MAROON_DARK }}>{o.cafeName}</p>
                <p className="font-body text-[11px]" style={{ color: "#8a7a68" }}>#{o.id} · ₹{o.total}</p>
              </div>
              <span className="font-body text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: CREAM, color: MAROON }}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: i <= stepIdx ? MAROON : "#EAE0C8", color: i <= stepIdx ? CREAM : "#8a7a68" }}
                    >
                      {i < stepIdx ? <Check size={12} /> : i === stepIdx ? <Clock size={12} /> : <Package size={12} />}
                    </div>
                    <span className="font-body text-[9px] text-center" style={{ color: "#8a7a68" }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 -mt-4" style={{ background: i < stepIdx ? MAROON : "#EAE0C8" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CustomerView({ cafes, orders, refreshOrders }) {
  const [screen, setScreen] = useState("list"); // list | menu | track
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [lastPhone, setLastPhone] = useState("");

  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  const placeOrder = async ({ name, phone, address }) => {
    const items = Object.values(cart);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const cafeId = items[0]?.cafeId;
    const cafeName = items[0]?.cafeName;
    const order = {
      id: uid(),
      cafeId,
      cafeName,
      items,
      total,
      customerName: name,
      phone,
      address,
      status: "Placed",
      timestamp: Date.now(),
    };
    const updated = [...orders, order];
    await saveOrders(updated);
    await refreshOrders();
    setCart({});
    setCartOpen(false);
    setConfirmedOrder(order);
    setLastPhone(phone);
    setScreen("confirmed");
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-4 flex gap-2">
        <button
          onClick={() => setScreen("list")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: screen !== "track" && screen !== "confirmed" ? MAROON : "transparent", color: screen !== "track" && screen !== "confirmed" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          Order karo
        </button>
        <button
          onClick={() => setScreen("track")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: screen === "track" ? MAROON : "transparent", color: screen === "track" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          Track order
        </button>
      </div>

      {screen === "list" && <CafeList cafes={cafes} onSelect={(c) => { setSelectedCafe(c); setScreen("menu"); }} />}
      {screen === "menu" && selectedCafe && (
        <MenuView cafe={selectedCafe} cart={cart} setCart={setCart} onBack={() => setScreen("list")} />
      )}
      {screen === "confirmed" && confirmedOrder && (
        <OrderConfirmed order={confirmedOrder} onDone={() => setScreen("list")} />
      )}
      {screen === "track" && <TrackOrders orders={orders} phone={lastPhone} />}

      {(screen === "menu" || screen === "list") && cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30 px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="font-body text-sm font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
       style={{ background: MAROON, color: CREAM }}
            style={{ color: MAROON }}
      >
        <ArrowLeft size={14} /> Sab cafes
      </button>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: CREAM }}>
          {cafe.emoji}
        </div>
        <div>
          <h2 className="font-display text-2xl" style={{ color: MAROON_DARK }}>{cafe.name}</h2>
          <p className="font-body text-xs" style={{ color: "#6b5f52" }}>{cafe.tagline}</p>
        </div>
      </div>
      <TicketDivider />
      <div className="mt-3 divide-y" style={{ borderColor: "#EAE0C8" }}>
        {cafe.menu.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <VegDot veg={item.veg} />
              <div className="min-w-0">
                <p className="font-body text-sm font-medium truncate" style={{ color: CHARCOAL }}>{item.name}</p>
                <p className="font-body text-xs" style={{ color: "#8a7a68" }}>₹{item.price}</p>
              </div>
            </div>
            {qtyFor(item.id) === 0 ? (
              <button
                onClick={() => changeQty(item, 1)}
                className="font-body text-xs font-bold px-3 py-1.5 rounded-full border-2 shrink-0"
                style={{ borderColor: MAROON, color: MAROON }}
              >
                ADD
              </button>
            ) : (
              <div
                className="flex items-center gap-2 rounded-full px-1 py-1 shrink-0"
                style={{ background: MAROON, color: CREAM }}
              >
                <button onClick={() => changeQty(item, -1)} className="w-6 h-6 flex items-center justify-center">
                  <Minus size={13} />
                </button>
                <span className="font-body text-xs font-bold w-4 text-center">{qtyFor(item.id)}</span>
                <button onClick={() => changeQty(item, 1)} className="w-6 h-6 flex items-center justify-center">
                  <Plus size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CartDrawer({ cart, setCart, onClose, onPlaceOrder }) {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const changeQty = (item, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[item.id]?.qty || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) delete next[item.id];
      else next[item.id] = { ...item, qty: newQty };
      return next;
    });
  };

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Naam, phone aur address bharo");
      return;
    }
    setError("");
    setPlacing(true);
    await onPlaceOrder({ name, phone, address });
    setPlacing(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] h-full overflow-y-auto" style={{ background: CREAM }}>
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b-2" style={{ borderColor: MAROON, background: CREAM }}>
          <h3 className="font-display text-lg" style={{ color: MAROON_DARK }}>Tumhara order</h3>
          <button onClick={onClose}><X size={20} color={MAROON} /></button>
        </div>

        {items.length === 0 ? (
          <p className="font-body text-sm text-center py-16" style={{ color: "#8a7a68" }}>Cart khaali hai</p>
        ) : (
          <div className="px-4 py-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#EAE0C8" }}>
                <div>
                  <p className="font-body text-sm font-medium" style={{ color: CHARCOAL }}>{item.name}</p>
                  <p className="font-body text-[11px]" style={{ color: "#8a7a68" }}>{item.cafeName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full px-1 py-0.5" style={{ background: MAROON, color: CREAM }}>
                    <button onClick={() => changeQty(item, -1)} className="w-5 h-5 flex items-center justify-center"><Minus size={11} /></button>
                    <span className="font-body text-xs font-bold w-3 text-center">{item.qty}</span>
                    <button onClick={() => changeQty(item, 1)} className="w-5 h-5 flex items-center justify-center"><Plus size={11} /></button>
                  </div>
                  <span className="font-body text-xs font-semibold w-10 text-right" style={{ color: CHARCOAL }}>₹{item.price * item.qty}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between py-3 font-body font-bold" style={{ color: MAROON_DARK }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <TicketDivider />

            <div className="mt-3 space-y-2">
              <input
                placeholder="Naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              <textarea
                placeholder="Delivery address (Ramgarh mein)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 bg-white outline-none resize-none"
                style={{ borderColor: "#E5D8BE" }}
              />
              {error && <p className="font-body text-xs" style={{ color: MAROON }}>{error}</p>}
              <button
                onClick={submit}
                disabled={placing}
                className="w-full font-body text-sm font-bold py-3 rounded-lg mt-1 disabled:opacity-60"
                style={{ background: MAROON, color: CREAM }}
              >
                {placing ? "Order ja raha hai..." : `Order place karo · ₹${total}`}
              </button>
              <p className="font-body text-[10px] text-center" style={{ color: "#8a7a68" }}>
                Payment: Cash on delivery (demo mein online payment nahi hai)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderConfirmed({ order, onDone }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="rounded-xl border-2 bg-white p-6 text-center" style={{ borderColor: MAROON }}>
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: FOREST }}>
          <Check size={26} color="white" />
        </div>
        <h2 className="font-display text-2xl mb-1" style={{ color: MAROON_DARK }}>Order mil gaya!</h2>
        <p className="font-body text-xs mb-4" style={{ color: "#8a7a68" }}>Order ID: #{order.id}</p>
        <TicketDivider />
        <div className="text-left mt-3 space-y-1">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between font-body text-sm" style={{ color: CHARCOAL }}>
              <span>{it.qty} × {it.name}</span>
              <span>₹{it.price * it.qty}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-body font-bold mt-3 pt-2 border-t" style={{ borderColor: "#EAE0C8", color: MAROON_DARK }}>
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
        <p className="font-body text-xs mt-4" style={{ color: "#6b5f52" }}>
          {order.cafeName} tumhara order bana raha hai. Status "Track Order" mein dekho.
        </p>
        <button onClick={onDone} className="w-full font-body text-sm font-bold py-3 rounded-lg mt-4" style={{ background: MAROON, color: CREAM }}>
          Aur order karo
        </button>
      </div>
    </div>
  );
}

function TrackOrders({ orders, phone }) {
  const mine = orders.filter((o) => o.phone === phone).slice().reverse();
  if (!phone) {
    return <p className="font-body text-sm text-center py-10" style={{ color: "#8a7a68" }}>Order place karne ke baad yahan track kar sakte ho.</p>;
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="font-display text-2xl mb-2" style={{ color: MAROON_DARK }}>Tumhare orders</h2>
      {mine.length === 0 && <p className="font-body text-sm" style={{ color: "#8a7a68" }}>Koi order nahi mila.</p>}
      {mine.map((o) => {
        const stepIdx = STATUS_STEPS.indexOf(o.status);
        return (
          <div key={o.id} className="rounded-xl border-2 bg-white p-4" style={{ borderColor: "#E5D8BE" }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-display text-base" style={{ color: MAROON_DARK }}>{o.cafeName}</p>
                <p className="font-body text-[11px]" style={{ color: "#8a7a68" }}>#{o.id} · ₹{o.total}</p>
              </div>
              <span className="font-body text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: CREAM, color: MAROON }}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: i <= stepIdx ? MAROON : "#EAE0C8", color: i <= stepIdx ? CREAM : "#8a7a68" }}
                    >
                      {i < stepIdx ? <Check size={12} /> : i === stepIdx ? <Clock size={12} /> : <Package size={12} />}
                    </div>
                    <span className="font-body text-[9px] text-center" style={{ color: "#8a7a68" }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 -mt-4" style={{ background: i < stepIdx ? MAROON : "#EAE0C8" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CustomerView({ cafes, orders, refreshOrders }) {
  const [screen, setScreen] = useState("list"); // list | menu | track
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [lastPhone, setLastPhone] = useState("");

  const cartCount = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  const placeOrder = async ({ name, phone, address }) => {
    const items = Object.values(cart);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const cafeId = items[0]?.cafeId;
    const cafeName = items[0]?.cafeName;
    const order = {
      id: uid(),
      cafeId,
      cafeName,
      items,
      total,
      customerName: name,
      phone,
      address,
      status: "Placed",
      timestamp: Date.now(),
    };
    const updated = [...orders, order];
    await saveOrders(updated);
    await refreshOrders();
    setCart({});
    setCartOpen(false);
    setConfirmedOrder(order);
    setLastPhone(phone);
    setScreen("confirmed");
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-4 flex gap-2">
        <button
          onClick={() => setScreen("list")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: screen !== "track" && screen !== "confirmed" ? MAROON : "transparent", color: screen !== "track" && screen !== "confirmed" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          Order karo
        </button>
        <button
          onClick={() => setScreen("track")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: screen === "track" ? MAROON : "transparent", color: screen === "track" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          Track order
        </button>
      </div>

      {screen === "list" && <CafeList cafes={cafes} onSelect={(c) => { setSelectedCafe(c); setScreen("menu"); }} />}
      {screen === "menu" && selectedCafe && (
        <MenuView cafe={selectedCafe} cart={cart} setCart={setCart} onBack={() => setScreen("list")} />
      )}
      {screen === "confirmed" && confirmedOrder && (
        <OrderConfirmed order={confirmedOrder} onDone={() => setScreen("list")} />
      )}
      {screen === "track" && <TrackOrders orders={orders} phone={lastPhone} />}

      {(screen === "menu" || screen === "list") && cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30 px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="font-body text-sm font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            style={{ background: MAROON, color: CREAM }}
