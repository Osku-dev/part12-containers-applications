import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todos/Todo';

describe('Todo component', () => {
  const mockDelete = vi.fn();
  const mockComplete = vi.fn();

  const baseTodo = { text: 'Write Vitest test', done: false };

  beforeEach(() => {
    mockDelete.mockClear();
    mockComplete.mockClear();
  });

  it('renders todo text and not-done message', () => {
    render(<Todo todo={baseTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);
    expect(screen.getByText('Write Vitest test')).toBeInTheDocument();
    expect(screen.getByText('This todo is not done')).toBeInTheDocument();
  });

  it('calls deleteTodo on Delete button click', () => {
    render(<Todo todo={baseTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDelete).toHaveBeenCalledWith(baseTodo);
  });

  it('calls completeTodo on Set as done button click', () => {
    render(<Todo todo={baseTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);
    fireEvent.click(screen.getByText('Set as done'));
    expect(mockComplete).toHaveBeenCalledWith(baseTodo);
  });

  it('shows correct UI when todo is done', () => {
    const doneTodo = { ...baseTodo, done: true };
    render(<Todo todo={doneTodo} deleteTodo={mockDelete} completeTodo={mockComplete} />);
    expect(screen.getByText('This todo is done')).toBeInTheDocument();
    expect(screen.queryByText('Set as done')).not.toBeInTheDocument();
  });
});
