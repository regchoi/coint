import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button, ButtonGroup, Switch, FormControlLabel } from "@mui/material";

type ViewSwitcherProps = {
    isChecked: boolean;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
    downloadExcel: () => void;
    uploadExcel: () => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
                                                              onViewModeChange,
                                                              onViewListChange,
                                                              isChecked,
                                                              downloadExcel,
                                                              uploadExcel,
                                                          }) => {
    return (
        <div className="ViewContainer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

            {/*Excel icon 추가를 위한 코드*/}
            <link href="https://cdn.materialdesignicons.com/6.4.95/css/materialdesignicons.min.css" rel="stylesheet" />
            <ButtonGroup variant="contained">
                {/*<Button onClick={() => onViewModeChange(ViewMode.Hour)}>Hour</Button>*/}
                {/*<Button onClick={() => onViewModeChange(ViewMode.QuarterDay)}>Quarter of Day</Button>*/}
                {/*<Button onClick={() => onViewModeChange(ViewMode.HalfDay)}>Half of Day</Button>*/}
                <Button
                    onClick={() => onViewModeChange(ViewMode.Day)}
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(40, 49, 66)',
                        borderColor: 'rgb(40, 49, 66) !important',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(40, 49, 66, 0.8)',
                        },
                    }}
                >1일</Button>
                <Button
                    onClick={() => onViewModeChange(ViewMode.Week)}
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(40, 49, 66)',
                        borderColor: 'rgb(40, 49, 66) !important',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(40, 49, 66, 0.8)',
                        },
                    }}
                >1주</Button>
                <Button
                    onClick={() => onViewModeChange(ViewMode.Month)}
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(40, 49, 66)',
                        borderColor: 'rgb(40, 49, 66) !important',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(40, 49, 66, 0.8)',
                        },
                    }}
                >1달</Button>
                <Button
                    onClick={() => onViewModeChange(ViewMode.Year)}
                    variant="contained"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: 'rgb(40, 49, 66)',
                        borderColor: 'rgb(40, 49, 66) !important',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(40, 49, 66, 0.8)',
                        },
                    }}
                >1년</Button>
            </ButtonGroup>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isChecked}
                            onChange={() => onViewListChange(!isChecked)}
                        />
                    }
                    label="업무 세부내용"
                />
                <Button
                    onClick={downloadExcel}
                    variant="contained"
                    startIcon={
                        <i
                            className="mdi mdi-microsoft-excel"
                            style={{
                                fontSize: "15px",
                                color: "green",
                                marginRight: "2px",
                            }}
                        />
                    }
                    endIcon={
                        <i
                            className="mdi mdi-download"
                            style={{
                                fontSize: "15px",
                                color: "indianred",
                                marginRight: "2px",
                            }}
                        />
                    }
                    sx={{
                        color: 'black',
                        marginLeft: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        height: '30px',
                        backgroundColor: 'white',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        padding: '0 12px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    엑셀 다운로드
                </Button>

                <Button
                    onClick={uploadExcel}
                    variant="contained"
                    startIcon={
                        <i
                            className="mdi mdi-microsoft-excel"
                            style={{
                                fontSize: "15px",
                                color: "green",
                                marginRight: "2px",
                            }}
                        />
                    }
                    endIcon={
                        <i
                            className="mdi mdi-upload"
                            style={{
                                fontSize: "15px",
                                color: "green",
                                marginRight: "2px",
                            }}
                        />

                    }
                    sx={{
                        color: 'black',
                        marginLeft: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        height: '30px',
                        backgroundColor: 'white',
                        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                        textTransform: 'none',
                        minWidth: '75px',
                        padding: '0 12px',
                        '&:hover': {
                            textDecoration: 'none',
                            backgroundColor: 'rgb(0, 0, 0, 0.1)',
                        },
                    }}
                >
                    엑셀 업로드
                </Button>
            </div>
        </div>
    );
};
