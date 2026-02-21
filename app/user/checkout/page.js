// // app/user/checkout/page.js → UPDATED 2025 (DYNAMIC CURRENCY FROM PUBLIC API)

// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import {
//     User, MessageCircle, MapPin, Home, Building2, Loader2, ChevronLeft
// } from "lucide-react";

// export default function CheckoutPage() {
//     const { data: session } = useSession();
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     const [cart, setCart] = useState([]);
//     const [whatsappNumber, setWhatsappNumber] = useState("");
//     const [currency, setCurrency] = useState("SAR"); // ← NEW: dynamic currency
//     const [mode, setMode] = useState("full"); // "full" or "quick"

//     const calculateTotal = () => {
//         return cart.reduce((sum, item) => {
//             const basePrice = parseFloat(item.price || 0) * item.quantity;
//             const addonsPrice = (item.selectedAddons || []).reduce(
//                 (s, a) => s + parseFloat(a.price || 0),
//                 0
//             ) * item.quantity;
//             return sum + basePrice + addonsPrice;
//         }, 0).toFixed(2);
//     };

//     const total = calculateTotal();

//     const [form, setForm] = useState({
//         name: "", whatsapp: "", address: "", building: "", floor: "", apartment: "", neighborhood: "", city: "", notes: ""
//     });

//     useEffect(() => {
//         const savedCart = localStorage.getItem("cart");
//         if (savedCart) {
//             try {
//                 setCart(JSON.parse(savedCart));
//             } catch (e) {
//                 toast.error("Invalid cart");
//                 router.push("/user/menu");
//             }
//         } else {
//             router.push("/user/menu");
//         }

//         const loadDetails = async () => {
//             try {
//                 const res = await fetch("/api/restaurantDetails"); // ← public endpoint (same as footer/cart)
//                 if (res.ok) {
//                     const data = await res.json();
//                     // WhatsApp
//                     const wa = data.whatsapp?.replace(/\D/g, "") || "";
//                     if (wa && wa.length >= 10) setWhatsappNumber(wa);
//                     // Currency
//                     const fetchedCurrency = data.currency || "SAR";
//                     setCurrency(fetchedCurrency);
//                 }
//             } catch (err) {
//                 console.error("Failed to load public settings:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadDetails();

//         if (session?.user) {
//             fetch("/api/user/profile")
//                 .then(r => r.json())
//                 .then(data => {
//                     setForm(prev => ({
//                         ...prev,
//                         name: data.name || session.user.name || "",
//                         whatsapp: data.whatsapp || "",
//                         address: data.address || "",
//                         building: data.building || "",
//                         floor: data.floor || "",
//                         apartment: data.apartment || "",
//                         neighborhood: data.neighborhood || "",
//                         city: data.city || "",
//                         notes: data.notes || "",
//                     }));
//                 })
//                 .catch(() => {})
//                 .finally(() => setLoading(false));
//         } else {
//             setLoading(false);
//         }
//     }, [session, router]);

//     const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

//     const sendOrder = async () => {
//         if (!form.whatsapp || !form.name || !form.city) {
//             toast.error("Name, WhatsApp & City required");
//             return;
//         }

//         if (mode === "full" && !form.address) {
//             toast.error("Full address required in detailed mode");
//             return;
//         }

//         if (!whatsappNumber) {
//             toast.error("Restaurant WhatsApp not available");
//             return;
//         }

//         setSaving(true);

//         const orderId = "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
//         const orderTime = new Date().toLocaleString("en-GB", {
//             timeZone: "Asia/Riyadh",
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true
//         });

//         let message = "";

//         message += "```";
//         message += "NEW ORDER RECEIVED\n";
//         message += "----------------------------\n";
//         message += `Order ID : ${orderId}\n`;
//         message += `Time     : ${orderTime}\n`;
//         message += `Customer : ${form.name}\n`;
//         message += "----------------------------\n";
//         message += "ITEMS\n";
//         message += "----------------------------\n";

//         cart.forEach(item => {
//             const qty = item.quantity;
//             const unitPrice = parseFloat(item.price);
//             const baseTotal = unitPrice * qty;

//             message += `${qty} x ${item.name}\n`;
//             message += `  ${unitPrice.toFixed(2)} ${currency} x ${qty} = ${baseTotal.toFixed(2)}\n`; // ← dynamic

//             let addonsTotal = 0;

