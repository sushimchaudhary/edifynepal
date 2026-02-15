"use client"
import { useState, useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import { companyService } from "../../../services/companyServices";
import { showError, showSuccess } from "../../../utils/toastUtils";
import CompanyTable from "../../../components/dashboard/company/companyTable";
import CompanyForm from "../../../components/dashboard/company/companyForm";
import ConfirmModal from "../../../components/delete/ConfirmModel"; 

export default function CompanyPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getDetails();
      const data = response?.data?.data || response?.data || response;
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      showError("Failed to fetch company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setDeleteLoading(true);
    try {
      await companyService.deleteDetails(deleteId);
      showSuccess("Company profile deleted successfully!");
      fetchCompanies();
      setIsConfirmOpen(false);
    } catch (err) {
      showError("Failed to delete company.");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50/50 min-h-[80vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-[#2db7d1]" size={24} />
            Company Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your business profile and social presence.
          </p>
        </div>

        <div className="flex gap-2">
          {companies.length === 0 && (
            <button
              onClick={handleAddNew}
              className="bg-[#213a59]  text-white px-2.5  py-1 cursor-pointer rounded text-xs font-bold  flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus size={14} /> Create
            </button>
          )}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <CompanyTable
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDeleteClick} // यहाँ नयाँ फङ्सन
          loading={loading} 
        />
      </div>

      {/* Form Modal */}
      <CompanyForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        data={selectedCompany}
        refreshData={fetchCompanies}
        existingCount={companies.length} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Company Profile"
        message="Are you sure you want to delete this company profile? This will remove all contact details and social links."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
}