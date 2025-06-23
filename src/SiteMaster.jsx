// src/components/SiteMaster.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Search, Coins } from "lucide-react";

// Configure Axios with base URL from environment variable
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000" });

const SiteMaster = () => {
  const [activeTab, setActiveTab] = useState("mail"); // 'mail', 'users', or 'feedbacks'

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 text-gray-800 rounded-lg shadow-lg mt-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('mail')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mail'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mail Sender
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'feedbacks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Feedbacks
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'mail' && <MailSender />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'feedbacks' && <FeedbacksSection />}
      </div>
    </div>
  );
};

const MailSender = () => {
  const [formData, setFormData] = useState({
    sender: "Cozy Minds Team",
    title: "",
    content: "",
    recipientType: "all",
    recipientId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      setIsLoading(false);
      return;
    }
    if (formData.recipientType === 'specific' && !formData.recipientId) {
      setError("Recipient User ID is required for specific user.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.post("/send-system-mail", formData);
      setSuccess(response.data.message);
      setFormData({
        sender: "Cozy Minds Team",
        title: "",
        content: "",
        recipientType: "all",
        recipientId: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Send System Mail</h2>
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}
      {success && <p className="text-green-500 bg-green-50 p-3 rounded mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <select id="recipientType" name="recipientType" value={formData.recipientType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Users</option>
            <option value="specific">Specific User</option>
          </select>
        </div>
        {formData.recipientType === 'specific' && (
          <div>
            <label htmlFor="recipientId" className="block text-sm font-medium text-gray-700 mb-1">Recipient User ID</label>
            <input type="text" id="recipientId" name="recipientId" value={formData.recipientId} onChange={handleChange} placeholder="Enter User ID" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        )}
        <div>
          <label htmlFor="sender" className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
          <input type="text" id="sender" name="sender" value={formData.sender} onChange={handleChange} placeholder="e.g., Cozy Minds Team" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Welcome to Your Journey" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="e.g., Dear Traveler..." className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-y" required></textarea>
        </div>
        <button type="submit" disabled={isLoading} className={`w-full p-3 rounded-md text-white font-semibold transition ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
          {isLoading ? "Sending..." : "Send Mail"}
        </button>
      </form>
    </div>
  );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isGranting, setIsGranting] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [grantAmount, setGrantAmount] = useState(100);
    const [grantMessage, setGrantMessage] = useState({ type: "", text: ""});

    const fetchUsers = useCallback(async (search = "") => {
        setIsLoading(true);
        setError("");
        try {
            const response = await API.get(`/users?search=${search}`);
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch users.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchTerm);
    };

    const handleGrantCoins = async () => {
        if (!selectedUser || grantAmount <= 0) return;
        setIsGranting(true);
        setGrantMessage({ type: "", text: "" });
        try {
            const response = await API.post('/users/grant-coins', { userId: selectedUser._id, amount: grantAmount });
            setGrantMessage({ type: 'success', text: response.data.message });
            // Update user in local state
            setUsers(users.map(u => u._id === selectedUser._id ? {...u, coins: response.data.user.coins } : u));
            setTimeout(() => {
                setSelectedUser(null);
                setGrantAmount(100);
                setGrantMessage({ type: "", text: "" });
            }, 2000);
        } catch (err) {
            setGrantMessage({ type: 'error', text: err.response?.data?.message || "Failed to grant coins." });
        } finally {
            setIsGranting(false);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by nickname or email..."
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 font-semibold">Search</button>
            </form>

            {isLoading && <p>Loading users...</p>}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded">{error}</p>}
            
            {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nickname</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coins</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nickname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.coins}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedUser(user)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                                            <Coins size={16} /> Grant Coins
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Grant Coins to {selectedUser.nickname}</h3>
                        {grantMessage.text && (
                            <p className={`${grantMessage.type === 'success' ? 'text-green-600' : 'text-red-600'} mb-4`}>{grantMessage.text}</p>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="grantAmount" className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    id="grantAmount"
                                    value={grantAmount}
                                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button onClick={() => setSelectedUser(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                                <button onClick={handleGrantCoins} disabled={isGranting} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                                    {isGranting ? "Granting..." : "Confirm Grant"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FeedbacksSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/feedbacks");
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        setError("Failed to fetch feedbacks.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Feedbacks</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && feedbacks.length === 0 && (
        <div className="text-gray-500">No feedbacks yet.</div>
      )}
      <ul className="divide-y divide-gray-200 mt-4">
        {feedbacks.slice().reverse().map((fb, idx) => (
          <li key={fb._id || idx} className="py-4">
            <div className="text-gray-800 mb-1">{fb.feedback}</div>
            <div className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SiteMaster;
