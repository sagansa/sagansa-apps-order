import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Button,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormHelperText, // Add this import
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeliveryAddressForm from "@/Components/DeliveryAddressForm"; // Will create this next

export default function DeliveryAddressIndex({ auth, deliveryAddresses }) {
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    // State for location data within the form (will be passed to DeliveryAddressForm)
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
    const [postalCodeId, setPostalCodeId] = useState("");
    const [postalCodeValue, setPostalCodeValue] = useState("");

    useEffect(() => {
        fetch(route("locations.provinces"))
            .then((response) => response.json())
            .then((data) => setProvinces(data));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedCity("");
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setPostalCodeId("");
        setPostalCodeValue("");
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);

        if (provinceId) {
            fetch(route("locations.cities", { province_id: provinceId }))
                .then((response) => response.json())
                .then((data) => setCities(data));
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setPostalCodeId("");
        setPostalCodeValue("");
        setDistricts([]);
        setSubdistricts([]);

        if (cityId) {
            fetch(route("locations.districts", { city_id: cityId }))
                .then((response) => response.json())
                .then((data) => setDistricts(data));
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setSelectedSubdistrict("");
        setPostalCodeId("");
        setPostalCodeValue("");
        setSubdistricts([]);

        if (districtId) {
            fetch(route("locations.subdistricts", { district_id: districtId }))
                .then((response) => response.json())
                .then((data) => setSubdistricts(data));
        }
    };

    const handleSubdistrictChange = (e) => {
        const subdistrictId = e.target.value;
        setSelectedSubdistrict(subdistrictId);
        setPostalCodeId("");
        setPostalCodeValue("");

        if (subdistrictId) {
            fetch(
                route("locations.postal-code", {
                    subdistrict_id: subdistrictId,
                })
            )
                .then((response) => response.json())
                .then((data) => {
                    setPostalCodeId(data?.id || "");
                    setPostalCodeValue(data?.postal_code || "");
                });
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setOpenAddressDialog(true);
        // Reset form states
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setPostalCodeId("");
        setPostalCodeValue("");
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setOpenAddressDialog(true);
        setSelectedProvince(address.province_id);
        setSelectedCity(address.city_id);
        setSelectedDistrict(address.district_id);
        setSelectedSubdistrict(address.subdistrict_id);
        setPostalCodeId(address.postal_code_id || "");
        setPostalCodeValue(address.postal_code?.postal_code || "");

        // Fetch cities
        fetch(route("locations.cities", { province_id: address.province_id }))
            .then((response) => response.json())
            .then((data) => setCities(data));

        // Fetch districts
        fetch(route("locations.districts", { city_id: address.city_id }))
            .then((response) => response.json())
            .then((data) => setDistricts(data));

        // Fetch subdistricts
        fetch(
            route("locations.subdistricts", {
                district_id: address.district_id,
            })
        )
            .then((response) => response.json())
            .then((data) => setSubdistricts(data));
    };

    const handleCloseAddressDialog = () => {
        setOpenAddressDialog(false);
        setEditingAddress(null);
        // Reset location states
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedDistrict("");
        setSelectedSubdistrict("");
        setPostalCodeId("");
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);
    };

    const handleFormSuccess = () => {
        // Close dialog and refresh page to get updated data
        handleCloseAddressDialog();
        // Refresh the page to get updated delivery addresses
        router.reload({ only: ['deliveryAddresses'] });
    };

    const handleDeleteAddress = (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            router.delete(route("delivery-address.destroy", addressId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 800, color: "white", lineHeight: 1.1 }}
                >
                    Delivery Addresses
                </Typography>
            }
        >
            <Head title="Delivery Addresses" />

            <Box sx={{ py: 4, px: { xs: 1, sm: 2 } }}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader
                        title={
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <LocationOnIcon />
                                    <Typography variant="h6">
                                        Your Delivery Addresses
                                    </Typography>
                                </Stack>
                                <Button
                                    variant="contained"
                                    onClick={handleAddAddress}
                                    size="small"
                                >
                                    Add New Address
                                </Button>
                            </Stack>
                        }
                    />
                    <CardContent>
                        {deliveryAddresses.length === 0 ? (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                No delivery addresses found. Click "Add New
                                Address" to add one.
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {deliveryAddresses.map((address) => (
                                    <Card key={address.id} variant="outlined">
                                        <CardContent>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Box>
                                                    <Typography variant="subtitle1">
                                                        {address.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Recipient:{" "}
                                                        {address.recipient_name}{" "}
                                                        (
                                                        {
                                                            address.recipient_telp_no
                                                        }
                                                        ) <br />
                                                        Address:{" "}
                                                        {address.address},{" "}
                                                        {
                                                            address.subdistrict
                                                                ?.name
                                                        }
                                                        ,{" "}
                                                        {address.district?.name}
                                                        , {address.city?.name},{" "}
                                                        {address.province?.name}{" "}
                                                        <br />
                                                        Postal Code:{" "}
                                                        {address.postal_code_id ||
                                                            "-"}
                                                    </Typography>
                                                </Box>
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    {!address.is_used_in_orders ? (
                                                        <>
                                                            <IconButton
                                                                color="info"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleEditAddress(
                                                                        address
                                                                    )
                                                                }
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleDeleteAddress(
                                                                        address.id
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <Box sx={{
                                                            px: 1,
                                                            py: 0.5,
                                                            bgcolor: 'grey.100',
                                                            borderRadius: 1,
                                                            fontSize: '0.75rem',
                                                            color: 'text.secondary'
                                                        }}>
                                                            Sudah Digunakan
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Box>

            {/* Add/Edit Address Dialog */}
            <Dialog
                open={openAddressDialog}
                onClose={handleCloseAddressDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingAddress
                        ? "Edit Delivery Address"
                        : "Add New Delivery Address"}
                </DialogTitle>
                <DialogContent>
                    <DeliveryAddressForm
                        editingAddress={editingAddress}
                        provinces={provinces}
                        cities={cities}
                        districts={districts}
                        subdistricts={subdistricts}
                        selectedProvince={selectedProvince}
                        selectedCity={selectedCity}
                        selectedDistrict={selectedDistrict}
                        selectedSubdistrict={selectedSubdistrict}
                        postalCodeId={postalCodeId}
                        setPostalCodeId={setPostalCodeId}
                        postalCodeValue={postalCodeValue}
                        setPostalCodeValue={setPostalCodeValue}
                        handleProvinceChange={handleProvinceChange}
                        handleCityChange={handleCityChange}
                        handleDistrictChange={handleDistrictChange}
                        handleSubdistrictChange={handleSubdistrictChange}
                        onSuccess={handleFormSuccess} // Close dialog and refresh data on success
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddressDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
