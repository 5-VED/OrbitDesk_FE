import { useState } from 'react';
import {
    Plus,
    Search,
    Star,
    Mail,
    MoreHorizontal
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import './Agents.css';

// Mock data
const agents = [
    {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@supportdesk.com',
        role: 'Senior Agent',
        department: 'Technical Support',
        status: 'online',
        tickets: { open: 12, resolved: 156, total: 168 },
        rating: 4.8,
        slaCompliance: 96,
    },
    {
        id: 2,
        name: 'Mike Johnson',
        email: 'mike.johnson@supportdesk.com',
        role: 'Agent',
        department: 'Billing',
        status: 'online',
        tickets: { open: 8, resolved: 134, total: 142 },
        rating: 4.6,
        slaCompliance: 92,
    },
    {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.davis@supportdesk.com',
        role: 'Agent',
        department: 'Technical Support',
        status: 'busy',
        tickets: { open: 15, resolved: 98, total: 113 },
        rating: 4.9,
        slaCompliance: 98,
    },
    {
        id: 4,
        name: 'Alex Kim',
        email: 'alex.kim@supportdesk.com',
        role: 'Junior Agent',
        department: 'General',
        status: 'away',
        tickets: { open: 5, resolved: 67, total: 72 },
        rating: 4.5,
        slaCompliance: 88,
    },
    {
        id: 5,
        name: 'Lisa Wang',
        email: 'lisa.wang@supportdesk.com',
        role: 'Team Lead',
        department: 'Technical Support',
        status: 'offline',
        tickets: { open: 3, resolved: 245, total: 248 },
        rating: 4.7,
        slaCompliance: 94,
    },
];

const statusColors = {
    online: 'success',
    busy: 'danger',
    away: 'warning',
    offline: 'default',
};

export function Agents() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageContainer
            title="Agents"
            actions={<Button icon={Plus}>Add Agent</Button>}
        >
            <div className="agents-page">
                {/* Search and Filters */}
                <div className="agents-toolbar">
                    <div className="agents-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="agents-filters">
                        <Badge variant="primary" size="lg">All ({agents.length})</Badge>
                        <Badge variant="success" size="lg" dot>Online ({agents.filter(a => a.status === 'online').length})</Badge>
                        <Badge variant="default" size="lg">Offline ({agents.filter(a => a.status === 'offline').length})</Badge>
                    </div>
                </div>

                {/* Agents Grid */}
                <div className="agents-grid">
                    {filteredAgents.map((agent) => (
                        <Card key={agent.id} className="agent-card" hover>
                            <div className="agent-card-header">
                                <Avatar name={agent.name} size="lg" status={agent.status} />
                                <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                            </div>

                            <div className="agent-info">
                                <h3>{agent.name}</h3>
                                <span className="agent-role">{agent.role}</span>
                                <Badge variant={statusColors[agent.status]} size="sm">
                                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="agent-meta">
                                <span className="agent-department">{agent.department}</span>
                                <a href={`mailto:${agent.email}`} className="agent-email">
                                    <Mail size={14} />
                                    {agent.email}
                                </a>
                            </div>

                            <div className="agent-stats">
                                <div className="agent-stat">
                                    <span className="stat-value">{agent.tickets.open}</span>
                                    <span className="stat-label">Open</span>
                                </div>
                                <div className="agent-stat">
                                    <span className="stat-value">{agent.tickets.resolved}</span>
                                    <span className="stat-label">Resolved</span>
                                </div>
                                <div className="agent-stat">
                                    <span className="stat-value">
                                        <Star size={12} className="star-icon" />
                                        {agent.rating}
                                    </span>
                                    <span className="stat-label">Rating</span>
                                </div>
                                <div className="agent-stat">
                                    <span className="stat-value">{agent.slaCompliance}%</span>
                                    <span className="stat-label">SLA</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
