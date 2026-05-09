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
import InfoIcon from "@mui/icons-material/Info"; // Assuming this is used for product info tooltip
import {
    getPriceByQuantity,
    getDiscountPercentage,
} from "@/Utils/cartCalculations";

const CartItemCard = ({
    item,
    quantities,
    handleQuantityChange,
    handleQuantityInput,
    handleDeleteItem,
    isMobile = false, // Prop to handle mobile-specific rendering
}) => {
    const currentQuantity = quantities[item.id] || item.quantity;
    const pricePerUnit = getPriceByQuantity(
        item.product?.price_tiers,
        currentQuantity,
        item.product?.online_price || 0
    );
    const discountPercentage = getDiscountPercentage(
        item.product?.price_tiers,
        currentQuantity
    );

    return (
        <Card
            key={item.id}
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
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
                        src={item.product?.image}
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
                            {item.product?.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ letterSpacing: "0.5px" }}
                            >
                                Rp {Number(pricePerUnit)?.toLocaleString('id-ID', { maximumFractionDigits: 0 })} /{" "}
                                {item.product?.unit?.unit || "unit"}
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
                        </Stack>
                        {item.product?.price_tiers?.length > 0 && (
                            <Tooltip
                                title={
                                    <Box sx={{ p: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ mb: 1, fontWeight: "bold" }}
                                        >
                                            Tier Harga:
                                        </Typography>
                                        {item.product.price_tiers.map(
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
                                                            `${
                                                                tier.min_quantity
                                                            }-${
                                                                tier.max_quantity ||
                                                                "∞"
                                                            } unit`}
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
                        <TextField
                            value={currentQuantity}
                            onChange={(e) =>
                                handleQuantityInput(item.id, e.target.value)
                            }
                            type="number"
                            size="small"
                            sx={{
                                width: isMobile ? "100px" : "120px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                },
                            }}
                            inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {item.product?.unit?.unit || "unit"}
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
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
