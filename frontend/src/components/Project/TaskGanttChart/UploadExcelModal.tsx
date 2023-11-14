import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';

interface UploadExcelModalProps {
    open: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => Promise<void>;
}

const UploadExcelModal: React.FC<UploadExcelModalProps> = ({ open, onClose, onUpload }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] as any,
    });

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            await onUpload(files);
            setFiles([]);
        } catch (error) {
            console.error('Failed to upload file:', error);
        } finally {
            setIsUploading(false);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                {/*Excel icon 추가를 위한 코드*/}
                <link href="https://cdn.materialdesignicons.com/6.4.95/css/materialdesignicons.min.css" rel="stylesheet" />

                <Typography variant="h6" component="div">
                    프로젝트 엑셀 업로드
                </Typography>
                <Box
                    {...getRootProps()}
                    sx={{
                        width: '100%',
                        height: 100,
                        border: '2px dashed #cccccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        mt: 2,
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography variant="body2" component="p">
                        파일을 끌어서 놓거나 클릭하여 업로드하세요.
                    </Typography>
                </Box>
                {files.length > 0 && (
                    <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                        <i
                            className="mdi mdi-microsoft-excel"
                            style={{
                                fontSize: "15px",
                                color: "green",
                                marginRight: "2px",
                            }}
                        />
                        {files[0].name}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isUploading}
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
                        mt: 5,
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(40, 49, 66, 0.8)',
                        },
                    }}
                >
                    {isUploading ? <CircularProgress size={24} /> : '업로드'}
                </Button>
            </Box>
        </Modal>
    );
};

export default UploadExcelModal;
