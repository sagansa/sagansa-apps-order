import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { engineeringPrimaryBlue, engineeringSecondaryBlue } from '@/constants/colors';
import Footer from '@/Components/Footer';

export default function WelcomeEngineering({ auth, products = [] }) {
    // Products are already filtered in the backend
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Sagansa Engineering</h2>
                </div>
            }
        >
            <Head title="Sagansa Engineering" />
            {/* Hero Section */}
            <section className="overflow-hidden relative px-4 py-24 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                <div className="relative mx-auto">
                    <div className="text-center">
                        <h1 style={{ color: engineeringPrimaryBlue }} className="mb-6 text-4xl font-bold md:text-6xl">
                            Solusi EV Charging & Software Development
                        </h1>
                        <p style={{ color: engineeringPrimaryBlue }} className="mb-8 text-xl opacity-90">
                            Menyediakan layanan pemasangan EV charging, grounding, dan pengembangan aplikasi berkualitas tinggi
                        </p>
                        <Link
                            href="/order"
                            style={{ backgroundColor: engineeringPrimaryBlue }}
                            className="px-8 py-3 font-semibold text-white rounded-lg transition duration-300 hover:opacity-90"
                        >
                            Konsultasi Sekarang
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <h2 style={{ color: engineeringPrimaryBlue }} className="mb-12 text-3xl font-bold text-center">
                        Layanan Kami
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">⚡</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                EV Charging
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Solusi lengkap untuk instalasi dan perawatan charging station kendaraan listrik
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">⚡</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                Grounding System
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Instalasi sistem grounding yang aman dan handal untuk charging station
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">💻</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                Software Development
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Pengembangan aplikasi web dan mobile untuk mendukung bisnis Anda
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
                        <div>
                            <h2 style={{ color: engineeringPrimaryBlue }} className="mb-6 text-3xl font-bold">
                                Tentang Sagansa Engineering
                            </h2>
                            <p style={{ color: engineeringPrimaryBlue }} className="mb-4 opacity-90">
                                Sagansa Engineering adalah penyedia solusi EV charging dan pengembangan software terkemuka
                                yang berkomitmen untuk memberikan layanan berkualitas tinggi untuk kebutuhan bisnis Anda.
                            </p>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Dengan tim ahli berpengalaman dalam instalasi charging station dan pengembangan aplikasi,
                                kami siap membantu mengoptimalkan infrastruktur EV dan solusi digital Anda.
                            </p>
                        </div>
                        <div className="flex justify-center items-center p-6 h-64 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
                            <div className="text-4xl">⚙️ 🔧 📊</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 dark:bg-gray-900 md:px-8 lg:px-16">
                <div className="mx-auto">
                    <h2 style={{ color: engineeringPrimaryBlue }} className="mb-12 text-3xl font-bold text-center">
                        Proyek Unggulan
                    </h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Instalasi EV Charging
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pemasangan charging station dengan sistem grounding yang handal untuk berbagai lokasi
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Aplikasi Monitoring
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pengembangan sistem monitoring charging station berbasis web dan mobile
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Custom Software
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pengembangan aplikasi khusus sesuai kebutuhan bisnis Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </Layout>
    );
}
