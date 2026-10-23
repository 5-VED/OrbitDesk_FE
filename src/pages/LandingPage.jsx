import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button as MuiButton,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Ticket,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Star,
  ChevronRight,
  Mail,
  MessageSquare,
  Bot,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Ticket,
    title: "Omnichannel Ticketing",
    description:
      "Manage tickets from email, chat, phone, and web in a single unified inbox. Never miss a customer request again.",
    color: "#3B82F6",
  },
  {
    icon: Shield,
    title: "Intelligent SLA Management",
    description:
      "Set granular SLA policies with automatic breach alerts. Track first response and resolution times in real-time.",
    color: "#22C55E",
  },
  {
    icon: Zap,
    title: "Automated Triggers & Macros",
    description:
      "Automate repetitive tasks with powerful triggers. Use macros for one-click canned responses to common queries.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Gain deep insights with live dashboards, agent performance reports, and SLA compliance metrics at a glance.",
    color: "#8B5CF6",
  },
  {
    icon: Bot,
    title: "AI-Powered Assistance",
    description:
      "Let AI suggest responses, categorize tickets, and predict priority levels to accelerate your resolution times.",
    color: "#EC4899",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Internal notes, @mentions, group assignments, and collision detection keep your team aligned on every ticket.",
    color: "#14B8A6",
  },
];

const steps = [
  {
    number: "01",
    icon: Mail,
    title: "Customer Submits",
    description:
      "Tickets arrive via email, chat widget, or web portal — all funneled into one place.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Trigger Auto-Assigns",
    description:
      "Smart rules route tickets to the right team and set priority based on your conditions.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Agent Resolves",
    description:
      "Agents respond with macros, collaborate with notes, and track SLA deadlines.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Ticket Closed",
    description:
      "Customer is satisfied, satisfaction survey is sent, and metrics are logged automatically.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Support, TechFlow",
    avatar: "SC",
    text: "OrbitDesk cut our average response time by 60%. The SLA tracking alone is worth every penny — we haven't missed a deadline in months.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "VP Customer Success, CloudBase",
    avatar: "MJ",
    text: "We migrated from Zendesk and the team was productive within a day. The automation triggers save us 20+ hours a week.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Support Manager, DataSync",
    avatar: "PP",
    text: "The analytics dashboard gives me a real-time view of team performance. Finally, a tool that's as powerful as it is beautiful.",
    rating: 5,
  },
];

