import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, Radio, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { router } from '@inertiajs/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Fungsi untuk mengubah teks menjadi Title Case
const formatTitleCase = (text) => {
    if (!text) return '';
    return text.toLowerCase().split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

export default function DeliveryAddressManagerModal({
    open,
    onClose,
    deliveryAddresses,
    selectedAddressId,
    onSelectAddress,
    provinces,
    cities,
    districts,
    subdistricts,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleSubdistrictChange,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    selectedSubdistrict,
    postalCodeId,
    setPostalCodeId,
    setCities,
    setDistricts,
    setSubdistricts,
}) {
    const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [citiesState, setCitiesState] = useState([]);
    const [districtsState, setDistrictsState] = useState([]);
    const [subdistrictsState, setSubdistrictsState] = useState([]);

    useEffect(() => {
        // Reset state when modal opens or closes
        if (!open) {
            setEditingAddress(null);
            setOpenAddEditDialog(false);
            // Optional: Reset location selections if needed
            // handleProvinceChange({ target: { value: '' } });
        }
    }, [open]);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setOpenAddEditDialog(true);
    };

    const handleEditAddress = async (address) => {
        setEditingAddress(address);
        // Pre-fill location selects
        await handleProvinceChange({ target: { value: address.province_id } });
        // Fetch cities
        if (address.province_id) {
            await fetch(route('locations.cities', { province_id: address.province_id }))
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) setCitiesState(data);
                });
        }
        await handleCityChange({ target: { value: address.city_id } });
        // Fetch districts
        if (address.city_id) {
            await fetch(route('locations.districts', { city_id: address.city_id }))
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) setDistrictsState(data);
                });
        }
        await handleDistrictChange({ target: { value: address.district_id } });
        // Fetch subdistricts
        if (address.district_id) {
            await fetch(route('locations.subdistricts', { district_id: address.district_id }))
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) setSubdistrictsState(data);
                });
        }
        await handleSubdistrictChange({ target: { value: address.subdistrict_id } });
        // Set postal code
        setPostalCodeId(address.postal_code_id);
        setOpenAddEditDialog(true);
    };

    const handleDeleteAddress = (addressId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
            router.delete(route('delivery-address.destroy', addressId), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Optionally re-fetch addresses or update local state
                    // If the deleted address was the selected one, unselect it
                    if (selectedAddressId === addressId.toString()) {
                        onSelectAddress('');
                    }
                }
            });
        }
    };

    const handleSaveAddress = () => {
        const addressData = {
            name: document.getElementById('address-name')?.value || '',
            recipient_name: document.getElementById('recipient-name')?.value || '',
            recipient_telp_no: document.getElementById('recipient-telp')?.value || '',
            province_id: selectedProvince,
            city_id: selectedCity,
            district_id: selectedDistrict,
            subdistrict_id: selectedSubdistrict,
            postal_code_id: postalCodeId,
            address: document.getElementById('address-detail')?.value || '',
        };

        if (editingAddress) {
            router.put(route('delivery-address.update', editingAddress.id), addressData, {
                onSuccess: () => {
                    setOpenAddEditDialog(false);
                    // Optionally re-fetch addresses or update local state
                }
            });
        } else {
            router.post(route('delivery-address.store'), addressData, {
                onSuccess: () => {
                    setOpenAddEditDialog(false);
                    // Optionally re-fetch addresses or update local state
                }
            });
        }
    };

    const handleSelectAddress = (addressId) => {
        onSelectAddress(addressId);
        setOpenAddEditDialog(false);
    };

    // Fungsi untuk memilih alamat dan menutup modal
    const handleSelectAndClose = () => {
        if (selectedAddressId) {
            onSelectAddress(selectedAddressId);
            onClose();
        }
    };

    return (
        <>
            {/* Main Address Selection Modal */}
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon />
                        <Typography variant="h6">Pilih Alamat Pengiriman</Typography>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddAddress}
                            size="small"
                            sx={{ ml: 'auto' }} // Push button to the right
                        >
                            Tambah Alamat Baru
                        </Button>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {deliveryAddresses && deliveryAddresses.length > 0 ? (
                            deliveryAddresses.map((address) => (
                                <Box
                                    key={address.id}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: selectedAddressId === address.id.toString() ? 'primary.main' : 'divider',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                        },
                                        display: 'flex', // Use flex to align radio and content
                                        alignItems: 'flex-start', // Align items to the top
                                    }}
                                    onClick={() => handleSelectAddress(address.id.toString())}
                                >
                                    <Radio
                                        checked={selectedAddressId === address.id.toString()}
                                        value={address.id.toString()}
                                        sx={{ pt: 0 }} // Adjust padding if needed
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                            <Typography variant="subtitle1">
                                                {address.name}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditAddress(address);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAddress(address.id);
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        {/* Tampilan Alamat disesuaikan */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2">
                                                {formatTitleCase(address.recipient_name)} - {address.recipient_telp_no}
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatTitleCase(address.address)}
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatTitleCase(address.subdistrict?.name)}, {formatTitleCase(address.district?.name)}
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatTitleCase(address.city?.name)}, {formatTitleCase(address.province?.name)}
                                            </Typography>
                                            <Typography variant="body2">
                                                Kode Pos: {address.postal_code?.postal_code || address.postal_code_id || '-'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                Belum ada alamat tersimpan.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Tutup</Button>
                    <Button onClick={handleSelectAndClose} variant="contained" disabled={!selectedAddressId}>
                        Pilih Alamat
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Address Dialog */}
            <Dialog
                open={openAddEditDialog}
                onClose={() => setOpenAddEditDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            id="address-name"
                            label="Nama Alamat"
                            fullWidth
                            defaultValue={editingAddress?.name}
                        />
                        <TextField
                            id="recipient-name"
                            label="Nama Penerima"
                            fullWidth
                            defaultValue={editingAddress?.recipient_name}
                        />
                        <TextField
                            id="recipient-telp"
                            label="Nomor Telepon"
                            fullWidth
                            defaultValue={editingAddress?.recipient_telp_no}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Provinsi</InputLabel>
                            <Select
                                value={selectedProvince}
                                label="Provinsi"
                                onChange={handleProvinceChange}
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province.id} value={province.id}>
                                        {province.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kota/Kabupaten</InputLabel>
                            <Select
                                value={selectedCity}
                                label="Kota/Kabupaten"
                                onChange={handleCityChange}
                                disabled={!selectedProvince}
                            >
                                {cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kecamatan</InputLabel>
                            <Select
                                value={selectedDistrict}
                                label="Kecamatan"
                                onChange={handleDistrictChange}
                                disabled={!selectedCity}
                            >
                                {districts.map((district) => (
                                    <MenuItem key={district.id} value={district.id}>
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Kelurahan/Desa</InputLabel>
                            <Select
                                value={selectedSubdistrict}
                                label="Kelurahan/Desa"
                                onChange={handleSubdistrictChange}
                                disabled={!selectedDistrict}
                            >
                                {subdistricts.map((subdistrict) => (
                                    <MenuItem key={subdistrict.id} value={subdistrict.id}>
                                        {subdistrict.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Kode Pos"
                            fullWidth
                            value={postalCodeId}
                            onChange={(e) => setPostalCodeId(e.target.value)}
                            inputProps={{ maxLength: 5 }}
                            disabled={true}
                        />
                        <TextField
                            id="address-detail"
                            label="Alamat Lengkap"
                            fullWidth
                            multiline
                            rows={3}
                            defaultValue={editingAddress?.address}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddEditDialog(false)}>Batal</Button>
                    <Button
                        onClick={handleSaveAddress}
                        variant="contained"
                        disabled={!selectedProvince || !selectedCity || !selectedDistrict || !selectedSubdistrict || !document.getElementById('address-name')?.value || !document.getElementById('recipient-name')?.value || !document.getElementById('recipient-telp')?.value || !document.getElementById('address-detail')?.value}
                    >
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
