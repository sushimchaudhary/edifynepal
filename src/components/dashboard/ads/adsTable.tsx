import { Edit2, Trash2, Loader2, Calendar,  Megaphone } from "lucide-react";

interface AdTableProps {
  ads: any[];
  onEdit: (ad: any) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function AdTable({
  ads,
  onEdit,
  onDelete,
  loading,
}: AdTableProps) {
  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh] h-[65vh]">
      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm min-w-[850px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200  w-24">
                Preview
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200 ">
                Ad Name
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200  w-40">
                Position
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200  w-44">
                Duration
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200  w-28 text-center">
                Status
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] text-end border-b border-gray-200  w-28">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                    <Loader2
                      className="animate-spin text-[#213a59]"
                      size={32}
                    />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Loading Advertisement...
                    </span>
                  </div>
                </td>
              </tr>
            ) : ads.length > 0 ? (
              ads.map((ad: any) => (
                <tr
                  key={ad.id}
                  className="hover:bg-gray-50/80 transition-colors text-xs "
                >
                  <td className="p-2 border-b border-gray-50">
                    <div className="h-10 w-20  rounded overflow-hidden shadow-sm ring-1 ring-gray-200">
                      {ad.file ? (
                        <img
                          src={ad.file}
                          className="h-full w-full object-cover"
                          alt="ad"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[9px] text-gray-400">
                          No Preview
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 font-bold text-[#213a59] border-b border-gray-50">
                    {ad.name}
                  </td>
                  <td className="p-2 border-b border-gray-50">
                    <span className="bg-[#33b9d2]/10 text-[#213a59] px-2.5 py-1 rounded text-[10px] font-bold uppercase border border-[#33b9d2]/20">
                      {ad.position}
                    </span>
                  </td>
                  <td className="p-2 border-b border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-green-600 font-medium">
                        <Calendar size={11} /> {ad.start_date}
                      </span>
                      <span className="flex items-center gap-1.5 text-red-400 font-medium">
                        <Calendar size={11} /> {ad.end_date}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 border-b border-gray-50 text-center">
                    {ad.is_active ? (
                      <span className="inline-block text-green-600 text-[10px] font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-block text-red-400 text-[10px] font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="p-1 text-end border-b border-gray-50">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(ad)}
                        className="px-1 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Ad"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(ad.id)}
                        className="px-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Ad"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-0">
                  <div className="flex flex-col items-center justify-center min-h-[350px] text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Megaphone size={24} />
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
