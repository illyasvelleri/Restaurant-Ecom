import Image from 'next/image';

const products = [
  {
    name: 'Kala Bhuna',
    rating: 4.5,
    reviews: '1.5k',
    desc: 'Delivered within 30 mins',
    image: '/Images/Burger.png',
  },
  {
    name: 'Meat Cu',
    rating: 4.5,
    reviews: '1.5k',
    desc: 'Delivered within 30 mins',
    image: '/Images/Burger.png',
  },
  {
    name: 'Choose your Meals',
    rating: 4.5,
    reviews: '1.5k',
    desc: 'Delivered within 30 mins',
    image: '/Images/Burger.png',
  },
];

export default function ProductList() {
  return (
    <section className="bg-gray-50 py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Our Popular <span className="text-red-500 underline underline-offset-4">Dishes</span>
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-lg p-4">
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={200}
                className="rounded-2xl mb-4 w-full h-40 object-cover"
              />
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⭐ {item.rating}</span>
                <span>❤️ {item.reviews}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
