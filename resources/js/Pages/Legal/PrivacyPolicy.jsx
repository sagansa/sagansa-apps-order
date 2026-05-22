import BaseLayout from "@/Layouts/BaseLayout";
import { Head } from "@inertiajs/react";
import { Container, Typography, Box, Paper, Divider, Button } from "@mui/material";
import { brandGold } from "@/constants/colors";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "@inertiajs/react";

export default function PrivacyPolicy({ auth }) {
    return (
        <BaseLayout
            user={auth.user}
            isAuthenticated={!!auth.user}
        >
            <Head title="Privacy Policy - Sagansa" />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    onClick={() => window.history.back()}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        mb: 2,
                        textTransform: "none",
                        "&:hover": { color: brandGold }
                    }}
                >
                    Kembali
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        bgcolor: "#141414",
                        borderRadius: 4,
                        border: "1px solid rgba(198, 169, 107, 0.2)",
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            color: brandGold,
                            fontWeight: "bold",
                            textAlign: "center",
                            mb: 4,
                        }}
                    >
                        Kebijakan Privasi
                    </Typography>

                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 4, textAlign: 'center' }}>
                        Terakhir diperbarui: 16 Mei 2026
                    </Typography>

                    <Divider sx={{ mb: 4, bgcolor: "rgba(198, 169, 107, 0.1)" }} />

                    <Box sx={{ color: "white" }}>
                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            1. Pendahuluan
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Selamat datang di Sagansa. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan layanan kami.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            2. Informasi yang Kami Kumpulkan
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Kami mengumpulkan informasi minimal yang diperlukan untuk menyediakan layanan terbaik bagi Anda:
                        </Typography>
                        <Typography component="div" variant="body1" sx={{ ml: 2 }}>
                            <ul>
                                <li><strong>Informasi Profil Google:</strong> Nama lengkap, alamat email, dan foto profil yang Anda berikan melalui Google OAuth.</li>
                                <li><strong>Informasi Transaksi:</strong> Detail pesanan Anda, riwayat pembelian, dan alamat pengiriman.</li>
                                <li><strong>Informasi Kontak:</strong> Nomor telepon yang Anda berikan secara sukarela untuk membantu komunikasi terkait pesanan.</li>
                            </ul>
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            3. Penggunaan Informasi
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Informasi yang kami kumpulkan digunakan untuk:
                        </Typography>
                        <Typography component="div" variant="body1" sx={{ ml: 2 }}>
                            <ul>
                                <li>Memverifikasi identitas Anda dan membuat akun.</li>
                                <li>Memproses dan melacak pesanan Anda secara akurat.</li>
                                <li>Mengirimkan notifikasi terkait status pesanan melalui email atau kanal komunikasi yang tersedia.</li>
                                <li>Meningkatkan kualitas layanan dan pengalaman pengguna di platform kami.</li>
                            </ul>
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            4. Perlindungan Data
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Kami menerapkan standar keamanan teknis dan organisasi untuk melindungi data Anda dari akses yang tidak sah, perubahan, atau penghapusan yang tidak sah. Data Anda disimpan di server yang aman dan hanya dapat diakses oleh personel yang berwenang.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            5. Berbagi Data dengan Pihak Ketiga
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Kami <strong>tidak akan pernah</strong> menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi Anda kepada mitra layanan pihak ketiga yang diperlukan untuk memproses operasional kami (seperti penyedia gerbang pembayaran atau layanan logistik) di bawah perjanjian kerahasiaan yang ketat.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            6. Hak Anda
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Anda berhak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda kapan saja melalui pengaturan profil atau dengan menghubungi layanan pelanggan kami.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            7. Perubahan Kebijakan
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan melalui email atau pengumuman di aplikasi kami.
                        </Typography>

                        <Box sx={{ mt: 6, p: 3, bgcolor: "rgba(198, 169, 107, 0.05)", borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ textAlign: "center", fontStyle: "italic" }}>
                                Jika Anda memiliki pertanyaan tentang kebijakan ini, silakan hubungi kami di admin@sagansa.id
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </BaseLayout>
    );
}
