import React, {useEffect, useState} from 'react';
import StackedBarChart from '../common/Charts/StackedBarChart';
import {useDispatch, useSelector} from "react-redux";
import {fetchChartData} from "../../redux/chartSlice";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import ErrorModal from "../common/ErrorModal";
import {Backdrop, CircularProgress} from "@mui/material";

// 차트 표현에 사용될 속성값 정의
const API_URL = '/api/chart';
const dataKey = 'gitemno';
const dataKeys = ['stockqty'];
const colors = ['#8884d8'];
const height = 300;
const width = '50%';
const margin = { top: 20, right: 30, left: 20, bottom: 20 };

const ChartA: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.chart);
    // 에러 확인 Modal 상태 관리
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

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

    return (
        <div>
            <h2>Custom Stacked Bar Chart Example</h2>
            <StackedBarChart data={
                data.slice(0, 10)
            } colors={colors} dataKey={dataKey} dataKeys={dataKeys} height={height} width={width} margin={margin} />
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

export default ChartA;
