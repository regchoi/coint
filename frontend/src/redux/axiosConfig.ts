// axios.js 또는 axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // 서버 주소 - .env 파일에 정의
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

// TODO: JWT인증 방식을 위해 토큰 인증을 위한 인터셉터 추가
// instance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default instance;
