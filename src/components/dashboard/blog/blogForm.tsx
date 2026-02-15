import React, { useState, useEffect } from "react";
import {
  Save,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  User,
} from "lucide-react";
import { ConfigProvider, Select } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { contentService } from "../../../services/contentServices";
import { showError, showSuccess } from "../../../utils/toastUtils";

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refreshData: () => void;
}

export default function BlogForm({
  isOpen,
  onClose,
  data,
  refreshData,
}: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [authorPreview, setAuthorPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: null as number | null,
    category: "",
    title: "",
    slug: "",
    author_name: "",
    author_description: "",
    author_photo: null as File | string | null,
    photo: null as File | string | null,
    description: "",
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await contentService.getCategories();
        const actualData = Array.isArray(res)
          ? res
          : res?.data?.data || res?.data || [];
        setCategories(actualData);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (data?.id) {
        setFormData({
          id: data.id,
          category: data.category !== undefined ? data.category.toString() : "",
          title: data.title || "",
          slug: data.slug || "",
          author_name: data.author_name || "",
          author_description: data.author_description || "",
          author_photo: data.author_photo || null,
          photo: data.photo || null,
          description: data.description || "",
        });
        setPreview(data.photo || null);
        setAuthorPreview(data.author_photo || null);
      } else {
        setFormData({
          id: null,
          category: "",
          title: "",
          slug: "",
          author_name: "",
          author_description: "",
          author_photo: null,
          photo: null,
          description: "",
        });
        setPreview(null);
        setAuthorPreview(null);
      }
    }
  }, [isOpen, data?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.author_name) {
      return showError("Title, Description, and Author Name are required");
    }

    setLoading(true);
    const dataToSend = new FormData();

    dataToSend.append("title", formData.title);
    dataToSend.append("category", formData.category);
    dataToSend.append("slug", formData.slug);
    dataToSend.append("description", formData.description);
    dataToSend.append("author_name", formData.author_name);
    dataToSend.append("author_description", formData.author_description || "");

    if (formData.photo instanceof File) {
      dataToSend.append("photo", formData.photo);
    }
    if (formData.author_photo instanceof File) {
      dataToSend.append("author_photo", formData.author_photo);
    }

    try {
      if (formData.id) {
        await contentService.updatePost(formData.id, dataToSend);
        showSuccess("Post updated successfully!");
      } else {
        if (!(formData.photo instanceof File)) {
          setLoading(false);
          return showError("Please upload a featured photo.");
        }
        await contentService.createPost(dataToSend);
        showSuccess("Post created successfully!");
      }

      refreshData();
      onClose();
    } catch (err: any) {
      console.error("Error saving post:", err.response?.data);
      const errorData = err.response?.data;
      if (errorData) {
        const errorKeys = Object.keys(errorData);
        const firstError = errorData[errorKeys[0]];
        showError(
          `${errorKeys[0]}: ${Array.isArray(firstError) ? firstError[0] : firstError}`,
        );
      } else {
        showError("Failed to save post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 font-sans text-gray-800">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#213a59] px-4 py-3 text-white flex justify-between items-center shadow-md">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <FileText size={18} />{" "}
            {formData.id ? "Update Post Content" : "Create New Post"}
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 overflow-y-auto max-h-[80vh] grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Post Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;

                  const generatedSlug = title
                    .trim()
                    .toLowerCase()
                    .replace(/[\s_]+/g, "-")
                    .replace(/[^\u0900-\u097F\w-]+/g, "");

                  setFormData({
                    ...formData,
                    title,
                    slug: generatedSlug,
                  });
                }}
                className="w-full p-1.5 border border-gray-200 rounded text-sm focus:border-[#213a59] outline-none shadow-sm transition-all"
                placeholder="Enter a catchy title..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Category
                </label>
                <div className="relative">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#213a59",
                        controlOutline: "transparent",
                        borderRadius: 4,
                      },
                      components: {
                        Select: {
                          optionSelectedBg: "#e6f0f5",
                        },
                      },
                    }}
                  >
                    <Select
                      showSearch
                      placeholder="Choose Category"
                      className="w-full h-[34px]"
                      variant="outlined"
                      value={formData.category || undefined}
                      onChange={(value) => {
                        setFormData({
                          ...formData,
                          category: value,
                        });
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={categories.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.name,
                      }))}
                      styles={{
                        popup: {
                          root: { fontSize: "12px" }
                        }
                      }}
                    />
                  </ConfigProvider>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full p-1.5 border border-gray-100 shadow-sm bg-gray-50 rounded text-sm text-gray-500 outline-none"
                  placeholder="slug-url-here"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Main Article Content
              </label>
              <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) =>
                    setFormData({ ...formData, description: content })
                  }
                  className="text-black h-54 mb-10"
                  placeholder="Write article details..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image", "code-block"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-gray-50 p-2 rounded border border-gray-100">
              <label className="text-[10px] font-bold text-[#213a59] uppercase tracking-widest block mb-3">
                Featured Image
              </label>
              <div className="relative h-48 w-full border-2 border-dashed border-gray-200 rounded bg-white flex items-center justify-center overflow-hidden hover:border-[#213a59] transition-all cursor-pointer group">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 p-2">
                    <ImageIcon size={40} className="mx-auto mb-2 opacity-20" />
                    <span className="text-[10px] font-bold uppercase">
                      Upload Photo
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer "
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

            <div className="bg-white p-2 rounded border border-gray-200 shadow-sm space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Author Information
              </label>

              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 border-2 border-dashed hover:border-[#213a59] border-gray-200 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer group">
                  {authorPreview ? (
                    <img
                      src={authorPreview}
                      className="h-full w-full object-cover "
                      alt="Author"
                    />
                  ) : (
                    <User className="text-gray-300" size={20} />
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, author_photo: file });
                        setAuthorPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) =>
                      setFormData({ ...formData, author_name: e.target.value })
                    }
                    className="w-full p-2 border-b border-gray-200 text-xs outline-none focus:border-[#213a59]"
                    placeholder="Author Full Name"
                  />
                </div>
              </div>

              <textarea
                rows={3}
                value={formData.author_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author_description: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-100 rounded text-xs outline-none bg-gray-50 focus:bg-white focus:border-[#213a59] transition-all"
                placeholder="Brief bio about the author..."
              ></textarea>
            </div>
          </div>
        </form>

        {/* Action Footer */}
        <div className="flex justify-end gap-3 px-6 py-2 border-t border-gray-300 bg-gray-50/80 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-red-500 text-[11px] border border-red-500 hover:bg-red-500 hover:text-white font-bold cursor-pointer uppercase transition-all"
          >
            Cancle
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#213a59] text-white px-6 py-1.5 rounded shadow-sm shadow-[#213a59]/20 font-bold text-[11px] uppercase flex items-center gap-2 cursor-pointer disabled:bg-gray-400 disabled:shadow-none transition-all active:scale-95"
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