//             if (item.selectedAddons && item.selectedAddons.length > 0) {
//                 item.selectedAddons.forEach(addon => {
//                     const addonPrice = parseFloat(addon.price);
//                     addonsTotal += addonPrice;
//                     message += `  + ${addon.name} ${addonPrice.toFixed(2)}\n`;
//                 });
//                 addonsTotal *= qty;
//                 message += `  Add-ons Total = ${addonsTotal.toFixed(2)} ${currency}\n`; // ← dynamic
//             }

//             message += `  ITEM TOTAL = ${(baseTotal + addonsTotal).toFixed(2)} ${currency}\n`; // ← dynamic
//             message += "\n";
//         });

//         message += "----------------------------\n";
//         message += `GRAND TOTAL = ${total} ${currency}\n`; // ← dynamic
//         message += "----------------------------\n\n";

//         message += "DELIVERY ADDRESS\n";
//         message += "----------------------------\n";
//         message += `${form.address || "Quick order - city only"}\n`;
//         if (form.building) message += `Building : ${form.building}\n`;
//         if (form.floor) message += `Floor    : ${form.floor}\n`;
//         if (form.apartment) message += `Apartment: ${form.apartment}\n`;
//         if (form.neighborhood) message += `Area     : ${form.neighborhood}\n`;
//         message += `${form.city}\n\n`;

//         message += `CONTACT : ${form.whatsapp}\n`;

//         if (form.notes.trim()) {
//             message += "\nNOTES\n";
//             message += "----------------------------\n";
//             message += `${form.notes}\n`;
//         }

//         message += "```";

//         const encodedMessage = encodeURIComponent(message);

//         try {
//             await fetch("/api/user/saveOrders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userId: session?.user?.id || null,
//                     customerName: form.name,
//                     customerPhone: form.whatsapp,
//                     items: cart.map(i => ({
//                         name: i.name,
//                         quantity: i.quantity,
//                         price: parseFloat(i.price),
//                         addons: (i.selectedAddons || []).map(a => ({
//                             name: a.name,
//                             price: parseFloat(a.price)
//                         }))
//                     })),
//                     totalAmount: parseFloat(total),
//                     address: `${form.address || "Quick order"}, ${form.city}`,
//                     notes: form.notes,
//                     orderId,
//                     orderTime
//                 }),
//             });
//         } catch (e) {
//             console.log("Save failed, continuing...");
//         }

//         window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
//         toast.success("Order sent! We'll contact you soon ❤️");
//         localStorage.removeItem("cart");
//         router.push("/user/menu");
//     };

//     if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={48} /></div>;

//     return (
//         <div className="min-h-screen bg-white py-12 px-6">
//             <div className="max-w-4xl mx-auto">

//                 <button
//                     onClick={() => router.back()}
//                     className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-lg"
//                 >
//                     <ChevronLeft size={24} /> Back
//                 </button>

//                 <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12">

//                     <div className="text-center mb-10">
//                         <h1 className="text-4xl lg:text-5xl font-light text-gray-900">Complete Your Order</h1>
//                         <p className="text-xl text-gray-600 mt-4">We deliver anywhere in Saudi Arabia & GCC</p>
//                     </div>

//                     {/* MODE SWITCHER */}
//                     <div className="flex justify-center gap-4 mb-10">
//                         <button
//                             onClick={() => setMode("full")}
//                             className={`px-8 py-4 rounded-full font-medium transition-all ${
//                                 mode === "full"
//                                     ? "bg-black text-white shadow-xl"
//                                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                             }`}
//                         >
//                             Full Delivery Details
//                         </button>
//                         <button
//                             onClick={() => setMode("quick")}
//                             className={`px-8 py-4 rounded-full font-medium transition-all ${
//                                 mode === "quick"
//                                     ? "bg-black text-white shadow-xl"
//                                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                             }`}
//                         >
//                             Quick Order
//                         </button>
//                     </div>

//                     {/* Cart Summary with Addons */}
//                     <div className="bg-gray-50 rounded-2xl p-6 mb-10">
//                         <h2 className="text-2xl font-bold mb-6">Your Items ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
//                         <div className="space-y-6">
//                             {cart.map(item => {
//                                 const baseTotal = parseFloat(item.price) * item.quantity;
//                                 const addonsTotal = (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0) * item.quantity;
//                                 const itemTotal = baseTotal + addonsTotal;

