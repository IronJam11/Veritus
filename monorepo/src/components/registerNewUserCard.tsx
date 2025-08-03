"use client";



import React, { useState, useEffect } from 'react';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import { Button, TextField, Card, Typography, Box, CircularProgress, Alert, Avatar, IconButton } from '@mui/material';
import { Brightness4, Brightness7, Edit } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';
import { useAccount } from 'wagmi';
import NotConnected from '@/components/notConnected';

type RegisterNewUserCardProps = {
    formData: any;
    handleChange: any;
    handleRegisterCreator: any;
};


export default function RegisterNewUserCard({ formData, handleChange, handleRegisterCreator }: RegisterNewUserCardProps) {
    const { themeClasses: theme } = useTheme();
    const {
            hash,
            isPending,
            isConfirming,
            isConfirmed,
            error
    } = useAssetPlatformContract();

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.background,
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
            px: 2,
            position: 'relative'
        }}>
            
            <Card sx={{
                width: '100%',
                maxWidth: 500,
                p: 4,
                backgroundColor: theme.paper,
                boxShadow: `0px 4px 20px rgba(99, 102, 241, 0.2)`,
                borderRadius: 3,
                border: `1px solid ${theme.border}`,
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                        src={formData.profileImage || 'https://via.placeholder.com/100x100/6366f1/ffffff?text=User'} 
                        sx={{ 
                            width: 100, 
                            height: 100, 
                            mb: 2,
                            border: `2px solid ${theme.primary}` 
                        }} 
                    />
                    <Typography variant="h4" component="h1" sx={{ 
                        color: theme.primary,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Creator Registration
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: theme.textSecondary,
                        mt: 1,
                        textAlign: 'center'
                    }}>
                        Join our platform and start tokenizing your assets
                    </Typography>
                </Box>

                <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.primary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.primary,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: theme.textSecondary,
                                '&.Mui-focused': {
                                    color: theme.primary,
                                },
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.primary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.primary,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: theme.textSecondary,
                                '&.Mui-focused': {
                                    color: theme.primary,
                                },
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
                        rows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.primary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.primary,
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: theme.textSecondary,
                                '&.Mui-focused': {
                                    color: theme.primary,
                                },
                            },
                        }}
                        InputProps={{
                            style: {
                                color: theme.textPrimary,
                                backgroundColor: 'transparent',
                            }
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleRegisterCreator}
                        disabled={isPending || isConfirming || !formData.name}
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            backgroundColor: theme.primary,
                            color: theme.background,
                            '&:hover': {
                                backgroundColor: theme.secondary,
                                transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                                opacity: 0.7,
                                backgroundColor: theme.textMuted,
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isPending ? (
                            <CircularProgress size={24} sx={{ color: theme.background }} />
                        ) : isConfirming ? (
                            'Confirming...'
                        ) : (
                            'Register as Creator'
                        )}
                    </Button>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Error: {error.message}
                        </Alert>
                    )}

                    {hash && (
                        <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: theme.hoverBg, 
                            borderRadius: 1,
                            border: `1px solid ${theme.border}`
                        }}>
                            <Typography variant="body2" sx={{ color: theme.textPrimary }}>
                                Transaction submitted:
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: theme.primary,
                                wordBreak: 'break-all',
                                mt: 1,
                                fontFamily: 'monospace'
                            }}>
                                {hash}
                            </Typography>
                        </Box>
                    )}

                    {isConfirmed && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Registration confirmed! Welcome to the platform.
                        </Alert>
                    )}
                </Box>
            </Card>
        </Box>
    )
}



