import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { slaService } from '../api/sla';
import { SlaPolicyForm } from './SlaPolicyForm';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';

const formatMinutes = (minutes) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export function SlaPolicyList() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [policyToDelete, setPolicyToDelete] = useState(null);

    const loadPolicies = async () => {
        setLoading(true);
        try {
            const result = await slaService.list();
            setPolicies(result.data || []);
        } catch (error) {
            console.error("Failed to load SLA policies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleCreate = () => {
        setEditingPolicy(null);
        setIsModalOpen(true);
    };

    const handleEdit = (policy) => {
        setEditingPolicy(policy);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setPolicyToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!policyToDelete) return;
        try {
            await slaService.delete(policyToDelete);
            loadPolicies();
        } catch (error) {
            console.error("Failed to delete policy", error);
        } finally {
            setIsDeleteModalOpen(false);
            setPolicyToDelete(null);
        }
    };

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editingPolicy) {
                await slaService.update(editingPolicy._id, data);
            } else {
                await slaService.create(data);
            }
            setIsModalOpen(false);
            loadPolicies();
        } catch (error) {
            console.error("Failed to save policy", error);
            alert("Failed to save policy");
        } finally {
            setSaving(false);
        }
    };

    // Simple reorder: move up/down
    const movePolicy = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === policies.length - 1) return;

        const newPolicies = [...policies];
        const temp = newPolicies[index];
        newPolicies[index] = newPolicies[index + (direction === 'up' ? -1 : 1)];
        newPolicies[index + (direction === 'up' ? -1 : 1)] = temp;

        setPolicies(newPolicies); // Optimistic update

        try {
            await slaService.reorder({ orderedIds: newPolicies.map(p => p._id) });
        } catch (error) {
            console.error("Failed to reorder policies", error);
            loadPolicies(); // Revert
        }
    }

    const columns = [
        {
            key: 'title',
            header: 'Policy Name',
            width: '25%'
        },
        {
            key: 'targets',
            header: 'Targets (Urgent)',
            width: '35%',
            render: (_, row) => {
                const urgentMetric = row.policy_metrics?.find(m => m.priority === 'urgent' && m.target === 'first_reply_time');
                const resolutionMetric = row.policy_metrics?.find(m => m.priority === 'urgent' && m.target === 'resolution_time');
                if (!urgentMetric && !resolutionMetric) return <span className="text-gray-400">No urgent targets</span>;
                return (
                    <div className="text-sm">
                        {urgentMetric && <div>First Reply: {formatMinutes(urgentMetric.target_minutes)}</div>}
                        {resolutionMetric && <div>Resolve: {formatMinutes(resolutionMetric.target_minutes)}</div>}
                    </div>
                );
            }
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '20%',
            render: (_, row, index) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePolicy(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                    >
                        <ArrowUp size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePolicy(index, 'down')}
                        disabled={index === policies.length - 1}
                        title="Move Down"
                    >
                        <ArrowDown size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row._id)} className="text-red-500">
                        <Trash size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>SLA Policies</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Define service level agreements for tickets based on priority.
                    </p>
                </div>
                <Button onClick={handleCreate} icon={Plus}>Add Policy</Button>
            </CardHeader>
            <CardContent>
                <div className="sla-table-container">
                    <DataTable
                        columns={columns}
                        data={policies}
                        loading={loading}
                        rowKey="_id"
                        emptyMessage="No SLA policies found. Create one to get started."
                    />
                </div>
            </CardContent>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingPolicy ? "Edit SLA Policy" : "New SLA Policy"}
                    size="lg"
                    footer={
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="sla-policy-form"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Policy'}
                            </Button>
                        </>
                    }
                >
                    <SlaPolicyForm
                        id="sla-policy-form"
                        initialData={editingPolicy}
                        onSave={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                        loading={saving}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete SLA Policy"
                    size="small"
                    footer={
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="danger"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </>
                    }
                >
                    <p>Are you sure you want to delete this policy? This action cannot be undone.</p>
                </Modal>
            )}
        </Card>
    );
}
