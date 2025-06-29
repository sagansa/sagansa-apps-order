import { Typography, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InfoIcon from '@mui/icons-material/Info';
import { router } from '@inertiajs/react';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        background: { default: '#121212', paper: '#1e1e1e' },
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
                <Button variant="contained" color="primary" onClick={() => router.visit('/order')}>Lihat Pesanan</Button>
            </Box>
        </ThemeProvider>
    );
}
