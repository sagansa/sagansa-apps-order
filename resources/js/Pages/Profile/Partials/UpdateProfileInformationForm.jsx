import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Box, TextField, Button, Typography, Stack, Alert } from '@mui/material'; // Import MUI components
import MuiLink from '@mui/material/Link'; // Import MUI Link for consistency

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box component="section">
            <Box component="header" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: '600', color: '#FFFFFF', letterSpacing: '-0.025em' }}>
                    Informasi Profil
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: '#A0A0A0' }}>
                    Perbarui nama profil akun Anda.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={submit}
                sx={{ mt: 2 }}
            >
                <Stack spacing={3}>
                    <TextField
                        id="name"
                        label="Nama Lengkap"
                        variant="outlined"
                        fullWidth
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        error={!!errors.name}
                        helperText={errors.name}
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
                        id="email"
                        label="Alamat Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={data.email}
                        disabled
                        autoComplete="username"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                color: '#888888',
                                '& fieldset': { borderColor: '#333333' },
                            },
                            '& .MuiInputLabel-root': { color: '#666666' },
                        }}
                    />
                </Stack>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert 
                        severity="info" 
                        sx={{ 
                            mt: 3, 
                            borderRadius: 2,
                            backgroundColor: 'rgba(197, 160, 89, 0.1)',
                            border: '1px solid rgba(197, 160, 89, 0.2)',
                            color: '#C5A059',
                            '& .MuiAlert-icon': { color: '#C5A059' }
                        }}
                    >
                        <Typography variant="body2">
                            Alamat email Anda belum terverifikasi.
                            <MuiLink
                                component={Link}
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                sx={{
                                    ml: 1,
                                    fontWeight: '600',
                                    color: '#C5A059',
                                    textDecoration: 'underline',
                                    '&:hover': { color: '#D4AF37' },
                                    background: 'none',
                                    border: 'none',
                                    p: 0,
                                    cursor: 'pointer',
                                    fontSize: 'inherit'
                                }}
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </MuiLink>
                        </Typography>

                        {status === 'verification-link-sent' && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'medium', color: '#4CAF50' }}>
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </Typography>
                        )}
                    </Alert>
                )}

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
                        Simpan Perubahan
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'medium' }}>
                            Berhasil disimpan.
                        </Typography>
                    </Transition>
                </Box>
            </Box>
        </Box>
    );
}
