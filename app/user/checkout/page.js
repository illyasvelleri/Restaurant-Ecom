// // // app/user/checkout/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)



// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export const dynamic = 'force-dynamic';

// function CheckoutContent() {
//   const { data: session, update: updateSession } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const isEditMode = searchParams.has("edit");
//   const editOrderId = searchParams.get("edit");

//   const [cart, setCart] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     whatsapp: "",
//     address: "",
//     building: "",
//     floor: "",
//     apartment: "",
//     neighborhood: "",
//     city: "",
//     pincode: "", // Added pincode
//     notes: ""
//   });
//   const [currency, setCurrency] = useState("SAR");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [mode, setMode] = useState("full");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [originalProfile, setOriginalProfile] = useState(null);
//   const [saveToProfile, setSaveToProfile] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const resDetails = await fetch("/api/restaurantDetails");
//         if (resDetails.ok) {
//           const data = await resDetails.json();
//           setCurrency(data.currency || "SAR");
//           const wa = data.whatsapp?.replace(/\D/g, "") || "";
//           if (wa && wa.length >= 10) setWhatsappNumber(wa);
//         }

//         if (isEditMode && editOrderId) {
//           const resOrder = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
//           if (resOrder.ok) {
//             const order = await resOrder.json();
//             const mappedCart = order.items.map(item => ({
//               _id: item._id,
//               name: item.name,
//               price: item.price.toString(),
//               quantity: item.quantity,
//               addons: item.addons || [],
//               selectedAddons: item.addons || [],
//               image: item.image || null
//             }));
//             setCart(mappedCart);

//             setForm({
//               name: order.customerName || session?.user?.name || "",
//               whatsapp: order.whatsapp || order.phone || "",
//               address: order.deliveryAddress || "",
//               city: order.city || "",
//               notes: order.notes || "",
//               building: order.building || "",
//               floor: order.floor || "",
//               apartment: order.apartment || "",
//               neighborhood: order.neighborhood || "",
//               pincode: order.pincode || ""
//             });
//           } else {
//             toast.error("Order not found");
//             router.push("/user/cart");
//             return;
//           }
//         } else {
//           const savedCart = localStorage.getItem("cart");
//           if (savedCart) {
//             try {
//               const parsed = JSON.parse(savedCart);

//               // 1. Fetch current dynamic prices to match the Cart page logic
//               const prodRes = await fetch('/api/user/products');
//               const allProducts = prodRes.ok ? await prodRes.json() : [];

//               // 2. Sync prices based on ID
//               const syncedCart = parsed.map(item => {
//                 const originalProduct = allProducts.find(p => p._id === item._id);
//                 // Use the dynamic price if found, else keep the cart price
//                 const latestPrice = originalProduct?.currentPrice || item.price;

//                 return {
//                   ...item,
//                   price: latestPrice.toString()
//                 };
//               });

//               setCart(syncedCart);
//             } catch (e) {
//               console.error("Cart sync error:", e);
//               router.push("/user/cart");
//               return;
//             }
//           } else {
//             router.push("/user/cart");
//             return;
//           }
//         }

//         if (session?.user) {
//           try {
//             const resProfile = await fetch("/api/user/profile");
//             if (resProfile.ok) {
//               const profile = await resProfile.json();
//               setOriginalProfile(profile);

//               setForm(prev => ({
//                 ...prev,
//                 name: profile.name || prev.name || session.user.name || "",
//                 whatsapp: profile.whatsapp || prev.whatsapp || "",
//                 address: profile.address || prev.address || "",
//                 building: profile.building || prev.building || "",
//                 floor: profile.floor || prev.floor || "",
//                 apartment: profile.apartment || prev.apartment || "",
//                 neighborhood: profile.neighborhood || prev.neighborhood || "",
//                 city: profile.city || prev.city || "",
//                 pincode: profile.pincode || prev.pincode || "",
//                 notes: profile.notes || prev.notes || ""
//               }));
//             }
//           } catch (err) {
//             console.error("Profile fetch error:", err);
//           }
//         }
//       } catch (err) {
//         console.error("Critical load error:", err);
//         toast.error("Failed to load checkout data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [isEditMode, editOrderId, router, session]);

