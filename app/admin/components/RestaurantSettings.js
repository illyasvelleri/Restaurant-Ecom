// components/RestaurantSettings.jsx

export default function RestaurantSettings({ restaurantData, setRestaurantData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
          <input
            type="text"
            value={restaurantData.name}
            onChange={e => setRestaurantData({...restaurantData, name: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
          <input
            type="tel"
            value={restaurantData.whatsapp}
            onChange={e => setRestaurantData({...restaurantData, whatsapp: e.target.value})}
            placeholder="+966 50 123 4567"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={restaurantData.email}
            onChange={e => setRestaurantData({...restaurantData, email: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={restaurantData.phone}
            onChange={e => setRestaurantData({...restaurantData, phone: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={restaurantData.address}
            onChange={e => setRestaurantData({...restaurantData, address: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={restaurantData.website}
            onChange={e => setRestaurantData({...restaurantData, website: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}