"use client"
import { useState, useEffect } from "react";
import { Info, Plus } from "lucide-react";
import { contentService } from "../../../services/contentServices";
import { showError, showSuccess } from "../../../utils/toastUtils";
import AboutTable from "../../../components/dashboard/about-us/AboutTable";
import AboutForm from "../../../components/dashboard/about-us/AboutForm";
import ConfirmModal from "../../../components/delete/ConfirmModel"; // ConfirmModal थप्नुहोस्

export default function AboutManage() {
  const [aboutData, setAboutData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

 
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await contentService.getAbout();
      const data = response?.data?.data || response?.data || response;
      setAboutData(Array.isArray(data) ? data : []);
    } catch (err) {
      showError("Failed to load about details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setDeleteLoading(true);
    try {
      await contentService.deleteAbout(deleteId);
      showSuccess("Information deleted successfully!");
      fetchAboutData();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete the information.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className=" min-h-[80vh]">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Info className="text-[#2db7d1]" size={24} />
            About Us Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your organization's description and feature images.
          </p>
        </div>

        <div className="flex gap-2">
          {aboutData.length === 0 && (
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
              className="bg-[#213a59]  text-white px-2.5  py-1 cursor-pointer rounded text-xs font-bold  flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus size={14} />Create
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <AboutTable
          data={aboutData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} 
          loading={loading}
        />
      </div>

      {/* About Form Modal */}
      <AboutForm
      key={selectedItem?.id || "new-about"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        refreshData={fetchAboutData}
        existingCount={aboutData.length}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Information"
        message="Are you sure you want to delete this about information? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}