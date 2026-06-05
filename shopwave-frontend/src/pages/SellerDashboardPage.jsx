import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyListings, deleteListing } from "../store/slices/listingsSlice";
import { Spinner, EmptyState } from "../components/common";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  sold: "bg-gray-100 text-gray-600",
};

const CONDITION_STYLES = {
  "Like New": "bg-green-50 text-green-700",
  "Good": "bg-blue-50 text-blue-700",
  "Fair": "bg-orange-50 text-orange-700",
};

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const { myListings, loading } = useSelector((s) => s.listings);

  useEffect(() => { dispatch(fetchMyListings()); }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing?")) return;
    const result = await dispatch(deleteListing(id));
    if (!result.error) toast.success("Listing removed");
    else toast.error(result.payload);
  };

  const stats = {
    total: myListings.length,
    pending: myListings.filter((l) => l.status === "pending").length,
    approved: myListings.filter((l) => l.status === "approved").length,
    sold: myListings.filter((l) => l.status === "sold").length,
    earnings: myListings.filter((l) => l.status === "sold").reduce((a, l) => a + l.sellerEarnings, 0),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Seller Dashboard</h1>
        <Link to="/sell" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          + List New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Total Listings", value: stats.total, color: "bg-gray-50 text-gray-800" },
          { label: "Pending Review", value: stats.pending, color: "bg-yellow-50 text-yellow-800" },
          { label: "Live", value: stats.approved, color: "bg-green-50 text-green-800" },
          { label: "Sold", value: stats.sold, color: "bg-blue-50 text-blue-800" },
          { label: "Total Earned", value: `₹${stats.earnings.toLocaleString()}`, color: "bg-purple-50 text-purple-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs mt-0.5 opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : myListings.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No listings yet"
          message="Start selling your unused items and earn money"
          action={<Link to="/sell" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">List Your First Product</Link>}
        />
      ) : (
        <div className="space-y-3">
          {myListings.map((listing) => (
            <div key={listing._id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
              {/* Image */}
              <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {listing.image ? (
                  <img src={listing.image} alt={listing.name} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://placehold.co/80x80/e2e8f0/64748b?text=${listing.category[0]}`; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">📦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{listing.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[listing.status]}`}>
                      {listing.status === "approved" ? "✓ Live" : listing.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_STYLES[listing.condition]}`}>{listing.condition}</span>
                  <span className="text-xs text-gray-400">{listing.category}</span>
                </div>

                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex gap-4 text-sm">
                    <span className="font-bold text-gray-900">₹{listing.price.toLocaleString()}</span>
                    <span className="text-green-600 text-xs font-medium">You earn: ₹{listing.sellerEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {listing.status === "rejected" && listing.adminNote && (
                      <span className="text-xs text-red-500">Reason: {listing.adminNote}</span>
                    )}
                    {listing.status !== "sold" && (
                      <button onClick={() => handleDelete(listing._id)}
                        className="text-xs px-3 py-1.5 text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
