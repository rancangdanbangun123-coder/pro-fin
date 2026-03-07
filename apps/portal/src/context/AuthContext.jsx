import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_USERS } from '../data/userData';

const AuthContext = createContext(null);

// All available permission keys with Indonesian labels, grouped by module
export const ALL_PERMISSIONS = [
    // ── Pengguna ──
    { key: 'view_users', label: 'Lihat Pengguna', icon: 'visibility', description: 'Akses halaman manajemen pengguna', group: 'Pengguna' },
    { key: 'create_user', label: 'Tambah Pengguna', icon: 'person_add', description: 'Buat akun pengguna baru', group: 'Pengguna' },
    { key: 'edit_user', label: 'Edit Pengguna', icon: 'edit', description: 'Ubah data pengguna', group: 'Pengguna' },
    { key: 'delete_user', label: 'Hapus Pengguna', icon: 'person_remove', description: 'Hapus akun pengguna', group: 'Pengguna' },
    { key: 'manage_roles', label: 'Kelola Role', icon: 'admin_panel_settings', description: 'Buat, edit, hapus role & wewenang', group: 'Pengguna' },
    // ── Proyek ──
    { key: 'view_proyek', label: 'Lihat Proyek', icon: 'visibility', description: 'Akses halaman proyek', group: 'Proyek' },
    { key: 'create_proyek', label: 'Buat Proyek', icon: 'add_circle', description: 'Buat proyek baru', group: 'Proyek' },
    { key: 'edit_proyek', label: 'Edit Proyek', icon: 'edit', description: 'Ubah data proyek', group: 'Proyek' },
    { key: 'delete_proyek', label: 'Hapus Proyek', icon: 'delete', description: 'Hapus proyek', group: 'Proyek' },
    { key: 'view_all_projects', label: 'Lihat Semua Proyek', icon: 'public', description: 'Lihat proyek seluruh organisasi', group: 'Proyek' },
    // ── Kategori ──
    { key: 'view_category', label: 'Lihat Kategori', icon: 'visibility', description: 'Akses halaman kategori', group: 'Kategori' },
    { key: 'create_category', label: 'Buat Kategori', icon: 'create_new_folder', description: 'Tambah kategori & sub-kategori', group: 'Kategori' },
    { key: 'delete_category', label: 'Hapus Kategori', icon: 'folder_delete', description: 'Hapus kategori & sub-kategori', group: 'Kategori' },
    { key: 'import_category', label: 'Import Kategori', icon: 'upload_file', description: 'Import data kategori dari file', group: 'Kategori' },
    // ── Material ──
    { key: 'view_logistik', label: 'Lihat Material', icon: 'visibility', description: 'Akses halaman material & logistik', group: 'Material' },
    { key: 'create_material', label: 'Tambah Material', icon: 'add_box', description: 'Tambah material baru', group: 'Material' },
    { key: 'edit_material', label: 'Edit Material', icon: 'edit', description: 'Ubah data material', group: 'Material' },
    { key: 'delete_material', label: 'Hapus Material', icon: 'delete', description: 'Hapus material', group: 'Material' },
    { key: 'import_material', label: 'Import Material', icon: 'upload_file', description: 'Import data material dari file', group: 'Material' },
    // ── Pengadaan ──
    { key: 'create_procurement', label: 'Buat PR', icon: 'add_shopping_cart', description: 'Buat permintaan pengadaan baru', group: 'Pengadaan' },
    { key: 'edit_procurement', label: 'Edit Pengadaan', icon: 'edit', description: 'Ubah item pengadaan', group: 'Pengadaan' },
    { key: 'delete_procurement', label: 'Hapus Pengadaan', icon: 'delete', description: 'Hapus item pengadaan', group: 'Pengadaan' },
    { key: 'move_procurement', label: 'Pindah Fase', icon: 'swap_horiz', description: 'Pindahkan item antar fase pengadaan', group: 'Pengadaan' },
    // ── Aset ──
    { key: 'create_asset', label: 'Tambah Aset', icon: 'add_box', description: 'Tambah aset baru', group: 'Aset' },
    { key: 'edit_asset', label: 'Edit Aset', icon: 'edit', description: 'Ubah data aset', group: 'Aset' },
    { key: 'delete_asset', label: 'Hapus Aset', icon: 'delete', description: 'Hapus aset', group: 'Aset' },
    // ── Subkontraktor ──
    { key: 'create_subcon', label: 'Tambah Subkon', icon: 'group_add', description: 'Tambah subkontraktor baru', group: 'Subkontraktor' },
    { key: 'edit_subcon', label: 'Edit Subkon', icon: 'edit', description: 'Ubah data subkontraktor', group: 'Subkontraktor' },
    { key: 'delete_subcon', label: 'Hapus Subkon', icon: 'group_remove', description: 'Hapus subkontraktor', group: 'Subkontraktor' },
    // ── Keuangan ──
    { key: 'view_keuangan', label: 'Lihat Keuangan', icon: 'visibility', description: 'Akses halaman keuangan', group: 'Keuangan' },
    { key: 'create_invoice', label: 'Buat Invoice', icon: 'receipt_long', description: 'Buat invoice & termin baru', group: 'Keuangan' },
    { key: 'edit_invoice', label: 'Edit Invoice', icon: 'edit', description: 'Ubah data invoice', group: 'Keuangan' },
    { key: 'delete_invoice', label: 'Hapus Invoice', icon: 'delete', description: 'Hapus invoice & log pembayaran', group: 'Keuangan' },
    // ── Akuntansi ──
    { key: 'view_akuntansi', label: 'Lihat Akuntansi', icon: 'account_balance_wallet', description: 'Akses modul akuntansi', group: 'Akuntansi' },
];

