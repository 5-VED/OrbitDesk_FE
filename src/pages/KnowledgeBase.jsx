import { useState } from 'react';
import {
    Search,
    Book,
    FileText,
    Folder,
    ChevronRight,
    Plus,
    Clock,
    Eye
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import './KnowledgeBase.css';

// Mock data
const categories = [
    { id: 1, name: 'Getting Started', icon: Book, articles: 12, color: '#3b82f6' },
    { id: 2, name: 'Account & Billing', icon: FileText, articles: 8, color: '#10b981' },
    { id: 3, name: 'Technical Support', icon: Folder, articles: 24, color: '#f59e0b' },
    { id: 4, name: 'API Documentation', icon: FileText, articles: 15, color: '#8b5cf6' },
    { id: 5, name: 'Mobile Apps', icon: Folder, articles: 6, color: '#ec4899' },
    { id: 6, name: 'Integrations', icon: Folder, articles: 18, color: '#06b6d4' },
];

const popularArticles = [
    { id: 1, title: 'How to reset your password', category: 'Getting Started', views: 1520, updated: '2 days ago' },
    { id: 2, title: 'Setting up two-factor authentication', category: 'Account & Billing', views: 892, updated: '1 week ago' },
    { id: 3, title: 'Troubleshooting login issues', category: 'Technical Support', views: 756, updated: '3 days ago' },
    { id: 4, title: 'API authentication guide', category: 'API Documentation', views: 634, updated: '5 days ago' },
    { id: 5, title: 'Connecting Slack integration', category: 'Integrations', views: 512, updated: '1 week ago' },
];

const recentArticles = [
    { id: 1, title: 'New dashboard features overview', category: 'Getting Started', updated: '1 hour ago' },
    { id: 2, title: 'Understanding SLA policies', category: 'Technical Support', updated: '3 hours ago' },
    { id: 3, title: 'Mobile app push notifications setup', category: 'Mobile Apps', updated: '5 hours ago' },
    { id: 4, title: 'Webhook configuration guide', category: 'API Documentation', updated: 'Yesterday' },
];

export function KnowledgeBase() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <PageContainer
            title="Knowledge Base"
            actions={<Button icon={Plus}>New Article</Button>}
        >
            <div className="kb-page">
                {/* Search */}
                <div className="kb-search-section">
                    <div className="kb-search">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <section className="kb-section">
                    <h2 className="kb-section-title">Browse by Category</h2>
                    <div className="kb-categories">
                        {categories.map((cat) => (
                            <Card key={cat.id} className="category-card" hover>
                                <div className="category-icon" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                                    <cat.icon size={24} />
                                </div>
                                <div className="category-info">
                                    <h3>{cat.name}</h3>
                                    <span>{cat.articles} articles</span>
                                </div>
                                <ChevronRight size={20} className="category-arrow" />
                            </Card>
                        ))}
                    </div>
                </section>

                <div className="kb-grid">
                    {/* Popular Articles */}
                    <Card className="articles-card">
                        <CardHeader>
                            <CardTitle>Popular Articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="articles-list">
                                {popularArticles.map((article) => (
                                    <div key={article.id} className="article-item">
                                        <div className="article-icon">
                                            <FileText size={18} />
                                        </div>
                                        <div className="article-content">
                                            <a href="#" className="article-title">{article.title}</a>
                                            <div className="article-meta">
                                                <span className="article-category">{article.category}</span>
                                                <span className="article-views">
                                                    <Eye size={12} />
                                                    {article.views}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Articles */}
                    <Card className="articles-card">
                        <CardHeader>
                            <CardTitle>Recently Updated</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="articles-list">
                                {recentArticles.map((article) => (
                                    <div key={article.id} className="article-item">
                                        <div className="article-icon">
                                            <FileText size={18} />
                                        </div>
                                        <div className="article-content">
                                            <a href="#" className="article-title">{article.title}</a>
                                            <div className="article-meta">
                                                <span className="article-category">{article.category}</span>
                                                <span className="article-updated">
                                                    <Clock size={12} />
                                                    {article.updated}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