//   const calculateTotal = () => {
//     return cart.reduce((sum, item) => {
//       // Force parseFloat to handle strings like "1.3"
//       const price = parseFloat(item.price || 0);
//       const qty = parseInt(item.quantity || 1);
//       const base = price * qty;

//       const addons = (item.selectedAddons || []).reduce((s, a) =>
//         s + parseFloat(a.price || 0), 0) * qty;

//       return sum + base + addons;
//     }, 0).toFixed(2);
//   };

//   const total = calculateTotal();
//   const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));


//   const sendOrder = async () => {
//     if (!form.name || !form.whatsapp || !form.city) {
//       toast.error("Name, WhatsApp & City are required");
//       return;
//     }
//     if (mode === "full" && !form.address) {
//       toast.error("Street address required in full mode");
//       return;
//     }
//     if (!whatsappNumber) {
//       toast.error("Restaurant WhatsApp number not available");
//       return;
//     }

//     setSaving(true);

//     if (saveToProfile && session?.user?.id) {
//       try {
//         const profileUpdate = {};
//         Object.keys(form).forEach(key => {
//           if (form[key] && (!originalProfile || !originalProfile[key])) {
//             profileUpdate[key] = form[key];
//           }
//         });

//         if (Object.keys(profileUpdate).length > 0) {
//           await fetch("/api/user/profile", {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ ...originalProfile, ...profileUpdate }),
//           });
//           await updateSession();
//         }
//       } catch (e) {
//         console.error("Auto-save failed", e);
//       }
//     }

//     const orderId = isEditMode ? editOrderId : "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
//     const orderTime = new Date().toLocaleString("en-GB", {
//       timeZone: "Asia/Riyadh",
//       day: "2-digit", month: "short", year: "numeric",
//       hour: "2-digit", minute: "2-digit", hour12: true
//     });

//     let message = "```\nNEW ORDER RECEIVED\n----------------------------\n";
//     message += `Order ID : ${orderId}\nTime     : ${orderTime}\nCustomer : ${form.name}\n`;
//     message += "----------------------------\nITEMS\n----------------------------\n";

//     cart.forEach(item => {
//       const qty = item.quantity || 1;
//       const unitPrice = parseFloat(item.price || 0);
//       const baseTotal = unitPrice * qty;
//       message += `${qty} x ${item.name}\n  ${unitPrice.toFixed(2)} ${currency} x ${qty} = ${baseTotal.toFixed(2)}\n`;
//       let addonsTotal = 0;
//       if (item.selectedAddons?.length > 0) {
//         item.selectedAddons.forEach(addon => {
//           const aPrice = parseFloat(addon.price || 0);
//           addonsTotal += aPrice;
//           message += `  + ${addon.name} ${aPrice.toFixed(2)}\n`;
//         });
//         addonsTotal *= qty;
//         message += `  Add-ons Total = ${addonsTotal.toFixed(2)} ${currency}\n`;
//       }
//       message += `  ITEM TOTAL = ${(baseTotal + addonsTotal).toFixed(2)} ${currency}\n\n`;
//     });

//     message += `----------------------------\nGRAND TOTAL = ${total} ${currency}\n`;
//     message += `----------------------------\nDELIVERY ADDRESS\n${form.address || "Quick order"}, ${form.city}\n`;
//     if (form.neighborhood) message += `Neighborhood: ${form.neighborhood}\n`;
//     if (form.building) message += `Building: ${form.building}\n`;
//     if (form.floor) message += `Floor: ${form.floor}\n`;
//     if (form.apartment) message += `Apartment: ${form.apartment}\n`;
//     if (form.pincode) message += `PIN: ${form.pincode}\n`;
//     if (form.notes.trim()) message += `\nNOTES\n${form.notes}\n`;
//     message += "```";

