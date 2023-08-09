import React, { useState } from 'react';
import { TableRow, TableCell, Checkbox, TextField } from '@mui/material';
import { Data } from "./data";

type EditableRowProps = {
    row: Data,
    labelId: string,
    onRowChange: (updatedRow: Data) => void,
};

const EditableRow: React.FC<EditableRowProps> = ({row, labelId, onRowChange}) => {
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
            tabIndex={row.id_num}
            key={row.id_num}
        >
            <TableCell padding="checkbox"  sx={{border: "1px solid rgba(0, 0, 0, 0.12)"}}>
                <Checkbox
                    color="primary"
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                    disabled={true} // 추가중인 행은 체크박스를 비활성화함
                />
            </TableCell>

            {(Object.keys(editedRow) as Array<keyof Data>).map(key => {
                if (key === 'id_num' || key === 'reg_date' || key === 'reg_userid' || key === 'mod_userid' || key === 'mod_date') {
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