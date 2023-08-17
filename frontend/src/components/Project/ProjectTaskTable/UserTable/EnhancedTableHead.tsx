import * as React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import {visuallyHidden} from "@mui/utils";
import {Data, headCells} from "./data";
import {Order} from "./sort";

// 테이블 헤더
interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export default function EnhancedTableHead(props: EnhancedTableProps) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>


                <TableCell padding="checkbox"
                           sx={{
                               width: '30px', height: '30px',
                               border: "1px solid rgba(0, 0, 0, 0.12)",
                               padding: "0px 10px",
                               fontWeight: "bold",
                               fontSize: "12px",
                               backgroundColor: "hsl(210, 7%, 89%)",
                               textAlign: "center"
                           }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        sx={{ width: '30px', height: '30px' }}
                    />
                </TableCell>


                {/* 정의해둔 headCells로 테이블 헤더를 생성 */}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "0px 10px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            backgroundColor: "hsl(210, 7%, 89%)",
                            maxWidth: "100px",
                            // headCell.id가 'Seq'일 경우, width: '30px'로 설정
                            width: headCell.id === 'idNum' ? '30px' : 'auto',
                    }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={{
                                paddingLeft: '18px'
                            }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
