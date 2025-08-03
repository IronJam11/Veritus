import react from 'react';
import { Button, TextField, Card, Typography, Box, CircularProgress, Alert, Avatar, IconButton } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

export default function NotConnected() {
    const { themeClasses: theme, isDarkMode, toggleTheme } = useTheme();
           return (
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: theme.background,
                color: theme.textPrimary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
                position: 'relative'
            }}>
                <Card sx={{
                    width: '100%',
                    maxWidth: 400,
                    p: 4,
                    backgroundColor: theme.paper,
                    boxShadow: `0px 4px 20px rgba(99, 102, 241, 0.2)`,
                    borderRadius: 3,
                    border: `1px solid ${theme.border}`,
                    textAlign: 'center'
                }}>
                    <Typography variant="h4" component="h1" sx={{ 
                        color: theme.primary,
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        Welcome!
                    </Typography>
                    <Typography variant="body1" sx={{ 
                        color: theme.textSecondary,
                        mb: 3
                    }}>
                        Please connect your wallet to access your profile and start tokenizing your assets.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: theme.textMuted
                    }}>
                        Use the connect wallet button in your application to get started.
                    </Typography>
                </Card>
            </Box>
        );
}
