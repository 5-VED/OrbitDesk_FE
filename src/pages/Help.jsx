import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Search,
  BookOpen,
  MessageCircle,
  Ticket,
  User,
  Shield,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";

const faqCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      {
        q: "How do I create a new ticket?",
        a: 'Click on "Tickets" in the sidebar, then click the "New Ticket" button. Fill in the subject, description, priority, and required fields, then submit.',
      },
      {
        q: "How does the ticket lifecycle work?",
        a: "Tickets go through stages: New → Open → Pending → Solved → Closed. Agents can update status as work progresses.",
      },
      {
        q: "What are the different ticket priorities?",
        a: "Priorities range from Low → Normal → High → Urgent. Higher priority tickets have shorter SLA targets.",
      },
    ],
  },
  {
    title: "Working with Tickets",
    icon: Ticket,
    items: [
      {
        q: "How do I assign a ticket?",
        a: 'Open the ticket detail page and use the "Assign" button. You can assign to yourself or another agent.',
      },
      {
        q: "How do I add comments to a ticket?",
        a: "Scroll to the bottom of the ticket detail page and use the comment box. You can format text and add attachments.",
      },
      {
        q: "Can I merge duplicate tickets?",
        a: 'Yes, admins can merge tickets. Open the ticket, select "Merge" and choose the target ticket to consolidate conversations.',
      },
    ],
  },
  {
    title: "SLA & Performance",
    icon: Shield,
    items: [
      {
        q: "What is an SLA policy?",
        a: "SLA (Service Level Agreement) policies define response and resolution time targets based on ticket priority and business hours.",
      },
      {
        q: "How are SLA targets calculated?",
        a: "SLA targets are based on the matching policy's metrics for each priority level, considering business hours and holidays.",
      },
      {
        q: "What happens when SLA is breached?",
        a: "When a ticket approaches or breaches SLA, notifications are sent and the ticket is flagged in the dashboard.",
      },
    ],
  },
  {
    title: "Account & Profile",
    icon: User,
    items: [
      {
        q: "How do I update my profile?",
        a: 'Navigate to your Profile page from the sidebar. Click "Edit Profile" to update your name, email, phone, or profile picture.',
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings → Security to update your password and configure security preferences.",
      },
      {
        q: "What are the available user roles?",
        a: "OrbitDesk supports three roles: Admin (full access), Agent (ticket management), and Customer (submit and track tickets).",
      },
    ],
  },
  {
    title: "Notifications",
    icon: MessageCircle,
    items: [
      {
        q: "How do I manage notification preferences?",
        a: "Go to Settings → Notifications to configure email and in-app notification preferences for various events.",
      },
      {
        q: "Why am I not receiving email notifications?",
        a: "Check your notification preferences in Settings and ensure your email address is correct. Also check your spam folder.",
      },
      {
        q: "Can I get notifications in Slack?",
        a: "Slack integration is available in the Integrations section of Settings. Configure the webhook URL to enable Slack notifications.",
      },
    ],
  },
];

export function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState({});

  const handleAccordionChange = (key) => (event, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [key]: isExpanded }));
  };

  const allFaqs = faqCategories.flatMap((cat, ci) =>
    cat.items.map((item, ii) => ({
      ...item,
      catIdx: ci,
      itemIdx: ii,
      category: cat.title,
    })),
  );

  const filtered = searchQuery.trim()
    ? allFaqs.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : null;

  return (
    <PageContainer title="Help Center">
      <Stack spacing={4}>
        {/* Hero search card */}
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(244,67,54,0.15) 0%, rgba(20,24,33,0.95) 100%)"
                : "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
          >
            How can we help you?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search the help center or browse topics below
          </Typography>
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        size={20}
                        color="var(--color-text-secondary, #94a3b8)"
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Paper>

        {/* Search Results */}
        {filtered ? (
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Search Results ({filtered.length})
            </Typography>
            {filtered.length > 0 ? (
              <Stack spacing={2}>
                {filtered.map((item) => (
                  <Card
                    key={`${item.catIdx}-${item.itemIdx}`}
                    variant="outlined"
                  >
                    <CardContent>
                      <Chip
                        label={item.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1, fontWeight: 600 }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        {item.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.a}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Paper
                variant="outlined"
                sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
              >
                <Typography color="text.secondary">
                  No results found. Try different keywords.
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          /* Category Accordions */
          <Stack spacing={3}>
            {faqCategories.map((cat, ci) => (
              <Box key={cat.title}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: "primary.light",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <cat.icon size={20} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {cat.title}
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  {cat.items.map((item, ii) => {
                    const key = `${ci}-${ii}`;
                    const isExpanded = !!expanded[key];
                    return (
                      <Accordion
                        key={key}
                        expanded={isExpanded}
                        onChange={handleAccordionChange(key)}
                        variant="outlined"
                        sx={{
                          borderRadius: "8px !important",
                          "&:before": { display: "none" },
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography fontWeight={600} variant="body1">
                            {item.q}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {item.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
}
