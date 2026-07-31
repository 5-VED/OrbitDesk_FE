import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AdminRoute } from '@/features/auth/components/AdminRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Loader } from '@/components/ui/Loader';

// 404 Page
const NotFound = lazy(() => import('@/pages/NotFound').then(module => ({ default: module.NotFound })));

// Landing Page (public)
const LandingPage = lazy(() => import('@/pages/LandingPage').then(module => ({ default: module.LandingPage })));

// Lazy Load Pages
const Login = lazy(() => import('@/pages/auth/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('@/pages/auth/Signup').then(module => ({ default: module.Signup })));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const TicketsList = lazy(() => import('@/pages/TicketsList').then(module => ({ default: module.TicketsList })));
const TicketDetail = lazy(() => import('@/pages/TicketDetail').then(module => ({ default: module.TicketDetail })));
const Agents = lazy(() => import('@/pages/Agents').then(module => ({ default: module.Agents })));
const Contacts = lazy(() => import('@/pages/Contacts').then(module => ({ default: module.Contacts })));
const Groups = lazy(() => import('@/pages/Groups').then(module => ({ default: module.Groups })));
const Organizations = lazy(() => import('@/pages/Organizations').then(module => ({ default: module.Organizations })));
const Reports = lazy(() => import('@/pages/Reports').then(module => ({ default: module.Reports })));
const KnowledgeBase = lazy(() => import('@/pages/KnowledgeBase').then(module => ({ default: module.KnowledgeBase })));
const Settings = lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));
const Profile = lazy(() => import('@/pages/Profile').then(module => ({ default: module.Profile })));
const Help = lazy(() => import('@/pages/Help').then(module => ({ default: module.Help })));

// Lazy Load Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles').then(module => ({ default: module.AdminRoles })));
const AdminOrganizations = lazy(() => import('@/pages/admin/AdminOrganizations').then(module => ({ default: module.AdminOrganizations })));
const AdminGroups = lazy(() => import('@/pages/admin/AdminGroups').then(module => ({ default: module.AdminGroups })));
const AdminSla = lazy(() => import('@/pages/admin/AdminSla').then(module => ({ default: module.AdminSla })));
const AdminAuditLog = lazy(() => import('@/pages/admin/AdminAuditLog').then(module => ({ default: module.AdminAuditLog })));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminApiKeys = lazy(() => import('@/pages/admin/AdminApiKeys').then(module => ({ default: module.AdminApiKeys })));
const AdminSystemHealth = lazy(() => import('@/pages/admin/AdminSystemHealth').then(module => ({ default: module.AdminSystemHealth })));

const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications').then(module => ({ default: module.AdminNotifications })));

export const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader fullScreen />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tickets" element={<TicketsList />} />
                    <Route path="/tickets/:ticketId" element={<TicketDetail />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/organizations" element={<Organizations />} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/reports" element={<Reports />} />
                </Route>

                {/* Admin Routes — requires admin role */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="roles" element={<AdminRoles />} />
                        <Route path="organizations" element={<AdminOrganizations />} />
                        <Route path="groups" element={<AdminGroups />} />
                        <Route path="sla-policies" element={<AdminSla />} />
                        <Route path="audit-log" element={<AdminAuditLog />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="api-keys" element={<AdminApiKeys />} />
                        <Route path="system-health" element={<AdminSystemHealth />} />
                        <Route path="notifications" element={<AdminNotifications />} />
                    </Route>
                </Route>

                {/* 404 — catch-all for any unknown route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
