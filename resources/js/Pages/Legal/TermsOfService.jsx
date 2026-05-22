import BaseLayout from "@/Layouts/BaseLayout";
import { Head } from "@inertiajs/react";
import { Container, Typography, Box, Paper, Divider, Button } from "@mui/material";
import { brandGold } from "@/constants/colors";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "@inertiajs/react";

export default function TermsOfService({ auth }) {
    return (
        <BaseLayout
            user={auth.user}
            isAuthenticated={!!auth.user}
        >
            <Head title="Terms of Service - Sagansa" />

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
                        Syarat dan Ketentuan
                    </Typography>

                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 4, textAlign: 'center' }}>
                        Terakhir diperbarui: 16 Mei 2026
                    </Typography>

                    <Divider sx={{ mb: 4, bgcolor: "rgba(198, 169, 107, 0.1)" }} />

                    <Box sx={{ color: "white" }}>
                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            1. Penerimaan Syarat
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Dengan mengakses dan menggunakan platform Sagansa, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan untuk menggunakan layanan kami.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            2. Penggunaan Layanan
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda bertanggung jawab penuh atas aktivitas yang dilakukan melalui akun Anda.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            3. Akun Pengguna
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Saat Anda mendaftar menggunakan Google OAuth, Anda bertanggung jawab untuk menjaga kerahasiaan akun Anda. Anda setuju untuk segera memberitahu kami jika ada penggunaan yang tidak sah atas akun Anda.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            4. Pemesanan dan Pembayaran
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Semua pemesanan yang dilakukan melalui platform kami dianggap sebagai penawaran untuk membeli. Kami berhak menolak pesanan apa pun. Pembayaran harus dilakukan melalui metode yang kami sediakan di platform.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            5. Pembatalan dan Pengembalian
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Kebijakan pembatalan dan pengembalian dana tunduk pada syarat spesifik yang berlaku untuk masing-masing produk atau layanan yang dipesan. Silakan hubungi layanan pelanggan untuk informasi lebih lanjut.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            6. Batasan Tanggung Jawab
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Sagansa tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            7. Hak Kekayaan Intelektual
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Semua konten di platform Sagansa, termasuk teks, grafis, logo, dan kode, adalah milik Sagansa atau pemberi lisensinya dan dilindungi oleh undang-undang hak kekayaan intelektual.
                        </Typography>

                        <Typography variant="h5" gutterBottom sx={{ color: brandGold, mt: 4 }}>
                            8. Hukum yang Mengatur
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
                        </Typography>

                        <Box sx={{ mt: 6, p: 3, bgcolor: "rgba(198, 169, 107, 0.05)", borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ textAlign: "center", fontStyle: "italic" }}>
                                Jika Anda memiliki pertanyaan tentang syarat ini, silakan hubungi kami di admin@sagansa.id
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </BaseLayout>
    );
}
