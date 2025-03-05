
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { useMatchStore } from '../store/useMatchStore';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../store/useMatchStore');

const mockMatches = [
  { id: 1, name: 'John Doe', image: '/john.jpg' },
  { id: 2, name: 'Jane Smith', image: '/jane.jpg' },
];

useMatchStore.mockReturnValue({
  matches: mockMatches,
  isLoadingMyMatches: false,
  getMyMatches: jest.fn(),
});

describe('Sidebar', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(getByText('Matches')).toBeInTheDocument();
  });

  it('toggles sidebar visibility', () => {
    const { getByText, container } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    const toggleButton = container.querySelector('.lg\\:hidden');
    fireEvent.click(toggleButton);
    expect(container.querySelector('.translate-x-0')).toBeInTheDocument();
  });

  it('displays matches', () => {
    const { getByText } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Jane Smith')).toBeInTheDocument();
  });
});