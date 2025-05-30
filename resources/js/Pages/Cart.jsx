import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    IconButton,
    Box,
    Grid,
    Divider,
    TextField,
    Avatar,
    Stack,
    Tooltip,
    Chip,
    InputAdornment,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    Alert,
    InputLabel,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DeliveryAddressManagerModal from '@/Components/DeliveryAddressManagerModal';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

const getPriceByQuantity = (priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0;

    const tier = priceTiers.find(tier =>
        quantity >= tier.min_quantity &&
        (tier.max_quantity === null || quantity <= tier.max_quantity)
    );

    return tier ? tier.price : priceTiers[0].price;
};

const getDiscountPercentage = (priceTiers, quantity) => {
    if (!priceTiers || priceTiers.length === 0) return 0;

    const basePrice = priceTiers[0].price;
    const currentPrice = getPriceByQuantity(priceTiers, quantity);
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
};

export default function Cart({ auth, cartItems, deliveryServices, deliveryAddresses }) {
    const [quantities, setQuantities] = useState(
        cartItems?.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
    );
    const [selectedDelivery, setSelectedDelivery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
    const [postalCodeId, setPostalCodeId] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [openAddressManagerModal, setOpenAddressManagerModal] = useState(false);
    const handleOpenAddressManagerModal = () => setOpenAddressManagerModal(true);
    const handleCloseAddressManagerModal = () => setOpenAddressManagerModal(false);

    useEffect(() => {
        // Fetch provinces on component mount
        fetch(route('locations.provinces'))
            .then(response => response.json())
            .then(data => setProvinces(data));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedSubdistrict('');
        setCities([]);
        setDistricts([]);
        setSubdistricts([]);

        if (provinceId) {
            fetch(route('locations.cities', { province_id: provinceId }))
                .then(response => response.json())
                .then(data => setCities(data));
        }
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        setSelectedDistrict('');
        setSelectedSubdistrict('');
        setDistricts([]);
        setSubdistricts([]);

        if (cityId) {
            fetch(route('locations.districts', { city_id: cityId }))
                .then(response => response.json())
                .then(data => setDistricts(data));
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setSelectedSubdistrict('');
        setSubdistricts([]);

        if (districtId) {
            fetch(route('locations.subdistricts', { district_id: districtId }))
                .then(response => response.json())
                .then(data => setSubdistricts(data));
        }
    };

    const handleSubdistrictChange = (e) => {
        const subdistrictId = e.target.value;
        setSelectedSubdistrict(subdistrictId);

        if (subdistrictId) {
            fetch(route('locations.postal-code', { subdistrict_id: subdistrictId }))
                .then(response => response.json())
                .then(data => {
                    if (data && data.postal_code) {
                        setPostalCodeId(data.postal_code);
                    }
                });
        }
    };

    const handleQuantityChange = (itemId, change) => {
        const newQuantity = Math.max(1, (quantities[itemId] || 1) + change);
        setQuantities(prev => ({
            ...prev,
            [itemId]: newQuantity
        }));

        // Update di database
        router.put(route('cart.update', itemId), {
            quantity: newQuantity
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleQuantityInput = (itemId, value) => {
        const newValue = parseInt(value) || 1;
        const validValue = Math.max(1, newValue);

        setQuantities(prev => ({
            ...prev,
            [itemId]: validValue
        }));

        // Update di database
        router.put(route('cart.update', itemId), {
            quantity: validValue
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleDeleteItem = (itemId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
            router.delete(route('cart.destroy', itemId), {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    const calculateSubtotal = () => {
        return cartItems?.reduce((total, item) => {
            const quantity = quantities[item.id] || item.quantity;
            const pricePerUnit = getPriceByQuantity(item.product?.price_tiers, quantity);
            return total + (pricePerUnit * quantity);
        }, 0) || 0;
    };

    const subtotal = calculateSubtotal();

    const handleDeliveryChange = (e) => {
        const serviceId = e.target.value;
        setSelectedDelivery(serviceId);
        // Reset selected address when delivery service changes
        setSelectedAddress('');
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setOpenAddressDialog(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setSelectedProvince(address.province_id);
        setSelectedCity(address.city_id);
        setSelectedDistrict(address.district_id);
        setSelectedSubdistrict(address.subdistrict_id);
        setPostalCodeId(address.postal_code);

        // Fetch cities
        fetch(route('api.locations.cities', { province_id: address.province_id }))
            .then(response => response.json())
            .then(data => setCities(data));

        // Fetch districts
        fetch(route('api.locations.districts', { city_id: address.city_id }))
            .then(response => response.json())
            .then(data => setDistricts(data));

        // Fetch subdistricts
        fetch(route('api.locations.subdistricts', { district_id: address.district_id }))
            .then(response => response.json())
            .then(data => setSubdistricts(data));

        setOpenAddressDialog(true);
    };

    const handleCloseAddressDialog = () => {
        setOpenAddressDialog(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = () => {
        const addressData = {
            name: document.getElementById('address-name').value,
            recipient_name: document.getElementById('recipient-name').value,
            recipient_telp_no: document.getElementById('recipient-telp').value,
            province_id: selectedProvince,
            city_id: selectedCity,
            district_id: selectedDistrict,
            subdistrict_id: selectedSubdistrict,
            postal_code_id: postalCodeId,
            address: document.getElementById('address-detail').value,
        };

        if (editingAddress) {
            router.put(route('delivery-address.update', editingAddress.id), addressData, {
                onSuccess: () => {
                    handleCloseAddressDialog();
                }
            });
        } else {
            router.post(route('delivery-address.store'), addressData, {
                onSuccess: () => {
                    handleCloseAddressDialog();
                }
            });
        }
    };

    const showAddressSelection = selectedDelivery && deliveryServices.find(s => s.id === parseInt(selectedDelivery))?.id !== 33;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthenticatedLayout
                user={auth.user}
                header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Keranjang Belanja
                </Typography>}
            >
                <Head title="Keranjang Belanja" />

                <Box sx={{ py: 4, px: 2 }}>
                    {cartItems?.length === 0 ? (
                        <Stack spacing={2} alignItems="center" sx={{ minHeight: 'calc(100vh - 300px)', justifyContent: 'center' }}>
                            <ShoppingCartOutlinedIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary" align="center">
                                Keranjang Belanja Kosong
                            </Typography>
                        </Stack>
                    ) : (
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 8 }} >
                                {showAddressSelection && (
                                    <Card sx={{ mb: 3 }}>
                                        <CardHeader
                                            title={
                                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <LocationOnIcon />
                                                        <Typography variant="h6">
                                                            Alamat Pengiriman
                                                        </Typography>
                                                    </Stack>
                                                    <Button
                                                        startIcon={<LocationOnIcon />}
                                                        onClick={handleOpenAddressManagerModal}
                                                        size="small"
                                                    >
                                                        {selectedAddress ? 'Ubah Alamat' : 'Pilih Alamat'}
                                                    </Button>
                                                </Stack>
                                            }
                                        />
                                        <CardContent>
                                            {/* Tampilkan alamat yang dipilih atau pesan placeholder */}
                                            {selectedAddress ? (
                                                (() => {
                                                    const selectedAddressObject = deliveryAddresses.find(address => address.id.toString() === selectedAddress);
                                                    if (!selectedAddressObject) return (
                                                        <Typography variant="body2" color="text.secondary" align="center">
                                                            Silakan pilih alamat pengiriman.
                                                        </Typography>
                                                    );
                                                    return (
                                                        <Box sx={{
                                                            p: 2,
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            borderRadius: 1,
                                                        }}>
                                                            <Typography variant="subtitle1">
                                                                {selectedAddressObject.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Penerima: {selectedAddressObject.recipient_name} <br />
                                                                No. Telp: {selectedAddressObject.recipient_telp_no} <br />
                                                                Alamat: {selectedAddressObject.address} <br />
                                                                {selectedAddressObject.subdistrict?.name ? `${selectedAddressObject.subdistrict.name}, ` : ''}
                                                                {selectedAddressObject.district?.name ? `${selectedAddressObject.district.name}, ` : ''}
                                                                {selectedAddressObject.city?.name ? `${selectedAddressObject.city.name}, ` : ''}
                                                                {selectedAddressObject.province?.name ? `${selectedAddressObject.province.name}` : ''}<br />
                                                                Kode Pos: {selectedAddressObject.postal_code_id || '-'}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })()
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" align="center">
                                                    Silakan pilih alamat pengiriman.
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                                <Card>
                                    <CardHeader
                                        title={
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="h5" component="h1">
                                                    Daftar Produk ({cartItems?.length || 0} item)
                                                </Typography>
                                                <Tooltip title="Harga akan menurun sesuai dengan jumlah pembelian">
                                                    <IconButton size="small">
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        }
                                    />
                                    <CardContent>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableBody>
                                                    {cartItems?.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} alignItems="center">
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        src={item.product?.image}
                                                                        sx={{ width: 80, height: 80 }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant="subtitle1">
                                                                            {item.product?.name}
                                                                        </Typography>
                                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                Rp {getPriceByQuantity(item.product?.price_tiers, quantities[item.id] || item.quantity)?.toLocaleString()}/{item.product?.unit?.unit || 'unit'}
                                                                            </Typography>
                                                                            {getDiscountPercentage(item.product?.price_tiers, quantities[item.id] || item.quantity) > 0 && (
                                                                                <Chip
                                                                                    label={`Diskon ${getDiscountPercentage(item.product?.price_tiers, quantities[item.id] || item.quantity)}%`}
                                                                                    color="success"
                                                                                    size="small"
                                                                                />
                                                                            )}
                                                                        </Stack>
                                                                        {item.product?.price_tiers?.length > 0 && (
                                                                            <Tooltip title={
                                                                                <Box>
                                                                                    <Typography variant="subtitle2">Tier Harga:</Typography>
                                                                                    {item.product.price_tiers.map((tier, index) => (
                                                                                        <Typography key={index} variant="body2">
                                                                                            {tier.label || `${tier.min_quantity}-${tier.max_quantity || '∞'} ${item.product?.unit?.unit || 'unit'}`}:
                                                                                            Rp {tier.price.toLocaleString()}/{item.product?.unit?.unit || 'unit'}
                                                                                        </Typography>
                                                                                    ))}
                                                                                </Box>
                                                                            }>
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="text.secondary"
                                                                                    sx={{ cursor: 'help' }}
                                                                                >
                                                                                    Lihat tier harga
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                                    >
                                                                        <RemoveIcon />
                                                                    </IconButton>
                                                                    <TextField
                                                                        value={quantities[item.id] || item.quantity}
                                                                        onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                                                                        type="number"
                                                                        size="small"
                                                                        inputProps={{
                                                                            min: 1,
                                                                            style: { textAlign: 'center', width: '80px' }
                                                                        }}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        {item.product?.unit?.unit || 'unit'}
                                                                                    </Typography>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                                    >
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="subtitle1">
                                                                    Rp {( (quantities[item.id] || item.quantity) * getPriceByQuantity(item.product?.price_tiers, quantities[item.id] || item.quantity) )?.toLocaleString()}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                            color="error"
                                                                            aria-label="hapus"
                                                                        size="small"
                                                                        onClick={() => handleDeleteItem(item.id)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={3} sx={{ position: 'sticky', top: 24 }}>
                                    <Card>
                                        <CardHeader
                                            title={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocalShippingIcon />
                                                    <Typography variant="h6">
                                                        Pilih Pengiriman
                                                    </Typography>
                                                </Stack>
                                            }
                                        />
                                        <CardContent>
                                            <FormControl fullWidth>
                                                <InputLabel id="delivery-service-label">Metode Pengiriman</InputLabel>
                                                <Select
                                                    labelId="delivery-service-label"
                                                    id="delivery-service"
                                                    value={selectedDelivery}
                                                    label="Metode Pengiriman"
                                                    onChange={handleDeliveryChange}
                                                >
                                                    {deliveryServices.map((service) => (
                                                        <MenuItem key={service.id} value={service.id.toString()}>
                                                            {service.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader
                                            title={
                                                <Typography variant="h6">
                                                    Ringkasan Belanja
                                                </Typography>
                                            }
                                        />
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography>Subtotal</Typography>
                                                    <Typography>Rp {subtotal.toLocaleString()}</Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    *Biaya pengiriman akan dikonfirmasi oleh admin
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<ShoppingCartCheckoutIcon />}
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                    disabled={!selectedDelivery || (showAddressSelection && !selectedAddress)}
                                                >
                                                    Checkout
                                                </Button>
                                                {(!selectedDelivery || (showAddressSelection && !selectedAddress)) && (
                                                    <Typography variant="caption" color="error">
                                                        {!selectedDelivery ? 'Silakan pilih metode pengiriman' : 'Silakan pilih alamat pengiriman'}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </Box>

                {/* Address Dialog */}
                <Dialog
                    open={openAddressDialog}
                    onClose={handleCloseAddressDialog}
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
                        <Button onClick={handleCloseAddressDialog}>Batal</Button>
                        <Button
                            onClick={handleSaveAddress}
                            variant="contained"
                            disabled={!selectedProvince || !selectedCity || !selectedDistrict || !selectedSubdistrict}
                        >
                            Simpan
                        </Button>
                    </DialogActions>
                </Dialog>

                <DeliveryAddressManagerModal
                    open={openAddressManagerModal}
                    onClose={handleCloseAddressManagerModal}
                    deliveryAddresses={deliveryAddresses}
                    selectedAddressId={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                    provinces={provinces}
                    cities={cities}
                    districts={districts}
                    subdistricts={subdistricts}
                    handleProvinceChange={handleProvinceChange}
                    handleCityChange={handleCityChange}
                    handleDistrictChange={handleDistrictChange}
                    handleSubdistrictChange={handleSubdistrictChange}
                    selectedProvince={selectedProvince}
                    selectedCity={selectedCity}
                    selectedDistrict={selectedDistrict}
                    selectedSubdistrict={selectedSubdistrict}
                    postalCodeId={postalCodeId}
                    setPostalCodeId={setPostalCodeId}
                />
            </AuthenticatedLayout>
        </ThemeProvider>
    );
}
