import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Grid, Menu, MenuItem, MenuProps, PopoverPosition, Divider, LinearProgress, Typography
} from '@mui/material';
import {MoreVert, DeleteOutline} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getIconByFileType } from "./getIconByFileType";
import {alpha, styled} from "@mui/material/styles";
import RenameModal from "./RenameModal";
import axios from "../../../redux/axiosConfig";
import ErrorModal from "../../common/ErrorModal";
import { useDropzone } from 'react-dropzone';
import SuccessModal from "../../common/SuccessModal";
import {saveAs} from "file-saver";
import DriveContext from "./DriveContext";

interface docResponse {
    idNum: number;
    docName: string;
    regUserid: string;
    modDate: string;
}

interface dirResponse {
    idNum: number;
    dirName: string;
    parentDirectoriesIdNum: number;
}

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        border: 'none',
        borderRadius: 3,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.03) 0px 2px 4px -1px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const Drive: React.FC = () => {
    const [documents, setDocuments] = useState<docResponse[]>([]);
    const [directory, setDirectory] = useState<dirResponse[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({ docName: '', idNum: 0 });
    const firstSelectedIndexRef = useRef<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuPosition, setMenuPosition] = useState<PopoverPosition | undefined>(undefined);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const context = useContext(DriveContext);
    if (!context) {
        throw new Error("Cannot find ProjectProvider");
    }
    const { projectIdNum, setProjectIdNum, accessLevel } = context;

    // 파일 리스트 조회
    useEffect(() => {
        getFiles();
        getDirs();
    }, [projectIdNum]);

    // 파일 리스트 조회
    const getFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/document/${projectIdNum}`);
            setDocuments(response.data);
            setLoading(false);
        } catch (error) {
            setErrorMessage('파일 리스트 조회 실패');
            setErrorModalOpen(true);
            return;
        }
    }

    // 디렉토리 리스트 조회
    const getDirs = async () => {
        // TODO: parentIdNum 기준으로 검색가능한 endpoint 필요
    }

    // 공용 폰트 스타일
    const fontStyles = {
        font: 'var(--dt-title-small-font,500 .875rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
        letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)',
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    // files 상태가 변경되면 파일 업로드를 수행
    useEffect(() => {
        const uploadFiles = async () => {
            setLoading(true)
            if (files.length > 0) {
                handleFileUpload()
                    .then(() => {
                        setSuccessMessage('파일 업로드 성공');
                        setSuccessModalOpen(true);
                        setIsUploading(false);
                        // 파일 업로드 후 파일 리스트 조회
                        getFiles();
                        setLoading(false);
                        return;
                    })
                    .catch((error) => {
                        setErrorMessage('파일 업로드 실패');
                        setErrorModalOpen(true);
                        setIsUploading(false);
                        return;
                        setLoading(false);
                    });
            }
            setLoading(false);
        };

        uploadFiles();
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    const handleNoneClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const rootProps = getRootProps({
        onClick: handleNoneClick,
    });

    const handleFileUpload = async () => {

        setIsUploading(true);
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('file', files[0]);
            const response = await axios.post(`/api/document/upload/${projectIdNum}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    };


    const handleFileDownload = async (idNumList: number[]) => {
        for (const idNum of idNumList) {
            const response = await axios.get(`/api/document/download/${idNum}`, {
                responseType: 'blob',
            });
            console.log(response);
            if (response.status === 200) {
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'unknown';
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                saveAs(blob, fileName);
            } else {
                setErrorMessage('파일 다운로드 실패');
                setErrorModalOpen(true);
                return;
            }
        }
    };

    const handleFileDelete = async (idNumList: number[]) => {
        for (const idNum of idNumList) {
            const response = await axios.delete(`/api/document/${idNum}`);
            if (response.status === 200) {
                // 파일 삭제
                setDocuments(documents.filter((document) => document.idNum !== idNum));
                setSuccessMessage('파일 삭제 성공');
                setSuccessModalOpen(true);
            } else {
                setErrorMessage('파일 삭제 실패');
                setErrorModalOpen(true);
                return;
            }
        }
    };

    const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault(); // 기본 브라우저 메뉴를 무시
        setAnchorEl(event.currentTarget);
        setMenuPosition({ top: event.clientY, left: event.clientX });
    };

    const handleItemClick = (index: number, event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const idNum = documents[index].idNum;

        // selectedItems이 비어있는 경우 현재 선택된 아이템의 인덱스를 저장
        if (selectedItems.length === 0) {
            firstSelectedIndexRef.current = index;
        }

        if (event.shiftKey) {   // shift key를 누르고 있는 경우
            if (firstSelectedIndexRef.current !== null) {
                const start = Math.min(firstSelectedIndexRef.current, index);
                const end = Math.max(firstSelectedIndexRef.current, index);
                const selected = documents.slice(start, end + 1).map((doc) => doc.idNum);
                setSelectedItems(selected);
            }
        } else if (event.metaKey) { // Ctrl key를 누르고 있는 경우
            setSelectedItems((prevSelectedItems) => {
                if (prevSelectedItems.includes(idNum)) {
                    return prevSelectedItems.filter((item) => item !== idNum);
                } else {
                    return [...prevSelectedItems, idNum];
                }
            });
        } else {    // 일반 클릭의 경우
            setSelectedItems([idNum]);
            firstSelectedIndexRef.current = index;
        }
    };

    const handleNoneItemClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setSelectedItems([]);
        firstSelectedIndexRef.current = null;
    }

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLButtonElement>,
        idNum: number
    ) => {
        setMenuPosition({ top: event.clientY, left: event.clientX });
        setAnchorEl(event.currentTarget);
        setSelectedItems([idNum]);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuPosition(undefined);
        setSelectedItems([]);
        firstSelectedIndexRef.current = null;
    };


    const handleMenuItemClick = (action: string) => {
        handleMenuClose();

        if (!selectedItems) return;

        switch (action) {
            case "delete":
                handleFileDelete(selectedItems);
                break;
            case "rename":
                setSelectedDocument(documents.find((doc) => doc.idNum === selectedItems[0])!);
                setRenameModalOpen(true);
                break;
            case "download":
                handleFileDownload(selectedItems);
                break;
            default:
                break;
        }
    };

    const handleRename = async (idNum: number, newName: string) => {
        await axios.put(`/api/document/${projectIdNum}/${idNum}`, { docName: newName })
            .then((res) => {
                const updatedDocuments = documents.map((doc) => {
                    if (doc.idNum === idNum) {
                        return { ...doc, docName: newName };
                    } else {
                        return doc;
                    }
                });
                setDocuments(updatedDocuments);
            })
            .catch((err) => {
                setErrorMessage(err.response.data.message);
                setErrorModalOpen(true);
            });
    };

    return (
        <Box sx={{ flexGrow: 1, maxWidth: '1200px', backgroundColor: '#fff', borderRadius: '15px', p: 2,  }}>
            {loading && <LinearProgress/>}
            {/*icon 추가를 위한 코드*/}
            <link href="https://cdn.materialdesignicons.com/6.4.95/css/materialdesignicons.min.css" rel="stylesheet" />

                    <List sx={{
                        width: '100%',
                        // focus 시에 outline이 생기는 것을 방지
                        '&:focus': {
                            outline: 'none',
                        }
                    }} {...rootProps}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ? (
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    minHeight: '500px',
                                    border: '2px dashed var(--dt-primary-color,#2196f3)',
                                    borderRadius: '15px',
                                }}>
                                    <Typography variant="h5" sx={{color: 'var(--dt-primary-color,#2196f3)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 'bold'}}>
                                        <CloudUploadIcon fontSize="large" />
                                        <span>파일을 끌어다 놓으세요</span>
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{minHeight: '500px'}}>
                                    {/*세부기능 버튼 추가*/}

                                    <ListItem sx={{
                                        width: '100%',
                                        borderBottom: '1px solid var(--dt-outline-variant,#dadce0)'
                                    }}
                                              onClick={handleNoneItemClick}>
                                        <ListItemText
                                            sx={{width: '49%'}}
                                            primary="파일명"
                                            primaryTypographyProps={{
                                                sx: fontStyles
                                            }}
                                        />
                                        <ListItemText
                                            sx={{width: '24%'}}
                                            primary="등록자"
                                            primaryTypographyProps={{
                                                sx: fontStyles
                                            }}
                                        />
                                        <ListItemText
                                            sx={{width: '28%'}}
                                            primary="최근 수정일"
                                            primaryTypographyProps={{
                                                sx: fontStyles
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                    {documents.map((document, index) => {
                                        const {icon, color} = getIconByFileType(document.docName);
                                        return (
                                            <ListItem
                                                key={document.idNum}
                                                sx={{
                                                    width: '100%',
                                                    borderBottom: selectedItems.includes(document.idNum) ? 'none' : '1px solid var(--dt-outline-variant,#dadce0)',
                                                    height: '48px',
                                                    backgroundColor: selectedItems.includes(document.idNum) ? 'rgb(178, 228, 253)' : 'white', // 선택되면 배경색을 변경
                                                    '&:hover': {
                                                        backgroundColor: selectedItems.includes(document.idNum) ? 'rgb(178, 228, 253)' : 'rgb(240, 240, 240)' // 마우스 호버 시 배경색 변경
                                                    }
                                                }}
                                                onClick={(event) => handleItemClick(index, event)} // 클릭 시 선택 상태를 토글
                                                onContextMenu={(event) => handleRightClick(event)}
                                                onMouseDown={(event) => event.preventDefault()} // 추가한 코드
                                            >
                                                <ListItemAvatar sx={{width: '2%'}}>
                                                    <i
                                                        className={icon}
                                                        style={{
                                                            color: color,
                                                            fontSize: '24px'
                                                        }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText primary={document.docName}
                                                              sx={{width: '40%', overflow: 'auto'}}
                                                              primaryTypographyProps={{
                                                                  sx: fontStyles
                                                              }}
                                                />
                                                <ListItemAvatar sx={{
                                                    width: '24%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                }}>
                                                    <AccountCircleIcon sx={{
                                                        color: 'lightgray',
                                                        marginRight: '8px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '50%'
                                                    }}/>
                                                    <span style={{
                                                        font: 'var(--dt-title-small-font,400 .775rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
                                                        letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)'
                                                    }}>{document.regUserid}</span>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    sx={{width: '24%'}}
                                                    primary={document.modDate.toString().substring(0, 10)}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            font: 'var(--dt-title-small-font,400 .775rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
                                                            letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)'
                                                        }
                                                    }}
                                                />
                                                <ListItemSecondaryAction>
                                                    {
                                                        selectedItems.length > 1 ?
                                                            // 선택된 아이템이 1개 이상인 경우 disabled 처리
                                                            <IconButton edge="end" aria-label="more" disabled>
                                                                <MoreVert/>
                                                            </IconButton>
                                                            :
                                                            <IconButton edge="end" aria-label="more"
                                                                        onClick={(event) => handleMenuOpen(event, document.idNum)}>
                                                                <MoreVert/>
                                                            </IconButton>
                                                    }
                                                    <StyledMenu
                                                        anchorEl={anchorEl}
                                                        anchorReference="anchorPosition" // 메뉴의 위치를 직접 지정
                                                        anchorPosition={menuPosition} // 메뉴의 위치 설정
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        {/* TODO 공유 기능 추가 */}
                                                        <MenuItem onClick={() => handleMenuItemClick("download")}
                                                                  sx={{...fontStyles}}>
                                                            <CloudDownloadIcon sx={{marginRight: '8px'}}/>
                                                            다운로드
                                                        </MenuItem>
                                                        {
                                                            selectedItems.length > 1 ?
                                                                // 선택된 아이템이 1개 이상인 경우 disabled 처리
                                                                <MenuItem onClick={() => handleMenuItemClick("rename")}
                                                                          disabled
                                                                          sx={{...fontStyles}}>
                                                                    <DriveFileRenameOutlineIcon
                                                                        sx={{marginRight: '8px'}}/>
                                                                    이름변경
                                                                </MenuItem>
                                                                :
                                                                <MenuItem onClick={() => handleMenuItemClick("rename")}
                                                                          sx={{...fontStyles}}>
                                                                    <DriveFileRenameOutlineIcon
                                                                        sx={{marginRight: '8px'}}/>
                                                                    이름변경
                                                                </MenuItem>
                                                        }
                                                        <Divider sx={{my: 0.5}}/>
                                                        <MenuItem onClick={() => handleMenuItemClick("move")}
                                                                  sx={{...fontStyles}}>
                                                            <DriveFileRenameOutlineIcon
                                                                sx={{marginRight: '8px'}}/>
                                                            이동
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleMenuItemClick("copy")}
                                                                  sx={{...fontStyles}}>
                                                            <DriveFileRenameOutlineIcon
                                                                sx={{marginRight: '8px'}}/>
                                                            복사
                                                        </MenuItem>
                                                        <Divider sx={{my: 0.5}}/>
                                                        <MenuItem onClick={() => handleMenuItemClick("delete")}
                                                                  sx={{...fontStyles}}>
                                                            <DeleteOutline sx={{marginRight: '8px'}}/>
                                                            삭제
                                                        </MenuItem>
                                                    </StyledMenu>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                    <ListItem
                                        sx={{
                                            width: '100%',
                                            borderBottom: '1px solid var(--dt-outline-variant,#dadce0)',
                                            height: '48px',
                                            backgroundColor: 'white', // 선택되면 배경색을 변경
                                        }}
                                    >
                                    </ListItem>
                                </Box>
                            )
                        }
                    </List>

            {/*이름 변경 Modal*/}
            <RenameModal
                open={renameModalOpen}
                handleClose={() => setRenameModalOpen(false)}
                document={selectedDocument}
                handleRename={handleRename}
            />

            {/*에러 발생 Modal*/}
            <ErrorModal
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="요청 실패"
                description={errorMessage || ""}
            />

            {/*성공 확인 Modal*/}
            <SuccessModal
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="요청 성공"
                description={successMessage || ""}
            />
        </Box>
    );
};

export default Drive;
