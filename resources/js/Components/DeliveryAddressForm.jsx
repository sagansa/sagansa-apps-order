import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogActions,
    FormHelperText,
} from "@mui/material";

export default function DeliveryAddressForm({
    editingAddress,
    provinces,
    cities,
    districts,
    subdistricts,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSubdistrict,
    postalCodeId,
    setPostalCodeId,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleSubdistrictChange,
    onSuccess,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editingAddress ? editingAddress.name : "",
        recipient_name: editingAddress ? editingAddress.recipient_name : "",
        recipient_telp_no: editingAddress
            ? editingAddress.recipient_telp_no
            : "",
        province_id: editingAddress ? editingAddress.province_id : "",
        city_id: editingAddress ? editingAddress.city_id : "",
        district_id: editingAddress ? editingAddress.district_id : "",
        subdistrict_id: editingAddress ? editingAddress.subdistrict_id : "",
        postal_code_id: editingAddress ? editingAddress.postal_code_id : "",
        address: editingAddress ? editingAddress.address : "",
    });

    useEffect(() => {
        if (editingAddress) {
            setData({
                name: editingAddress.name,
                recipient_name: editingAddress.recipient_name,
                recipient_telp_no: editingAddress.recipient_telp_no,
                province_id: editingAddress.province_id,
                city_id: editingAddress.city_id,
                district_id: editingAddress.district_id,
                subdistrict_id: editingAddress.subdistrict_id,
                postal_code_id: editingAddress.postal_code_id,
                address: editingAddress.address,
            });
            setPostalCodeId(editingAddress.postal_code_id); // Update parent state for postal code
        } else {
            reset(); // Clear form on new address
        }
    }, [editingAddress]);

    // Update form data when parent's selected location states change
    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            province_id: selectedProvince,
            city_id: selectedCity,
            district_id: selectedDistrict,
            subdistrict_id: selectedSubdistrict,
            postal_code_id: postalCodeId,
        }));
    }, [
        selectedProvince,
        selectedCity,
        selectedDistrict,
        selectedSubdistrict,
        postalCodeId,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            put(route("delivery-address.update", editingAddress.id), {
                onSuccess: () => {
                    onSuccess(); // This should close the modal and refresh data
                },
                onError: (err) => console.error(err),
            });
        } else {
            post(route("delivery-address.store"), {
                onSuccess: () => {
                    reset();
                    onSuccess(); // This should close the modal and refresh data
                },
                onError: (err) => console.error(err),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                    id="name"
                    label="Nama Alamat"
                    fullWidth
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    id="recipient_name"
                    label="Nama Penerima"
                    fullWidth
                    value={data.recipient_name}
                    onChange={(e) => setData("recipient_name", e.target.value)}
                    error={!!errors.recipient_name}
                    helperText={errors.recipient_name}
                />
                <TextField
                    id="recipient_telp_no"
                    label="Nomor Telepon"
                    fullWidth
                    value={data.recipient_telp_no}
                    onChange={(e) =>
                        setData("recipient_telp_no", e.target.value)
                    }
                    error={!!errors.recipient_telp_no}
                    helperText={errors.recipient_telp_no}
                />
                <FormControl fullWidth error={!!errors.province_id}>
                    <InputLabel>Provinsi</InputLabel>
                    <Select
                        value={selectedProvince}
                        label="Provinsi"
                        onChange={(e) => {
                            handleProvinceChange(e);
                            setData("province_id", e.target.value);
                        }}
                    >
                        {provinces.map((province) => (
                            <MenuItem key={province.id} value={province.id}>
                                {province.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.province_id && (
                        <FormHelperText>{errors.province_id}</FormHelperText>
                    )}
                </FormControl>
                <FormControl fullWidth error={!!errors.city_id}>
                    <InputLabel>Kota/Kabupaten</InputLabel>
                    <Select
                        value={selectedCity}
                        label="Kota/Kabupaten"
                        onChange={(e) => {
                            handleCityChange(e);
                            setData("city_id", e.target.value);
                        }}
                        disabled={!selectedProvince}
                    >
                        {cities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.city_id && (
                        <FormHelperText>{errors.city_id}</FormHelperText>
                    )}
                </FormControl>
                <FormControl fullWidth error={!!errors.district_id}>
                    <InputLabel>Kecamatan</InputLabel>
                    <Select
                        value={selectedDistrict}
                        label="Kecamatan"
                        onChange={(e) => {
                            handleDistrictChange(e);
                            setData("district_id", e.target.value);
                        }}
                        disabled={!selectedCity}
                    >
                        {districts.map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.district_id && (
                        <FormHelperText>{errors.district_id}</FormHelperText>
                    )}
                </FormControl>
                <FormControl fullWidth error={!!errors.subdistrict_id}>
                    <InputLabel>Kelurahan/Desa</InputLabel>
                    <Select
                        value={selectedSubdistrict}
                        label="Kelurahan/Desa"
                        onChange={(e) => {
                            handleSubdistrictChange(e);
                            setData("subdistrict_id", e.target.value);
                        }}
                        disabled={!selectedDistrict}
                    >
                        {subdistricts.map((subdistrict) => (
                            <MenuItem
                                key={subdistrict.id}
                                value={subdistrict.id}
                            >
                                {subdistrict.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.subdistrict_id && (
                        <FormHelperText>{errors.subdistrict_id}</FormHelperText>
                    )}
                </FormControl>
                <TextField
                    label="Kode Pos"
                    fullWidth
                    value={postalCodeId} // This is controlled by parent component
                    onChange={(e) => setPostalCodeId(e.target.value)} // This updates parent state
                    inputProps={{ maxLength: 5 }}
                    disabled={true} // Postal code is auto-filled
                    error={!!errors.postal_code_id}
                    helperText={errors.postal_code_id}
                />
                <TextField
                    id="address"
                    label="Alamat Lengkap"
                    fullWidth
                    multiline
                    rows={3}
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                />
            </Stack>
            <DialogActions>
                <Button type="submit" variant="contained" disabled={processing}>
                    {editingAddress ? "Update" : "Add"} Address
                </Button>
            </DialogActions>
        </form>
    );
}
