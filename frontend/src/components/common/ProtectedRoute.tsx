import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import jwt from "jsonwebtoken";

const ProtectedRoute: React.FC = () => {

    const token = localStorage.getItem('token');

    // token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY5MDUyNjQ2OCwiZXhwIjoxNjkwNjEyODY4fQ.TAvIs0UO7blK-4CvvN9d9AnwZMAJ5fRnJFDXmlVmlPg
    if(token){
        // 토큰 만료 여부 확인
        // 토큰은 3개의 부분으로 나뉘어져 있음
        // 1. 헤더: 토큰의 유형과 해시 암호화 알고리즘 정보
        // 2. 페이로드: 토큰에 담을 정보
        // 3. 서명: 토큰의 유효성 검증을 위한 암호화된 문자열


        // 만료시간이 현재 시간보다 이전인 경우
        // if (jwt.exp < Date.now() / 1000) {
        //     // 토큰 만료
        //     // TODO Alert를 띄우고 로그인 페이지로 이동
        //     return <Navigate to="/login" replace/>;
        // }
    }
    return <Outlet/>;
};

export default ProtectedRoute;