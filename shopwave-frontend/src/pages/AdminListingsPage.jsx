import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllListingsAdmin, updateListingStatus, deleteListing } from "../store/slices/listingsSlice";
import { Spinner } from "../components/common";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  sold: "bg-gray-100 text-gray-600",
};

export default function AdminListingsPage() {
  const dispatch = useDispatch();
  const { adminListings, totalCommission, loading } = useSelector((s) => s.listings);
  const [filter, setFilter] = useState("pending");
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    dispatch(fetchAllListingsAdmin(filter !== "all" ? { status: filter } : {}));
  }, [dispatch, filter]);

  const handleApprove = async (id) => {
    const result = await dispatch(updateListingStatus({ id, status: "approved" }));
    if (!result.error) toast.success("Listing approved! It's now live.");
    else toast.error(result.payload);
  };

  const handleReject = async (id) => {
    const result = await dispatch(updateListingStatus({ id, status: "rejected", adminNote: note }));
    if (!result.error) { toast.success("Listing rejected."); setNoteModal(null); setNote(""); }
    else toast.error(result.payload);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    await dispatch(deleteListing(id));
    toast.success("Deleted!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin: C2C Listings</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Commission", value: `₹${totalCommission?.toLocaleString() || 0}`, color: "bg-green-50 text-green-700" },
          { label: "Pending Review", value: adminListings.filter(l => l.status === "pending").length, color: "bg-yellow-50 text-yellow-700" },
          { label: "Live Listings", value: adminListings.filter(l => l.status === "approved").length, color: "bg-blue-50 text-blue-700" },
          { label: "Total Listings", value: adminListings.length, color: "bg-gray-50 text-gray-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs mt-1 opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {f === "all" ? "All Listings" : f}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {adminListings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No listings found</div>
          ) : adminListings.map((listing) => (
            <div key={listing._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {listing.image ? (
                    <img src={listing.image} alt={listing.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://placehold.co/80x80/e2e8f0/64748b?text=${listing.category[0]}`; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📦</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">by {listing.seller?.name} ({listing.seller?.email})</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[listing.status]}`}>
                      {listing.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <span className="font-bold">₹{listing.price.toLocaleString()}</span>
                    <span className="text-gray-500">{listing.category}</span>
                    <span className="text-gray-500">{listing.condition}</span>
                    <span className="text-green-600 font-medium">Commission: ₹{listing.platformCommission?.toLocaleString()}</span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{listing.description}</p>

                  {listing.adminNote && (
                    <p className="text-xs text-red-500 mt-1">Rejection note: {listing.adminNote}</p>
                  )}

                  {/* Actions */}
                  {listing.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleApprove(listing._id)}
                        className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                        ✓ Approve
                      </button>
                      <button onClick={() => setNoteModal(listing._id)}
                        className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100">
                        ✕ Reject
                      </button>
                    </div>
                  )}
                  {listing.status !== "pending" && (
                    <button onClick={() => handleDelete(listing._id)}
                      className="mt-3 px-4 py-1.5 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-sm hover:bg-gray-100">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold mb-3">Reject Listing</h3>
            <p className="text-sm text-gray-500 mb-3">Add a reason (optional — seller will see this)</p>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Image missing, description incomplete..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => handleReject(noteModal)}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
                Confirm Reject
              </button>
              <button onClick={() => { setNoteModal(null); setNote(""); }}
                className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
