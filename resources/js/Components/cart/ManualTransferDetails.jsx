import React from "react";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Button,
} from "@mui/material";

const ManualTransferDetails = ({
    selectedTransferAccount,
    setSelectedTransferAccount,
    transferToAccounts,
    transferProof,
    handleFileChange,
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                overflow: "hidden",
            }}
        >
            <CardContent>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 2 }}
                >
                    Detail Transfer Manual
                </Typography>
                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel id="transfer-account-label">
                        Rekening Tujuan
                    </InputLabel>
                    <Select
                        labelId="transfer-account-label"
                        id="transfer-account"
                        value={selectedTransferAccount}
                        label="Rekening Tujuan"
                        onChange={(e) =>
                            setSelectedTransferAccount(e.target.value)
                        }
                        sx={{ borderRadius: 2 }}
                    >
                        {transferToAccounts &&
                            transferToAccounts.map((acc) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.bank?.name} - {acc.number} - {acc.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Tampilkan upload bukti transfer jika rekening sudah dipilih dan Card ini tampil */}
                {selectedTransferAccount && (
                    <Box mt={3}>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ color: "text.secondary", fontWeight: 500 }}
                        >
                            Bukti Transfer
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderRadius: 1.5,
                                background:
                                    "linear-gradient(45deg, #2C2C2C 30%, #1A1A1A 90%)",
                                border: "1px solid #C6A96B",
                                color: "#C6A96B",
                                fontWeight: "bold",
                                "&:hover": {
                                    background: "#1A1A1A",
                                    boxShadow:
                                        "0 0 10px rgba(198, 169, 107, 0.2)",
                                },
                            }}
                        >
                            Upload Gambar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleFileChange(e)}
                            />
                        </Button>
                        {transferProof && (
                            <Box
                                sx={{
                                    mt: 1.5,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: "rgba(198, 169, 107, 0.05)",
                                    border: "1px dashed #C6A96B",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#C6A96B", fontWeight: 500 }}
                                >
                                    Berhasil dipilih: {transferProof.name}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ManualTransferDetails;
