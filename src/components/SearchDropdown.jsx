import { useState } from 'react';
import { Search as SearchIcon, Loader2, FileText, User, Book } from 'lucide-react';
import { api } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import './SearchDropdown.css';

export function SearchDropdown() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            setOpen(true);
            try {
                const response = await api.get('/search', { params: { q: value } });
                setResults(response.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
            setOpen(false);
        }
    };

    const handleSelect = (item) => {
        setOpen(false);
        setQuery('');
        if (item.type === 'ticket') navigate(`/tickets/${item.id}`);
        if (item.type === 'customer') navigate(`/contacts/${item.id}`);
        if (item.type === 'kb') navigate(`/knowledge-base/${item.id}`);
    };

    const getIcon = (type) => {
        switch(type) {
            case 'ticket': return <FileText size={16} />;
            case 'customer': return <User size={16} />;
            case 'kb': return <Book size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <div className="search-dropdown-container">
            <div className="search-input-wrapper">
                <SearchIcon size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search tickets, customers, articles..." 
                    value={query}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            {open && (
                <div className="search-dropdown-menu">
                    {loading ? (
                        <div className="search-loading"><Loader2 className="spin" size={20} /> Searching...</div>
                    ) : results.length > 0 ? (
                        <ul className="search-results">
                            {results.map((res, i) => (
                                <li key={i} onClick={() => handleSelect(res)} className="search-item">
                                    <span className="search-item-icon">{getIcon(res.type)}</span>
                                    <span className="search-item-title">{res.title}</span>
                                    <span className="search-item-type">{res.type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="search-no-results">No results found for "{query}"</div>
                    )}
                </div>
            )}
        </div>
    );
}
