// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, Sparkles, Check } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";

// export default function CartPage() {
//     const router = useRouter();
//     const [cart, setCart] = useState([]);
//     const [selectedItemIndex, setSelectedItemIndex] = useState(0);
//     const [currency, setCurrency] = useState("SAR"); // ← new state for dynamic currency

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 // Load cart from localStorage
//                 const savedCart = localStorage.getItem("cart");
//                 if (savedCart) {
//                     try {
//                         const parsed = JSON.parse(savedCart);
//                         setCart(parsed);
//                         if (parsed.length > 0) setSelectedItemIndex(0);
//                     } catch (e) {
//                         setCart([]);
//                     }
//                 }

//                 // Fetch currency from public settings (same as footer & main content)
//                 const res = await fetch("/api/restaurantDetails");
//                 if (res.ok) {
//                     const data = await res.json();
//                     const fetchedCurrency = data.currency || "SAR";
//                     setCurrency(fetchedCurrency);
//                 }
//             } catch (err) {
//                 console.error("Failed to load cart or settings:", err);
//             }
//         };

//         load();
//     }, []);

//     const updateCart = (newCart) => {
//         setCart(newCart);
//         localStorage.setItem("cart", JSON.stringify(newCart));
//     };

//     const updateQty = (index, change) => {
//         const newCart = [...cart];
//         newCart[index].quantity += change;
//         if (newCart[index].quantity <= 0) {
//             newCart.splice(index, 1);
//             if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//                 setSelectedItemIndex(0);
//             }
//         }
//         updateCart(newCart);
//     };

//     const removeItem = (index) => {
//         const newCart = cart.filter((_, i) => i !== index);
//         updateCart(newCart);
//         if (selectedItemIndex >= newCart.length && newCart.length > 0) {
//             setSelectedItemIndex(0);
//         }
//         toast.success("Item removed");
//     };

//     const toggleAddon = (addonIndex) => {
//         const newCart = [...cart];
//         const item = newCart[selectedItemIndex];
//         if (!item.selectedAddons) item.selectedAddons = [];

//         const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
//         if (existing > -1) {
//             item.selectedAddons.splice(existing, 1);
//         } else {
//             item.selectedAddons.push(item.addons[addonIndex]);
//         }
//         updateCart(newCart);
//     };

//     const calculateTotal = () => {
//         return cart.reduce((total, item) => {
//             const base = parseFloat(item.price || 0) * item.quantity;
//             const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * item.quantity;
//             return total + base + addons;
//         }, 0).toFixed(2);
//     };

//     const total = calculateTotal();
//     const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

//     if (cart.length === 0) {
//         return (
//             <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-6 text-center">
//                 <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="mb-8"
//                 >
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
//                         <ShoppingCart size={100} className="text-gray-300 relative" />
//                     </div>
//                 </motion.div>
//                 <motion.h1
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
//                 >
//                     Your cart is empty
//                 </motion.h1>
//                 <motion.p
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                     className="text-lg sm:text-xl text-gray-600 mb-10 max-w-md"
//                 >
//                     Discover our finest dishes and add your favorites
//                 </motion.p>
//                 <motion.button
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => router.push("/user/popular")}
//                     className="group px-10 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-bold text-lg sm:text-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
//                 >
//                     Explore Menu
//                     <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </motion.button>
//             </div>
//         );
//     }

//     const selectedItem = cart[selectedItemIndex] || {};

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white py-28">

//             {/* ENHANCED HEADER */}
//             <div className="relative border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
//                 <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 via-transparent to-orange-50/50" />
//                 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
//                     <motion.div
//                         initial={{ y: -20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-6"
//                     >
//                         <Sparkles className="w-4 h-4" />
//                         <span>{cartCount} Items Selected</span>
//                     </motion.div>
//                     <motion.h1
//                         initial={{ y: -20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.1 }}
//                         className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-4"
//                     >
//                         Your Order
//                     </motion.h1>
//                     <motion.div
//                         initial={{ y: -20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className="flex items-center justify-center gap-4 text-xl sm:text-2xl lg:text-3xl"
//                     >
//                         <span className="text-gray-600 font-light">{cartCount} items</span>
//                         <span className="text-gray-300">•</span>
//                         <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                             {total} {currency}  {/* ← dynamic currency */}
//                         </span>
//                     </motion.div>
//                 </div>
//             </div>

//             {/* CART ITEMS SECTION */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
//                 <div className="flex items-center justify-between mb-8 sm:mb-12">
//                     <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//                         Selected Items
//                     </h2>
//                     <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
//                         <ShoppingCart className="w-4 h-4" />
//                         <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
//                     </div>
//                 </div>

