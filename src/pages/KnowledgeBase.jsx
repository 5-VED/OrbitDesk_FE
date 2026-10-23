import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Folder,
  Plus,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ButtonBase from "@mui/material/ButtonBase";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { knowledgeBaseService } from "@/features/knowledgeBase/api/knowledgeBase";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export function KnowledgeBase() {
  const user = useAppSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    slug: "",
    color: "#3b82f6",
  });
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    category: "",
    content: "",
    status: "published",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, artsRes] = await Promise.all([
        knowledgeBaseService.getCategories(),
        knowledgeBaseService.getArticles({ limit: 100 }),
      ]);
      setCategories(catsRes.data);
      setArticles(artsRes.data.articles);
    } catch (error) {
      console.error("Failed to fetch KB data", error);
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
        description: category.description || "",
        slug: category.slug,
        color: category.color || "#3b82f6",
      });
    } else {
      setCategoryForm({
        name: "",
        description: "",
        slug: "",
        color: "#3b82f6",
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await knowledgeBaseService.updateCategory(
          editingCategory._id,
          categoryForm,
        );
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
    } catch {
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
        category: article.category?._id || "",
        content: article.content,
        status: article.status || "published",
      });
    } else {
      setArticleForm({
        title: "",
        slug: "",
        category: categories.length > 0 ? categories[0]._id : "",
        content: "",
        status: "published",
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await knowledgeBaseService.updateArticle(
          editingArticle._id,
          articleForm,
        );
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
    } catch {
      toast.error("Failed to delete article");
    }
  };

  // Helper: Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? article.category?._id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const userRole = (user?.role_type || "").toLowerCase();
  const isAdminOrAgent = ["admin", "agent", "superadmin"].includes(userRole);

  return (
    <PageContainer
      title="Knowledge Base"
      actions={
        isAdminOrAgent && (
          <Stack direction="row" spacing={1}>
            <Button variant="outline" onClick={() => handleOpenCategoryModal()}>
              New Category
            </Button>
            <Button icon={Plus} onClick={() => handleOpenArticleModal()}>
              New Article
            </Button>
          </Stack>
        )
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Search */}
        <Box sx={{ maxWidth: 460 }}>
          <OutlinedInput
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            }
          />
        </Box>

        {/* Categories Grid */}
        <Box component="section">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Browse by Category
            </Typography>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Filter
              </Button>
            )}
          </Box>

          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Loading categories...
              </Typography>
            </Box>
          ) : categories.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: 4,
                textAlign: "center",
              }}
            >
              <Folder
                size={32}
                style={{ margin: "0 auto 8px", opacity: 0.5 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                No Categories Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first category to start organizing articles.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat._id;
                const count = articles.filter(
                  (a) => a.category?._id === cat._id,
                ).length;
                return (
                  <Grid key={cat._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                      elevation={0}
                      onClick={() =>
                        setSelectedCategory(isSelected ? null : cat._id)
                      }
                      sx={{
                        p: 2.5,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: isSelected ? "primary.main" : "divider",
                        bgcolor: isSelected
                          ? "action.selected"
                          : "background.paper",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: (cat.color || "#3b82f6") + "20",
                            color: cat.color || "#3b82f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Folder size={22} />
                        </Box>
                        {isAdminOrAgent && (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleOpenCategoryModal(cat)}
                            >
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCategory(cat._id)}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Stack>
                        )}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {cat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {count} article{count !== 1 ? "s" : ""}
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        <Grid container spacing={3} alignItems="start">
          {/* Articles List (Filtered) */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <CardHeader
                title={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedCategory
                      ? `Articles in ${categories.find((c) => c._id === selectedCategory)?.name}`
                      : searchQuery
                        ? "Search Results"
                        : "Recent Articles"}
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                {filteredArticles.length > 0 ? (
                  <Stack spacing={1.5}>
                    {filteredArticles.map((article) => (
                      <Box
                        key={article._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <Box sx={{ color: "primary.main", display: "flex" }}>
                          <FileText size={20} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              mb: 0.25,
                            }}
                          >
                            {article.title}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {article.category?.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                            >
                              <Clock size={12} />
                              {new Date(article.updatedAt).toLocaleDateString()}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                            >
                              <Eye size={12} />
                              {article.views} views
                            </Box>
                          </Stack>
                        </Box>
                        {isAdminOrAgent && (
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenArticleModal(article)}
                            >
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteArticle(article._id)}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Stack>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 0.5 }}
                    >
                      {searchQuery
                        ? "No Articles Match Your Search"
                        : selectedCategory
                          ? "No Articles in This Category"
                          : "No Articles Yet"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery
                        ? "Try a different keyword or browse by category."
                        : "Create your first article to share knowledge with your team."}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Articles Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <CardHeader
                title={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Popular Articles
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                {popularArticles.length > 0 ? (
                  <Stack spacing={1.5}>
                    {popularArticles.map((article) => (
                      <Box
                        key={article._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1,
                          borderRadius: 1,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <FileText size={18} style={{ opacity: 0.6 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {article.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {article.views} views
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Articles will appear here once they get views.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Edit Category" : "New Category"}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="category-form">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <Box
          component="form"
          id="category-form"
          onSubmit={handleCategorySubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Input
            label="Name"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, name: e.target.value })
            }
            required
          />
          <Input
            label="Slug"
            value={categoryForm.slug}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, slug: e.target.value })
            }
            required
            placeholder="e.g. getting-started"
          />
          <Input
            label="Description"
            value={categoryForm.description}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, description: e.target.value })
            }
          />
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block", mb: 1 }}
            >
              Color
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
              ].map((c) => (
                <ButtonBase
                  key={c}
                  type="button"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: c,
                    border: categoryForm.color === c ? "2px solid" : "none",
                    borderColor: "text.primary",
                    boxShadow: categoryForm.color === c ? 2 : 0,
                  }}
                  onClick={() => setCategoryForm({ ...categoryForm, color: c })}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Modal>

      {/* Article Modal */}
      <Modal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        title={editingArticle ? "Edit Article" : "New Article"}
        size="large"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsArticleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="article-form">
              {editingArticle ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <Box
          component="form"
          id="article-form"
          onSubmit={handleArticleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Input
            label="Title"
            value={articleForm.title}
            onChange={(e) =>
              setArticleForm({ ...articleForm, title: e.target.value })
            }
            required
          />
          <Input
            label="Slug"
            value={articleForm.slug}
            onChange={(e) =>
              setArticleForm({ ...articleForm, slug: e.target.value })
            }
            required
            placeholder="e.g. how-to-reset-password"
          />
          <Select
            label="Category"
            value={articleForm.category}
            onChange={(e) =>
              setArticleForm({ ...articleForm, category: e.target.value })
            }
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
            required
          />
          <Textarea
            label="Content"
            value={articleForm.content}
            onChange={(e) =>
              setArticleForm({ ...articleForm, content: e.target.value })
            }
            required
            placeholder="Write your article content here..."
            rows={6}
          />
          <Select
            label="Status"
            value={articleForm.status}
            onChange={(e) =>
              setArticleForm({ ...articleForm, status: e.target.value })
            }
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </Box>
      </Modal>
    </PageContainer>
  );
}
