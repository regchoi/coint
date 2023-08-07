import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './AppBar';
import SideDrawer from './Drawer';
import MainContent from './Main';

const drawerWidth = 260;

export default function Layout() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawer = () => {
        setOpen(!open);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar open={open} handleDrawer={handleDrawer} drawerWidth={drawerWidth} />
            <SideDrawer open={open} drawerWidth={drawerWidth} />
            <MainContent open={open} drawerWidth={drawerWidth} />
        </Box>
    );
}
