"use client"
import { useEffect, useState } from "react";
import { Plus, Megaphone } from "lucide-react";
import api from "../../../api/axiosInstance";
import { showSuccess, showError } from "../../../utils/toastUtils";
import AdTable from "../../../components/dashboard/ads/adsTable";
import AdForm from "../../../components/dashboard/ads/adsForm";
import ConfirmModal from "../../../components/delete/ConfirmModel";
import { adService } from "../../../services/adServices";

export default function AdManage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await adService.getAds();

      const dataToSet =
        response.results || (Array.isArray(response) ? response : []);

      setAds(dataToSet);
    } catch (err) {
      console.error("Fetch error:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/ads/ads/${deleteId}/`);
      showSuccess("Advertisement deleted successfully.");
      fetchAds();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete the advertisement.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleEdit = (ad: any) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAd(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh] ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Megaphone className="text-[#2db7d1]" size={24} />
            Ads Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your portal's advertisements and placements.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-[#213a59] text-white px-2.5  py-1 cursor-pointer rounded text-xs font-bold  flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={14} /> Create
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded border border-gray-100 shadow-sm">
        <AdTable
          ads={ads}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </div>

      {/* Form Modal */}
      <AdForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedAd}
        refreshData={fetchAds}
      />

      {/* Custom Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Advertisement?"
        message="Are you sure you want to delete this Ad? This will remove all associated Ad permanently."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}