// All permission keys for convenience
const ALL_PERM_KEYS = ALL_PERMISSIONS.map(p => p.key);

// Default role-permission mapping (seeded on first load)
const DEFAULT_ROLE_PERMISSIONS = {
    'Admin': [...ALL_PERM_KEYS],
    'Project Manager': [
        'view_proyek', 'create_proyek', 'edit_proyek',
        'view_category', 'create_category',
        'view_logistik', 'create_material', 'edit_material', 'import_material',
        'create_procurement', 'edit_procurement', 'move_procurement',
        'create_asset', 'edit_asset',
        'create_subcon', 'edit_subcon',
        'view_akuntansi',
    ],
    'Finance': [
        'view_proyek', 'view_all_projects',
        'view_category',
        'view_logistik',
        'view_keuangan', 'create_invoice', 'edit_invoice', 'delete_invoice',
        'view_akuntansi',
    ],
    'Site Manager': [
        'view_proyek',
        'view_category', 'create_category',
        'view_logistik', 'create_material', 'edit_material',
        'create_procurement', 'edit_procurement', 'move_procurement',
        'create_asset', 'edit_asset',
        'create_subcon', 'edit_subcon',
        'view_akuntansi',
    ],
};

// Read or seed role permissions from localStorage
// Includes migration: upgrades old 7-key format to new ~30-key format
export function getRolePermissions() {
    const saved = localStorage.getItem('rolePermissions');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: detect old format (any default role has ≤7 permissions)
        const needsMigration = Object.keys(DEFAULT_ROLE_PERMISSIONS).some(role => {
            const current = parsed[role];
            const expected = DEFAULT_ROLE_PERMISSIONS[role];
            return current && expected && current.length < expected.length;
        });
        if (needsMigration) {
            // Re-seed default roles, preserve custom roles
            for (const [role, perms] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
                parsed[role] = [...perms];
            }
            localStorage.setItem('rolePermissions', JSON.stringify(parsed));
        }
        return parsed;
    }
    localStorage.setItem('rolePermissions', JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    return { ...DEFAULT_ROLE_PERMISSIONS };
}

export function saveRolePermissions(rolePerms) {
    localStorage.setItem('rolePermissions', JSON.stringify(rolePerms));
    window.dispatchEvent(new Event('rolePermissionsUpdated'));
}

function getUsers() {
    const saved = localStorage.getItem('users');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = sessionStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    // Force re-render when role permissions change
    const [, setPermTick] = useState(0);
    useEffect(() => {
        const handler = () => setPermTick(t => t + 1);
        window.addEventListener('rolePermissionsUpdated', handler);
        return () => window.removeEventListener('rolePermissionsUpdated', handler);
    }, []);

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const login = useCallback((email, password) => {
        const users = getUsers();
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
            return { success: false, error: 'Email atau password salah' };
        }
        if (user.status && user.status !== 'Active') {
            return { success: false, error: 'Akun Anda tidak aktif. Hubungi admin.' };
        }
        setCurrentUser(user);
        return { success: true, user };
    }, []);

    const signup = useCallback((name, email, password) => {
        const users = getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'Email sudah terdaftar' };
        }

        const newUser = {
            id: `USR-${Date.now()}`,
            name,
            email,
            password,
            role: 'Project Manager',
            status: 'Active',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        window.dispatchEvent(new Event('storage'));
        setCurrentUser(newUser);
        return { success: true, user: newUser };
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    }, []);

    const hasPermission = useCallback((permission) => {
        if (!currentUser) return false;
        const role = currentUser.role;
        const rolePerms = getRolePermissions();
        const perms = rolePerms[role];
        if (!perms) {
            // Unknown role — basic access only
            return permission !== 'view_users' && permission !== 'view_all_projects' && permission !== 'view_keuangan';
        }
        return perms.includes(permission);
    }, [currentUser]);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        hasPermission,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
