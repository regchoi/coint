// src/components/Logout.tsx
import React from 'react';
import {useDispatch} from 'react-redux';
import {logout} from '../../redux/authSlice';
import {useAppDispatch} from "../../redux/store";

const Logout: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <button onClick={() => dispatch(logout())}>Logout</button>
    );
};

export default Logout;
