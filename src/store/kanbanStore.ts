import { create } from 'zustand';

export interface Card {
  id: string;
  title: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanState {
  columns: Column[];
  addCard: (columnId: string, title: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  updateCardTitle: (columnId: string, cardId: string, newTitle: string) => void;
}

const initialData: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: '1', title: 'Create initial project plan', columnId: 'todo' },
      { id: '2', title: 'Design landing page', columnId: 'todo' },
      { id: '3', title: 'Review codebase structure', columnId: 'todo' },
      { id: '4', title: 'Set up testing framework', columnId: 'todo' },
      { id: '5', title: 'Configure build pipeline', columnId: 'todo' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      { id: '6', title: 'Implement authentication', columnId: 'inprogress' },
      { id: '7', title: 'Set up database schema', columnId: 'inprogress' },
      { id: '8', title: 'Fix navbar bugs', columnId: 'inprogress' },
      { id: '9', title: 'Optimize API responses', columnId: 'inprogress' },
      { id: '10', title: 'Create user dashboard', columnId: 'inprogress' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: '11', title: 'Organize project repository', columnId: 'done' },
      { id: '12', title: 'Write API documentation', columnId: 'done' },
      { id: '13', title: 'Deploy to staging', columnId: 'done' },
      { id: '14', title: 'Setup CI/CD pipeline', columnId: 'done' },
      { id: '15', title: 'Complete code review', columnId: 'done' },
    ],
  },
];

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: initialData,

  addCard: (columnId: string, title: string) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.id === columnId) {
          const newCard: Card = {
            id: Date.now().toString(),
            title,
            columnId,
          };
          return {
            ...column,
            cards: [...column.cards, newCard],
          };
        }
        return column;
      }),
    }));
  },

  deleteCard: (columnId: string, cardId: string) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          };
        }
        return column;
      }),
    }));
  },

  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    set((state) => {
      const newColumns = state.columns.map((col) => ({ ...col, cards: [...col.cards] }));
      
      const fromColumn = newColumns.find((col) => col.id === fromColumnId);
      const toColumn = newColumns.find((col) => col.id === toColumnId);
      
      if (!fromColumn || !toColumn) return state;
      
      const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) return state;
      
      const [card] = fromColumn.cards.splice(cardIndex, 1);
      card.columnId = toColumnId;
      toColumn.cards.splice(toIndex, 0, card);
      
      return { columns: newColumns };
    });
  },

  updateCardTitle: (columnId: string, cardId: string, newTitle: string) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.map((card) => {
              if (card.id === cardId) {
                return { ...card, title: newTitle };
              }
              return card;
            }),
          };
        }
        return column;
      }),
    }));
  },
}));
