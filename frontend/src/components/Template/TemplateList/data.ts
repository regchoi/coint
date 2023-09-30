// data.ts

// tableName 정의
const tableName: string = '템플릿조회';
const API_LINK: string = '/api/project';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    templateName: string;
    description: string;
    period: number;
    taskNum: number;
    workerNum: number;
    regDate: string;
    regUserid: string;
    detail: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    templateName: string,
    description: string,
    period: number,
    taskNum: number,
    workerNum: number,
    regDate: string,
    regUserid: string,
    detail: string,
): Data => {
    return {
        idNum,
        templateName,
        description,
        period,
        taskNum,
        workerNum,
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
    {id: 'templateName', numeric: false, disablePadding: false, label: '템플릿명'},
    {id: 'description', numeric: false, disablePadding: false, label: '상세설명'},
    {id: 'period', numeric: true, disablePadding: false, label: '기간'},
    {id: 'taskNum', numeric: true, disablePadding: false, label: '업무'},
    {id: 'workerNum', numeric: true, disablePadding: false, label: '작업인원'},
    {id: 'regDate', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'regUserid', numeric: false, disablePadding: false, label: '등록자'},
    {id: 'detail', numeric: false, disablePadding: false, label: '상세보기'},
];


export type {Data, HeadCell};
export {createData, headCells, tableName, API_LINK}
