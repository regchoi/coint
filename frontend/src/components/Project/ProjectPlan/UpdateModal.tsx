import { Button, Modal, Box, TextField, Typography, Table, TableBody } from "@mui/material";
import { createData, Data } from "./data";
import { useState } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Data) => void;
}

export default function UpdateModal({ open, onClose, onSave }: ModalProps) {
    const [data, setData] = useState<Data>(createData(1, '', '', '', '', '', '', ''));
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
            }}>
                <Typography variant="h6">
                    Update Data
                </Typography>

                <TextField
                    label="Project Name"
                    variant="outlined"
                    name="projectName"
                    value={data.projectName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Project Description"
                    variant="outlined"
                    name="projectDescription"
                    value={data.description}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Project Start Date"
                    variant="outlined"
                    type="date"
                    name="startDate"
                    value={data.startDate}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Project End Date"
                    variant="outlined"
                    type="date"
                    name="endDate"
                    value={data.endDate}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ mt: 2 }}
                />

                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                    Project Participants
                </Typography>
                <Table>
                    <TableBody>
                        {/* Later, add table rows for participants here */}
                    </TableBody>
                </Table>

                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                    Project Departments
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
