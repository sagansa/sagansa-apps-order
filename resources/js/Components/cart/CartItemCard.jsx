import React from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    TextField,
    Avatar,
    Stack,
    Tooltip,
    Chip,
    Divider,
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoIcon from "@mui/icons-material/Info";
import {
    getPriceByQuantity,
    getDiscountPercentage,
} from "@/Utils/cartCalculations";
import { formatIDR } from "@/Utils/currency";

const resolveItemData = (item) => {
    // Eloquent men-serialisasi nama relasi ke snake_case: relasi
    // productOnlineGroup() dikirim sebagai product_online_group.
    return item.product_online_group || item.product || {};
};

const CartItemCard = ({
    item,
    quantities,
    handleQuantityChange,
    handleQuantityInput,
    handleDeleteItem,
}) => {
    const resolved = resolveItemData(item);
    // Relasi Eloquent terserialisasi camelCase (priceTiers); beberapa halaman
    // lain mengirim mapping snake_case (price_tiers). Dukung keduanya.
    const priceTiers = resolved.priceTiers ?? resolved.price_tiers;
    const currentQuantity = quantities[item.id] || item.quantity;
    const pricePerUnit = getPriceByQuantity(
        priceTiers,
        currentQuantity,
        resolved.online_price || 0
    );
    const discountPercentage = getDiscountPercentage(
        priceTiers,
        currentQuantity
    );
    const stock = item.current_stock;
    const hasStock = stock !== null && stock !== undefined;
    const isOutOfStock = hasStock && stock === 0;
    const isExceeded = hasStock && currentQuantity > stock;
    const isLowStock = hasStock && stock > 0 && stock <= 5;

    return (
        <Card
            key={item.id}
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: isExceeded ? "error.main" : "divider",
                borderRadius: 4,
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: "#C6A96B",
                    boxShadow: "0 4px 12px rgba(198, 169, 107, 0.1)",
                },
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        variant="rounded"
                        src={
                            resolved.image_url ||
                            resolved.image ||
                            "/images/no_image.png"
                        }
                        imgProps={{
                            onError: (e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/no_image.png";
                            },
                        }}
                        sx={{
                            width: { xs: 64, sm: 88 },
                            height: { xs: 64, sm: 88 },
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
                        }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", fontSize: "1rem", mb: 0.5 }}
                        >
                            {resolved.name}
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                Rp {formatIDR(pricePerUnit)} /{" "}
                                {resolved.unit?.unit || "unit"}
                            </Typography>
                            {discountPercentage > 0 && (
                                <Chip
                                    label={`${discountPercentage}% OFF`}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                        bgcolor: "success.dark",
                                        color: "success.contrastText",
                                    }}
                                />
                            )}
                            {hasStock && !isOutOfStock && (
                                <Chip
                                    label={`Stok: ${stock}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        color: isLowStock
                                            ? "warning.main"
                                            : "text.secondary",
                                        borderColor: isLowStock
                                            ? "warning.main"
                                            : "divider",
                                    }}
                                />
                            )}
                            {isOutOfStock && (
                                <Chip
                                    label="Stok Habis"
                                    size="small"
                                    color="error"
                                    sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                    }}
                                />
                            )}
                        </Stack>
                        {isExceeded && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    fontWeight: 600,
                                    display: "block",
                                    mt: 0.5,
                                }}
                            >
                                Melebihi stok tersedia ({stock})
                            </Typography>
                        )}
                        {priceTiers?.length > 0 && (
                            <Tooltip
                                title={
                                    <Box sx={{ p: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mb: 1, fontWeight: "bold" }}
                                        >
                                            Tier Harga:
                                        </Typography>
                                        {priceTiers.map((tier, index) => (
                                            <Typography
                                                key={index}
                                                variant="body2"
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 2,
                                                    mb: 0.5,
                                                    fontVariantNumeric:
                                                        "tabular-nums",
                                                }}
                                            >
                                                <span>
                                                    {tier.label ||
                                                        `${tier.min_quantity}-${tier.max_quantity || "∞"} unit`}
                                                </span>
                                                <span style={{ color: "#C6A96B" }}>
                                                    Rp {formatIDR(tier.price)}
                                                </span>
                                            </Typography>
                                        ))}
                                    </Box>
                                }
                                arrow
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#C6A96B",
                                        cursor: "help",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        mt: 1,
                                        fontWeight: 500,
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    <InfoIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    Lihat tier harga
                                </Typography>
                            </Tooltip>
                        )}
                    </Box>
                </Stack>
                <Divider sx={{ my: 2, borderStyle: "dashed" }} />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            size="small"
                            aria-label="kurangi jumlah"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={currentQuantity <= 1}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                            value={currentQuantity}
                            onChange={(e) =>
                                handleQuantityInput(item.id, e.target.value)
                            }
                            type="number"
                            size="small"
                            sx={{
                                width: { xs: 76, sm: 90 },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                },
                                "& input": {
                                    fontVariantNumeric: "tabular-nums",
                                },
                            }}
                            inputProps={{
                                min: 1,
                                max: hasStock ? stock : undefined,
                                style: { textAlign: "center" },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {resolved.unit?.unit || "unit"}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton
                            size="small"
                            aria-label="tambah jumlah"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={hasStock && currentQuantity >= stock}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    <Box sx={{ textAlign: "right", flexGrow: 1, px: 1 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem", mb: -0.5 }}
                        >
                            Subtotal Item
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                color: "#C6A96B",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            Rp {formatIDR(currentQuantity * pricePerUnit)}
                        </Typography>
                    </Box>
                    <IconButton
                        color="error"
                        aria-label="hapus item"
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                        sx={{
                            bgcolor: "rgba(211, 47, 47, 0.05)",
                            "&:hover": {
                                bgcolor: "rgba(211, 47, 47, 0.15)",
                            },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CartItemCard;
