import { Link } from 'react-router-dom';
import {
    Ticket, Shield, Zap, BarChart3, ArrowRight, CheckCircle2,
    Users, Globe, Clock, Star, ChevronRight, Mail, Phone,
    MessageSquare, Bot, Layers, TrendingUp
} from 'lucide-react';
import './LandingPage.css';

const features = [
    {
        icon: Ticket,
        title: 'Omnichannel Ticketing',
        description: 'Manage tickets from email, chat, phone, and web in a single unified inbox. Never miss a customer request again.',
        color: '#3B82F6'
    },
    {
        icon: Shield,
        title: 'Intelligent SLA Management',
        description: 'Set granular SLA policies with automatic breach alerts. Track first response and resolution times in real-time.',
        color: '#22C55E'
    },
    {
        icon: Zap,
        title: 'Automated Triggers & Macros',
        description: 'Automate repetitive tasks with powerful triggers. Use macros for one-click canned responses to common queries.',
        color: '#F59E0B'
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Gain deep insights with live dashboards, agent performance reports, and SLA compliance metrics at a glance.',
        color: '#8B5CF6'
    },
    {
        icon: Bot,
        title: 'AI-Powered Assistance',
        description: 'Let AI suggest responses, categorize tickets, and predict priority levels to accelerate your resolution times.',
        color: '#EC4899'
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Internal notes, @mentions, group assignments, and collision detection keep your team aligned on every ticket.',
        color: '#14B8A6'
    }
];

const steps = [
    {
        number: '01',
        icon: Mail,
        title: 'Customer Submits',
        description: 'Tickets arrive via email, chat widget, or web portal — all funneled into one place.'
    },
    {
        number: '02',
        icon: Zap,
        title: 'Trigger Auto-Assigns',
        description: 'Smart rules route tickets to the right team and set priority based on your conditions.'
    },
    {
        number: '03',
        icon: MessageSquare,
        title: 'Agent Resolves',
        description: 'Agents respond with macros, collaborate with notes, and track SLA deadlines.'
    },
    {
        number: '04',
        icon: CheckCircle2,
        title: 'Ticket Closed',
        description: 'Customer is satisfied, satisfaction survey is sent, and metrics are logged automatically.'
    }
];

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Head of Support, TechFlow',
        avatar: 'SC',
        text: 'OrbitDesk cut our average response time by 60%. The SLA tracking alone is worth every penny — we haven\'t missed a deadline in months.',
        rating: 5
    },
    {
        name: 'Marcus Johnson',
        role: 'VP Customer Success, CloudBase',
        avatar: 'MJ',
        text: 'We migrated from Zendesk and the team was productive within a day. The automation triggers save us 20+ hours a week.',
        rating: 5
    },
    {
        name: 'Priya Patel',
        role: 'Support Manager, DataSync',
        avatar: 'PP',
        text: 'The analytics dashboard gives me a real-time view of team performance. Finally, a tool that\'s as powerful as it is beautiful.',
        rating: 5
    }
];

