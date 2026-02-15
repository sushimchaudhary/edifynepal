import {
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

interface CategoryTableProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  loading,
}: CategoryTableProps) {
  return (
    <div className=" rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh] h-[65vh]">
      {/* Scrollable Container with Hidden Scrollbar */}
      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm min-w-[600px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 font-bold uppercase text-[10px] w-16 border-b border-gray-200">
                S.N.
              </th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200">
                Category Name
              </th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200">
                Slug
              </th>
              <th className="p-2 font-bold uppercase text-[10px] border-b border-gray-200 w-32">
                Status
              </th>
              <th className="p-2 font-bold uppercase text-[10px] text-end border-b border-gray-200 w-28">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-2 py-16 text-center ">
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                    <Loader2
                      className="animate-spin text-[#213a59]"
                      size={32}
                    />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Loading Categories...
                    </span>
                  </div>
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50/80 transition-colors text-xs text-gray-600"
                >
                  <td className="px-3 py-2 text-gray-500 border-b border-gray-50">
                    {index + 1}.
                  </td>
                  <td className="px-3 py-2 font-bold text-[#213a59] whitespace-nowrap border-b border-gray-50">
                    {cat.name}
                  </td>
                  <td className="px-2 py-2 text-gray-500 whitespace-nowrap border-b border-gray-50">
                    {cat.slug}
                  </td>
                  <td className="px py-2 border-b border-gray-50">
                    {cat.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        <CheckCircle2 size={10} /> ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 text-[10px] font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        <XCircle size={12} /> INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="px-1 py-2 text-end border-b border-gray-50">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(cat.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-0">
                 
                  <div className="flex flex-col items-center justify-center min-h-[350px] text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Tag size={24} />
                    </div>
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1">
                      Try adding some data
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
