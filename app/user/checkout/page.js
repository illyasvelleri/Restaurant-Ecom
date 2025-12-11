// app/user/checkout/page.js → FINAL 2025 LUXURY CHECKOUT

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

    // Cart from localStorage (same as your menu page)
    const [cart, setCart] = useState([]);
    const total = cart.reduce((sum, i) => sum + parseFloat(i.price || 0) * i.quantity, 0).toFixed(2);

    // Delivery form
    const [form, setForm] = useState({
        name: "", whatsapp: "", address: "", building: "", floor: "", apartment: "", neighborhood: "", city: "", notes: ""
    });

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCart(JSON.parse(savedCart));
        else router.push("/user/menu");

        // If logged in → pre-fill from profile
        if (session?.user) {
            fetch("/api/user/profile")
                .then(r => r.json())
                .then(data => {
                    setForm({
                        name: data.name || session.user.name || "",
                        whatsapp: data.whatsapp || "",
                        address: data.address || "",
                        building: data.building || "",
                        floor: data.floor || "",
                        apartment: data.apartment || "",
                        neighborhood: data.neighborhood || "",
                        city: data.city || "",
                        notes: data.notes || "",
                    });
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

        setSaving(true);

        const items = cart.map(i => `${i.quantity}× ${i.name}`).join("%0A");
        const msg = encodeURIComponent(
            `*New Order from ${form.name}*

*Items:*
${items}

*Total:* ${total} SAR

*Delivery Address:*
${form.address}
${form.building ? `Building: ${form.building}` : ""}
${form.floor ? `Floor: ${form.floor}` : ""}
${form.apartment ? `Apt: ${form.apartment}` : ""}
${form.neighborhood ? `Area: ${form.neighborhood}` : ""}
${form.city}

*WhatsApp:* ${form.whatsapp}
${form.notes ? `\nNotes: ${form.notes}` : ""}

Thank you!`
        );

        // Save order in DB (even if guest)
        // Save order in DB (JS)
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
                    })),
                    totalAmount: parseFloat(total),
                    address: `${form.address}, ${form.city}`,
                    notes: form.notes
                }),
            });
        } catch (e) {
            console.log("Order save failed, but WhatsApp still works");
        }


        // Send via WhatsApp
        window.open(`https://wa.me/?text=${msg}`, "_blank");
        toast.success("Order sent! We'll contact you soon");
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

                    {/* Cart Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-10">
                        <h2 className="text-2xl font-bold mb-4">Your Items ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between py-3 border-b border-gray-200 last:border-0">
                                <span>{item.quantity}× {item.name}</span>
                                <span className="font-medium">{(item.quantity * parseFloat(item.price)).toFixed(2)} SAR</span>
                            </div>
                        ))}
                        <div className="text-2xl font-bold mt-6 text-right">Total: {total} SAR</div>
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

// Reusable fields (same as your profile page)
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
                {icon} {label}
            </label>
            <textarea
                {...props}
                rows={3}
                className="w-full px-6 py-5 border border-gray-200 rounded-2xl text-lg focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition resize-none"
            />
        </div>
    );
}