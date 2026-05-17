import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { extractFieldErrors, useFieldErrors } from '@/lib/errors';

describe('extractFieldErrors', () => {
  it('returns empty object for non-axios error', () => {
    expect(extractFieldErrors(new Error('generic'))).toEqual({});
  });

  it('returns empty object for null/undefined', () => {
    expect(extractFieldErrors(null)).toEqual({});
    expect(extractFieldErrors(undefined)).toEqual({});
  });

  it('returns empty object when no response', () => {
    const err = { isAxiosError: true, response: undefined };
    expect(extractFieldErrors(err)).toEqual({});
  });

  it('returns empty object when response has no data', () => {
    const err = { isAxiosError: true, response: { data: undefined } };
    expect(extractFieldErrors(err)).toEqual({});
  });

  it('returns empty object when response data has no errors', () => {
    const err = { isAxiosError: true, response: { data: { message: 'fail' } } };
    expect(extractFieldErrors(err)).toEqual({});
  });

  it('extracts first error message per field', () => {
    const err = {
      isAxiosError: true,
      response: {
        data: {
          errors: {
            name: ['Name is required', 'Name must be unique'],
            email: ['Email is invalid'],
          },
        },
      },
    };
    expect(extractFieldErrors(err)).toEqual({
      name: 'Name is required',
      email: 'Email is invalid',
    });
  });
});

describe('useFieldErrors', () => {
  it('starts with empty field errors', () => {
    const { result } = renderHook(() => useFieldErrors());
    expect(result.current.fieldErrors).toEqual({});
  });

  it('setFromApi extracts field errors from axios error', () => {
    const { result } = renderHook(() => useFieldErrors());
    const err = {
      isAxiosError: true,
      response: { data: { errors: { name: ['Required'] } } },
    };
    act(() => result.current.setFromApi(err));
    expect(result.current.fieldErrors).toEqual({ name: 'Required' });
  });

  it('setFromApi does nothing for non-axios errors', () => {
    const { result } = renderHook(() => useFieldErrors());
    act(() => result.current.setFromApi(new Error('generic')));
    expect(result.current.fieldErrors).toEqual({});
  });

  it('clearFieldError removes single field', () => {
    const { result } = renderHook(() => useFieldErrors());
    act(() =>
      result.current.setFromApi({
        isAxiosError: true,
        response: { data: { errors: { name: ['Required'], email: ['Invalid'] } } },
      }),
    );
    expect(Object.keys(result.current.fieldErrors)).toHaveLength(2);
    act(() => result.current.clearFieldError('name'));
    expect(result.current.fieldErrors).toEqual({ email: 'Invalid' });
  });

  it('clearFieldError does nothing for non-existent field', () => {
    const { result } = renderHook(() => useFieldErrors());
    act(() =>
      result.current.setFromApi({
        isAxiosError: true,
        response: { data: { errors: { name: ['Required'] } } },
      }),
    );
    act(() => result.current.clearFieldError('nonexistent'));
    expect(result.current.fieldErrors).toEqual({ name: 'Required' });
  });

  it('clearAll removes all field errors', () => {
    const { result } = renderHook(() => useFieldErrors());
    act(() =>
      result.current.setFromApi({
        isAxiosError: true,
        response: { data: { errors: { name: ['Required'], email: ['Invalid'] } } },
      }),
    );
    act(() => result.current.clearAll());
    expect(result.current.fieldErrors).toEqual({});
  });
});
