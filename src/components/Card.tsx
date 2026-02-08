import { useState } from 'react';
import type { Card } from '../store/kanbanStore';
import { useKanbanStore } from '../store/kanbanStore';

interface CardProps {
  card: Card;
  columnId: string;
  onDragStart: (e: React.DragEvent, cardId: string, fromColumnId: string) => void;
}

export const CardComponent = ({ card, columnId, onDragStart }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const deleteCard = useKanbanStore((state) => state.deleteCard);
  const updateCardTitle = useKanbanStore((state) => state.updateCardTitle);

  const handleSave = () => {
    if (title.trim()) {
      updateCardTitle(columnId, card.id, title);
      setIsEditing(false);
    } else {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const getCardColumnClass = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'todo';
      case 'inprogress':
        return 'inprogress';
      case 'done':
        return 'done';
      default:
        return '';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id, columnId)}
      className={`card ${getCardColumnClass(columnId)}`}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="card-input"
        />
      ) : (
        <div className="card-content">
          <p
            onClick={() => setIsEditing(true)}
            className="card-title"
          >
            {title}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCard(columnId, card.id);
            }}
            className="card-delete"
            title="Delete card"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
