import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Order({ auth, products = [], categories = [], units = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [selectedUnit, setSelectedUnit] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (priceRange.min < 0) return;
        if (priceRange.max < priceRange.min) return;

        const debounceTimeout = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('order.index'),
                {
                    category: selectedCategory,
                    min_price: priceRange.min || null,
                    max_price: priceRange.max || null,
                    unit: selectedUnit
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onSuccess: () => setIsLoading(false),
                    onError: () => setIsLoading(false)
                }
            );
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [selectedCategory, priceRange, selectedUnit]);

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Order</h2>
                </div>
            }
        >
            <Head title="Order" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar Filter */}
                        <div className="w-64 shrink-0">
                            <div className="p-4 bg-white rounded-lg shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold">Filter Products</h3>

                                {/* Category Filter */}
                                <div className="mb-6">
                                    <h4 className="mb-2 font-medium">Category</h4>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                        disabled={isLoading}
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="mb-6">
                                    <h4 className="mb-2 font-medium">Price Range</h4>
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                                            placeholder="Min Price"
                                            className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                            disabled={isLoading}
                                        />
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                                            placeholder="Max Price"
                                            className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Unit Filter */}
                                <div className="mb-6">
                                    <h4 className="mb-2 font-medium">Unit</h4>
                                    <select
                                        value={selectedUnit}
                                        onChange={(e) => setSelectedUnit(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                        disabled={isLoading}
                                    >
                                        <option value="all">All Units</option>
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="overflow-hidden flex-1 bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="w-8 h-8 rounded-full border-b-2 animate-spin border-primary"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                        {products.length > 0 ? products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex overflow-hidden flex-col bg-white rounded-lg border border-gray-200 shadow-md cursor-pointer"
                                                onClick={() => router.visit(route('product.show', product.slug))}
                                            >
                                                <div className="overflow-hidden w-full bg-gray-200 rounded-t-lg aspect-square">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="object-cover object-center w-full h-full"
                                                        />
                                                    </div>
                                                <div className="p-3">
                                                    <h3 className="mb-1 text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                                                    <div>
                                                        <span className="text-base font-bold text-primary">
                                                            Rp {(product.online_price || 0).toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-gray-600">/{product.unit.unit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="col-span-full py-8 text-center text-gray-500">
                                                Tidak ada produk yang tersedia
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