//                                 return (
//                                     <div key={item._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
//                                         <div className="flex justify-between items-start mb-3">
//                                             <div>
//                                                 <p className="font-bold text-lg">{item.quantity}× {item.name}</p>
//                                                 <p className="text-gray-600">{item.price} {currency} each</p> {/* ← dynamic */}
//                                             </div>
//                                             <p className="font-bold text-lg">{baseTotal.toFixed(2)} {currency}</p> {/* ← dynamic */}
//                                         </div>

//                                         {item.selectedAddons && item.selectedAddons.length > 0 && (
//                                             <div className="ml-6 mt-3 space-y-1">
//                                                 <p className="text-sm font-medium text-gray-700">Addons:</p>
//                                                 {item.selectedAddons.map((addon, i) => (
//                                                     <div key={i} className="flex justify-between text-sm">
//                                                         <span>• {addon.name}</span>
//                                                         <span>+{addon.price} {currency}</span> {/* ← dynamic */}
//                                                     </div>
//                                                 ))}
//                                                 <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-300">
//                                                     <span>Addons Total</span>
//                                                     <span>+{addonsTotal.toFixed(2)} {currency}</span> {/* ← dynamic */}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div className="flex justify-end mt-3">
//                                             <p className="font-bold text-orange-600">Item Total: {itemTotal.toFixed(2)} {currency}</p> {/* ← dynamic */}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         <div className="text-3xl font-bold mt-8 text-right text-orange-600">
//                             Grand Total: {total} {currency} {/* ← dynamic */}
//                         </div>
//                     </div>

//                     {/* FORM — SWITCHES BASED ON MODE */}
//                     <div className="space-y-8">
//                         {/* Always required fields */}
//                         <div className="grid md:grid-cols-2 gap-6">
//                             <Field icon={<User />} label="Full Name *" value={form.name} onChange={e => updateField("name", e.target.value)} />
//                             <Field icon={<MessageCircle />} label="WhatsApp Number *" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="966501234567" />
//                             <Field icon={<MapPin />} label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
//                         </div>

//                         {/* Full mode — detailed address */}
//                         {mode === "full" && (
//                             <div className="grid md:grid-cols-2 gap-6">
//                                 <FieldTextarea icon={<MapPin />} label="Street Address *" value={form.address} onChange={e => updateField("address", e.target.value)} />
//                                 <Field icon={<Building2 />} label="Building / Villa" value={form.building} onChange={e => updateField("building", e.target.value)} />
//                                 <Field label="Floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} />
//                                 <Field label="Apartment No." value={form.apartment} onChange={e => updateField("apartment", e.target.value)} />
//                                 <Field icon={<Home />} label="Neighborhood / Area" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} className="md:col-span-2" />
//                                 <FieldTextarea label="Extra Notes (Gate code, etc.)" value={form.notes} onChange={e => updateField("notes", e.target.value)} className="md:col-span-2" />
//                             </div>
//                         )}

//                         {/* Quick mode — only minimal info */}
//                         {mode === "quick" && (
//                             <div className="text-center text-gray-600 py-6">
//                                 <p className="text-lg">Quick order mode: We will contact you via WhatsApp for exact delivery details.</p>
//                                 <p className="text-sm mt-2">Only name, WhatsApp, and city required.</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <div className="mt-12 text-center">
//                         <button
//                             onClick={sendOrder}
//                             disabled={saving}
//                             className="inline-flex items-center gap-4 px-16 py-6 bg-gray-900 text-white text-2xl font-bold rounded-3xl hover:bg-gray-800 hover:shadow-2xl transition-all shadow-xl disabled:opacity-70"
//                         >
//                             {saving ? <Loader2 className="animate-spin" size={32} /> : "Send Order via WhatsApp"}
//                         </button>
//                     </div>

//                     {!session && (
//                         <p className="text-center mt-8 text-gray-600">
//                             Want to save this address?{" "}
//                             <Link href="/login" className="text-gray-900 font-bold underline">Login</Link> or{" "}
//                             <Link href="/register" className="text-gray-900 font-bold underline">Register</Link>
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Reusable fields (unchanged)
// function Field({ icon, label, className, ...props }) {
//     return (
//         <div className={className}>
//             <label className="flex items-center gap-3 mb-3 text-lg font-semibold text-gray-800">
//                 {icon} {label}
//             </label>
//             <input
//                 {...props}
//                 className="w-full px-6 py-5 border border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition"
//             />
//         </div>
//     );
// }

