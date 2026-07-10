import React from "react";
import { Box, Typography } from "@mui/material";

const DeliveryAddressDisplay = ({ selectedAddressObject }) => {
    if (!selectedAddressObject) {
        return (
            <Typography variant="body2" color="text.secondary" align="center">
                Silakan pilih alamat pengiriman.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                p: 2,
                bgcolor: "rgba(198, 169, 107, 0.05)",
                borderRadius: 2,
                border: "1px dashed #C6A96B",
            }}
        >
            <Typography variant="subtitle2" sx={{ color: "#C6A96B", fontWeight: "bold", mb: 1 }}>
                {selectedAddressObject.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Penerima: {selectedAddressObject.recipient_name} <br />
                No. Telp: {selectedAddressObject.recipient_telp_no} <br />
                Alamat: {selectedAddressObject.address} <br />
                {selectedAddressObject.subdistrict?.name
                    ? `${selectedAddressObject.subdistrict.name}, `
                    : ""}
                {selectedAddressObject.district?.name
                    ? `${selectedAddressObject.district.name}, `
                    : ""}
                {selectedAddressObject.city?.name
                    ? `${selectedAddressObject.city.name}, `
                    : ""}
                {selectedAddressObject.province?.name
                    ? `${selectedAddressObject.province.name}`
                    : ""}
                <br />
                Kode Pos: {selectedAddressObject.postal_code.postal_code || "-"}
            </Typography>
        </Box>
    );
};

export default DeliveryAddressDisplay;
