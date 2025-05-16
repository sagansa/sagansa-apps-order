import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header({ auth }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const theme = useTheme();

    return (
        <AppBar position="static" color={darkMode ? 'default' : 'primary'} sx={{ bgcolor: darkMode ? 'grey.900' : 'primary.main' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 0, fontWeight: 'bold' }}>
                    SagansaFood
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} href="#menu">
                        Menu
                    </Button>
                    <Button color="inherit" component={Link} href="#about">
                        About
                    </Button>

                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={() => setDarkMode(!darkMode)}
                        color="inherit"
                    >
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {auth.user ? (
                        <Button
                            variant="contained"
                            color={darkMode ? 'primary' : 'secondary'}
                            component={Link}
                            href={route('order')}
                        >
                            Order Now
                        </Button>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} href={route('login')}>
                                Log in
                            </Button>
                            <Button
                                variant="contained"
                                color={darkMode ? 'primary' : 'secondary'}
                                component={Link}
                                href={route('register')}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>

                <IconButton
                    color="inherit"
                    sx={{ display: { sm: 'none' } }}
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
