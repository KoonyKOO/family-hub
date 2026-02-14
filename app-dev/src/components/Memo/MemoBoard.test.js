import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MemoBoard from './MemoBoard';
import memoService from '../../services/memoService';

jest.mock('../../services/memoService');

describe('MemoBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    memoService.getMemos.mockResolvedValue({ memos: [] });
  });

  test('renders heading and add button', () => {
    render(<MemoBoard />);
    expect(screen.getByText('Memo Board')).toBeInTheDocument();
    expect(screen.getByText('Add Memo')).toBeInTheDocument();
  });

  test('shows empty state when no memos', async () => {
    render(<MemoBoard />);
    await waitFor(() => {
      expect(screen.getByText('No memos yet')).toBeInTheDocument();
    });
  });

  test('displays memos from API', async () => {
    memoService.getMemos.mockResolvedValue({
      memos: [
        { id: '1', content: 'Buy milk', pinned: false, color: '#fef3c7', createdBy: { name: 'Mom' }, createdAt: new Date().toISOString() },
        { id: '2', content: 'Call dentist', pinned: true, color: '#dbeafe', createdBy: { name: 'Dad' }, createdAt: new Date().toISOString() },
      ],
    });

    render(<MemoBoard />);
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.getByText('Call dentist')).toBeInTheDocument();
    });
  });

  test('shows form when Add Memo is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoBoard />);

    await user.click(screen.getByText('Add Memo'));
    expect(screen.getByText('New Memo')).toBeInTheDocument();
  });

  test('creates memo and refreshes list', async () => {
    memoService.createMemo.mockResolvedValue({ memo: { id: '1', content: 'Test' } });
    memoService.getMemos
      .mockResolvedValueOnce({ memos: [] })
      .mockResolvedValueOnce({ memos: [{ id: '1', content: 'Test memo', pinned: false, color: '#fef3c7', createdBy: { name: 'User' }, createdAt: new Date().toISOString() }] });

    const user = userEvent.setup();
    render(<MemoBoard />);

    await user.click(screen.getByText('Add Memo'));
    await user.type(screen.getByLabelText('Content'), 'Test memo');
    await user.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(memoService.createMemo).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'Test memo' })
      );
    });
  });

  test('deletes memo and refreshes list', async () => {
    memoService.getMemos.mockResolvedValue({
      memos: [
        { id: '1', content: 'Delete me', pinned: false, color: '#fef3c7', createdBy: { name: 'User' }, createdAt: new Date().toISOString() },
      ],
    });
    memoService.deleteMemo.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<MemoBoard />);

    await waitFor(() => expect(screen.getByText('Delete me')).toBeInTheDocument());

    await user.click(screen.getByText('Delete'));
    expect(memoService.deleteMemo).toHaveBeenCalledWith('1');
  });

  test('toggles pin on memo', async () => {
    memoService.getMemos.mockResolvedValue({
      memos: [
        { id: '1', content: 'Pin me', pinned: false, color: '#fef3c7', createdBy: { name: 'User' }, createdAt: new Date().toISOString() },
      ],
    });
    memoService.updateMemo.mockResolvedValue({ memo: {} });

    const user = userEvent.setup();
    render(<MemoBoard />);

    await waitFor(() => expect(screen.getByText('Pin me')).toBeInTheDocument());

    await user.click(screen.getByText('Pin'));
    expect(memoService.updateMemo).toHaveBeenCalledWith('1', { pinned: true });
  });
});
