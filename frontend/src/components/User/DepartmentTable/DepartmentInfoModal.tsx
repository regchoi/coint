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
    departmentInfo: Data | null;
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

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onClose, departmentInfo }) => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        event.stopPropagation();
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} onClick={(event) => event.stopPropagation()} fullWidth maxWidth="sm">
            <DialogTitle sx={{pb: 1}}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}}>부서 상세정보</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            {
                departmentInfo && (
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