// function FieldTextarea({ icon, label, className, ...props }) {
//     return (
//         <div className={className}>
//             <label className="flex items-center gap-3 mb-3 text-lg font-semibold text-gray-800">
//                 {icon && icon} {label}
//             </label>
//             <textarea
//                 {...props}
//                 rows={3}
//                 className="w-full px-6 py-5 border border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition resize-none"
//             />
//         </div>
//     );
// }





































// app/user/checkout/page.js → MODERN REDESIGN 2025

// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export default function CheckoutPage() {
//     const { data: session } = useSession();
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     const [cart, setCart] = useState([]);
//     const [whatsappNumber, setWhatsappNumber] = useState("");
//     const [currency, setCurrency] = useState("SAR");
//     const [mode, setMode] = useState("full");

//     const calculateTotal = () => {
//         return cart.reduce((sum, item) => {
//             const basePrice = parseFloat(item.price || 0) * item.quantity;
//             const addonsPrice = (item.selectedAddons || []).reduce(
//                 (s, a) => s + parseFloat(a.price || 0),
//                 0
//             ) * item.quantity;
//             return sum + basePrice + addonsPrice;
//         }, 0).toFixed(2);
//     };

//     const total = calculateTotal();

//     const [form, setForm] = useState({
//         name: "", whatsapp: "", address: "", building: "", floor: "", apartment: "", neighborhood: "", city: "", notes: ""
//     });

//     useEffect(() => {
//         const savedCart = localStorage.getItem("cart");
//         if (savedCart) {
//             try {
//                 setCart(JSON.parse(savedCart));
//             } catch (e) {
//                 toast.error("Invalid cart", {
//                     style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff" }
//                 });
//                 router.push("/user/menu");
//             }
//         } else {
//             router.push("/user/menu");
//         }

//         const loadDetails = async () => {
//             try {
//                 const res = await fetch("/api/restaurantDetails");
//                 if (res.ok) {
//                     const data = await res.json();
//                     const wa = data.whatsapp?.replace(/\D/g, "") || "";
//                     if (wa && wa.length >= 10) setWhatsappNumber(wa);
//                     const fetchedCurrency = data.currency || "SAR";
//                     setCurrency(fetchedCurrency);
//                 }
//             } catch (err) {
//                 console.error("Failed to load settings:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadDetails();

//         if (session?.user) {
//             fetch("/api/user/profile")
//                 .then(r => r.json())
//                 .then(data => {
//                     setForm(prev => ({
//                         ...prev,
//                         name: data.name || session.user.name || "",
//                         whatsapp: data.whatsapp || "",
//                         address: data.address || "",
//                         building: data.building || "",
//                         floor: data.floor || "",
//                         apartment: data.apartment || "",
//                         neighborhood: data.neighborhood || "",
//                         city: data.city || "",
//                         notes: data.notes || "",
//                     }));
//                 })
//                 .catch(() => { })
//                 .finally(() => setLoading(false));
//         } else {
//             setLoading(false);
//         }
//     }, [session, router]);

//     const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

//     const sendOrder = async () => {
//         if (!form.whatsapp || !form.name || !form.city) {
//             toast.error("Name, WhatsApp & City required", {
//                 style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff", padding: "16px 24px", fontSize: "15px", fontWeight: "500" }
//             });
//             return;
//         }

//         if (mode === "full" && !form.address) {
//             toast.error("Full address required in detailed mode", {
//                 style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff", padding: "16px 24px", fontSize: "15px", fontWeight: "500" }
//             });
//             return;
//         }

//         if (!whatsappNumber) {
//             toast.error("Restaurant WhatsApp not available", {
//                 style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff", padding: "16px 24px", fontSize: "15px", fontWeight: "500" }
//             });
//             return;
//         }

//         setSaving(true);

//         const orderId = "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
//         const orderTime = new Date().toLocaleString("en-GB", {
//             timeZone: "Asia/Riyadh",
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true
//         });

//         let message = "```\nNEW ORDER RECEIVED\n----------------------------\n";
//         message += `Order ID : ${orderId}\nTime     : ${orderTime}\nCustomer : ${form.name}\n----------------------------\nITEMS\n----------------------------\n`;

//         cart.forEach(item => {
//             const qty = item.quantity;
//             const unitPrice = parseFloat(item.price);
//             const baseTotal = unitPrice * qty;

