import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, MessageCircle, Ticket, User, Shield } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import './Help.css';

const faqCategories = [
    {
        title: 'Getting Started',
        icon: BookOpen,
        items: [
            { q: 'How do I create a new ticket?', a: 'Click on "Tickets" in the sidebar, then click the "New Ticket" button. Fill in the subject, description, priority, and required fields, then submit.' },
            { q: 'How does the ticket lifecycle work?', a: 'Tickets go through stages: New → Open → Pending → Solved → Closed. Agents can update status as work progresses.' },
            { q: 'What are the different ticket priorities?', a: 'Priorities range from Low → Normal → High → Urgent. Higher priority tickets have shorter SLA targets.' },
        ]
    },
    {
        title: 'Working with Tickets',
        icon: Ticket,
        items: [
            { q: 'How do I assign a ticket?', a: 'Open the ticket detail page and use the "Assign" button. You can assign to yourself or another agent.' },
            { q: 'How do I add comments to a ticket?', a: 'Scroll to the bottom of the ticket detail page and use the comment box. You can format text and add attachments.' },
            { q: 'Can I merge duplicate tickets?', a: 'Yes, admins can merge tickets. Open the ticket, select "Merge" and choose the target ticket to consolidate conversations.' },
        ]
    },
    {
        title: 'SLA & Performance',
        icon: Shield,
        items: [
            { q: 'What is an SLA policy?', a: 'SLA (Service Level Agreement) policies define response and resolution time targets based on ticket priority and business hours.' },
            { q: 'How are SLA targets calculated?', a: 'SLA targets are based on the matching policy\'s metrics for each priority level, considering business hours and holidays.' },
            { q: 'What happens when SLA is breached?', a: 'When a ticket approaches or breaches SLA, notifications are sent and the ticket is flagged in the dashboard.' },
        ]
    },
    {
        title: 'Account & Profile',
        icon: User,
        items: [
            { q: 'How do I update my profile?', a: 'Navigate to your Profile page from the sidebar. Click "Edit Profile" to update your name, email, phone, or profile picture.' },
            { q: 'How do I change my password?', a: 'Go to Settings → Security to update your password and configure security preferences.' },
            { q: 'What are the available user roles?', a: 'OrbitDesk supports three roles: Admin (full access), Agent (ticket management), and Customer (submit and track tickets).' },
        ]
    },
    {
        title: 'Notifications',
        icon: MessageCircle,
        items: [
            { q: 'How do I manage notification preferences?', a: 'Go to Settings → Notifications to configure email and in-app notification preferences for various events.' },
            { q: 'Why am I not receiving email notifications?', a: 'Check your notification preferences in Settings and ensure your email address is correct. Also check your spam folder.' },
            { q: 'Can I get notifications in Slack?', a: 'Slack integration is available in the Integrations section of Settings. Configure the webhook URL to enable Slack notifications.' },
        ]
    }
];

export function Help() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (catIdx, itemIdx) => {
        const key = `${catIdx}-${itemIdx}`;
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allFaqs = faqCategories.flatMap((cat, ci) =>
        cat.items.map((item, ii) => ({ ...item, catIdx: ci, itemIdx: ii, category: cat.title }))
    );

    const filtered = searchQuery.trim()
        ? allFaqs.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : null;

    return (
        <PageContainer title="Help Center">
            <div className="help-page">
                <div className="help-header">
                    <h1 className="help-title">How can we help you?</h1>
                    <p className="help-subtitle">Search the help center or browse topics below</p>
                    <div className="help-search-wrapper">
                        <Search size={20} className="help-search-icon" />
                        <input
                            type="text"
                            className="help-search-input"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filtered ? (
                    <div className="help-search-results">
                        <h2 className="help-results-title">Search Results ({filtered.length})</h2>
                        {filtered.map((item) => (
                            <Card key={`${item.catIdx}-${item.itemIdx}`} className="help-result-card">
                                <CardContent>
                                    <span className="help-result-category">{item.category}</span>
                                    <h3 className="help-result-q">{item.q}</h3>
                                    <p className="help-result-a">{item.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                        {filtered.length === 0 && (
                            <p className="help-no-results">No results found. Try different keywords.</p>
                        )}
                    </div>
                ) : (
                    <div className="help-categories">
                        {faqCategories.map((cat, ci) => (
                            <div key={cat.title} className="help-category-section">
                                <div className="help-category-header">
                                    <cat.icon size={22} />
                                    <h2>{cat.title}</h2>
                                </div>
                                <div className="help-faq-list">
                                    {cat.items.map((item, ii) => {
                                        const key = `${ci}-${ii}`;
                                        const isOpen = openItems[key];
                                        return (
                                            <div
                                                key={key}
                                                className={`help-faq-item ${isOpen ? 'open' : ''}`}
                                                onClick={() => toggleItem(ci, ii)}
                                            >
                                                <div className="help-faq-question">
                                                    <span>{item.q}</span>
                                                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                                <div className="help-faq-answer">
                                                    <p>{item.a}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}