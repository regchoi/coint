import React from 'react';

type DriveContextType = {
    projectIdNum: number;
    setProjectIdNum: React.Dispatch<React.SetStateAction<number>>;

    accessLevel: number[];
}

const DriveContext = React.createContext<DriveContextType | undefined>(undefined);

export default DriveContext;
