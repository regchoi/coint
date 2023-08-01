import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../redux/store";
import {fetchChartData} from "../../../redux/chartSlice";
import ErrorModal from "../../common/ErrorModal";
import {Backdrop, Button, CircularProgress, Grid, Menu, MenuItem} from "@mui/material";
import SampleDataThreeDimScatterChart from "./SampleDataThreeDimScatterChart";

const API_URL = '/api/chart';

const ParentComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.chart);
    // 에러 확인 Modal 상태 관리
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    // menu 상태 관리
    const [anchorPosition, setAnchorPosition] = useState<null | number>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    useEffect(() => {
        dispatch(fetchChartData(API_URL));
    }, [dispatch]);

    // 요청 실패 시 에러 처리
    // error가 undefined일 수 있음
    useEffect(() => {
        if (error) {
            setErrorModalOpen(true);
        }
    }, [error]);

    // Error Modal 닫기
    const handleCloseErrorModal = () => {
        setErrorModalOpen(false);
    }

    // Menu click
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    // Menu 내부 항목 click
    const handleClose = (chartType: number | null) => {
        setAnchorEl(null);
        setAnchorPosition(chartType);
    }

    return (
        <div>

            <Button
                id="basic-button"
                aria-controls={menuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
                onClick={handleButtonClick}
            >
                cd_factory
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => handleClose(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleClose(1)}>ChartA</MenuItem>
                <MenuItem onClick={() => handleClose(2)}>ChartB</MenuItem>
                <MenuItem onClick={() => handleClose(3)}>ChartC</MenuItem>
            </Menu>

            <Grid container style={{height: '90vh', width: 'calc(100vw - 300px)'}}>
                {

                    // anchorEl가 1이면 ChartA, 2이면 ChartB, 3이면 ChartC를 렌더링
                    // anchorEl이 1, 2, 3이 아니면 아무것도 렌더링하지 않음
                    // anchorPosition === 1 ? <ChartA data={data} /> :
                        // anchorEl === 2 ? <ChartB data={data} /> :
                        //     anchorEl === 3 ? <ChartC data={data} /> :
                        //       Sample Data를 활용한 StackedBarChart
                                <SampleDataThreeDimScatterChart />
                }
            </Grid>

            {/*
            에러 발생 Modal
            ErrorModal은 Error처리 시 Modal을 띄워줄 수 있는 재사용 가능한 컴포넌트입니다.
             */}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={handleCloseErrorModal}
                title="요청 실패"
                description={error?.message || ""}
            />

            {/*
            로딩 중 Backdrop
            Backdrop은 화면 전체를 덮는 컴포넌트로, 사용자의 상호작용을 차단합니다.
            CircularProgress는 로딩 인디케이터입니다.
             */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default ParentComponent;
