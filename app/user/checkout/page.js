// // app/user/checkout/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)



"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.has("edit");
  const editOrderId = searchParams.get("edit");

  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    address: "",
    building: "",
    floor: "",
    apartment: "",
    neighborhood: "",
    city: "",
    pincode: "", // Added pincode
    notes: ""
  });
  const [currency, setCurrency] = useState("SAR");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mode, setMode] = useState("full");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [originalProfile, setOriginalProfile] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resDetails = await fetch("/api/restaurantDetails");
        if (resDetails.ok) {
          const data = await resDetails.json();
          setCurrency(data.currency || "SAR");
          const wa = data.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        }

        if (isEditMode && editOrderId) {
          const resOrder = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
          if (resOrder.ok) {
            const order = await resOrder.json();
            const mappedCart = order.items.map(item => ({
              _id: item._id,
              name: item.name,
              price: item.price.toString(),
              quantity: item.quantity,
              addons: item.addons || [],
              selectedAddons: item.addons || [],
              image: item.image || null
            }));
            setCart(mappedCart);

            setForm({
              name: order.customerName || session?.user?.name || "",
              whatsapp: order.whatsapp || order.phone || "",
              address: order.deliveryAddress || "",
              city: order.city || "",
              notes: order.notes || "",
              building: order.building || "",
              floor: order.floor || "",
              apartment: order.apartment || "",
              neighborhood: order.neighborhood || "",
              pincode: order.pincode || ""
            });
          } else {
            toast.error("Order not found");
            router.push("/user/cart");
            return;
          }
        } else {
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);

              // 1. Fetch current dynamic prices to match the Cart page logic
              const prodRes = await fetch('/api/user/products');
              const allProducts = prodRes.ok ? await prodRes.json() : [];

              // 2. Sync prices based on ID
              const syncedCart = parsed.map(item => {
                const originalProduct = allProducts.find(p => p._id === item._id);
                // Use the dynamic price if found, else keep the cart price
                const latestPrice = originalProduct?.currentPrice || item.price;

                return {
                  ...item,
                  price: latestPrice.toString()
                };
              });

              setCart(syncedCart);
            } catch (e) {
              console.error("Cart sync error:", e);
              router.push("/user/cart");
              return;
            }
          } else {
            router.push("/user/cart");
            return;
          }
        }

        if (session?.user) {
          try {
            const resProfile = await fetch("/api/user/profile");
            if (resProfile.ok) {
              const profile = await resProfile.json();
              setOriginalProfile(profile);

              setForm(prev => ({
                ...prev,
                name: profile.name || prev.name || session.user.name || "",
                whatsapp: profile.whatsapp || prev.whatsapp || "",
                address: profile.address || prev.address || "",
                building: profile.building || prev.building || "",
                floor: profile.floor || prev.floor || "",
                apartment: profile.apartment || prev.apartment || "",
                neighborhood: profile.neighborhood || prev.neighborhood || "",
                city: profile.city || prev.city || "",
                pincode: profile.pincode || prev.pincode || "",
                notes: profile.notes || prev.notes || ""
              }));
            }
          } catch (err) {
            console.error("Profile fetch error:", err);
          }
        }
      } catch (err) {
        console.error("Critical load error:", err);
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEditMode, editOrderId, router, session]);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      // Force parseFloat to handle strings like "1.3"
      const price = parseFloat(item.price || 0);
      const qty = parseInt(item.quantity || 1);
      const base = price * qty;

      const addons = (item.selectedAddons || []).reduce((s, a) =>
        s + parseFloat(a.price || 0), 0) * qty;

      return sum + base + addons;
    }, 0).toFixed(2);
  };

  const total = calculateTotal();
  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));


  const sendOrder = async () => {
    if (!form.name || !form.whatsapp || !form.city) {
      toast.error("Name, WhatsApp & City are required");
      return;
    }
    if (mode === "full" && !form.address) {
      toast.error("Street address required in full mode");
      return;
    }
    if (!whatsappNumber) {
      toast.error("Restaurant WhatsApp number not available");
      return;
    }

    setSaving(true);

    if (saveToProfile && session?.user?.id) {
      try {
        const profileUpdate = {};
        Object.keys(form).forEach(key => {
          if (form[key] && (!originalProfile || !originalProfile[key])) {
            profileUpdate[key] = form[key];
          }
        });

        if (Object.keys(profileUpdate).length > 0) {
          await fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...originalProfile, ...profileUpdate }),
          });
          await updateSession();
        }
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }

    const orderId = isEditMode ? editOrderId : "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    const orderTime = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Riyadh",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });

    let message = "```\nNEW ORDER RECEIVED\n----------------------------\n";
    message += `Order ID : ${orderId}\nTime     : ${orderTime}\nCustomer : ${form.name}\n`;
    message += "----------------------------\nITEMS\n----------------------------\n";

    cart.forEach(item => {
      const qty = item.quantity || 1;
      const unitPrice = parseFloat(item.price || 0);
      const baseTotal = unitPrice * qty;
      message += `${qty} x ${item.name}\n  ${unitPrice.toFixed(2)} ${currency} x ${qty} = ${baseTotal.toFixed(2)}\n`;
      let addonsTotal = 0;
      if (item.selectedAddons?.length > 0) {
        item.selectedAddons.forEach(addon => {
          const aPrice = parseFloat(addon.price || 0);
          addonsTotal += aPrice;
          message += `  + ${addon.name} ${aPrice.toFixed(2)}\n`;
        });
        addonsTotal *= qty;
        message += `  Add-ons Total = ${addonsTotal.toFixed(2)} ${currency}\n`;
      }
      message += `  ITEM TOTAL = ${(baseTotal + addonsTotal).toFixed(2)} ${currency}\n\n`;
    });

    message += `----------------------------\nGRAND TOTAL = ${total} ${currency}\n`;
    message += `----------------------------\nDELIVERY ADDRESS\n${form.address || "Quick order"}, ${form.city}\n`;
    if (form.neighborhood) message += `Neighborhood: ${form.neighborhood}\n`;
    if (form.building) message += `Building: ${form.building}\n`;
    if (form.floor) message += `Floor: ${form.floor}\n`;
    if (form.apartment) message += `Apartment: ${form.apartment}\n`;
    if (form.pincode) message += `PIN: ${form.pincode}\n`;
    if (form.notes.trim()) message += `\nNOTES\n${form.notes}\n`;
    message += "```";

    const encoded = encodeURIComponent(message);

    try {
      // We store the response to ensure we wait for it before moving on
      const res = await fetch("/api/user/saveOrders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          customerName: form.name,
          customerPhone: form.whatsapp,
          items: cart.map(i => ({
            name: i.name,
            quantity: i.quantity || 1,
            price: parseFloat(i.price || 0),
            // Pass only the data properties to avoid circular JSON or complex objects
            addons: (i.selectedAddons || []).map(a => ({ name: a.name, price: parseFloat(a.price || 0) })),
            selectedAddons: (i.selectedAddons || []).map(a => ({ name: a.name, price: parseFloat(a.price || 0) }))
          })),
          totalAmount: parseFloat(total),
          address: `${form.address || "Quick order"}, ${form.city}`,
          neighborhood: form.neighborhood,
          building: form.building,
          floor: form.floor,
          apartment: form.apartment,
          pincode: form.pincode,
          notes: form.notes,
          orderId,
          orderTime,
          status: isEditMode ? "confirmed" : "pending"
        })
      });

      if (isEditMode) {
        await fetch("/api/user/updateOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: editOrderId, status: "confirmed" })
        });
      }

      // Successful DB save, now clean up and redirect
      if (res.ok) {
        localStorage.removeItem("cart");
        window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
        toast.success(isEditMode ? "Order resubmitted!" : "Order sent!");
        router.push("/user/menu");
      }
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Failed to save order to database.");
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-light text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 tracking-widest mb-3 rounded-full">CHECKOUT</div>
          <h1 className="text-2xl md:text-4xl font-light text-gray-900 mb-2">{isEditMode ? "Resubmit Order" : "Complete Your Order"}</h1>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 md:p-8">
          <div className="bg-gray-50 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-semibold mb-5">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900">{item.quantity || 1}× {item.name}</p>
                    <p className="font-semibold">{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">{total} {currency}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button onClick={() => setMode("full")} className={`px-6 py-3 rounded-full transition ${mode === "full" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>Full Details</button>
            <button onClick={() => setMode("quick")} className={`px-6 py-3 rounded-full transition ${mode === "quick" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>Quick Order</button>
          </div>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.name} onChange={e => updateField("name", e.target.value)} />
              <Field label="WhatsApp Number *" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="966501234567" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
              <Field label="Neighborhood" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} />
            </div>

            {mode === "full" && (
              <>
                <FieldTextarea label="Street Address *" value={form.address} onChange={e => updateField("address", e.target.value)} />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Building" value={form.building} onChange={e => updateField("building", e.target.value)} />
                  <Field label="Floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} />
                  <Field label="Apartment" value={form.apartment} onChange={e => updateField("apartment", e.target.value)} />
                  <Field label="Pin Code" value={form.pincode} onChange={e => updateField("pincode", e.target.value)} />
                </div>
                <FieldTextarea label="Delivery Notes" value={form.notes} onChange={e => updateField("notes", e.target.value)} />
              </>
            )}
          </div>

          {session?.user && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="saveToProfile"
                checked={saveToProfile}
                onChange={(e) => setSaveToProfile(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="saveToProfile" className="text-sm text-gray-700 font-medium cursor-pointer">
                Save new delivery details to my profile
              </label>
            </div>
          )}

          <button onClick={sendOrder} disabled={saving} className="w-full mt-10 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full disabled:opacity-50">
            {saving ? "Processing..." : "Send Order via WhatsApp"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-900">{label}</label>
      <input {...props} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all" />
    </div>
  );
}

function FieldTextarea({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-900">{label}</label>
      <textarea {...props} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

