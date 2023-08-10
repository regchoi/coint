import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import {List} from "@mui/icons-material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {SyntheticEvent, useState} from "react";
import { useAppSelector } from '../../redux/store';
import {RootState} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    handleDrawer: () => void;
    drawerWidth: number;
}

interface StyledAppBarProps {
    open?: boolean;
    drawerWidth: number;
}

const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<StyledAppBarProps>(({ theme, open, drawerWidth }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function AppBar({ open, handleDrawer, drawerWidth }: AppBarProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const tabs = useAppSelector((state: RootState) => state.tab);
    const navigate = useNavigate();

    function handleTabClick(path: string) {
        navigate(path);
    }

    return (
        <StyledAppBar position="fixed" open={open} drawerWidth={drawerWidth} sx={{backgroundColor: '#fff', color: '#000', height: '40px'}}>
            <Toolbar sx={{height: '40px', minHeight: '40px !important'}}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawer}
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    {
                        open ? <MenuIcon /> : <List />
                    }
                </IconButton>

                <Tabs value={currentPath} aria-label="simple tabs example" sx={{height: '40px', minHeight: "40px"}}>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.name}
                            value={tab.path}
                            onClick={() => handleTabClick(tab.path)}
                            sx={{
                                height: '40px',
                                minHeight: "40px",
                                padding: "0 12px",
                                "&.Mui-selected": { backgroundColor: "#f5f7fa", fontWeight: "bold" }
                            }}
                        />
                    ))}
                </Tabs>
            </Toolbar>
        </StyledAppBar>
    );
}
