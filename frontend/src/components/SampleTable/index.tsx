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
import {addTableData, deleteTableData, fetchTableData, updateTableData} from "../../redux/tableSlice";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../redux/store";
import EditableRow from "./EditableRow";
import {Button, Modal, Typography} from "@mui/material";

export default function SampleTable() {
    const dispatch = useAppDispatch();
    const [added, setAdded] = useState([] as Data[]);
    const [addId, setAddId] = useState(2147483647);
    const [updated, setUpdated] = useState([] as Data[]);
    // 삭제 확인 Modal 상태 관리
    const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const { data, loading, error } = useAppSelector(state => state.table);

    // table data를 가져오는 hook
    useEffect(() => {
        dispatch(fetchTableData(API_LINK));
    }, [dispatch]);

    // selected 해제를 위한 함수
    const dummyEvent = {
        target: {
            checked: false,
        },
    } as React.ChangeEvent<HTMLInputElement>;


    // added data를 추가하는 함수
    const handleAdd = () => {
        const newData: Data = createData(addId, '', 0, '', '', '', '', false, '', '', '', '');
        setAdded([...added, newData]);
        setAddId(addId + 1);
    }
    // added data의 각 항목을 변경하는 함수
    const handleAddRowChange = (updatedRow: Data) => {
        setAdded(updatedRows => {
            const existingRow = updatedRows.find(row => row.id_num === updatedRow.id_num);
            if (existingRow) {
                return updatedRows.map(row => row.id_num === updatedRow.id_num ? updatedRow : row);
            } else {
                return [...updatedRows, updatedRow];
            }
        });
    }

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
            const selectedForDeletion = data.filter(row => selected.includes(row.id_num)).map(row => row.id_num);

            // 서버에 삭제할 데이터 전송
            await dispatch(deleteTableData({ apiUrl: API_LINK, ids: selectedForDeletion }));

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
        const selectedRows = data.filter(row => selected.includes(row.id_num));
        setUpdated([...updated, ...selectedRows]);
        // 이동한 항목들은 selected에서 제거
        handleSelectAllClick(dummyEvent); // dummyEvent를 통해 selected 상태 초기화
    };

    // updated data의 각 항목을 변경하는 함수
    const handleUpdateRowChange = (updatedRow: Data) => {
        setUpdated(updatedRows => {
            const existingRow = updatedRows.find(row => row.id_num === updatedRow.id_num);
            if (existingRow) {
                return updatedRows.map(row => row.id_num === updatedRow.id_num ? updatedRow : row);
            } else {
                return [...updatedRows, updatedRow];
            }
        });
    }

    // save 버튼을 누르면 일괄적으로 정보를 저장하는 함수
    const handleSave = async () => {
        try {
            // 서버에 추가할 데이터 전송
            // added배열이 비어있다면, 아무것도 전송하지 않습니다.
            if(added.length > 0) {
                await dispatch(addTableData({apiUrl: API_LINK, data: added}));
            }
            // 서버 응답을 받은 후에 added 상태 초기화
            setAdded([]);

            // 서버에 업데이트할 데이터 전송
            // updated배열이 비어있다면, 아무것도 전송하지 않습니다.
            if(updated.length > 0) {
                await dispatch(updateTableData({apiUrl: API_LINK, data: updated}));
            }
            // 서버 응답을 받은 후에 updated 상태 초기화
            setUpdated([]);
        } catch (error) {
            // 에러 처리
            console.error('Error while saving data:', error);
        }
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
        initialOrderBy: 'id_num',
        initialOrder: 'asc',
        initialRowsPerPage: 5,
        rowsData: data,
    });

    return (
        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    tableName={tableName}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    onSave={handleSave}
                    onDelete={handleOpenDeleteModal}    // 삭제 버튼 클릭 시, 삭제 확인 Modal 열기
                />
                <TableContainer>
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
                                const isItemSelected = isSelected(row.id_num);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                // updated에 포함된 항목들은 EditableRow로 표현
                                if (updated.some(updatedRow => updatedRow.id_num === row.id_num)) {
                                    return (
                                        <EditableRow
                                            key={row.id}
                                            row={row}
                                            labelId={labelId}
                                            onRowChange={handleUpdateRowChange}
                                        />
                                    );
                                } else {
                                    return (
                                        <Row
                                            key={row.id}
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
                                const isItemSelected = isSelected(row.id_num);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <EditableRow
                                        key={row.id}
                                        row={row}
                                        labelId={labelId}
                                        onRowChange={handleAddRowChange}
                                    />
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
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
        </Box>
    );
}