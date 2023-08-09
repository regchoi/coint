// data.ts

// tableName 정의
const tableName: string = '부서 관리';
const API_LINK: string = '/api/user/department';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    departmentName: string;
    description: string;
    regUserid: string;
    regDate: string;
    modUserid: string;
    modDate: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    departmentName: string,
    description: string,
    regUserid: string,
    regDate: string,
    modUserid: string,
    modDate: string,
): Data => {
    return {
        idNum,
        departmentName,
        description,
        regUserid,
        regDate,
        modUserid,
        modDate,
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
    {id: 'departmentName', numeric: false, disablePadding: false, label: '부서명'},
    {id: 'description', numeric: false, disablePadding: false, label: '상세'},
    {id: 'regUserid', numeric: false, disablePadding: false, label: '등록자'},
    {id: 'regDate', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'modUserid', numeric: false, disablePadding: false, label: '수정자'},
    {id: 'modDate', numeric: false, disablePadding: false, label: '수정일'},
];


export type {Data, HeadCell};
export {createData, headCells, tableName, API_LINK}
