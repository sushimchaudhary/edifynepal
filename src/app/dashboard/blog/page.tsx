"use client"
import { useState, useEffect } from "react";
import { FileText, Plus } from "lucide-react";
import { contentService } from "../../../services/contentServices";
import { showError, showSuccess } from "../../../utils/toastUtils";
import BlogTable from "../../../components/dashboard/blog/blogTable";
import BlogForm from "../../../components/dashboard/blog/blogForm";
import ConfirmModal from "../../../components/delete/ConfirmModel";

export default function BlogManage() {
  const [postData, setPostData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

const fetchPosts = async () => {
  setLoading(true);
  try {
    const response = await contentService.getPosts();

    const data = response?.data?.data || response?.data || response;
    
    if (Array.isArray(data)) {
     setPostData([...data].reverse()); 
    } else {
      setPostData([]);
    }
  } catch (err) {
    showError("Failed to load posts.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setDeleteLoading(true);
    try {
      await contentService.deletePost(deleteId);
      showSuccess("Post deleted successfully!");
      fetchPosts();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete the post.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

const handleEdit = (item: any) => {
  setSelectedItem(item); 
  setIsModalOpen(true);  
};

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-[#2db7d1]" size={24} />
            Post Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
             manage your articles or news posts.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="bg-[#213a59] text-white px-2.5  py-1 cursor-pointer rounded text-xs font-bold  flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={14} /> Create
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <BlogTable
          data={postData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      </div>

      {/* Post Form Modal */}
      <BlogForm
        key={selectedItem?.id || "new"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        refreshData={fetchPosts}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This will remove all associated content and images permanently."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}
