// data.ts

// tableName 정의
const tableName: string = '사용자 관리';
const API_LINK: string = '/api/user';

// 테이블의 구조를 정의
// 테이블 데이터형을 명시적으로 정의함으로써 가독성과 안정성을 높임
interface Data {
    idNum: number;
    loginId: string;
    name: string;
    position: string;
    // getUserDepartmentResList는 빈배열일 수도 있기 때문에
    // 아래와 같이 정의해줘야 함
    getUserDepartmentResList: {
        idNum: number,
        departmentName: string
    }[] | [];
    email: string;
    usergroup: string;
    phone: string;
    regDate: string;
    regUserid: string;
}

// 빈 데이터 생성을 위한 함수
const createData = (
    idNum: number,
    loginId: string,
    name: string,
    position: string,
    getUserDepartmentResList: {
        idNum: number,
        departmentName: string
    }[] | [],
    email: string,
    usergroup: string,
    phone: string,
    regDate: string,
    regUserid: string,
): Data => {
    return {
        idNum,
        loginId,
        name,
        position,
        getUserDepartmentResList,
        email,
        usergroup,
        phone,
        regDate,
        regUserid,
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
    {id: 'loginId', numeric: false, disablePadding: false, label: '아이디'},
    {id: 'name', numeric: false, disablePadding: false, label: '이름'},
    {id: 'position', numeric: false, disablePadding: false, label: '직급'},
    {id: 'getUserDepartmentResList', numeric: false, disablePadding: false, label: '부서'},
    {id: 'email', numeric: false, disablePadding: false, label: '이메일'},
    {id: 'usergroup', numeric: false, disablePadding: false, label: '사용자 그룹'},
    {id: 'phone', numeric: false, disablePadding: false, label: '전화번호'},
    {id: 'regDate', numeric: false, disablePadding: false, label: '등록일'},
    {id: 'regUserid', numeric: false, disablePadding: false, label: '등록자'},
];


export type {Data, HeadCell};
export {createData, headCells, tableName, API_LINK}
