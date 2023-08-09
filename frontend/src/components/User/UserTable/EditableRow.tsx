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
    const [editedRow, setEditedRow] = useState<Data>(row);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [userGroups, setUserGroups] = useState<UserGroup[]>([]);


    // department, usergroup redux로 값 받아오기
    useEffect(() => {
        // department
        axios.get('/api/user/department')
            .then((response) => {
                const deptData = response.data.map((dept: any) => ({
                    idNum: dept.idNum,
                    departmentName: dept.departmentName
                }));
                setDepartments(deptData);
            })
            .catch((error) => {
                console.log(error);
            });

        // usergroup
        axios.get('/api/user/usergroup')
            .then((response) => {
                const usergroupData = response.data.map((usergroup: any) => ({
                    idNum: usergroup.idNum,
                    usergroupName: usergroup.usergroupName
                }));
                setUserGroups(usergroupData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



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
                    return (
                        <TableCell align="center" key={key} sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "5px",
                            fontSize: "12px",
                            height: "45px"
                        }}>
                        </TableCell>
                    );
                }

                if (key === 'department' || key === 'usergroup') {
                    return (
                        <TableCell align="center" key={key} sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "5px",
                            fontSize: "12px",
                            height: "45px"
                        }}>
                            <Select
                                value={editedRow[key]}
                                onChange={(event) => {
                                    const syntheticEvent = {
                                        target: {
                                            value: event.target.value,
                                            name: event.target.name
                                        },
                                        preventDefault: event.preventDefault,
                                        stopPropagation: event.stopPropagation
                                    } as React.ChangeEvent<HTMLInputElement>;
                                    handleRowChange(syntheticEvent, key);
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#409aff',
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: 0,
                                        fontSize: '12px',
                                        height: '25px',
                                        paddingLeft: '10px',
                                        backgroundColor: '#fff',
                                        minWidth: '50px'
                                    }
                                }}
                            >
                                {
                                    key === 'department' ?
                                        departments.map(dept => (
                                            <MenuItem key={dept.idNum} value={dept.idNum}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))
                                    :
                                    key === 'usergroup' ?
                                        userGroups.map(usergroup => (
                                            <MenuItem key={usergroup.idNum} value={usergroup.idNum}>
                                                {usergroup.usergroupName}
                                            </MenuItem>
                                        ))
                                        :
                                        null
                                }
                            </Select>
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
