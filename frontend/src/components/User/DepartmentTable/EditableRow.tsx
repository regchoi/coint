import React, { useState } from 'react';
import { TableRow, TableCell, Checkbox, TextField } from '@mui/material';
import {getUserId, getName } from '../../common/tokenUtils';
import { Data } from "./data";

type EditableRowProps = {
    row: Data,
    labelId: string,
    onRowChange: (updatedRow: Data) => void,
    onState: string,
};

const EditableRow: React.FC<EditableRowProps> = ({row, labelId, onRowChange, onState}) => {
    const [editedRow, setEditedRow] = useState<Data>(row);

    const handleRowChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Data) => {
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


                if(onState === 'added') {
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

                    if (key === 'modUserid') {
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

                    if (key === 'modDate') {
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
                } else if(onState === 'updated') {
                    if (key === 'regDate') {
                        const today = new Date();
                        return (
                            <TableCell align="center" key={key} sx={{
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                padding: "5px",
                                fontSize: "12px",
                                height: "45px"
                            }}>
                                {editedRow[key].toString().substring(0, 10)}
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
                                {editedRow[key]}
                            </TableCell>
                        );
                    }

                    if (key === 'modUserid') {
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

                    if (key === 'modDate') {
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
