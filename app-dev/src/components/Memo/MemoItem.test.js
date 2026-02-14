import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MemoItem from './MemoItem';

describe('MemoItem', () => {
  const mockMemo = {
    id: '1',
    content: 'Remember to water plants',
    pinned: false,
    color: '#fef3c7',
    createdBy: { name: 'Mom' },
    createdAt: new Date().toISOString(),
  };

  const defaultProps = {
    memo: mockMemo,
    onPin: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  test('renders memo content', () => {
    render(<MemoItem {...defaultProps} />);
    expect(screen.getByText('Remember to water plants')).toBeInTheDocument();
  });

  test('renders author name', () => {
    render(<MemoItem {...defaultProps} />);
    expect(screen.getByText(/Mom/)).toBeInTheDocument();
  });

  test('applies background color', () => {
    const { container } = render(<MemoItem {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveStyle({ backgroundColor: '#fef3c7' });
  });

  test('shows pin emoji when pinned', () => {
    const pinnedMemo = { ...mockMemo, pinned: true };
    render(<MemoItem {...defaultProps} memo={pinnedMemo} />);
    expect(screen.getByText('📌')).toBeInTheDocument();
  });

  test('does not show pin emoji when not pinned', () => {
    render(<MemoItem {...defaultProps} />);
    expect(screen.queryByText('📌')).not.toBeInTheDocument();
  });

  test('shows Pin button when not pinned', () => {
    render(<MemoItem {...defaultProps} />);
    expect(screen.getByText('Pin')).toBeInTheDocument();
  });

  test('shows Unpin button when pinned', () => {
    const pinnedMemo = { ...mockMemo, pinned: true };
    render(<MemoItem {...defaultProps} memo={pinnedMemo} />);
    expect(screen.getByText('Unpin')).toBeInTheDocument();
  });

  test('calls onPin when pin button is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoItem {...defaultProps} />);

    await user.click(screen.getByText('Pin'));
    expect(defaultProps.onPin).toHaveBeenCalledWith(mockMemo);
  });

  test('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoItem {...defaultProps} />);

    await user.click(screen.getByText('Edit'));
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockMemo);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoItem {...defaultProps} />);

    await user.click(screen.getByText('Delete'));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });
});