//             message += `${qty} x ${item.name}\n  ${unitPrice.toFixed(2)} ${currency} x ${qty} = ${baseTotal.toFixed(2)}\n`;

//             let addonsTotal = 0;
//             if (item.selectedAddons && item.selectedAddons.length > 0) {
//                 item.selectedAddons.forEach(addon => {
//                     const addonPrice = parseFloat(addon.price);
//                     addonsTotal += addonPrice;
//                     message += `  + ${addon.name} ${addonPrice.toFixed(2)}\n`;
//                 });
//                 addonsTotal *= qty;
//                 message += `  Add-ons Total = ${addonsTotal.toFixed(2)} ${currency}\n`;
//             }

//             message += `  ITEM TOTAL = ${(baseTotal + addonsTotal).toFixed(2)} ${currency}\n\n`;
//         });

//         message += `----------------------------\nGRAND TOTAL = ${total} ${currency}\n----------------------------\n\n`;
//         message += `DELIVERY ADDRESS\n----------------------------\n${form.address || "Quick order - city only"}\n`;
//         if (form.building) message += `Building : ${form.building}\n`;
//         if (form.floor) message += `Floor    : ${form.floor}\n`;
//         if (form.apartment) message += `Apartment: ${form.apartment}\n`;
//         if (form.neighborhood) message += `Area     : ${form.neighborhood}\n`;
//         message += `${form.city}\n\nCONTACT : ${form.whatsapp}\n`;
//         if (form.notes.trim()) message += `\nNOTES\n----------------------------\n${form.notes}\n`;
//         message += "```";

//         const encodedMessage = encodeURIComponent(message);

//         try {
//             await fetch("/api/user/saveOrders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userId: session?.user?.id || null,
//                     customerName: form.name,
//                     customerPhone: form.whatsapp,
//                     items: cart.map(i => ({
//                         name: i.name,
//                         quantity: i.quantity,
//                         price: parseFloat(i.price),
//                         addons: (i.selectedAddons || []).map(a => ({ name: a.name, price: parseFloat(a.price) }))
//                     })),
//                     totalAmount: parseFloat(total),
//                     address: `${form.address || "Quick order"}, ${form.city}`,
//                     notes: form.notes,
//                     orderId,
//                     orderTime
//                 }),
//             });
//         } catch (e) {
//             console.log("Save failed, continuing...");
//         }

//         window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
//         toast.success("Order sent! We'll contact you soon", {
//             style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff", padding: "16px 24px", fontSize: "15px", fontWeight: "500" }
//         });
//         localStorage.removeItem("cart");
//         router.push("/user/menu");
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-base font-light text-gray-600">Loading checkout...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

//                 {/* Back Button */}
//                 <button
//                     onClick={() => router.back()}
//                     className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 md:mb-8 text-sm font-medium transition-colors"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                     Back
//                 </button>

//                 {/* Header */}
//                 <div className="text-center mb-8 md:mb-10">
//                     <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 tracking-widest mb-3 rounded-full">
//                         CHECKOUT
//                     </div>
//                     <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
//                         Complete Your Order
//                     </h1>
//                     <p className="text-sm md:text-base text-gray-600 font-light">
//                         We deliver anywhere in Saudi Arabia & GCC
//                     </p>
//                 </div>

//                 {/* Main Card */}
//                 <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 md:p-8">

//                     {/* Order Summary */}
//                     <div className="bg-gray-50 rounded-xl p-5 md:p-6 mb-8 md:mb-10">
//                         <div className="flex items-center justify-between mb-5">
//                             <h2 className="text-lg md:text-xl font-semibold text-gray-900">
//                                 Order Summary
//                             </h2>
//                             <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
//                                 {cart.reduce((a, b) => a + b.quantity, 0)} Items
//                             </span>
//                         </div>

//                         <div className="space-y-4">
//                             {cart.map(item => {
//                                 const baseTotal = parseFloat(item.price) * item.quantity;
//                                 const addonsTotal = (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0) * item.quantity;
//                                 const itemTotal = baseTotal + addonsTotal;

//                                 return (
//                                     <div key={item._id} className="bg-white rounded-lg p-4 border border-gray-100">
//                                         <div className="flex justify-between items-start mb-2">
//                                             <div>
//                                                 <p className="font-semibold text-sm md:text-base text-gray-900">
//                                                     {item.quantity}× {item.name}
//                                                 </p>
//                                                 <p className="text-xs md:text-sm text-gray-500 font-light mt-0.5">
//                                                     {item.price} {currency} each
//                                                 </p>
//                                             </div>
//                                             <p className="font-semibold text-sm md:text-base text-gray-900">
//                                                 {baseTotal.toFixed(2)}
//                                             </p>
//                                         </div>

