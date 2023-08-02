import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Toolbar from "@mui/material/Toolbar";
import sidebarLogo from "../../assets/coint.png";
import Typography from "@mui/material/Typography";
import {
    AccountCircle,
    BarChart,
    BubbleChart, Construction,
    Factory,
    PieChart,
    SignalCellularAlt,
    Streetview
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";

interface DrawerProps {
    open: boolean;
    drawerWidth: number;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

// List의 배열을 관리하기 위한 interface
interface SidebarItemState {
    title: string;
    icon: JSX.Element;
    items: string[];
    itemLink: string[];
    itemIcons?: JSX.Element[];
    open: boolean;
}

export default function SideDrawer({ open, drawerWidth }: DrawerProps) {
    const theme = useTheme();

    // 현재 useState를 통해 SidebarItem들을 관리
    // Auth 정보에 따라 다른 SidebarItem을 보여주게 변경 가능
    const initialSidebarItems: SidebarItemState[] = [
        {title: "차트샘플", icon: <BarChart />, items: ["StackedBar Chart", "Pie Chart", "Scatter Chart", "Three Chart"], itemLink: ["stackedbarchart", "piechart", "threedimscatterchart", "threemapchart"], itemIcons: [<SignalCellularAlt />, <PieChart/>, <BubbleChart/>, <Streetview/>], open: false},
        {title: "사용자관리", items: ["Menu1", "Menu2", "Menu3", "Menu4",], itemLink: ["menu1", "menu2", "menu3", "menu4"], icon: <AccountCircle/>, open: false},
        {title: "공정관리", items: ["Process1", "Process2"], itemLink: ["process1", "process2"], icon: <Factory/>, open: false},
        {title: "설비관리", items: ["Equipment1", "Equipment2"],itemLink: ["equipment1", "equipment2"], icon: <Construction/>, open: false},
        // 필요한 만큼 추가
    ];

    // handleClick을 통해 각 List의 open 상태관리
    const [sidebarItems, setSidebarItems] = React.useState<SidebarItemState[]>(initialSidebarItems);

    const handleItemClick = (title: string) => {
        setSidebarItems(sidebarItems.map(item =>
            item.title === title ? {...item, open: !item.open} : item
        ));
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <Toolbar>
                    <img src={sidebarLogo} alt="Logo" style={{marginRight: '10px', width: '40px'}}/>
                    <Typography variant="h6" noWrap component="div">
                        Coint Company <br/>
                        MES System
                    </Typography>
                </Toolbar>
            </DrawerHeader>
            {/* SidebarItem을 반복문을 통해 생성 */}
            <List>
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}     // Warning: Each child in a list should have a unique "key" prop. -> 추후 uuid 혹은 데이터베이스 id로 변경
                        title={item.title}
                        icon={item.icon}
                        items={item.items}
                        itemLink={item.itemLink}
                        itemIcons={item.itemIcons}
                        open={item.open}
                        onClick={() => handleItemClick(item.title)}
                    />
                ))}
            </List>
        </Drawer>
    );
}
