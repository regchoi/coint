// SidebarItem.tsx
import {Collapse, ListItem, ListItemIcon, ListItemText, List} from '@mui/material';
import {Link} from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import * as React from 'react';

interface SidebarItemProps {
    title: string;
    icon: JSX.Element;
    items: string[];
    itemLink: string[];
    itemIcons?: JSX.Element[];
    open: boolean;
    onClick: () => void;
}

const SidebarItem = ({title, icon, open, items, itemLink, itemIcons, onClick}: SidebarItemProps) => {
    return (
        <React.Fragment>
            <ListItem button onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map((item, idx) => (
                        <ListItem button component={Link} to={`/${itemLink[idx]}`}>
                            <ListItemIcon>
                                {itemIcons ? itemIcons[idx] : <InboxIcon/>}
                            </ListItemIcon>
                            <ListItemText primary={item}/>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
}

export default SidebarItem;