//     const encoded = encodeURIComponent(message);

//     try {
//       // We store the response to ensure we wait for it before moving on
//       const res = await fetch("/api/user/saveOrders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session?.user?.id || null,
//           customerName: form.name,
//           customerPhone: form.whatsapp,
//           items: cart.map(i => ({
//             name: i.name,
//             quantity: i.quantity || 1,
//             price: parseFloat(i.price || 0),
//             // Pass only the data properties to avoid circular JSON or complex objects
//             addons: (i.selectedAddons || []).map(a => ({ name: a.name, price: parseFloat(a.price || 0) })),
//             selectedAddons: (i.selectedAddons || []).map(a => ({ name: a.name, price: parseFloat(a.price || 0) }))
//           })),
//           totalAmount: parseFloat(total),
//           address: `${form.address || "Quick order"}, ${form.city}`,
//           neighborhood: form.neighborhood,
//           building: form.building,
//           floor: form.floor,
//           apartment: form.apartment,
//           pincode: form.pincode,
//           notes: form.notes,
//           orderId,
//           orderTime,
//           status: isEditMode ? "confirmed" : "pending"
//         })
//       });

//       if (isEditMode) {
//         await fetch("/api/user/updateOrder", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId: editOrderId, status: "confirmed" })
//         });
//       }

//       // Successful DB save, now clean up and redirect
//       if (res.ok) {
//         localStorage.removeItem("cart");
//         window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
//         toast.success(isEditMode ? "Order resubmitted!" : "Order sent!");
//         router.push("/user/menu");
//       }
//     } catch (e) {
//       console.error("Save failed:", e);
//       toast.error("Failed to save order to database.");
//     } finally {
//       setSaving(false);
//     }
//   };



//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-base font-light text-gray-600">Loading checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//           Back
//         </button>

//         <div className="text-center mb-8">
//           <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 tracking-widest mb-3 rounded-full">CHECKOUT</div>
//           <h1 className="text-2xl md:text-4xl font-light text-gray-900 mb-2">{isEditMode ? "Resubmit Order" : "Complete Your Order"}</h1>
//         </div>

//         <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 md:p-8">
//           <div className="bg-gray-50 rounded-xl p-5 mb-8">
//             <h2 className="text-lg font-semibold mb-5">Order Summary</h2>
//             <div className="space-y-4">
//               {cart.map((item, idx) => (
//                 <div key={idx} className="bg-white rounded-lg p-4 border border-gray-100">
//                   <div className="flex justify-between items-start">
//                     <p className="font-semibold text-gray-900">{item.quantity || 1}× {item.name}</p>
//                     <p className="font-semibold">{(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-5 pt-5 border-t flex justify-between items-center">
//               <span className="text-lg font-semibold">Total</span>
//               <span className="text-2xl font-bold">{total} {currency}</span>
//             </div>
//           </div>

//           <div className="flex justify-center gap-3 mb-8">
//             <button onClick={() => setMode("full")} className={`px-6 py-3 rounded-full transition ${mode === "full" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>Full Details</button>
//             <button onClick={() => setMode("quick")} className={`px-6 py-3 rounded-full transition ${mode === "quick" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>Quick Order</button>
//           </div>

//           <div className="space-y-5">
//             <div className="grid md:grid-cols-2 gap-4">
//               <Field label="Full Name *" value={form.name} onChange={e => updateField("name", e.target.value)} />
//               <Field label="WhatsApp Number *" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="966501234567" />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               <Field label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
//               <Field label="Neighborhood" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} />
//             </div>

