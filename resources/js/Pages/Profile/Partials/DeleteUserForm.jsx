import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Box, Button, Typography, TextField, Stack,
    Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material'; // Import MUI components

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
        // Ensure password input is focused when modal opens
        setTimeout(() => passwordInput.current?.focus(), 100);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <Box component="section">
            <Box component="header" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: '600', color: 'error.main', letterSpacing: '-0.025em' }}>
                    Hapus Akun
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', opacity: 0.8 }}>
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Sebelum menghapus akun Anda, harap unduh data atau informasi apa pun yang ingin Anda simpan.
                </Typography>
            </Box>

            <Button 
                variant="contained" 
                color="error" 
                onClick={confirmUserDeletion}
                sx={{ 
                    mt: 2,
                    px: 4, 
                    py: 1, 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontWeight: '600',
                    boxShadow: 'none',
                    backgroundColor: 'error.main',
                    '&:hover': { backgroundColor: 'error.dark', boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)' }
                }}
            >
                Hapus Akun
            </Button>

            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: '600', color: 'text.primary' }}>
                        Apakah Anda yakin ingin menghapus akun?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. Harap masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="password"
                            label="Kata Sandi"
                            type="password"
                            name="password"
                            fullWidth
                            inputRef={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        onClick={closeModal}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: '600', px: 3 }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteUser}
                        disabled={processing}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontWeight: '600', 
                            boxShadow: 'none',
                            px: 3,
                            backgroundColor: 'error.main',
                            '&:hover': { backgroundColor: 'error.dark' }
                        }}
                    >
                        Hapus Akun
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
