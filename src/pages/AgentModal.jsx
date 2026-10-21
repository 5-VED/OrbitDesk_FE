import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { userService } from '../features/contacts/api/users';
import { Avatar } from '../components/ui/Avatar';
import { toast } from 'react-hot-toast';

export function AgentModal({ isOpen, onClose, onSuccess, agent }) {
    const fileInputRef = useRef(null);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '', // Will be set to ID
        department: '',
        password: '',
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchRoles = async () => {
            try {
                const response = await userService.getRoles();
                if (response.success && response.data) {
                    setRoles(response.data);
                    if (!agent) {
                        const agentRole = response.data.find(r => r.role === 'Agent');
                        if (agentRole) {
                            setFormData(prev => ({ ...prev, role: agentRole._id }));
                        } else if (response.data.length > 0) {
                            setFormData(prev => ({ ...prev, role: response.data[0]._id }));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch roles", error);
                toast.error("Failed to load roles");
            }
        };

        if (agent) {
            const roleId = typeof agent.role === 'object' ? agent.role._id : agent.role;
            setFormData({
                first_name: agent.first_name || '',
                last_name: agent.last_name || '',
                email: agent.email || '',
                phone: agent.phone || '',
                role: roleId || '',
                department: agent.department || '',
                password: '',
            });
            setPreviewUrl(agent.profile_pic || null);
        } else {
            setFormData(prev => ({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                role: prev.role || '',
                department: '',
                password: '',
            }));
            setPreviewUrl(null);
        }

        setProfilePic(null);
        setErrors({});
        fetchRoles();
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
        if (!formData.role) newErrors.role = 'Role is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
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
                await userService.update(agent._id, data);
            } else {
                await userService.create(data);
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
        return url;
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
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {errors.submit && (
                    <Alert severity="error">{errors.submit}</Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Box
                        sx={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Avatar
                            src={getImageUrl(previewUrl)}
                            name={`${formData.first_name} ${formData.last_name}`}
                            size="xl"
                            sx={{ width: 80, height: 80, fontSize: '2rem' }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            color: 'primary.contrastText',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2,
                            border: '2px solid',
                            borderColor: 'background.paper'
                        }}>
                            <Camera size={14} />
                        </Box>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            display: 'block',
                            mb: 1.5,
                            pb: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        Personal Information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Input
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) => handleChange('first_name', e.target.value)}
                                error={errors.first_name}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Input
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => handleChange('last_name', e.target.value)}
                                error={errors.last_name}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                error={errors.email}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                error={errors.phone}
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            display: 'block',
                            mb: 1.5,
                            pb: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        Role & Department
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Select
                                label="Role"
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                options={roles.map(r => ({ value: r._id, label: r.role }))}
                                error={errors.role}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Input
                                label="Department"
                                value={formData.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                                placeholder="e.g. Technical Support"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}
