// data.ts

// tableName 정의
const tableName: string = '프로젝트 작업자관리';
const API_LINK: string = '/api/user';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    userName: string;
    role: string;
}

interface UserData {
    idNum: number;
    name: string;
    email: string;
    department: string;
    role: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    userName: string,
    role: string,
): Data => {
    return {
        idNum,
        userName,
        role
    };
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {id: 'idNum', numeric: true, disablePadding: false, label: 'Seq'},
    {id: 'userName', numeric: false, disablePadding: false, label: '이름'},
    {id: 'role', numeric: false, disablePadding: false, label: '역할'},
];


export type {Data, UserData, HeadCell};
export {createData, headCells, tableName, API_LINK}