const stats = [
  { value: "10K+", label: "Tickets Resolved Daily" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 2min", label: "Avg. First Response" },
  { value: "4.9/5", label: "Customer Satisfaction" },
];

const logos = [
  "Acme Corp",
  "TechFlow",
  "CloudBase",
  "DataSync",
  "NetVault",
  "PixelForge",
];

export function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* ── Navbar ── */}
      <Box
        component="nav"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backdropFilter: "blur(12px)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(20,24,33,0.85)"
              : "rgba(255,255,255,0.85)",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  boxShadow: 2,
                }}
              >
                O
              </Box>
              <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px">
                OrbitDesk
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {["Features", "How it Works", "Testimonials", "Pricing"].map(
                (item) => (
                  <MuiLink
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    underline="none"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      transition: "color 0.2s",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item}
                  </MuiLink>
                ),
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <MuiButton
                component={RouterLink}
                to="/login"
                variant="text"
                color="inherit"
                sx={{ fontWeight: 600, textTransform: "none" }}
              >
                Sign In
              </MuiButton>
              <MuiButton
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="primary"
                endIcon={<ArrowRight size={16} />}
                sx={{ fontWeight: 600, textTransform: "none", borderRadius: 2 }}
              >
                Start Free Trial
              </MuiButton>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── Hero ── */}
      <Box
        component="section"
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Chip
            icon={<Star size={14} color="#F59E0B" fill="#F59E0B" />}
            label="Trusted by 500+ support teams worldwide"
            variant="outlined"
            size="small"
            sx={{ mb: 3, fontWeight: 500, px: 1 }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
              lineHeight: 1.15,
              letterSpacing: "-1px",
              mb: 2.5,
            }}
          >
            Streamline Your
            <br />
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #F44336 0%, #ff8a80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Customer Support
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              maxWidth: 700,
              mx: "auto",
              mb: 4,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            The modern helpdesk that brings SLA tracking, automated triggers,
            AI-powered assistance, and seamless team collaboration into one
            beautifully designed platform.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <MuiButton
              component={RouterLink}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Start Free Trial
            </MuiButton>
            <MuiButton
              href="#how-it-works"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Book a Demo
            </MuiButton>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            No credit card required · 14-day free trial · Cancel anytime
          </Typography>
        </Container>

        {/* Dashboard Mockup */}
        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "grey.100",
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.75 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#f59e0b",
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#10b981",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mx: "auto", fontFamily: "monospace" }}
              >
                app.orbitdesk.io/dashboard
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={2}>
                {[
                  {
                    label: "Open Tickets",
                    value: "142",
                    color: "#3B82F6",
                    bar: 65,
                  },
                  {
                    label: "SLA Compliance",
                    value: "98.2%",
                    color: "#22C55E",
                    bar: 98,
                  },
                  {
                    label: "Avg. Response",
                    value: "1.8m",
                    color: "#F59E0B",
                    bar: 85,
                  },
                  {
                    label: "CSAT Score",
                    value: "4.9",
                    color: "#8B5CF6",
                    bar: 95,
                  },
                ].map((item) => (
                  <Grid key={item.label} size={{ xs: 6, md: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: item.color, my: 0.5 }}
                      >
                        {item.value}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: 4,
                          bgcolor: "action.hover",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${item.bar}%`,
                            height: "100%",
                            bgcolor: item.color,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* ── Logos ── */}
      <Box
        component="section"
        sx={{
          py: 6,
          borderY: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.01)"
              : "grey.50",
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            letterSpacing="0.05em"
            textTransform="uppercase"
            sx={{ mb: 3, display: "block" }}
          >
            Trusted by industry-leading teams
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              alignItems: "center",
            }}
          >
            {logos.map((name) => (
              <Box
                key={name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  opacity: 0.75,
                }}
              >
                <Globe size={18} />
                <Typography variant="body2" fontWeight={600}>
                  {name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Stats ── */}
      <Box component="section" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="primary.main"
                    gutterBottom
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features ── */}
      <Box
        component="section"
        id="features"
        sx={{
          py: 10,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.01)"
              : "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="Features"
              size="small"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Everything you need to deliver
              <br />
              exceptional support
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              A complete helpdesk toolkit designed for modern support teams —
              from day one.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{ height: "100%", borderRadius: 3, p: 1 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      <feature.icon size={24} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── How It Works ── */}
      <Box component="section" id="how-it-works" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="How It Works"
              size="small"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h3" fontWeight={800} gutterBottom>
              From ticket to resolution
              <br />
              in four simple steps
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {steps.map((step, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="text.secondary"
                    sx={{ opacity: 0.3, mb: 2 }}
                  >
                    {step.number}
                  </Typography>
                  <Box sx={{ color: "primary.main", mb: 1.5 }}>
                    <step.icon size={28} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Box
        component="section"
        id="testimonials"
        sx={{
          py: 10,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.01)"
              : "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="Testimonials"
              size="small"
              color="primary"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Loved by support teams
              <br />
              around the world
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{ height: "100%", borderRadius: 3, p: 1 }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
                      {[...Array(t.rating)].map((_, j) => (
                        <Star
                          key={j}
                          size={16}
                          fill="#F59E0B"
                          color="#F59E0B"
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", mb: 3, lineHeight: 1.6 }}
                    >
                      "{t.text}"
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: "primary.light",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {t.avatar}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box
        component="section"
        id="pricing"
        sx={{
          py: 10,
          textAlign: "center",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(244,67,54,0.2) 0%, rgba(20,24,33,0.95) 100%)"
              : "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
          borderY: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Ready to transform your support?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Join 500+ teams that use OrbitDesk to deliver faster, smarter, and
            more delightful customer support.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <MuiButton
              component={RouterLink}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Get Started Free
            </MuiButton>
            <MuiButton
              href="mailto:sales@orbitdesk.io"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Contact Sales
            </MuiButton>
          </Stack>
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ flexWrap: "wrap", gap: 2 }}
          >
            {["Free 14-day trial", "No credit card", "Cancel anytime"].map(
              (text) => (
                <Box
                  key={text}
                  sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                  <CheckCircle2 size={16} color="#10b981" />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {text}
                  </Typography>
                </Box>
              ),
            )}
          </Stack>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 4,
              mb: 4,
            }}
          >
            <Box sx={{ maxWidth: 300 }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  color: "inherit",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  }}
                >
                  O
                </Box>
                <Typography variant="h6" fontWeight={800}>
                  OrbitDesk
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                The modern helpdesk for teams that care about customer
                experience.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2026 OrbitDesk. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
