import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Box, Container, Paper, Typography, Stack } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <Stack direction="row" alignItems="center" spacing={2}>
                    <PersonOutlineIcon sx={{ fontSize: 32, color: '#C5A059' }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                        Profil Saya
                    </Typography>
                </Stack>
            }
        >
            <Head title="Profil" />

            <Box sx={{ py: 4, minHeight: '100vh', backgroundColor: '#000000' }}>
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 4 }, 
                                borderRadius: 4, 
                                backgroundColor: '#1A1A1A',
                                border: '1px solid #333333',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                        >
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </Paper>

                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 4 }, 
                                borderRadius: 4, 
                                backgroundColor: '#1A1A1A',
                                border: '1px solid #333333',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                        >
                            <UpdatePasswordForm />
                        </Paper>
                    </Stack>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