const stats = [
    { value: '10K+', label: 'Tickets Resolved Daily' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 2min', label: 'Avg. First Response' },
    { value: '4.9/5', label: 'Customer Satisfaction' }
];

const logos = ['Acme Corp', 'TechFlow', 'CloudBase', 'DataSync', 'NetVault', 'PixelForge'];

export function LandingPage() {
    return (
        <div className="landing-page">
            {/* ── Navbar ── */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <Link to="/" className="landing-logo">
                        <div className="landing-logo-icon">O</div>
                        <span className="landing-logo-text">OrbitDesk</span>
                    </Link>
                    <div className="landing-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#testimonials">Testimonials</a>
                        <a href="#pricing">Pricing</a>
                    </div>
                    <div className="landing-nav-actions">
                        <Link to="/login" className="landing-btn-ghost">Sign In</Link>
                        <Link to="/signup" className="landing-btn-primary">
                            Start Free Trial <ArrowRight size={16} />
                        </Link>
                    </div>
                    <button className="landing-mobile-toggle" aria-label="Menu">
                        <Layers size={22} />
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="landing-hero">
                <div className="landing-hero-bg">
                    <div className="landing-hero-glow landing-hero-glow-1"></div>
                    <div className="landing-hero-glow landing-hero-glow-2"></div>
                    <div className="landing-hero-grid"></div>
                </div>
                <div className="landing-hero-content">
                    <div className="landing-hero-badge">
                        <Star size={14} />
                        <span>Trusted by 500+ support teams worldwide</span>
                    </div>
                    <h1 className="landing-hero-title">
                        Streamline Your<br />
                        <span className="landing-hero-title-accent">Customer Support</span>
                    </h1>
                    <p className="landing-hero-subtitle">
                        The modern helpdesk that brings SLA tracking, automated triggers,
                        AI-powered assistance, and seamless team collaboration into one
                        beautifully designed platform.
                    </p>
                    <div className="landing-hero-actions">
                        <Link to="/signup" className="landing-btn-primary landing-btn-lg">
                            Start Free Trial <ArrowRight size={18} />
                        </Link>
                        <a href="#how-it-works" className="landing-btn-outline landing-btn-lg">
                            Book a Demo
                        </a>
                    </div>
                    <div className="landing-hero-note">No credit card required · 14-day free trial · Cancel anytime</div>
                </div>

                {/* Dashboard Mockup */}
                <div className="landing-hero-mockup">
                    <div className="landing-mockup-window">
                        <div className="landing-mockup-titlebar">
                            <div className="landing-mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="landing-mockup-url">app.orbitdesk.io/dashboard</div>
                        </div>
                        <div className="landing-mockup-body">
                            <div className="landing-mockup-sidebar">
                                <div className="landing-mockup-sidebar-item active"></div>
                                <div className="landing-mockup-sidebar-item"></div>
                                <div className="landing-mockup-sidebar-item"></div>
                                <div className="landing-mockup-sidebar-item"></div>
                                <div className="landing-mockup-sidebar-item"></div>
                            </div>
                            <div className="landing-mockup-main">
                                <div className="landing-mockup-stats">
                                    <div className="landing-mockup-stat-card">
                                        <div className="landing-mockup-stat-label">Open Tickets</div>
                                        <div className="landing-mockup-stat-value" style={{ color: '#3B82F6' }}>142</div>
                                        <div className="landing-mockup-stat-bar">
                                            <div style={{ width: '65%', background: '#3B82F6' }}></div>
                                        </div>
                                    </div>
                                    <div className="landing-mockup-stat-card">
                                        <div className="landing-mockup-stat-label">SLA Compliance</div>
                                        <div className="landing-mockup-stat-value" style={{ color: '#22C55E' }}>98.2%</div>
                                        <div className="landing-mockup-stat-bar">
                                            <div style={{ width: '98%', background: '#22C55E' }}></div>
                                        </div>
                                    </div>
                                    <div className="landing-mockup-stat-card">
                                        <div className="landing-mockup-stat-label">Avg. Response</div>
                                        <div className="landing-mockup-stat-value" style={{ color: '#F59E0B' }}>1.8m</div>
                                        <div className="landing-mockup-stat-bar">
                                            <div style={{ width: '85%', background: '#F59E0B' }}></div>
                                        </div>
                                    </div>
                                    <div className="landing-mockup-stat-card">
                                        <div className="landing-mockup-stat-label">CSAT Score</div>
                                        <div className="landing-mockup-stat-value" style={{ color: '#8B5CF6' }}>4.9</div>
                                        <div className="landing-mockup-stat-bar">
                                            <div style={{ width: '95%', background: '#8B5CF6' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="landing-mockup-chart">
                                    <div className="landing-mockup-chart-title">Ticket Trends — Last 7 Days</div>
                                    <div className="landing-mockup-chart-bars">
                                        <div className="landing-mockup-bar" style={{ height: '60%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '80%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '45%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '90%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '70%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '55%' }}></div>
                                        <div className="landing-mockup-bar" style={{ height: '75%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Logos ── */}
            <section className="landing-logos">
                <p className="landing-logos-label">Trusted by industry-leading teams</p>
                <div className="landing-logos-track">
                    {[...logos, ...logos].map((name, i) => (
                        <div key={i} className="landing-logo-item">
                            <Globe size={20} />
                            <span>{name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="landing-stats">
                <div className="landing-stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="landing-stat-card">
                            <div className="landing-stat-value">{stat.value}</div>
                            <div className="landing-stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-features" id="features">
                <div className="landing-section-header">
                    <span className="landing-section-tag">Features</span>
                    <h2 className="landing-section-title">Everything you need to deliver<br />exceptional support</h2>
                    <p className="landing-section-subtitle">A complete helpdesk toolkit designed for modern support teams — from day one.</p>
                </div>
                <div className="landing-features-grid">
                    {features.map((feature, i) => (
                        <div key={i} className="landing-feature-card">
                            <div className="landing-feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="landing-feature-title">{feature.title}</h3>
                            <p className="landing-feature-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="landing-how" id="how-it-works">
                <div className="landing-section-header">
                    <span className="landing-section-tag">How It Works</span>
                    <h2 className="landing-section-title">From ticket to resolution<br />in four simple steps</h2>
                </div>
                <div className="landing-how-steps">
                    {steps.map((step, i) => (
                        <div key={i} className="landing-step-card">
                            <div className="landing-step-number">{step.number}</div>
                            <div className="landing-step-icon">
                                <step.icon size={28} />
                            </div>
                            <h3 className="landing-step-title">{step.title}</h3>
                            <p className="landing-step-desc">{step.description}</p>
                            {i < steps.length - 1 && (
                                <div className="landing-step-connector">
                                    <ChevronRight size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="landing-testimonials" id="testimonials">
                <div className="landing-section-header">
                    <span className="landing-section-tag">Testimonials</span>
                    <h2 className="landing-section-title">Loved by support teams<br />around the world</h2>
                </div>
                <div className="landing-testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="landing-testimonial-card">
                            <div className="landing-testimonial-stars">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />
                                ))}
                            </div>
                            <p className="landing-testimonial-text">"{t.text}"</p>
                            <div className="landing-testimonial-author">
                                <div className="landing-testimonial-avatar">{t.avatar}</div>
                                <div>
                                    <div className="landing-testimonial-name">{t.name}</div>
                                    <div className="landing-testimonial-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="landing-cta" id="pricing">
                <div className="landing-cta-bg">
                    <div className="landing-cta-glow"></div>
                </div>
                <div className="landing-cta-content">
                    <h2 className="landing-cta-title">Ready to transform your support?</h2>
                    <p className="landing-cta-subtitle">
                        Join 500+ teams that use OrbitDesk to deliver faster, smarter, and more delightful customer support.
                    </p>
                    <div className="landing-cta-actions">
                        <Link to="/signup" className="landing-btn-primary landing-btn-lg">
                            Get Started Free <ArrowRight size={18} />
                        </Link>
                        <a href="mailto:sales@orbitdesk.io" className="landing-btn-outline landing-btn-lg">
                            Contact Sales
                        </a>
                    </div>
                    <div className="landing-cta-checks">
                        <span><CheckCircle2 size={16} /> Free 14-day trial</span>
                        <span><CheckCircle2 size={16} /> No credit card</span>
                        <span><CheckCircle2 size={16} /> Cancel anytime</span>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <Link to="/" className="landing-logo">
                            <div className="landing-logo-icon">O</div>
                            <span className="landing-logo-text">OrbitDesk</span>
                        </Link>
                        <p className="landing-footer-tagline">
                            The modern helpdesk for teams that care about customer experience.
                        </p>
                    </div>
                    <div className="landing-footer-links">
                        <div className="landing-footer-col">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#how-it-works">Integrations</a>
                            <a href="#features">Changelog</a>
                        </div>
                        <div className="landing-footer-col">
                            <h4>Resources</h4>
                            <a href="#features">Documentation</a>
                            <a href="#features">API Reference</a>
                            <a href="#features">Blog</a>
                            <a href="#features">Community</a>
                        </div>
                        <div className="landing-footer-col">
                            <h4>Company</h4>
                            <a href="#features">About</a>
                            <a href="#features">Careers</a>
                            <a href="#features">Contact</a>
                            <a href="#features">Press</a>
                        </div>
                        <div className="landing-footer-col">
                            <h4>Legal</h4>
                            <a href="#features">Privacy Policy</a>
                            <a href="#features">Terms of Service</a>
                            <a href="#features">Security</a>
                            <a href="#features">GDPR</a>
                        </div>
                    </div>
                </div>
                <div className="landing-footer-bottom">
                    <span>© 2026 OrbitDesk. All rights reserved.</span>
                    <div className="landing-footer-socials">
                        <a href="#" aria-label="Twitter"><Globe size={18} /></a>
                        <a href="#" aria-label="GitHub"><Layers size={18} /></a>
                        <a href="#" aria-label="Email"><Mail size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
