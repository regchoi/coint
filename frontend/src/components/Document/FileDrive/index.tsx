import React, {useRef, useState} from 'react';
import {
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Grid
} from '@mui/material';
import {MoreVert} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getIconByFileType } from "./getIconByFileType";

interface docResponse {
    idNum: number;
    docName: string;
    regUserid: string;
    regDate: string;
}

const FileDrive: React.FC = () => {
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
    const lastSelectedIndexRef = useRef<number | null>(null);

    // 공용 폰트 스타일
    const fontStyles = {
        font: 'var(--dt-title-small-font,500 .875rem/1.25rem "Google Sans"),"Google Sans",Roboto,Arial,sans-serif',
        letterSpacing: 'var(--dt-title-small-spacing,0.0178571429em)',
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // 파일 업로드 로직...
    };

    const handleFileDownload = async (fileName: string) => {
        // 파일 다운로드 로직...
    };

    const handleFileDelete = (fileName: string) => {
        // 파일 삭제 로직...
    };

    const handleItemClick = (index: number, event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const idNum = documents[index].idNum;

        if (event.shiftKey) {   // shift key를 누르고 있는 경우
            if (lastSelectedIndexRef.current !== null) {
                const start = Math.min(lastSelectedIndexRef.current, index);
                const end = Math.max(lastSelectedIndexRef.current, index);
                const selected = documents.slice(start, end + 1).map((doc) => doc.idNum);
                setSelectedItems(selected);
            }
        } else if (event.ctrlKey) { // Ctrl key를 누르고 있는 경우
            setSelectedItems((prevSelectedItems) => {
                if (prevSelectedItems.includes(idNum)) {
                    return prevSelectedItems.filter((item) => item !== idNum);
                } else {
                    return [...prevSelectedItems, idNum];
                }
            });
        } else {    // 일반 클릭의 경우
            setSelectedItems([idNum]);
        }

        lastSelectedIndexRef.current = index; // 마지막으로 선택된 아이템의 인덱스를 저장
    };


    return (
        <Box sx={{ flexGrow: 1, maxWidth: '1200px', backgroundColor: '#fff', borderRadius: '15px', p: 2,  }}>
            {/*icon 추가를 위한 코드*/}
            <link href="https://cdn.materialdesignicons.com/6.4.95/css/materialdesignicons.min.css" rel="stylesheet" />

            <List sx={{ width: '100%' }}>

                <ListItem sx={{ width: '100%', borderBottom: '1px solid var(--dt-outline-variant,#dadce0)' }}>
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
                                <IconButton edge="end" aria-label="more" onClick={() => handleFileDelete(document.docName)}>
                                    <MoreVert />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default FileDrive;
