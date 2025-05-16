import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Box, Container, useTheme, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function GuestLayout({ children }) {
    const [darkMode, setDarkMode] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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
                                Order
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

                            <Button
                                color="inherit"
                                onClick={handleMenu}
                                sx={{ ml: 2, textTransform: 'none' }}
                            >
                                Guest
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component={Link} href={route('login')} onClick={handleClose}>
                                    Login
                                </MenuItem>
                                <MenuItem component={Link} href={route('register')} onClick={handleClose}>
                                    Register
                                </MenuItem>
                            </Menu>
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
                    <List>
                        <ListItem button component={Link} href={route('order.index')}>
                            <ListItemText primary="Order" />
                        </ListItem>
                        <ListItem button component={Link} href={route('login')}>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem button component={Link} href={route('register')}>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

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
