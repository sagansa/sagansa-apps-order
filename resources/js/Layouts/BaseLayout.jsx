import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Box, Container, useTheme, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function BaseLayout({ children, header, isAuthenticated, user, rightContent, drawerContent }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setDarkMode(mediaQuery.matches);
        }
    }, []);

    useEffect(() => {
        // Update document class and localStorage
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: darkMode ? 'grey.900' : 'grey.100' }}>
            <AppBar position="static" color={darkMode ? 'default' : 'primary'} sx={{ bgcolor: darkMode ? 'grey.900' : 'primary.main' }}>
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

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                sx={{ ml: 1 }}
                                onClick={() => setDarkMode(!darkMode)}
                                color="inherit"
                            >
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>

                            {rightContent}
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
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        Menu
                    </Typography>
                    {drawerContent}
                </Box>
            </Drawer>

            {header && (
                <Box sx={{ bgcolor: darkMode ? 'grey.800' : 'white', boxShadow: 1, py: 3 }}>
                    <Container maxWidth="lg">
                        {header}
                    </Container>
                </Box>
            )}

            <Box component="main" sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3
            }}>
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
