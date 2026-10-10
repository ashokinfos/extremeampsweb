'use client';

import type {
  IUserProfile,
  IAddressInfo,
  ISaveAddress,
  IUpdateProfile,
  IChangePassword,
} from '@/modules/user/types/userTypes';

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Iconify } from '@/shared/components/iconify';
import { DashboardContent } from '@/shared/layouts/home';
import { userService } from '@/modules/user/services/userService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { emptyAddress, AddressFormDialog } from '../components/address-form-dialog';

// ----------------------------------------------------------------------

export function UserProfileView() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<IUpdateProfile>({
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
  });
  const [passwordData, setPasswordData] = useState<IChangePassword>({
    CurrentPassword: '',
    NewPassword: '',
    ConfirmNewPassword: '',
  });

  // Address state
  const [addresses, setAddresses] = useState<IAddressInfo[]>([]);
  const [addressDialog, setAddressDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddressInfo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogInitial, setDialogInitial] = useState<ISaveAddress>(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    const data = await userService.getMyProfile();
    setProfile(data);
    setFormData({
      FirstName: data.FirstName,
      LastName: data.LastName,
      Email: data.Email,
      PhoneNumber: data.PhoneNumber,
    });
  };

  const fetchAddresses = async () => {
    const data = await userService.getAddresses();
    setAddresses(data);
  };

  const handleUpdateProfile = async () => {
    await userService.updateMyProfile(formData);
    toast.success('Profile updated successfully');
    setEditMode(false);
    fetchProfile();
  };

  const handleChangePassword = async () => {
    if (passwordData.NewPassword !== passwordData.ConfirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await userService.changePassword(passwordData);
    toast.success('Password changed successfully');
    setChangePasswordMode(false);
    setPasswordData({ CurrentPassword: '', NewPassword: '', ConfirmNewPassword: '' });
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setDialogInitial(emptyAddress);
    setAddressDialog(true);
  };

  const openEditDialog = (addr: IAddressInfo) => {
    setEditingAddress(addr);
    setDialogInitial({
      AddressTitle: addr.AddressTitle,
      FirstName: addr.FirstName,
      LastName: addr.LastName,
      PhoneNumber: addr.PhoneNumber,
      AddressLine1: addr.AddressLine1,
      AddressLine2: addr.AddressLine2,
      Taluk: addr.Taluk,
      City: addr.City,
      State: addr.State,
      PinCode: addr.PinCode,
    });
    setAddressDialog(true);
  };

  const handleSaveAddress = async (form: ISaveAddress) => {
    setSavingAddress(true);
    try {
      const res = editingAddress
        ? await userService.updateAddress(editingAddress.Id, form)
        : await userService.createAddress(form);
      if (res.Status) {
        toast.success(editingAddress ? 'Address updated' : 'Address added');
        setAddressDialog(false);
        fetchAddresses();
      } else {
        toast.error(res.Message);
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialog(true);
  };

  const handleDeleteAddress = async () => {
    if (!deletingId) return;
    const res = await userService.deleteAddress(deletingId);
    if (res.Status) toast.success('Address deleted');
    else toast.error(res.Message);
    setDeleteDialog(false);
    setDeletingId(null);
    fetchAddresses();
  };

  if (!profile) return null;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Profile Information</Typography>
                {!editMode && (
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:pen-bold" />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editMode ? formData.FirstName : profile.FirstName}
                  onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                  disabled={!editMode}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editMode ? formData.LastName : profile.LastName}
                  onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                  disabled={!editMode}
                />
                <TextField fullWidth label="Email" value={profile.Email} disabled />
                <TextField fullWidth label="Username" value={profile.UserName} disabled />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editMode ? formData.PhoneNumber : profile.PhoneNumber}
                  onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                  disabled={!editMode}
                />
                {editMode && (
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Change Password</Typography>
                {!changePasswordMode && (
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:lock-password-bold" />}
                    onClick={() => setChangePasswordMode(true)}
                  >
                    Change
                  </Button>
                )}
              </Box>
              {changePasswordMode ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.CurrentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, CurrentPassword: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showCurrentPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.NewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, NewPassword: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={showNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.ConfirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, ConfirmNewPassword: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setChangePasswordMode(false);
                        setPasswordData({
                          CurrentPassword: '',
                          NewPassword: '',
                          ConfirmNewPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleChangePassword}>
                      Update Password
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">{`Click the "Change Password" button to update your password`}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Addresses */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Saved Addresses</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={openAddDialog}
                >
                  Add Address
                </Button>
              </Box>

              {addresses.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Iconify
                    icon="eva:person-outline"
                    width={48}
                    sx={{ color: 'text.disabled', mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No saved addresses yet.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {addresses.map((addr) => (
                    <Grid key={addr.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Box
                        sx={{
                          p: 2,
                          border: (t) => `1px solid ${t.palette.divider}`,
                          borderRadius: 1.5,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Typography variant="subtitle2" color="primary.main">
                            {addr.AddressTitle || 'Address'}
                          </Typography>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => openEditDialog(addr)}>
                              <Iconify icon="solar:pen-bold" width={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => confirmDelete(addr.Id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          </Stack>
                        </Stack>
                        <Typography variant="body2" fontWeight={500}>
                          {addr.FirstName} {addr.LastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {addr.PhoneNumber}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">{addr.AddressLine1}</Typography>
                        {addr.AddressLine2 && (
                          <Typography variant="body2">{addr.AddressLine2}</Typography>
                        )}
                        {addr.Taluk && <Typography variant="body2">{addr.Taluk}</Typography>}
                        <Typography variant="body2">
                          {addr.City}, {addr.State} - {addr.PinCode}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={addressDialog}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        initialValues={dialogInitial}
        saving={savingAddress}
        onClose={() => setAddressDialog(false)}
        onSave={handleSaveAddress}
      />

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this address? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteAddress}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
