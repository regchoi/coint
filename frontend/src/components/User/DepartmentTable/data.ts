// data.ts

// tableName 정의
const tableName: string = '부서 관리';
const API_LINK: string = '/api/table';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    id_num: number;
    department_name: string;
    description: string;
    reg_userid: number;
    reg_date: string;
    mod_userid: number | null;
    mod_date: string | null;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    id_num: number,
    department_name: string,
    description: string,
    reg_userid: number,
    reg_date: string,
    mod_userid: number | null,
    mod_date: string | null,
): Data => {
    return {
        id_num,
        department_name,
        description,
        reg_userid,
        reg_date,
        mod_userid,
        mod_date,
    };
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {id: 'id_num', numeric: true, disablePadding: false, label: 'reg'},
    {id: 'department_name', numeric: false, disablePadding: false, label: '권한'},
    {id: 'description', numeric: false, disablePadding: false, label: '설명'},
    {id: 'reg_userid', numeric: true, disablePadding: false, label: '등록자'},
    {id: 'reg_date', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'mod_userid', numeric: true, disablePadding: false, label: '수정자'},
    {id: 'mod_date', numeric: false, disablePadding: false, label: '수정일'},
];


export type {Data};
export {createData, headCells, tableName, API_LINK}
