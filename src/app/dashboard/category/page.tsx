"use client"
import { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { categoryService } from "../../../services/categoryServices";
import { showError, showSuccess } from "../../../utils/toastUtils";
import CategoryTable from "../../../components/dashboard/category/CategoryTable";
import CategoryForm from "../../../components/dashboard/category/CategoryForm"; // फर्म इम्पोर्ट गरियो
import ConfirmModal from "../../../components/delete/ConfirmModel";

export default function CategoryManage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getDetails();

      console.log("Category API Response:", response);

      const actualData = response?.data || response;

      if (Array.isArray(actualData)) {
        setCategories(actualData);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      showError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    setDeleteLoading(true);
    try {
      await categoryService.deleteDetails(deleteId);
      showSuccess("Category deleted successfully!");
      fetchCategories();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete category.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="text-[#2db7d1]" size={24} />
            Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize your news and content into different categories.
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
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this category? This will remove all associated permanently."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedCategory}
        refreshData={fetchCategories}
      />
    </div>
  );
}
