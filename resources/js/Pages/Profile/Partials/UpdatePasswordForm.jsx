import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material'; // Import MUI components

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Box component="section">
            <Box component="header" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: '600', color: '#FFFFFF', letterSpacing: '-0.025em' }}>
                    Keamanan Akun
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: '#A0A0A0' }}>
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={updatePassword}
                sx={{ mt: 2 }}
            >
                <Stack spacing={3}>
                    <TextField
                        id="current_password"
                        label="Kata Sandi Saat Ini"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        error={!!errors.current_password}
                        helperText={errors.current_password}
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
                        id="password"
                        label="Kata Sandi Baru"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password}
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
                        id="password_confirmation"
                        label="Konfirmasi Kata Sandi Baru"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 5 }}>
                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={processing}
                        sx={{ 
                            px: 4, 
                            py: 1.2, 
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
                        Perbarui Kata Sandi
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'medium' }}>
                            Berhasil diperbarui.
                        </Typography>
                    </Transition>
                </Box>
            </Box>
        </Box>
    );
}
