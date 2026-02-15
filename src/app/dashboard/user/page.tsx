"use client"
import { useEffect, useState } from "react";
import {
  Loader2,
  Trash2,
  UserPlus,
  Search,
  X,
  ShieldAlert,
  UserCheck,
  User,
} from "lucide-react";
import api from "../../../api/axiosInstance";
import RegisterForm from "../../../components/auth/RegisterForm";
import { showError } from "../../../utils/toastUtils";

export default function DashboardUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/users/");
      
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      showError("Failed to load user data.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!Array.isArray(users)) return;

    const results = users.filter((user) => {
      const search = searchTerm.toLowerCase();
      const username = (user.username || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();

      return (
        username.includes(search) ||
        email.includes(search) ||
        fullName.includes(search)
      );
    });
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/auth/users/${id}/`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        alert("Failed to delete the user.");
      }
    }
  };

 return (
  <section className="relative">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-[#2db7d1]" size={24} />
          User Management
        </h1>
        <p className="text-xs text-gray-500">Manage system roles and permissions.</p>
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#213a59]" size={14} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-[#213a59] focus:bg-white w-full sm:w-64 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#213a59] text-white px-3 py-1.5 cursor-pointer rounded text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:bg-[#1b314d]"
        >
          <UserPlus size={14} /> Create
        </button>
      </div>
    </div>

    {/* Table Section */}
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh] h-[65vh]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm min-w-[850px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200 w-16">S.N.</th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200">Full Name & Email</th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200">Username</th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200">Role</th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200 text-center">Status</th>
              <th className="p-2 font-bold uppercase text-[10px] text-end border-b border-gray-200 w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#213a59]" size={32} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-2 text-gray-500 text-xs">{index + 1}.</td>
                  <td className="p-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#213a59] text-[13px]">{user.first_name} {user.last_name}</span>
                      <span className="text-[11px] text-gray-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="text-[#33b9d2] font-mono text-[11px] bg-[#33b9d2]/5 px-2 py-0.5 rounded border border-[#33b9d2]/10">
                      @{user.username}
                    </span>
                  </td>
                  <td className="p-2">
                    {user.is_superuser ? (
                      <span className="inline-flex items-center gap-1 text-purple-600 text-[9px] font-black bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        <ShieldAlert size={10} /> SUPER ADMIN
                      </span>
                    ) : user.is_staff ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 text-[9px] font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        <UserCheck size={10} /> EDITOR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-[9px] font-black bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        <User size={10} /> REGULAR
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${user.is_active ? "text-green-600 bg-green-50 border-green-100" : "text-red-400 bg-red-50 border-red-100"}`}>
                      {user.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-2 text-end">
                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <User size={40} className="opacity-20 mb-2" />
                    <p className="text-sm font-medium">No users found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  {isModalOpen && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
    <div className="bg-white rounded shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
      
      {/* Header */}
      <div className="flex-shrink-0 bg-[#213a59] px-4 py-1.5 text-white flex justify-between items-center">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <UserPlus size={18} /> Add New System User
        </h2>
        <button onClick={() => setIsModalOpen(false)} className="text-red-500 hover:text-red-500 cursor-pointer transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto overflow-x-hidden max-h-[75vh]">
        <RegisterForm
          isModal={true}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchUsers();
            
          }}
          onCancel={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  </div>
)}
  </section>
);
}