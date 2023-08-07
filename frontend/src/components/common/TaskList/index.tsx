import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card as MUICard } from '@mui/material';

const ItemType = {
    CARD: 'card',
};

interface CardProps {
    text: string;
    columnIndex: number;
    index: number;
    moveCard: (fromColumn: number, fromIndex: number, toColumn: number, toIndex: number) => void;
}

const Card: React.FC<CardProps> = ({ text, columnIndex, index, moveCard }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drag] = useDrag({
        type: ItemType.CARD,
        item: { columnIndex, index },
    });

    const [, drop] = useDrop({
        accept: ItemType.CARD,
        hover: (draggedItem: { columnIndex: number; index: number }) => {
            if (draggedItem.columnIndex === columnIndex && draggedItem.index === index) return;

            moveCard(draggedItem.columnIndex, draggedItem.index, columnIndex, index);
            draggedItem.index = index;
            draggedItem.columnIndex = columnIndex;
        },
    });

    drag(drop(ref));

    return (
        <MUICard ref={ref} sx={{ padding: '8px', border: '1px solid black', marginBottom: '4px' }}>
            {text}
        </MUICard>
    );
};

const TaskList: React.FC = () => {
    const [columns, setColumns] = React.useState<{title: string, tasks: string[]}[]>([
        { title: "Todo", tasks: ["Task 1", "Task 2"] },
        { title: "Doing", tasks: ["Task 3"] },
        { title: "Checking", tasks: ["Task 4"] },
        { title: "Close", tasks: ["Task 5", "Task 6"] },
    ]);

    const moveCard = (
        fromColumn: number,
        fromIndex: number,
        toColumn: number,
        toIndex: number
    ) => {
        const updatedColumns = [...columns];
        const [movedCard] = updatedColumns[fromColumn].tasks.splice(fromIndex, 1);
        updatedColumns[toColumn].tasks.splice(toIndex, 0, movedCard);
        setColumns(updatedColumns);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', width: '100%', overflowX: 'auto' }}>
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} style={{ width: '200px', margin: '4px', backgroundColor: '#f0f0f0', padding: '4px', borderRadius: '4px' }}>
                        <h2>{column.title}</h2>
                        {column.tasks.map((text, index) => (
                            <Card key={index} index={index} columnIndex={columnIndex} text={text} moveCard={moveCard} />
                        ))}
                    </div>
                ))}
            </div>
        </DndProvider>
    );
};

export default TaskList;
