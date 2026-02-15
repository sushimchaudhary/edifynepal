import {
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Loader2,
  
  Building2,
} from "lucide-react";

interface CompanyTableProps {
  companies: any[];
  onEdit: (company: any) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function CompanyTable({
  companies,
  onEdit,
  onDelete,
  loading,
}: CompanyTableProps) {
  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
      {/* Scrollbar Hide गर्ने Style */}
      <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
      
      <div
        className="overflow-x-auto overflow-y-auto max-h-[500px] hide-scroll"
        style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <table className="w-full text-left text-sm min-w-[600px] border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#213a59]/90 text-white">
              <th className="px-2 py-2 font-bold uppercase text-[10px] ">
                Logo & Name
              </th>
              <th className="px-2 py-2 font-bold uppercase text-[10px] ">
                Contact Info
              </th>
              <th className="px-2 py-2 font-bold uppercase text-[10px] ">
                Office Addres
              </th>
              <th className="px-2 py-2 font-bold uppercase text-[10px]  ">
                Map
              </th>
              <th className="px-2 py-2 font-bold uppercase text-[10px] ">
                Social
              </th>
              <th className="px-2 py-2 font-bold uppercase text-[10px] text-end ">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-2 py-10 text-center ">
                  <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-[#2db7d1]" size={30} />
                  <span className="text-[10px] font-bold  tracking-widest text-gray-400">
                    Loading data...
                  </span>
                </div>
                </td>
              </tr>
            ) : companies && companies.length > 0 ? (
              companies.map((company: any) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-1 ">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo || "https://via.placeholder.com/40"}
                        className="w-10 h-10 rounded object-cover border border-gray-100 shadow-sm"
                        alt="logo"
                      />
                      <span className="font-bold text-gray-800 whitespace-nowrap">{company.name}</span>
                    </div>
                  </td>
                  <td className="p-1 ">
                    <div className="flex flex-col gap-1 text-[11px] text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1 font-medium">
                        <Mail size={12} className="text-[#2db7d1]" /> {company.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-[#2db7d1]" /> {company.contact_no}
                      </span>
                    </div>
                  </td>
                  <td className="p-1 max-w-[200px] ">
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {company.address || "No address set"}
                    </p>
                  </td>
                  <td className="p-1 text-center ">
                    {company.google_map ? (
                      <a
                        href={company.google_map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1 bg-teal-50 text-[#2db7d1] rounded-full hover:bg-teal-100 transition-colors"
                      >
                        <MapPin size={16} />
                      </a>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-1 ">
                    <div className="flex gap-2.5 text-gray-400">
                      {company.fb_link && (
                        <a href={company.fb_link} target="_blank" className="hover:text-blue-600 transition-colors">
                          <Facebook size={15} />
                        </a>
                      )}
                      {company.insta_link && (
                        <a href={company.insta_link} target="_blank" className="hover:text-pink-600 transition-colors">
                          <Instagram size={15} />
                        </a>
                      )}
                      {company.linkedin_link && (
                        <a href={company.linkedin_link} target="_blank" className="hover:text-blue-700 transition-colors">
                          <Linkedin size={15} />
                        </a>
                      )}
                      {company.x_link && (
                        <a href={company.x_link} target="_blank" className="hover:text-black transition-colors">
                          <Twitter size={15} />
                        </a>
                      )}
                      {!company.fb_link && !company.insta_link && !company.linkedin_link && !company.x_link && (
                        <span className="text-[10px] italic">No links</span>
                      )}
                    </div>
                  </td>
                  <td className="p-1 text-end ">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onEdit(company)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(company.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Building2 size={24} />
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