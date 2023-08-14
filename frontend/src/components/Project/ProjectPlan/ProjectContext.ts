import React from 'react';

type User = {
    idNum: number;
    name: string;
    email: string;
    department: string;
    role: string;
}

type Department = {
    idNum: number;
    departmentName: string;
    description: string;
    role: string;
}

type ProjectContextType = {
    // 사용자 데이터 및 관련 함수
    usersList: User[];
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;

    // 부서 데이터 및 관련 함수
    departmentsList: Department[];
    setDepartmentsList: React.Dispatch<React.SetStateAction<Department[]>>;
}


const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

export default ProjectContext;
