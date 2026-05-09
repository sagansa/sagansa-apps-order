import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    Container,
    Typography,
    Drawer,
    CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuItems from "@/Components/Layout/MenuItems";
import UserMenu from "@/Components/Layout/UserMenu";
import { primaryGreen, secondaryGreen, brandBlack, brandGold } from "@/constants/colors";

export default function BaseLayout({
    children,
    header,
    isAuthenticated,
    user,
    primaryColor,
    secondaryColor,
    ...rest
}) {
    const [mode, setMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme;
        } else {
            // Determine initial mode based on time of day (e.g., 6 AM to 6 PM is light)
            const hour = new Date().getHours();
            return hour >= 6 && hour < 18 ? "light" : "dark";
        }
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    // Optional: Add an effect to update mode if time passes a threshold while app is open
    useEffect(() => {
        const checkTimeForTheme = () => {
            const hour = new Date().getHours();
            const newMode = hour >= 6 && hour < 18 ? "light" : "dark";
            // Only update if current mode is not manually set and needs to change
            if (!localStorage.getItem("theme") && newMode !== mode) {
                setMode(newMode);
            }
        };

        const intervalId = setInterval(checkTimeForTheme, 60 * 60 * 1000); // Check every hour
        return () => clearInterval(intervalId);
    }, [mode]); // Dependency on mode to re-evaluate interval if mode changes manually

    const theme = useMemo(() => {
        const actualMode = mode === "dark" ? "dark" : "light";
        return createTheme({
            palette: {
                mode: actualMode,
                primary: {
                    main: primaryColor ?? "#C6A96B",
                    contrastText: "#0A0A0A",
                },
                secondary: {
                    main: secondaryColor ?? "#0A0A0A",
                    contrastText: "#FFFFFF",
                },
                background: {
                    default: actualMode === "light" ? "#f5f5f5" : "#0A0A0A",
                    paper: actualMode === "light" ? "#ffffff" : "#141414",
                },
                text: {
                    primary: actualMode === "light" ? "#0A0A0A" : "#ffffff",
                    secondary: actualMode === "light" ? "#666666" : "#999999",
                },
                action: {
                    hover: actualMode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                },
                error: {
                    main: "#d32f2f",
                },
                warning: {
                    main: "#ed6c02",
                },
                info: {
                    main: "#0288d1",
                },
                success: {
                    main: "#2e7d32",
                },
            },
        });
    }, [mode, primaryColor, secondaryColor]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleDarkMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
                {...rest}
            >
                <AppBar position="static" color="primary">
                    <Container maxWidth="lg">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: "none" } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Link
                                href="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <ApplicationLogo
                                    sx={{ width: 50, height: 50 }}
                                />
                            </Link>

                            <Box
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    ml: 4,
                                }}
                            >
                                <Button
                                    color="inherit"
                                    component={Link}
                                    href={route("order.index")}
                                    sx={{ textTransform: "none" }}
                                >
                                    Order
                                </Button>
                            </Box>

                            {isAuthenticated && (
                                <Box
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                        ml: 4,
                                    }}
                                >
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route("dashboard")}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Dashboard
                                    </Button>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                    ml: 4,
                                }}
                            >
                                {isAuthenticated && (
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        href={route("transaction.history")}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Transaction History
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconButton
                                    sx={{ ml: 1 }}
                                    onClick={toggleDarkMode}
                                    color="inherit"
                                >
                                    {mode === "dark" ? (
                                        <Brightness7Icon />
                                    ) : (
                                        <Brightness4Icon />
                                    )}
                                </IconButton>

                                <UserMenu
                                    user={user}
                                    isAuthenticated={isAuthenticated}
                                />
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
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 240,
                        },
                    }}
                >
                    <Box
                        onClick={handleDrawerToggle}
                        sx={{ textAlign: "center" }}
                    >
                        <Typography variant="h6" sx={{ my: 2 }}>
                            Menu
                        </Typography>
                        <MenuItems
                            isAuthenticated={isAuthenticated}
                            onItemClick={handleDrawerToggle}
                        />
                    </Box>
                </Drawer>

                {header && (
                    <Box
                        sx={{
                            bgcolor: "background.paper",
                            boxShadow: 1,
                            py: 3,
                        }}
                    >
                        <Container maxWidth="lg">{header}</Container>
                    </Box>
                )}

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: { xs: 0.5, sm: 1 }, // Reduced horizontal padding for smaller screens
                        py: 3, // Keep vertical padding
                    }}
                >
                    <Container disableGutters={true}>
                        {" "}
                        {/* Remove default Container gutters */}
                        {children}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
