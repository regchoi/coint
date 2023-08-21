import React, {useState} from 'react';
import Drive from "./Drive";
import DriveDirectory from "./DriveDirectory";
import {Grid} from "@mui/material";

const FileDrive = () => {return (
    <Grid container spacing={2}>
        <Grid item xs={9}>
                <Drive />
        </Grid>
        <Grid item xs={3}>
                <DriveDirectory />
        </Grid>
    </Grid>
);
};

export default FileDrive;
