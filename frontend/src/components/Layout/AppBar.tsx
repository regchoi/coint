import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import {List} from "@mui/icons-material";

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
    return (
        <StyledAppBar position="fixed" open={open} drawerWidth={drawerWidth}>
            <Toolbar>
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
                <Typography variant="h6" noWrap component="div">
                    Persistent drawer
                </Typography>
            </Toolbar>
        </StyledAppBar>
    );
}