//             {mode === "full" && (
//               <>
//                 <FieldTextarea label="Street Address *" value={form.address} onChange={e => updateField("address", e.target.value)} />
//                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <Field label="Building" value={form.building} onChange={e => updateField("building", e.target.value)} />
//                   <Field label="Floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} />
//                   <Field label="Apartment" value={form.apartment} onChange={e => updateField("apartment", e.target.value)} />
//                   <Field label="Pin Code" value={form.pincode} onChange={e => updateField("pincode", e.target.value)} />
//                 </div>
//                 <FieldTextarea label="Delivery Notes" value={form.notes} onChange={e => updateField("notes", e.target.value)} />
//               </>
//             )}
//           </div>

//           {session?.user && (
//             <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
//               <input
//                 type="checkbox"
//                 id="saveToProfile"
//                 checked={saveToProfile}
//                 onChange={(e) => setSaveToProfile(e.target.checked)}
//                 className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
//               />
//               <label htmlFor="saveToProfile" className="text-sm text-gray-700 font-medium cursor-pointer">
//                 Save new delivery details to my profile
//               </label>
//             </div>
//           )}

//           <button onClick={sendOrder} disabled={saving} className="w-full mt-10 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full disabled:opacity-50">
//             {saving ? "Processing..." : "Send Order via WhatsApp"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, ...props }) {
//   return (
//     <div>
//       <label className="block mb-2 text-sm font-semibold text-gray-900">{label}</label>
//       <input {...props} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all" />
//     </div>
//   );
// }

// function FieldTextarea({ label, ...props }) {
//   return (
//     <div>
//       <label className="block mb-2 text-sm font-semibold text-gray-900">{label}</label>
//       <textarea {...props} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all resize-none" />
//     </div>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
//       <CheckoutContent />
//     </Suspense>
//   );
// }




// app/user/checkout/page.js → PREMIUM REDESIGN 2025 (DYNAMIC CURRENCY FROM PUBLIC API)
// ALL ORIGINAL LOGIC PRESERVED + TABLE BOOKING ADDED

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

// ─── Premium Field Components ────────────────────────────────────────────────

function Field({ label, ...props }) {
  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      <input {...props} className="field-input" />
      <style>{`
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
        }
        .field-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #1a1a1a;
          background: #fafaf9;
          border: 1px solid #e8e6e2;
          border-radius: 14px;
          padding: 14px 18px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .field-input:focus {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .field-input::placeholder { color: #c8c5be; font-weight: 300; }
      `}</style>
    </div>
  );
}

function FieldTextarea({ label, ...props }) {
  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      <textarea {...props} rows={3} className="field-textarea" />
      <style>{`
        .field-textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #1a1a1a;
          background: #fafaf9;
          border: 1px solid #e8e6e2;
          border-radius: 14px;
          padding: 14px 18px;
          outline: none;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .field-textarea:focus {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .field-textarea::placeholder { color: #c8c5be; font-weight: 300; }
      `}</style>
    </div>
  );
}

