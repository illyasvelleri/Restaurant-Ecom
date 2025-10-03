// "use client";
// import { useState } from "react";
// import { Search, ShoppingCart, Heart, Star, Filter, X } from "lucide-react";

// export default function MenuPage() {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads", "Desserts", "Drinks"];

//   const menuItems = [
//     { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, rating: 4.8, reviews: 245, image: "🍕", description: "Classic tomato, mozzarella, and basil", popular: true },
//     { id: 2, name: "Classic Burger", category: "Burgers", price: 10.99, rating: 4.6, reviews: 189, image: "🍔", description: "Beef patty with fresh lettuce and tomato" },
//     { id: 3, name: "Caesar Salad", category: "Salads", price: 8.99, rating: 4.7, reviews: 156, image: "🥗", description: "Crisp romaine with parmesan and croutons" },
//     { id: 4, name: "Spaghetti Carbonara", category: "Pasta", price: 14.99, rating: 4.9, reviews: 312, image: "🍝", description: "Creamy pasta with bacon and parmesan", popular: true },
//     { id: 5, name: "Pepperoni Pizza", category: "Pizza", price: 13.99, rating: 4.8, reviews: 278, image: "🍕", description: "Loaded with pepperoni and cheese" },
//     { id: 6, name: "BBQ Burger", category: "Burgers", price: 12.99, rating: 4.7, reviews: 203, image: "🍔", description: "Smoky BBQ sauce with crispy onions", popular: true },
//     { id: 7, name: "Penne Arrabbiata", category: "Pasta", price: 13.99, rating: 4.6, reviews: 167, image: "🍝", description: "Spicy tomato sauce with garlic" },
//     { id: 8, name: "Greek Salad", category: "Salads", price: 9.99, rating: 4.5, reviews: 134, image: "🥗", description: "Fresh vegetables with feta cheese" },
//     { id: 9, name: "Chocolate Cake", category: "Desserts", price: 6.99, rating: 4.9, reviews: 421, image: "🍰", description: "Rich chocolate layer cake", popular: true },
//     { id: 10, name: "Tiramisu", category: "Desserts", price: 7.99, rating: 4.8, reviews: 298, image: "🍮", description: "Classic Italian coffee-flavored dessert" },
//     { id: 11, name: "Fresh Lemonade", category: "Drinks", price: 3.99, rating: 4.6, reviews: 187, image: "🍋", description: "Freshly squeezed lemon juice" },
//     { id: 12, name: "Iced Coffee", category: "Drinks", price: 4.99, rating: 4.7, reviews: 234, image: "☕", description: "Cold brew with ice and cream" },
//   ];

//   const filteredItems = menuItems.filter(item => 
//     (selectedCategory === "All" || item.category === selectedCategory) &&
//     (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const toggleFavorite = (id) => {
//     setFavorites(prev => 
//       prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
//     );
//   };

//   const addToCart = (item) => {
//     setCartItems(prev => [...prev, item]);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
//       {/* Header */}
//       <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-40 border-b border-gray-100">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-xl">HN</span>
//               </div>
//               <span className="text-xl sm:text-2xl font-bold text-gray-900">Menu</span>
//             </div>

//             <button className="relative p-2.5 rounded-full bg-orange-500 hover:bg-orange-600 transition-all shadow-lg">
//               <ShoppingCart className="text-white" size={20} />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
//                   {cartItems.length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Search & Filter Section */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
//           {/* Search Bar */}
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search for dishes..."
//               className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
//             />
//           </div>

//           {/* Filter Button (Mobile) */}
//           <button 
//             onClick={() => setFilterOpen(!filterOpen)}
//             className="sm:hidden px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center space-x-2 hover:border-orange-300 transition-all"
//           >
//             <Filter size={20} />
//             <span>Filter</span>
//           </button>
//         </div>

//         {/* Category Pills - Desktop */}
//         <div className="hidden sm:flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
//                 selectedCategory === category
//                   ? "bg-orange-500 text-white shadow-lg"
//                   : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Category Pills - Mobile Drawer */}
//         {filterOpen && (
//           <div className="sm:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setFilterOpen(false)}>
//             <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold">Filter by Category</h3>
//                 <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => {
//                       setSelectedCategory(category);
//                       setFilterOpen(false);
//                     }}
//                     className={`px-6 py-3 rounded-xl font-medium transition-all ${
//                       selectedCategory === category
//                         ? "bg-orange-500 text-white shadow-lg"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     {category}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Menu Items Grid */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {selectedCategory === "All" ? "All Dishes" : selectedCategory}
//             <span className="text-gray-400 text-lg ml-2">({filteredItems.length})</span>
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredItems.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
//             >
//               {/* Image Section */}
//               <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
//                 <div className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
//                   {item.image}
//                 </div>
                
