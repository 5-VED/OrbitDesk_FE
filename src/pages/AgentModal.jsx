import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { userService } from '../features/contacts/api/users';
import { Avatar } from '../components/ui/Avatar';
import { toast } from 'react-hot-toast';
import './ContactModal.css';

export function AgentModal({ isOpen, onClose, onSuccess, agent }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'Agent',
        department: '',
        password: '',
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (agent) {
                setFormData({
                    first_name: agent.first_name || '',
                    last_name: agent.last_name || '',
                    email: agent.email || '',
                    phone: agent.phone || '',
                    role: agent.role || 'Agent',
                    department: agent.department || '',
                    password: '',
                });
                setPreviewUrl(agent.profile_pic || null);
            } else {
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    role: 'Agent',
                    department: '',
                    password: '',
                });
                setPreviewUrl(null);
            }
            setProfilePic(null);
            setErrors({});
        }
    }, [isOpen, agent]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            let response;
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'password' && !formData[key]) return;
                data.append(key, formData[key]);
            });

            if (!agent && !formData.password) {
                data.append('password', 'Agent@123');
            }

            if (profilePic) {
                data.append('profile_pic', profilePic);
            }

            if (agent) {
                response = await userService.update(agent._id, data);
            } else {
                response = await userService.create(data);
            }

            toast.success(`Agent ${agent ? 'updated' : 'created'} successfully`);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(`Failed to ${agent ? 'update' : 'create'} agent:`, error);
            const msg = error.response?.data?.message || error.message || "Failed to save agent";
            toast.error(msg);
            setErrors({ submit: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        // Adjust for local dev if needed, typically Vite proxy handles /uploads
        return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={agent ? "Edit Agent" : "Add New Agent"}
            size="large"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (agent ? 'Update Agent' : 'Create Agent')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="contact-form">
                {errors.submit && (
                    <div className="form-error-banner">
                        {errors.submit}
                    </div>
                )}

                <div className="form-section profile-upload-section" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="profile-upload-container" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                        <Avatar
                            src={getImageUrl(previewUrl)}
                            name={`${formData.first_name} ${formData.last_name}`}
                            size="xl"
                            style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                        />
                        <div className="profile-upload-overlay" style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            background: '#7c3aed', // primary color
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            border: '2px solid white'
                        }}>
                            <Camera size={14} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Personal Information</h3>

                    <div className="form-row">
                        <Input
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => handleChange('first_name', e.target.value)}
                            error={errors.first_name}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => handleChange('last_name', e.target.value)}
                            error={errors.last_name}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            error={errors.email}
                            required
                        />
                        <Input
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            error={errors.phone}
                            required
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Role & Department</h3>
                    <div className="form-row">
                        <Select
                            label="Role"
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            options={[
                                { value: 'Agent', label: 'Agent' },
                                { value: 'Admin', label: 'Admin' },
                            ]}
                        />
                        <Input
                            label="Department"
                            value={formData.department}
                            onChange={(e) => handleChange('department', e.target.value)}
                            placeholder="e.g. Technical Support"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
}
