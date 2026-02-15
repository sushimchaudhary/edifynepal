import { Edit2, Trash2, Image as ImageIcon, Loader2, Info } from "lucide-react";

interface AboutTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function AboutTable({
  data,
  onEdit,
  onDelete,
  loading,
}: AboutTableProps) {
  return (
    <div className=" rounded shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#213a59]/90 text-white border-b border-gray-200">
            <tr>
              <th className="p-2 font-semibold uppercase text-[11px] tracking-wider w-16">
                S.N.
              </th>
              <th className="p-2 font-semibold uppercase text-[11px] tracking-wider w-24">
                Image
              </th>
              <th className="p-2 font-semibold uppercase text-[11px] tracking-wider">
                Description
              </th>
              <th className="p-2 font-semibold uppercase text-[11px] tracking-wider text-right w-28">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin text-[#1e695e]"
                      size={28}
                    />
                    <p className="text-xs font-medium text-gray-500 animate-pulse">
                      Fetching records...
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-all duration-200 group"
                >
                  <td className="px-4 py-2 text-gray-400 font-medium text-xs">
                    {String(index + 1)}
                  </td>

                  <td className="px-4 py-2">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shadow-sm group-hover:scale-105 transition-transform">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div
                      className="line-clamp-2 text-gray-600 text-xs leading-relaxed max-w-md group-hover:text-gray-900 transition-colors"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </td>

                  <td className="px-1 py-2 text-end">
                    <div className="flex justify-end items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all active:scale-90"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all active:scale-90"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Info size={24} />
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
    </div>
  );
}
