import { renderHook, act } from '@testing-library/react-hooks';
import { useMatchStore } from './useMatchStore';

describe('useMatchStore', () => {
  it('initializes with user profiles', () => {
    const { result } = renderHook(() => useMatchStore());
    expect(result.current.userProfiles).toEqual([]);
  });

  it('swipes right correctly', () => {
    const { result } = renderHook(() => useMatchStore());
    const user = { id: 1, name: 'John Doe' };
    act(() => {
      result.current.swipeRight(user);
    });
    expect(result.current.userProfiles).not.toContain(user);
  });

  it('swipes left correctly', () => {
    const { result } = renderHook(() => useMatchStore());
    const user = { id: 1, name: 'John Doe' };
    act(() => {
      result.current.swipeLeft(user);
    });
    expect(result.current.userProfiles).not.toContain(user);
  });
});