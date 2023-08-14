import { styled } from '@mui/material/styles';
import {Outlet, useLocation} from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import {useEffect, useState} from "react";
import "../../assets/css/common/main-transition.css";


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

export default function MainContent({ open, drawerWidth }: MainProps) {
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(location);
    const [prevLocation, setPrevLocation] = useState(location);
    const [inProp, setInProp] = useState(false);

    useEffect(() => {
        if (location !== currentLocation) {
            setInProp(false);
            setPrevLocation(currentLocation);
            setCurrentLocation(location);
            setTimeout(() => {
                setInProp(true);
            }, 0);
        }
    }, [location, currentLocation]);


    return (
            <Main open={open} drawerWidth={drawerWidth} sx={{marginTop: '40px', backgroundColor: '#f5f7fa !important'}}>
                <CSSTransition
                    in={inProp}
                    appear={true}
                    timeout={300}
                    classNames="fade"
                >
                    <Outlet />
                </CSSTransition>
            </Main>
    );
}
