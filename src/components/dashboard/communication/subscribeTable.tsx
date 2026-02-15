
import { Trash2, Loader2, Mail, Calendar, Bell } from "lucide-react";

interface SubscriberTableProps {
  subscribers: any[];
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function SubscriberTable({
  subscribers,
  onDelete,
  loading,
}: SubscriberTableProps) {


  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh] h-[65vh]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm min-w-[600px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200 w-16">
                S.N.
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200">
                Email Address
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] border-b border-gray-200 text-center w-40">
                Subscribed Date
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] text-end border-b border-gray-200 w-24">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-2 py-16 text-center">
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                    <Loader2
                      className="animate-spin text-[#213a59]"
                      size={32}
                    />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Loading Subscribe...
                    </span>
                  </div>
                </td>
              </tr>
            ) : subscribers.length > 0 ? (
              [...subscribers].reverse().map((sub, index) => (
                <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors text-xs ">
                  <td className="p-2 text-gray-500 border-b border-gray-50">
                    {index + 1}.
                  </td>
                  <td className="p-2 font-bold text-[#213a59] border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#33b9d2]" />
                      {sub.email}
                    </div>
                  </td>
                  <td className="p-2 text-gray-500 text-[11px] text-center border-b border-gray-50 font-medium">
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar size={12} className="text-gray-400" />
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="p-1 text-end border-b border-gray-50">
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="px-1 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Remove Subscriber"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                  <td colSpan={5} className="p-0">
                 
                  <div className="flex flex-col items-center justify-center min-h-[350px] text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Bell size={24} />
                    </div>
                    <p className="text-sm font-medium">No records found</p>
                    
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