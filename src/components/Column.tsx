import { useState } from 'react';
import type { Column } from '../store/kanbanStore';
import { useKanbanStore } from '../store/kanbanStore';
import { CardComponent } from './Card';

interface ColumnProps {
  column: Column;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string, fromColumnId: string) => void;
}

export const ColumnComponent = ({ column, onDragOver, onDrop, onDragStart }: ColumnProps) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const addCard = useKanbanStore((state) => state.addCard);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle);
      setNewCardTitle('');
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setNewCardTitle('');
      setShowInput(false);
    }
  };

  return (
    <div className={`column ${column.id}`}>
      {/* Header */}
      <div className={`column-header ${column.id}`}>
        <span>{column.title}</span>
        <span className="column-count">{column.cards.length}</span>
      </div>

      {/* Cards Container */}
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
        className="column-body"
      >
        {column.cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            columnId={column.id}
            onDragStart={onDragStart}
          />
        ))}

        {/* Add Card Input */}
        {showInput ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onBlur={handleAddCard}
              onKeyDown={handleKeyDown}
              autoFocus
              className="add-card-input"
            />
            <button
              onClick={handleAddCard}
              className="add-btn"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="add-card-btn"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
};
