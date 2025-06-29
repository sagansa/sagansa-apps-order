import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import {
    AppBar, Toolbar, IconButton, Button, Box, Container, Typography, Drawer,
    ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuItems from '@/Components/Layout/MenuItems';
import UserMenu from '@/Components/Layout/UserMenu';
import { primaryGreen, secondaryGreen } from '@/constants/colors'; // Re-add import

export default function BaseLayout({ children, header, isAuthenticated, user, primaryColor, secondaryColor, ...rest }) {
    const [mode, setMode] = useState('light');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setMode(savedTheme);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setMode(mediaQuery.matches ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: primaryColor || primaryGreen,
                    },
                    secondary: {
                        main: secondaryColor || secondaryGreen,
                    },
                },
            }),
        [mode, primaryColor, secondaryColor],
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleDarkMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }} {...rest}>
                <AppBar position="static" color="primary">
                    <Container maxWidth="lg">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                                <ApplicationLogo className="w-auto h-9" />
                            </Link>

                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    href={route('order.index')}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Our Product
                                </Button>
                            </Box>

                            {isAuthenticated && (
                                <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route('dashboard')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Dashboard
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
                                {isAuthenticated && (
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route('transaction.history')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Transaction History
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    sx={{ ml: 1 }}
                                    onClick={toggleDarkMode}
                                    color="inherit"
                                >
                                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>

                                <UserMenu user={user} isAuthenticated={isAuthenticated} />
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 240,
                        },
                    }}
                >
                    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ my: 2 }}>
                            Menu
                        </Typography>
                        <MenuItems isAuthenticated={isAuthenticated} onItemClick={handleDrawerToggle} />
                    </Box>
                </Drawer>

                {header && (
                    <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, py: 3 }}>
                        <Container maxWidth="lg">
                            {header}
                        </Container>
                    </Box>
                )}

                <Box component="main" sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    p: 3
                }}>
                    <Container maxWidth="lg">
                        {children}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
