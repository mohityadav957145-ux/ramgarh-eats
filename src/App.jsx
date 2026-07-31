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
    tagline: "Bus Stand, Main Market Rd · Pizza, shakes & bakery",
    phone: "9783875505",
    menu: [
      { id: "m1", name: "Cheese Pizza (Medium)", price: 100, veg: true },
      { id: "m2", name: "Margherita Pizza (Medium)", price: 150, veg: true },
      { id: "m3", name: "Veg Delight Pizza (Medium)", price: 150, veg: true },
      { id: "m4", name: "Farm House Pizza (Medium)", price: 300, veg: true },
      { id: "m5", name: "Tandoori Paneer Pizza (Medium)", price: 290, veg: true },
      { id: "m6", name: "Arora's Special Pizza (Medium)", price: 350, veg: true },
    ],
  },
  {
    id: "c2",
    name: "Grand Maharaja Restaurant",
    emoji: "🍛",
    tagline: "Sudan Complex, Delhi-Alwar Highway · Pure veg multi-cuisine",
    phone: "01468294233",
    menu: [
      { id: "m7", name: "Paneer Tikka", price: 200, veg: true },
      { id: "m8", name: "Malai Chaap", price: 200, veg: true },
      { id: "m9", name: "Paneer Butter Masala", price: 250, veg: true },
      { id: "m10", name: "Dal Makhani (Full)", price: 200, veg: true },
      { id: "m11", name: "Maharaja Spl Veg Biryani", price: 180, veg: true },
      { id: "m12", name: "Garlic Naan", price: 50, veg: true },
    ],
  },
  {
    id: "c3",
    name: "Delhi 6 Restaurant",
    emoji: "🍗",
    tagline: "Near Sagar Marriage Place, Dohli · Non-veg specialist",
    phone: "8209429827",
    menu: [
      { id: "m13", name: "Tandoori Chicken (Half)", price: 200, veg: false },
      { id: "m14", name: "Butter Chicken (Half)", price: 380, veg: false },
      { id: "m15", name: "Chicken Handi Spl (Half)", price: 350, veg: false },
      { id: "m16", name: "Hyderabadi Biryani (Half)", price: 120, veg: false },
      { id: "m17", name: "Paneer Tikka (Half)", price: 180, veg: true },
      { id: "m18", name: "Dal Tadka (Full)", price: 150, veg: true },
    ],
  },
  {
    id: "c4",
    name: "Urban Pizza Town (UPT)",
    emoji: "🍕",
    tagline: "Main Market, Punchhi Tower, Opp. HDFC ATM · Pizza & fast food",
    phone: "9772880360",
    menu: [
      { id: "m19", name: "Farm House Pizza (Medium)", price: 249, veg: true },
      { id: "m20", name: "Veg Burger", price: 39, veg: true },
      { id: "m21", name: "Cheese Burger", price: 49, veg: true },
      { id: "m22", name: "Paneer Tikka Sandwich", price: 79, veg: true },
      { id: "m23", name: "Veg Momos (Steam)", price: 49, veg: true },
      { id: "m24", name: "French Fry", price: 49, veg: true },
    ],
  },
  {
    id: "c5",
    name: "Hudinwal's Restaurant",
    emoji: "🥘",
    tagline: "Ramgarh · Pizza, South Indian & multi-cuisine",
    phone: "9772204088",
    menu: [
      { id: "m25", name: "Margherita Pizza", price: 230, veg: true },
      { id: "m26", name: "Paneer Tikka Pizza", price: 300, veg: true },
      { id: "m27", name: "Masala Dosa", price: 195, veg: true },
      { id: "m28", name: "Cheese Masala Dosa", price: 205, veg: true },
      { id: "m29", name: "Veg Grilled Sandwich", price: 100, veg: true },
      { id: "m30", name: "Aloo Paratha", price: 80, veg: true },
    ],
  },
  {
    id: "c6",
    name: "Lucky Hotel & Restaurant",
    emoji: "🍲",
    tagline: "Near Petrol Pump, Ramgarh · Home-style veg & non-veg",
    phone: "9982285354",
    menu: [
      { id: "m31", name: "Butter Chicken (1kg)", price: 580, veg: false },
      { id: "m32", name: "Chicken Curry (1kg)", price: 480, veg: false },
      { id: "m33", name: "Egg Curry (2 egg)", price: 70, veg: false },
      { id: "m34", name: "Shahi Paneer", price: 220, veg: true },
      { id: "m35", name: "Matar Paneer", price: 140, veg: true },
      { id: "m36", name: "Dal Tadka", price: 60, veg: true },
    ],
  },
];

