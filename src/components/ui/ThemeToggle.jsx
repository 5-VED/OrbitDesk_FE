import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme, selectTheme } from '../../store/slices/themeSlice';
import './ThemeToggle.css';

export function ThemeToggle() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);

    const handleToggle = () => dispatch(toggleTheme());

    return (
        <button
            className="theme-toggle"
            onClick={handleToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}

