import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from '@react-spring/web';
import { TransitionProps } from '@mui/material/transitions';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {Box, IconButton, Modal, Tooltip, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "../../../../redux/axiosConfig";
import ErrorModal from "../../../common/ErrorModal";
import SuccessModal from "../../../common/SuccessModal";
import NewGroupModal from "./NewGroupModal";

// props
interface GroupTableProps {
    open: boolean;
    onClose: () => void;
}

type projectResponse = {
    idNum: number;
    projectName: string;
}

type taskGroupResponse = {
    idNum: number;
    taskGroupName: string;
    projectsIdNum: number;
}

function MinusSquare(props: SvgIconProps) {
    return (
        <FolderOpenIcon sx={{ width: 14, height: 14 }} {...props} />
    );
}

function PlusSquare(props: SvgIconProps) {
    return (
        <FolderIcon sx={{ width: 14, height: 14 }} {...props}  />
    );
}

function CloseSquare(props: SvgIconProps) {
    return (
        <FolderOpenIcon
            className="close"
            fontSize="inherit"
            sx={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </FolderOpenIcon>
    );
}

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        from: {
            opacity: 0,
            transform: 'translate3d(20px,0,0)',
        },
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

function intersection(a: number[], b: number[]): number[] {
    return a.filter(value => b.includes(value));
}

function SelectAllTransferList() {
    const [checked, setChecked] = useState<number[]>([]);
    const [left, setLeft] = useState([0, 1, 2, 3]);
    const [right, setRight] = useState([4, 5, 6, 7]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(left.filter(value => !leftChecked.includes(value)));
        setChecked(checked.filter(value => !leftChecked.includes(value)));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(right.filter(value => !rightChecked.includes(value)));
        setChecked(checked.filter(value => !rightChecked.includes(value)));
    };

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                <Card>
                    <CardHeader
                        avatar={<Checkbox checked={leftChecked.length === left.length && left.length !== 0} />}
                        title="Choices"
                        subheader={`${leftChecked.length}/${left.length} selected`}
                    />
                    <Divider />
                    <List dense component="div" role="list">
                        {left.map((value) => (
                            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox checked={checked.indexOf(value) !== -1} />
                                </ListItemIcon>
                                <ListItemText id={value} primary={`List item ${value + 1}`} />
                            </ListItem>
                        ))}
                        <ListItem />
                    </List>
                </Card>
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>
                        &gt;
                    </Button>
                    <Button variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <Card>
                    <CardHeader
                        avatar={<Checkbox checked={rightChecked.length === right.length && right.length !== 0} />}
                        title="Chosen"
                        subheader={`${rightChecked.length}/${right.length} selected`}
                    />
                    <Divider />
                    <List dense component="div" role="list">
                        {right.map((value) => (
                            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                                <ListItemIcon>
                                    <Checkbox checked={checked.indexOf(value) !== -1} />
                                </ListItemIcon>
                                <ListItemText id={value} primary={`List item ${value + 1}`} />
                            </ListItem>
                        ))}
                        <ListItem />
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
}

function GroupTable({open, onClose}: GroupTableProps) {
    const [project, setProject] = useState<projectResponse[]>([]);
    const [taskGroups, setTaskGroups] = useState<taskGroupResponse[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
    const [newGroupModalOpen, setNewGroupModalOpen] = useState<boolean>(false);
    const [newProjectId, setNewProjectId] = useState<number>(0);
    const [refreshData, setRefreshData] = useState<boolean>(false);


    // expanded 배열을 관리하는 상태 변수 추가
    const [expanded, setExpanded] = useState<string[]>(['root']);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectResponse = await axios.get(`/api/project`);
                setProject(projectResponse.data);

                // 모든 프로젝트에 대한 TaskGroup 데이터를 한 번에 가져옵니다.
                const allTaskGroups: taskGroupResponse[] = [];
                for (let proj of projectResponse.data) {
                    const taskGroupResponse = await axios.get(`/api/task/group/${proj.idNum}`);
                    allTaskGroups.push(...taskGroupResponse.data);
                }
                setTaskGroups(allTaskGroups);
            } catch (error) {
                setErrorMessage('폴더 조회 실패');
                setErrorModalOpen(true);
                return;
            }
        };
        fetchData();
    },[refreshData]);


    // expanded 배열을 관리하는 함수 추가
    const handleNodeToggle = (
        event: React.ChangeEvent<{}>,
        nodeIds: string[]
    ) => {
        setExpanded(nodeIds); // 펼쳐진 노드 ID 목록 업데이트
    };

    // 새 그룹을 추가하는 함수
    const addNewGroup = (projectId: number) => {
        setNewProjectId(projectId);
        setNewGroupModalOpen(true);
    }

    // 각 프로젝트에 대한 TaskGroup들을 렌더링하는 함수
    const renderTaskGroupsForProject = (projectId: number) => {
        const taskGroupsForProject = taskGroups.filter((taskGroup) => taskGroup.projectsIdNum === projectId);

        return (
            <>
                {taskGroupsForProject.map((taskGroup) => (
                    <TreeItem
                        key={taskGroup.idNum}
                        nodeId={taskGroup.idNum.toString()}
                        label={<Typography style={{fontSize: '14px'}}>{taskGroup.taskGroupName}</Typography>}
                    />
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon style={{ color: 'rgb(23, 210, 23)', fontSize: '16px' }}  />}
                    sx={{
                        color: 'black',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        height: '30px',
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        textTransform: 'none',
                        minWidth: '75px',
                        padding: '0 12px',
                        '&:hover': {
                            textDecoration: 'none',
                            boxShadow: 'none',
                            backgroundColor: 'rgb(0, 0, 0, 0.1)',
                        },
                    }}
                    onClick={() => addNewGroup(projectId)}>
                    새 업무그룹
                </Button>
            </>
        );
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                minWidth: 800,
                minHeight: '50vh',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '10px',
            }}>
                <Typography variant="h6"
                            component={"div"}
                            sx={{
                                borderBottom: '2px solid #f0f0f0',
                                pb: 2,
                                mb: 2,
                                fontSize: '18px',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <span>
                                업무 그룹 관리
                            </span>
                    <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <TreeView
                        aria-label="customized"
                        expanded={expanded}
                        onNodeToggle={handleNodeToggle}
                        defaultCollapseIcon={<MinusSquare />}
                        defaultExpandIcon={<PlusSquare />}
                        defaultEndIcon={<CloseSquare />}
                        sx={{ flexGrow: 1, minWidth: '250px', width: '100%', height: '100%' }}>
                            <StyledTreeItem nodeId="root" label="프로젝트">
                                {project.map((proj) => (
                                    <StyledTreeItem
                                        key={proj.idNum}
                                        nodeId={proj.idNum.toString()}
                                        label={<Typography style={{ fontSize: '14px' }}>{proj.projectName}</Typography>}
                                    >
                                        {renderTaskGroupsForProject(proj.idNum)}
                                    </StyledTreeItem>
                                ))}
                            </StyledTreeItem>
                        </TreeView>
                    </Grid>
                    <Grid item xs={8}>
                        <SelectAllTransferList />
                    </Grid>
                </Grid>

                {/*새 그룹 추가 Modal*/}
                <NewGroupModal
                    open={newGroupModalOpen}
                    handleClose={() => setNewGroupModalOpen(false)}
                    projectsIdNum={newProjectId}
                    onGroupAdded={() => setRefreshData(prev => !prev)}
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
        </Modal>
    );
}

export default GroupTable;
