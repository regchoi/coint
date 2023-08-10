import React from 'react';
import {TableRow, TableCell, Checkbox} from '@mui/material';
import {Data} from "./data";

type RowProps = {
    row: Data,
    labelId: string,
    isItemSelected: boolean,
    handleClick: (event: React.MouseEvent<unknown>, id_num: number) => void,
};

// 가져온 데이터의 각 행을 자동적으로 구성하는 컴포넌트
// row의 각 key를 기준으로 TableCell을 구성함
// 각 key는 Data의 key type인 keyof Data로 정의함
const Row: React.FC<RowProps> = ({row, labelId, isItemSelected, handleClick}) => (
    <TableRow
        hover
        onClick={(event) => handleClick(event, row.idNum)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.idNum}
        selected={isItemSelected}
        sx={{cursor: 'pointer'}}
    >
        <TableCell padding="checkbox" sx={{
            width: '30px', height: '30px',
            border: "1px solid rgba(0, 0, 0, 0.12)",
            padding: "0px 10px",
            fontSize: "12px",
            textAlign: "center"
        }}>
            <Checkbox
                color="primary"
                checked={isItemSelected}
                inputProps={{
                    'aria-labelledby': labelId,
                }}
                sx={{ width: '40px', height: '40px' }}
            />
        </TableCell>

        {/* row에 들어있는 Data를 처리하는 부분*/}
        {/* key값을 기준으로 TableCell을 유동적으로 구성함*/}
        {(Object.keys(row) as Array<keyof Data>).map(key => {
            if (key === 'idNum') {
                return <TableCell sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "0px 10px",
                    fontSize: "12px",
                }} align="center" key={key}></TableCell>;
            }
            {
                if (key === 'getUserDepartmentResList' || key === 'getUserUserGroupsResList') {
                    return (
                        <TableCell
                            sx={{
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                padding: "0px 10px",
                                fontSize: "12px",
                            }}
                            align="center"
                            key={key}
                        >
                            {
                                // row[key]가 빈배열일 수 있음
                                // row[key]가 빈배열이 아닐 경우, map을 통해 각 요소를 출력함
                                // row[key]가 빈배열일 경우, 빈 문자열을 출력함
                                key === 'getUserUserGroupsResList' && row[key] !== undefined
                                    ? row[key].map((item, index) => (<div key={index}>{item.usergroupName}</div>))
                                    : key === 'getUserDepartmentResList' && row[key] !== undefined
                                        ? row[key].map((item, index) => (<div key={index}>{item.departmentName}</div>))
                                        : ''
                            }
                        </TableCell>
                    );
                }
            }
            if (key === 'regDate') {
                return <TableCell sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "0px 10px",
                    fontSize: "12px",
                }} align="center" key={key}>{row[key] && (row[key]).toString().substring(0, 10)}</TableCell>;
            }
            return <TableCell sx={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: "0px 10px",
                fontSize: "12px",
            }} align="center" key={key}>{row[key]}</TableCell>;
        })}
    </TableRow>
);

export default Row;