import React from "react";
import {
    Card,
    CardContent,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputAdornment,
    Box,
    Alert,
} from "@mui/material";

const ShippingPaymentMethodSelector = ({
    shippingPaymentMethod,
    setShippingPaymentMethod,
    shippingCostAmount,
    setShippingCostAmount,
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Pembayaran Ongkos Kirim
                </Typography>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                        Metode Pembayaran Ongkos Kirim
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-label="shipping-payment-method"
                        name="shipping-payment-method"
                        value={shippingPaymentMethod}
                        onChange={(e) =>
                            setShippingPaymentMethod(e.target.value)
                        }
                    >
                        <FormControlLabel
                            value="via_us"
                            control={<Radio />}
                            label="Dibayarkan melalui kami"
                        />
                        <FormControlLabel
                            value="to_courier"
                            control={<Radio />}
                            label="Dibayarkan langsung pembeli ke kurir"
                        />
                    </RadioGroup>

                    {/* Container for dynamic shipping cost input/alert */}
                    <Box sx={{ minHeight: "80px", mt: 2 }}>
                        {/* Reserve space */}
                        {shippingPaymentMethod === "via_us" ? (
                            <TextField
                                label="Nominal Biaya Pengiriman"
                                type="number"
                                fullWidth
                                value={shippingCostAmount}
                                onFocus={(e) => {
                                    if (Number(shippingCostAmount) === 0) {
                                        setShippingCostAmount("");
                                        e.target.select();
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setShippingCostAmount(
                                        value === "" ? "" : Number(value)
                                    );
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Rp
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    min: 0,
                                }}
                            />
                        ) : shippingPaymentMethod === "to_courier" ? (
                            <Alert severity="info">
                                Nominal ongkos kirim dibayarkan langsung ke
                                kurir saat pesanan diterima.
                            </Alert>
                        ) : null}
                    </Box>
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default ShippingPaymentMethodSelector;
