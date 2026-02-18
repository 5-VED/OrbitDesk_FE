import { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { groupService } from '@/features/groups/api/groups';

const PRIORITIES = ['urgent', 'high', 'normal', 'low'];

export function SlaPolicyForm({ initialData, onSave, onCancel, loading, id }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [filter, setFilter] = useState({
        group_id: initialData?.filter?.group_id || '',
        type: initialData?.filter?.type || '',
        source: initialData?.filter?.source || '',
    });
    const [errors, setErrors] = useState({});

    // targets: { urgent: { first_reply_time: 60, resolution_time: 240 }, ... }
    const [targets, setTargets] = useState(() => {
        const initial = {};
        PRIORITIES.forEach(p => {
            initial[p] = { first_reply_time: '', resolution_time: '' };
        });

        if (initialData?.policy_metrics) {
            initialData.policy_metrics.forEach(m => {
                if (initial[m.priority]) {
                    initial[m.priority][m.target] = m.target_minutes;
                }
            });
        }
        return initial;
    });

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const result = await groupService.list({});
                setGroups(result.data.groups || []);
            } catch (error) {
                console.error("Failed to load groups", error);
            }
        };
        loadGroups();
    }, []);

    const handleTargetChange = (priority, targetType, value) => {
        setTargets(prev => ({
            ...prev,
            [priority]: {
                ...prev[priority],
                [targetType]: value
            }
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) {
            newErrors.title = 'Policy name is required';
        }

        // Validate targets if entered
        PRIORITIES.forEach(priority => {
            const t = targets[priority];
            if (t.first_reply_time && parseInt(t.first_reply_time) < 1) {
                newErrors[`${priority}_reply`] = 'Must be > 0';
            }
            if (t.resolution_time && parseInt(t.resolution_time) < 1) {
                newErrors[`${priority}_resolve`] = 'Must be > 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Transform targets back to array
        const policy_metrics = [];
        PRIORITIES.forEach(priority => {
            const t = targets[priority];
            if (t.first_reply_time) {
                policy_metrics.push({
                    priority,
                    target: 'first_reply_time',
                    target_minutes: parseInt(t.first_reply_time)
                });
            }
            if (t.resolution_time) {
                policy_metrics.push({
                    priority,
                    target: 'resolution_time',
                    target_minutes: parseInt(t.resolution_time)
                });
            }
        });

        // Clean filter
        const cleanFilter = {};
        if (filter.group_id) cleanFilter.group_id = filter.group_id;
        if (filter.type) cleanFilter.type = filter.type;
        if (filter.source) cleanFilter.source = filter.source;

        onSave({
            title,
            filter: cleanFilter,
            policy_metrics
        });
    };

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">General Information</h3>
                <Input
                    label="Policy Name"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    required
                    error={errors.title}
                    placeholder="e.g. VIP Support Policy"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Apply this policy to tickets that match:</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Group"
                        value={filter.group_id}
                        onChange={(e) => setFilter({ ...filter, group_id: e.target.value })}
                        placeholder="Any Group"
                        options={groups.map(g => ({ value: g._id, label: g.name }))}
                    />
                    <Select
                        label="Source"
                        value={filter.source}
                        onChange={(e) => setFilter({ ...filter, source: e.target.value })}
                        placeholder="Any Source"
                        options={[
                            { value: 'email', label: 'Email' },
                            { value: 'web', label: 'Web Form' },
                            { value: 'chat', label: 'Chat' },
                            { value: 'api', label: 'API' },
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Targets (in minutes)</h3>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Priority</th>
                                <th className="px-4 py-3">First Response Time (min)</th>
                                <th className="px-4 py-3">Resolution Time (min)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {PRIORITIES.map(priority => (
                                <tr key={priority}>
                                    <td className="px-4 py-3 font-medium capitalize">{priority}</td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            className="w-full"
                                            placeholder="Optional"
                                            value={targets[priority].first_reply_time}
                                            onChange={(e) => handleTargetChange(priority, 'first_reply_time', e.target.value)}
                                            error={errors[`${priority}_reply`]}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            className="w-full"
                                            placeholder="Optional"
                                            value={targets[priority].resolution_time}
                                            onChange={(e) => handleTargetChange(priority, 'resolution_time', e.target.value)}
                                            error={errors[`${priority}_resolve`]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-gray-500">Leave fields blank if no target applies.</p>
            </div>
        </form>
    );
}
