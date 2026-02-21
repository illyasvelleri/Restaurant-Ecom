"use client";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // optional: disable cache if needed

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import { Edit3, Plus, Minus, Trash2, Save } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.has("edit");
  const editOrderId = searchParams.get("edit");

  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [currency, setCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isEditMode && editOrderId) {
          // Edit mode: load from DB
          const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
          if (res.ok) {
            const order = await res.json();
            const mappedCart = order.items.map(item => ({
              _id: item._id,
              name: item.name,
              price: item.price.toString(), // keep as string
              quantity: item.quantity,
              addons: item.addons || [],
              selectedAddons: item.selectedAddons || item.addons || [], // prefer selectedAddons if exists
              image: item.image || null
            }));
            setCart(mappedCart);
            if (mappedCart.length > 0) setSelectedItemIndex(0);
          } else {
            toast.error("Order not found");
            router.push("/user/cart");
            return;
          }
        } else {
          // Normal mode: localStorage
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            setCart(parsed);
            if (parsed.length > 0) setSelectedItemIndex(0);
          }
        }

        const res = await fetch("/api/restaurantDetails");
        if (res.ok) {
          const data = await res.json();
          setCurrency(data.currency || "SAR");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isEditMode, editOrderId, router]);

  // Recalculate total whenever cart changes
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const base = Number(item.price || 0) * (item.quantity || 1);
      const addons = (item.selectedAddons || []).reduce((sum, a) => sum + Number(a.price || 0), 0) * (item.quantity || 1);
      return total + base + addons;
    }, 0).toFixed(2);
  };

  const total = calculateTotal();
  const cartCount = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const updateCart = (newCart) => {
    setCart(newCart);
    if (!isEditMode) {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const updateQty = (index, change) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(0, (newCart[index].quantity || 0) + change);
    if (newCart[index].quantity === 0) {
      newCart.splice(index, 1);
      if (selectedItemIndex >= newCart.length && newCart.length > 0) {
        setSelectedItemIndex(0);
      } else if (selectedItemIndex === index) {
        setSelectedItemIndex(Math.max(0, index - 1));
      }
    }
    updateCart(newCart);
  };

  const removeItem = (index) => {
    // Optional: add confirm dialog
    // if (!confirm("Remove this item?")) return;

    const newCart = [...cart];
    newCart.splice(index, 1);
    if (selectedItemIndex >= newCart.length && newCart.length > 0) {
      setSelectedItemIndex(0);
    } else if (selectedItemIndex === index) {
      setSelectedItemIndex(Math.max(0, index - 1));
    }
    updateCart(newCart);
    toast.success("Item removed");
  };

  const toggleAddon = (addonIndex) => {
    const newCart = [...cart];
    const item = newCart[selectedItemIndex];
    if (!item.addons?.[addonIndex]) return;

    if (!item.selectedAddons) item.selectedAddons = [];

    const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
    if (existing > -1) {
      item.selectedAddons.splice(existing, 1);
    } else {
      item.selectedAddons.push(item.addons[addonIndex]);
    }
    updateCart(newCart);
  };

  const handleSaveChanges = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/user/updateOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: editOrderId,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity || 1,
            price: Number(item.price || 0),
            addons: item.addons || [],
            selectedAddons: item.selectedAddons || []
          })),
          totalAmount: Number(total),
          customerName: "minhaj", // TODO: replace with real/session data
          customerPhone: "9878456783" // TODO: replace with real/session data
        })
      });

      if (res.ok) {
        toast.success("Order updated successfully!");
        router.push(`/user/checkout?edit=${editOrderId}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update order");
      }
    } catch (err) {
      toast.error("Error saving changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-light text-gray-900 mb-6">Your cart is empty</h1>
        <button
          onClick={() => router.push("/user/menu")}
          className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const selectedItem = cart[selectedItemIndex] || {};

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 pb-32"> {/* pb-32 for fixed bottom bar */}
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              {isEditMode ? "Edit Your Order" : "Your Cart"}
            </h1>
            <p className="text-gray-600">
              {cartCount} items · {total} {currency}
            </p>
          </div>
        </div>
      </div>

      {/* Cart Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cart.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItemIndex(index)}
              className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                selectedItemIndex === index 
                  ? "border-2 border-gray-900 shadow-lg" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                  ×{item.quantity || 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-2 line-clamp-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.price} {currency}</p>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
                      className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center transition hover:bg-gray-800"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    className="text-red-500 hover:text-red-600 transition p-1"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Item Addons */}
      <AnimatePresence>
        {selectedItem.addons?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Customize "{selectedItem.name}"</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedItem.addons.map((addon, idx) => {
                  const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleAddon(idx)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        isSelected ? "bg-gray-900 text-white shadow-md" : "bg-white hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm mt-1">+{addon.price} {currency}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {total} {currency}
            </p>
          </div>

          {isEditMode ? (
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className={`w-full sm:w-auto px-10 py-4 font-semibold rounded-full transition flex items-center justify-center gap-2 ${
                saving ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => router.push("/user/checkout")}
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import { Edit3, Plus, Minus, Trash2, Save } from "lucide-react";

// export default function CartPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const isEditMode = searchParams.has("edit");
//   const editOrderId = searchParams.get("edit");

//   const [cart, setCart] = useState([]);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(0);
//   const [currency, setCurrency] = useState("SAR");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadCart = async () => {
//       try {
//         if (isEditMode && editOrderId) {
//           // Edit mode: load from DB
//           const res = await fetch(`/api/user/updateOrder?orderId=${editOrderId}`);
//           if (res.ok) {
//             const order = await res.json();
//             const mappedCart = order.items.map(item => ({
//               _id: item._id,
//               name: item.name,
//               price: item.price.toString(),
//               quantity: item.quantity,
//               addons: item.addons || [],
//               selectedAddons: item.addons || [], // assume all selected in edit mode
//               image: item.image || null
//             }));
//             setCart(mappedCart);
//             if (mappedCart.length > 0) setSelectedItemIndex(0);
//           } else {
//             toast.error("Order not found");
//             router.push("/user/cart");
//           }
//         } else {
//           // Normal mode: load from localStorage
//           const savedCart = localStorage.getItem("cart");
//           if (savedCart) {
//             const parsed = JSON.parse(savedCart);
//             setCart(parsed);
//             if (parsed.length > 0) setSelectedItemIndex(0);
//           }
//         }

//         const res = await fetch("/api/restaurantDetails");
//         if (res.ok) {
//           const data = await res.json();
//           setCurrency(data.currency || "SAR");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCart();
//   }, [isEditMode, editOrderId, router]);

//   const updateCart = (newCart) => {
//     setCart(newCart);
//     if (!isEditMode) {
//       localStorage.setItem("cart", JSON.stringify(newCart));
//     }
//   };

//   const updateQty = (index, change) => {
//     const newCart = [...cart];
//     newCart[index].quantity += change;
//     if (newCart[index].quantity <= 0) {
//       newCart.splice(index, 1);
//       if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//         setSelectedItemIndex(0);
//       } else if (selectedItemIndex === index) {
//         setSelectedItemIndex(Math.max(0, index - 1));
//       }
//     }
//     updateCart(newCart);
//   };

//   const removeItem = (index) => {
//     const newCart = [...cart];
//     newCart.splice(index, 1);
//     if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//       setSelectedItemIndex(0);
//     } else if (selectedItemIndex === index) {
//       setSelectedItemIndex(Math.max(0, index - 1));
//     }
//     updateCart(newCart);
//     toast.success("Item removed");
//   };

//   const toggleAddon = (addonIndex) => {
//     const newCart = [...cart];
//     const item = newCart[selectedItemIndex];
//     if (!item.addons || !item.addons[addonIndex]) return;

//     if (!item.selectedAddons) item.selectedAddons = [];

//     const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
//     if (existing > -1) {
//       item.selectedAddons.splice(existing, 1);
//     } else {
//       item.selectedAddons.push(item.addons[addonIndex]);
//     }
//     updateCart(newCart);
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => {
//       const base = parseFloat(item.price || 0) * item.quantity;
//       const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * item.quantity;
//       return total + base + addons;
//     }, 0).toFixed(2);
//   };

//   const total = calculateTotal();
//   const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

//   const handleSaveChanges = async () => {
//     if (cart.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     try {
//       const res = await fetch("/api/user/updateOrder", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId: editOrderId,
//           items: cart.map(item => ({
//             name: item.name,
//             quantity: item.quantity,
//             price: parseFloat(item.price),
//             addons: item.addons || [],
//             selectedAddons: item.selectedAddons || []
//           })),
//           totalAmount: parseFloat(total),
//           customerName: "minhaj", // replace with real data/session
//           customerPhone: "9878456783" // replace with real data/session
//         })
//       });

//       if (res.ok) {
//         toast.success("Order updated successfully!");
//         router.push(`/user/checkout?edit=${editOrderId}`);
//       } else {
//         toast.error("Failed to update order");
//       }
//     } catch (err) {
//       toast.error("Error saving changes");
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
//         <h1 className="text-3xl font-light text-gray-900 mb-6">Your cart is empty</h1>
//         <button
//           onClick={() => router.push("/user/menu")}
//           className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800"
//         >
//           Explore Menu
//         </button>
//       </div>
//     );
//   }

//   const selectedItem = cart[selectedItemIndex] || {};

//   return (
//     <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
//       {/* Header */}
//       <div className="border-b border-gray-100 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center">
//             <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
//               {isEditMode ? "Edit Your Order" : "Your Cart"}
//             </h1>
//             <p className="text-gray-600">
//               {cartCount} items · {total} {currency}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Cart Items Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {cart.map((item, index) => (
//             <motion.div
//               key={item._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05 }}
//               onClick={() => setSelectedItemIndex(index)}
//               className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
//                 selectedItemIndex === index 
//                   ? "border-2 border-gray-900 shadow-lg" 
//                   : "border-gray-200 hover:border-gray-300 hover:shadow-md"
//               }`}
//             >
//               {/* Image */}
//               <div className="relative aspect-square bg-gray-50">
//                 {item.image ? (
//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200" />
//                 )}

//                 {/* Quantity Badge */}
//                 <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
//                   ×{item.quantity}
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 <h3 className="font-semibold text-base mb-2 line-clamp-1">{item.name}</h3>
//                 <p className="text-gray-600 text-sm mb-3">{item.price} {currency}</p>

//                 {/* Quantity & Remove Controls */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
//                       className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
//                     >
//                       <Minus size={16} />
//                     </button>
//                     <span className="w-8 text-center font-medium">{item.quantity}</span>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
//                       className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center transition hover:bg-gray-800"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </div>

//                   {/* Remove Item Button */}
//                   <button
//                     onClick={(e) => { e.stopPropagation(); removeItem(index); }}
//                     className="text-red-500 hover:text-red-600 transition p-1"
//                     title="Remove item"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Selected Item Addons */}
//       <AnimatePresence>
//         {selectedItem.addons?.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
//           >
//             <div className="bg-gray-50 rounded-2xl p-8">
//               <h2 className="text-2xl font-semibold mb-6">Customize "{selectedItem.name}"</h2>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {selectedItem.addons.map((addon, idx) => {
//                   const isSelected = selectedItem.selectedAddons?.some(a => a.name === addon.name);
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => toggleAddon(idx)}
//                       className={`p-4 rounded-xl text-left transition-all ${
//                         isSelected ? "bg-gray-900 text-white shadow-md" : "bg-white hover:bg-gray-100 border border-gray-200"
//                       }`}
//                     >
//                       <p className="font-medium">{addon.name}</p>
//                       <p className="text-sm mt-1">+{addon.price} {currency}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bottom Action Bar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="text-center sm:text-left">
//             <p className="text-sm text-gray-600">Total</p>
//             <p className="text-2xl font-bold text-gray-900">
//               {total} {currency}
//             </p>
//           </div>

//           {isEditMode ? (
//             <button
//               onClick={handleSaveChanges}
//               className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition flex items-center justify-center gap-2"
//             >
//               <Save size={18} />
//               Save Changes
//             </button>
//           ) : (
//             <button
//               onClick={() => router.push("/user/checkout")}
//               className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition"
//             >
//               Proceed to Checkout
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }