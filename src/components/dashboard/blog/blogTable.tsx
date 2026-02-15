import {
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Eye,
  User,
  Layers,
  Calendar,
  Link,
  Newspaper,
} from "lucide-react";

interface BlogTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function BlogTable({
  data,
  onEdit,
  onDelete,
  loading,
}: BlogTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:h-[70vh]  h-[65vh]">
      <div className="overflow-auto scrollbar-hide flex-grow relative">
        <table className="w-full text-left text-sm table-fixed min-w-[1000px] border-separate border-spacing-0">
          <thead className="bg-[#213a59]/90 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 font-bold  uppercase text-[10px] w-12 border-b border-gray-200">
                S.N.
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] w-20 border-b border-gray-200">
                Image
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] w-50 border-b border-gray-200">
                Title & Slug
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] w-50 border-b border-gray-200">
                Category & Author
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] w-32 border-b border-gray-200">
                Date
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] w-24 text-center border-b border-gray-200">
                Stats
              </th>
              <th className="p-2 font-bold  uppercase text-[10px] text-end w-28 border-b border-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-2 py-12 text-center">
                 <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
                    <Loader2
                      className="animate-spin text-[#213a59]"
                      size={32}
                    />
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Loading Blog...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors text-xs text-gray-600"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">
                    <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden shadow-sm">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          className="h-full w-full object-cover"
                          alt="post"
                        />
                      ) : (
                        <ImageIcon
                          size={16}
                          className="m-auto mt-2 text-gray-300"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-bold text-gray-800 line-clamp-1">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-[#33b9d2] mt-1 lowercase font-medium">
                      <Link size={10} /> {item.slug}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 text-gray-700 font-medium">
                      <Layers size={10} className="text-[#213a59]" />{" "}
                      {item.category_name || "Uncategorized"}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase">
                      <User size={10} /> {item.author_name}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(item.created_at)}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center justify-center gap-1 bg-[#33b9d2]/10 px-2 py-1 rounded text-[#213a59] font-bold">
                      <Eye size={12} /> {item.view_count || 0}
                    </span>
                  </td>
                  <td className="px-1 py-2 text-end">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-0">
                 <div className="flex flex-col items-center justify-center min-h-[350px] text-gray-400">
                    <div className="p-3 bg-gray-50 rounded-full mb-2">
                      <Newspaper size={24} />
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
