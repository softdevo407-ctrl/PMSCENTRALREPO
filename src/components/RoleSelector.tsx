import React, { useState } from 'react';
import { UserRole } from '../pbemTypes';
import { SAMPLE_USERS } from '../pbemData';
import { LogOut, Settings } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole, userName: string) => void;
  onLogout: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect, onLogout }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const groupedUsers = {
    [UserRole.PROJECT_DIRECTOR]: SAMPLE_USERS.filter((u) => u.role === UserRole.PROJECT_DIRECTOR),
    [UserRole.PROGRAMME_DIRECTOR]: SAMPLE_USERS.filter((u) => u.role === UserRole.PROGRAMME_DIRECTOR),
    [UserRole.CHAIRMAN]: SAMPLE_USERS.filter((u) => u.role === UserRole.CHAIRMAN),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {!selectedRole ? (
          // Role Selection
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
              <h1 className="text-4xl font-bold mb-3">PMS</h1>
              <p className="text-blue-100 text-lg">Project Budget Execution Management System</p>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Select Your Role</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(groupedUsers).map(([role, users]) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role as UserRole)}
                    className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700">
                      {role === UserRole.PROJECT_DIRECTOR
                        ? '📋'
                        : role === UserRole.PROGRAMME_DIRECTOR
                        ? '📊'
                        : '👤'}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{role}</h3>
                    <p className="text-sm text-gray-600 mb-4">{users.length} user{users.length !== 1 ? 's' : ''}</p>
                    <div className="text-xs text-gray-500">
                      {users.map((u) => u.name).join(', ')}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Roles Explained:</span>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• <span className="font-semibold">Project Director:</span> Creates and manages project definitions and scheduling</li>
                  <li>• <span className="font-semibold">Programme Director:</span> Approves and monitors assigned projects</li>
                  <li>• <span className="font-semibold">Chairman:</span> Oversees all projects and approves revisions</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // User Selection
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
              <h1 className="text-3xl font-bold mb-2">Select User</h1>
              <p className="text-blue-100">Choose your account to continue</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {groupedUsers[selectedRole].map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onRoleSelect(selectedRole, user.name)}
                    className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                      {user.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-semibold"
              >
                ← Back to Role Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
