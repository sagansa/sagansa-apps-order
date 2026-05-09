import { Typography, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InfoIcon from '@mui/icons-material/Info';
import { router } from '@inertiajs/react';
import { brandBlack, brandGold } from '@/constants/colors';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: brandGold, contrastText: brandBlack },
        secondary: { main: brandBlack, contrastText: '#FFFFFF' },
        background: { default: brandBlack, paper: '#141414' },
    },
});

export default function AdminInfo() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <InfoIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>Konfirmasi ke Admin</Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                    Admin akan segera memberikan informasi biaya ongkos kirim.<br />Silakan konfirmasi ke admin untuk melanjutkan proses pesanan Anda.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => router.visit(route('order.index'))}>Lihat Pesanan</Button>
            </Box>
        </ThemeProvider>
    );
}
