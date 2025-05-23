"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Star, Award, TrendingUp, Clock, ShoppingBag, ChevronRight } from 'lucide-react';

export default function TopRatedDishes() {
    const [topDishes, setTopDishes] = useState([
        {
            id: 1,
            name: "Signature Wagyu Burger",
            description: "Premium Wagyu beef patty with truffle aioli, aged cheddar, caramelized onions on a brioche bun",
            price: "$18.99",
            originalPrice: "$22.99",
            img: "/Images/sandwich.jpg",
            rating: 4.9,
            reviews: 342,
            timeToPrep: "20 min",
            badge: "Best Seller",
            quantity: 0
        },
        {
            id: 2,
            name: "Truffle Mushroom Risotto",
            description: "Creamy Arborio rice with wild mushrooms, truffle oil, and shaved Parmesan",
            price: "$16.50",
            img: "/Images/sandwich.jpg",
            rating: 4.8,
            reviews: 216,
            timeToPrep: "25 min",
            badge: "Chef's Choice",
            quantity: 0
        },
        {
            id: 3,
            name: "Mediterranean Salmon Bowl",
            description: "Grilled salmon with quinoa, cucumber, cherry tomatoes, feta, olives and lemon-dill dressing",
            price: "$21.00",
            originalPrice: "$24.00",
            img: "/Images/sandwich.jpg",
            rating: 4.9,
            reviews: 189,
            timeToPrep: "18 min",
            badge: "Healthy",
            quantity: 0
        },
        {
            id: 4,
            name: "Korean Fried Chicken",
            description: "Crispy double-fried chicken tossed in a sweet and spicy gochujang glaze with sesame seeds",
            price: "$15.75",
            img: "/Images/sandwich.jpg",
            rating: 4.7,
            reviews: 275,
            timeToPrep: "15 min",
            badge: "Popular",
            quantity: 0
        }
    ]);

    // Function to handle adding to cart
    const addToCart = (id) => {
        setTopDishes(topDishes.map(dish => {
            if (dish.id === id) {
                return { ...dish, quantity: dish.quantity + 1 };
            }
            return dish;
        }));
        // Here you would also update your cart context/state
    };

    // Function to handle quantity changes
    const updateQuantity = (id, change) => {
        setTopDishes(topDishes.map(dish => {
            if (dish.id === id) {
                const newQuantity = Math.max(0, dish.quantity + change);
                return { ...dish, quantity: newQuantity };
            }
            return dish;
        }));
    };

    // Get badge icon based on badge type
    const getBadgeIcon = (badge) => {
        switch (badge) {
            case 'Best Seller':
                return <TrendingUp className="w-3 h-3" />;
            case 'Chef\'s Choice':
                return <Award className="w-3 h-3" />;
            case 'Healthy':
                return <Star className="w-3 h-3" />;
            default:
                return <TrendingUp className="w-3 h-3" />;
        }
    };

    const getBadgeColor = (badge) => {
        switch (badge) {
            case 'Best Seller':
                return 'bg-red-500';
            case 'Chef\'s Choice':
                return 'bg-purple-500';
            case 'Healthy':
                return 'bg-green-500';
            default:
                return 'bg-orange-500';
        }
    };

    return (
        <section className="py-16 px-4 sm:px-8 lg:px-12 bg-white relative">
            {/* Background decoration */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-orange-50 -z-10"></div>

            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="mb-12 relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h4 className="uppercase tracking-wider text-orange-600 font-semibold text-sm">Highly Rated</h4>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Most Loved Dishes</h2>
                    <p className="text-gray-600 max-w-2xl">
                        Our customers' favorites with exceptional ratings and reviews. These signature dishes have earned their spot as the stars of our menu.
                    </p>
                    <div className="h-1 w-20 bg-orange-500 mt-6"></div>
                </div>

                {/* Top Dishes - Alternative Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {topDishes.map((dish) => (
                        <div key={dish.id} className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full">
                            {/* Image Side */}
                            <div className="relative w-full sm:w-2/5 h-60 sm:h-auto">
                                <Image
                                    src={dish.img}
                                    alt={dish.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                    priority
                                />
                                {/* Badge */}
                                <div className={`absolute top-4 left-4 ${getBadgeColor(dish.badge)} text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
                                    {getBadgeIcon(dish.badge)}
                                    <span>{dish.badge}</span>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full sm:w-3/5 p-5 sm:p-6 flex flex-col">
                                {/* Top row - Title and Rating */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 hover:text-orange-600 transition-colors">
                                        {dish.name}
                                    </h3>
                                    <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">{dish.rating}</span>
                                        <span className="text-xs text-gray-500 ml-1">({dish.reviews})</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{dish.description}</p>

                                {/* Time to prepare */}
                                <div className="flex items-center mb-4 text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span className="text-xs">{dish.timeToPrep}</span>
                                </div>

                                {/* Price and action */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-end">
                                        <span className="text-lg font-bold text-gray-900">{dish.price}</span>
                                        {dish.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through ml-2">{dish.originalPrice}</span>
                                        )}
                                    </div>

                                    {dish.quantity > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(dish.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                aria-label={`Decrease quantity for ${dish.name}`}
                                            >
                                                -
                                            </button>
                                            <span className="text-gray-800 font-medium">{dish.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(dish.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                aria-label={`Increase quantity for ${dish.name}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(dish.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors"
                                            aria-label={`Add ${dish.name} to cart`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="flex justify-center mt-12">
                    <button className="group flex items-center gap-2 px-6 py-3 bg-white border border-orange-300 hover:border-orange-500 text-orange-600 hover:bg-orange-50 rounded-full font-medium transition-all shadow-sm">
                        View All Top Rated Dishes
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}