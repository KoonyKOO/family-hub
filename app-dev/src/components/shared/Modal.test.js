import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal', () => {
  test('renders nothing when closed', () => {
    render(<Modal isOpen={false} onClose={jest.fn()} title="Test">Content</Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('renders content when open', () => {
    render(<Modal isOpen={true} onClose={jest.fn()} title="Test">Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('renders dialog role', () => {
    render(<Modal isOpen={true} onClose={jest.fn()} title="Test">Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>);

    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
