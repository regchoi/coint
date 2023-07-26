import * as React from 'react';
import {alpha} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button, Stack} from "@mui/material";
import {AddCircle} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {createData} from "./data";  // 빈 배열을 생성하기위한 함수

import {useDispatch} from 'react-redux';
import {AppDispatch} from "../../redux/store";

interface EnhancedTableToolbarProps {
    numSelected: number;
    tableName: string;  // tableName을 DB에서 가져올 수 있음
    onAdd: () => void;
    onSave: () => void;
    onUpdate: () => void;
    onDelete: () => void;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const {numSelected, tableName, onAdd, onSave, onUpdate, onDelete} = props;

    // props로 dispatch를 받아서 처리할 수 있음
    // 추후 dispatch를 전달받아 동일한 형식 내에서의 다른 처리를 할 수 있음
    function handleDelete() {
        console.log("delete")
    }

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {/*// tableName을 DB에서 가져올 수 있음*/}
                    {tableName}
                </Typography>
            )}
            <Stack direction="row" spacing={1}>
                <Button variant="outlined" endIcon={<AddCircle/>} onClick={onAdd} color={"secondary"}
                        size={"small"} style={{minWidth: '70px'}}>
                    추가
                </Button>
                <Button variant="outlined" endIcon={<EditIcon/>} onClick={onUpdate} color={"warning"}
                        size={"small"} style={{minWidth: '70px'}}>
                    수정
                </Button>
                <Button variant="outlined" endIcon={<DeleteIcon/>} onClick={onDelete} color={"error"}
                        size={"small"} style={{minWidth: '70px'}}>
                    삭제
                </Button>
                <Button variant="outlined" endIcon={<SendIcon/>} onClick={onSave} color={"success"} size={"small"}
                        style={{minWidth: '70px'}}>
                    저장
                </Button>
            </Stack>
        </Toolbar>
    );
}
