import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Typography,
    Box,
    Grid,
    Avatar,
    Button,
    Paper,
    ListItem,
    ListItemText,
    Divider, IconButton,
} from '@mui/material';
import { Data } from "./data";
import CloseIcon from "@mui/icons-material/Close";

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
    boxStyle?: React.CSSProperties; // 이 줄을 추가합니다.
}

interface UserDetailModalProps {
    open: boolean;
    onClose: () => void;
    userInfo: Data | null;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index , boxStyle }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
        >
            {value === index && (
                <Box p={3} style={boxStyle}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onClose, userInfo }) => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        event.stopPropagation();
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} onClick={(event) => event.stopPropagation()} fullWidth maxWidth="sm">
            <DialogTitle sx={{pb: 1}}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}}>사용자 상세정보</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            {
                userInfo && (
                    <DialogContent sx={{backgroundColor: '#f5f7fa', paddingTop: '24px !important'}}>
                        <Paper variant="outlined" sx={{ padding: 2 }}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <Avatar
                                        alt="User Image"
                                        src="/static/images/avatar/1.jpg"
                                        sx={{ minWidth: '90px', minHeight: '100px', maxWidth: '115px' }}
                                    />
                                </Grid>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <Typography variant="h6" sx={{ fontSize: '0.9em' }}>{userInfo.name}</Typography>
                                    <Typography color="textSecondary" sx={{ fontSize: '0.8em' }}>{userInfo.position}</Typography>
                                    <Divider variant="middle" sx={{ margin: '1rem 0' }} />
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography sx={{ fontSize: '0.8em' }}>이메일</Typography>}
                                            secondary={<Typography sx={{ fontSize: '0.8em' }}>{userInfo.email}</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography sx={{ fontSize: '0.8em' }}>전화번호</Typography>}
                                            secondary={<Typography sx={{ fontSize: '0.8em' }}>{userInfo.phone}</Typography>}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary={<Typography sx={{ fontSize: '0.8em' }}>가입일</Typography>}
                                            secondary={<Typography sx={{ fontSize: '0.8em' }}>{userInfo.regDate && userInfo.regDate.toString().substring(0, 10)}</Typography>}
                                        />
                                    </ListItem>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Tabs value={tabValue} onChange={handleChange} sx={{ marginTop: 2 }}>
                            <Tab label="부서조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="그룹조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="프로젝트조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="업무조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                        </Tabs>
                        <TabPanel
                            value={tabValue}
                            index={0}
                            boxStyle={{ backgroundColor: tabValue === 0 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={1}
                            boxStyle={{ backgroundColor: tabValue === 1 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={2}
                            boxStyle={{ backgroundColor: tabValue === 2 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={3}
                            boxStyle={{ backgroundColor: tabValue === 3 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>

                    </DialogContent>
                )
            }
            <DialogActions sx={{backgroundColor: '#f5f7fa'}}>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailModal;