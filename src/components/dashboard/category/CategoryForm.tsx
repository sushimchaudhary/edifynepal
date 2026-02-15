import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  Tag,
  Link as LinkIcon,
  ToggleLeft,
} from "lucide-react";
import { categoryService } from "../../../services/categoryServices";
import { showSuccess, showError } from "../../../utils/toastUtils";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  refreshData: () => void;
}

export default function CategoryForm({
  isOpen,
  onClose,
  data,
  refreshData,
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        is_active: data.is_active ?? true,
      });
    } else {
      setFormData({ name: "", slug: "", is_active: true });
    }
  }, [data, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, "-") 
      .replace(/(^-|-$)/g, "");

    setFormData({ ...formData, name, slug: generatedSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        is_active: formData.is_active,
      };

      if (data?.id) {
        await categoryService.updateDetails(data.id, payload);
        showSuccess("Updated!");
      } else {
        await categoryService.createDetails(payload);
        showSuccess("Created!");
      }
      refreshData();
      onClose();
    } catch (err: any) {
      console.log("Error Response:", err.response?.data);
      showError("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#213a59] px-4 py-2  flex justify-between items-center">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Tag size={18} className="text-white" />
            {data ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 space-y-3">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full pl-10 pr-4 py-1.5 shadow-sm border border-gray-200 rounded focus:ring-[#213a59]/20 focus:border-[#213a59] outline-none text-sm transition-all"
                placeholder="e.g. Politics"
              />
              <Tag
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Slug
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  const val = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "");
                  setFormData({ ...formData, slug: val });
                }}
                className="w-full pl-10 pr-4 py-1.5 shadow-sm border border-gray-200 rounded focus:ring-[#213a59]/20 focus:border-[#213a59] outline-none text-sm transition-all"
                placeholder="e.g. politics-news"
              />
              <LinkIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-1.5 border border-gray-100 rounded shadow-sm bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ToggleLeft size={18} className="text-[#213a59]" />
              Active Status
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:-top-[0px] after:-left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#213a59]"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-1.5 border border-red-500 text-gray-600  hover:text-white rounded text-sm font-bold cursor-pointer hover:bg-red-500 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#213a59]  text-white px-4 py-1.5 cursor-pointer rounded text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-teal-900/10"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {data ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
