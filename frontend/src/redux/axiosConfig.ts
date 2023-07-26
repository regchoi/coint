// axios.js 또는 axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // 서버 주소 - .env 파일에 정의
});

export default instance;
