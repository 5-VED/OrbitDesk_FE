import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed dispatch hook for use throughout the app.
 * Wraps useDispatch for consistency and easier future typing.
 */
export const useAppDispatch = () => useDispatch();

/**
 * Typed selector hook for use throughout the app.
 * Wraps useSelector for consistency.
 */
export const useAppSelector = useSelector;
