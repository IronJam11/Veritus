"use client";
import React, { useState, useEffect } from 'react';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import { Button, TextField, Card, Typography, Box, CircularProgress, Alert, Avatar, IconButton } from '@mui/material';
import { Brightness4, Brightness7, Edit } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';
import { useAccount } from 'wagmi';
import NotConnected from '@/components/notConnected';
import RegisterNewUserCard from '@/components/registerNewUserCard';
import DepositionsComponent  from '@/components/Depositions';
import UserAssetsComponent from '@/components/UserAssets';


interface AssetPageClientProps {
  address: string;
}

export default function UserClientPage({ address }: AssetPageClientProps) {
    const {isConnected } = useAccount();

    const {
        registerCreator,
        updateCreatorProfileDetails,
        useGetCreatorBasicInfo,
        getUserDepositions,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,

    } = useAssetPlatformContract();

    type CreatorInfo = {
        wallet?:string;
        name?: string;
        profileImage?: string;
        bio?: string;   
    };

    const { data: rawCreatorInfo, isLoading: isLoadingCreatorInfo } = useGetCreatorBasicInfo(address?.toString() || '');
    const { data: Userdepositions, isLoading: isLoadingDepositions } = getUserDepositions(address?.toString() || '');
    console.log("creator:",rawCreatorInfo);
    const creatorInfo: CreatorInfo | null = rawCreatorInfo && Array.isArray(rawCreatorInfo) ? {
        wallet: rawCreatorInfo[0] || '',
        name: rawCreatorInfo[1] || '',
        profileImage: rawCreatorInfo[2] || '',
        bio: rawCreatorInfo[3] || '',
    } : null;
 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        profileImage: '',
        bio: ''
    });

    const { themeClasses: theme, isDarkMode, toggleTheme } = useTheme();
    useEffect(() => {
        if (creatorInfo && creatorInfo.name) {
            setFormData({
                name: creatorInfo.name || '',
                profileImage: creatorInfo.profileImage || '',
                bio: creatorInfo.bio || ''
            });
        }
        console.log("CreatorInfo updated:", creatorInfo);
    }, [rawCreatorInfo]); 

    const handleRegisterCreator = async () => {
        try {
            await registerCreator(formData.name, formData.profileImage, formData.bio);
        } catch (err) {
            console.error('Failed to register:', err);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await updateCreatorProfileDetails(formData.name, formData.profileImage, formData.bio);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancelEdit = () => {
        if (creatorInfo) {
            setFormData({
                name: creatorInfo.name || '',
                profileImage: creatorInfo.profileImage || '',
                bio: creatorInfo.bio || ''
            });
        }
        setIsEditing(false);
    };
    if (isLoadingCreatorInfo) {
        return (
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: theme.background,
                color: theme.textPrimary,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress sx={{ color: theme.primary }} />
            </Box>
        );
    }

    if (!isConnected) {
        return <NotConnected />
    }
    if (creatorInfo && creatorInfo.wallet === address?.toString()) {
        return (
    <div>
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.background,
            color: theme.textPrimary,
            p: 3,
            position: 'relative'
        }}>
            {/* Header Section */}
            <Box sx={{ 
                mb: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h3" sx={{ 
                    color: theme.primary,
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Creator Dashboard
                </Typography>
                
                
            </Box>

            {/* Main Dashboard Layout */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: 3,
                height: 'calc(100vh - 200px)'
            }}>
                {/* Left Column */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    height: '100%'
                }}>
                    {/* Profile Section */}
                    <Card sx={{
                        p: 3,
                        backgroundColor: theme.paper,
                        boxShadow: `0px 8px 32px rgba(99, 102, 241, 0.15)`,
                        borderRadius: 3,
                        border: `1px solid ${theme.border}`,
                        height: 'fit-content',
                        position: 'relative',
                        overflow: 'visible'
                    }}>
                        {/* Profile Header */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            mb: 3,
                            position: 'relative'
                        }}>
                            <Box sx={{
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -10,
                                    left: -10,
                                    right: -10,
                                    bottom: -10,
                                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                    borderRadius: '50%',
                                    zIndex: 0,
                                    opacity: 0.1
                                }
                            }}>
                                <Avatar 
                                    src={formData.profileImage || 'https://via.placeholder.com/100x100/6366f1/ffffff?text=User'} 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        mb: 2,
                                        border: `3px solid ${theme.primary}`,
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: `0px 4px 20px rgba(99, 102, 241, 0.3)`
                                    }} 
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h5" sx={{ 
                                    color: theme.primary,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}>
                                    {isEditing ? 'Edit Profile' : formData.name || 'Creator Profile'}
                                </Typography>
                                {!isEditing && (
                                    <IconButton
                                        onClick={() => setIsEditing(true)}
                                        sx={{
                                            color: theme.primary,
                                            backgroundColor: theme.hoverBg,
                                            width: 32,
                                            height: 32,
                                            '&:hover': {
                                                backgroundColor: theme.primary,
                                                color: theme.background,
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Edit sx={{ fontSize: 16 }} />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {/* Profile Content */}
                        {isEditing ? (
                            <Box component="form" sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    margin="normal"
                                    size="small"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: theme.border },
                                            '&:hover fieldset': { borderColor: theme.primary },
                                            '&.Mui-focused fieldset': { borderColor: theme.primary },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.textSecondary,
                                            '&.Mui-focused': { color: theme.primary },
                                        },
                                    }}
                                    InputProps={{
                                        style: {
                                            color: theme.textPrimary,
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Profile Image URL"
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                    margin="normal"
                                    size="small"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: theme.border },
                                            '&:hover fieldset': { borderColor: theme.primary },
                                            '&.Mui-focused fieldset': { borderColor: theme.primary },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.textSecondary,
                                            '&.Mui-focused': { color: theme.primary },
                                        },
                                    }}
                                    InputProps={{
                                        style: {
                                            color: theme.textPrimary,
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    size="small"
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: theme.border },
                                            '&:hover fieldset': { borderColor: theme.primary },
                                            '&.Mui-focused fieldset': { borderColor: theme.primary },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.textSecondary,
                                            '&.Mui-focused': { color: theme.primary },
                                        },
                                    }}
                                    InputProps={{
                                        style: {
                                            color: theme.textPrimary,
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleUpdateProfile}
                                        disabled={isPending || isConfirming || !formData.name}
                                        sx={{
                                            py: 1,
                                            backgroundColor: theme.primary,
                                            color: theme.background,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: theme.secondary,
                                                transform: 'translateY(-1px)',
                                                boxShadow: `0px 6px 20px rgba(99, 102, 241, 0.4)`
                                            },
                                            '&:disabled': {
                                                opacity: 0.7,
                                                backgroundColor: theme.textMuted,
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {isPending ? (
                                            <CircularProgress size={20} sx={{ color: theme.background }} />
                                        ) : isConfirming ? (
                                            'Confirming...'
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleCancelEdit}
                                        disabled={isPending || isConfirming}
                                        sx={{
                                            py: 1,
                                            borderColor: theme.border,
                                            color: theme.textPrimary,
                                            borderRadius: 2,
                                            '&:hover': {
                                                borderColor: theme.primary,
                                                backgroundColor: theme.hoverBg,
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Box sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    backgroundColor: theme.hoverBg, 
                                    borderRadius: 2,
                                    border: `1px solid ${theme.border}`
                                }}>
                                    <Typography variant="body1" sx={{ 
                                        color: theme.textPrimary,
                                        lineHeight: 1.6,
                                        textAlign: 'center',
                                        fontStyle: formData.bio ? 'normal' : 'italic'
                                    }}>
                                        {formData.bio || 'No bio provided'}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Status Messages */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: 2, fontSize: '0.875rem' }}>
                                {error.message}
                            </Alert>
                        )}

                        {hash && (
                            <Box sx={{ 
                                mt: 2, 
                                p: 2, 
                                backgroundColor: theme.hoverBg, 
                                borderRadius: 2,
                                border: `1px solid ${theme.border}`
                            }}>
                                <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                                    Transaction:
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                    color: theme.primary,
                                    wordBreak: 'break-all',
                                    display: 'block',
                                    fontFamily: 'monospace'
                                }}>
                                    {hash.slice(0, 20)}...
                                </Typography>
                            </Box>
                        )}

                        {isConfirmed && (
                            <Alert severity="success" sx={{ mt: 2, borderRadius: 2, fontSize: '0.875rem' }}>
                                Profile updated successfully!
                            </Alert>
                        )}
                    </Card>

     
                    <Box sx={{ 
                        flex: 1,
                        backgroundColor: theme.paper,
                        borderRadius: 3,
                        border: `1px solid ${theme.border}`,
                        p: 3
                    }}>
                        
                    </Box>
                </Box>

                {/* Right Column */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    height: '100%'
                }}>
                    {/* Depositions Section */}
                    <Card sx={{
                        p: 3,
                        backgroundColor: theme.paper,
                        boxShadow: `0px 8px 32px rgba(99, 102, 241, 0.15)`,
                        borderRadius: 3,
                        border: `1px solid ${theme.border}`,
                        height: '60%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 3,
                            pb: 2,
                            borderBottom: `2px solid ${theme.border}`
                        }}>
                            <Typography variant="h5" sx={{ 
                                color: theme.primary,
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: theme.primary
                                }} />
                                Depositions
                            </Typography>
                        </Box>
                        
                        <Box sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.hoverBg,
                                borderRadius: '3px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.border,
                                borderRadius: '3px',
                                '&:hover': {
                                    backgroundColor: theme.primary
                                }
                            }
                        }}>
                            <DepositionsComponent depositions={Userdepositions}/>
                        </Box>
                    </Card>

                    {/* Assets Section */}
                    <Card sx={{
                        p: 3,
                        backgroundColor: theme.paper,
                        boxShadow: `0px 8px 32px rgba(99, 102, 241, 0.15)`,
                        borderRadius: 3,
                        border: `1px solid ${theme.border}`,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 3,
                            pb: 2,
                            borderBottom: `2px solid ${theme.border}`
                        }}>
                            <Typography variant="h5" sx={{ 
                                color: theme.primary,
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: theme.secondary
                                }} />
                                {address}'s Assets
                            </Typography>
                        </Box>
                        
                        <Box sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.hoverBg,
                                borderRadius: '3px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.border,
                                borderRadius: '3px',
                                '&:hover': {
                                    backgroundColor: theme.secondary
                                }
                            }
                        }}>
                            <UserAssetsComponent address={address}/>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    </div>
);
    }
    return (
        <RegisterNewUserCard formData={formData} handleChange={handleChange} handleRegisterCreator={handleRegisterCreator} />
    );
}