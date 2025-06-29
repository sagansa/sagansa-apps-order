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
            <Box component="header" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    Update Password
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Ensure your account is using a long, random password to stay secure.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={updatePassword}
                sx={{ mt: 4 }}
            >
                <Stack spacing={3}>
                    <TextField
                        id="current_password"
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        inputRef={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        error={!!errors.current_password}
                        helperText={errors.current_password}
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                color: 'text.primary',
                            },
                        }}
                    />

                    <TextField
                        id="password"
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        inputRef={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                color: 'text.primary',
                            },
                        }}
                    />

                    <TextField
                        id="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                color: 'text.primary',
                            },
                        }}
                    />
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
                    <Button variant="contained" disabled={processing}>Save</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <Typography variant="body2" color="text.secondary">
                            Saved.
                        </Typography>
                    </Transition>
                </Box>
            </Box>
        </Box>
    );
}
