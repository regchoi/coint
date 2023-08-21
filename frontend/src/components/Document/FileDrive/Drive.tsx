import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Grid, Menu, MenuItem, MenuProps, PopoverPosition, Divider
} from '@mui/material';
import {MoreVert, DeleteOutline} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { getIconByFileType } from "./getIconByFileType";
import {alpha, styled} from "@mui/material/styles";
import RenameModal from "./RenameModal";
import axios from "../../../redux/axiosConfig";
import ErrorModal from "../../common/ErrorModal";
import { useDropzone } from 'react-dropzone';
import SuccessModal from "../../common/SuccessModal";

interface docResponse {
    idNum: number;
    docName: string;
    regUserid: string;
    regDate: string;
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
    const [documents, setDocuments] = useState<docResponse[]>([
        {idNum: 1, docName: 'file1.txt', regUserid: 'user1', regDate: '2022-08-16'},
        {idNum: 2, docName: 'image.jpg', regUserid: 'user2', regDate: '2022-08-15'},
        {idNum: 3, docName: 'document.pdf', regUserid: 'user3', regDate: '2022-08-14'},
        {idNum: 4, docName: 'powerpoint.ppt', regUserid: 'user4', regDate: '2022-08-13'},
        {idNum: 5, docName: 'document.doc', regUserid: 'user5', regDate: '2022-08-12'},
        {idNum: 6, docName: 'data.xlsx', regUserid: 'user6', regDate: '2022-08-11'},
        {idNum: 7, docName: '7.zip', regUserid: 'user7', regDate: '2022-08-10'},
    ]);
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
            if (files.length > 0) {
                handleFileUpload()
                    .then(() => {
                        setSuccessMessage('파일 업로드 성공');
                        setSuccessModalOpen(true);
                        setIsUploading(false);
                        return;
                    })
                    .catch((error) => {
                        setErrorMessage('파일 업로드 실패');
                        setErrorModalOpen(true);
                        setIsUploading(false);
                        return;
                    });
            }
        };

        uploadFiles();
    }, [files]);

    const { getRootProps, getInputProps } = useDropzone({
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
            const response = await axios.post('/api/document/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                console.log(response.data)
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } else {
            return Promise.reject();
        }
    };


    const handleFileDownload = async (fileName: string) => {
        // 파일 다운로드 로직...
    };

    const handleFileDelete = (idNum: number) => {
        // 파일 삭제 로직...
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
                break;
            case "rename":
                setSelectedDocument(documents.find((doc) => doc.idNum === selectedItems[0])!);
                setRenameModalOpen(true);
                break;
            // 다른 액션에 대한 처리를 여기에 추가
            default:
                break;
        }
    };

    const handleRename = (idNum: number, newName: string) => {
        axios.put(`/api/documents/${idNum}`, { docName: newName })
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
            {/*icon 추가를 위한 코드*/}
            <link href="https://cdn.materialdesignicons.com/6.4.95/css/materialdesignicons.min.css" rel="stylesheet" />

            <List sx={{ width: '100%' }} {...rootProps}>
                <input {...getInputProps()} />
                <ListItem sx={{ width: '100%', borderBottom: '1px solid var(--dt-outline-variant,#dadce0)' }} onClick={handleNoneItemClick}>
                    <ListItemText
                        sx={{ width: '49%'}}
                        primary="파일명"
                        primaryTypographyProps={{
                            sx: fontStyles
                        }}
                    />
                    <ListItemText
                        sx={{ width: '24%'}}
                        primary="등록자"
                        primaryTypographyProps={{
                            sx: fontStyles
                        }}
                    />
                    <ListItemText
                        sx={{ width: '28%'}}
                        primary="최근 수정일"
                        primaryTypographyProps={{
                            sx: fontStyles
                        }}
                    />
                    <ListItemSecondaryAction>
                    </ListItemSecondaryAction>
                </ListItem>

                {documents.map((document, index) => {
                    const { icon, color } = getIconByFileType(document.docName);
                    return (
                        <ListItem
                            key={document.idNum}
                            sx={{
                                width: '100%',
                                borderBottom: selectedItems.includes(document.idNum) ?  'none' : '1px solid var(--dt-outline-variant,#dadce0)',
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
                            <ListItemAvatar sx={{ width: '2%' }}>
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
                                <AccountCircleIcon sx={{ color: 'lightgray', marginRight: '8px', backgroundColor: '#fff', borderRadius: '50%' }} />
                                <span style={{
                                    font: 'var(--dt-title-small-font,400 .775rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
                                    letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)'}}>{document.regUserid}</span>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ width: '24%'}}
                                primary={document.regDate}
                                primaryTypographyProps={{
                                    sx: {font: 'var(--dt-title-small-font,400 .775rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
                                        letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)'}
                                }}
                            />
                            <ListItemSecondaryAction>
                                {
                                    selectedItems.length > 1 ?
                                        // 선택된 아이템이 1개 이상인 경우 disabled 처리
                                        <IconButton edge="end" aria-label="more" disabled>
                                            <MoreVert />
                                        </IconButton>
                                        :
                                        <IconButton edge="end" aria-label="more" onClick={(event) => handleMenuOpen(event, document.idNum)}>
                                            <MoreVert />
                                        </IconButton>
                                }
                                <StyledMenu
                                    anchorEl={anchorEl}
                                    anchorReference="anchorPosition" // 메뉴의 위치를 직접 지정
                                    anchorPosition={menuPosition} // 메뉴의 위치 설정
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    {
                                        selectedItems.length > 1 ?
                                            // 선택된 아이템이 1개 이상인 경우 disabled 처리
                                            <MenuItem onClick={() => handleMenuItemClick("rename")} disabled sx={{...fontStyles}}>
                                                <DriveFileRenameOutlineIcon sx={{marginRight: '8px'}} />
                                                이름변경
                                            </MenuItem>
                                            :
                                            <MenuItem onClick={() => handleMenuItemClick("rename")} sx={{...fontStyles}}>
                                                <DriveFileRenameOutlineIcon sx={{marginRight: '8px'}} />
                                                이름변경
                                            </MenuItem>
                                    }
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={() => handleMenuItemClick("delete")} sx={{...fontStyles}}>
                                        <DeleteOutline sx={{marginRight: '8px'}} />
                                        삭제
                                    </MenuItem>
                                </StyledMenu>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
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
