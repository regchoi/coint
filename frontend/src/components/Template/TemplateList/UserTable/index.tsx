import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {createData, Data, UserData, tableName, API_LINK, headCells} from "./data";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Row from "./Row";
import useTable from "./useTable";
import {useEffect, useState} from "react";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../../../redux/store";
import EditableRow from "./EditableRow";
import {Button, IconButton, LinearProgress, Modal, Snackbar, SnackbarCloseReason, Typography} from "@mui/material";
import ErrorModal from "../../../common/ErrorModal";
import AddUserTable from "./AddUserTable";
import CloseIcon from "@mui/icons-material/Close";
import ProjectContext from "../ProjectContext";

const UserType = (usersList: UserData[]): Data[] => {
    return usersList && usersList.map((user) => {
        return {
            idNum: user.idNum,
            userName: user.name,
            role: user.role,
        }
    });
}

export default function UserTable() {
    const dispatch = useAppDispatch();
    const [added, setAdded] = useState([] as Data[]);
    const [addId, setAddId] = useState(2147483647);
    const [updated, setUpdated] = useState([] as Data[]);
    // 사용자 추가 Modal 상태 관리
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    // 삭제 확인 Modal 상태 관리
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    // 에러 확인 Modal 상태 관리
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("Cannot find ProjectProvider1");
    }
    const { usersList, setUsersList } = context;
    const transformedUsersList = UserType(usersList);
    const [localUsersList, setLocalUsersList] = useState(transformedUsersList);

    useEffect(() => {
        const transformedUsers = UserType(usersList);
        setLocalUsersList(transformedUsers);
    }, [usersList]);

    // selected 해제를 위한 함수
    const dummyEvent = {
        target: {
            checked: false,
        },
    } as React.ChangeEvent<HTMLInputElement>;


    // added data를 추가하는 함수
    const handleAdd = () => {
        handleOpenAddUserModal();
    }
    // added data의 각 항목을 변경하는 함수
    const handleAddRowChange = (updatedRow: Data) => {
    };

    // 사용자 추가 Modal 열기
    const handleOpenAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };
    // 사용자 추가 Modal 닫기
    const handleCloseAddUseModal = () => {
        setIsAddUserModalOpen(false);
    };
    // 삭제 확인 Modal 열기
    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };
    // 삭제 확인 Modal 닫기
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };
    // 선택된 항목들을 삭제하는 함수
    const handleDelete = async () => {
    };
    // updated data의 각 항목을 변경하는 함수
    const handleUpdateRowChange = (updatedRow: Data) => {
    }

    // table 관련 hook들을 관리하는 커스텀 hook
    const {
        order,
        orderBy,
        selected,
        page,
        dense,
        rowsPerPage,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleChangePage,
        handleChangeRowsPerPage,
        isSelected,
        emptyRows,
        visibleRows,
    } = useTable({
        initialOrderBy: 'idNum',
        initialOrder: 'asc',
        initialRowsPerPage: 5,
        rowsData: localUsersList,
    });

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', padding: '10px', border: 'none', boxShadow: 'none'}}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    tableName={tableName}
                    onAdd={handleAdd}
                />
                <TableContainer sx={{borderRadius: '3px'}}>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={localUsersList.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.idNum);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                // updated에 포함된 항목들은 EditableRow로 표현
                                if (updated.some(updatedRow => updatedRow.idNum === row.idNum)) {
                                    return (
                                        <EditableRow
                                            key={row.idNum}
                                            row={row}
                                            labelId={labelId}
                                            onRowChange={handleUpdateRowChange}
                                            onState={'updated'}
                                        />
                                    );
                                } else {
                                    return (
                                        <Row
                                            key={row.idNum}
                                            row={row}
                                            labelId={labelId}
                                            isItemSelected={isItemSelected}
                                            handleClick={handleClick}
                                        />
                                    );
                                }
                            })}

                            {/*추가 예정인 컬럼들 EditableRow로 변경*/}
                            {added.map((row, index) => {
                                const isItemSelected = isSelected(row.idNum);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <EditableRow
                                        key={row.idNum}
                                        row={row}
                                        labelId={labelId}
                                        onRowChange={handleAddRowChange}
                                        onState={'added'}
                                    />
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}  sx={{border: "1px solid rgba(0, 0, 0, 0.12)"}} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={localUsersList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {/*// padding 관련 설정 (라이브러리 기본 제공)*/}
            {/*<FormControlLabel*/}
            {/*    control={<Switch checked={dense} onChange={handleChangeDense}/>}*/}
            {/*    label="Dense padding"*/}
            {/*/>*/}

            {/* 사용자 추가 Modal */}
            <Modal
                open={isAddUserModalOpen}
                onClose={handleOpenAddUserModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    minWidth: 300,
                    minHeight: '50vh',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: '10px',
                }}>
                    <Typography variant="h6"
                                component={"div"}
                                sx={{
                                    borderBottom: '2px solid #f0f0f0',
                                    pb: 2,
                                    mb: 2,
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                    <span>
                    프로젝트 작업자관리
                    </span>
                        <IconButton onClick={handleCloseAddUseModal} size="small" sx={{ padding: '0' }}>
                            <CloseIcon />
                        </IconButton>
                    </Typography>

                    <AddUserTable onClose={handleCloseAddUseModal} />
                </Box>
            </Modal>

            {/* 삭제 확인 Modal */}
            <Modal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        { selected.length }개의 항목 삭제
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                        선택한 항목을 정말 삭제하시겠습니까?
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseDeleteModal} color="primary" sx={{ mr: 2 }}>
                            취소
                        </Button>
                        <Button onClick={handleDelete} variant="contained" color="error">
                            삭제
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/*
            에러 발생 Modal
            ErrorModal은 Error처리 시 Modal을 띄워줄 수 있는 재사용 가능한 컴포넌트입니다.
             */}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="요청 실패"
                description={"요청에 실패하였습니다. 다시 시도해주세요."}
            />

        </Box>
    );
}