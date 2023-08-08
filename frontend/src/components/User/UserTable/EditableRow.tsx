import React, { useState } from 'react';
import { TableRow, TableCell, Checkbox, TextField } from '@mui/material';
import { Data } from "./data";

// // JWT에서 가져온 사용자 정보
// interface CustomJwtPayload extends jwt.JwtPayload {
//     name?: string;
// }
//
// const SECRET_KEY = Buffer.from(
//     "VGhpcyBpcyBhIGRlbW8gcHJvamVjdCBmb3IgaW1wbGVtZW50aW5nIGp3dC4=VGhpcyBpcyBhIGRlbW8gcHJvamVjdCBmb3IgaW1wbGVtZW50aW5nIGp3dC4=",
//     'base64'
// ).toString();
//
// const getNameFromToken = (token: string) => {
//     try {
//         const decodedJWT = jwt.verify(token, SECRET_KEY, { algorithms: ['HS512'] }) as CustomJwtPayload;
//         return decodedJWT?.name || null;
//     } catch (error) {
//         console.error('Failed to verify JWT:', error);
//         return null;
//     }
// };
//
// // 테스트를 위한 샘플 JWT 토큰
// const sampleToken = localStorage.getItem('token');
// if(sampleToken) console.log(getNameFromToken(sampleToken));
//

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
                // TODO: add user_id, 권한 동적 할당
                if (key === 'id_num' || key === 'reg_date' || key === 'reg_userid') {
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
