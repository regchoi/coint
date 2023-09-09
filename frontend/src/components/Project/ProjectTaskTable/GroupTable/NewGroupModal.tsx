import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "../../../../redux/axiosConfig";
import SuccessModal from "../../../common/SuccessModal";

type taskGroup = {
    taskGroupName: string;
    description: string;
    projectsIdNum: number;
}

interface RenameModalProps {
    open: boolean;
    handleClose: () => void;
    projectsIdNum: number;
    onGroupAdded: () => void;
}

const textFieldStyles = {
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#409aff',
    },
    '& .MuiInputBase-input': {
        padding: 2,
        fontSize: '13px',
        height: '20px',
        paddingLeft: '10px',
        backgroundColor: '#fff'
    }
}

const NewGroupModal: React.FC<RenameModalProps> = ({ open, handleClose, projectsIdNum, onGroupAdded }) => {
    const [newGroup, setNewGroup] = useState<taskGroup>({
        taskGroupName: '',
        description: '',
        projectsIdNum: projectsIdNum,
    });
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setNewGroup((prev) => ({ ...prev, projectsIdNum: projectsIdNum }));
    }, [projectsIdNum]);

    const handleSave = () => {
        console.log(newGroup);
        // axios를 통해 DB에 저장
        axios.post('/api/task/group', newGroup)
            .then(res => {
                setSuccessMessage("새 그룹이 추가되었습니다.");
                setSuccessModalOpen(true);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const onModalClose = () => {
        setSuccessModalOpen(false);
        handleClose();
        onGroupAdded();
    }

    return (
        <Dialog open={open} onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        minWidth: '400px',
                        minHeight: '200px',
                    },
                }}>
            <DialogTitle>새 그룹 추가</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="그룹 이름"
                    placeholder="그룹 이름"
                    value={newGroup.taskGroupName}
                    onChange={(e) => setNewGroup({...newGroup, taskGroupName: e.target.value})}
                    fullWidth
                    InputProps={{
                        style: { fontSize: '13px', backgroundColor: '#fff' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '13px' },
                    }}
                    sx={textFieldStyles}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="설명"
                    placeholder="설명"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    fullWidth
                    multiline // 여러 줄 입력을 위한 prop 추가
                    rows={4} // 초기에 4줄을 보여주도록 설정
                    InputProps={{
                        style: { fontSize: '13px', backgroundColor: '#fff' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '13px' },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#409aff',
                        },
                        '& .MuiInputBase-input': {
                            padding: 0,
                            fontSize: '13px',
                            paddingLeft: '10px',
                            backgroundColor: '#fff'
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    취소
                </Button>
                <Button onClick={handleSave} color="primary">
                    저장
                </Button>
            </DialogActions>

            {/*성공 확인 Modal*/}
            <SuccessModal
                open={successModalOpen}
                onClose={onModalClose}
                title="요청 성공"
                description={successMessage || ""}
            />
        </Dialog>
    );
};

export default NewGroupModal;
