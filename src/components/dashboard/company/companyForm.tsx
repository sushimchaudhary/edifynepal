import React, { useState, useEffect } from "react";
import {
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";

import { companyService } from "../../../services/companyServices";
import { showError, showSuccess } from "../../../utils/toastUtils";

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refreshData: () => void;
  existingCount: number;
}

export default function CompanyForm({
  isOpen,
  onClose,
  data,
  refreshData,
  existingCount,
}: CompanyFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
    address: "",
    contact_no: "",
    email: "",
    fb_link: "",
    insta_link: "",
    linkedin_link: "",
    x_link: "",
    google_map: "",
    logo: null as File | string | null,
  });

  useEffect(() => {
    if (data) {
      setFormData({ ...data, logo: data.logo });
      setPreview(data.logo);
    } else {
      setFormData({
        id: null,
        name: "",
        address: "",
        contact_no: "",
        email: "",
        fb_link: "",
        insta_link: "",
        linkedin_link: "",
        x_link: "",
        google_map: "",
        logo: null,
      });
      setPreview(null);
    }
  }, [data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id && existingCount > 0) {
      return showError(
        "Company profile already exists. You can only edit the existing one.",
      );
    }
   
    setLoading(true);

    const dataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "logo") {
        if (value instanceof File) {
          dataToSend.append(key, value);
        }
      } else if (key !== "id" && value !== null && value !== undefined) {
        dataToSend.append(key, String(value));
      }
    });

    try {
      if (formData.id) {
        await companyService.updateDetails(formData.id, dataToSend);
        showSuccess("Company updated successfully!");
      } else {
        await companyService.createDetails(dataToSend);
        showSuccess("Company created successfully!");
      }
      refreshData();
      onClose();
    } catch (err: any) {
      console.error("Error response:", err.response?.data);
      showError(err.response?.data?.logo?.[0] || "Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-[#213a59] px-2 py-1.5 text-white flex justify-between items-center z-10">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Building2 size={18} />{" "}
            {formData.id ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Logo
              </label>
              <div className="relative h-25 w-full border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-all cursor-pointer overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-contain p-1"
                    alt="Preview"
                  />
                ) : (
                  <ImageIcon size={18} className="text-gray-300" />
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, logo: file });
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-8 grid grid-cols-1 gap-2.5">
              <InputField
                label="Business Name"
                value={formData.name}
                onChange={(v: any) => setFormData({ ...formData, name: v })}
                icon={<Building2 size={14} />}
              />
              <InputField
                label="Official Email"
                value={formData.email}
                onChange={(v: any) => setFormData({ ...formData, email: v })}
                icon={<Mail size={14} />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <InputField
              label="Phone Number"
              value={formData.contact_no}
              maxLength={10}
              onChange={(v: any) =>
                setFormData({
                  ...formData,
                  contact_no: v.replace(/[^0-9]/g, ""),
                })
              }
              icon={<Phone size={14} />}
            />
            <InputField
              label="Google Map"
              value={formData.google_map}
              onChange={(v: any) => setFormData({ ...formData, google_map: v })}
              icon={<MapPin size={14} />}
            />
          </div>

          <InputField
            label="Office Address"
            value={formData.address}
            onChange={(v: any) => setFormData({ ...formData, address: v })}
            icon={<MapPin size={14} />}
          />

          <div className="pt-3 border-t border-gray-50">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
              Social Media Links
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InputField
                label="FB"
                value={formData.fb_link}
                onChange={(v: any) => setFormData({ ...formData, fb_link: v })}
                icon={<Globe size={12} />}
              />
              <InputField
                label="Insta"
                value={formData.insta_link}
                onChange={(v: any) =>
                  setFormData({ ...formData, insta_link: v })
                }
                icon={<Globe size={12} />}
              />
              <InputField
                label="In"
                value={formData.linkedin_link}
                onChange={(v: any) =>
                  setFormData({ ...formData, linkedin_link: v })
                }
                icon={<Globe size={12} />}
              />
              <InputField
                label="X"
                value={formData.x_link}
                onChange={(v: any) => setFormData({ ...formData, x_link: v })}
                icon={<Globe size={12} />}
              />
            </div>
          </div>
        </form>

        <div className="flex-shrink-0 flex justify-end gap-2 px-5 py-3 border-t border-gray-50 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-red-500 text-[11px] border border-red-500 hover:bg-red-500 hover:text-white font-bold cursor-pointer uppercase transition-all"
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
                <Save size={14} /> {formData.id ? "Update" : "Save"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon, value, onChange, maxLength }: any) => (
  <div className="flex flex-col gap-1.5 text-left">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400">{icon}</span>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value;
          if (maxLength && val.length > maxLength) return;
          onChange(val);
        }}
        className="w-full pl-10 pr-4 py-1 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#213a59]/10 focus:border-[#213a59] outline-none text-sm"
      />
    </div>
  </div>
);
