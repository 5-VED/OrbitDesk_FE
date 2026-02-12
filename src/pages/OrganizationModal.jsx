import { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { organizationService } from '../services/organization.service';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import './OrganizationModal.css';

export function OrganizationModal({ isOpen, onClose, onSuccess, organization = null }) {
    const [formData, setFormData] = useState({
        name: '',
        domains: [],
        is_active: true,
        settings: {
            allow_external_sharing: false,
            default_locale: 'en-US',
        },
    });
    const [domainInput, setDomainInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditing = !!organization;

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                domains: organization.domains || [],
                is_active: organization.is_active !== false,
                settings: {
                    allow_external_sharing: organization.settings?.allow_external_sharing || false,
                    default_locale: organization.settings?.default_locale || 'en-US',
                },
            });
        } else {
            setFormData({
                name: '',
                domains: [],
                is_active: true,
                settings: {
                    allow_external_sharing: false,
                    default_locale: 'en-US',
                },
            });
        }
        setDomainInput('');
        setErrors({});
    }, [organization, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
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
                await organizationService.update(organization._id, formData);
                toast.success('Organization updated successfully');
            } else {
                await organizationService.create(formData);
                toast.success('Organization created successfully');
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} organization`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('settings.')) {
            const settingKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    [settingKey]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddDomain = () => {
        const domain = domainInput.trim().toLowerCase();
        if (domain && !formData.domains.includes(domain)) {
            setFormData(prev => ({
                ...prev,
                domains: [...prev.domains, domain]
            }));
            setDomainInput('');
        }
    };

    const handleRemoveDomain = (domain) => {
        setFormData(prev => ({
            ...prev,
            domains: prev.domains.filter(d => d !== domain)
        }));
    };

    const handleDomainKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddDomain();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Organization' : 'Create New Organization'}
            size="medium"
        >
            <form onSubmit={handleSubmit} className="org-modal-form">
                <div className="form-group">
                    <label htmlFor="name">Organization Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter organization name"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="domains">Domains</label>
                    <div className="domain-input-wrapper">
                        <input
                            type="text"
                            id="domains"
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            onKeyDown={handleDomainKeyDown}
                            placeholder="Enter domain (e.g., example.com)"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={handleAddDomain}>
                            Add
                        </Button>
                    </div>
                    {formData.domains.length > 0 && (
                        <div className="domains-tags">
                            {formData.domains.map(domain => (
                                <span key={domain} className="domain-tag">
                                    {domain}
                                    <button type="button" onClick={() => handleRemoveDomain(domain)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="default_locale">Default Locale</label>
                    <select
                        id="default_locale"
                        name="settings.default_locale"
                        value={formData.settings.default_locale}
                        onChange={handleChange}
                    >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                        <option value="pt-BR">Portuguese (Brazil)</option>
                        <option value="ja-JP">Japanese</option>
                        <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                </div>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="settings.allow_external_sharing"
                            checked={formData.settings.allow_external_sharing}
                            onChange={handleChange}
                        />
                        <span>Allow External Sharing</span>
                    </label>
                    <p className="help-text">Enable sharing tickets and knowledge base with external users</p>
                </div>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        <span>Active Organization</span>
                    </label>
                    <p className="help-text">Inactive organizations cannot create new tickets</p>
                </div>

                <div className="form-actions">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Organization' : 'Create Organization')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
