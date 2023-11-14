import React, {useState} from 'react';
import {TableRow, TableCell, Checkbox, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import {Data} from "./data";
import { useNavigate } from 'react-router-dom';
import ProjectInfoModal from "./ProjectInfoModal";

type RowProps = {
    row: Data,
    labelId: string,
    isItemSelected: boolean,
    handleClick: (event: React.MouseEvent<unknown>, id_num: number) => void,
};

// 가져온 데이터의 각 행을 자동적으로 구성하는 컴포넌트
// row의 각 key를 기준으로 TableCell을 구성함
// 각 key는 Data의 key type인 keyof Data로 정의함
const Row: React.FC<RowProps> = ({row, labelId, isItemSelected, handleClick}) => {
    const [projectInfoModalOpen, setProjectInfoModalOpen] = useState(false);
    const [selectedProjectIdNum, setSelectedProjectIdNum] = useState<number>(0);

    const navigate = useNavigate();

    const handleProjectDetailClick = (event: React.MouseEvent<unknown>, id_num: number) => {
        event.stopPropagation();  // 이벤트 전파 중단
        setProjectInfoModalOpen(true);
        setSelectedProjectIdNum(id_num);
    }

    return (
        <TableRow
            hover
            onClick={(event) => handleClick(event, row.idNum)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.idNum}
            selected={isItemSelected}
            sx={{cursor: 'pointer'}}
        >
            <TableCell padding="checkbox" sx={{
                width: '30px', height: '30px',
                border: "1px solid rgba(0, 0, 0, 0.12)",
                padding: "0px 10px",
                fontSize: "12px",
                textAlign: "center"
            }}>
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                        'aria-labelledby': labelId,
                    }}
                    sx={{width: '40px', height: '40px'}}
                />
            </TableCell>

            {/* row에 들어있는 Data를 처리하는 부분*/}
            {/* key값을 기준으로 TableCell을 유동적으로 구성함*/}
            {(Object.keys(row) as Array<keyof Data>).map(key => {

                console.log(row);

                // key가 idNum이면 Cell을 구성하고
                if (key === 'idNum') {
                    return <TableCell sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        padding: "0px 10px",
                        fontSize: "12px",
                        width: "50px"
                    }} align="center" key={key}>
                        {
                            row.confirm === false ? (
                                <CloseIcon sx={{ color: 'red' }} />
                            ) : row.confirm === true ? (
                                <CheckIcon sx={{ color: 'green' }} />
                            ) : "승인대기중"
                        }
                    </TableCell>;
                }

                if(key === 'confirm') {
                    return null;
                }

                if (key === 'description') {
                    if(row[key] === null) return (
                        <TableCell sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "0px 10px",
                            fontSize: "12px",
                            width: "250px"
                        }}
                                   align="center" key={key}>
                        </TableCell>
                    );

                    let description = row[key].substring(0, 25);
                    const breakIndex = description.indexOf('\n'); // 첫 번째 줄바꿈 위치 찾기

                    // 줄바꿈이 있을 경우에만 텍스트 잘라내기
                    if (breakIndex !== -1) {
                        description.substring(0, breakIndex);
                    }
                    return (
                        <TableCell sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "0px 10px",
                            fontSize: "12px",
                            width: "250px",
                            overflow: "hidden",
                        }} align="center" key={key}>
                            {description+'...'}
                        </TableCell>
                    );
                }
                if (key === 'startDate' || key === 'endDate' || key === 'regDate') {
                    return <TableCell sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        padding: "0px 10px",
                        fontSize: "12px",
                    }} align="center" key={key}>{row[key] ? (row[key]).toString().substring(0, 10) : ''}</TableCell>;
                }

                const handleRedirect = (idNum: number) => {
                    alert('TODO: Modal창으로 프로젝트 상세 정보 보여주기');
                };

                if (key === 'status') {
                    return <TableCell sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        padding: "0px 10px",
                        fontSize: "12px",
                    }} align="center" key={key}>
                        {
                            row[key] === 'TODO' ? '준비중'
                                : row[key] === 'WORKING' ? '진행중'
                                    : row[key] === 'WAITING' ? '대기중'
                                        : row[key] === 'DONE' ? '완료' : '준비중'
                        }
                    </TableCell>;
                }

                if (key === 'detail') {
                    return (
                        <TableCell sx={{
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            padding: "0px 10px",
                            fontSize: "12px",
                            width: "120px"
                        }} align="center" key={key}>
                            <IconButton onClick={(event) => handleProjectDetailClick(event, row.idNum)}>
                                <SearchIcon/>
                            </IconButton>
                        </TableCell>
                    );
                }
                return <TableCell sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "0px 10px",
                    fontSize: "12px",
                }} align="center" key={key}>{row[key]}</TableCell>;
            })}
            <ProjectInfoModal open={projectInfoModalOpen} onClose={() => setProjectInfoModalOpen(false)} projectIdNum={selectedProjectIdNum} />
        </TableRow>
    );
};

export default Row;