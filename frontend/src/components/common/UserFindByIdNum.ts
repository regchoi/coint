// UserFindByIdNum.ts
import axios from "../../redux/axiosConfig";

axios.get(`/api/user/`)
    .then((response) => {
        const data = response.data;
        return data.name;
    })
    .catch((error) => {
        console.log(error);
    });