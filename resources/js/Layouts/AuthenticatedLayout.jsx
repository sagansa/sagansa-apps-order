import BaseLayout from '@/Layouts/BaseLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { IconButton, Button, Menu, MenuItem, List, ListItem, ListItemText, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const rightContent = (
        <>
            <IconButton
                color="inherit"
                component={Link}
                href={route('cart.index')}
                sx={{ mr: 2 }}
            >
                <Badge
                    badgeContent={user.cart_count || 0}
                    color="error"
                    showZero
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            height: '20px',
                            minWidth: '20px',
                            padding: '0 4px',
                            zIndex: 1,
                            transform: 'scale(1) translate(50%, -50%)',
                        }
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Button
                color="inherit"
                onClick={handleMenu}
                sx={{ ml: 2, textTransform: 'none' }}
            >
                {user.name}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem component={Link} href={route('profile.edit')} onClick={handleClose}>
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        handleClose();
                        router.post(route('logout'));
                    }}
                    as="button"
                >
                    Log Out
                </MenuItem>
            </Menu>
        </>
    );

    const drawerContent = (
        <List>
            <ListItem component={Link} href={route('order.index')}>
                <ListItemText primary="Order" />
            </ListItem>
            <ListItem component={Link} href={route('profile.edit')}>
                <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
                component="button"
                onClick={(e) => {
                    e.preventDefault();
                    router.post(route('logout'));
                }}
            >
                <ListItemText primary="Log Out" />
            </ListItem>
        </List>
    );

    return (
        <>

            <BaseLayout
                children={children}
                header={header}
                isAuthenticated={true}
                user={user}
                rightContent={rightContent}
                drawerContent={drawerContent}
            />
        </>
    );

}
