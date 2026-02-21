import { useState, useEffect } from 'react';
import {
    Search,
    Book,
    FileText,
    Folder,
    ChevronRight,
    Plus,
    Clock,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { knowledgeBaseService } from '@/features/knowledgeBase/api/knowledgeBase';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './KnowledgeBase.css';

export function KnowledgeBase() {
    const user = useAppSelector(selectCurrentUser);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Modal States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);

    // Form Data
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '', slug: '', color: '#3b82f6' });
    const [articleForm, setArticleForm] = useState({ title: '', slug: '', category: '', content: '', status: 'published' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catsRes, artsRes] = await Promise.all([
                knowledgeBaseService.getCategories(),
                knowledgeBaseService.getArticles({ limit: 100 }) // Fetching sufficient articles for now
            ]);
            setCategories(catsRes.data);
            setArticles(artsRes.data.articles);
        } catch (error) {
            console.error('Failed to fetch KB data', error);
            // Silently fail — empty state UI handles the no-data case
        } finally {
            setLoading(false);
        }
    };

    // --- Category Management ---

    const handleOpenCategoryModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            setCategoryForm({
                name: category.name,
                description: category.description || '',
                slug: category.slug,
                color: category.color || '#3b82f6'
            });
        } else {
            setCategoryForm({ name: '', description: '', slug: '', color: '#3b82f6' });
        }
        setIsCategoryModalOpen(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await knowledgeBaseService.updateCategory(editingCategory._id, categoryForm);
                toast.success("Category updated");
            } else {
                await knowledgeBaseService.createCategory(categoryForm);
                toast.success("Category created");
            }
            fetchData();
            setIsCategoryModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await knowledgeBaseService.deleteCategory(id);
            toast.success("Category deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    // --- Article Management ---

    const handleOpenArticleModal = (article = null) => {
        setEditingArticle(article);
        if (article) {
            setArticleForm({
                title: article.title,
                slug: article.slug,
                category: article.category?._id || '',
                content: article.content,
                status: article.status || 'published'
            });
        } else {
            setArticleForm({
                title: '',
                slug: '',
                category: categories.length > 0 ? categories[0]._id : '',
                content: '',
                status: 'published'
            });
        }
        setIsArticleModalOpen(true);
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArticle) {
                await knowledgeBaseService.updateArticle(editingArticle._id, articleForm);
                toast.success("Article updated");
            } else {
                await knowledgeBaseService.createArticle(articleForm);
                toast.success("Article created");
            }
            fetchData();
            setIsArticleModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save article");
        }
    };

    const handleDeleteArticle = async (id) => {
        if (!confirm("Delete this article?")) return;
        try {
            await knowledgeBaseService.deleteArticle(id);
            toast.success("Article deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete article");
        }
    };

    // Helper: Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? article.category?._id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
    const recentArticles = [...articles].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

    // Debug check: Ensure user is loaded and check role case-insensitively
    const userRole = (user?.role_type || '').toLowerCase();
    const isAdminOrAgent = ['admin', 'agent', 'superadmin'].includes(userRole);

    return (
        <PageContainer
            title="Knowledge Base"
            actions={isAdminOrAgent && (
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleOpenCategoryModal()}>New Category</Button>
                    <Button icon={Plus} onClick={() => handleOpenArticleModal()}>New Article</Button>
                </div>
            )}
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="kb-section-title mb-0">Browse by Category</h2>
                        {selectedCategory && (
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                                Clear Filter
                            </Button>
                        )}
                    </div>

                    <div className="kb-categories">
                        {loading ? (
                            <div className="kb-empty-state">
                                <p className="kb-empty-sub">Loading categories...</p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="kb-empty-state">
                                <div className="kb-empty-icon" aria-hidden="true">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <p className="kb-empty-title">No Categories Yet</p>
                                <p className="kb-empty-sub">Create your first category to start organizing articles.</p>
                            </div>
                        ) : (
                            categories.map((cat) => (
                                <Card
                                    key={cat._id}
                                    className={`category-card ${selectedCategory === cat._id ? 'ring-2 ring-primary' : ''}`}
                                    hover
                                    onClick={() => setSelectedCategory(selectedCategory === cat._id ? null : cat._id)}
                                >
                                    <div className="category-header flex justify-between w-full">
                                        <div className="category-icon" style={{ backgroundColor: (cat.color || '#3b82f6') + '20', color: cat.color || '#3b82f6' }}>
                                            <Folder size={24} />
                                        </div>
                                        {isAdminOrAgent && (
                                            <div className="category-actions" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenCategoryModal(cat)}>
                                                    <Edit size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteCategory(cat._id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="category-info mt-3">
                                        <h3>{cat.name}</h3>
                                        <span>{articles.filter(a => a.category?._id === cat._id).length} articles</span>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                <div className="kb-grid">
                    {/* Articles List (Filtered) */}
                    <Card className="articles-card col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {selectedCategory
                                    ? `Articles in ${categories.find(c => c._id === selectedCategory)?.name}`
                                    : searchQuery ? 'Search Results' : 'Recent Articles'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="articles-list">
                                {filteredArticles.length > 0 ? (
                                    filteredArticles.map((article) => (
                                        <div key={article._id} className="article-item group">
                                            <div className="article-icon">
                                                <FileText size={18} />
                                            </div>
                                            <div className="article-content flex-1">
                                                <div className="flex justify-between">
                                                    <a href="#" className="article-title">{article.title}</a>
                                                    {isAdminOrAgent && (
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                            <button onClick={() => handleOpenArticleModal(article)} className="text-gray-500 hover:text-primary">
                                                                <Edit size={14} />
                                                            </button>
                                                            <button onClick={() => handleDeleteArticle(article._id)} className="text-gray-500 hover:text-red-500">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="article-meta">
                                                    <span className="article-category">{article.category?.name}</span>
                                                    <span className="article-updated">
                                                        <Clock size={12} />
                                                        {new Date(article.updatedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="article-views ml-2">
                                                        <Eye size={12} />
                                                        {article.views}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="kb-empty-state">
                                        <div className="kb-empty-icon" aria-hidden="true">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                                <polyline points="10 9 9 9 8 9" />
                                            </svg>
                                        </div>
                                        <p className="kb-empty-title">
                                            {searchQuery
                                                ? 'No Articles Match Your Search'
                                                : selectedCategory
                                                    ? 'No Articles in This Category'
                                                    : 'No Articles Yet'}
                                        </p>
                                        <p className="kb-empty-sub">
                                            {searchQuery
                                                ? 'Try a different keyword or browse by category.'
                                                : 'Create your first article to share knowledge with your team.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Articles Sidebar */}
                    <Card className="articles-card h-fit">
                        <CardHeader>
                            <CardTitle>Popular Articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="articles-list">
                                {popularArticles.length > 0 ? (
                                    popularArticles.map((article) => (
                                        <div key={article._id} className="article-item">
                                            <div className="article-icon">
                                                <FileText size={18} />
                                            </div>
                                            <div className="article-content">
                                                <span className="article-title block truncate">{article.title}</span>
                                                <div className="article-meta">
                                                    <span className="article-views">
                                                        <Eye size={12} />
                                                        {article.views} views
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="kb-empty-state kb-empty-state--compact">
                                        <div className="kb-empty-icon" aria-hidden="true">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </div>
                                        <p className="kb-empty-title">No Popular Articles</p>
                                        <p className="kb-empty-sub">Articles will appear here once they get views.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Category Modal */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="category-form">{editingCategory ? "Update" : "Create"}</Button>
                    </>
                }
            >
                <form id="category-form" onSubmit={handleCategorySubmit} className="space-y-4">
                    <Input
                        label="Name"
                        value={categoryForm.name}
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Slug"
                        value={categoryForm.slug}
                        onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        required
                        placeholder="e.g. getting-started"
                    />
                    <Input
                        label="Description"
                        value={categoryForm.description}
                        onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                    <div>
                        <label className="text-sm font-medium mb-1 block">Color</label>
                        <div className="flex gap-2">
                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`w-8 h-8 rounded-full ${categoryForm.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setCategoryForm({ ...categoryForm, color: c })}
                                />
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Article Modal */}
            <Modal
                isOpen={isArticleModalOpen}
                onClose={() => setIsArticleModalOpen(false)}
                title={editingArticle ? "Edit Article" : "New Article"}
                size="large"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsArticleModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="article-form">{editingArticle ? "Update" : "Create"}</Button>
                    </>
                }
            >
                <form id="article-form" onSubmit={handleArticleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        value={articleForm.title}
                        onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                        required
                    />
                    <Input
                        label="Slug"
                        value={articleForm.slug}
                        onChange={e => setArticleForm({ ...articleForm, slug: e.target.value })}
                        required
                        placeholder="e.g. how-to-reset-password"
                    />
                    <div>
                        <label className="text-sm font-medium mb-1 block">Category</label>
                        <select
                            className="w-full p-2 border rounded-md bg-transparent"
                            value={articleForm.category}
                            onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Content</label>
                        <textarea
                            className="w-full p-2 border rounded-md h-40 bg-transparent"
                            value={articleForm.content}
                            onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                            required
                            placeholder="Write your article content here..."
                            style={{ resize: 'vertical', minHeight: '150px' }}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Status</label>
                        <select
                            className="w-full p-2 border rounded-md bg-transparent"
                            value={articleForm.status}
                            onChange={e => setArticleForm({ ...articleForm, status: e.target.value })}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </PageContainer>
    );
}
