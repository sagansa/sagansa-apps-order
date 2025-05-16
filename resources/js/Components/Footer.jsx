import { Link } from '@inertiajs/react';
import { textPrimary } from '@/constants/colors';

export default function Footer() {
    return (
        <footer className="px-4 py-12 text-white bg-gray-900 md:px-8 lg:px-16">
            <div className="mx-auto">
                <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <h3 style={{ color: textPrimary }} className="mb-4 text-xl font-bold">Sagansa</h3>
                        <p className="mb-4 opacity-90">Solusi Terpercaya untuk Kebutuhan Bisnis Anda</p>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                <span className="mr-2">📍</span>
                                Jl. Penggilingan Raya No 64, Jakarta Timur
                            </p>
                            <p className="flex items-center">
                                <span className="mr-2">📞</span>
                                +62 85775644322
                            </p>
                            <p className="flex items-center">
                                <span className="mr-2">✉️</span>
                                info@sagansa.id
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: textPrimary }} className="mb-4 text-xl font-bold">Layanan</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/food" className="transition duration-300 hover:text-primary">
                                    Sagansa Food
                                </Link>
                            </li>
                            <li>
                                <Link href="/engineering" className="transition duration-300 hover:text-primary">
                                    Sagansa Engineering
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 style={{ color: textPrimary }} className="mb-4 text-xl font-bold">Dukungan</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/faq" className="transition duration-300 hover:text-primary">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="transition duration-300 hover:text-primary">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="transition duration-300 hover:text-primary">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 style={{ color: textPrimary }} className="mb-4 text-xl font-bold">Ikuti Kami</h3>
                        <div className="flex gap-4">
                            <a href="https://facebook.com/sagansa" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:text-primary">
                                <span className="text-2xl">📘</span>
                            </a>
                            <a href="https://instagram.com/sagansa" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:text-primary">
                                <span className="text-2xl">📸</span>
                            </a>
                            <a href="https://linkedin.com/company/sagansa" target="_blank" rel="noopener noreferrer" className="transition duration-300 hover:text-primary">
                                <span className="text-2xl">💼</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 text-center border-t border-gray-800">
                    <p className="opacity-90">
                        © {new Date().getFullYear()} Sagansa 2025. Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
