import { useState } from 'react';
import { useKanbanStore } from '../store/kanbanStore';
import { ColumnComponent } from './Column';

interface DraggedCard {
  cardId: string;
  fromColumnId: string;
}

export const KanbanBoard = () => {
  const columns = useKanbanStore((state) => state.columns);
  const moveCard = useKanbanStore((state) => state.moveCard);
  const [draggedCard, setDraggedCard] = useState<DraggedCard | null>(null);

  const handleDragStart = (cardId: string, fromColumnId: string) => {
    setDraggedCard({ cardId, fromColumnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();

    if (!draggedCard) return;

    const toColumn = columns.find((col) => col.id === toColumnId);
    if (!toColumn) return;

    const dropIndex = toColumn.cards.length;

    moveCard(draggedCard.cardId, draggedCard.fromColumnId, toColumnId, dropIndex);
    setDraggedCard(null);
  };

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h1>Kanban Board</h1>
        <p>Drag cards to move between columns, click cards to edit</p>
      </div>

      <div className="kanban-columns">
        {columns.map((column) => (
          <ColumnComponent
            key={column.id}
            column={column}
            onDragStart={(_, cardId, fromColumnId) =>
              handleDragStart(cardId, fromColumnId)
            }
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};
