import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface RenameModalProps {
    open: boolean;
    handleClose: () => void;
    document: {
        docName: string;
        idNum: number;
    };
    handleRename: (idNum: number, newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ open, handleClose, document, handleRename }) => {
    const [newName, setNewName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleSave = () => {
        handleRename(document.idNum, newName);
        setNewName('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        minWidth: '400px',
                        minHeight: '200px',
                    },
                }}>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="파일 이름"
                    placeholder={document.docName}
                    value={newName}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                        style: { fontSize: '14px', backgroundColor: '#fff' }
                    }}
                    InputLabelProps={{
                        style: { fontSize: '14px' },
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
        </Dialog>
    );
};

export default RenameModal;
