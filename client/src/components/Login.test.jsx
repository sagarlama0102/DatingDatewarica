
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

jest.mock('../store/useAuthStore');

const mockLogin = jest.fn();

useAuthStore.mockReturnValue({
  login: mockLogin,
});

describe('Login', () => {
  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Login />
      </Router>
    );
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('calls login function on form submit', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.change(getByLabelText('Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Login'));
    expect(mockLogin).toHaveBeenCalledWith('testuser@example.com', 'password123');
  });
});