//                 {/* Popular Badge */}
//                 {item.popular && (
//                   <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
//                     Popular
//                   </div>
//                 )}

//                 {/* Favorite Button */}
//                 <button
//                   onClick={() => toggleFavorite(item.id)}
//                   className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
//                 >
//                   <Heart
//                     size={18}
//                     className={favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
//                   />
//                 </button>
//               </div>

//               {/* Content Section */}
//               <div className="p-5">
//                 <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
//                 <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>

//                 {/* Rating */}
//                 <div className="flex items-center space-x-1 mb-4">
//                   <Star size={16} className="fill-yellow-400 text-yellow-400" />
//                   <span className="text-sm font-semibold text-gray-900">{item.rating}</span>
//                   <span className="text-sm text-gray-400">({item.reviews})</span>
//                 </div>

//                 {/* Price & Add Button */}
//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold text-gray-900">
//                     ${item.price}
//                   </div>
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
//                   >
//                     <ShoppingCart size={16} />
//                     <span>Add</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredItems.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-6xl mb-4">🔍</div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No dishes found</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Search, Filter, X } from "lucide-react";
import Header from "../components/navbar"; // adjust path if needed

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads", "Desserts", "Drinks"];

  const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: 12.99, rating: 4.8, reviews: 245, image: "/Images/pizza.png", description: "Classic tomato, mozzarella, and basil", popular: true },
    { id: 2, name: "Classic Burger", category: "Burgers", price: 10.99, rating: 4.6, reviews: 189, image: "/Images/burger.png", description: "Beef patty with fresh lettuce and tomato" },
    { id: 3, name: "Caesar Salad", category: "Salads", price: 8.99, rating: 4.7, reviews: 156, image: "/Images/salad.png", description: "Crisp romaine with parmesan and croutons" },
    { id: 4, name: "Spaghetti Carbonara", category: "Pasta", price: 14.99, rating: 4.9, reviews: 312, image: "/Images/burger.png", description: "Creamy pasta with bacon and parmesan", popular: true },
    { id: 5, name: "Pepperoni Pizza", category: "Pizza", price: 13.99, rating: 4.8, reviews: 278, image: "/Images/pizza.png", description: "Loaded with pepperoni and cheese" },
    { id: 6, name: "BBQ Burger", category: "Burgers", price: 12.99, rating: 4.7, reviews: 203, image: "/Images/burger.png", description: "Smoky BBQ sauce with crispy onions", popular: true },
    { id: 7, name: "Penne Arrabbiata", category: "Pasta", price: 13.99, rating: 4.6, reviews: 167, image: "/Images/salad.png", description: "Spicy tomato sauce with garlic" },
    { id: 8, name: "Greek Salad", category: "Salads", price: 9.99, rating: 4.5, reviews: 134, image: "/Images/pizza.png", description: "Fresh vegetables with feta cheese" },
    { id: 9, name: "Chocolate Cake", category: "Desserts", price: 6.99, rating: 4.9, reviews: 421, image: "/Images/burger.png", description: "Rich chocolate layer cake", popular: true },
    { id: 10, name: "Tiramisu", category: "Desserts", price: 7.99, rating: 4.8, reviews: 298, image: "/Images/salad.png", description: "Classic Italian coffee-flavored dessert" },
    { id: 11, name: "Fresh Lemonade", category: "Drinks", price: 3.99, rating: 4.6, reviews: 187, image: "/Images/pizza.png", description: "Freshly squeezed lemon juice" },
    { id: 12, name: "Iced Coffee", category: "Drinks", price: 4.99, rating: 4.7, reviews: 234, image: "/Images/burger.png", description: "Cold brew with ice and cream" },
  ];

  const filteredItems = menuItems.filter(item => 
    (selectedCategory === "All" || item.category === selectedCategory) &&
    (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const addToCart = (item) => {
    setCartItems(prev => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <Header cart={cartItems} />

      {/* Search & Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Category Pills - Desktop */}
        <div className="hidden sm:flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={180}
                  height={180}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
                {item.popular && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Popular
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart
                    size={18}
                    className={favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center space-x-1 mb-4">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{item.rating}</span>
                  <span className="text-sm text-gray-400">({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">${item.price}</div>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <ShoppingCart size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No dishes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
