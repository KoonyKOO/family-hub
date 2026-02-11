import { renderHook } from '@testing-library/react';
import usePolling from './usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls callback at specified interval', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, 5000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('does not call callback when disabled', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, 5000, false));

    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  test('cleans up interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => usePolling(callback, 5000));

    unmount();
    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  test('uses default 30s interval', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback));

    jest.advanceTimersByTime(29999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