//                                         {item.selectedAddons && item.selectedAddons.length > 0 && (
//                                             <div className="ml-4 mt-2 pt-2 border-t border-gray-100 space-y-1">
//                                                 <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                     Add-ons
//                                                 </p>
//                                                 {item.selectedAddons.map((addon, i) => (
//                                                     <div key={i} className="flex justify-between text-xs md:text-sm text-gray-600">
//                                                         <span>+ {addon.name}</span>
//                                                         <span className="font-medium">+{addon.price}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         <div className="mt-5 pt-5 border-t border-gray-200">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-base md:text-lg font-semibold text-gray-900">Total</span>
//                                 <span className="text-xl md:text-2xl font-bold text-gray-900">
//                                     {total} {currency}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Mode Switcher */}
//                     <div className="flex justify-center gap-3 mb-8 md:mb-10">
//                         <button
//                             onClick={() => setMode("full")}
//                             className={`px-6 md:px-8 py-3 font-medium text-sm md:text-base tracking-wide rounded-full transition-all duration-300 ${mode === "full"
//                                 ? "bg-gray-900 text-white"
//                                 : "bg-gray-50 text-gray-700 hover:bg-gray-100"
//                                 }`}
//                         >
//                             Full Details
//                         </button>
//                         <button
//                             onClick={() => setMode("quick")}
//                             className={`px-6 md:px-8 py-3 font-medium text-sm md:text-base tracking-wide rounded-full transition-all duration-300 ${mode === "quick"
//                                 ? "bg-gray-900 text-white"
//                                 : "bg-gray-50 text-gray-700 hover:bg-gray-100"
//                                 }`}
//                         >
//                             Quick Order
//                         </button>
//                     </div>
//                     {/* Form */}
//                     <div className="space-y-5 md:space-y-6">
//                         {/* Required Fields */}
//                         <div className="grid md:grid-cols-2 gap-4 md:gap-5">
//                             <Field
//                                 label="Full Name *"
//                                 value={form.name}
//                                 onChange={e => updateField("name", e.target.value)}
//                             />
//                             <Field
//                                 label="WhatsApp Number *"
//                                 value={form.whatsapp}
//                                 onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))}
//                                 placeholder="966501234567"
//                             />
//                         </div>

//                         <Field
//                             label="City *"
//                             value={form.city}
//                             onChange={e => updateField("city", e.target.value)}
//                         />

//                         {/* Full Mode */}
//                         {mode === "full" && (
//                             <>
//                                 <FieldTextarea
//                                     label="Street Address *"
//                                     value={form.address}
//                                     onChange={e => updateField("address", e.target.value)}
//                                 />

//                                 <div className="grid md:grid-cols-2 gap-4 md:gap-5">
//                                     <Field
//                                         label="Building / Villa"
//                                         value={form.building}
//                                         onChange={e => updateField("building", e.target.value)}
//                                     />
//                                     <Field
//                                         label="Floor"
//                                         value={form.floor}
//                                         onChange={e => updateField("floor", e.target.value)}
//                                     />
//                                     <Field
//                                         label="Apartment No."
//                                         value={form.apartment}
//                                         onChange={e => updateField("apartment", e.target.value)}
//                                     />
//                                     <Field
//                                         label="Neighborhood"
//                                         value={form.neighborhood}
//                                         onChange={e => updateField("neighborhood", e.target.value)}
//                                     />
//                                 </div>

//                                 <FieldTextarea
//                                     label="Delivery Notes"
//                                     value={form.notes}
//                                     onChange={e => updateField("notes", e.target.value)}
//                                     placeholder="Gate code, special instructions, etc."
//                                 />
//                             </>
//                         )}

//                         {/* Quick Mode */}
//                         {mode === "quick" && (
//                             <div className="text-center py-6 px-4 bg-gray-50 rounded-xl">
//                                 <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
//                                     Quick order mode
//                                 </p>
//                                 <p className="text-xs md:text-sm text-gray-600 font-light">
//                                     We'll contact you via WhatsApp for delivery details
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <div className="mt-8 md:mt-10">
//                         <button
//                             onClick={sendOrder}
//                             disabled={saving}
//                             className="w-full px-8 py-4 md:py-5 bg-gray-900 text-white text-sm md:text-base font-semibold tracking-wide hover:bg-gray-800 transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {saving ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     Processing...
//                                 </span>
//                             ) : (
//                                 "Send Order via WhatsApp"
//                             )}
//                         </button>
//                     </div>

