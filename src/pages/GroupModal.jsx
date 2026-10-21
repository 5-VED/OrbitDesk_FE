import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { groupService } from '@/features/groups/api/groups';
import { toast } from 'react-hot-toast';

export function GroupModal({ isOpen, onClose, onSuccess, group = null }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_private: false,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditing = !!group;

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name || '',
                description: group.description || '',
                is_private: group.is_private || false,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                is_private: false,
            });
        }
        setErrors({});
    }, [group, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Group name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isEditing) {
                await groupService.update(group._id, formData);
                toast.success('Group updated successfully');
            } else {
                await groupService.create(formData);
                toast.success('Group created successfully');
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} group`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Group' : 'Create New Group'}
            size="medium"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Group' : 'Create Group')}
                    </Button>
                </>
            }
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Input
                    label="Group Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter group name"
                    error={errors.name}
                    required
                />

                <Textarea
                    label="Description"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter group description"
                    rows={3}
                />

                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="is_private"
                                checked={formData.is_private}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Private Group"
                    />
                    <FormHelperText sx={{ ml: 4, mt: -0.5 }}>
                        Private groups are only visible to their members
                    </FormHelperText>
                </Box>
            </Box>
        </Modal>
    );
}
