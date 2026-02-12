import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Camera, Save, X, Phone } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserProfile, selectCurrentUser, selectAuthLoading } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './Profile.css';

export function Profile() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const authLoading = useAppSelector(selectAuthLoading);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing && user) {
            // Reset form data to current user state when entering edit mode
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const updatePayload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                email: formData.email
            };

            await dispatch(updateUserProfile({ userId: user._id || user.id, data: updatePayload })).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <PageContainer title="Profile">
                <div className="profile-loading">Loading profile...</div>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="My Profile">
            <div className="profile-container">
                <div className="profile-header-card">
                    <div className="profile-cover"></div>
                    <div className="profile-info-wrapper">
                        <div className="profile-avatar-wrapper">
                            <Avatar
                                name={`${user.first_name} ${user.last_name}`}
                                size="xl"
                                className="profile-avatar-lg"
                            />
                            <button className="profile-avatar-edit">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="profile-names">
                            <h2 className="profile-fullname">{user.first_name} {user.last_name}</h2>
                            <p className="profile-role-badge">{user.role}</p>
                        </div>
                        <div className="profile-actions">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={handleEditToggle} disabled={loading}>
                                        <X size={16} className="mr-2" /> Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={loading}>
                                        <Save size={16} className="mr-2" /> Save
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={handleEditToggle}>Edit Profile</Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    <Card className="profile-details-card">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="profile-details-list">
                                <div className="profile-detail-item">
                                    <div className="detail-icon">
                                        <User size={20} />
                                    </div>
                                    <div className="detail-content w-full">
                                        <span className="detail-label">Full Name</span>
                                        {isEditing ? (
                                            <div className="flex gap-2 mt-1">
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    placeholder="First Name"
                                                    className="profile-input"
                                                />
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Last Name"
                                                    className="profile-input"
                                                />
                                            </div>
                                        ) : (
                                            <span className="detail-value">{user.first_name} {user.last_name}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-detail-item">
                                    <div className="detail-icon">
                                        <Mail size={20} />
                                    </div>
                                    <div className="detail-content w-full">
                                        <span className="detail-label">Email Address</span>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Email Address"
                                                    className="profile-input"
                                                />
                                            </div>
                                        ) : (
                                            <span className="detail-value">{user.email}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-detail-item">
                                    <div className="detail-icon">
                                        <Phone size={20} />
                                    </div>
                                    <div className="detail-content w-full">
                                        <span className="detail-label">Phone Number</span>
                                        {isEditing ? (
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Phone Number"
                                                    className="profile-input"
                                                />
                                            </div>
                                        ) : (
                                            <span className="detail-value">{user.phone || 'Not set'}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="profile-detail-item">
                                    <div className="detail-icon">
                                        <Shield size={20} />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Role</span>
                                        <span className="detail-value capitalize">{user.role}</span>
                                    </div>
                                </div>
                                <div className="profile-detail-item">
                                    <div className="detail-icon">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-label">Organization ID</span>
                                        <span className="detail-value">{user.organization_id}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="profile-stats-card">
                        <CardHeader>
                            <CardTitle>Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="profile-stats-grid">
                                <div className="profile-stat-box">
                                    <span className="stat-number">12</span>
                                    <span className="stat-label">Tickets Assigned</span>
                                </div>
                                <div className="profile-stat-box">
                                    <span className="stat-number">45</span>
                                    <span className="stat-label">Tickets Resolved</span>
                                </div>
                                <div className="profile-stat-box">
                                    <span className="stat-number">4.8</span>
                                    <span className="stat-label">Avg Rating</span>
                                </div>
                                <div className="profile-stat-box">
                                    <span className="stat-number">98%</span>
                                    <span className="stat-label">SLA Compliance</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
