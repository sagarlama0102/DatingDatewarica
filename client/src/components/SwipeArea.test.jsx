
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SwipeArea from './SwipeArea';
import { useMatchStore } from '../store/useMatchStore';

jest.mock('../store/useMatchStore');

const mockProfiles = [
  { id: 1, name: 'John Doe', age: 30, image: '/john.jpg', location: 'New York', profession: 'Engineer', bio: 'Love hiking and outdoor activities.', interests: ['Hiking', 'Reading'] },
  { id: 2, name: 'Jane Smith', age: 28, image: '/jane.jpg', location: 'San Francisco', profession: 'Designer', bio: 'Passionate about art and design.', interests: ['Art', 'Traveling'] },
];

useMatchStore.mockReturnValue({
  userProfiles: mockProfiles,
  swipeRight: jest.fn(),
  swipeLeft: jest.fn(),
});

describe('SwipeArea', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SwipeArea />);
    expect(getByText('John Doe, 30')).toBeInTheDocument();
    expect(getByText('Jane Smith, 28')).toBeInTheDocument();
  });

  it('handles swipe right', () => {
    const { getByText } = render(<SwipeArea />);
    const rightButton = getByText('John Doe, 30').parentNode.querySelector('.text-green-500');
    fireEvent.click(rightButton);
    expect(useMatchStore().swipeRight).toHaveBeenCalledWith(mockProfiles[0]);
  });

  it('handles swipe left', () => {
    const { getByText } = render(<SwipeArea />);
    const leftButton = getByText('John Doe, 30').parentNode.querySelector('.text-red-500');
    fireEvent.click(leftButton);
    expect(useMatchStore().swipeLeft).toHaveBeenCalledWith(mockProfiles[0]);
  });
});