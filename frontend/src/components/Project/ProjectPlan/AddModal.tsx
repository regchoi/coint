import { Button, Modal, Box, TextField, Typography, Table, TableBody } from "@mui/material";
import { createData, Data } from "./data";
import { useState } from "react";
import UserTable from "./UserTable";
import DepartmentTable from "./DepartmentTable";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Data) => void;
}

export default function AddModal({ open, onClose, onSave }: ModalProps) {
    const [data, setData] = useState<Data>(createData(1, '', '', '', '', '', '', '', ''));
    const [participants, setParticipants] = useState<string[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({ ...prevData, [event.target.name]: event.target.value }));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                minWidth: 300,
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '10px',
            }}>
                <Typography variant="h6" sx={{ borderBottom: '2px solid #f0f0f0', pb: 2, mb: 2, fontSize: '18px', fontWeight: 'bold' }}>
                    프로젝트 신규등록
                </Typography>

                <TextField
                    label="프로젝트명"
                    name="projectName"
                    variant="filled"
                    value={data.projectName}
                    onChange={handleInputChange}
                    sx={{ mt: 1, width: '50%' }}
                    InputProps={{
                        style: { fontSize: '14px', backgroundColor: 'transparent' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '14px' },
                    }}
                />
                <TextField
                    label="프로젝트 상세설명"
                    name="projectDescription"
                    variant="filled"
                    value={data.projectName}
                    onChange={handleInputChange}
                    sx={{ mt: 1, width: '100%' }}
                    InputProps={{
                        style: { fontSize: '14px', backgroundColor: 'transparent' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '14px' },
                    }}
                />
                <TextField
                    label="Project Start Date"
                    variant="outlined"
                    type="date"
                    name="startDate"
                    value={data.startDate}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 3 }}
                    InputProps={{
                        style: { fontSize: '14px', backgroundColor: 'transparent' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '14px' },
                        shrink: true,
                    }}
                />
                <TextField
                    label="Project End Date"
                    variant="outlined"
                    type="date"
                    name="endDate"
                    value={data.endDate}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 3, mb: 1 }}
                    InputProps={{
                        style: { fontSize: '14px', backgroundColor: 'transparent' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '14px' },
                        shrink: true,
                    }}
                />

                {/*프로젝트 참여자*/}
                <UserTable />

                {/*프로젝트 참여부서*/}
                <DepartmentTable />

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        sx={{
                            marginLeft: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            height: '35px',
                            backgroundColor: 'rgb(40, 49, 66)',
                            boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                            textTransform: 'none',
                            minWidth: '75px',
                            padding: '0 12px',
                            '&:hover': {
                                textDecoration: 'none',
                                backgroundColor: 'rgb(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        저장
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
