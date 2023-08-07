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
            ({columnIndex}, {index}) <br/>
            {text} <br/>
            TODO - 계획 구상
        </MUICard>
    );
};

const Kanban: React.FC = () => {
    const [columns, setColumns] = React.useState<string[][]>([['Task 1'], ['Task 2'], ['Task 3'], ['Task 4'], ['Task 5'], ['Task 6']]);

    const moveCard = (
        fromColumn: number,
        fromIndex: number,
        toColumn: number,
        toIndex: number
    ) => {
        const updatedColumns = [...columns];
        const [movedCard] = updatedColumns[fromColumn].splice(fromIndex, 1);
        updatedColumns[toColumn].splice(toIndex, 0, movedCard);
        setColumns(updatedColumns);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', width: '100%' }}>
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} style={{ width: '200px', margin: '4px' }}>
                        {column.map((text, index) => (
                            <Card key={index} index={index} columnIndex={columnIndex} text={text} moveCard={moveCard} />
                        ))}
                    </div>
                ))}
            </div>
        </DndProvider>
    );
};

export default Kanban;
