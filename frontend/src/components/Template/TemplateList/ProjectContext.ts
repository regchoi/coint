import React from 'react';

type Role = {
    projectId: number;
    roleName: string;
    roleLevel: number;
    description: string;
}

type User = {
    idNum: number;
    name: string;
    email: string;
    department: string;
    role: number;
}

type Department = {
    idNum: number;
    departmentName: string;
    description: string;
    role: string;
}

type ProjectContextType = {
    // 권한 데이터 및 관련 함수
    rolesList: Role[];
    setRolesList: React.Dispatch<React.SetStateAction<Role[]>>;

    // 사용자 데이터 및 관련 함수
    usersList: User[];
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;

    // 부서 데이터 및 관련 함수
    departmentsList: Department[];
    setDepartmentsList: React.Dispatch<React.SetStateAction<Department[]>>;
}


const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

export default ProjectContext;
