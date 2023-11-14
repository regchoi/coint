import React, {useEffect} from 'react';
import {TableRow, TableCell, Checkbox, IconButton} from '@mui/material';
import {Data} from "./data";
import { useNavigate } from 'react-router-dom';
import axios from "../../../../redux/axiosConfig";
import ProjectContext from "../ProjectContext";

type Role = {
    projectId: number;
    roleName: string;
    roleLevel: number;
    description: string;
}

type RowProps = {
    row: Data,
    labelId: string,
    isItemSelected: boolean,
    handleClick: (event: React.MouseEvent<unknown>, id_num: number) => void,
};

// 가져온 데이터의 각 행을 자동적으로 구성하는 컴포넌트
// row의 각 key를 기준으로 TableCell을 구성함
// 각 key는 Data의 key type인 keyof Data로 정의함
const Row: React.FC<RowProps> = ({row, labelId, isItemSelected, handleClick}) => {
    const [rolesList, setRolesList] = React.useState<Role[]>([]);

    const navigate = useNavigate();

    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("Cannot find ProjectProvider");
    }
    const { selectProject } = context;

    useEffect(() => {
        // 역할 목록 불러오기
        axios.get(`/api/project/role/${selectProject.idNum}`)
            .then((response) => {
                const roleData = response.data.map((role: any) => ({
                    projectId: role.projectIdNum,
                    roleName: role.roleName,
                    roleLevel: role.roleLevel,
                    description: role.description
                }));
                setRolesList(roleData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
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
                    sx={{width: '40px', height: '40px'}}
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
                if (key === 'role') {
                    return <TableCell sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        padding: "0px 10px",
                        fontSize: "12px",
                    }} align="center" key={key}>{
                        rolesList.map((role) => {
                            if (role.roleLevel === Number(row[key])) {
                                return role.roleName;
                            }
                        })
                    }</TableCell>;
                }
                return <TableCell sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "0px 10px",
                    fontSize: "12px",
                }} align="center" key={key}>{row[key]}</TableCell>;
            })}
        </TableRow>
    );
};

export default Row;