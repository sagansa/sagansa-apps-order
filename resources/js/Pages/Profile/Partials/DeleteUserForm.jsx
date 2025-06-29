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
            <Box component="header" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    Delete Account
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
                </Typography>
            </Box>

            <Button variant="contained" color="error" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                        Are you sure you want to delete your account?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <TextField
                            id="password"
                            label="Password"
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
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '& .MuiInputLabel-outlined.Mui-focused': {
                                    color: 'text.primary',
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button variant="outlined" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteUser}
                        disabled={processing}
                        sx={{ ml: 1 }}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
