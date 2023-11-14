import {useState, useMemo} from "react";
import {Data, HeadCell, headCells} from "./data";
import {Order, getComparator, stableSort} from "./sort";

type UseTableProps = {
    initialOrderBy: keyof Data;
    initialOrder: Order;
    initialRowsPerPage: number;
    rowsData?: Data[];
};

const useTable = ({initialOrderBy, initialOrder, initialRowsPerPage, rowsData}: UseTableProps) => {
    const [order, setOrder] = useState<Order>(initialOrder);
    const [orderBy, setOrderBy] = useState<keyof Data>(initialOrderBy);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    const filterDataByHeadCells = (data: Data[], headCells: readonly HeadCell[]): Data[] => {
        return data.map(row => {
            let filteredRow: any = {};
            headCells.forEach(cell => {
                filteredRow[cell.id] = row[cell.id];
            });
            return filteredRow as Data;
        });
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rowsData?.map((n) => n.idNum) || []; // rowsData가 undefined일 때 빈 배열을 사용합니다.
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Check를 제어하는 함수
    // id_num을 기준으로 선택된 것을 selected에 저장
    const handleClick = (event: React.MouseEvent<unknown>, idNum: number) => {
        const selectedIndex = selected.indexOf(idNum);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, idNum);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (idNum: number) => selected.indexOf(idNum) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rowsData?.length || 0)) : 0; // rowsData가 undefined일 때 길이 0을 사용합니다.

    const filteredData = useMemo(() => {
        return rowsData ? filterDataByHeadCells(rowsData, headCells) : [];
    }, [rowsData]);

    const visibleRows = useMemo(
        () =>
            filteredData
                ? stableSort(filteredData, getComparator(order, orderBy)).slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                )
                : [],
        [order, orderBy, page, rowsPerPage, filteredData],
    );



    return {
        order,
        orderBy,
        selected,
        page,
        dense,
        rowsPerPage,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        handleChangePage,
        handleChangeRowsPerPage,
        isSelected,
        emptyRows,
        visibleRows,
    };
};

export default useTable;
