import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell } from 'lucide-react';
import './AdminNotifications.css';

export function AdminNotifications() {
    const [channels, setChannels] = useState([
        { id: 1, name: 'Email', enabled: true },
        { id: 2, name: 'In-App', enabled: true },
        { id: 3, name: 'Slack', enabled: false }
    ]);

    const toggleChannel = (id) => {
        setChannels(channels.map(ch => ch.id === id ? { ...ch, enabled: !ch.enabled } : ch));
    };

    return (
        <div className="admin-notifications">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Notifications</h1>
                    <p className="admin-page-subtitle">Configure notification channels and delivery rules</p>
                </div>
            </div>

            <div className="admin-notifications-content">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Channels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="channel-list">
                            {channels.map(channel => (
                                <div key={channel.id} className="channel-item">
                                    <div className="channel-info">
                                        <Bell size={18} />
                                        <span>{channel.name}</span>
                                    </div>
                                    <Button 
                                        variant={channel.enabled ? 'primary' : 'secondary'}
                                        onClick={() => toggleChannel(channel.id)}
                                    >
                                        {channel.enabled ? 'Enabled' : 'Disabled'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
