"use client"
import { useState, useEffect } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { showError, showSuccess } from "../../../utils/toastUtils";
import ConfirmModal from "../../../components/delete/ConfirmModel";
import { communicationService } from "../../../services/communicationServices";
import ContactMessageTable from "../../../components/dashboard/communication/contactMessagetable";

export default function ContactManage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await communicationService.getMessages();
      const actualData = response?.data || response;
      if (Array.isArray(actualData)) {
        setMessages(actualData);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
      showError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    setDeleteLoading(true);
    try {
      await communicationService.deleteMessage(deleteId);
      showSuccess("Message deleted successfully!");
      fetchMessages();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete the message.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="text-[#2db7d1]" size={24} />
            Contact Messages
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            View and manage all contact inquiries received from the website.
          </p>
        </div>
        
        <div className="bg-white px-3 py-1 rounded border border-gray-100 shadow-sm flex items-center gap-2">
           <MessageSquare size={14} className="text-[#2db7d1]" />
           <span className="text-xs font-bold text-gray-600">Total: {messages.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <ContactMessageTable
          messages={messages}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this message permanently? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}