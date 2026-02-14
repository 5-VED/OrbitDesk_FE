import { useState, useEffect } from 'react';
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
import { AgentModal } from './AgentModal';
import { userService } from '../features/contacts/api/users';
import './Agents.css';

// Mock data as fallback
const mockAgents = [
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
];

const statusColors = {
    online: 'success',
    busy: 'danger',
    away: 'warning',
    offline: 'default',
};

export function Agents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [agents, setAgents] = useState(mockAgents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const data = await userService.getAgents();
            if (data && Array.isArray(data) && data.length > 0) {
                const mappedAgents = data.map(a => ({
                    id: a._id,
                    name: `${a.first_name} ${a.last_name}`,
                    email: a.email,
                    role: a.role,
                    department: a.department || 'General',
                    status: 'offline', // Default since backend doesn't track this yet
                    tickets: { open: 0, resolved: 0, total: 0 },
                    rating: 5.0, // Default
                    slaCompliance: 100 // Default
                }));
                setAgents(mappedAgents);
            }
        } catch (error) {
            console.error("Failed to fetch agents, using mock data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSuccess = (newAgent) => {
        setIsModalOpen(false);
        fetchAgents(); // Refresh list associated with backend
    };

    return (
        <PageContainer
            title="Agents"
            actions={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Agent</Button>}
        >
            <AgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />

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
                {isLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading agents...</div>
                ) : (
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
                                    <Badge variant={statusColors[agent.status] || 'default'} size="sm">
                                        {(agent.status || 'offline').charAt(0).toUpperCase() + (agent.status || 'offline').slice(1)}
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
                                        <span className="stat-value">{agent.tickets?.open || 0}</span>
                                        <span className="stat-label">Open</span>
                                    </div>
                                    <div className="agent-stat">
                                        <span className="stat-value">{agent.tickets?.resolved || 0}</span>
                                        <span className="stat-label">Resolved</span>
                                    </div>
                                    <div className="agent-stat">
                                        <span className="stat-value">
                                            <Star size={12} className="star-icon" />
                                            {agent.rating || 5.0}
                                        </span>
                                        <span className="stat-label">Rating</span>
                                    </div>
                                    <div className="agent-stat">
                                        <span className="stat-value">{agent.slaCompliance || 100}%</span>
                                        <span className="stat-label">SLA</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
