import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerLayout from '@/Layouts/GuestLayout';
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ShareIcon, MinusIcon, PlusIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
export default function ProductDetail({ auth, product }) {
    const [quantity, setQuantity] = useState(1);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback untuk browser yang tidak mendukung Web Share API
            toast.error('Sharing tidak didukung di browser ini');
        }
    };

    const handleAddToCart = () => {
        if (!auth?.user) {
            window.location.href = route('login');
            return;
        }

        const cartData = {
            product_id: product.id,
            quantity: quantity,
            user_id: auth.user.id
        };

        console.log('Data yang akan dikirim ke server:', cartData);

        router.post(route('cart.store'), cartData, {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Respons sukses dari server:', response);
                toast.success(`${quantity} ${product.name} ditambahkan ke keranjang`);
            },
            onError: (errors) => {
                console.error('Data lengkap error dari server:', errors);
                toast.error(errors.message || 'Gagal menambahkan ke keranjang');
            }
        });
    };

    const images = product.images && product.images.length > 0
        ? product.images.map(img => img.image_url)
        : [product.image_url];

    const Layout = auth?.user ? AuthenticatedLayout : CustomerLayout;

    return (
        <Layout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Product Detail</h2>
                </div>
            }
        >
            <Head title={product.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 transition-all duration-300 hover:scale-[1.01]">
                        <div className="p-6">
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div className="w-full md:w-1/2">
                                    <div className="overflow-hidden w-full bg-gray-200 rounded-lg shadow-lg">
                                        <div className="transition-all duration-300 hover:scale-105">
                                            <Carousel
                                                showArrows={true}
                                                showStatus={false}
                                                showThumbs={true}
                                                infiniteLoop={true}
                                                className="product-carousel"
                                            >
                                                {images.map((image, index) => (
                                                    <div key={index} className="aspect-square">
                                                        <img
                                                            src={image}
                                                            alt={`${product.name} - ${index + 1}`}
                                                            className="object-cover object-center w-full h-full"
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white animate-fade-in">
                                        {product.name}
                                    </h2>

                                    <div className="flex flex-wrap gap-4 items-center mt-6">
                                        <div className="flex gap-2 items-center p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-1 text-gray-600 hover:text-primary"
                                            >
                                                <MinusIcon className="w-5 h-5" />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center bg-transparent border-none focus:ring-0"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-1 text-gray-600 hover:text-primary"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="p-4 mb-4 bg-gray-50 rounded-lg dark:bg-gray-700 animate-scale-in">
                                            <div className="mb-2">
                                                <span className="text-3xl font-bold text-primary">
                                                    Rp {(product?.online_price || 0).toLocaleString()}
                                                </span>
                                                <span className="text-lg text-gray-600 dark:text-gray-400">/{product?.unit?.unit || 'pcs'}</span>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Total: <span className="text-2xl font-bold text-primary">Rp {((product?.online_price || 0) * quantity).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="flex gap-2 items-center px-6 py-2 text-white rounded-lg transition-all duration-300 transform bg-primary hover:bg-primary/90 hover:scale-105"
                                        >
                                            <ShoppingCartIcon className="w-5 h-5" />
                                            Add to Cart
                                        </button>

                                        <button
                                            onClick={handleShare}
                                            className="p-2 text-gray-600 bg-gray-100 rounded-lg transition-all duration-300 transform hover:text-primary hover:bg-gray-200 hover:scale-105 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                        >
                                            <ShareIcon className="w-5 h-5" />
                                        </button>


                                    </div>
                                    <div className="p-4 mt-6 bg-gray-50 rounded-lg dark:bg-gray-700">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Deskripsi Produk</h3>
                                        <p className="leading-relaxed text-gray-600 dark:text-gray-400">{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
