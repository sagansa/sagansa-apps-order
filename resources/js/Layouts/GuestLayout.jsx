import BaseLayout from '@/Layouts/BaseLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button, Menu, MenuItem, List, ListItem, ListItemText } from '@mui/material';

export default function GuestLayout({ children }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const rightContent = (
        <>
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
        </>
    );

    const drawerContent = (
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
    );

    return (
        <BaseLayout
            children={children}
            isAuthenticated={false}
            rightContent={rightContent}
            drawerContent={drawerContent}
        />
    );

}
