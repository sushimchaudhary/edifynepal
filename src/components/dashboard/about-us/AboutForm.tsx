import React, { useState, useEffect } from "react";
import { Save, Info, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { contentService } from "../../../services/contentServices";
import { showError, showSuccess } from "../../../utils/toastUtils";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface AboutFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refreshData: () => void;
  existingCount: number;
}

export default function AboutForm({
  isOpen,
  onClose,
  data,
  refreshData,
}: AboutFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: null as number | null,
    description: "",
    photo: null as File | string | null,
  });

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        id: data.id || null,
        description: data.description || "",
        photo: data.photo || null,
      });
      setPreview(data.photo || null);
    } else if (!isOpen) {
    
      setFormData({ id: null, description: "", photo: null });
      setPreview(null);
    }
  }, [isOpen, data?.id, data?.description]); 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.description || formData.description === "<p><br></p>") {
    return showError("Description is required");
  }

  setLoading(true);
  const dataToSend = new FormData();
  dataToSend.append("description", formData.description);

  if (formData.photo instanceof File) {
    dataToSend.append("photo", formData.photo);
  }

  try {
    if (formData.id) {
    
      await contentService.updateAbout(formData.id, dataToSend);
      showSuccess("About content updated successfully!");
    } else {
      if (!(formData.photo instanceof File)) {
        setLoading(false);
        return showError("Please upload a feature image.");
      }
      await contentService.createAbout(dataToSend);
      showSuccess("About content created successfully!");
    }
    refreshData();
    onClose();
  } catch (err: any) {
    console.error("Submit Error:", err.response?.data);
    const errorMsg = err.response?.data?.message || "Failed to save data.";
    showError(errorMsg);
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 font-sans text-gray-800">
      <div className="bg-white rounded shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-[#213a59] px-4 py-3 text-white flex justify-between items-center shadow-md">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Info size={18} /> {formData.id ? "Update About Us" : "Add New About Content"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
          
          {/* Photo Upload Section - Clean Style */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Feature Image
            </label>
            <div className="relative h-40 w-full border-2 border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center overflow-hidden hover:border-[#213a59] transition-all cursor-pointer group">
              {preview ? (
                <>
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <ImageIcon className="text-white" size={30} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImageIcon size={40} strokeWidth={1} className="opacity-40" />
                  <span className="text-xs font-medium">Click to upload photo</span>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, photo: file });
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              Organization Description
            </label>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <ReactQuill
              key={formData.id ? `edit-${formData.id}` : "new-about"}
                theme="snow"
                value={formData.description}
                
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                className="text-black h-56 mb-12"
                placeholder="Write organization details here..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link","image", "blockquote", "clean"],
                  ],
                }}
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 px-6 py-2 border-t border-gray-300 bg-gray-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 rounded text-red-500 text-[11px] border border-red-500 hover:bg-red-500 hover:text-white font-bold cursor-pointer uppercase transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#213a59]  text-white px-5 py-1.5 rounded font-bold text-[11px] uppercase shadow-sm cursor-pointer transition-all flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Save size={14} /> {(formData.id || data?.id) ? "Update" : "Save"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}