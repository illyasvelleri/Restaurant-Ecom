// app/user/checkout/page.js → FINAL 2025 (ADDONS + ORDER ID/TIME SAVED)

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    User, MessageCircle, MapPin, Home, Building2, Loader2, ChevronLeft
} from "lucide-react";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [cart, setCart] = useState([]);
    const [whatsappNumber, setWhatsappNumber] = useState("");

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            const basePrice = parseFloat(item.price || 0) * item.quantity;
            const addonsPrice = (item.selectedAddons || []).reduce(
                (s, a) => s + parseFloat(a.price || 0),
                0
            ) * item.quantity;
            return sum + basePrice + addonsPrice;
        }, 0).toFixed(2);
    };

    const total = calculateTotal();

    const [form, setForm] = useState({
        name: "", whatsapp: "", address: "", building: "", floor: "", apartment: "", neighborhood: "", city: "", notes: ""
    });

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                toast.error("Invalid cart");
                router.push("/user/menu");
            }
        } else {
            router.push("/user/menu");
        }

        const loadDetails = async () => {
            try {
                const res = await fetch("/api/restaurantDetails");
                if (res.ok) {
                    const data = await res.json();
                    const wa = data.restaurant?.whatsapp?.replace(/\D/g, "") || "";
                    if (wa && wa.length >= 10) setWhatsappNumber(wa);
                }
            } catch (err) { }
        };
        loadDetails();

        if (session?.user) {
            fetch("/api/user/profile")
                .then(r => r.json())
                .then(data => {
                    setForm(prev => ({
                        ...prev,
                        name: data.name || session.user.name || "",
                        whatsapp: data.whatsapp || "",
                        address: data.address || "",
                        building: data.building || "",
                        floor: data.floor || "",
                        apartment: data.apartment || "",
                        neighborhood: data.neighborhood || "",
                        city: data.city || "",
                        notes: data.notes || "",
                    }));
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session, router]);

    const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const sendOrder = async () => {
        if (!form.whatsapp || !form.name || !form.address) {
            toast.error("Name, WhatsApp & address required");
            return;
        }

        if (!whatsappNumber) {
            toast.error("Restaurant WhatsApp not available");
            return;
        }

        setSaving(true);

        // Generate Order ID and Time (IST)
        const orderId = "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");

        const orderTime = new Date().toLocaleString("en-GB", {
            timeZone: "Asia/Riyadh",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });


        let message = "";

        // Header
        message += "*NEW ORDER RECEIVED*\n\n";
        message += `*Order ID:* ${orderId}\n`;
        message += `*Time:* ${orderTime}\n`;
        message += `*Customer:* _${form.name}_\n`;
        message += "--------------------------------\n";

        // Order details
        message += "*ORDER DETAILS*\n";
        message += "--------------------------------\n";

        cart.forEach(item => {
            const qty = item.quantity;
            const unitPrice = parseFloat(item.price);
            const baseTotal = unitPrice * qty;

            message += `*${qty} × ${item.name}*\n`;
            message += `_Price:_ ${unitPrice.toFixed(2)} SAR × ${qty}\n`;

            let addonsTotal = 0;

            if (item.selectedAddons && item.selectedAddons.length > 0) {
                message += "*Add-ons:*\n";
                item.selectedAddons.forEach(addon => {
                    const addonPrice = parseFloat(addon.price);
                    addonsTotal += addonPrice;
                    message += `- _${addon.name}_ (+${addonPrice.toFixed(2)} SAR)\n`;
                });
                addonsTotal *= qty;
                message += `*_Add-ons Total:_* +${addonsTotal.toFixed(2)} SAR\n`;
            }

            const itemTotal = baseTotal + addonsTotal;
            message += `*Item Total:* ${itemTotal.toFixed(2)} SAR\n\n`;
        });

        // Grand total
        message += "--------------------------------\n";
        message += `*GRAND TOTAL:* ${total} SAR\n`;
        message += "--------------------------------\n\n";

        // Address
        message += "*DELIVERY ADDRESS*\n";
        message += `_${form.address}_\n`;

        if (form.building) message += `_Building:_ ${form.building}\n`;
        if (form.floor) message += `_Floor:_ ${form.floor}\n`;
        if (form.apartment) message += `_Apartment:_ ${form.apartment}\n`;
        if (form.neighborhood) message += `_Area:_ ${form.neighborhood}\n`;

        message += `_${form.city}_\n\n`;

        // Contact
        message += `*Contact:* _${form.whatsapp}_\n`;

        // Notes
        if (form.notes.trim()) {
            message += "\n*Notes:*\n";
            message += `_${form.notes}_\n`;
        }

        // Encode ONCE, correctly
        const encodedMessage = encodeURIComponent(message);


        // Save order with Order ID and Time
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
                        quantity: i.quantity,
                        price: parseFloat(i.price),
                        addons: (i.selectedAddons || []).map(a => ({
                            name: a.name,
                            price: parseFloat(a.price)
                        }))
                    })),
                    totalAmount: parseFloat(total),
                    address: `${form.address}, ${form.city}`,
                    notes: form.notes,
                    orderId: orderId,           // ← NEW
                    orderTime: orderTime        // ← NEW
                }),
            });
        } catch (e) {
            console.log("Save failed, continuing...");
        }

        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
        toast.success("Order sent! We'll contact you soon ❤️");
        localStorage.removeItem("cart");
        router.push("/user/menu");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={48} /></div>;

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-lg"
                >
                    <ChevronLeft size={24} /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl lg:text-5xl font-light text-gray-900">Complete Your Order</h1>
                        <p className="text-xl text-gray-600 mt-4">We deliver anywhere in Saudi Arabia & GCC</p>
                    </div>

                    {/* Cart Summary with Addons */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-10">
                        <h2 className="text-2xl font-bold mb-6">Your Items ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
                        <div className="space-y-6">
                            {cart.map(item => {
                                const baseTotal = parseFloat(item.price) * item.quantity;
                                const addonsTotal = (item.selectedAddons || []).reduce((s, a) => s + parseFloat(a.price || 0), 0) * item.quantity;
                                const itemTotal = baseTotal + addonsTotal;

                                return (
                                    <div key={item._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-bold text-lg">{item.quantity}× {item.name}</p>
                                                <p className="text-gray-600">{item.price} SAR each</p>
                                            </div>
                                            <p className="font-bold text-lg">{baseTotal.toFixed(2)} SAR</p>
                                        </div>

                                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                                            <div className="ml-6 mt-3 space-y-1">
                                                <p className="text-sm font-medium text-gray-700">Addons:</p>
                                                {item.selectedAddons.map((addon, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span>• {addon.name}</span>
                                                        <span>+{addon.price} SAR</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-300">
                                                    <span>Addons Total</span>
                                                    <span>+{addonsTotal.toFixed(2)} SAR</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end mt-3">
                                            <p className="font-bold text-orange-600">Item Total: {itemTotal.toFixed(2)} SAR</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-3xl font-bold mt-8 text-right text-orange-600">
                            Grand Total: {total} SAR
                        </div>
                    </div>

                    {/* Delivery Form */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <Field icon={<User />} label="Full Name *" value={form.name} onChange={e => updateField("name", e.target.value)} />
                        <Field icon={<MessageCircle />} label="WhatsApp Number *" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="966501234567" />
                        <Field icon={<MapPin />} label="City *" value={form.city} onChange={e => updateField("city", e.target.value)} />
                        <Field icon={<Home />} label="Neighborhood / Area *" value={form.neighborhood} onChange={e => updateField("neighborhood", e.target.value)} className="md:col-span-2" />
                        <FieldTextarea icon={<MapPin />} label="Street Address *" value={form.address} onChange={e => updateField("address", e.target.value)} className="md:col-span-2" />
                        <Field icon={<Building2 />} label="Building / Villa" value={form.building} onChange={e => updateField("building", e.target.value)} />
                        <Field label="Floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} />
                        <Field label="Apartment No." value={form.apartment} onChange={e => updateField("apartment", e.target.value)} />
                        <FieldTextarea label="Extra Notes (Gate code, etc.)" value={form.notes} onChange={e => updateField("notes", e.target.value)} className="md:col-span-2" />
                    </div>

                    {/* Submit */}
                    <div className="mt-12 text-center">
                        <button
                            onClick={sendOrder}
                            disabled={saving}
                            className="inline-flex items-center gap-4 px-16 py-6 bg-gray-900 text-white text-2xl font-bold rounded-3xl hover:bg-gray-800 hover:shadow-2xl transition-all shadow-xl disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="animate-spin" size={32} /> : "Send Order via WhatsApp"}
                        </button>
                    </div>

                    {!session && (
                        <p className="text-center mt-8 text-gray-600">
                            Want to save this address?{" "}
                            <Link href="/login" className="text-gray-900 font-bold underline">Login</Link> or{" "}
                            <Link href="/register" className="text-gray-900 font-bold underline">Register</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable fields
function Field({ icon, label, className, ...props }) {
    return (
        <div className={className}>
            <label className="flex items-center gap-3 mb-3 text-lg font-semibold text-gray-800">
                {icon} {label}
            </label>
            <input
                {...props}
                className="w-full px-6 py-5 border border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition"
            />
        </div>
    );
}

function FieldTextarea({ icon, label, className, ...props }) {
    return (
        <div className={className}>
            <label className="flex items-center gap-3 mb-3 text-lg font-semibold text-gray-800">
                {icon && icon} {label}
            </label>
            <textarea
                {...props}
                rows={3}
                className="w-full px-6 py-5 border border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition resize-none"
            />
        </div>
    );
}