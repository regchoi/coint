import React, {useEffect, useState} from 'react';
import {TableRow, TableCell, Checkbox, TextField, MenuItem, Select} from '@mui/material';
import {getUserId, getName } from '../../common/tokenUtils';
import { Data } from "./data";
import axios from "../../../redux/axiosConfig";

type Department = {
    idNum: number;
    departmentName: string;
};

type UserGroup = {
    idNum: number;
    usergroupName: string;
};


type EditableRowProps = {
    row: Data,
    labelId: string,
    onRowChange: (updatedRow: Data) => void,
    onState: string,
};

const EditableRow: React.FC<EditableRowProps> = ({row, labelId, onRowChange, onState}) => {
    const [editedRow, setEditedRow] = useState<Data>({
        ...row,
        getUserDepartmentResList: row.getUserDepartmentResList.length ? row.getUserDepartmentResList : [{ userDepartmentIdNum: 0, departmentIdNum: 0, departmentName: "" }],
        getUserUserGroupsResList: row.getUserUserGroupsResList.length ? row.getUserUserGroupsResList : [{ userUserGroupIdNum: 0, usergroupIdNum: 0, usergroupName: "" }]});
    const [departments, setDepartments] = useState<Department[]>([]);
    const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

    const handleRowChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLOptionElement>, key: keyof Data) => {
        const updatedRow = {...editedRow, [key]: event.target.value};
        setEditedRow(updatedRow);
        onRowChange(updatedRow);
    }

    // TODO: onBlur를 통해 type validation 구현

    return (
        <TableRow
            hover
            role="checkbox"
            tabIndex={row.idNum}
            key={row.idNum}
            sx={{backgroundColor: 'rgba(224, 255, 224, 0.4)'}}
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
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                    disabled={true} // 추가중인 행은 체크박스를 비활성화함
                    sx={{ width: '36px', height: '36px' }}
                />
            </TableCell>

            {(Object.keys(editedRow) as Array<keyof Data>).map(key => {
                // TODO: add user_id, 권한 동적 할당
                if (key === 'idNum') {
                    return null;
                }

                if (key === 'getUserDepartmentResList') {
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
                                    row[key] !== undefined
                                        ? row[key].map((item, index) => (<div key={index}>{item.departmentName}</div>))
                                        : ''
                            }
                        </TableCell>
                    )
                }

                if (key === 'getUserUserGroupsResList') {
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
                                row[key] !== undefined
                                    ? row[key].map((item, index) => (<div key={index}>{item.usergroupName}</div>))
                                    : ''
                            }
                        </TableCell>
                    )
                }

                if (key === 'regDate') {
                    const today = new Date();
                    return (
                        <TableCell align="center" key={key} sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "5px",
                            fontSize: "12px",
                            height: "45px"
                        }}>
                            {today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0')}
                        </TableCell>
                    );
                }

                if (key === 'regUserid') {
                    return (
                        <TableCell align="center" key={key} sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "5px",
                            fontSize: "12px",
                            height: "45px"
                        }}>
                            {getName()}
                        </TableCell>
                    );
                }

                if (key === 'detail') {
                    return  (
                        <TableCell align="center" key={key} sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "5px",
                            fontSize: "12px",
                            height: "45px"
                        }}>
                        </TableCell>
                    );
                }

                return (
                    <TableCell align="center" key={key} sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        padding: "5px",
                        fontSize: "12px",
                        height: "45px"
                    }}>
                        <TextField
                            value={editedRow[key]}
                            onChange={(event) => handleRowChange(event, key)}
                            sx={{
                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#409aff',
                                },
                                '& .MuiInputBase-input': {
                                    padding: 0,
                                    fontSize: '12px',
                                    height: '25px',
                                    paddingLeft: '10px',
                                    backgroundColor: '#fff'
                                }
                            }}
                        />
                    </TableCell>
                );
            })}

        </TableRow>
    );
};

export default EditableRow;
