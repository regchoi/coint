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
} from '@mui/material';

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}

interface UserDetailModalProps {
    open: boolean;
    onClose: () => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onClose }) => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>사용자 상세정보</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Avatar alt="User Image" src="/static/images/avatar/1.jpg" />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6">Username</Typography>
                        <Typography>Name</Typography>
                        <Typography>Position</Typography>
                        <Typography>Department</Typography>
                        <Typography>Email</Typography>
                        <Typography>Phone</Typography>
                        <Typography>Join Date</Typography>
                    </Grid>
                </Grid>
                <Tabs value={tabValue} onChange={handleChange}>
                    <Tab label="Tab 1" />
                    <Tab label="Tab 2" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    Tab 1 content
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    Tab 2 content
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailModal;