//                 {/* MOBILE: Horizontal scroll */}
//                 <div className="lg:hidden flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
//                     {cart.map((item, index) => (
//                         <motion.div
//                             key={item._id}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             whileTap={{ scale: 0.98 }}
//                             onClick={() => setSelectedItemIndex(index)}
//                             className={`flex-shrink-0 w-[85vw] max-w-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 snap-center ${
//                                 selectedItemIndex === index 
//                                     ? 'ring-4 ring-amber-500 shadow-2xl shadow-amber-500/20' 
//                                     : 'ring-2 ring-gray-200'
//                             }`}
//                         >
//                             <div className="relative h-56 sm:h-64">
//                                 <img
//                                     src={item.image || "/placeholder.jpg"}
//                                     alt={item.name}
//                                     className="w-full h-full object-cover"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
//                                 {selectedItemIndex === index && (
//                                     <motion.div
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         className="absolute top-4 right-4 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
//                                     >
//                                         <Check className="w-6 h-6 text-white" />
//                                     </motion.div>
//                                 )}
//                                 <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
//                                     <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
//                                         {item.name}
//                                     </h3>
//                                     <div className="flex items-center gap-2">
//                                         <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
//                                             Qty: {item.quantity}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="p-6 sm:p-8 bg-white">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <div>
//                                         <p className="text-sm text-gray-500 mb-1">Price</p>
//                                         <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                                             {item.price} {currency}  {/* ← dynamic currency */}
//                                         </p>
//                                     </div>
//                                     <div className="flex items-center gap-3 sm:gap-4">
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
//                                             className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
//                                         >
//                                             <Minus size={20} className="text-gray-700" />
//                                         </motion.button>
//                                         <span className="text-3xl sm:text-4xl font-bold text-gray-900 min-w-[3rem] text-center">
//                                             {item.quantity}
//                                         </span>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
//                                             className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center shadow-lg"
//                                         >
//                                             <Plus size={20} />
//                                         </motion.button>
//                                     </div>
//                                 </div>
//                                 {item.selectedAddons && item.selectedAddons.length > 0 && (
//                                     <div className="border-t border-gray-100 pt-4">
//                                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                                             Addons
//                                         </p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {item.selectedAddons.map((addon, i) => (
//                                                 <span 
//                                                     key={i} 
//                                                     className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-sm font-medium text-amber-800"
//                                                 >
//                                                     {addon.name} <span className="text-amber-600">+{addon.price} {currency}</span>  {/* ← dynamic */}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* DESKTOP: Grid layout */}
//                 <div className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8">
//                     {cart.map((item, index) => (
//                         <motion.div
//                             key={item._id}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             whileHover={{ y: -5 }}
//                             onClick={() => setSelectedItemIndex(index)}
//                             className={`rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 ${
//                                 selectedItemIndex === index 
//                                     ? 'ring-4 ring-amber-500 shadow-2xl shadow-amber-500/20' 
//                                     : 'ring-2 ring-gray-200 hover:ring-gray-300'
//                             }`}
//                         >
//                             <div className="relative h-80">
//                                 <img 
//                                     src={item.image || "/placeholder.jpg"} 
//                                     alt={item.name} 
//                                     className="w-full h-full object-cover"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
//                                 {selectedItemIndex === index && (
//                                     <motion.div
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         className="absolute top-6 right-6 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
//                                     >
//                                         <Check className="w-7 h-7 text-white" />
//                                     </motion.div>
//                                 )}
//                                 <div className="absolute bottom-6 left-6 right-6">
//                                     <h3 className="text-4xl font-bold text-white drop-shadow-lg mb-3">
//                                         {item.name}
//                                     </h3>
//                                     <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-base font-medium">
//                                         Quantity: {item.quantity}
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="p-8 bg-white">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <div>
//                                         <p className="text-sm text-gray-500 mb-1">Price</p>
//                                         <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//                                             {item.price} {currency}  {/* ← dynamic currency */}
//                                         </p>
//                                     </div>
//                                     <div className="flex items-center gap-6">
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
//                                             className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
//                                         >
//                                             <Minus size={24} className="text-gray-700" />
//                                         </motion.button>
//                                         <span className="text-4xl font-bold text-gray-900 min-w-[4rem] text-center">
//                                             {item.quantity}
//                                         </span>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
//                                             className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center shadow-lg"
//                                         >
//                                             <Plus size={24} />
//                                         </motion.button>
//                                     </div>
//                                 </div>
//                                 {item.selectedAddons && item.selectedAddons.length > 0 && (
//                                     <div className="border-t border-gray-100 pt-4">
//                                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                                             Addons
//                                         </p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {item.selectedAddons.map((addon, i) => (
//                                                 <span 
//                                                     key={i} 
//                                                     className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-sm font-medium text-amber-800"
//                                                 >
//                                                     {addon.name} <span className="text-amber-600">+{addon.price} {currency}</span>  {/* ← dynamic */}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>