//                     {/* Login Link */}
//                     {!session && (
//                         <p className="text-center mt-6 text-xs md:text-sm text-gray-600 font-light">
//                             Want to save this address?{" "}
//                             <Link href="/login" className="text-gray-900 font-medium hover:underline">
//                                 Login
//                             </Link>
//                             {" "}or{" "}
//                             <Link href="/register" className="text-gray-900 font-medium hover:underline">
//                                 Register
//                             </Link>
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Field Components
// function Field({ label, ...props }) {
//     return (
//         <div>
//             <label className="block mb-2 text-xs md:text-sm font-semibold text-gray-900">
//                 {label}
//             </label>
//             <input
//                 {...props}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
//             />
//         </div>
//     );
// }

// function FieldTextarea({ label, ...props }) {
//     return (
//         <div>
//             <label className="block mb-2 text-xs md:text-sm font-semibold text-gray-900">
//                 {label}
//             </label>
//             <textarea
//                 {...props}
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none"
//             />
//         </div>
//     );
// }



//////
"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // optional: disable cache if needed

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { data: session } = useSession();
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
    notes: ""
  });
  const [currency, setCurrency] = useState("SAR");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mode, setMode] = useState("full");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load restaurant settings (currency + whatsapp) — always first
        const resDetails = await fetch("/api/restaurantDetails");
        if (resDetails.ok) {
          const data = await resDetails.json();
          setCurrency(data.currency || "SAR");
          const wa = data.whatsapp?.replace(/\D/g, "") || "";
          if (wa && wa.length >= 10) setWhatsappNumber(wa);
        } else {
          console.warn("Restaurant details not loaded");
        }

        // 2. Load cart or order (edit/normal)
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

            // Pre-fill from DB (edit mode)
            setForm({
              name: order.customerName || session?.user?.name || "",
              whatsapp: order.whatsapp || order.phone || "",
              address: order.deliveryAddress || "",
              city: order.city || "",
              notes: order.notes || "",
              building: order.building || "",
              floor: order.floor || "",
              apartment: order.apartment || "",
              neighborhood: order.neighborhood || ""
            });
          } else {
            toast.error("Order not found");
            router.push("/user/cart");
            return;
          }
        } else {
          // Normal mode: local cart
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              setCart(parsed);
            } catch (e) {
              toast.error("Invalid cart data");
              router.push("/user/cart");
              return;
            }
          } else {
            router.push("/user/cart");
            return;
          }
        }

        // 3. Load user profile if logged in — ALWAYS run this (the fix!)
        if (session?.user) {
          try {
            const resProfile = await fetch("/api/user/profile");
            if (resProfile.ok) {
              const profile = await resProfile.json();
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
                notes: profile.notes || prev.notes || ""
              }));
            } else {
              console.warn("Profile fetch failed:", resProfile.status);
            }
          } catch (err) {
            console.error("Profile fetch error:", err);
            // Non-blocking — don't stop checkout
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
      const base = parseFloat(item.price || 0) * (item.quantity || 1);
      const addons = (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0) * (item.quantity || 1);
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

    const orderId = isEditMode ? editOrderId : "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    const orderTime = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Riyadh",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
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
    if (form.building) message += `Building: ${form.building}\n`;
    if (form.notes.trim()) message += `\nNOTES\n${form.notes}\n`;
    message += "```";

    const encoded = encodeURIComponent(message);

    try {
      await fetch("/api/user/saveOrders", {
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
            addons: i.addons || [],
            selectedAddons: i.selectedAddons || []
          })),
          totalAmount: parseFloat(total),
          address: `${form.address || "Quick order"}, ${form.city}`,
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
          body: JSON.stringify({
            orderId: editOrderId,
            status: "confirmed"
          })
        });
      }
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Failed to save order – but WhatsApp will still open");
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
    toast.success(isEditMode ? "Order resubmitted & confirmed!" : "Order sent!");
    localStorage.removeItem("cart");
    router.push("/user/menu");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-light text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 md:mb-8 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 tracking-widest mb-3 rounded-full">
            CHECKOUT
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
            {isEditMode ? "Resubmit Order" : "Complete Your Order"}
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-light">
            We deliver anywhere in Saudi Arabia & GCC
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 md:p-8">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-5 md:p-6 mb-8 md:mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
              <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                {cart.reduce((a, b) => a + (b.quantity || 1), 0)} Items
              </span>
            </div>

            <div className="space-y-4">
              {cart.map(item => {
                const qty = item.quantity || 1;
                const baseTotal = parseFloat(item.price || 0) * qty;
                const addonsTotal = (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0) * qty;
                const itemTotal = baseTotal + addonsTotal;

                return (
                  <div key={item._id} className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm md:text-base text-gray-900">
                          {qty}× {item.name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 font-light mt-0.5">
                          {item.price} {currency} each
                        </p>
                      </div>
                      <p className="font-semibold text-sm md:text-base text-gray-900">
                        {itemTotal.toFixed(2)}
                      </p>
                    </div>

                    {item.selectedAddons?.length > 0 && (
                      <div className="ml-4 mt-2 pt-2 border-t border-gray-100 space-y-1">
                        <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Add-ons
                        </p>
                        {item.selectedAddons.map((addon, i) => (
                          <div key={i} className="flex justify-between text-xs md:text-sm text-gray-600">
                            <span>+ {addon.name}</span>
                            <span className="font-medium">+{addon.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  {total} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-3 mb-8 md:mb-10">
            <button
              onClick={() => setMode("full")}
              className={`px-6 md:px-8 py-3 font-medium text-sm md:text-base tracking-wide rounded-full transition-all duration-300 ${
                mode === "full" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Full Details
            </button>
            <button
              onClick={() => setMode("quick")}
              className={`px-6 md:px-8 py-3 font-medium text-sm md:text-base tracking-wide rounded-full transition-all duration-300 ${
                mode === "quick" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Quick Order
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5 md:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              <Field
                label="Full Name *"
                value={form.name}
                onChange={e => updateField("name", e.target.value)}
              />
              <Field
                label="WhatsApp Number *"
                value={form.whatsapp}
                onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))}
                placeholder="966501234567"
              />
            </div>

            <Field
              label="City *"
              value={form.city}
              onChange={e => updateField("city", e.target.value)}
            />

            {mode === "full" && (
              <>
                <FieldTextarea
                  label="Street Address *"
                  value={form.address}
                  onChange={e => updateField("address", e.target.value)}
                />

                <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                  <Field
                    label="Building / Villa"
                    value={form.building}
                    onChange={e => updateField("building", e.target.value)}
                  />
                  <Field
                    label="Floor"
                    value={form.floor}
                    onChange={e => updateField("floor", e.target.value)}
                  />
                  <Field
                    label="Apartment No."
                    value={form.apartment}
                    onChange={e => updateField("apartment", e.target.value)}
                  />
                  <Field
                    label="Neighborhood"
                    value={form.neighborhood}
                    onChange={e => updateField("neighborhood", e.target.value)}
                  />
                </div>

                <FieldTextarea
                  label="Delivery Notes"
                  value={form.notes}
                  onChange={e => updateField("notes", e.target.value)}
                  placeholder="Gate code, special instructions, etc."
                />
              </>
            )}

            {mode === "quick" && (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-xl">
                <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
                  Quick order mode
                </p>
                <p className="text-xs md:text-sm text-gray-600 font-light">
                  We'll contact you via WhatsApp for delivery details
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 md:mt-10">
            <button
              onClick={sendOrder}
              disabled={saving}
              className="w-full px-8 py-4 md:py-5 bg-gray-900 text-white text-sm md:text-base font-semibold tracking-wide hover:bg-gray-800 transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "Send Order via WhatsApp"
              )}
            </button>
          </div>

          {!session && (
            <p className="text-center mt-6 text-xs md:text-sm text-gray-600 font-light">
              Want to save this address?{" "}
              <Link href="/login" className="text-gray-900 font-medium hover:underline">
                Login
              </Link>
              {" "}or{" "}
              <Link href="/register" className="text-gray-900 font-medium hover:underline">
                Register
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Field Components (unchanged)
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-xs md:text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
      />
    </div>
  );
}

function FieldTextarea({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-xs md:text-sm font-semibold text-gray-900">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm md:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none"
      />
    </div>
  );
}