import { Link } from '@inertiajs/react';
import { textPrimary } from '@/constants/colors';
import { Container, Grid, Typography, IconButton, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    return (
        <Box component="footer" sx={{ py: 6, bgcolor: 'grey.900', color: 'white' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>Sagansa</Typography>
                        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>Solusi Terpercaya untuk Kebutuhan Bisnis Anda</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon fontSize="small" />
                                <Typography variant="body2">Jl. Penggilingan Raya No 64, Jakarta Timur</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" />
                                <Typography variant="body2">+62 85775644322</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon fontSize="small" />
                                <Typography variant="body2">info@sagansa.id</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>Layanan</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/food" style={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: textPrimary } }}>
                                <Typography variant="body2">Sagansa Food</Typography>
                            </Link>
                            <Link href="/engineering" style={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: textPrimary } }}>
                                <Typography variant="body2">Sagansa Engineering</Typography>
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>Dukungan</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/faq" style={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: textPrimary } }}>
                                <Typography variant="body2">FAQ</Typography>
                            </Link>
                            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: textPrimary } }}>
                                <Typography variant="body2">Syarat & Ketentuan</Typography>
                            </Link>
                            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: textPrimary } }}>
                                <Typography variant="body2">Kebijakan Privasi</Typography>
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>Ikuti Kami</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <IconButton
                                href="https://facebook.com/sagansa"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'white', '&:hover': { color: textPrimary } }}
                            >
                                <FacebookIcon />
                            </IconButton>
                            <IconButton
                                href="https://instagram.com/sagansa"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'white', '&:hover': { color: textPrimary } }}
                            >
                                <InstagramIcon />
                            </IconButton>
                            <IconButton
                                href="https://linkedin.com/company/sagansa"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'white', '&:hover': { color: textPrimary } }}
                            >
                                <LinkedInIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ pt: 3, textAlign: 'center', borderTop: 1, borderColor: 'grey.800' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        © {new Date().getFullYear()} Sagansa. Hak Cipta Dilindungi.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
