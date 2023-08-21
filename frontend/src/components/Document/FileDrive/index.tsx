import React, {useState} from 'react';
import Drive from "./Drive";
import DriveDirectory from "./DriveDirectory";
import {Grid} from "@mui/material";
import DriveContext from "./DriveContext";

const FileDrive = () => {
    const [projectIdNum, setProjectIdNum] = useState<number>(0);
    const [accessLevel, setAccessLevel] = useState<number[]>([]);

        return (
            <DriveContext.Provider value={{
                projectIdNum,
                setProjectIdNum,
                accessLevel
            }}>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                                <Drive />
                        </Grid>
                        <Grid item xs={3}>
                                <DriveDirectory />
                        </Grid>
                    </Grid>
            </DriveContext.Provider>
        );
};

export default FileDrive;
