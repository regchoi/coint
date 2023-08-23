// data.ts

// tableName 정의
const tableName: string = '사용자 그룹 관리';
const API_LINK: string = '/api/user/usergroup';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    usergroupName: string;
    description: string;
    regUserid: string;
    regDate: string;
    modUserid: string;
    modDate: string;
    detail: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    usergroupName: string,
    description: string,
    regUserid: string,
    regDate: string,
    modUserid: string,
    modDate: string,
    detail: string,
): Data => {
    return {
        idNum,
        usergroupName,
        description,
        regUserid,
        regDate,
        modUserid,
        modDate,
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
    {id: 'usergroupName', numeric: false, disablePadding: false, label: '유저그룹명'},
    {id: 'description', numeric: false, disablePadding: false, label: '상세'},
    {id: 'regUserid', numeric: false, disablePadding: false, label: '등록자'},
    {id: 'regDate', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'modUserid', numeric: false, disablePadding: false, label: '수정자'},
    {id: 'modDate', numeric: false, disablePadding: false, label: '수정일'},
    {id: 'detail', numeric: false, disablePadding: false, label: '그룹관리'},
];


export type {Data, HeadCell};
export {createData, headCells, tableName, API_LINK}
