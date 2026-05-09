import React from "react";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";

const PaymentMethodSelector = ({
    selectedPaymentMethod = "",
    setSelectedPaymentMethod = () => {},
}) => {
    // Only Manual Transfer is available now
    const handlePaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">
                        Metode Pembayaran
                    </InputLabel>
                    <Select
                        labelId="payment-method-label"
                        id="payment-method"
                        value={selectedPaymentMethod}
                        label="Metode Pembayaran"
                        onChange={handlePaymentChange}
                    >
                        <MenuItem value="manual_transfer">
                            Transfer Manual
                        </MenuItem>
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodSelector;
