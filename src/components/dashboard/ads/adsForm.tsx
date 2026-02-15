"use client"
import React, { useEffect, useState } from "react";
import { Save, Megaphone, X, Loader2, Image as ImageIcon } from "lucide-react";
import { adService } from "../../../services/adServices";
import { showSuccess, showError } from "../../../utils/toastUtils";
import api from "../../../api/axiosInstance";
import { ConfigProvider, Select, DatePicker } from "antd";
import dayjs from "dayjs";

interface AdFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refreshData: () => void;
}

export default function AdForm({ isOpen, onClose, data, refreshData }: AdFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
    start_date: "",
    end_date: "",
    position: "",
    is_active: true,
    file: null as File | string | null,
  });

  const antdTheme = {
    token: {
      colorPrimary: "#213a59",
      controlOutline: "transparent",
      borderRadius: 4,
    },
    components: {
      Select: { optionSelectedBg: "#e6f0f5" },
      DatePicker: {
        activeBg: "#f0f9ff",
      },
    },
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api({ method: "OPTIONS", url: "/api/ads/ads/" });
        const choiceList = res.data?.actions?.POST?.position?.choices;
        if (choiceList) {
          const formattedChoices = choiceList.map((c: any) => ({
            value: c.value,
            label: c.display_name,
          }));
          setPositions(formattedChoices);
          if (!data && formattedChoices.length > 0) {
            setFormData((prev) => ({ ...prev, position: formattedChoices[0].value }));
          }
        }
      } catch (err) {
        console.error("Choices failed:", err);
      }
    };
    if (isOpen) fetchMetadata();
  }, [isOpen, data]);

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        name: data.name || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        position: data.position || "",
        is_active: data.is_active ?? true,
        file: data.file,
      });
      setPreview(data.file);
    } else {
      setFormData({
        id: null,
        name: "",
        start_date: "",
        end_date: "",
        position: "",
        is_active: true,
        file: null,
      });
      setPreview(null);
    }
  }, [data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("start_date", formData.start_date);
    dataToSend.append("end_date", formData.end_date);
    dataToSend.append("position", formData.position);
    dataToSend.append("is_active", String(formData.is_active));
    if (formData.file instanceof File) dataToSend.append("file", formData.file);

    try {
      if (formData.id) {
        await adService.updateAd(formData.id, dataToSend);
        showSuccess("Ad updated successfully!");
      } else {
        if (!(formData.file instanceof File)) {
          showError("Please select an ad image.");
          setLoading(false);
          return;
        }
        await adService.createAd(dataToSend);
        showSuccess("Ad created successfully!");
      }
      refreshData();
      onClose();
    } catch (err) {
      showError("Failed to save advertisement.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
        <div id="form-container" className="bg-white rounded shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex-shrink-0 bg-[#213a59] px-4 py-1.5 text-white flex justify-between items-center">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Megaphone size={18} /> {formData.id ? "Edit Ad" : "Add New Ad"}
            </h2>
            <button onClick={onClose} className="text-red-500 hover:text-red-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 overflow-y-auto max-h-[75vh]">
            {/* Ad Name */}
            <div className="space-y-1 mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ad Name *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 border shadow-sm border-gray-200 rounded outline-none focus:border-[#213a59] text-sm transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Position
                </label>
                <Select
                  showSearch
                  className="w-full h-[34px]"
                  placeholder="Select position"
                  getPopupContainer={(trigger) => trigger.parentElement}
                  value={formData.position || undefined}
                  onChange={(val) => setFormData({ ...formData, position: val })}
                  options={positions}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  styles={{
                    popup: {
                      root: { fontSize: "12px" }
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-4 h-4 accent-[#213a59] cursor-pointer"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-xs font-bold text-gray-600 cursor-pointer">Active</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Start Date</label>
                <DatePicker
                  className="w-full h-[34px]"
                  format="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  needConfirm={false}
                  getPopupContainer={() => document.getElementById('form-container')!}
                  value={formData.start_date ? dayjs(formData.start_date) : null}
                  onChange={(date, dateString) =>
                    setFormData({ ...formData, start_date: dateString as string })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">End Date</label>
                <DatePicker
                  className="w-full h-[34px]"
                  format="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  needConfirm={false}
                  getPopupContainer={() => document.getElementById('form-container')!}
                  value={formData.end_date ? dayjs(formData.end_date) : null}
                  onChange={(date, dateString) =>
                    setFormData({ ...formData, end_date: dateString as string })
                  }
                />
              </div>
            </div>

            {/* Image Preview */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ad Creative</label>
              <div className="relative h-40 w-full border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer overflow-hidden group">
                {preview ? (
                  <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-xs">Upload Ad Image</span>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, file: file });
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex-shrink-0 flex justify-end gap-2 px-4 py-2 border-t border-gray-300 bg-gray-50/50">
            <button onClick={onClose} className="px-4 py-1.5 rounded text-red-500 text-[11px] border border-red-500 font-bold uppercase hover:bg-red-50 transition-all cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#213a59] text-white px-6 py-1.5 rounded font-bold text-[11px] uppercase flex items-center gap-2 disabled:bg-gray-400 cursor-pointer  "
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> {formData.id ? "Update" : "Save"}</>}
            </button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}