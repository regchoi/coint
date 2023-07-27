import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {loggedIn} from "../../redux/authSlice";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import ErrorModal from "../common/ErrorModal";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://cointcompany.com/?page_id=2">
                COINT Company
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LogIn() {
    const dispatch = useAppDispatch();
    const [credentials, setCredentials] = useState({id: '', password: ''});
    const error = useAppSelector(state => state.auth.error);
    // 에러 확인 Modal 상태 관리
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    // 요청 실패 시 에러 처리
    useEffect(() => {
        if (error) {
            setErrorModalOpen(true);
        }
    }, [error]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(loggedIn(credentials));
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            {/* 에러 발생 Modal */}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="로그인 실패"
                description={error?.message || ""}
            />
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="id"
                            label="ID"
                            name="id"
                            value={credentials.id}
                            onChange={handleChange}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={credentials.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />

                        {/*if TODO: Remember me 기능 추가*/}
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}


                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            {/*<Grid item xs>*/}
                            {/*    <Link href="#" variant="body2">*/}
                            {/*        Grid 1 - if Find Password*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                            {/*<Grid item>*/}
                            {/*    <Link href="#" variant="body2">*/}
                            {/*        {"Grid 2 - if SignUp"}*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}