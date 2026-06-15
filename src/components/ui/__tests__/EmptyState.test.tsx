import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  const defaultProps = {
    icon: <span data-testid="test-icon" />,
    title: 'No items found',
    description: 'There are no items to display',
  };

  it('should render title and description', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render action button when actionLabel and onAction are provided', () => {
    render(<EmptyState {...defaultProps} actionLabel="Add Item" onAction={jest.fn()} />);
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('should not render action button without actionLabel', () => {
    render(<EmptyState {...defaultProps} onAction={jest.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should not render action button without onAction', () => {
    render(<EmptyState {...defaultProps} actionLabel="Add" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onAction when button is clicked', () => {
    const onAction = jest.fn();
    render(<EmptyState {...defaultProps} actionLabel="Add Item" onAction={onAction} />);

    fireEvent.click(screen.getByText('Add Item'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
