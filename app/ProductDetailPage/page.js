"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft,
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check,
  Minus,
  Plus,
  ChevronDown,
  Truck,
  Clock,
  ShieldCheck
} from "lucide-react";

export default function ProductDetailPage({ params }) {
  // Product ID would come from route params in a real app
  const productId = params?.id || 1;
  
  // Product state
  const [product, setProduct] = useState({
    id: productId,
    name: "Burger Deluxe",
    description: "Our signature burger featuring premium Angus beef patty, topped with melted cheddar cheese, caramelized onions, fresh lettuce, tomato, and our special house sauce, all served in a toasted brioche bun.",
    price: 12.00,
    discountPrice: 10.99,
    img: "/Images/sandwich.jpg",
    images: [
      "/Images/sandwich.jpg",
      "/Images/sandwich.jpg",
      "/Images/sandwich.jpg",
      "/Images/sandwich.jpg"
    ],
    rating: 4.8,
    reviews: 124,
    quantity: 1,
    category: "Burger",
    tags: ["Burger", "Beef", "Popular", "Specialty"],
    nutrition: {
      calories: "650 kcal",
      protein: "35g",
      carbs: "45g",
      fat: "38g"
    },
    ingredients: [
      "Angus beef patty",
      "Brioche bun",
      "Cheddar cheese",
      "Lettuce",
      "Tomato",
      "Caramelized onions",
      "Special sauce"
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    preparation: "15-20 minutes",
    isAvailable: true,
    isFavorite: false
  });

  // UI state
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Related products (in a real app, these would be fetched based on the current product)
  const relatedProducts = [
    {
      id: 2,
      name: "French Fries",
      price: 5.99,
      img: "/Images/sandwich.jpg",
      category: "Sides"
    },
    {
      id: 3,
      name: "Chocolate Milkshake",
      price: 4.50,
      img: "/Images/sandwich.jpg",
      category: "Beverages"
    },
    {
      id: 4,
      name: "Onion Rings",
      price: 4.99,
      img: "/Images/sandwich.jpg",
      category: "Sides"
    }
  ];

  // Handle quantity change
  const updateQuantity = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const addToCart = () => {
    // In a real app, this would dispatch to your cart state/context
    setIsAddedToCart(true);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  // Handle buy now
  const buyNow = () => {
    // In a real app, this would add to cart and redirect to checkout
    addToCart();
    // window.location.href = "/checkout";
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setProduct({
      ...product,
      isFavorite: !product.isFavorite
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href="/menu" className="text-gray-500 hover:text-orange-500 transition-colors">
            Menu
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-500 hover:text-orange-500 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </nav>

      {/* Back Button - Mobile Only */}
      <div className="md:hidden px-4 py-3">
        <Link href="/menu" className="flex items-center text-gray-700">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Menu</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-md">
              <Image
                src={product.images[selectedImg]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImg(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImg === index ? "border-orange-500" : "border-transparent hover:border-orange-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link href="#reviews" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                      {product.reviews} reviews
                    </Link>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${product.isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all`}
                    aria-label={product.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-5 h-5 ${product.isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                  <button 
                    className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Price Section */}
              <div className="mt-4 flex items-end">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-orange-600">${product.discountPrice.toFixed(2)}</span>
                    <span className="ml-3 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-orange-600">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            {/* Availability */}
            <div className="flex items-center">
              {product.isAvailable ? (
                <div className="flex items-center text-green-600">
                  <Check className="w-5 h-5 mr-1" />
                  <span>In Stock</span>
                </div>
              ) : (
                <div className="text-red-500">Temporarily Unavailable</div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700">{product.description}</p>
            
            {/* Quantity Selector and Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-gray-700">Quantity:</div>
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-500 disabled:text-gray-300 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  disabled={isAddedToCart}
                  className={`flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                    isAddedToCart 
                      ? "bg-green-500 text-white" 
                      : "bg-white border border-orange-500 text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={buyNow}
                  className="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-gray-200 py-4">
              <div className="flex items-center">
                <Truck className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600">Free delivery on orders over $25</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600">Ready in {product.preparation}</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600">Quality guarantee</span>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "description" 
                      ? "text-orange-500 border-b-2 border-orange-500" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "ingredients" 
                      ? "text-orange-500 border-b-2 border-orange-500" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab("nutrition")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "nutrition" 
                      ? "text-orange-500 border-b-2 border-orange-500" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Nutrition
                </button>
              </div>
              
              <div className="py-2">
                {activeTab === "description" && (
                  <div className="text-gray-700 space-y-3">
                    <p>{product.description}</p>
                    <p>Perfect for a satisfying lunch or dinner, our Burger Deluxe is made with locally sourced ingredients and cooked to perfection. Each burger is assembled fresh to order to ensure the best quality and taste.</p>
                  </div>
                )}
                
                {activeTab === "ingredients" && (
                  <div className="space-y-3">
                    <p className="text-gray-700">All ingredients are fresh and carefully selected:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                    {product.allergens.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-700 font-medium">Allergens:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.allergens.map((allergen, index) => (
                            <span key={index} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "nutrition" && (
                  <div className="space-y-3">
                    <p className="text-gray-700">Nutritional information per serving:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(product.nutrition).map(([key, value]) => (
                        <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-sm text-gray-500 capitalize">{key}</div>
                          <div className="text-gray-900 font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <Link 
                href={`/product/${item.id}`} 
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                  <div className="mt-2 font-bold text-orange-600">${item.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}