// ─── Main Checkout Content ───────────────────────────────────────────────────

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
    pincode: "",
    notes: ""
  });
  const [currency, setCurrency] = useState("SAR");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  // mode: "full" | "quick" | "table"
  const [mode, setMode] = useState("full");
  const [tableNumber, setTableNumber] = useState("");
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
    if (!form.name || !form.whatsapp) {
      toast.error("Name and WhatsApp are required");
      return;
    }
    if (mode === "full" && (!form.city || !form.address)) {
      toast.error("Street address and city required for home delivery");
      return;
    }
    if (mode === "quick" && !form.city) {
      toast.error("City is required");
      return;
    }
    if (mode === "table" && !tableNumber.trim()) {
      toast.error("Please enter your table number");
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
    // Table booking label in message
    if (mode === "table") {
      message += `Order Type: Table Booking — Table #${tableNumber}\n`;
    } else if (mode === "quick") {
      message += `Order Type: Quick Home Delivery\n`;
    } else {
      message += `Order Type: Home Delivery\n`;
    }
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
    message += "----------------------------\n";

    if (mode === "table") {
      message += `TABLE BOOKING\nTable Number: ${tableNumber}\n`;
      if (form.notes.trim()) message += `\nNOTES\n${form.notes}\n`;
    } else {
      message += `DELIVERY ADDRESS\n${form.address || "Quick order"}, ${form.city}\n`;
      if (form.neighborhood) message += `Neighborhood: ${form.neighborhood}\n`;
      if (form.building) message += `Building: ${form.building}\n`;
      if (form.floor) message += `Floor: ${form.floor}\n`;
      if (form.apartment) message += `Apartment: ${form.apartment}\n`;
      if (form.pincode) message += `PIN: ${form.pincode}\n`;
      if (form.notes.trim()) message += `\nNOTES\n${form.notes}\n`;
    }
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
          address: mode === "table"
            ? `Table #${tableNumber} (Dine-In)`
            : `${form.address || "Quick order"}, ${form.city}`,
          neighborhood: form.neighborhood,
          building: form.building,
          floor: form.floor,
          apartment: form.apartment,
          pincode: form.pincode,
          notes: mode === "table" ? `Table #${tableNumber}${form.notes ? " — " + form.notes : ""}` : form.notes,
          orderId,
          orderTime,
          orderMode: mode,
          tableNumber: mode === "table" ? tableNumber : null,
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "1.5px solid #e0ddd8", borderTopColor: "#1a1a1a", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: 14, fontWeight: 300, color: "#888", letterSpacing: "0.05em" }}>Preparing your checkout…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const modeOptions = [
    { key: "full",  icon: "🏠", label: "Home Delivery",  sub: "Full address details" },
    { key: "quick", icon: "⚡", label: "Quick Order",    sub: "City only, fast checkout" },
    { key: "table", icon: "🪑", label: "Table Booking",  sub: "Dine-in by table number" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .co-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f4f1;
          padding: 0 0 80px;
        }

        /* ── TOP BAR ── */
        .co-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(245,244,241,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .co-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 300;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: 0.02em;
          padding: 8px 14px;
          border-radius: 999px;
          transition: background 0.2s, color 0.2s;
        }
        .co-back-btn:hover { background: rgba(0,0,0,0.05); color: #1a1a1a; }

        .co-topbar-title {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b0a898;
        }

        /* ── HERO ── */
        .co-hero {
          text-align: center;
          padding: 48px 24px 32px;
        }
        .co-hero-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #fff;
          background: #1a1a1a;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .co-hero-title {
          font-size: clamp(26px, 6vw, 44px);
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0;
        }

        /* ── CONTENT WRAP ── */
        .co-content {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* ── CARD SHELL ── */
        .co-card {
          background: #fff;
          border: 1px solid #eceae5;
          border-radius: 28px;
          padding: 32px;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .co-card { padding: 20px 16px; border-radius: 22px; }
        }

        .co-section-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c0b8ac;
          margin-bottom: 20px;
        }

        /* ── ORDER SUMMARY ── */
        .co-item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px 0;
          border-bottom: 1px solid #f0ede8;
        }
        .co-item-row:last-child { border-bottom: none; }
        .co-item-name {
          font-size: 14px;
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1.4;
        }
        .co-item-qty {
          font-size: 11px;
          color: #b0a898;
          margin-top: 2px;
          font-weight: 300;
        }
        .co-item-price {
          font-size: 15px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          white-space: nowrap;
          margin-left: 16px;
        }

        .co-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eceae5;
        }
        .co-total-label {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #888;
        }
        .co-total-value {
          font-size: 32px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .co-total-currency {
          font-size: 11px;
          font-weight: 400;
          color: #b0a898;
          letter-spacing: 0.12em;
          margin-left: 4px;
        }

        /* ── MODE SELECTOR ── */
        .co-mode-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 4px;
        }

        @media (max-width: 520px) {
          .co-mode-grid { grid-template-columns: 1fr; gap: 8px; }
        }

        .co-mode-btn {
          background: #fafaf9;
          border: 1.5px solid #eceae5;
          border-radius: 18px;
          padding: 18px 14px 16px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .co-mode-btn:hover {
          border-color: #c8c5be;
          background: #fff;
        }
        .co-mode-btn.active {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 1px #1a1a1a;
        }
        .co-mode-icon {
          font-size: 22px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .co-mode-name {
          font-size: 13px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }
        .co-mode-sub {
          font-size: 10px;
          font-weight: 300;
          color: #b0a898;
          line-height: 1.3;
          font-style: italic;
        }

        /* ── FORM GRID ── */
        .co-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .co-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

        @media (max-width: 600px) {
          .co-grid-2 { grid-template-columns: 1fr; }
          .co-grid-4 { grid-template-columns: 1fr 1fr; }
        }

        .co-form-stack { display: flex; flex-direction: column; gap: 14px; }

        /* ── TABLE NUMBER INPUT ── */
        .co-table-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 28px 0 8px;
          text-align: center;
        }
        .co-table-hint {
          font-size: 13px;
          font-weight: 300;
          color: #888;
          line-height: 1.5;
          font-style: italic;
        }
        .co-table-input-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid #eceae5;
          border-radius: 18px;
          overflow: hidden;
          background: #fafaf9;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          max-width: 280px;
        }
        .co-table-input-wrap:focus-within {
          border-color: #1a1a1a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .co-table-prefix {
          padding: 16px 16px 16px 20px;
          font-size: 14px;
          font-weight: 300;
          color: #c0b8ac;
          white-space: nowrap;
          border-right: 1px solid #eceae5;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
        }
        .co-table-number-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          padding: 16px 20px;
          font-size: 28px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          font-family: 'DM Sans', sans-serif;
          text-align: center;
          min-width: 0;
        }
        .co-table-number-input::placeholder { color: #d0cdc6; }

        /* ── PROFILE SAVE ── */
        .co-profile-save {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #fafaf9;
          border: 1px solid #eceae5;
          border-radius: 16px;
          cursor: pointer;
        }
        .co-profile-save input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #1a1a1a;
          cursor: pointer;
          flex-shrink: 0;
        }
        .co-profile-save-label {
          font-size: 13px;
          font-weight: 300;
          color: #555;
          cursor: pointer;
          line-height: 1.4;
        }

        /* ── SUBMIT BUTTON ── */
        .co-submit-btn {
          width: 100%;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 18px;
          padding: 20px 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }
        .co-submit-btn:hover:not(:disabled) { background: #000; }
        .co-submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .co-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── DIVIDER ── */
        .co-divider { height: 1px; background: #f0ede8; margin: 24px 0; }
      `}</style>

      <div className="co-page">
        {/* TOP BAR */}
        <div className="co-topbar">
          <button className="co-back-btn" onClick={() => router.back()}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="co-topbar-title">Checkout</span>
          <div style={{ width: 64 }} />
        </div>

        {/* HERO */}
        <div className="co-hero">
          <div className="co-hero-badge">{isEditMode ? "Resubmit" : "New Order"}</div>
          <h1 className="co-hero-title">
            {isEditMode ? "Update Your Order" : "Complete Your Order"}
          </h1>
        </div>

        <div className="co-content">

          {/* ── ORDER SUMMARY CARD ── */}
          <div className="co-card">
            <p className="co-section-label">Order Summary</p>
            <div>
              {cart.map((item, idx) => (
                <div key={idx} className="co-item-row">
                  <div>
                    <div className="co-item-name">{item.name}</div>
                    <div className="co-item-qty">× {item.quantity || 1}</div>
                    {item.selectedAddons?.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {item.selectedAddons.map((a, ai) => (
                          <div key={ai} style={{ fontSize: 11, color: "#b0a898", fontWeight: 300 }}>+ {a.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="co-item-price">
                    {(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="co-total-row">
              <span className="co-total-label">Total</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span className="co-total-value">{total}</span>
                <span className="co-total-currency">{currency}</span>
              </div>
            </div>
          </div>

          {/* ── ORDER TYPE CARD ── */}
          <div className="co-card">
            <p className="co-section-label">How would you like to order?</p>
            <div className="co-mode-grid">
              {modeOptions.map(opt => (
                <button
                  key={opt.key}
                  className={`co-mode-btn ${mode === opt.key ? "active" : ""}`}
                  onClick={() => setMode(opt.key)}
                >
                  <div className="co-mode-icon">{opt.icon}</div>
                  <div className="co-mode-name">{opt.label}</div>
                  <div className="co-mode-sub">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── DETAILS CARD ── */}
          <div className="co-card">
            <p className="co-section-label">
              {mode === "table" ? "Your Details" : "Delivery Details"}
            </p>

            {/* Common: Name + WhatsApp — always shown */}
            <div className="co-form-stack">
              <div className="co-grid-2">
                <Field label="Full Name *" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" />
                <Field label="WhatsApp Number *" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="966501234567" />
              </div>

              {/* HOME DELIVERY — full mode */}
              {mode === "full" && (
                <>
                  <div className="co-grid-2">
                    <Field label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
                    <Field label="Neighborhood" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} />
                  </div>
                  <FieldTextarea label="Street Address *" value={form.address} onChange={e => updateField("address", e.target.value)} />
                  <div className="co-grid-4">
                    <Field label="Building" value={form.building} onChange={e => updateField("building", e.target.value)} />
                    <Field label="Floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} />
                    <Field label="Apartment" value={form.apartment} onChange={e => updateField("apartment", e.target.value)} />
                    <Field label="Pin Code" value={form.pincode} onChange={e => updateField("pincode", e.target.value)} />
                  </div>
                  <FieldTextarea label="Delivery Notes" value={form.notes} onChange={e => updateField("notes", e.target.value)} />
                </>
              )}

              {/* QUICK ORDER */}
              {mode === "quick" && (
                <>
                  <div className="co-grid-2">
                    <Field label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
                    <Field label="Neighborhood" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} />
                  </div>
                  <FieldTextarea label="Notes (optional)" value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Any delivery notes…" />
                </>
              )}

              {/* TABLE BOOKING */}
              {mode === "table" && (
                <>
                  <div className="co-table-wrap">
                    <p className="co-table-hint">
                      Enter the number shown on your table.<br />Your order will be brought directly to you.
                    </p>
                    <div className="co-table-input-wrap">
                      <span className="co-table-prefix">Table</span>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        placeholder="–"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        className="co-table-number-input"
                      />
                    </div>
                  </div>
                  <FieldTextarea label="Special Requests (optional)" value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Allergies, preferences…" />
                </>
              )}
            </div>
          </div>

          {/* ── SAVE TO PROFILE ── */}
          {session?.user && mode !== "table" && (
            <div className="co-card">
              <label className="co-profile-save" htmlFor="saveToProfile">
                <input
                  type="checkbox"
                  id="saveToProfile"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                />
                <span className="co-profile-save-label">
                  Save delivery details to my profile for next time
                </span>
              </label>
            </div>
          )}

          {/* ── SUBMIT ── */}
          <button className="co-submit-btn" onClick={sendOrder} disabled={saving}>
            {saving ? (
              <>
                <div style={{ width: 16, height: 16, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Processing…
              </>
            ) : (
              <>
                {mode === "table" ? "🪑 Place Table Order" : "Send via WhatsApp →"}
              </>
            )}
          </button>

        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#f5f4f1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 13, fontWeight: 300, color: "#888", letterSpacing: "0.1em" }}>Loading…</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}