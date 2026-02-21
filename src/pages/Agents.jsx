

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Star,
    Mail,
    MoreHorizontal,
    Edit2,
    Trash2
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { AgentModal } from './AgentModal';
import { userService } from '../features/contacts/api/users';
import { toast } from 'react-hot-toast';
import './Agents.css';

const statusColors = {
    online: 'success',
    busy: 'danger',
    away: 'warning',
    offline: 'default',
};

export function Agents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getAgents();
            if (response.success && response.data?.agents) {
                setAgents(response.data.agents);
                setFilteredAgents(response.data.agents);
            }
        } catch (error) {
            console.error('Failed to fetch agents', error);
            // Silently fail — no agents to show is not an error condition
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = agents.filter(agent => {
            const fullName = `${agent.first_name} ${agent.last_name}`.toLowerCase();
            return fullName.includes(lowerQuery) || agent.email.toLowerCase().includes(lowerQuery);
        });
        setFilteredAgents(filtered);
    }, [searchQuery, agents]);

    const handleEdit = (agent) => {
        setSelectedAgent(agent);
        setIsModalOpen(true);
    };

    const handleDelete = async (agentId) => {
        if (!window.confirm("Are you sure you want to delete this agent?")) return;

        try {
            await userService.delete(agentId);
            toast.success("Agent deleted successfully");
            fetchAgents();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete agent");
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setSelectedAgent(null);
        fetchAgents();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAgent(null);
    };

    return (
        <PageContainer
            title="Agents"
            actions={<Button icon={Plus} onClick={() => { setSelectedAgent(null); setIsModalOpen(true); }}>Add Agent</Button>}
        >
            <AgentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                agent={selectedAgent}
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
                ) : filteredAgents.length === 0 ? (
                    <div className="agents-empty-state">
                        <div className="agents-empty-icon" aria-hidden="true">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <p className="agents-empty-title">No Agents Yet</p>
                        <p className="agents-empty-sub">Add your first agent to start assigning and managing support tickets.</p>
                    </div>
                ) : (
                    <div className="agents-grid">
                        {filteredAgents.map((agent) => (
                            <Card key={agent._id} className="agent-card" hover>
                                <div className="agent-card-header">
                                    <Avatar name={`${agent.first_name} ${agent.last_name}`} src={agent.profile_pic} size="lg" status={agent.status} />
                                    <div className="agent-actions" style={{ display: 'flex', gap: '8px' }}>
                                        <Button variant="ghost" size="sm" icon={Edit2} onClick={() => handleEdit(agent)} />
                                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(agent._id)} className="text-danger" />
                                    </div>
                                </div>

                                <div className="agent-info">
                                    <h3>{agent.first_name} {agent.last_name}</h3>
                                    <span className="agent-role">{agent.role?.role || 'Agent'}</span>
                                    <Badge variant={statusColors[agent.status] || 'default'} size="sm">
                                        {(agent.status || 'offline').charAt(0).toUpperCase() + (agent.status || 'offline').slice(1)}
                                    </Badge>
                                </div>

                                <div className="agent-meta">
                                    <span className="agent-department">{agent.department || 'General'}</span>
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
                                            5.0
                                        </span>
                                        <span className="stat-label">Rating</span>
                                    </div>
                                    <div className="agent-stat">
                                        <span className="stat-value">100%</span>
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
