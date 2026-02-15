"use client"
import { useState, useEffect } from "react";
import { Send, Users } from "lucide-react";
import { showError, showSuccess } from "../../../utils/toastUtils";
import ConfirmModal from "../../../components/delete/ConfirmModel";
import api from "../../../api/axiosInstance";
import SubscriberTable from "../../../components/dashboard/communication/subscribeTable";

export default function SubscriberManage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/communication/subscribers/");
      const actualData = response?.data || response;
      setSubscribers(Array.isArray(actualData) ? actualData : []);
    } catch (err) {
      console.error(err);
      showError("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/communication/subscribers/${deleteId}/`);
      showSuccess("Subscriber removed successfully!");
      fetchSubscribers();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to remove subscriber.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Send className="text-[#2db7d1]" size={24} />
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your email list and newsletter audience.
          </p>
        </div>
        
        <div className="bg-white px-3 py-1 rounded border border-gray-100 shadow-sm flex items-center gap-2">
           <Users size={14} className="text-[#2db7d1]" />
           <span className="text-xs font-bold text-gray-600">Total List: {subscribers.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <SubscriberTable
          subscribers={subscribers}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Remove Subscriber"
        message="Are you sure you want to remove this email from your list?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}