import React from 'react';

export type DirectoryAuthority = {
    idNum: number;
    level: number;
    directoriesIdNum: number;
};

export type DocumentAuthority = {
    idNum: number;
    level: number;
    star: boolean;
    documentsIdNum: number;
};

type DriveContextType = {
    projectIdNum: number;
    setProjectIdNum: React.Dispatch<React.SetStateAction<number>>;
    directoryAuthorities: DirectoryAuthority[];
    setDirectoryAuthorities: React.Dispatch<React.SetStateAction<DirectoryAuthority[]>>;
    documentAuthorities: DocumentAuthority[];
    setDocumentAuthorities: React.Dispatch<React.SetStateAction<DocumentAuthority[]>>;
};

export const DriveContext = React.createContext<DriveContextType | undefined>(undefined);

export default DriveContext;