const STATUS_STEPS = ["Placed", "Preparing", "Ready", "Delivered"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// =====================================================================
// FIREBASE CONFIG — Mohit, isko apne Firebase project ke Database URL se
// replace karo. Steps README.md mein hain.
// =====================================================================
const FIREBASE_DB_URL = "https://ramgarh-eats-default-rtdb.firebaseio.com";

async function fbGet(path) {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`);
  if (!res.ok) throw new Error("Firebase GET failed");
  const data = await res.json();
  return data;
}

async function fbSet(path, value) {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error("Firebase SET failed");
}

async function loadCafes() {
  try {
    const data = await fbGet("cafes");
    if (data) return data;
  } catch (e) {}
  try {
    await fbSet("cafes", SEED_CAFES);
  } catch (e) {}
  return SEED_CAFES;
}

async function saveCafes(cafes) {
  try {
    await fbSet("cafes", cafes);
  } catch (e) {}
}

async function loadOrders() {
  try {
    const data = await fbGet("orders");
    if (data) return Object.values(data);
  } catch (e) {}
  return [];
}

async function saveOrders(orders) {
  try {
    const obj = {};
    orders.forEach((o) => { obj[o.id] = o; });
    await fbSet("orders", obj);
  } catch (e) {}
}

function TicketDivider() {
  return (
    <div className="flex items-center gap-1 py-1" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="w-1 h-1 rounded-full" style={{ background: `${MAROON}33` }} />
      ))}
    </div>
  );
}

function Header({ view, setView }) {
  return (
    <header
      className="sticky top-0 z-30 border-b-4"
      style={{ background: CREAM, borderColor: MAROON }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ background: MAROON, color: CREAM }}
          >
            🍽️
          </div>
          <div>
            <h1 className="font-display text-xl leading-none" style={{ color: MAROON }}>
              Ramgarh Eats
            </h1>
            <p className="font-body text-[11px] tracking-wide" style={{ color: CHARCOAL }}>
              Apne mohalle ka khana, ek app mein
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === "owner" ? "customer" : "owner")}
            className="font-body text-xs font-semibold px-3 py-2 rounded-full border-2 flex items-center gap-1.5 transition-colors"
            style={{ borderColor: MAROON, color: MAROON, background: "transparent" }}
          >
            <Store size={14} />
            {view === "owner" ? "Customer view" : "Cafe owner"}
          </button>
        </div>
      </div>
    </header>
  );
}

const NONVEG_RED = "#A23B2E";

function VegDot({ veg = true }) {
  const color = veg ? FOREST : NONVEG_RED;
  return (
    <span
      className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 rounded-sm shrink-0"
      style={{ borderColor: color }}
      aria-label={veg ? "veg" : "non-veg"}
    >
      {veg ? (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      ) : (
        <span
          className="w-0 h-0"
          style={{
            borderLeft: "3.5px solid transparent",
            borderRight: "3.5px solid transparent",
            borderBottom: `5px solid ${color}`,
          }}
        />
      )}
    </span>
  );
}

// ---------------- CUSTOMER VIEW ----------------

function CafeList({ cafes, onSelect }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: MUSTARD }}>
        Ramgarh, Alwar
      </p>
      <h2 className="font-display text-2xl mb-4" style={{ color: MAROON_DARK }}>
        Kahan se order karein?
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {cafes.map((cafe) => (
          <button
            key={cafe.id}
            onClick={() => onSelect(cafe)}
            className="text-left rounded-xl border-2 overflow-hidden bg-white hover:-translate-y-0.5 transition-transform"
            style={{ borderColor: "#E5D8BE" }}
          >
            <div className="px-4 pt-4 pb-3 flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ background: CREAM }}
              >
                {cafe.emoji}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg leading-tight truncate" style={{ color: CHARCOAL }}>
                  {cafe.name}
                </h3>
                <p className="font-body text-xs mt-0.5" style={{ color: "#6b5f52" }}>
                  {cafe.tagline}
                </p>
              </div>
            </div>
            <div
              className="font-body text-[11px] px-4 py-2 flex items-center justify-between"
              style={{ background: CREAM, color: MAROON }}
            >
              <span>{cafe.menu.length} items</span>
              <span className="font-semibold">Menu dekho →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuView({ cafe, cart, setCart, onBack }) {
  const qtyFor = (itemId) => cart[itemId]?.qty || 0;

  const changeQty = (item, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[item.id]?.qty || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        delete next[item.id];
      } else {
        next[item.id] = { ...item, cafeId: cafe.id, cafeName: cafe.name, qty: newQty };
      }
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={onBack}
        className="font-body text-xs font-semibold flex items-center gap-1 mb-4"
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
          >
            <ShoppingBag size={16} /> {cartCount} items · Cart dekho
          </button>
        </div>
      )}

      {cartOpen && (
        <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} onPlaceOrder={placeOrder} />
      )}
    </div>
  );
}

// ---------------- OWNER VIEW ----------------

function OwnerLogin({ cafes, onPick, onCreate }) {
  const [newName, setNewName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [creating, setCreating] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="font-display text-2xl mb-1" style={{ color: MAROON_DARK }}>Cafe / Restaurant owner</h2>
      <p className="font-body text-xs mb-5" style={{ color: "#8a7a68" }}>
        Apna cafe select karo ya naya register karo (demo mein simple login hai, real app mein OTP/password hoga)
      </p>
      <div className="space-y-2 mb-6">
        {cafes.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className="w-full flex items-center gap-3 rounded-lg border-2 bg-white px-3 py-2.5 text-left"
            style={{ borderColor: "#E5D8BE" }}
          >
            <span className="text-xl">{c.emoji}</span>
            <span className="font-body text-sm font-medium" style={{ color: CHARCOAL }}>{c.name}</span>
          </button>
        ))}
      </div>

      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="font-body text-sm font-bold px-4 py-2.5 rounded-lg border-2 w-full"
          style={{ borderColor: MAROON, color: MAROON }}
        >
          + Naya cafe register karo
        </button>
      ) : (
        <div className="rounded-lg border-2 bg-white p-4 space-y-2" style={{ borderColor: "#E5D8BE" }}>
          <input
            placeholder="Cafe/restaurant ka naam"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 outline-none"
            style={{ borderColor: "#E5D8BE" }}
          />
          <input
            placeholder="Tagline (e.g. Ghar jaisa khana)"
            value={newTagline}
            onChange={(e) => setNewTagline(e.target.value)}
            className="w-full font-body text-sm px-3 py-2 rounded-lg border-2 outline-none"
            style={{ borderColor: "#E5D8BE" }}
          />
          <button
            onClick={() => {
              if (!newName.trim()) return;
              onCreate({ name: newName, tagline: newTagline });
            }}
            className="w-full font-body text-sm font-bold py-2.5 rounded-lg"
            style={{ background: MAROON, color: CREAM }}
          >
            Register karo
          </button>
        </div>
      )}
    </div>
  );
}

function OwnerDashboard({ cafe, cafes, setCafes, orders, refreshOrders, onLogout }) {
  const [tab, setTab] = useState("menu");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const cafeOrders = orders.filter((o) => o.cafeId === cafe.id).slice().reverse();

  const addItem = async () => {
    if (!itemName.trim() || !itemPrice) return;
    const updated = cafes.map((c) =>
      c.id === cafe.id
        ? { ...c, menu: [...c.menu, { id: uid(), name: itemName, price: Number(itemPrice), veg: true }] }
        : c
    );
    setCafes(updated);
    await saveCafes(updated);
    setItemName("");
    setItemPrice("");
  };

  const removeItem = async (itemId) => {
    const updated = cafes.map((c) =>
      c.id === cafe.id ? { ...c, menu: c.menu.filter((m) => m.id !== itemId) } : c
    );
    setCafes(updated);
    await saveCafes(updated);
  };

  const advanceStatus = async (orderId) => {
    const all = await loadOrders();
    const updated = all.map((o) => {
      if (o.id !== orderId) return o;
      const idx = STATUS_STEPS.indexOf(o.status);
      const next = STATUS_STEPS[Math.min(idx + 1, STATUS_STEPS.length - 1)];
      return { ...o, status: next };
    });
    await saveOrders(updated);
    await refreshOrders();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={onLogout} className="font-body text-xs font-semibold flex items-center gap-1 mb-3" style={{ color: MAROON }}>
        <ArrowLeft size={14} /> Cafe badlo
      </button>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{cafe.emoji}</span>
        <h2 className="font-display text-2xl" style={{ color: MAROON_DARK }}>{cafe.name}</h2>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("menu")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: tab === "menu" ? MAROON : "transparent", color: tab === "menu" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          <Utensils size={12} className="inline mr-1" /> Menu manage karo
        </button>
        <button
          onClick={() => setTab("orders")}
          className="font-body text-xs font-semibold px-3 py-1.5 rounded-full relative"
          style={{ background: tab === "orders" ? MAROON : "transparent", color: tab === "orders" ? CREAM : MAROON, border: `2px solid ${MAROON}` }}
        >
          <ChefHat size={12} className="inline mr-1" /> Orders
          {cafeOrders.filter((o) => o.status !== "Delivered").length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold" style={{ background: MUSTARD, color: MAROON_DARK }}>
              {cafeOrders.filter((o) => o.status !== "Delivered").length}
            </span>
          )}
        </button>
      </div>

      {tab === "menu" && (
        <div>
          <div className="rounded-lg border-2 bg-white p-4 mb-4 flex gap-2 flex-wrap" style={{ borderColor: "#E5D8BE" }}>
            <input
              placeholder="Item ka naam"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="flex-1 min-w-[140px] font-body text-sm px-3 py-2 rounded-lg border-2 outline-none"
              style={{ borderColor: "#E5D8BE" }}
            />
            <input
              placeholder="Price ₹"
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-24 font-body text-sm px-3 py-2 rounded-lg border-2 outline-none"
              style={{ borderColor: "#E5D8BE" }}
            />
            <button onClick={addItem} className="font-body text-sm font-bold px-4 py-2 rounded-lg" style={{ background: MAROON, color: CREAM }}>
              Add
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "#EAE0C8" }}>
            {cafe.menu.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VegDot veg={item.veg} />
                  <span className="font-body text-sm" style={{ color: CHARCOAL }}>{item.name}</span>
                  <span className="font-body text-xs" style={{ color: "#8a7a68" }}>₹{item.price}</span>
                </div>
                <button onClick={() => removeItem(item.id)} className="font-body text-xs font-semibold" style={{ color: MAROON }}>
                  Hatao
                </button>
              </div>
            ))}
            {cafe.menu.length === 0 && <p className="font-body text-sm py-4" style={{ color: "#8a7a68" }}>Koi item nahi hai, upar se add karo.</p>}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {cafeOrders.length === 0 && <p className="font-body text-sm" style={{ color: "#8a7a68" }}>Abhi koi order nahi aaya.</p>}
          {cafeOrders.map((o) => (
            <div key={o.id} className="rounded-xl border-2 bg-white p-4" style={{ borderColor: "#E5D8BE" }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-body text-sm font-semibold" style={{ color: CHARCOAL }}>{o.customerName} · {o.phone}</p>
                  <p className="font-body text-[11px]" style={{ color: "#8a7a68" }}>{o.address}</p>
                </div>
                <span className="font-body text-[11px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: CREAM, color: MAROON }}>{o.status}</span>
              </div>
              <div className="mt-2 space-y-0.5">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between font-body text-xs" style={{ color: "#6b5f52" }}>
                    <span>{it.qty} × {it.name}</span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t" style={{ borderColor: "#EAE0C8" }}>
                <span className="font-body text-sm font-bold" style={{ color: MAROON_DARK }}>₹{o.total}</span>
                {o.status !== "Delivered" ? (
                  <button
                    onClick={() => advanceStatus(o.id)}
                    className="font-body text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: MAROON, color: CREAM }}
                  >
                    Mark as {STATUS_STEPS[STATUS_STEPS.indexOf(o.status) + 1]}
                  </button>
                ) : (
                  <span className="font-body text-xs font-semibold" style={{ color: FOREST }}>✓ Complete</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OwnerView({ cafes, setCafes, orders, refreshOrders }) {
  const [ownerCafeId, setOwnerCafeId] = useState(null);
  const cafe = cafes.find((c) => c.id === ownerCafeId);

  const handleCreate = async ({ name, tagline }) => {
    const newCafe = { id: uid(), name, emoji: "🍴", tagline: tagline || "Naya cafe Ramgarh mein", menu: [] };
    const updated = [...cafes, newCafe];
    setCafes(updated);
    await saveCafes(updated);
    setOwnerCafeId(newCafe.id);
  };

  if (!cafe) {
    return <OwnerLogin cafes={cafes} onPick={setOwnerCafeId} onCreate={handleCreate} />;
  }

  return (
    <OwnerDashboard
      cafe={cafe}
      cafes={cafes}
      setCafes={setCafes}
      orders={orders}
      refreshOrders={refreshOrders}
      onLogout={() => setOwnerCafeId(null)}
    />
  );
}

// ---------------- ROOT ----------------

export default function App() {
  const [view, setView] = useState("customer");
  const [cafes, setCafes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    const o = await loadOrders();
    setOrders(o);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [c, o] = await Promise.all([loadCafes(), loadOrders()]);
        setCafes(c);
        setOrders(o);
      } catch (e) {
        setCafes(SEED_CAFES);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // light polling so owner sees new orders / customer sees status updates without refresh
  useEffect(() => {
    const interval = setInterval(refreshOrders, 5000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  return (
    <div className="min-h-screen font-body" style={{ background: "#FDFBF5", color: CHARCOAL }}>
      <style>{FONT_STYLE}</style>
      <Header view={view} setView={setView} />
      {loading ? (
        <p className="font-body text-sm text-center py-16" style={{ color: "#8a7a68" }}>Load ho raha hai...</p>
      ) : view === "customer" ? (
        <CustomerView cafes={cafes} orders={orders} refreshOrders={refreshOrders} />
      ) : (
        <OwnerView cafes={cafes} setCafes={setCafes} orders={orders} refreshOrders={refreshOrders} />
      )}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="font-body text-[11px]" style={{ color: "#a89679" }}>
          Ramgarh Eats · Sabhi cafes aur customers ke beech real-time shared data
        </p>
      </footer>
    </div>
  );
}