//             {/* ADDONS CUSTOMIZATION */}
//             <AnimatePresence>
//                 {selectedItem.addons && selectedItem.addons.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 20 }}
//                         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
//                     >
//                         <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-10 lg:p-12">
//                             <div className="text-center mb-8 sm:mb-12">
//                                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
//                                     Customize Your Order
//                                 </h2>
//                                 <p className="text-lg text-gray-600">
//                                     Add extras to <span className="font-semibold text-amber-700">"{selectedItem.name}"</span>
//                                 </p>
//                             </div>
//                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto">
//                                 {selectedItem.addons.map((addon, idx) => {
//                                     const isSelected = (selectedItem.selectedAddons || []).some(a => a.name === addon.name);
//                                     return (
//                                         <motion.button
//                                             key={idx}
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             onClick={() => toggleAddon(idx)}
//                                             className={`p-4 sm:p-6 rounded-2xl transition-all duration-300 ${
//                                                 isSelected
//                                                     ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-2xl ring-4 ring-amber-300'
//                                                     : 'bg-white border-2 border-gray-200 hover:border-amber-500 shadow-lg hover:shadow-xl'
//                                             }`}
//                                         >
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <p className="text-base sm:text-lg lg:text-xl font-bold text-left">
//                                                     {addon.name}
//                                                 </p>
//                                                 {isSelected && (
//                                                     <motion.div
//                                                         initial={{ scale: 0 }}
//                                                         animate={{ scale: 1 }}
//                                                         className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
//                                                     >
//                                                         <Check className="w-4 h-4 text-amber-500" />
//                                                     </motion.div>
//                                                 )}
//                                             </div>
//                                             <p className={`text-sm sm:text-base lg:text-lg font-semibold ${
//                                                 isSelected ? 'text-white/90' : 'text-gray-600'
//                                             }`}>
//                                                 +{addon.price} {currency}  {/* ← dynamic currency */}
//                                             </p>
//                                         </motion.button>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* CHECKOUT SECTION */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
//                 <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden"
//                 >
//                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMy4zMTQtMi42ODYtNi02LTZzLTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2IDYtMi42ODYgNi02ek0wIDAgaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                    
//                     <div className="relative">
//                         <div className="mb-6 sm:mb-8">
//                             <p className="text-sm sm:text-base text-gray-400 mb-2 uppercase tracking-widest font-semibold">
//                                 Total Amount
//                             </p>
//                             <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-2">
//                                 {total} <span className="text-amber-400">{currency}</span>  {/* ← dynamic currency */}
//                             </p>
//                             <p className="text-sm sm:text-base text-gray-400">
//                                 Including all addons and extras
//                             </p>
//                         </div>

//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => router.push('/user/checkout')}
//                             className="group relative w-full sm:w-auto px-10 sm:px-16 lg:px-20 py-6 sm:py-7 lg:py-8 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black rounded-full font-bold text-xl sm:text-2xl lg:text-3xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 flex items-center justify-center gap-4 sm:gap-6 mx-auto overflow-hidden"
//                         >
//                             <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
//                             <span className="relative z-10">Proceed to Checkout</span>
//                             <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 relative z-10 group-hover:translate-x-2 transition-transform" />
//                         </motion.button>

//                         <div className="mt-6 sm:mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-gray-400">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
//                                 <span>Secure Payment</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-amber-500" />
//                                 <span>Fast Delivery</span>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }







