import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SectionCard from "@/Components/ui/SectionCard";

const ManualTransferDetails = ({
    selectedTransferAccount,
    setSelectedTransferAccount,
    transferToAccounts,
    transferProof,
    handleFileChange,
}) => {
    return (
        <SectionCard title="Detail Transfer Manual" icon={AccountBalanceIcon}>
            <Stack spacing={2}>
                <FormControl fullWidth>
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
                                    {acc.bank?.name} — {acc.number} — {acc.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Upload bukti muncul setelah rekening dipilih */}
                {selectedTransferAccount && (
                    <Box>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ color: "text.secondary", fontWeight: 500 }}
                        >
                            Bukti Transfer
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<UploadFileIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                borderColor: "#C6A96B",
                                color: "#8f7949",
                                fontWeight: 700,
                                "&:hover": {
                                    borderColor: "#D4AF37",
                                    bgcolor: "rgba(198, 169, 107, 0.05)",
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
                                    borderRadius: 2,
                                    bgcolor: "rgba(198, 169, 107, 0.05)",
                                    border: "1px dashed #C6A96B",
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#8f7949", fontWeight: 500 }}
                                >
                                    Berhasil dipilih: {transferProof.name}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Stack>
        </SectionCard>
    );
};

export default ManualTransferDetails;
