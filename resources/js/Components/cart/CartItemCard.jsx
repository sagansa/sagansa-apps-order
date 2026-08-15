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

const resolveItemData = (item) => {
    return item.productOnlineGroup || item.product || {};
};

const CartItemCard = ({
    item,
    quantities,
    handleQuantityChange,
    handleQuantityInput,
    handleDeleteItem,
    isMobile = false,
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
                transition: "all 0.2s ease-in-out",
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
                        src={resolved.image_url || resolved.image || "/images/no_image.png"}
                        imgProps={{
                            onError: (e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/no_image.png";
                            }
                        }}
                        sx={{
                            width: isMobile ? 70 : { xs: 60, sm: 90 },
                            height: isMobile ? 70 : { xs: 60, sm: 90 },
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: "bold",
                                fontSize: isMobile
                                    ? "1rem"
                                    : { xs: "1rem", sm: "1.1rem" },
                                mb: 0.5,
                            }}
                        >
                            {resolved.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ letterSpacing: "0.5px" }}
                            >
                                Rp {Number(pricePerUnit)?.toLocaleString('id-ID', { maximumFractionDigits: 0 })} /{" "}
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
                                        color: isLowStock ? "warning.main" : "text.secondary",
                                        borderColor: isLowStock ? "warning.main" : "divider",
                                    }}
                                />
                            )}
                            {isOutOfStock && (
                                <Chip
                                    label="Stok Habis"
                                    size="small"
                                    color="error"
                                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: "bold" }}
                                />
                            )}
                        </Stack>
                        {isExceeded && (
                            <Typography
                                variant="caption"
                                sx={{ color: "error.main", fontWeight: 600, display: "block", mt: 0.5 }}
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
                                        {priceTiers.map(
                                            (tier, index) => (
                                                <Typography
                                                    key={index}
                                                    variant="body2"
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 2,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <span>
                                                        {tier.label ||
                                                            `${tier.min_quantity}-${tier.max_quantity || "∞"} unit`}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "#C6A96B",
                                                        }}
                                                    >
                                                        Rp{" "}
                                                        {Number(tier.price).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                    </span>
                                                </Typography>
                                            )
                                        )}
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
                                    <InfoIcon
                                        sx={{ fontSize: 14, mr: 0.5 }}
                                    />
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
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            size="small"
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
                                width: isMobile ? "80px" : "90px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
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
                    <Box sx={{ textAlign: "right", flexGrow: 1, px: 2 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem", mb: -0.5 }}
                        >
                            Subtotal Item
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "900", color: "#C6A96B" }}
                        >
                            Rp{" "}
                            {Number(currentQuantity * pricePerUnit)?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </Typography>
                    </Box>
                    <IconButton
                        color="error"
                        aria-label="hapus"
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                        sx={{
                            bgcolor: "rgba(211, 47, 47, 0.05)",
                            "&:hover": { bgcolor: "rgba(211, 47, 47, 0.15)" },
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