"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [currency, setCurrency] = useState("SAR");

    useEffect(() => {
        const load = async () => {
            try {
                const savedCart = localStorage.getItem("cart");
                if (savedCart) {
                    try {
                        const parsed = JSON.parse(savedCart);
                        setCart(parsed);
                        if (parsed.length > 0) setSelectedItemIndex(0);
                    } catch (e) {
                        setCart([]);
                    }
                }

                const res = await fetch("/api/restaurantDetails");
                if (res.ok) {
                    const data = await res.json();
                    const fetchedCurrency = data.currency || "SAR";
                    setCurrency(fetchedCurrency);
                }
            } catch (err) {
                console.error("Failed to load cart or settings:", err);
            }
        };

        load();
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const updateQty = (index, change) => {
        const newCart = [...cart];
        newCart[index].quantity += change;
        if (newCart[index].quantity <= 0) {
            newCart.splice(index, 1);
            if (selectedItemIndex >= newCart.length && newCart.length > 0) {
                setSelectedItemIndex(0);
            }
        }
        updateCart(newCart);
    };

    const toggleAddon = (addonIndex) => {
        const newCart = [...cart];
        const item = newCart[selectedItemIndex];
        if (!item.addons || !item.addons[addonIndex]) return;
        
        if (!item.selectedAddons) item.selectedAddons = [];

        const existing = item.selectedAddons.findIndex(a => a.name === item.addons[addonIndex].name);
        if (existing > -1) {
            item.selectedAddons.splice(existing, 1);
        } else {
            item.selectedAddons.push(item.addons[addonIndex]);
        }
        updateCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const base = parseFloat(item.price || 0) * item.quantity;
            const addons = (item.selectedAddons || []).reduce((sum, a) => sum + parseFloat(a.price || 0), 0) * item.quantity;
            return total + base + addons;
        }, 0).toFixed(2);
    };

    const total = calculateTotal();
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <svg 
                        className="w-20 h-20 md:w-24 md:h-24 text-gray-200 mx-auto mb-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                        />
                    </svg>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-3 tracking-tight">
                        Your cart is empty
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 font-light mb-6 max-w-sm mx-auto">
                        Discover our menu and start your order
                    </p>
                    <button
                        onClick={() => router.push("/user/menu")}
                        className="inline-block px-8 md:px-10 py-3 md:py-4 bg-gray-900 text-white text-sm md:text-base font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 rounded-full"
                    >
                        Explore Menu
                    </button>
                </motion.div>
            </div>
        );
    }

    const selectedItem = cart[selectedItemIndex] || {};

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
            
            {/* Compact Header */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                    <div className="text-center">
                        <div className="inline-block bg-gray-900 text-white text-xs font-medium px-3 py-1.5 tracking-widest mb-3 rounded-full">
                            {cartCount} ITEMS
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
                            Your Cart
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-base md:text-lg">
                            <span className="text-gray-600 font-light">Total</span>
                            <span className="text-gray-300">·</span>
                            <span className="font-semibold text-gray-900">
                                {total} {currency}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Items - Compact Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                
                {/* Mobile & Desktop: Same Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {cart.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedItemIndex(index)}
                            className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                                selectedItemIndex === index 
                                    ? 'ring-2 ring-gray-900 shadow-lg' 
                                    : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md'
                            }`}
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-gray-50">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                ) : (
                                    <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                                )}
                                
                                {/* Selected Badge */}
                                {selectedItemIndex === index && (
                                    <div className="absolute top-2 right-2 w-6 h-6 md:w-7 md:h-7 bg-gray-900 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                {/* Quantity Badge */}
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <span className="text-xs md:text-sm font-semibold text-gray-900">×{item.quantity}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3 md:p-4">
                                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {item.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                                        {item.price}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {currency}
                                    </span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateQty(index, -1); }}
                                        className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center justify-center"
                                    >
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="text-sm md:text-base font-bold text-gray-900 min-w-[2rem] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateQty(index, 1); }}
                                        className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition flex items-center justify-center"
                                    >
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Add-ons Preview */}
                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1">
                                            +{item.selectedAddons.length} add-on{item.selectedAddons.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add-ons Section */}
            <AnimatePresence>
                {selectedItem.addons && selectedItem.addons.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"
                    >
                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                            <div className="text-center mb-6 md:mb-8">
                                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                                    Customize "{selectedItem.name}"
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 font-light">
                                    Add extras to your selection
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {selectedItem.addons.map((addon, idx) => {
                                    const isSelected = (selectedItem.selectedAddons || []).some(a => a.name === addon.name);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => toggleAddon(idx)}
                                            className={`p-4 md:p-5 rounded-xl transition-all duration-300 text-left ${
                                                isSelected
                                                    ? 'bg-gray-900 text-white ring-2 ring-gray-900'
                                                    : 'bg-white text-gray-900 ring-1 ring-gray-200 hover:ring-gray-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="text-sm md:text-base font-semibold pr-2">
                                                    {addon.name}
                                                </p>
                                                {isSelected && (
                                                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-xs md:text-sm font-medium ${
                                                isSelected ? 'text-white/90' : 'text-gray-600'
                                            }`}>
                                                +{addon.price} {currency}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Checkout Section - Compact */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 lg:p-10 text-center">
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                            Total Amount
                        </p>
                        <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1">
                            {total}
                        </p>
                        <p className="text-sm md:text-base text-gray-400 font-light">
                            {currency} · Including all items
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/user/checkout')}
                        className="inline-block px-10 md:px-12 py-4 md:py-5 bg-white text-gray-900 text-sm md:text-base font-semibold tracking-wide hover:bg-gray-100 transition-colors duration-300 rounded-full shadow-sm"
                    >
                        Proceed to Checkout
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400 font-light">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}