// data.ts

// tableName 정의
const tableName: string = '프로젝트 계획';
const API_LINK: string = '/api/user';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    regDate: string;
    regUserid: string;
    detail: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    projectName: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string,
    regDate: string,
    regUserid: string,
    detail: string,
): Data => {
    return {
        idNum,
        projectName,
        description,
        startDate,
        endDate,
        status,
        regDate,
        regUserid,
        detail,
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
    {id: 'projectName', numeric: false, disablePadding: false, label: '프로젝트명'},
    {id: 'description', numeric: false, disablePadding: false, label: '프로젝트 상세'},
    {id: 'startDate', numeric: false, disablePadding: false, label: '시작일'},
    {id: 'endDate', numeric: false, disablePadding: false, label: '종료일'},
    {id: 'status', numeric: false, disablePadding: false, label: '상태'},
    {id: 'regDate', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'regUserid', numeric: false, disablePadding: false, label: '등록자'},
    {id: 'detail', numeric: false, disablePadding: false, label: '작업관리'},
];


export type {Data, HeadCell};
export {createData, headCells, tableName, API_LINK}
