import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {Outlet} from "react-router-dom";


interface MainProps {
    open: boolean;
    drawerWidth: number;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainProps>(
    ({ theme, open, drawerWidth }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function MainContent({ open, drawerWidth }: MainProps) {
    return (
        <Main open={open} drawerWidth={drawerWidth} sx={{marginTop: '64px'}}>
            <Outlet />
        </Main>
    );
}
