import  { useState } from "react";
import { Trash2, Loader2, Mail, User, Calendar, X, MessageSquare, Contact  } from "lucide-react";

interface ContactMessageTableProps {
  messages: any[];
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function ContactMessageTable({
  messages,
  onDelete,
  loading,
}: ContactMessageTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh] h-[65vh]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm min-w-[900px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr className="">
              <th className="p-2 font-bold  uppercase text-[10px]  border-b border-gray-200 w-16">S.N.</th>
              <th className="p-2 font-bold  uppercase text-[10px]  border-b border-gray-200">Full Name</th>
              <th className="p-2 font-bold  uppercase text-[10px]  border-b border-gray-200">Email</th>
              <th className="p-2 font-bold  uppercase text-[10px]  border-b border-gray-200 w-1/3">Message (Click to read)</th>
              <th className="p-2 font-bold  uppercase text-[10px]  border-b border-gray-200 w-32">Date</th>
              <th className="p-2 font-bold  uppercase text-[10px] text-end  border-b border-gray-200 w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-2 py-16 text-center">
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                    <Loader2
                      className="animate-spin text-[#213a59]"
                      size={32}
                    />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Loading Message...
                    </span>
                  </div>
                </td>
              </tr>
            ) : messages.length > 0 ? (
              [...messages].reverse().map((msg, index) => (
                <tr key={msg.id} className="hover:bg-gray-50/80 transition-colors text-xs ">
                  <td className="p-2 text-gray-500 border-b border-gray-50">{index + 1}.</td>
                  <td className="p-2 font-bold text-[#213a59] whitespace-nowrap border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-[#33b9d2]" />
                      {msg.fullname}
                    </div>
                  </td>
                  <td className="p-2 text-gray-500 whitespace-nowrap border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-gray-400" />
                      {msg.email}
                    </div>
                  </td>
                  <td 
                    className="p-2  border-b border-gray-50 cursor-pointer group"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <p className="line-clamp-1 text-[11px] leading-relaxed italic group-hover:text-[#33b9d2] transition-colors">
                      {msg.message}
                    </p>
                  </td>
                  <td className="p-2 text-gray-500 text-[10px] whitespace-nowrap border-b border-gray-50 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="p-1 text-end border-b border-gray-50">
                    <button 
                      onClick={() => onDelete(msg.id)} 
                        className="px-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                  <td colSpan={6} className="p-0">
                 
                  <div className="flex flex-col items-center justify-center min-h-[350px] text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Contact size={24} />
                    </div>
                    <p className="text-sm font-medium">No records found</p>
                    
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- View Message Modal --- */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#213a59]/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-[#213a59] flex items-center gap-2">
                <MessageSquare size={18} className="text-[#33b9d2]" /> Message Details
              </h3>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-500 pb-3 border-b border-dashed">
                <div>
                  <span className="block font-bold text-gray-400 uppercase tracking-tighter">From</span>
                  <span className="text-[#213a59] font-medium">{selectedMessage.fullname}</span>
                </div>
                <div>
                  <span className="block font-bold text-gray-400 uppercase tracking-tighter">Date & Time</span>
                  <span className="text-[#213a59] font-medium">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#33b9d2] uppercase tracking-widest">Content:</span>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-[250px] overflow-y-auto scrollbar-hide">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-2 bg-[#213a59] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#1a2e47] transition-all shadow-md shadow-blue-900/10"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}