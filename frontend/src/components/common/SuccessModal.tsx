import React from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, title, description }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                width: 400,     // Modal의 너비를 400px로 설정
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        <CheckCircleOutlineIcon color="success" fontSize="large" />
                        {title}
                    </Typography>
                </Box>
                <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                    {description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} variant="contained" color="primary">
                        확인
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SuccessModal;
