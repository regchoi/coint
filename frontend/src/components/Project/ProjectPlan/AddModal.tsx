import { Button, Modal, Box, TextField, Typography, Table, TableBody } from "@mui/material";
import { createData, Data } from "./data";
import { useState } from "react";
import UserTable from "./UserTable";

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
                    InputLabelProps={{
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
                    sx={{ mt: 3 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                    프로젝트 참여자
                </Typography>
                <UserTable />


                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                    프로젝트 담당부서
                </Typography>
                <Table>
                    <TableBody>
                        {/* Later, add table rows for departments here */}
                    </TableBody>
                </Table>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} color="primary" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(data);
                            onClose();
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
