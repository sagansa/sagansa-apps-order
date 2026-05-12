import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, useForm } from '@inertiajs/react';
import {
    TextField, Button, Box, Typography, Container, Paper, Stack
} from '@mui/material';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        mt: 8,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#1A1A1A',
                        borderRadius: 4,
                        border: '1px solid #333333',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}
                >
                    <ApplicationLogo sx={{ mb: 2, width: 70, height: 70 }} />
                    <Typography component="h1" variant="h4" sx={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.05em', textAlign: 'center' }}>
                        Atur Ulang Sandi
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 2, mb: 4, color: '#A0A0A0', textAlign: 'center' }}>
                        Silakan masukkan kata sandi baru Anda di bawah ini.
                    </Typography>

                    <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
                        <Stack spacing={3}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Alamat Email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        color: '#FFFFFF',
                                        '& fieldset': { borderColor: '#444444' },
                                        '&:hover fieldset': { borderColor: '#C5A059' },
                                        '&.Mui-focused fieldset': { borderColor: '#C5A059' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888888' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C5A059' },
                                }}
                            />

                            <TextField
                                required
                                fullWidth
                                id="password"
                                label="Kata Sandi Baru"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                autoFocus
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        color: '#FFFFFF',
                                        '& fieldset': { borderColor: '#444444' },
                                        '&:hover fieldset': { borderColor: '#C5A059' },
                                        '&.Mui-focused fieldset': { borderColor: '#C5A059' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888888' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C5A059' },
                                }}
                            />

                            <TextField
                                required
                                fullWidth
                                id="password_confirmation"
                                label="Konfirmasi Kata Sandi"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                error={!!errors.password_confirmation}
                                helperText={errors.password_confirmation}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        color: '#FFFFFF',
                                        '& fieldset': { borderColor: '#444444' },
                                        '&:hover fieldset': { borderColor: '#C5A059' },
                                        '&.Mui-focused fieldset': { borderColor: '#C5A059' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888888' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C5A059' },
                                }}
                            />
                        </Stack>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={processing}
                            sx={{ 
                                mt: 5,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: '700',
                                backgroundColor: '#C5A059',
                                color: '#000000',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#D4AF37', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.4)' },
                                '&:disabled': { backgroundColor: '#444444', color: '#888888' }
                            }}
                        >
                            Reset Kata Sandi
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </GuestLayout>
    );
}
