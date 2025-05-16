import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { primaryGreen, secondaryGreen } from '@/constants/colors';
import Footer from '@/Components/Footer';

export default function Welcome({ auth, products, categories }) {
    const filteredProducts = products.filter(product => product.online_category_id !== 4);
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Welcome</h2>
                </div>
            }
        >
                {/* Hero Section */}
                <section className="overflow-hidden relative px-4 py-24 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                    <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                    <div className="relative mx-auto">
                        <div className="text-center">
                            <h1 style={{ color: primaryGreen }} className="mb-6 text-4xl font-bold md:text-6xl">
                                Selamat Datang di Sagansa
                            </h1>
                            <p style={{ color: primaryGreen }} className="mb-8 text-xl opacity-90">
                                Solusi Terpercaya untuk Kebutuhan Bisnis Anda
                            </p>
                            <div className="flex gap-6 justify-center">
                                <Link
                                    href="/food"
                                    style={{ backgroundColor: primaryGreen }}
                                    className="flex flex-col items-center px-8 py-6 text-white rounded-lg transition duration-300 hover:opacity-90 hover:transform hover:scale-105"
                                >
                                    <span className="mb-2 text-4xl">🍽️</span>
                                    <span className="text-xl font-semibold">Sagansa Food</span>
                                    <span className="text-sm opacity-90">Supplier Makanan Berkualitas</span>
                                </Link>
                                <Link
                                    href="/engineering"
                                    style={{ backgroundColor: primaryGreen }}
                                    className="flex flex-col items-center px-8 py-6 text-white rounded-lg transition duration-300 hover:opacity-90 hover:transform hover:scale-105"
                                >
                                    <span className="mb-2 text-4xl">⚙️</span>
                                    <span className="text-xl font-semibold">Sagansa Engineering</span>
                                    <span className="text-sm opacity-90">Solusi Teknis Profesional</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                    <div className="mx-auto">
                        <h2 style={{ color: primaryGreen }} className="mb-12 text-3xl font-bold text-center">
                            Layanan Kami
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="p-8 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">🍽️</div>
                                <h3 style={{ color: primaryGreen }} className="mb-4 text-2xl font-semibold">
                                    Sagansa Food
                                </h3>
                                <p style={{ color: primaryGreen }} className="mb-6 opacity-90">
                                    Menyediakan bahan makanan berkualitas tinggi untuk restoran, hotel, dan katering. Dengan pengalaman lebih dari 10 tahun, kami menjamin kualitas dan kesegaran setiap produk.
                                </p>
                                <Link
                                    href="/food"
                                    style={{ backgroundColor: primaryGreen }}
                                    className="inline-block px-6 py-2 text-white rounded-lg transition duration-300 hover:opacity-90"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                            </div>
                            <div className="p-8 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">⚙️</div>
                                <h3 style={{ color: primaryGreen }} className="mb-4 text-2xl font-semibold">
                                    Sagansa Engineering
                                </h3>
                                <p style={{ color: primaryGreen }} className="mb-6 opacity-90">
                                    Menyediakan layanan engineering berkualitas tinggi untuk industri manufaktur dan konstruksi. Tim ahli kami siap membantu mengoptimalkan proses produksi Anda.
                                </p>
                                <Link
                                    href="/engineering"
                                    style={{ backgroundColor: primaryGreen }}
                                    className="inline-block px-6 py-2 text-white rounded-lg transition duration-300 hover:opacity-90"
                                >
                                    Pelajari Lebih Lanjut
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                    <div className="mx-auto">
                        <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
                            <div>
                                <h2 style={{ color: primaryGreen }} className="mb-6 text-3xl font-bold">
                                    Tentang Sagansa
                                </h2>
                                <p style={{ color: primaryGreen }} className="mb-4 opacity-90">
                                    Sagansa adalah perusahaan yang berkomitmen untuk memberikan solusi terbaik
                                    dalam bidang food supply dan engineering untuk mendukung pertumbuhan bisnis Anda.
                                </p>
                                <p style={{ color: primaryGreen }} className="opacity-90">
                                    Dengan pengalaman yang luas dan tim profesional, kami siap menjadi
                                    mitra terpercaya dalam mengembangkan bisnis Anda ke tingkat yang lebih tinggi.
                                </p>
                            </div>
                            <div className="flex justify-center items-center p-6 h-64 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
                                <div className="text-4xl">🏢 🤝 📈</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="px-4 py-16 bg-white transition-colors duration-300 dark:bg-gray-900 md:px-8 lg:px-16">
                    <div className="mx-auto">
                        <h2 style={{ color: primaryGreen }} className="mb-12 text-3xl font-bold text-center">
                            Mengapa Memilih Kami
                        </h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">🌟</div>
                                <h3 style={{ color: primaryGreen }} className="mb-2 text-xl font-semibold">
                                    Kualitas Terjamin
                                </h3>
                                <p style={{ color: primaryGreen }} className="opacity-90">
                                    Standar kualitas tinggi dalam setiap produk dan layanan
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">🤝</div>
                                <h3 style={{ color: primaryGreen }} className="mb-2 text-xl font-semibold">
                                    Layanan Profesional
                                </h3>
                                <p style={{ color: primaryGreen }} className="opacity-90">
                                    Tim ahli yang berpengalaman dan profesional
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">⚡</div>
                                <h3 style={{ color: primaryGreen }} className="mb-2 text-xl font-semibold">
                                    Respons Cepat
                                </h3>
                                <p style={{ color: primaryGreen }} className="opacity-90">
                                    Pelayanan cepat dan solusi yang efektif
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                                <div className="mb-4 text-4xl">💪</div>
                                <h3 style={{ color: primaryGreen }} className="mb-2 text-xl font-semibold">
                                    Dukungan Penuh
                                </h3>
                                <p style={{ color: primaryGreen }} className="opacity-90">
                                    Mendukung pertumbuhan bisnis Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
        </Layout>
    );
}
