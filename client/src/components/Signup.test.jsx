
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

jest.mock('../store/useAuthStore');

const mockSignup = jest.fn();

useAuthStore.mockReturnValue({
  signup: mockSignup,
});

describe('Signup', () => {
  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Signup />
      </Router>
    );
    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Sign Up')).toBeInTheDocument();
  });

  it('calls signup function on form submit', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Signup />
      </Router>
    );
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Sign Up'));
    expect(mockSignup).toHaveBeenCalledWith('Test User', 'testuser@example.com', 'password123');
  });
});