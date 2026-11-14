import React from "react";
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Alert,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SectionCard from "@/Components/ui/SectionCard";
import CurrencyInput from "@/Components/ui/CurrencyInput";

const ShippingPaymentMethodSelector = ({
    shippingPaymentMethod,
    setShippingPaymentMethod,
    shippingCostAmount,
    setShippingCostAmount,
}) => {
    return (
        <SectionCard title="Pembayaran Ongkos Kirim" icon={LocalShippingIcon}>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    row
                    aria-label="shipping-payment-method"
                    name="shipping-payment-method"
                    value={shippingPaymentMethod}
                    onChange={(e) => setShippingPaymentMethod(e.target.value)}
                    sx={{ gap: 2 }}
                >
                    <FormControlLabel
                        value="via_us"
                        control={<Radio />}
                        label="Dibayarkan melalui kami"
                        sx={{
                            flex: 1,
                            m: 0,
                            border: "1px solid",
                            borderColor:
                                shippingPaymentMethod === "via_us"
                                    ? "#C6A96B"
                                    : "divider",
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            bgcolor:
                                shippingPaymentMethod === "via_us"
                                    ? "rgba(198, 169, 107, 0.05)"
                                    : "transparent",
                            transition: "all 0.2s ease",
                        }}
                    />
                    <FormControlLabel
                        value="to_courier"
                        control={<Radio />}
                        label="Dibayar langsung ke kurir"
                        sx={{
                            flex: 1,
                            m: 0,
                            border: "1px solid",
                            borderColor:
                                shippingPaymentMethod === "to_courier"
                                    ? "#C6A96B"
                                    : "divider",
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            bgcolor:
                                shippingPaymentMethod === "to_courier"
                                    ? "rgba(198, 169, 107, 0.05)"
                                    : "transparent",
                            transition: "all 0.2s ease",
                        }}
                    />
                </RadioGroup>

                <Box sx={{ minHeight: 72, mt: 2 }}>
                    {shippingPaymentMethod === "via_us" ? (
                        <CurrencyInput
                            label="Nominal Biaya Pengiriman"
                            value={shippingCostAmount}
                            onChange={setShippingCostAmount}
                            fullWidth
                        />
                    ) : shippingPaymentMethod === "to_courier" ? (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            Nominal ongkos kirim dibayarkan langsung ke kurir
                            saat pesanan diterima.
                        </Alert>
                    ) : null}
                </Box>
            </FormControl>
        </SectionCard>
    );
};

export default ShippingPaymentMethodSelector;
