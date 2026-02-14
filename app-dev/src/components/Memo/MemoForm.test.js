import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MemoForm from './MemoForm';

describe('MemoForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  test('renders new memo form', () => {
    render(<MemoForm {...defaultProps} />);
    expect(screen.getByText('New Memo')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('renders edit memo form with pre-filled data', () => {
    const memo = { id: '1', content: 'Existing memo', color: '#dbeafe' };
    render(<MemoForm {...defaultProps} memo={memo} />);
    expect(screen.getByText('Edit Memo')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toHaveValue('Existing memo');
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('shows error when content is empty', async () => {
    const user = userEvent.setup();
    render(<MemoForm {...defaultProps} />);

    await user.click(screen.getByText('Create'));
    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<MemoForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Content'), 'New memo text');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'New memo text', color: '#fef3c7' })
    );
  });

  test('calls onCancel when cancel is clicked', async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();
    render(<MemoForm {...defaultProps} onCancel={onCancel} />);

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  test('renders color picker buttons', () => {
    render(<MemoForm {...defaultProps} />);
    expect(screen.getByLabelText('Yellow')).toBeInTheDocument();
    expect(screen.getByLabelText('Pink')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Green')).toBeInTheDocument();
    expect(screen.getByLabelText('Purple')).toBeInTheDocument();
  });

  test('selects color when color button is clicked', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<MemoForm {...defaultProps} onSubmit={onSubmit} />);

    await user.click(screen.getByLabelText('Pink'));
    await user.type(screen.getByLabelText('Content'), 'Pink memo');
    await user.click(screen.getByText('Create'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ color: '#fce7f3' })
    );
  });
});
