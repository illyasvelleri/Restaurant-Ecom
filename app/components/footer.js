"use client";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Logo & Description */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">I</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Indulge</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Fresh food delivered fast to your doorstep. Experience the best flavors of your favorite restaurants in minutes.
                    </p>
                    {/* Social Icons */}
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>
                            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
                        </li>
                        <li>
                            <a href="/menu" className="hover:text-orange-500 transition-colors">Menu</a>
                        </li>
                        <li>
                            <a href="/cart" className="hover:text-orange-500 transition-colors">Cart</a>
                        </li>
                        <li>
                            <a href="/profile" className="hover:text-orange-500 transition-colors">Profile</a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Subscription */}
                <div>
                    <h3 className="text-gray-900 font-semibold mb-4">Subscribe</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Get updates about our latest offers and new dishes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
                        />
                        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100 mt-8 py-4">
                <p className="text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Indulge. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
