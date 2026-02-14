import { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { userService } from '@/features/contacts/api/users';
import { toast } from 'react-hot-toast';
import './ContactModal.css';

export function ContactModal({ isOpen, onClose, onSuccess, contact }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        gender: 'male',
        country_code: '+91',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (contact) {
                setFormData({
                    first_name: contact.first_name || '',
                    last_name: contact.last_name || '',
                    email: contact.email || '',
                    phone: contact.phone || '',
                    gender: contact.gender || 'male',
                    country_code: contact.country_code || '+91',
                });
            } else {
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    gender: 'male',
                    country_code: '+91',
                });
            }
            setErrors({});
        }
    }, [isOpen, contact]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            let response;
            if (contact) {
                // Update mode
                response = await userService.update(contact._id, formData);
            } else {
                // Create mode: Auto-generate password since field is removed from UI
                const payload = {
                    ...formData,
                    password: 'User@' + Math.floor(1000 + Math.random() * 9000),
                };
                response = await userService.create(payload);
            }

            if (response.success) {
                toast.success(`Contact ${contact ? 'updated' : 'created'} successfully`);
                onSuccess(response.data);
                onClose();
            } else {
                toast.error(response.message || `Failed to ${contact ? 'update' : 'create'} contact`);
            }
        } catch (error) {
            console.error(`Failed to ${contact ? 'update' : 'create'} contact:`, error);
            setErrors({ submit: error.response?.data?.message || `Failed to ${contact ? 'update' : 'create'} contact` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={contact ? "Edit Contact" : "Add New Contact"}
            size="large"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (contact ? 'Update Contact' : 'Create Contact')}
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                            <Input
                                label="Country Code"
                                value={formData.country_code}
                                onChange={(e) => handleChange('country_code', e.target.value)}
                                placeholder="+91"
                            />
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleChange('phone', value);
                                }}
                                error={errors.phone}
                                required
                                placeholder="1234567890"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
