import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {createData, Data, tableName, API_LINK, headCells} from "./data";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import Row from "./Row";
import useTable from "./useTable";
import {useEffect, useState} from "react";
import {addTableData, deleteTableData, fetchTableData, updateTableData} from "../../../redux/tableSlice";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../../redux/store";
import EditableRow from "./EditableRow";
import {Button, LinearProgress, Modal, Snackbar, SnackbarCloseReason, Typography} from "@mui/material";
import ErrorModal from "../../common/ErrorModal";
import AddModal from "./AddModal";
import { CSSTransition } from 'react-transition-group';
import "../../../assets/css/common/modal-transition.css";

export default function ProjectPlan() {
    const dispatch = useAppDispatch();
    const [added, setAdded] = useState([] as Data[]);
    const [addId, setAddId] = useState(2147483647);
    const [updated, setUpdated] = useState([] as Data[]);
    // 생성 Modal 상태 관리
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    // 삭제 확인 Modal 상태 관리
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    // 에러 확인 Modal 상태 관리
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    const { data, loading, error } = useAppSelector(state => state.table);

    // table data를 가져오는 hook
    useEffect(() => {
        dispatch(fetchTableData(API_LINK));
    }, [dispatch]);

    // 요청 실패 시 에러 처리
    // error가 undefined일 수 있음
    useEffect(() => {
        if (error) {
            setErrorModalOpen(true);
        }
    }, [error]);

    // Error Modal 닫기
    const handleCloseErrorModal = () => {
        setErrorModalOpen(false);
    }

    // selected 해제를 위한 함수
    const dummyEvent = {
        target: {
            checked: false,
        },
    } as React.ChangeEvent<HTMLInputElement>;


    // added data를 추가하는 함수
    const handleAdd = () => {
        setCreateModalOpen(!isCreateModalOpen);
    }
    // added data의 각 항목을 변경하는 함수
    const handleAddRowChange = (updatedRow: Data) => {
        setAdded(updatedRows => {
            const existingRow = updatedRows.find(row => row.idNum === updatedRow.idNum);
            if (existingRow) {
                return updatedRows.map(row => row.idNum === updatedRow.idNum ? updatedRow : row);
            } else {
                return [...updatedRows, {...updatedRow, idNum: addId}];
            }
        });
        setAddId(addId + 1);  // addId 값을 증가시킵니다.
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
        try {
            // selected 배열에 있는 id_num들을 추출합니다.
            const selectedForDeletion = data.filter(row => selected.includes(row.idNum)).map(row => row.idNum);

            // 서버에 삭제할 데이터 전송
            await dispatch(deleteTableData({ apiUrl: `${API_LINK}/delete`, ids: selectedForDeletion }));

            // 삭제 완료 후에 selected 상태 초기화
            handleSelectAllClick(dummyEvent); // dummyEvent를 통해 selected 상태 초기화

            // 삭제 확인 Modal 닫기
            handleCloseDeleteModal();

            // 서버의 데이터를 다시 불러오기
            dispatch(fetchTableData(API_LINK));
        } catch (error) {
            // 에러 처리
            console.error('Error while deleting data:', error);
        }
    };

    // selected 항목들을 updated 상태로 이동시키는 함수
    const handleUpdate = () => {
        const selectedRows = data.filter(row => selected.includes(row.idNum));
        setUpdated([...updated, ...selectedRows]);
        // 이동한 항목들은 selected에서 제거
        handleSelectAllClick(dummyEvent); // dummyEvent를 통해 selected 상태 초기화
    };

    // updated data의 각 항목을 변경하는 함수
    const handleUpdateRowChange = (updatedRow: Data) => {
        setUpdated(updatedRows => {
            const existingRow = updatedRows.find(row => row.idNum === updatedRow.idNum);
            if (existingRow) {
                return updatedRows.map(row => row.idNum === updatedRow.idNum ? updatedRow : row);
            } else {
                return [...updatedRows, updatedRow];
            }
        });
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
        rowsData: data,
    });

    return (
        <Box sx={{width: '100%'}}>
            {loading === 'loading' && <LinearProgress/>}
            <Paper sx={{width: '100%', mb: 2, padding: '10px'}}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    tableName={tableName}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onDelete={handleOpenDeleteModal}    // 삭제 버튼 클릭 시, 삭제 확인 Modal 열기
                />
                <TableContainer sx={{borderRadius: '3px'}}>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
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
                    count={data.length}
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

            {/*프로젝트 생성 모달 (필요한 경우에 Transition) */}
            <CSSTransition
                in={true}
                appear={true}
                timeout={300}
                classNames="fade">
                <AddModal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                />
            </CSSTransition>
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
                description={error?.message || ""}
            />

        </Box>
    );
}