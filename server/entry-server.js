import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { createContext, useState, useEffect, useContext, useCallback, Component, useRef, useMemo, Suspense, StrictMode } from "react";
import { prerender as prerender$1 } from "react-dom/static";
import { StaticRouter } from "react-router";
import { useLocation, Navigate, Link, useNavigate, Routes, Route } from "react-router-dom";
import { getFirestore, doc, setDoc, serverTimestamp, getDoc, getDocs, collection, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit, onSnapshot, increment } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import toast$1, { toast, Toaster } from "react-hot-toast";
import { Home, Table, PieChart as PieChart$1, Bell, Users, Settings, DollarSign, TrendingUp, PiggyBank, User, Shield, LogOut, X, CreditCard, Save, CheckCircle, AlertCircle, TestTube, Database, Wallet, RefreshCw, EyeOff, Eye, Loader2, LogIn, Sun, Moon, MessageSquare, Send, BookOpen, Sprout, CloudRain, ShieldCheck, Megaphone, Wifi, HeartPulse, Monitor, Landmark, MapPin, Globe, MessageCircle, Hash, Copy, Download, ArrowUpRight, ArrowDownRight, MoreVertical, UserPlus, Receipt, Plus, Calendar, Phone, Crown, Info, Lock, Check, Search, BarChart3, Edit, Trash2, Clock, Percent, Camera, Upload, Banknote, SortDesc, SortAsc, TrendingDown, Calculator, ArrowLeft, ChevronRight, FileText, Award, Mail, Star, Heart, Target, AlertTriangle, Pin, Paperclip, Edit3, ArrowRight } from "lucide-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import Lottie from "lottie-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LineChart, Line, PieChart as PieChart$2, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import Cropper from "react-easy-crop";
import { createClient } from "@supabase/supabase-js";
const firebaseConfig = {
  apiKey: "AIzaSyArIOctKU4qYDn9y9aUJch9WwypLptl7Iw",
  authDomain: "somiti-13503.firebaseapp.com",
  projectId: "somiti-13503",
  storageBucket: "somiti-13503.firebasestorage.app",
  messagingSenderId: "326795595039",
  appId: "1:326795595039:web:07796c5cf151862b4af42a",
  measurementId: "G-B556H1L5XS"
};
const app = initializeApp(firebaseConfig);
getAuth(app);
const db = getFirestore(app);
getStorage(app);
if (typeof window !== "undefined") {
  getAnalytics(app);
}
const MEMBERS_COLLECTION = "members";
class MemberService {
  // Add new member
  static async addMember(memberData, userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required to add a member.");
      }
      const memberRef = doc(db, MEMBERS_COLLECTION, userId);
      await setDoc(memberRef, {
        ...memberData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active"
      });
      console.log("Document added successfully with ID:", userId);
      return { success: true, id: userId };
    } catch (error) {
      console.error("সদস্য যোগ করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get member by ID
  static async getMemberById(userId) {
    try {
      const memberRef = doc(db, MEMBERS_COLLECTION, userId);
      const docSnap = await getDoc(memberRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "Member not found" };
      }
    } catch (error) {
      console.error("Error getting member by ID:", error);
      return { success: false, error: error.message };
    }
  }
  // Get all members
  static async getAllMembers() {
    try {
      const querySnapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
      const members = [];
      querySnapshot.forEach((doc2) => {
        members.push({ id: doc2.id, ...doc2.data() });
      });
      members.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
        return dateB - dateA;
      });
      return { success: true, data: members };
    } catch (error) {
      console.error("সদস্য তালিকা লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get active members
  static async getActiveMembers() {
    try {
      const q = query(
        collection(db, MEMBERS_COLLECTION),
        where("status", "==", "active")
      );
      const querySnapshot = await getDocs(q);
      const members = [];
      querySnapshot.forEach((doc2) => {
        members.push({ id: doc2.id, ...doc2.data() });
      });
      members.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
        return dateB - dateA;
      });
      return { success: true, data: members };
    } catch (error) {
      console.error("সক্রিয় সদস্য তালিকা আনতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Update member
  static async updateMember(memberId, updateData) {
    try {
      const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(memberRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("সদস্য আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Delete member
  static async deleteMember(memberId) {
    try {
      await deleteDoc(doc(db, MEMBERS_COLLECTION, memberId));
      return { success: true };
    } catch (error) {
      console.error("সদস্য মুছতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Toggle member status
  static async toggleMemberStatus(memberId, currentStatus) {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(memberRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      return { success: true, newStatus };
    } catch (error) {
      console.error("সদস্যের অবস্থা পরিবর্তন করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get member by Firebase Auth UID
  static async getMemberByAuthUid(authUid) {
    try {
      const q = query(
        collection(db, MEMBERS_COLLECTION),
        where("authUid", "==", authUid)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return { success: false, error: "Member not found" };
      }
      const doc2 = querySnapshot.docs[0];
      return { success: true, data: { id: doc2.id, ...doc2.data() } };
    } catch (error) {
      console.error("Auth UID দিয়ে সদস্য খুঁজতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Search members
  static async searchMembers(searchTerm) {
    try {
      const querySnapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
      const members = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        if (data.name?.toLowerCase().includes(searchTerm.toLowerCase()) || data.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) || data.phone?.includes(searchTerm)) {
          members.push({ id: doc2.id, ...data });
        }
      });
      return { success: true, data: members };
    } catch (error) {
      console.error("সদস্য খুঁজতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  static async isDuplicateMember({ phone, email, name }) {
    try {
      console.log("MemberService: isDuplicateMember input", { phone, email, name });
      if (email) {
        const qEmail = query(collection(db, MEMBERS_COLLECTION), where("email", "==", email));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          const doc2 = snapEmail.docs[0];
          console.log("MemberService: duplicate by email", { id: doc2.id });
          return { exists: true, by: "email", match: { id: doc2.id, ...doc2.data() } };
        }
      }
      if (phone) {
        const qPhone = query(collection(db, MEMBERS_COLLECTION), where("phone", "==", phone));
        const snapPhone = await getDocs(qPhone);
        if (!snapPhone.empty) {
          const doc2 = snapPhone.docs[0];
          console.log("MemberService: duplicate by phone", { id: doc2.id });
          return { exists: true, by: "phone", match: { id: doc2.id, ...doc2.data() } };
        }
      }
      if (name) {
        const allSnap = await getDocs(collection(db, MEMBERS_COLLECTION));
        const found = allSnap.docs.map((d) => ({ id: d.id, ...d.data() })).find((m) => (m.name || "").trim() === name.trim());
        if (found) {
          console.log("MemberService: duplicate by name", { id: found.id });
          return { exists: true, by: "name", match: found };
        }
      }
      console.log("MemberService: no duplicate found");
      return { exists: false };
    } catch (error) {
      console.error("MemberService: duplicate check error", error);
      return { exists: false, error: error.message };
    }
  }
}
const recordLogin = async (somitiUid, provider = "local") => {
  try {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let ip = "";
    let meta = {};
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const j = await res.json();
        ip = j?.ip || "";
        meta = { country: j?.country_name, city: j?.city };
      }
    } catch (_) {
    }
    const col = collection(db, "users", somitiUid, "login_history");
    await addDoc(col, {
      ip,
      user_agent: ua,
      provider,
      meta,
      created_at: serverTimestamp()
    });
    return { ok: true };
  } catch (e) {
    return { error: e };
  }
};
const fetchLoginHistory = async (somitiUid) => {
  try {
    const col = collection(db, "users", somitiUid, "login_history");
    const q = query(col, orderBy("created_at", "desc"), limit(50));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { data };
  } catch (e) {
    return { error: e };
  }
};
console.log("[AuthContext] File loaded");
const AuthContext = createContext();
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const autoLogin = async () => {
      console.log("[AuthContext] autoLogin start");
      const token = localStorage.getItem("somiti_token");
      const userId = localStorage.getItem("somiti_uid");
      const savedRole = localStorage.getItem("somiti_role");
      if (token && userId) {
        try {
          const currentMode = localStorage.getItem("somiti_mode");
          if (userId === "demo-user" && token === "demo-token") {
            if (currentMode !== "demo") {
              console.log("[AuthContext] Demo credentials found but mode is not demo. Blocking auto-login.");
              localStorage.removeItem("somiti_token");
              localStorage.removeItem("somiti_uid");
              localStorage.removeItem("somiti_role");
              setLoading(false);
              return;
            }
            setUser({
              uid: "demo-user",
              email: "demo@somiti.com",
              role: savedRole || "member",
              name: `ডেমো ${savedRole === "admin" ? "অ্যাডমিন" : savedRole === "cashier" ? "ক্যাশিয়ার" : "সদস্য"}`,
              isDebugUser: true,
              isDemoUser: true,
              membershipType: "ডেমো ব্যবহারকারী",
              joinDate: /* @__PURE__ */ new Date(),
              shareCount: 10,
              totalInvestment: 5e4
            });
            console.log("[AuthContext] Demo user restored from localStorage");
          } else if (userId === "debug-user" && token === "debug-token") {
            setUser({
              uid: "debug-user",
              email: "debug@somiti.com",
              role: savedRole || "member",
              name: `Debug ${(savedRole || "member").charAt(0).toUpperCase() + (savedRole || "member").slice(1)}`,
              isDebugUser: true,
              membershipType: "Debug User",
              joinDate: /* @__PURE__ */ new Date(),
              shareCount: 0,
              totalInvestment: 0
            });
            console.log("[AuthContext] Debug user restored from localStorage");
          } else {
            const memberResponse = await MemberService.getMemberById(userId);
            if (memberResponse.success) {
              const restoredUser = {
                ...memberResponse.data,
                // Ensure consistent shape across login and autoLogin
                id: userId,
                uid: userId,
                role: savedRole || memberResponse.data.role || "member"
              };
              setUser(restoredUser);
              console.log("[AuthContext] User restored on refresh:", restoredUser);
            } else {
              throw new Error("Failed to fetch member data");
            }
          }
        } catch (err) {
          console.error("[AuthContext] autoLogin error, performing logout:", err);
          logout();
        }
      } else {
        console.log("[AuthContext] No token found in localStorage");
      }
      setLoading(false);
      console.log("[AuthContext] autoLogin finished, loading set to false");
    };
    autoLogin();
  }, []);
  const login = async (token, userId) => {
    try {
      console.log("[AuthContext] login start for userId:", userId);
      const memberResponse = await MemberService.getMemberById(userId);
      if (memberResponse.success) {
        const userData = memberResponse.data;
        const userWithId = { ...userData, id: userId, uid: userId };
        setUser(userWithId);
        localStorage.setItem("somiti_token", token);
        localStorage.setItem("somiti_uid", userId);
        localStorage.setItem("somiti_role", userData.role || "member");
        console.log("[AuthContext] login success, user set:", userWithId);
        try {
          await recordLogin(userId, "local");
        } catch (e) {
          console.log("[AuthContext] login-history invocation failed");
        }
        return { user: userWithId };
      } else {
        throw new Error("User data not found in Firestore");
      }
    } catch (error2) {
      console.error("Login failed:", error2);
      setError(error2.message);
      return { error: error2 };
    }
  };
  const logout = () => {
    console.log("[AuthContext] logout called");
    setUser(null);
    localStorage.removeItem("somiti_token");
    localStorage.removeItem("somiti_uid");
    localStorage.removeItem("somiti_role");
  };
  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("somiti_role", newRole);
      console.log("[AuthContext] switchRole ->", newRole);
      const roleRoutes = {
        admin: "/admin",
        cashier: "/cashier",
        member: "/member"
      };
      if (typeof window !== "undefined") {
        window.location.hash = `#${roleRoutes[newRole] || "/member"}`;
      }
    }
  };
  const isAuthenticated = () => !!user;
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    switchRole,
    isAuthenticated,
    setError
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};
const UserContext = createContext();
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  useEffect(() => {
    if (authUser) {
      const resolvedId = authUser.uid || authUser.id;
      console.log("[UserContext] Resolved selectedUserId from authUser:", resolvedId);
      if (resolvedId) {
        setSelectedUserId(resolvedId);
      }
    }
  }, [authUser]);
  const loadCurrentUser = useCallback(async () => {
    if (!selectedUserId) {
      console.log("[UserContext] loadCurrentUser skipped: no selectedUserId");
      return;
    }
    if (authUser?.isDemoUser || authUser?.isDebugUser || selectedUserId === "demo-user" || selectedUserId === "debug-user") {
      console.log("[UserContext] Skipping Firebase load for demo/debug user, using authUser directly");
      setCurrentUser(authUser);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log("[UserContext] Loading current user from members with id:", selectedUserId);
      const result = await MemberService.getAllMembers();
      if (result.success && result.data.length > 0) {
        let user = result.data.find(
          (member) => member.id === selectedUserId || member.membershipId === selectedUserId || member.memberId === selectedUserId || member.somiti_user_id === selectedUserId
        );
        if (!user) {
          user = result.data[0];
        }
        console.log("[UserContext] Loaded user.photoURL", user.photoURL);
        setCurrentUser({
          id: user.id || user.membershipId || "SM-001",
          uid: user.id || user.membershipId || "SM-001",
          name: user.name || "অজানা সদস্য",
          joinDate: user.joinDate || "২০২২-০১-১৫",
          phone: user.phone || "ফোন নম্বর নেই",
          address: user.address || "ঠিকানা নেই",
          membershipType: user.membershipType || "নিয়মিত সদস্য",
          status: user.status || "সক্রিয়",
          shareCount: user.shareCount || 0,
          totalShares: user.totalShares || 0,
          email: user.email || "",
          fatherName: user.fatherName || "",
          occupation: user.occupation || "",
          nid: user.nid || "",
          emergencyContact: user.emergencyContact || "",
          monthlyDeposit: user.monthlyDeposit || 0,
          totalDeposit: user.totalDeposit || 0,
          photoURL: user.photoURL || ""
        });
      } else {
        setError("কোনো সদস্যের তথ্য পাওয়া যায়নি");
      }
    } catch (err) {
      console.error("ব্যবহারকারীর তথ্য লোড করতে ত্রুটি:", err);
      setError("ব্যবহারকারীর তথ্য লোড করতে ত্রুটি হয়েছে");
    } finally {
      setLoading(false);
      console.log("[UserContext] loadCurrentUser finished, loading set to false");
    }
  }, [selectedUserId, authUser]);
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);
  const switchUser = (userId) => {
    setSelectedUserId(userId);
  };
  const refreshUser = () => {
    loadCurrentUser();
  };
  const value = {
    currentUser,
    loading,
    error,
    switchUser,
    refreshUser,
    selectedUserId
  };
  return /* @__PURE__ */ jsx(UserContext.Provider, { value, children });
};
console.log("[ModeContext] File loaded");
const ModeContext = createContext();
const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState("production");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedMode = localStorage.getItem("somiti_mode");
    if (savedMode === "demo" || savedMode === "production") {
      setMode(savedMode);
      console.log("[ModeContext] Mode restored from localStorage:", savedMode);
    }
    setLoading(false);
  }, []);
  const switchMode = (newMode) => {
    if (newMode === "demo" || newMode === "production") {
      setMode(newMode);
      localStorage.setItem("somiti_mode", newMode);
      console.log("[ModeContext] Mode switched to:", newMode);
    }
  };
  const isDemo = () => mode === "demo";
  const isProduction = () => mode === "production";
  const value = {
    mode,
    loading,
    switchMode,
    isDemo,
    isProduction
  };
  return /* @__PURE__ */ jsx(ModeContext.Provider, { value, children });
};
const LoadingAnimation = ({
  size = 150,
  className = "",
  style = {},
  centered = true
}) => {
  const baseStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: centered ? "100vh" : "auto",
    position: centered ? "fixed" : "relative",
    top: centered ? 0 : "auto",
    left: centered ? 0 : "auto",
    right: centered ? 0 : "auto",
    bottom: centered ? 0 : "auto",
    zIndex: centered ? 9999 : "auto",
    ...style
  };
  const containerStyle = centered ? {
    ...baseStyle,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)"
  } : {
    ...baseStyle,
    backgroundColor: "transparent",
    backdropFilter: "none",
    WebkitBackdropFilter: "none"
  };
  return /* @__PURE__ */ jsx("div", { style: containerStyle, className, children: /* @__PURE__ */ jsx(
    "lottie-player",
    {
      src: "/loading_animation.json",
      background: "transparent",
      speed: "1",
      style: { width: `${size}px`, height: `${size}px` },
      loop: true,
      autoplay: true
    }
  ) });
};
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log("[ProtectedRoute] evaluating", { loading, hasUser: !!user, role: user?.role, path: location.pathname });
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingAnimation, {});
  }
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  return children;
};
const BottomNavigation = ({ onOpenAddTransaction }) => {
  const location = useLocation();
  const { user } = useAuth();
  const getNavigationItems = () => {
    console.log("[BottomNavigation] building items for role", user?.role);
    const commonItems = [
      {
        name: "হোম",
        href: user?.role ? `/${user.role}` : "/",
        icon: Home,
        roles: ["admin", "cashier", "member"]
      }
    ];
    const roleSpecificItems = {
      admin: [
        { name: "কোষাগার", href: "/admin/treasury", icon: TrendingUp },
        { name: "সদস্য", href: "/admin/members", icon: Users },
        { name: "নোটিশ", href: "/admin/notice-board", icon: Bell },
        { name: "সেটিংস", href: "/admin/settings", icon: Settings }
      ],
      cashier: [
        { name: "লেনদেন", href: "/cashier/transactions", icon: DollarSign },
        { name: "টেবিল", href: "/cashier/unified-finance", icon: Table },
        { name: "সদস্য", href: "/cashier/members", icon: Users },
        { name: "সেটিংস", href: "/cashier/settings", icon: Settings }
      ],
      member: [
        { name: "টেবিল", href: "/member/table", icon: Table },
        { name: "আর্থিক", href: "/member/financial-summary", icon: PieChart$1 },
        { name: "নোটিশ", href: "/member/notice-board", icon: Bell },
        { name: "সদস্য", href: "/member/members", icon: Users },
        { name: "সেটিংস", href: "/member/settings", icon: Settings }
      ]
    };
    return [...commonItems, ...roleSpecificItems[user?.role] || roleSpecificItems.member];
  };
  const navigationItems = getNavigationItems();
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      className: "fixed bottom-0 left-0 right-0 bg-white z-30",
      style: {
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around h-16 px-1", children: navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isAddTransaction = item.href === "/add-transaction";
          if (isAddTransaction) {
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onOpenAddTransaction,
                className: "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 group",
                style: {
                  color: "#6b7280",
                  transform: "translateY(0)"
                },
                onTouchStart: (e) => {
                  const button = e.currentTarget;
                  const ripple = document.createElement("div");
                  const rect = button.getBoundingClientRect();
                  const size = Math.max(rect.width, rect.height);
                  const x = e.touches[0].clientX - rect.left - size / 2;
                  const y = e.touches[0].clientY - rect.top - size / 2;
                  ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.3s ease-out;
                    pointer-events: none;
                    z-index: 1;
                  `;
                  button.appendChild(ripple);
                  setTimeout(() => {
                    if (ripple.parentNode) {
                      ripple.parentNode.removeChild(ripple);
                    }
                  }, 300);
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group-hover:scale-105",
                      style: {
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.2)"
                      },
                      children: /* @__PURE__ */ jsx(
                        Icon,
                        {
                          size: 20,
                          className: "transition-all duration-200",
                          style: { strokeWidth: 2.5 }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-xs font-medium mt-1 transition-all duration-200 truncate max-w-full",
                      style: {
                        fontSize: "11px",
                        lineHeight: "1.2"
                      },
                      children: item.name
                    }
                  )
                ]
              },
              item.href
            );
          }
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: item.href,
              className: "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 group",
              style: {
                color: isActive ? "#3b82f6" : "#6b7280",
                transform: isActive ? "translateY(-1px)" : "translateY(0)"
              },
              onTouchStart: (e) => {
                const button = e.currentTarget;
                const ripple = document.createElement("div");
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;
                ripple.style.cssText = `
                  position: absolute;
                  width: ${size}px;
                  height: ${size}px;
                  left: ${x}px;
                  top: ${y}px;
                  background: rgba(59, 130, 246, 0.2);
                  border-radius: 50%;
                  transform: scale(0);
                  animation: ripple 0.3s ease-out;
                  pointer-events: none;
                  z-index: 1;
                `;
                button.appendChild(ripple);
                setTimeout(() => {
                  if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                  }
                }, 300);
              },
              children: [
                isActive && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute -top-0.5 w-8 h-1 rounded-full transition-all duration-200",
                    style: {
                      backgroundColor: "#3b82f6",
                      boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isActive ? "scale-110" : "scale-100"}`,
                    style: {
                      backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent"
                    },
                    children: /* @__PURE__ */ jsx(
                      Icon,
                      {
                        className: "w-5 h-5 transition-all duration-200",
                        strokeWidth: isActive ? 2.5 : 2
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-xs mt-1 font-medium transition-all duration-200 truncate max-w-full ${isActive ? "text-blue-600" : "text-gray-500"}`,
                    style: {
                      fontSize: "0.7rem",
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: "-0.01em"
                    },
                    children: item.name
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `absolute inset-0 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-50 opacity-0" : "bg-gray-50 opacity-0 group-hover:opacity-100"}`,
                    style: { zIndex: -1 }
                  }
                )
              ]
            },
            item.href
          );
        }) }),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        /* Android-style touch feedback */
        .group:active {
          transform: scale(0.95) !important;
        }
        
        /* Smooth transitions for better feel */
        .group {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      ` })
      ]
    }
  );
};
const Footer = () => {
  console.log("Footer rendered");
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };
  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };
  return /* @__PURE__ */ jsx("footer", { className: "footer", children: /* @__PURE__ */ jsx(
    "img",
    {
      src: "/footer_logo.svg",
      alt: "Footer Logo",
      className: "footer-logo",
      onContextMenu: handleContextMenu,
      onDragStart: handleDragStart,
      draggable: false
    }
  ) });
};
const useSidebarLogic = (userRole) => {
  const getNavigationItems = () => {
    const baseItems = [
      { name: "নোটিশ বোর্ড", href: "/notices", icon: Bell }
    ];
    switch (userRole) {
      case "admin":
        return [
          { name: "অ্যাডমিন ড্যাশবোর্ড", href: "/admin", icon: Home },
          { name: "শেয়ার ট্র্যাকিং", href: "/shares", icon: PiggyBank },
          { name: "বিনিয়োগ ব্যবস্থাপনা", href: "/investments", icon: TrendingUp },
          { name: "লাভ বণ্টন", href: "/profits", icon: DollarSign },
          ...baseItems,
          { name: "প্রোফাইল ও সেটিংস", href: "/admin/settings", icon: Settings }
        ];
      case "cashier":
        return [
          { name: "ক্যাশিয়ার ড্যাশবোর্ড", href: "/cashier", icon: Home },
          { name: "শেয়ার ট্র্যাকিং", href: "/shares", icon: PiggyBank },
          ...baseItems,
          { name: "প্রোফাইল ও সেটিংস", href: "/cashier/settings", icon: Settings }
        ];
      case "member":
        return [
          { name: "সদস্য ড্যাশবোর্ড", href: "/member", icon: Home },
          ...baseItems,
          { name: "প্রোফাইল ও সেটিংস", href: "/member/settings", icon: Settings }
        ];
      default:
        return baseItems;
    }
  };
  const navigationItems = getNavigationItems();
  const roleNames = {
    admin: "অ্যাডমিন",
    cashier: "ক্যাশিয়ার",
    member: "সদস্য"
  };
  return {
    navigationItems,
    roleNames
  };
};
function PrimarySearchAppBar({
  isMobile
}) {
  const { user, logout } = useAuth();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const location = useLocation();
  const { navigationItems } = useSidebarLogic(user?.role);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const currentRole = {
    admin: { label: "অ্যাডমিন", icon: Shield, color: "#dc2626" },
    cashier: { label: "ক্যাশিয়ার", icon: DollarSign, color: "#059669" },
    member: { label: "সদস্য", icon: User, color: "#2563eb" }
  }[user?.role] || { label: "সদস্য", icon: User, color: "#2563eb" };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    logout();
    handleMobileMenuClose();
  };
  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find((item) => item.href === location.pathname);
    return currentItem?.name || "ড্যাশবোর্ড";
  };
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = /* @__PURE__ */ jsxs(
    Menu,
    {
      anchorEl: mobileMoreAnchorEl,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right"
      },
      id: mobileMenuId,
      keepMounted: true,
      transformOrigin: {
        vertical: "top",
        horizontal: "right"
      },
      open: isMobileMenuOpen,
      onClose: handleMobileMenuClose,
      PaperProps: {
        elevation: 8,
        sx: {
          borderRadius: "16px",
          mt: 1,
          minWidth: 200,
          "& .MuiMenuItem-root": {
            borderRadius: "12px",
            mx: 1,
            my: 0.5
          }
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          MenuItem,
          {
            sx: {
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              py: 1.5,
              px: 2,
              cursor: "default",
              "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.08)"
              }
            },
            disabled: true,
            children: /* @__PURE__ */ jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2, width: "100%" }, children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: `${currentRole.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(
                    currentRole.icon,
                    {
                      size: 18,
                      style: { color: currentRole.color }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Typography,
                {
                  sx: {
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  },
                  children: currentRole.label
                }
              ),
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    ml: "auto",
                    width: 6,
                    height: 6,
                    backgroundColor: "#2563eb",
                    borderRadius: "50%"
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          MenuItem,
          {
            onClick: handleLogout,
            sx: {
              "&:hover": {
                backgroundColor: "rgba(220, 38, 38, 0.04)"
              },
              py: 1.5,
              px: 2,
              mt: 1,
              borderTop: "1px solid #e5e7eb"
            },
            children: /* @__PURE__ */ jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    p: 1,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(LogOut, { size: 18, style: { color: "#dc2626" } })
                }
              ),
              /* @__PURE__ */ jsx(Typography, { sx: { color: "#dc2626", fontWeight: 500, fontSize: "0.9rem" }, children: "লগ আউট" })
            ] })
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxs(Box, { sx: { flexGrow: 1 }, children: [
    /* @__PURE__ */ jsx(
      AppBar,
      {
        position: "static",
        elevation: 0,
        sx: {
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          margin: 0,
          padding: 0
        },
        children: /* @__PURE__ */ jsxs(Toolbar, { sx: {
          minHeight: { xs: 56, md: 64 },
          px: { xs: 2, md: 3 },
          gap: 1
        }, children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              size: isMobile ? "medium" : "large",
              edge: "start",
              color: "inherit",
              "aria-label": "লগ আউট",
              onClick: handleLogout,
              sx: {
                mr: 1,
                p: isMobile ? 1 : 1.5,
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(220, 38, 38, 0.04)"
                },
                "&:active": {
                  backgroundColor: "rgba(220, 38, 38, 0.08)",
                  transform: "scale(0.95)"
                },
                transition: "all 0.15s ease"
              },
              children: /* @__PURE__ */ jsx(LogOut, { size: isMobile ? 20 : 24, style: { color: "#dc2626" } })
            }
          ),
          /* @__PURE__ */ jsx(Box, { sx: { flexGrow: 1, minWidth: 0 }, children: /* @__PURE__ */ jsx(
            Typography,
            {
              variant: "h6",
              noWrap: true,
              component: "div",
              sx: {
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 500,
                color: "text.primary",
                letterSpacing: "-0.01em"
              },
              children: getCurrentPageTitle()
            }
          ) }),
          /* @__PURE__ */ jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5 }, children: [
            /* @__PURE__ */ jsx(
              IconButton,
              {
                size: isMobile ? "medium" : "large",
                "aria-label": "অনুসন্ধান",
                color: "inherit",
                sx: {
                  p: isMobile ? 1 : 1.5,
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)"
                  },
                  "&:active": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    transform: "scale(0.95)"
                  },
                  transition: "all 0.15s ease"
                },
                children: /* @__PURE__ */ jsx(SearchIcon, { sx: { fontSize: isMobile ? 20 : 24 } })
              }
            ),
            /* @__PURE__ */ jsx(
              IconButton,
              {
                size: isMobile ? "medium" : "large",
                "aria-label": "বিজ্ঞপ্তি",
                color: "inherit",
                sx: {
                  p: isMobile ? 1 : 1.5,
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)"
                  },
                  "&:active": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    transform: "scale(0.95)"
                  },
                  transition: "all 0.15s ease"
                },
                children: /* @__PURE__ */ jsx(
                  Badge,
                  {
                    badgeContent: 3,
                    color: "error",
                    sx: {
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        minWidth: 16,
                        height: 16
                      }
                    },
                    children: /* @__PURE__ */ jsx(NotificationsIcon, { sx: { fontSize: isMobile ? 20 : 24 } })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              IconButton,
              {
                size: isMobile ? "medium" : "large",
                "aria-label": "ভূমিকা নির্বাচন",
                "aria-controls": mobileMenuId,
                "aria-haspopup": "true",
                onClick: handleMobileMenuOpen,
                color: "inherit",
                sx: {
                  p: isMobile ? 1 : 1.5,
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)"
                  },
                  "&:active": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    transform: "scale(0.95)"
                  },
                  transition: "all 0.15s ease"
                },
                children: /* @__PURE__ */ jsx(MoreIcon, { sx: { fontSize: isMobile ? 20 : 24 } })
              }
            )
          ] })
        ] })
      }
    ),
    renderMobileMenu
  ] });
}
const TRANSACTIONS_COLLECTION = "transactions";
const FUND_COLLECTION = "fund_summary";
class TransactionService {
  // Add new transaction
  static async addTransaction(transactionData) {
    try {
      const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...transactionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("লেনদেন যোগ করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get recent transactions
  static async getRecentTransactions(limitCount = 10) {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc2) => {
        transactions.push({ id: doc2.id, ...doc2.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error("সাম্প্রতিক লেনদেন আনতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get transactions by member
  static async getTransactionsByUserId(userId) {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc2) => {
        transactions.push({ id: doc2.id, ...doc2.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error("সদস্যের লেনদেন আনতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get all transactions
  static async getAllTransactions() {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc2) => {
        transactions.push({ id: doc2.id, ...doc2.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error("সকল লেনদেন আনতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Update transaction status
  static async updateTransactionStatus(transactionId, status) {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
      await updateDoc(transactionRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("লেনদেনের অবস্থা আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
}
class FundService {
  // Get fund summary with real-time calculation from transactions
  static async getFundSummary() {
    try {
      const transactionsResult = await TransactionService.getAllTransactions();
      if (!transactionsResult.success) {
        throw new Error("Failed to fetch transactions");
      }
      const transactions = transactionsResult.data || [];
      const incomeTypes = ["monthly_deposit", "share_purchase", "loan_repayment", "penalty"];
      const expenseTypes = ["loan_disbursement", "profit_distribution"];
      const depositTransactions = transactions.filter((t) => incomeTypes.includes(t.transactionType));
      const withdrawalTransactions = transactions.filter((t) => expenseTypes.includes(t.transactionType));
      const totalDeposits = depositTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalWithdrawals = withdrawalTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalBalance = totalDeposits - totalWithdrawals;
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const monthlyDeposits = transactions.filter((t) => {
        if (t.transactionType === "monthly_deposit" && t.createdAt) {
          const transactionDate = new Date(t.createdAt.seconds * 1e3);
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        }
        return false;
      }).reduce((sum, t) => sum + (t.amount || 0), 0);
      const querySnapshot = await getDocs(collection(db, FUND_COLLECTION));
      let staticFundData = {};
      querySnapshot.forEach((doc2) => {
        staticFundData = { id: doc2.id, ...doc2.data() };
      });
      const fundData = {
        // Real-time calculated values
        totalBalance,
        totalAmount: totalBalance,
        // For AdminDashboard compatibility
        totalDeposits,
        totalWithdrawals,
        monthlyDeposits,
        availableCash: totalBalance - (staticFundData.investedAmount || 0),
        // Static values from database (or defaults)
        investedAmount: staticFundData.investedAmount || 0,
        monthlyProfit: staticFundData.monthlyProfit || 0,
        monthlyProfits: staticFundData.monthlyProfit || 0,
        // For AdminDashboard compatibility
        monthlyExpense: staticFundData.monthlyExpense || 0,
        netProfit: (staticFundData.monthlyProfit || 0) - (staticFundData.monthlyExpense || 0),
        profitMargin: staticFundData.profitMargin || 0,
        investmentReturn: staticFundData.investmentReturn || 0,
        // Arrays for charts and breakdowns
        cashFlow: staticFundData.cashFlow || [
          { month: "জানুয়ারি", income: 45600, expense: 23e3, profit: 22600 },
          { month: "ফেব্রুয়ারি", income: 48200, expense: 25e3, profit: 23200 },
          { month: "মার্চ", income: 52e3, expense: 28e3, profit: 24e3 },
          { month: "এপ্রিল", income: 49800, expense: 26500, profit: 23300 },
          { month: "মে", income: 51200, expense: 24800, profit: 26400 },
          { month: "জুন", income: 53600, expense: 27200, profit: 26400 }
        ],
        investmentBreakdown: staticFundData.investmentBreakdown || [
          { type: "ব্যাংক ডিপোজিট", amount: 3e5, percentage: 46.2, return: 4.5 },
          { type: "সরকারি বন্ড", amount: 2e5, percentage: 30.8, return: 3.8 },
          { type: "ব্যবসায়িক বিনিয়োগ", amount: 1e5, percentage: 15.4, return: 8.2 },
          { type: "রিয়েল এস্টেট", amount: 5e4, percentage: 7.7, return: 6.5 }
        ]
      };
      return { success: true, data: fundData };
    } catch (error) {
      console.error("তহবিলের সারসংক্ষেপ আনতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Update fund summary
  static async updateFundSummary(fundData) {
    try {
      const querySnapshot = await getDocs(collection(db, FUND_COLLECTION));
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...fundData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, FUND_COLLECTION), {
          ...fundData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      return { success: true };
    } catch (error) {
      console.error("তহবিলের সারসংক্ষেপ আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
}
const AddTransaction = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [transactionData, setTransactionData] = useState({
    memberId: "",
    memberName: "",
    transactionType: "monthly_deposit",
    amount: "",
    shareAmount: "",
    paymentMethod: "cash",
    paymentReference: "",
    description: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    month: (/* @__PURE__ */ new Date()).getMonth(),
    // Current month (0-11)
    notes: ""
  });
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const result = await MemberService.getActiveMembers();
        if (result.success) {
          const transformedMembers = result.data.map((member) => ({
            id: member.id,
            name: member.name,
            currentShares: member.shareCount || 0,
            membershipId: member.somiti_user_id
          }));
          setMembers(transformedMembers);
        } else {
          console.error("Failed to fetch members:", result.error);
          setMembers([]);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchMembers();
  }, []);
  const transactionTypes = [
    { value: "monthly_deposit", label: "মাসিক জমা" },
    { value: "share_purchase", label: "শেয়ার ক্রয়" },
    { value: "loan_disbursement", label: "ঋণ প্রদান" },
    { value: "loan_repayment", label: "ঋণ পরিশোধ" },
    { value: "profit_distribution", label: "লাভ বিতরণ" },
    { value: "penalty", label: "জরিমানা" },
    { value: "other", label: "অন্যান্য" }
  ];
  const months = [
    { value: 0, label: "জানুয়ারি" },
    { value: 1, label: "ফেব্রুয়ারি" },
    { value: 2, label: "মার্চ" },
    { value: 3, label: "এপ্রিল" },
    { value: 4, label: "মে" },
    { value: 5, label: "জুন" },
    { value: 6, label: "জুলাই" },
    { value: 7, label: "আগস্ট" },
    { value: 8, label: "সেপ্টেম্বর" },
    { value: 9, label: "অক্টোবর" },
    { value: 10, label: "নভেম্বর" },
    { value: 11, label: "ডিসেম্বর" }
  ];
  const paymentMethods = [
    { value: "cash", label: "নগদ" },
    { value: "bank_transfer", label: "ব্যাংক ট্রান্সফার" },
    { value: "mobile_banking", label: "মোবাইল ব্যাংকিং" },
    { value: "check", label: "চেক" }
  ];
  const handleMemberSelect = (memberId) => {
    const selectedMember2 = members.find((member) => member.id === memberId);
    setTransactionData({
      ...transactionData,
      memberId,
      memberName: selectedMember2 ? selectedMember2.name : ""
    });
  };
  const handleTransactionTypeChange = (transactionType) => {
    setTransactionData({
      ...transactionData,
      transactionType,
      // Clear share amount if not share purchase
      shareAmount: transactionType === "share_purchase" ? transactionData.shareAmount : ""
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const transactionToSave = {
        memberId: transactionData.memberId,
        memberName: transactionData.memberName,
        transactionType: transactionData.transactionType,
        amount: parseFloat(transactionData.amount),
        shareAmount: transactionData.shareAmount ? parseInt(transactionData.shareAmount) : null,
        paymentMethod: transactionData.paymentMethod,
        paymentReference: transactionData.paymentReference || null,
        description: transactionData.description || "",
        date: transactionData.date,
        month: transactionData.month,
        monthName: months[transactionData.month].label,
        notes: transactionData.notes || "",
        status: "completed"
      };
      const result = await TransactionService.addTransaction(transactionToSave);
      if (result.success) {
        console.log("Transaction saved successfully with ID:", result.id);
        console.log("AddTransaction: toast success - লেনদেন সফল");
        toast.success(`${selectedMember?.name || "সদস্য"} এর জন্য ${transactionData.amount} টাকার লেনদেন সফলভাবে সংরক্ষিত হয়েছে।`);
        setTransactionData({
          memberId: "",
          memberName: "",
          transactionType: "monthly_deposit",
          amount: "",
          shareAmount: "",
          paymentMethod: "cash",
          paymentReference: "",
          description: "",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          month: (/* @__PURE__ */ new Date()).getMonth(),
          notes: ""
        });
        setSubmitStatus(null);
        onClose();
      } else {
        console.error("Failed to save transaction:", result.error);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const selectedMember = members.find((member) => member.id === transactionData.memberId);
  return /* @__PURE__ */ jsx("div", { className: "add-transaction-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "add-transaction-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("div", { className: "add-transaction-header", children: /* @__PURE__ */ jsxs("div", { className: "add-transaction-header-content", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "add-transaction-title", children: "নতুন লেনদেন যোগ করুন" }),
        /* @__PURE__ */ jsx("p", { className: "add-transaction-subtitle", children: "সদস্যের লেনদেনের বিস্তারিত তথ্য প্রদান করুন" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "add-transaction-close-btn",
          children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "add-transaction-body", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "add-transaction-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "add-transaction-section-header", children: [
          /* @__PURE__ */ jsx(User, { className: "add-transaction-section-icon" }),
          /* @__PURE__ */ jsx("h3", { className: "add-transaction-section-title", children: "সদস্য নির্বাচন" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "সদস্য নির্বাচন করুন *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                required: true,
                value: transactionData.memberId,
                onChange: (e) => handleMemberSelect(e.target.value),
                disabled: isLoadingMembers,
                className: "add-transaction-select",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: isLoadingMembers ? "সদস্য তালিকা লোড হচ্ছে..." : members.length === 0 ? "কোনো সক্রিয় সদস্য পাওয়া যায়নি" : "সদস্য নির্বাচন করুন" }),
                  !isLoadingMembers && members.map((member) => /* @__PURE__ */ jsxs("option", { value: member.id, children: [
                    member.somiti_user_id,
                    " - ",
                    member.name
                  ] }, member.id))
                ]
              }
            ),
            isLoadingMembers && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "সদস্য তালিকা ডাটাবেস থেকে লোড হচ্ছে..." }),
            !isLoadingMembers && members.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: "কোনো সক্রিয় সদস্য পাওয়া যায়নি। প্রথমে সদস্য যোগ করুন।" })
          ] }),
          selectedMember && /* @__PURE__ */ jsxs("div", { className: "add-transaction-member-info", children: [
            /* @__PURE__ */ jsxs("div", { className: "add-transaction-member-info-row", children: [
              /* @__PURE__ */ jsx("span", { className: "add-transaction-member-info-label", children: "সদস্যের নাম:" }),
              /* @__PURE__ */ jsx("span", { className: "add-transaction-member-info-value", children: selectedMember.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "add-transaction-member-info-row", children: [
              /* @__PURE__ */ jsx("span", { className: "add-transaction-member-info-label", children: "সদস্য আইডি:" }),
              /* @__PURE__ */ jsx("span", { className: "add-transaction-member-info-value", children: selectedMember.somiti_user_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "add-transaction-member-info-row", children: [
              /* @__PURE__ */ jsx("span", { className: "add-transaction-member-info-label", children: "বর্তমান শেয়ার:" }),
              /* @__PURE__ */ jsxs("span", { className: "add-transaction-member-info-value", children: [
                selectedMember.currentShares,
                " টি"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "add-transaction-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "add-transaction-section-header", children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "add-transaction-section-icon" }),
          /* @__PURE__ */ jsx("h3", { className: "add-transaction-section-title", children: "লেনদেনের বিবরণ" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "লেনদেনের ধরন *" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                required: true,
                value: transactionData.transactionType,
                onChange: (e) => handleTransactionTypeChange(e.target.value),
                className: "add-transaction-select",
                children: transactionTypes.map((type) => /* @__PURE__ */ jsx("option", { value: type.value, children: type.label }, type.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "পরিমাণ (৳) *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                required: true,
                min: "0",
                step: "0.01",
                value: transactionData.amount,
                onChange: (e) => setTransactionData({ ...transactionData, amount: e.target.value }),
                className: "add-transaction-input",
                placeholder: "লেনদেনের পরিমাণ"
              }
            )
          ] }),
          transactionData.transactionType === "share_purchase" && /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "শেয়ার সংখ্যা *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                required: true,
                value: transactionData.shareAmount,
                onChange: (e) => setTransactionData({ ...transactionData, shareAmount: e.target.value }),
                className: "add-transaction-input",
                placeholder: "ক্রয় করার শেয়ার সংখ্যা"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "তারিখ *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                required: true,
                value: transactionData.date,
                onChange: (e) => setTransactionData({ ...transactionData, date: e.target.value }),
                className: "add-transaction-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "মাস *" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                required: true,
                value: transactionData.month,
                onChange: (e) => setTransactionData({ ...transactionData, month: parseInt(e.target.value) }),
                className: "add-transaction-select",
                children: months.map((month) => /* @__PURE__ */ jsx("option", { value: month.value, children: month.label }, month.value))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "বিবরণ" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: transactionData.description,
              onChange: (e) => setTransactionData({ ...transactionData, description: e.target.value }),
              rows: "3",
              className: "add-transaction-textarea",
              placeholder: "লেনদেনের বিস্তারিত বিবরণ"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "add-transaction-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "add-transaction-section-header", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "add-transaction-section-icon" }),
          /* @__PURE__ */ jsx("h3", { className: "add-transaction-section-title", children: "পেমেন্ট তথ্য" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "পেমেন্ট পদ্ধতি *" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                required: true,
                value: transactionData.paymentMethod,
                onChange: (e) => setTransactionData({ ...transactionData, paymentMethod: e.target.value }),
                className: "add-transaction-select",
                children: paymentMethods.map((method) => /* @__PURE__ */ jsx("option", { value: method.value, children: method.label }, method.value))
              }
            )
          ] }),
          transactionData.paymentMethod !== "cash" && /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "রেফারেন্স নম্বর" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: transactionData.paymentReference,
                onChange: (e) => setTransactionData({ ...transactionData, paymentReference: e.target.value }),
                className: "add-transaction-input",
                placeholder: "ট্রানজেকশন/চেক নম্বর"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "add-transaction-form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "add-transaction-label", children: "অতিরিক্ত নোট" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: transactionData.notes,
              onChange: (e) => setTransactionData({ ...transactionData, notes: e.target.value }),
              rows: "2",
              className: "add-transaction-textarea",
              placeholder: "অতিরিক্ত তথ্য বা মন্তব্য"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "add-transaction-section", children: /* @__PURE__ */ jsxs("div", { className: "add-transaction-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting || !transactionData.memberId || !transactionData.amount,
            className: `add-transaction-submit-btn ${isSubmitting || !transactionData.memberId || !transactionData.amount ? "disabled" : ""}`,
            children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "add-transaction-spinner" }),
              "লেনদেন সংরক্ষণ করা হচ্ছে..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
              "লেনদেন সংরক্ষণ করুন"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "add-transaction-cancel-btn",
            children: "বাতিল করুন"
          }
        )
      ] }) }),
      submitStatus && /* @__PURE__ */ jsx("div", { className: `add-transaction-status ${submitStatus === "success" ? "success" : "error"}`, children: /* @__PURE__ */ jsxs("div", { className: "add-transaction-status-content", children: [
        submitStatus === "success" ? /* @__PURE__ */ jsx(CheckCircle, { className: "add-transaction-status-icon" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "add-transaction-status-icon" }),
        /* @__PURE__ */ jsx("p", { className: "add-transaction-status-text", children: submitStatus === "success" ? "লেনদেন সফলভাবে সংরক্ষিত হয়েছে!" : "লেনদেন সংরক্ষণে ত্রুটি হয়েছে। আবার চেষ্টা করুন।" })
      ] }) })
    ] }) })
  ] }) });
};
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React__default.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React__default.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  instances = [];
  canUseDOM = isDocument;
  context;
  value = {
    setHelmet: (serverState) => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: () => this.canUseDOM ? instances : this.instances,
      add: (instance) => {
        (this.canUseDOM ? instances : this.instances).push(instance);
      },
      remove: (instance) => {
        const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
        (this.canUseDOM ? instances : this.instances).splice(index, 1);
      }
    }
  };
  constructor(context, canUseDOM) {
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React__default.createContext(defaultValue);
var HelmetProvider = class _HelmetProvider extends Component {
  static canUseDOM = isDocument;
  helmetData;
  constructor(props) {
    super(props);
    this.helmetData = new HelmetData(this.props.context || {}, _HelmetProvider.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React__default.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
};
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => tag.parentNode?.removeChild(tag));
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  rendered = false;
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = class extends Component {
  static defaultProps = {
    defer: true,
    encodeSpecialCharacters: true,
    prioritizeSeoTags: false
  };
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React__default.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React__default.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React__default.createElement(HelmetDispatcher, { ...newProps, context }));
  }
};
const Meta = ({
  title,
  description,
  keywords,
  canonicalUrl,
  jsonLd,
  openGraph,
  twitterCard,
  noindex,
  locale = "bn_BD"
}) => {
  useEffect(() => {
    console.log("[Meta] render", { title, canonicalUrl });
  }, [title, canonicalUrl]);
  const og = openGraph || {};
  const tw = twitterCard || {};
  const robotsContent = noindex ? "noindex,nofollow" : "index,follow";
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    description && /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    keywords && /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
    canonicalUrl && /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: robotsContent }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: og.type || "website" }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: og.title || title }),
    description && /* @__PURE__ */ jsx("meta", { property: "og:description", content: og.description || description }),
    canonicalUrl && /* @__PURE__ */ jsx("meta", { property: "og:url", content: og.url || canonicalUrl }),
    og.image && /* @__PURE__ */ jsx("meta", { property: "og:image", content: og.image }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: og.siteName || "ফুলমুড়ী যুব ফাউন্ডেশন" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: og.locale || locale }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: tw.card || "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: tw.title || title }),
    description && /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: tw.description || description }),
    tw.image && /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: tw.image }),
    tw.site && /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: tw.site }),
    jsonLd && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(jsonLd) })
  ] });
};
console.log("[ModeIndicator] File loaded");
const ModeIndicator = () => {
  const { mode, isDemo } = useMode();
  if (mode === "production") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: `mode-indicator ${mode}`, children: [
    /* @__PURE__ */ jsx("div", { className: "mode-indicator-content", children: isDemo() ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(TestTube, { size: 16 }),
      /* @__PURE__ */ jsx("span", { className: "mode-text", children: "ডেমো মোড" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Database, { size: 16 }),
      /* @__PURE__ */ jsx("span", { className: "mode-text", children: "প্রোডাকশন" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mode-indicator-pulse" })
  ] });
};
console.log("[DemoRoleSwitcher] File loaded");
const DemoRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { isDemo } = useMode();
  useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  if (!isDemo()) {
    return null;
  }
  if (!user) {
    return null;
  }
  const roles = [
    { id: "admin", label: "অ্যাডমিন", icon: Shield, color: "#667eea" },
    { id: "cashier", label: "ক্যাশিয়ার", icon: Wallet, color: "#f093fb" },
    { id: "member", label: "সদস্য", icon: User, color: "#10b981" }
  ];
  const currentRole = roles.find((r) => r.id === user.role);
  const handleRoleSwitch = (newRole) => {
    if (newRole !== user.role) {
      localStorage.setItem("somiti_role", newRole);
      console.log("[DemoRoleSwitcher] Switching to", newRole, "- reloading page");
      window.location.href = `/#/${newRole}`;
      window.location.reload();
      setShowMenu(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "demo-role-switcher", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "demo-role-button",
        onClick: () => setShowMenu(!showMenu),
        style: { "--role-color": currentRole?.color },
        children: [
          /* @__PURE__ */ jsx(RefreshCw, { size: 18, className: showMenu ? "spinning" : "" }),
          /* @__PURE__ */ jsx("span", { className: "role-label", children: currentRole?.label }),
          /* @__PURE__ */ jsx("span", { className: "demo-badge", children: "ডেমো" })
        ]
      }
    ),
    showMenu && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "role-menu-backdrop", onClick: () => setShowMenu(false) }),
      /* @__PURE__ */ jsxs("div", { className: "role-menu", children: [
        /* @__PURE__ */ jsx("div", { className: "role-menu-header", children: /* @__PURE__ */ jsx("span", { children: "রোল পরিবর্তন করুন" }) }),
        roles.map((role) => {
          const RoleIcon = role.icon;
          const isActive = role.id === user.role;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              className: `role-menu-item ${isActive ? "active" : ""}`,
              onClick: () => handleRoleSwitch(role.id),
              style: { "--role-color": role.color },
              disabled: isActive,
              children: [
                /* @__PURE__ */ jsx(RoleIcon, { size: 20 }),
                /* @__PURE__ */ jsx("span", { children: role.label }),
                isActive && /* @__PURE__ */ jsx("span", { className: "active-indicator", children: "✓" })
              ]
            },
            role.id
          );
        })
      ] })
    ] })
  ] });
};
const Layout = ({ children, title, description, keywords, canonicalUrl, jsonLd }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  useLocation();
  useSidebarLogic(user?.role);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-background", children: [
    console.log("Layout: Toaster mounted"),
    /* @__PURE__ */ jsx(Toaster, { position: "top-right", toastOptions: { duration: 3e3 } }),
    /* @__PURE__ */ jsx(
      Meta,
      {
        title: title || "ফুলমুড়ী যুব ফাউন্ডেশন - Fulmuri Youth Foundation",
        description: description || "ফুলমুড়ী যুব ফাউন্ডেশন-এর অফিসিয়াল ওয়েবসাইটে স্বাগতম। আমাদের সম্প্রদায়ের জন্য একটি উন্নত ভবিষ্যৎ গড়তে আমাদের সাথে যোগ দিন।",
        keywords: keywords || "ফুলমুড়ী যুব ফাউন্ডেশন, Fulmuri Youth Foundation, Fulmuri, Youth Foundation, Community Development, Fulmuri Gram",
        canonicalUrl: canonicalUrl || "https://fulmurigram.site/",
        jsonLd
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { style: { margin: 0, padding: 0 }, children: /* @__PURE__ */ jsx(
        PrimarySearchAppBar,
        {
          userRole: user?.role,
          isMobile
        }
      ) }),
      /* @__PURE__ */ jsx(ModeIndicator, {}),
      /* @__PURE__ */ jsx(DemoRoleSwitcher, {}),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children }),
        /* @__PURE__ */ jsx(Footer, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      BottomNavigation,
      {
        userRole: user?.role,
        onOpenAddTransaction: () => setAddTransactionModalOpen(true)
      }
    ),
    /* @__PURE__ */ jsx(
      AddTransaction,
      {
        isOpen: addTransactionModalOpen,
        onClose: () => setAddTransactionModalOpen(false)
      }
    )
  ] });
};
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true, "VITE_API_BASE_URL": "https://somiti-auth-backend.netlify.app/.netlify/functions/auth", "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6b3N2dmJ6dm9wYW1ramN1enB5Iiwicm9sZSI6ImFub24iLC", "VITE_SUPABASE_URL": "https://lzosvvbzvopamkjcuzpy.supabase.co" };
function getPublicEnv(key) {
  const viteEnv = __vite_import_meta_env__?.[key];
  if (viteEnv !== void 0 && viteEnv !== null && viteEnv !== "") {
    console.log("[env] using import.meta.env for", key);
    return viteEnv;
  }
  const winEnv = typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key];
  if (winEnv !== void 0 && winEnv !== null && winEnv !== "") {
    console.log("[env] using window.__ENV__ for", key);
    return winEnv;
  }
  const globalEnv = typeof window !== "undefined" && window[key];
  if (globalEnv !== void 0 && globalEnv !== null && globalEnv !== "") {
    console.log("[env] using window global for", key);
    return globalEnv;
  }
  console.error("[env] missing key", key);
  return void 0;
}
const API_BASE_URL = getPublicEnv("VITE_API_BASE_URL");
async function readJsonOrText(response) {
  try {
    const data = await response.json();
    return { json: data, text: null };
  } catch (e) {
    const t = await response.text();
    return { json: null, text: t };
  }
}
const registerUser = async (email, password) => {
  try {
    if (!API_BASE_URL) {
      console.error("Missing VITE_API_BASE_URL");
      throw new Error("API base URL missing");
    }
    console.log("Register request", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const parsed = await readJsonOrText(response);
    if (!response.ok) {
      const message = parsed.json?.message || parsed.text || "Registration failed";
      console.error("Registration failed", message);
      throw new Error(message);
    }
    if (!parsed.json) {
      console.error("Registration parse error", parsed.text?.slice(0, 200));
      throw new Error("Registration response is not JSON");
    }
    return parsed.json;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
const loginUser = async (email, password) => {
  try {
    if (!API_BASE_URL) {
      console.error("Missing VITE_API_BASE_URL");
      throw new Error("API base URL missing");
    }
    console.log("Login request", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const parsed = await readJsonOrText(response);
    if (!response.ok) {
      const message = parsed.json?.message || parsed.text || "Login failed";
      console.error("Login failed", message);
      throw new Error(message);
    }
    if (!parsed.json) {
      console.error("Login parse error", parsed.text?.slice(0, 200));
      throw new Error("Login response is not JSON");
    }
    return parsed.json;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
console.log("[BubbleBackground] File loaded");
const defaultColors = {
  first: "18,113,255",
  second: "221,74,255",
  third: "0,220,255",
  fourth: "200,50,50",
  fifth: "180,180,50",
  sixth: "140,100,255"
};
const BubbleBackground = ({ interactive = false, colors = defaultColors, transition = { stiffness: 100, damping: 20 }, isDark = false, children, ...props }) => {
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let mx = 0;
    let my = 0;
    let raf = null;
    let driftRaf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mx = x * 2 - 1;
      my = y * 2 - 1;
      if (!raf) raf = requestAnimationFrame(applyMouse);
    };
    const applyMouse = () => {
      raf = null;
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    };
    const startDrift = () => {
      if (driftRaf) return;
      console.log("[BubbleBackground] Touch drift started");
      let t = 0;
      const step = () => {
        t += 0.016;
        const dx = Math.sin(t * 0.6) * 0.15;
        const dy = Math.cos(t * 0.8) * 0.15;
        el.style.setProperty("--mx", dx.toFixed(3));
        el.style.setProperty("--my", dy.toFixed(3));
        driftRaf = requestAnimationFrame(step);
      };
      driftRaf = requestAnimationFrame(step);
    };
    const onTouchStart = () => {
      startDrift();
    };
    if (interactive) {
      el.addEventListener("mousemove", onMove);
      el.addEventListener("touchstart", onTouchStart, { passive: true });
    }
    console.log("[BubbleBackground] Mounted");
    return () => {
      if (interactive) el.removeEventListener("mousemove", onMove);
      if (interactive) el.removeEventListener("touchstart", onTouchStart);
      if (raf) cancelAnimationFrame(raf);
      if (driftRaf) cancelAnimationFrame(driftRaf);
    };
  }, [interactive, transition]);
  const styleVars = {
    "--c1": colors.first,
    "--c2": colors.second,
    "--c3": colors.third,
    "--c4": colors.fourth,
    "--c5": colors.fifth,
    "--c6": colors.sixth
  };
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `bubble-background-root ${isDark ? "dark" : ""}`, style: styleVars, ...props, children: [
    /* @__PURE__ */ jsxs("div", { className: "bubble-background", children: [
      /* @__PURE__ */ jsx("div", { className: "bubble b1" }),
      /* @__PURE__ */ jsx("div", { className: "bubble b2" }),
      /* @__PURE__ */ jsx("div", { className: "bubble b3" }),
      /* @__PURE__ */ jsx("div", { className: "bubble b4" }),
      /* @__PURE__ */ jsx("div", { className: "bubble b5" }),
      /* @__PURE__ */ jsx("div", { className: "bubble b6" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bubble-content", children })
  ] });
};
console.log("[Login] File loaded");
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const logMetrics = () => {
      console.log("[Login] viewport metrics", {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio
      });
    };
    logMetrics();
    window.addEventListener("resize", logMetrics);
    return () => {
      window.removeEventListener("resize", logMetrics);
    };
  }, []);
  if (isAuthenticated()) {
    const target = user?.role ? `/${user.role}` : "/member";
    console.log("[Login] Already authenticated, redirecting to:", target);
    return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("ইমেইল এবং পাসওয়ার্ড প্রয়োজন");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      console.log("[Login] Submitting login with email:", formData.email);
      const response = await loginUser(formData.email, formData.password);
      if (response.success) {
        const result = await login(response.token, response.user_id);
        if (result.user) {
          const { role } = result.user;
          navigate(`/${role}`, { replace: true });
          console.log("[Login] Login successful; navigating to dashboard");
        } else {
          setError(result.error || "লগইন ব্যর্থ হয়েছে");
        }
      } else {
        setError(response.message || "লগইন ব্যর্থ হয়েছে");
      }
    } catch (err) {
      setError(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("[Login] Bubble background enabled");
  return /* @__PURE__ */ jsx(BubbleBackground, { interactive: true, colors: { first: "18,113,255", second: "221,74,255", third: "0,220,255", fourth: "200,50,50", fifth: "180,180,50", sixth: "140,100,255" }, children: /* @__PURE__ */ jsxs("div", { className: "login-container", children: [
    /* @__PURE__ */ jsx(
      Meta,
      {
        title: "লগইন - ফুলমুড়ী যুব ফাউন্ডেশন",
        description: "ফুলমুড়ী যুব ফাউন্ডেশন-এর অ্যাকাউন্টে লগইন করুন"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "login-wrapper", children: [
      /* @__PURE__ */ jsx("div", { className: "login-header", children: /* @__PURE__ */ jsx("div", { className: "welcome-animation", style: { display: "flex", justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsx(
        "lottie-player",
        {
          src: "/Welcome_login.json",
          background: "transparent",
          speed: "1",
          style: { width: "300px", height: "90px" },
          loop: true,
          autoplay: true
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "login-form-container", children: [
        /* @__PURE__ */ jsx("div", { className: "login-logo", style: { display: "flex", justifyContent: "center", marginBottom: "1rem" }, children: /* @__PURE__ */ jsx(
          "lottie-player",
          {
            src: "/login_animation.json",
            background: "transparent",
            speed: "1",
            style: { width: "100px", height: "100px" },
            loop: true,
            autoplay: true
          }
        ) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "form-label", children: "ইমেইল ঠিকানা" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                id: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                className: "form-input",
                placeholder: "আপনার ইমেইল লিখুন",
                disabled: isSubmitting,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "form-label", children: "পাসওয়ার্ড" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  id: "password",
                  name: "password",
                  value: formData.password,
                  onChange: handleChange,
                  className: "form-input",
                  placeholder: "আপনার পাসওয়ার্ড লিখুন",
                  disabled: isSubmitting,
                  required: true
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "password-toggle",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5" })
                }
              )
            ] })
          ] }),
          error && /* @__PURE__ */ jsxs("div", { className: "error-message", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 error-icon" }),
            /* @__PURE__ */ jsx("span", { children: error })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "login-button",
              disabled: isSubmitting,
              children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
                " লগইন করা হচ্ছে..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(LogIn, { className: "h-5 w-5" }),
                " লগইন করুন"
              ] })
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bengali-content", children: /* @__PURE__ */ jsx("p", { children: "ওয়েবসাইটে সংরক্ষিত রয়েছে সমিতির নোটিশ, আপডেট, এবং কার্যক্রম সম্পর্কিত তথ্য, যা অনুমোদন ছাড়া প্রবেশ করা সম্ভব নয়। ফুলমুড়ী যুব ফাউন্ডেশনের এই অনলাইন প্ল্যাঠফর্ম নিশ্চিত করে যে শুধুমাত্র অনুমোদিত সদস্যরাই সব তথ্য অ্যাক্সেস করতে পারে।" }) })
  ] }) });
};
console.log("[ThemeSwitcher] File loaded");
function ThemeSwitcher({ isDark, onToggle }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    console.log("[ThemeSwitcher] mounted");
  }, []);
  const handleToggle = () => {
    console.log("[ThemeSwitcher] toggle", { next: !isDark });
    onToggle?.(!isDark);
  };
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "theme-switcher-root", "aria-hidden": true, children: /* @__PURE__ */ jsx("div", { className: "ts-track ts-track--light" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "theme-switcher-root", role: "switch", "aria-checked": isDark, "aria-label": `Switch to ${isDark ? "light" : "dark"} mode`, children: /* @__PURE__ */ jsxs("button", { className: `ts-button ${isDark ? "ts-button--dark" : "ts-button--light"}`, onClick: handleToggle, onMouseEnter: () => console.log("[ThemeSwitcher] hover"), onMouseLeave: () => console.log("[ThemeSwitcher] leave"), children: [
    /* @__PURE__ */ jsx("div", { className: `ts-track ${isDark ? "ts-track--dark" : "ts-track--light"}` }),
    /* @__PURE__ */ jsx("div", { className: "ts-overlay ts-overlay--gloss" }),
    /* @__PURE__ */ jsx("div", { className: "ts-overlay ts-overlay--rim" }),
    /* @__PURE__ */ jsxs("div", { className: "ts-icons", children: [
      /* @__PURE__ */ jsx(Sun, { size: 16, className: isDark ? "ts-sun--dim" : "ts-sun--bright" }),
      /* @__PURE__ */ jsx(Moon, { size: 16, className: isDark ? "ts-moon--bright" : "ts-moon--dim" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `ts-thumb ${isDark ? "ts-thumb--right" : "ts-thumb--left"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "ts-thumb-gloss" }),
      /* @__PURE__ */ jsx("div", { className: `ts-particle ${isDark ? "ts-particle--dark" : "ts-particle--light"}` }),
      /* @__PURE__ */ jsx("div", { className: `ts-particle ts-particle--delay ${isDark ? "ts-particle--dark" : "ts-particle--light"}` }),
      /* @__PURE__ */ jsx("div", { className: `ts-particle ts-particle--delay2 ${isDark ? "ts-particle--dark" : "ts-particle--light"}` }),
      /* @__PURE__ */ jsx("div", { className: "ts-thumb-icon", children: isDark ? /* @__PURE__ */ jsx(Moon, { size: 16, className: "ts-icon--moon" }) : /* @__PURE__ */ jsx(Sun, { size: 16, className: "ts-icon--sun" }) })
    ] })
  ] }) });
}
console.log("[RainbowButton] File loaded");
function RainbowButton({ to = "/member", children = "সদস্য পোর্টাল", className = "", onClick }) {
  const handleClick = (e) => {
    console.log("[RainbowButton] click", { to });
    if (onClick) onClick(e);
  };
  return /* @__PURE__ */ jsx(Link, { to, onClick: handleClick, className: `magic-rainbow-btn ${className}`, "aria-label": "সদস্য পোর্টাল", children: /* @__PURE__ */ jsx("span", { className: "magic-rainbow-inner", children }) });
}
const SPHERE_MATH = {
  degreesToRadians: (degrees) => degrees * (Math.PI / 180),
  radiansToDegrees: (radians) => radians * (180 / Math.PI),
  sphericalToCartesian: (radius, theta, phi) => ({
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  }),
  calculateDistance: (pos, center = { x: 0, y: 0, z: 0 }) => {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const dz = pos.z - center.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  normalizeAngle: (angle) => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  }
};
const SphereImageGrid = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  hoverScale = 1.2,
  perspective = 1e3,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = "",
  onImageClick,
  disableSpotlight = false,
  performanceMode = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePositions, setImagePositions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);
  const lastFrameTs = useRef(0);
  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;
  const generateSpherePositions = useCallback(() => {
    const positions = [];
    const imageCount = images.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI / goldenRatio;
    for (let i = 0; i < imageCount; i++) {
      const t = i / imageCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;
      let phi = inclination * (180 / Math.PI);
      let theta = azimuth * (180 / Math.PI) % 360;
      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      if (phi < 90) {
        phi = Math.max(5, phi - poleBonus);
      } else {
        phi = Math.min(175, phi + poleBonus);
      }
      phi = 15 + phi / 180 * 150;
      const randomOffset = (Math.random() - 0.5) * 20;
      theta = (theta + randomOffset) % 360;
      phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));
      positions.push({
        theta,
        phi,
        radius: actualSphereRadius
      });
    }
    return positions;
  }, [images.length, actualSphereRadius]);
  const calculateWorldPositions = useCallback(() => {
    const positions = imagePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
      const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
      const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);
      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      let y = pos.radius * Math.cos(phiRad);
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);
      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1;
      z = z1;
      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2;
      z = z2;
      const worldPos = { x, y, z };
      const fadeZoneStart = performanceMode ? -5 : -10;
      const fadeZoneEnd = performanceMode ? -20 : -30;
      const isVisible = worldPos.z > fadeZoneEnd;
      let fadeOpacity = 1;
      if (worldPos.z <= fadeZoneStart) {
        fadeOpacity = Math.max(0, (worldPos.z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd));
      }
      const isPoleImage = pos.phi < 30 || pos.phi > 150;
      const distanceFromCenter = Math.sqrt(worldPos.x * worldPos.x + worldPos.y * worldPos.y);
      const maxDistance = actualSphereRadius;
      const distanceRatio = Math.min(distanceFromCenter / maxDistance, 1);
      const distancePenalty = isPoleImage ? 0.4 : 0.7;
      const centerScale = Math.max(0.3, 1 - distanceRatio * distancePenalty);
      const depthScale = (worldPos.z + actualSphereRadius) / (2 * actualSphereRadius);
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);
      return {
        ...worldPos,
        scale,
        zIndex: Math.round(1e3 + worldPos.z),
        isVisible,
        fadeOpacity,
        originalIndex: index
      };
    });
    if (performanceMode) {
      return positions;
    }
    const adjustedPositions = [...positions];
    for (let i = 0; i < adjustedPositions.length; i++) {
      const pos = adjustedPositions[i];
      if (!pos.isVisible) continue;
      let adjustedScale = pos.scale;
      const imageSize = baseImageSize * adjustedScale;
      for (let j = 0; j < adjustedPositions.length; j++) {
        if (i === j) continue;
        const other = adjustedPositions[j];
        if (!other.isVisible) continue;
        const otherSize = baseImageSize * other.scale;
        const dx = pos.x - other.x;
        const dy = pos.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (imageSize + otherSize) / 2 + 25;
        if (distance < minDistance && distance > 0) {
          const overlap = minDistance - distance;
          const reductionFactor = Math.max(0.4, 1 - overlap / minDistance * 0.6);
          adjustedScale = Math.min(adjustedScale, adjustedScale * reductionFactor);
        }
      }
      adjustedPositions[i] = {
        ...pos,
        scale: Math.max(0.25, adjustedScale)
        // Ensure minimum scale
      };
    }
    return adjustedPositions;
  }, [imagePositions, rotation, actualSphereRadius, baseImageSize, performanceMode]);
  const clampRotationSpeed = useCallback((speed) => {
    return Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed));
  }, [maxRotationSpeed]);
  const updateMomentum = useCallback(() => {
    if (isDragging) return;
    setVelocity((prev) => {
      const newVelocity = {
        x: prev.x * momentumDecay,
        y: prev.y * momentumDecay
      };
      if (!autoRotate && Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
        return { x: 0, y: 0 };
      }
      return newVelocity;
    });
    setRotation((prev) => {
      let newY = prev.y;
      if (autoRotate) {
        newY += autoRotateSpeed;
      }
      newY += clampRotationSpeed(velocity.y);
      return {
        x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(velocity.x)),
        y: SPHERE_MATH.normalizeAngle(newY),
        z: prev.z
      };
    });
  }, [isDragging, momentumDecay, velocity, clampRotationSpeed, autoRotate, autoRotateSpeed]);
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    const rotationDelta = {
      x: -deltaY * dragSensitivity,
      y: deltaX * dragSensitivity
    };
    setRotation((prev) => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(rotationDelta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampRotationSpeed(rotationDelta.y)),
      z: prev.z
    }));
    setVelocity({
      x: clampRotationSpeed(rotationDelta.x),
      y: clampRotationSpeed(rotationDelta.y)
    });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, dragSensitivity, clampRotationSpeed]);
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  }, []);
  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePos.current.x;
    const deltaY = touch.clientY - lastMousePos.current.y;
    const rotationDelta = {
      x: -deltaY * dragSensitivity,
      y: deltaX * dragSensitivity
    };
    setRotation((prev) => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(rotationDelta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampRotationSpeed(rotationDelta.y)),
      z: prev.z
    }));
    setVelocity({
      x: clampRotationSpeed(rotationDelta.x),
      y: clampRotationSpeed(rotationDelta.y)
    });
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  }, [isDragging, dragSensitivity, clampRotationSpeed]);
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setImagePositions(generateSpherePositions());
  }, [generateSpherePositions]);
  useEffect(() => {
    console.log("[ImgSphere] performance mode", { performanceMode });
    const animate = () => {
      const now = performance.now();
      if (!performanceMode || now - lastFrameTs.current >= 16) {
        lastFrameTs.current = now;
        updateMomentum();
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    if (isMounted) {
      animationFrame.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isMounted, updateMomentum, performanceMode]);
  useEffect(() => {
    if (!isMounted) return;
    const container = containerRef.current;
    if (!container) return;
    const target = performanceMode ? container : document;
    target.addEventListener("mousemove", handleMouseMove);
    target.addEventListener("mouseup", handleMouseUp);
    target.addEventListener("touchmove", handleTouchMove, { passive: false });
    target.addEventListener("touchend", handleTouchEnd);
    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      target.removeEventListener("mouseup", handleMouseUp);
      target.removeEventListener("touchmove", handleTouchMove);
      target.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, performanceMode]);
  const worldPositions = calculateWorldPositions();
  const renderImageNode = useCallback((image, index) => {
    const position = worldPositions[index];
    if (!position || !position.isVisible) return null;
    const imageSize = baseImageSize * position.scale;
    const isHovered = hoveredIndex === index && !performanceMode;
    const finalScale = isHovered ? Math.min(1.2, 1.2 / position.scale) : 1;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: performanceMode ? "absolute cursor-pointer select-none" : "absolute cursor-pointer select-none transition-transform duration-200 ease-out",
        style: {
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          left: `${containerSize / 2 + position.x}px`,
          top: `${containerSize / 2 + position.y}px`,
          opacity: position.fadeOpacity,
          transform: `translate3d(-50%, -50%, 0) scale(${finalScale})`,
          willChange: "transform, opacity",
          zIndex: position.zIndex
        },
        onMouseEnter: () => setHoveredIndex(index),
        onMouseLeave: () => setHoveredIndex(null),
        onClick: () => {
          console.log("[ImgSphere] image clicked", { id: image.id, alt: image.alt });
          if (!disableSpotlight) {
            setSelectedImage(image);
          } else {
            console.log("[ImgSphere] spotlight disabled, delegating click");
          }
          if (typeof onImageClick === "function") {
            try {
              onImageClick(image);
            } catch (err) {
              console.error("[ImgSphere] onImageClick error", err);
            }
          }
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white/20",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: image.src,
                alt: image.alt,
                className: "w-full h-full object-cover",
                draggable: false,
                loading: index < 3 ? "eager" : "lazy"
              }
            )
          }
        )
      },
      image.id
    );
  }, [worldPositions, baseImageSize, containerSize, hoveredIndex, performanceMode]);
  const renderSpotlightModal = () => {
    if (disableSpotlight) return null;
    if (!selectedImage) return null;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30",
        onClick: () => setSelectedImage(null),
        style: {
          animation: "fadeIn 0.3s ease-out"
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl max-w-md w-full overflow-hidden",
            onClick: (e) => e.stopPropagation(),
            style: {
              animation: "scaleIn 0.3s ease-out"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative aspect-square", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: selectedImage.src,
                    alt: selectedImage.alt,
                    className: "w-full h-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelectedImage(null),
                    className: "absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center hover:bg-opacity-70 transition-all cursor-pointer",
                    children: /* @__PURE__ */ jsx(X, { size: 16 })
                  }
                )
              ] }),
              (selectedImage.title || selectedImage.description) && /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
                selectedImage.title && /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: selectedImage.title }),
                selectedImage.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: selectedImage.description })
              ] })
            ]
          }
        )
      }
    );
  };
  if (!isMounted) {
    console.log("[ImgSphere] placeholder showing (mounting)");
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `relative select-none`,
        style: { width: containerSize, height: containerSize },
        children: /* @__PURE__ */ jsx("div", { className: "img-sphere-placeholder", children: /* @__PURE__ */ jsx("div", { className: "img-sphere-spinner" }) })
      }
    );
  }
  if (!images.length) {
    console.log("[ImgSphere] placeholder showing (no images)");
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `relative select-none`,
        style: { width: containerSize, height: containerSize },
        children: /* @__PURE__ */ jsx("div", { className: "img-sphere-placeholder", children: /* @__PURE__ */ jsx("div", { className: "img-sphere-spinner" }) })
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      ` }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: `relative select-none cursor-grab active:cursor-grabbing ${className}`,
        style: {
          width: containerSize,
          height: containerSize,
          perspective: `${perspective}px`
        },
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        children: /* @__PURE__ */ jsx("div", { className: "relative w-full h-full", style: { zIndex: 10 }, children: images.map((image, index) => renderImageNode(image, index)) })
      }
    ),
    renderSpotlightModal()
  ] });
};
const FeedbackModal = ({ isOpen, onClose, onSubmitted }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      console.log("FeedbackModal: submitting feedback");
      await addDoc(collection(db, "feedbacks"), {
        message: message.trim(),
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        page: window.location.pathname
      });
      toast$1.success("মতামত পাঠানোর জন্য ধন্যবাদ!");
      setMessage("");
      console.log("FeedbackModal: feedback submitted successfully");
      if (typeof onSubmitted === "function") {
        onSubmitted();
      }
      onClose();
    } catch (error) {
      console.error("Error adding feedback: ", error);
      toast$1.error("দুঃখিত, মতামত পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200",
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400", children: /* @__PURE__ */ jsx(MessageSquare, { size: 20 }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800 dark:text-gray-100", children: "মতামত দিন" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                console.log("FeedbackModal: close clicked");
                onClose();
              },
              className: "p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors",
              children: /* @__PURE__ */ jsx(X, { size: 20 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "আপনার মতামত আমাদের জানান" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: message,
                onChange: (e) => setMessage(e.target.value),
                placeholder: "এখানে লিখুন...",
                className: "w-full min-h-[120px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isSubmitting || !message.trim(),
              className: "flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 active:scale-95",
              children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                /* @__PURE__ */ jsx("span", { className: "ml-1", children: "পাঠানো হচ্ছে..." })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: "পাঠান" }),
                /* @__PURE__ */ jsx(Send, { size: 18 })
              ] })
            }
          ) })
        ] })
      ]
    }
  ) });
};
const FeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const hideTimerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          console.log("FeedbackButton: open modal");
          setIsModalOpen(true);
        },
        className: "fixed bottom-6 right-6 z-40 relative p-0 bg-transparent shadow-none border-0",
        "aria-label": "Feedback",
        title: "মতামত দিন",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/feedback_icon.png",
              alt: "Feedback",
              className: "w-12 h-12 select-none",
              draggable: "false",
              onLoad: () => console.log("FeedbackButton: PNG icon loaded")
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none", children: "মতামত দিন" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showSuccessPrompt ? "opacity-100" : "opacity-0"}`, role: "status", "aria-live": "polite", children: /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 rounded-2xl shadow-2xl border border-green-700 bg-green-600 text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }),
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "ধন্যবাদ! মতামত পাঠানো হয়েছে" })
    ] }) }),
    /* @__PURE__ */ jsx(
      FeedbackModal,
      {
        isOpen: isModalOpen,
        onClose: () => {
          console.log("FeedbackButton: close modal");
          setIsModalOpen(false);
        },
        onSubmitted: () => {
          console.log("FeedbackButton: feedback submitted");
          if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
          }
          setShowSuccessPrompt(true);
          hideTimerRef.current = setTimeout(() => {
            setShowSuccessPrompt(false);
          }, 2500);
        }
      }
    )
  ] });
};
const FaqAccordion = React__default.lazy(() => import("./assets/FaqAccordion-fieSZpkp.js"));
const Testimonials = React__default.lazy(() => import("./assets/Testimonials--rqHr6Xy.js"));
const StatsCounter = React__default.lazy(() => import("./assets/StatsCounter-CB-wm3-S.js"));
const InfoGrid = React__default.lazy(() => import("./assets/InfoGrid-oBi92XJM.js"));
const MapBlock = React__default.lazy(() => import("./assets/MapBlock-wGDAzBEz.js"));
function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const seasonsRef = useRef(null);
  const rainRef = useRef(null);
  const leavesRef = useRef(null);
  const landingSphereRef = useRef(null);
  const [rainData, setRainData] = useState(null);
  const [leavesData, setLeavesData] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [rainInView, setRainInView] = useState(false);
  const [leavesInView, setLeavesInView] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sphereImages, setSphereImages] = useState([]);
  const buildPlaceholderAvatar = (name, size = 128) => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    const initials = (parts.slice(0, 2).map((p) => p[0] || "").join("") || "M").toUpperCase();
    const bg = "#e2e8f0";
    const text = "#1e293b";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="clip">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g clip-path="url(#clip)">
    <rect width="${size}" height="${size}" fill="${bg}"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(size * 0.4)}" font-weight="700" fill="${text}">${initials}</text>
</svg>`;
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return dataUrl;
  };
  useEffect(() => {
    let mounted = true;
    console.log("[LandingPage] fetching members for sphere images");
    MemberService.getActiveMembers().then((result) => {
      if (!mounted) return;
      if (result.success) {
        const sorted = [...result.data || []].sort((a, b) => {
          const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
          const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
          if (createdA.getTime() !== createdB.getTime()) return createdB - createdA;
          return (b.id || "").localeCompare(a.id || "");
        });
        const imgs = sorted.map((m) => ({
          id: m.id,
          src: m.photoURL || m.avatar || buildPlaceholderAvatar(m.name),
          alt: m.name || m.membershipId || "সদস্য",
          title: m.name,
          description: m.membershipId ? `আইডি: ${m.membershipId}` : void 0
        }));
        console.log("[LandingPage] sphere images prepared", { count: imgs.length });
        setSphereImages(imgs);
      } else {
        console.log("[LandingPage] members fetch failed, using minimal assets");
        setSphereImages([
          { id: "footer_logo", src: "/footer_logo.svg", alt: "লোগো", title: "ফুটার" },
          { id: "vite", src: "/vite.svg", alt: "ভিট", title: "ভিট" },
          { id: "pdf_logo", src: "/logo_pdf.png", alt: "পিডিএফ লোগো", title: "পিডিএফ" }
        ]);
      }
    }).catch((e) => {
      console.log("[LandingPage] members fetch error", e);
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!shouldAnimate) {
      console.log("[LandingPage] skip auto scroll due to reduced motion");
      return;
    }
    const el = landingSphereRef.current;
    if (!el) {
      console.log("[LandingPage] sphere ref not ready");
      return;
    }
    const current = parseInt(localStorage.getItem("lpSphereScrollCount") || "0", 10) || 0;
    if (current >= 3) {
      console.log("[LandingPage] auto scroll skipped (limit reached)", { current });
      return;
    }
    const doScroll = () => {
      try {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const delta = centerY - viewportCenter;
        window.scrollBy({ top: delta, behavior: "smooth" });
        const next = current + 1;
        localStorage.setItem("lpSphereScrollCount", String(next));
        console.log("[LandingPage] auto scrolled to sphere center", { delta, next });
      } catch (e) {
        console.log("[LandingPage] auto scroll failed, using scrollIntoView", e);
        try {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const next = current + 1;
          localStorage.setItem("lpSphereScrollCount", String(next));
        } catch {
        }
      }
    };
    const delayMs = 2e3;
    let timerId = null;
    const schedule = () => {
      console.log("[LandingPage] auto-scroll scheduled with delay", { delayMs });
      timerId = setTimeout(() => {
        requestAnimationFrame(doScroll);
      }, delayMs);
    };
    const onLoad = () => schedule();
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
        console.log("[LandingPage] auto-scroll timer cleared");
      }
      window.removeEventListener("load", onLoad);
    };
  }, [shouldAnimate]);
  useEffect(() => {
    console.log("[LandingPage] mounted");
    console.log("[LandingPage] UI tweak applied: season card slightly enlarged");
    console.log("[LandingPage] UI tweak applied: season card enlarged a bit more");
    console.log("[LandingPage] viewport", { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio });
  }, []);
  useEffect(() => {
    try {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      const value = !(m && m.matches);
      setShouldAnimate(value);
      console.log("[LandingPage] motion preference", { shouldAnimate: value });
    } catch {
    }
  }, []);
  useEffect(() => {
    const rainSpeed = 0.35;
    const leafSpeed = 0.35;
    console.log("[LandingPage] Lottie speed update requested: make even slower");
    if (rainData && rainRef.current) {
      rainRef.current.setSpeed(rainSpeed);
      try {
        rainRef.current.setSubframe?.(true);
        console.log("[LandingPage] Lottie subframe enabled", { type: "rain" });
      } catch {
      }
      console.log("[LandingPage] Lottie speed set", { type: "rain", speed: rainSpeed });
    } else if (rainData && !rainRef.current) {
      setTimeout(() => {
        if (rainRef.current) {
          rainRef.current.setSpeed(rainSpeed);
          try {
            rainRef.current.setSubframe?.(true);
            console.log("[LandingPage] Lottie subframe enabled (retry)", { type: "rain" });
          } catch {
          }
          console.log("[LandingPage] Lottie speed set (retry)", { type: "rain", speed: rainSpeed });
        }
      }, 150);
    }
    if (leavesData && leavesRef.current) {
      leavesRef.current.setSpeed(leafSpeed);
      try {
        leavesRef.current.setSubframe?.(true);
        console.log("[LandingPage] Lottie subframe enabled", { type: "leaves" });
      } catch {
      }
      console.log("[LandingPage] Lottie speed set", { type: "leaves", speed: leafSpeed });
    } else if (leavesData && !leavesRef.current) {
      setTimeout(() => {
        if (leavesRef.current) {
          leavesRef.current.setSpeed(leafSpeed);
          try {
            leavesRef.current.setSubframe?.(true);
            console.log("[LandingPage] Lottie subframe enabled (retry)", { type: "leaves" });
          } catch {
          }
          console.log("[LandingPage] Lottie speed set (retry)", { type: "leaves", speed: leafSpeed });
        }
      }, 150);
    }
  }, [rainData, leavesData]);
  useEffect(() => {
    console.log("[LandingPage] footer section configured");
  }, []);
  useEffect(() => {
    let aborted = false;
    console.log("[LandingPage] Lottie fetch start");
    const rainUrl = `${"/"}ফুলমুড়ী_গ্রাম_ল্যান্ডিং_মেঘের_অ্যানিমেশন.json`;
    const leavesUrl = `${"/"}ফুলমুড়ী_গ্রাম_ল্যান্ডিং_পাতার_অ্যানিমেশন.json`;
    console.log("[LandingPage] asset urls", { rainUrl, leavesUrl });
    if (!shouldAnimate) {
      console.log("[LandingPage] skip Lottie fetch due to reduced motion");
      return () => {
        aborted = true;
      };
    }
    fetch(rainUrl).then((r) => r.json()).then((json) => {
      if (!aborted) {
        setRainData(json);
        console.log("[LandingPage] rain JSON loaded", { layers: Array.isArray(json.layers) ? json.layers.length : void 0 });
      }
    }).catch((e) => console.log("[LandingPage] rain JSON load error", e));
    fetch(leavesUrl).then((r) => r.json()).then((json) => {
      if (!aborted) {
        setLeavesData(json);
        console.log("[LandingPage] leaves JSON loaded", { layers: Array.isArray(json.layers) ? json.layers.length : void 0 });
      }
    }).catch((e) => console.log("[LandingPage] leaves JSON load error", e));
    return () => {
      aborted = true;
      console.log("[LandingPage] Lottie fetch aborted");
    };
  }, [shouldAnimate]);
  useEffect(() => {
    const root = seasonsRef.current;
    if (!root) {
      console.log("[LandingPage] seasons section not found");
      return;
    }
    console.log("[LandingPage] init IntersectionObserver for seasons (one-time start)");
    const items = Array.from(root.querySelectorAll(".season-item"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.classList.contains("animated")) {
            el.classList.add("animated");
            console.log("[LandingPage] season animated-start", { text: el.textContent?.trim() });
          }
          const season = el.getAttribute("data-season");
          if (season === "বর্ষা") {
            setRainInView(true);
          }
          if (season === "শরৎ") {
            setLeavesInView(true);
          }
          io.unobserve(el);
        }
      });
    }, { root: null, threshold: 0.6, rootMargin: "0px" });
    items.forEach((el) => io.observe(el));
    return () => {
      items.forEach((el) => io.unobserve(el));
      io.disconnect();
      console.log("[LandingPage] seasons observer disconnected");
    };
  }, []);
  user?.role ? `/${user.role}` : "/member";
  const seoTitle = useMemo(() => "ফুলমুড়ী গ্রাম আমার শেকড়, আমার গর্ব | স্মার্ট গ্রাম", []);
  const seoDescription = useMemo(() => "ফুলমুড়ী গ্রামের অফিসিয়াল প্রোফাইল গ্রামঃ ফুলমুড়ী, ইউনিয়নঃ মুন্সীরহাট, উপজেলাঃ চৌদ্দগ্রাম, জেলাঃ কুমিল্লা, বিভাগঃ চট্টগ্রাম। গ্রামের ভৌগোলিক অবস্থান, মানুষ, কৃষি, শিক্ষা ও সংস্কৃতি সম্পর্কে জানুন।", []);
  const seoCanonical = useMemo(() => "https://fulmurigram.site/", []);
  const seoKeywords = useMemo(() => "ফুলমুড়ী গ্রাম, ফুলমুড়ী, মুন্সীরহাট ইউনিয়ন, চৌদ্দগ্রাম উপজেলা, কুমিল্লা জেলা, চট্টগ্রাম বিভাগ, বাংলাদেশ গ্রাম, ইতিহাস, কৃষি, শিক্ষা, সংস্কৃতি, পল্লীগীতি, নকশিকাঁথা, পিঠা, হাট-বাজার, ধানক্ষেত, উৎসব", []);
  const seoJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "name": "ফুলমুড়ী",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Fulmuri",
          "addressRegion": "Cumilla",
          "addressCountry": "BD"
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Chauddagram (Upazila)",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Cumilla (District)",
            "containedInPlace": { "@type": "AdministrativeArea", "name": "Chattogram (Division)" }
          }
        },
        "sameAs": ["https://amargram.org/fulmuree"]
      },
      {
        "@type": "WebSite",
        "name": "ফুলমুড়ী গ্রাম",
        "url": seoCanonical,
        "inLanguage": "bn-BD",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://fulmurigram.site/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": seoCanonical },
          { "@type": "ListItem", "position": 2, "name": "Explore", "item": seoCanonical + "#features" },
          { "@type": "ListItem", "position": 3, "name": "Profile", "item": seoCanonical + "#profile" },
          { "@type": "ListItem", "position": 4, "name": "Map", "item": seoCanonical + "#contact" }
        ]
      }
    ]
  }), [seoCanonical]);
  const openGraph = useMemo(() => ({
    type: "website",
    title: seoTitle,
    description: seoDescription,
    url: seoCanonical,
    siteName: "আমার গ্রাম | ফুলমুড়ী",
    locale: "bn_BD",
    image: seoCanonical + "ফুলমুড়ী গ্রাম.svg"
  }), [seoTitle, seoDescription, seoCanonical]);
  const twitterCard = useMemo(() => ({
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    image: seoCanonical + "logo_pdf.png"
  }), [seoTitle, seoDescription, seoCanonical]);
  console.log("[LandingPage] SEO prepared", { seoTitle, seoCanonical });
  return /* @__PURE__ */ jsx(BubbleBackground, { interactive: true, isDark, children: /* @__PURE__ */ jsxs("div", { className: `landing-root ${isDark ? "dark" : ""}`, children: [
    /* @__PURE__ */ jsx(
      Meta,
      {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
        canonicalUrl: seoCanonical,
        jsonLd: seoJsonLd,
        openGraph,
        twitterCard
      }
    ),
    /* @__PURE__ */ jsxs("header", { className: "landing-hero", "aria-label": "Village hero", onMouseEnter: () => console.log("[LandingPage] hover hero header"), onMouseLeave: () => console.log("[LandingPage] leave hero header"), children: [
      /* @__PURE__ */ jsx("div", { className: "hero-theme-toggle hero-theme-toggle-fixed", children: /* @__PURE__ */ jsx(ThemeSwitcher, { isDark, onToggle: (next) => {
        console.log("[LandingPage] theme toggle", { next });
        setIsDark(next);
      } }) }),
      /* @__PURE__ */ jsxs("div", { className: "hero-content", onMouseEnter: () => console.log("[LandingPage] hover hero-content"), onMouseLeave: () => console.log("[LandingPage] leave hero-content"), children: [
        /* @__PURE__ */ jsxs("div", { className: "hero-headers", onMouseEnter: () => console.log("[LandingPage] hover hero-headers"), onMouseLeave: () => console.log("[LandingPage] leave hero-headers"), children: [
          /* @__PURE__ */ jsx("h1", { className: "landing-title", children: "ফুলমুড়ী গ্রামে স্বাগতম" }),
          /* @__PURE__ */ jsx("h2", { className: "landing-subtitle", children: "প্রাকৃতিক সৌন্দর্য, সমৃদ্ধ ঐতিহ্য এবং একতার এক অনন্য গ্রাম।" }),
          /* @__PURE__ */ jsx("p", { className: "landing-intro", children: "ফুলমুড়ী · মুন্সীরহাট · চৌদ্দগ্রাম · কুমিল্লা · চট্টগ্রাম" })
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "landing-highlights", role: "list", "aria-label": "Village values", children: [
          /* @__PURE__ */ jsx("li", { className: "pill", children: "প্রকৃতি" }),
          /* @__PURE__ */ jsx("li", { className: "pill", children: "ঐতিহ্য" }),
          /* @__PURE__ */ jsx("li", { className: "pill", children: "কমিউনিটি" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "landing-actions", children: [
          /* @__PURE__ */ jsx("a", { href: "#history", className: "btn-primary", onClick: (e) => {
            e.preventDefault();
            document.getElementById("history").scrollIntoView({ behavior: "smooth" });
          }, children: "গ্রাম দেখুন" }),
          /* @__PURE__ */ jsx(RainbowButton, { to: "/mode-selector", onClick: () => console.log("[LandingPage] CTA click: RainbowButton", { to: "/mode-selector" }), children: "সদস্য পোর্টাল" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "history", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "আমাদের গ্রাম: ফুলমুড়ী" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", children: [
        /* @__PURE__ */ jsxs("p", { className: "section-text", children: [
          /* @__PURE__ */ jsx("strong", { children: "ফুলমুড়ী গ্রাম" }),
          " একটি সাধারণ কৃষিভিত্তিক জনপদ। চারদিকে ফসলের জমি, বাড়িঘরের পাশেই খোলা মাঠ এবং গ্রামের মাঝখানে মাঠের মধ্যে দাঁড়িয়ে থাকা একটি শতবর্ষী বটগাছ আমাদের পরিচয়ের প্রতীক।"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "এখানে একটি কেন্দ্রীয় মসজিদ আছে যেখানে গ্রামের মানুষ একসাথে নামাজ আদায় ও মিলনমেলা করে। কৃষি, শিক্ষা এবং সামাজিক বন্ধন—এই তিনটি ভিত্তিতেই আমাদের দৈনন্দিন জীবন চলে।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "ভোরে মাঠে যাওয়া, বিকেলে হাটে কেনাকাটা এবং সন্ধ্যায় উঠোনে আড্ডা—সরল গ্রামীণ জীবনের ছন্দেই ফুলমুড়ী এগোয়।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "আমাদের গ্রামের সমাজ ব্যবস্থা অত্যন্ত সুশৃঙ্খল ও সৌহার্দ্যপূর্ণ। সুখে-দুখে, উৎসবে-পার্বণে সবাই কাঁধে কাঁধ মিলিয়ে চলে। ঈদের নামাজ শেষে কোলাকুলি কিংবা পূজার সময় একে অপরের বাড়িতে যাওয়া এখানে ধর্ম যার যার, কিন্তু উৎসব সবার। আধুনিকতার ছোঁয়া লাগলেও আমরা আমাদের শেকড়কে ভুলিনি; বরং ঐতিহ্যকে ধারণ করেই আমরা আগামীর পথে এগিয়ে চলেছি।" }),
        /* @__PURE__ */ jsxs("blockquote", { className: "quote-box", children: [
          "“গ্রামের জীবন প্রকৃতির কোলে, নিঃশব্দ শান্তির ঠিকানা। এখানে মানুষে মানুষে ভেদাভেদ নেই, আছে কেবল ভালোবাসার বন্ধন।”",
          /* @__PURE__ */ jsx("footer", { children: "গ্রামের প্রবীণ ব্যক্তিত্ব" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "geography-nature", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ভৌগোলিক ও প্রাকৃতিক পরিবেশ" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", children: [
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "ফুলমুড়ীর ভূপ্রকৃতি সমতল এবং কৃষির অনুকূল। দিগন্তজোড়া ধানক্ষেত, সবজি চাষের জমি ও গ্রামজুড়ে ছড়িয়ে থাকা পুকুর ও খাল—এগুলোই আমাদের বাস্তব চিত্র।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "গ্রীষ্মে মাঠে কাজের ব্যস্ততা, শীতে খেজুরের রস আর কুয়াশা, বর্ষায় সবুজের সমারোহ—ঋতুর পালাবদলে গ্রাম নতুন রূপ পায়।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "পুকুরে মাছ চাষ, গৃহপালিত পশু ও কুটিরশিল্প দিয়ে অনেক পরিবার স্বাবলম্বী। পরিবেশ রক্ষায় গ্রামীণ গাছপালা ও বাগান রয়েছে।" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "vision", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "আমাদের লক্ষ্য ও উদ্দেশ্য" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", style: { marginBottom: "2rem" }, children: [
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "ফুলমুড়ী গ্রামকে একটি আদর্শ ও স্মার্ট গ্রাম হিসেবে গড়ে তোলাই আমাদের মূল লক্ষ্য। আমরা এমন একটি সমাজের স্বপ্ন দেখি যেখানে আধুনিক প্রযুক্তির ছোঁয়া থাকবে, কিন্তু হারিয়ে যাবে না আমাদের শেকড়। শিক্ষা, স্বাস্থ্য এবং কর্মসংস্থানে প্রতিটি মানুষ হবে স্বাবলম্বী।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "আমরা বিশ্বাস করি, টেকসই উন্নয়ন কেবল অবকাঠামোগত পরিবর্তন নয়, বরং মানসিকতার পরিবর্তন। পরিবেশ সুরক্ষা, নারীর ক্ষমতায়ন এবং যুব সমাজের দক্ষতা বৃদ্ধি আমাদের পরিকল্পনার কেন্দ্রবিন্দু। কমিউনিটির সম্মিলিত প্রচেষ্টায় আমরা আমাদের গ্রামকে বিশ্বের দরবারে একটি মডেল ভিলেজ হিসেবে উপস্থাপন করতে চাই।" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "landing-features", children: [
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(BookOpen, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "শিক্ষার প্রসার" }),
          /* @__PURE__ */ jsx("p", { children: "প্রতিটি শিশুর জন্য সুশিক্ষা নিশ্চিত করা এবং ঝরে পড়া রোধে সামাজিক উদ্যোগ গ্রহণ।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "পরিবেশ রক্ষা" }),
          /* @__PURE__ */ jsx("p", { children: "গাছ লাগানো, জলাশয় সংরক্ষণ এবং পরিচ্ছন্ন গ্রাম গড়ার মাধ্যমে পরিবেশের ভারসাম্য রক্ষা।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Users, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "সামাজিক সম্প্রীতি" }),
          /* @__PURE__ */ jsx("p", { children: "পারস্পরিক সহযোগিতা ও শ্রদ্ধাবোধের মাধ্যমে একটি শান্তিপূর্ণ ও সৌহার্দ্যপূর্ণ সমাজ গঠন।" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "seasons", ref: seasonsRef, children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ঋতুচক্র" }),
      /* @__PURE__ */ jsxs("div", { className: "season-grid", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-summer",
            style: { "--fx-delay": ".1s", "--fx-speed": "2.6s" },
            "data-season": "গ্রীষ্ম",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "গ্রীষ্ম" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "গ্রীষ্ম" }),
            children: [
              /* @__PURE__ */ jsx("span", { className: "season-icon", children: /* @__PURE__ */ jsx(Sun, { size: 22 }) }),
              "গ্রীষ্ম",
              /* @__PURE__ */ jsx("span", { className: "fx fx-sun", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-monsoon",
            style: { "--fx-delay": "0s", "--fx-speed": "2.2s" },
            "data-season": "বর্ষা",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "বর্ষা" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "বর্ষা" }),
            children: [
              /* @__PURE__ */ jsx("span", { className: "season-icon", children: /* @__PURE__ */ jsx(CloudRain, { size: 22 }) }),
              "বর্ষা",
              shouldAnimate && rainData && rainInView && /* @__PURE__ */ jsx(
                Lottie,
                {
                  animationData: rainData,
                  loop: true,
                  autoplay: true,
                  className: "fx fx-rain-lottie",
                  lottieRef: rainRef,
                  renderer: "canvas",
                  rendererSettings: { preserveAspectRatio: "xMidYMid slice", progressiveLoad: true },
                  onDOMLoaded: () => {
                    console.log("[LandingPage] rain Lottie DOM loaded");
                    try {
                      rainRef.current?.setSpeed(0.35);
                      rainRef.current?.setSubframe?.(true);
                      rainRef.current?.goToAndPlay?.(0, true);
                      console.log("[LandingPage] Lottie speed set (DOM load)", { type: "rain", speed: 0.35 });
                    } catch (e) {
                      console.log("[LandingPage] rain speed set error", e);
                    }
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-autumn",
            style: { "--fx-delay": ".2s", "--fx-speed": "6.5s" },
            "data-season": "শরৎ",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "শরৎ" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "শরৎ" }),
            children: [
              "শরৎ",
              shouldAnimate && leavesData && leavesInView && /* @__PURE__ */ jsx(
                Lottie,
                {
                  animationData: leavesData,
                  loop: true,
                  autoplay: true,
                  className: "fx fx-leaves-lottie",
                  lottieRef: leavesRef,
                  renderer: "canvas",
                  rendererSettings: { preserveAspectRatio: "xMidYMid slice", progressiveLoad: true },
                  onDOMLoaded: () => {
                    console.log("[LandingPage] leaves Lottie DOM loaded");
                    try {
                      leavesRef.current?.setSpeed(0.35);
                      leavesRef.current?.setSubframe?.(true);
                      leavesRef.current?.goToAndPlay?.(0, true);
                      console.log("[LandingPage] Lottie speed set (DOM load)", { type: "leaves", speed: 0.35 });
                    } catch (e) {
                      console.log("[LandingPage] leaves speed set error", e);
                    }
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-hemanta",
            style: { "--fx-delay": ".15s", "--fx-speed": "10s" },
            "data-season": "হেমন্ত",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "হেমন্ত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "হেমন্ত" }),
            children: [
              "হেমন্ত",
              /* @__PURE__ */ jsx("span", { className: "fx fx-stripes", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-winter",
            style: { "--fx-delay": ".3s", "--fx-speed": "6.8s" },
            "data-season": "শীত",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "শীত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "শীত" }),
            children: [
              "শীত",
              /* @__PURE__ */ jsx("span", { className: "fx fx-snow", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "season-item season-spring",
            style: { "--fx-delay": ".25s", "--fx-speed": "6s" },
            "data-season": "বসন্ত",
            onMouseEnter: () => console.debug("[LandingPage] hover season", { season: "বসন্ত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave season", { season: "বসন্ত" }),
            children: [
              "বসন্ত",
              /* @__PURE__ */ jsx("span", { className: "fx fx-blossom", "aria-hidden": "true" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "gallery", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ছবির গ্যালারি" }),
      /* @__PURE__ */ jsx("p", { className: "section-text", children: "গ্রামের জীবনের প্রতিচ্ছবি ভোরের সোনালী সূর্য থেকে উৎসবের রাত।" }),
      /* @__PURE__ */ jsxs("div", { className: "gallery-tabs", children: [
        /* @__PURE__ */ jsx("button", { className: "pill active", children: "সব" }),
        /* @__PURE__ */ jsx("button", { className: "pill", children: "প্রকৃতি" }),
        /* @__PURE__ */ jsx("button", { className: "pill", children: "জীবনযাত্রা" }),
        /* @__PURE__ */ jsx("button", { className: "pill", children: "উৎসব" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "gallery-grid-new", children: [
        /* @__PURE__ */ jsxs("div", { className: "gallery-card", children: [
          /* @__PURE__ */ jsx("div", { className: "gallery-img-placeholder nature", children: /* @__PURE__ */ jsx(Sun, {}) }),
          /* @__PURE__ */ jsx("div", { className: "gallery-caption", children: "নদীর তীরে সূর্যাস্ত" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "gallery-card", children: [
          /* @__PURE__ */ jsx("div", { className: "gallery-img-placeholder life", children: /* @__PURE__ */ jsx(Sprout, {}) }),
          /* @__PURE__ */ jsx("div", { className: "gallery-caption", children: "ধান কাটার মৌসুম" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "gallery-card", children: [
          /* @__PURE__ */ jsx("div", { className: "gallery-img-placeholder festival", children: /* @__PURE__ */ jsx(Users, {}) }),
          /* @__PURE__ */ jsx("div", { className: "gallery-caption", children: "পিঠা উৎসব" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "gallery-card", children: [
          /* @__PURE__ */ jsx("div", { className: "gallery-img-placeholder nature", children: /* @__PURE__ */ jsx(Sprout, {}) }),
          /* @__PURE__ */ jsx("div", { className: "gallery-caption", children: "সবুজ ধানক্ষেত" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "tourism", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ফুলমুড়ী ভ্রমণ" }),
      /* @__PURE__ */ jsxs("div", { className: "tourism-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "tourism-card", children: [
          /* @__PURE__ */ jsx("h3", { children: "দর্শনীয় স্থান" }),
          /* @__PURE__ */ jsxs("ul", { className: "check-list", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "শতবর্ষী বটগাছ:" }),
              " মাঠের মাঝে দাঁড়িয়ে থাকা ইতিহাসের জীবন্ত সাক্ষী।"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "কেন্দ্রীয় মসজিদ:" }),
              " গ্রামের পরিচ্ছন্ন ধর্মীয় কেন্দ্র।"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "ফসলের ক্ষেত:" }),
              " ধান ও সবজির প্রান্তর।"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "পুকুর ও বিল:" }),
              " গ্রামীণ জলাশয় ও হাঁটাচলার পথ।"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: "গ্রামের হাট:" }),
              " সাপ্তাহিক কেনাকাটার কেন্দ্র।"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "tourism-card highlight", children: [
          /* @__PURE__ */ jsx("h3", { children: "ভ্রমণ টিপস" }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "ভ্রমণের সেরা সময়:" }),
            " শীতকাল (নভেম্বর-ফেব্রুয়ারি) খেজুরের রস ও পিঠার জন্য, অথবা বর্ষাকাল (জুন-আগস্ট) সবুজের সমারোহ দেখতে।"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "থাকার ব্যবস্থা:" }),
            " স্থানীয়দের আতিথেয়তায় হোমস্টে করার সুযোগ রয়েছে।"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "যাতায়াত:" }),
            " চৌদ্দগ্রাম সদরের যেকোনো স্থান থেকে রিকশা বা অটোরিকশায় সহজে আসা যায়।"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "agriculture-details", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "কৃষি ও মৌসুমি ফসল" }),
      /* @__PURE__ */ jsxs("div", { className: "crop-grid", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "crop-item crop-summer",
            "data-season": "গ্রীষ্ম",
            onMouseEnter: () => console.debug("[LandingPage] hover crop", { season: "গ্রীষ্ম" }),
            onMouseLeave: () => console.debug("[LandingPage] leave crop", { season: "গ্রীষ্ম" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
                /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sun, { size: 18 }) }),
                "গ্রীষ্ম"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "crop-body", children: "বেগুন, লাউ, করলা, শসা" }),
              /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "crop-item crop-monsoon",
            "data-season": "বর্ষা",
            onMouseEnter: () => console.debug("[LandingPage] hover crop", { season: "বর্ষা" }),
            onMouseLeave: () => console.debug("[LandingPage] leave crop", { season: "বর্ষা" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
                /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(CloudRain, { size: 18 }) }),
                "বর্ষা"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "crop-body", children: "ধান, কচু, ডাল জাতীয়" }),
              /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "crop-item crop-autumn",
            "data-season": "শরৎ/হেমন্ত",
            onMouseEnter: () => console.debug("[LandingPage] hover crop", { season: "শরৎ/হেমন্ত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave crop", { season: "শরৎ/হেমন্ত" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
                /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
                "শরৎ/হেমন্ত"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "crop-body", children: "ধান কাটার মৌসুম, আলু চাষ" }),
              /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "crop-item crop-winter",
            "data-season": "শীত",
            onMouseEnter: () => console.debug("[LandingPage] hover crop", { season: "শীত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave crop", { season: "শীত" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
                /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
                "শীত"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "crop-body", children: "মটর, বাঁধাকপি, ফুলকপি" }),
              /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "crop-item crop-spring",
            "data-season": "বসন্ত",
            onMouseEnter: () => console.debug("[LandingPage] hover crop", { season: "বসন্ত" }),
            onMouseLeave: () => console.debug("[LandingPage] leave crop", { season: "বসন্ত" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
                /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
                "বসন্ত"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "crop-body", children: "মৌসুমি ফলফলাদি" }),
              /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "economy", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "অর্থনীতি ও জীবিকা" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", children: [
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "ফুলমুড়ী গ্রামের অর্থনীতির মূল চালিকাশক্তি কৃষি। গ্রামের প্রায় ৮০ শতাংশ মানুষ প্রত্যক্ষ বা পরোক্ষভাবে কৃষিকাজের সাথে জড়িত। উর্বর মাটি এবং পর্যাপ্ত সেচ ব্যবস্থার কারণে এখানে বছরে তিনবার ফসল ফলে। ধানের পাশাপাশি রবিশস্য যেমন সরিষা, তিল এবং বিভিন্ন শাকসবজির চাষাবাদ এখানকার কৃষকদের স্বাবলম্বী করে তুলেছে।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "কৃষির পাশাপাশি মৎস্যচাষ ও পশুপালন গ্রামের অর্থনীতিতে গুরুত্বপূর্ণ ভূমিকা রাখে। প্রতিটি বাড়িতেই হাঁস-মুরগি ও গবাদিপশু পালন করা হয়, যা পারিবারিক পুষ্টির চাহিদা মেটানোর পাশাপাশি বাড়তি আয়ের উৎস। গ্রামের যুব সমাজের অনেকেই এখন আধুনিক পদ্ধতিতে মাছ চাষ ও ডেইরি ফার্ম গড়ে তুলছে।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "কুটির শিল্প ও ক্ষুদ্র ব্যবসা গ্রামের মানুষের আয়ের আরেকটি বড় মাধ্যম। বাঁশ ও বেতের তৈরি ডালা, কুলা, চালুন ইত্যাদি স্থানীয় হাট-বাজারে বিক্রি হয়। তাছাড়া গ্রামের মোড়ে মোড়ে গড়ে ওঠা ছোট ছোট দোকানগুলো গ্রামীণ বাণিজ্যের কেন্দ্রবিন্দু। নারীরাও ঘরে বসে নকশিকাঁথা সেলাই ও হস্তশিল্পের মাধ্যমে সংসারে সচ্ছলতা ফিরিয়ে আনছে।" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "youth", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "যুব সমাজ ও স্বেচ্ছাসেবা" }),
      /* @__PURE__ */ jsx("p", { className: "section-text", children: "ফুলমুড়ী গ্রামের যুব সমাজ গ্রামের উন্নয়নে অগ্রণী ভূমিকা পালন করে। শিক্ষা, খেলাধুলা এবং সমাজসেবায় তাদের অবদান অনস্বীকার্য।" }),
      /* @__PURE__ */ jsxs("div", { className: "landing-features", children: [
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Users, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "স্বেচ্ছাসেবী সংগঠন" }),
          /* @__PURE__ */ jsx("p", { children: "রক্তদান কর্মসূচি, পরিচ্ছন্নতা অভিযান এবং দুর্যোগ মোকাবিলায় যুবকদের সক্রিয় অংশগ্রহণ।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "নিরাপত্তা ও শৃঙ্খলা" }),
          /* @__PURE__ */ jsx("p", { children: "গ্রামের শান্তি-শৃঙ্খলা রক্ষায় এবং মাদকবিরোধী অভিযানে যুব সমাজের দৃঢ় অবস্থান।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Megaphone, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "সাংস্কৃতিক চর্চা" }),
          /* @__PURE__ */ jsx("p", { children: "নাটক, গান এবং খেলাধুলার মাধ্যমে সুস্থ বিনোদন ও সংস্কৃতির বিকাশ।" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "cuisine", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ঐতিহ্যবাহী খাবার" }),
      /* @__PURE__ */ jsxs("div", { className: "crop-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "crop-item crop-winter", children: [
          /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
            /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sun, { size: 18 }) }),
            "শীতের পিঠা"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "crop-body", children: "ভাপা পিঠা, চিতই পিঠা এবং খেজুরের রস।" }),
          /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "crop-item crop-monsoon", children: [
          /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
            /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(CloudRain, { size: 18 }) }),
            "দেশি মাছ"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "crop-body", children: "তাজা ইলিশ, কই এবং শিং মাছের ঝোল।" }),
          /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "crop-item crop-summer", children: [
          /* @__PURE__ */ jsxs("div", { className: "crop-title", children: [
            /* @__PURE__ */ jsx("span", { className: "crop-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
            "মৌসুমি ফল"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "crop-body", children: "আম, কাঁঠাল এবং লিচুর সমারোহ।" }),
          /* @__PURE__ */ jsx("span", { className: "crop-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "smart-services", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "স্মার্ট সেবা" }),
      /* @__PURE__ */ jsx("p", { className: "section-text", style: { marginBottom: "2rem" }, children: "ডিজিটাল যুগে ফুলমুড়ী গ্রামও পিছিয়ে নেই। তথ্যপ্রযুক্তির ছোঁয়ায় নাগরিক সেবা এখন হাতের মুঠোয়।" }),
      /* @__PURE__ */ jsxs("div", { className: "landing-features", children: [
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Wifi, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "অনলাইন তথ্য" }),
          /* @__PURE__ */ jsx("p", { children: "জন্ম-মৃত্যু নিবন্ধন এবং নাগরিক সনদের তথ্য সহায়তা।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(HeartPulse, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "ই-স্বাস্থ্য সেবা" }),
          /* @__PURE__ */ jsx("p", { children: "টেলিমেডিসিন এবং জরুরি স্বাস্থ্য পরামর্শ।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Monitor, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "ডিজিটাল শিক্ষা" }),
          /* @__PURE__ */ jsx("p", { children: "অনলাইন ক্লাস এবং ফ্রিল্যান্সিং প্রশিক্ষণের ব্যবস্থা।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "feature-card", children: [
          /* @__PURE__ */ jsx("div", { className: "feature-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 20 }) }),
          /* @__PURE__ */ jsx("h3", { children: "স্মার্ট কৃষি" }),
          /* @__PURE__ */ jsx("p", { children: "আধুনিক কৃষি প্রযুক্তি এবং আবহাওয়া বার্তা।" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "institutions", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "শিক্ষা ও সামাজিক প্রতিষ্ঠান" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", style: { marginBottom: "2rem" }, children: [
        /* @__PURE__ */ jsx("p", { className: "section-text", children: '"শিক্ষাই জাতির মেরুদণ্ড" এই মন্ত্রে দীক্ষিত ফুলমুড়ী গ্রামের মানুষ। গ্রামের প্রতিটি শিশু যাতে শিক্ষার আলোয় আলোকিত হতে পারে, সে লক্ষ্যে এখানে গড়ে উঠেছে একাধিক শিক্ষা প্রতিষ্ঠান। সকালবেলা মক্তবের কচি-কাঁচা শিক্ষার্থীদের কলকাকলি আর স্কুলগামী ছাত্রছাত্রীদের পদচারণায় গ্রাম মুখরিত হয়ে ওঠে।' }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "শুধু প্রাতিষ্ঠানিক শিক্ষা নয়, নৈতিক ও ধর্মীয় শিক্ষার প্রতিও এখানে বিশেষ গুরুত্ব দেওয়া হয়। গ্রামের পাঠাগারটি জ্ঞানপিপাসু মানুষের মিলনমেলা। বিকেলে সেখানে বসে সাহিত্য ও বিশ্ব পরিস্থিতি নিয়ে আলোচনা যা গ্রামের মানুষের চিন্তাশীলতার পরিচয় দেয়।" })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "inst-list", children: [
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-institutions", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "institutions", item: "প্রাথমিক বিদ্যালয়" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "institutions", item: "প্রাথমিক বিদ্যালয়" }), children: [
          /* @__PURE__ */ jsxs("h5", { children: [
            /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) }),
            "প্রাথমিক বিদ্যালয়"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "গ্রামের শিশুদের প্রাথমিক শিক্ষা কেন্দ্র।" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-institutions", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "institutions", item: "মাদ্রাসা" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "institutions", item: "মাদ্রাসা" }), children: [
          /* @__PURE__ */ jsxs("h5", { children: [
            /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) }),
            "মাদ্রাসা"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "ধর্মীয় ও সাধারণ শিক্ষার সমন্বয়।" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-institutions", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "institutions", item: "মসজিদ/ঈদগাহ" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "institutions", item: "মসজিদ/ঈদগাহ" }), children: [
          /* @__PURE__ */ jsxs("h5", { children: [
            /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Landmark, { size: 18 }) }),
            "মসজিদ/ঈদগাহ"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "ধর্মীয় অনুশাসন ও সামাজিক বন্ধন।" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-institutions", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "institutions", item: "স্বাস্থ্য কেন্দ্র" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "institutions", item: "স্বাস্থ্য কেন্দ্র" }), children: [
          /* @__PURE__ */ jsxs("h5", { children: [
            /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }) }),
            "স্বাস্থ্য কেন্দ্র"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "প্রাথমিক চিকিৎসা ও জনস্বাস্থ্য সচেতনতা।" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-institutions", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "institutions", item: "হাট-বাজার" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "institutions", item: "হাট-বাজার" }), children: [
          /* @__PURE__ */ jsxs("h5", { children: [
            /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Megaphone, { size: 18 }) }),
            "হাট-বাজার"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "স্থানীয় অর্থনীতি ও জীবিকার কেন্দ্র।" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "language", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "ভাষা ও অভিধান" }),
      /* @__PURE__ */ jsx("p", { className: "section-text", children: "কুমিল্লা অঞ্চলের আঞ্চলিক ভাষার স্বাদ উচ্চারণে মিঠে টান, শব্দে গ্রামীণ রঙ। লোকগাথা ও প্রবাদে ফুটে ওঠে ফুলমুড়ীর সাংস্কৃতিক পরিচয়।" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "crafts", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "কারুশিল্প ও জীবিকা" }),
      /* @__PURE__ */ jsxs("ul", { className: "why-list", children: [
        /* @__PURE__ */ jsx("li", { children: "নকশিকাঁথা ও সেলাই" }),
        /* @__PURE__ */ jsx("li", { children: "মৃৎশিল্প ও বাঁশ-বেত" }),
        /* @__PURE__ */ jsx("li", { children: "কৃষি, দোকানদারি ও ক্ষুদ্র উদ্যোগ" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "people", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "প্রতিভা ও সম্মাননা" }),
      /* @__PURE__ */ jsxs("div", { className: "notable-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "notable-item ui-card card-people", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "people", item: "শিক্ষক" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "people", item: "শিক্ষক" }), onClick: () => console.log("[LandingPage] click notable: teacher"), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Users, { size: 18 }) }),
          "শিক্ষক কমিউনিটি লিডার",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "notable-item ui-card card-people", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "people", item: "কৃষক" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "people", item: "কৃষক" }), onClick: () => console.log("[LandingPage] click notable: farmer"), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Users, { size: 18 }) }),
          "কৃষক স্থানীয় উদ্ভাবক",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "notable-item ui-card card-people", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "people", item: "কারিগর" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "people", item: "কারিগর" }), onClick: () => console.log("[LandingPage] click notable: artisan"), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Users, { size: 18 }) }),
          "কারিগর হস্তশিল্পী",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "panel transparent-panel",
        id: "community-sphere",
        ref: landingSphereRef,
        onMouseEnter: () => console.log("[LandingPage] hover community-sphere"),
        onMouseLeave: () => console.log("[LandingPage] leave community-sphere"),
        children: [
          /* @__PURE__ */ jsx("h2", { className: "section-title", children: "আমাদের কমিউনিটি" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "360px", overflow: "hidden", padding: "0.5rem 0" }, children: [
            (() => {
              console.log("[LandingPage] render ImgSphere block", { count: sphereImages.length });
              return null;
            })(),
            sphereImages.length > 0 ? /* @__PURE__ */ jsx(
              SphereImageGrid,
              {
                images: sphereImages,
                containerSize: 320,
                sphereRadius: 150,
                autoRotate: true,
                autoRotateSpeed: 0.5
              }
            ) : /* @__PURE__ */ jsx("div", { className: "section-text", children: "সদস্য লোড হচ্ছে..." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { id: "profile", className: "panel", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "গ্রামের পরিচিতি" }),
      /* @__PURE__ */ jsx("p", { className: "section-text", children: "ফুলমুড়ী গ্রামের পরিচিতি ভূ-প্রকৃতি, মানুষ, কৃষি, শিক্ষা ও সংস্কৃতি। স্থানীয় ইতিহাস, ঐতিহ্য এবং কমিউনিটির দৈনন্দিন জীবন এখানে তুলে ধরা হয়।" }),
      /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "section-text", children: "Loading info…" }), children: /* @__PURE__ */ jsx(
        InfoGrid,
        {
          facts: [
            { label: "গ্রাম", value: "ফুলমুড়ী" },
            { label: "ইউনিয়ন", value: "মুন্সীরহাট" },
            { label: "উপজেলা", value: "চৌদ্দগ্রাম" },
            { label: "জেলা", value: "কুমিল্লা" },
            { label: "বিভাগ", value: "চট্টগ্রাম" }
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "কেন এই ভিলেজ পোর্টাল" }),
      /* @__PURE__ */ jsxs("ul", { className: "why-list", children: [
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-why", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "why", item: "ডিজিটাল প্রোফাইল" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "why", item: "ডিজিটাল প্রোফাইল" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }) }),
          "ডিজিটাল প্রোফাইল ও তথ্য",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-why", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "why", item: "লোকেশন ও মানচিত্র" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "why", item: "লোকেশন ও মানচিত্র" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(MapPin, { size: 18 }) }),
          "লোকেশন ও মানচিত্র",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-why", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "why", item: "ইতিহাস ও ঐতিহ্য" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "why", item: "ইতিহাস ও ঐতিহ্য" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Landmark, { size: 18 }) }),
          "ইতিহাস ও ঐতিহ্য",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-why", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "why", item: "কৃষি ও জীবিকা" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "why", item: "কৃষি ও জীবিকা" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
          "কৃষি ও জীবিকা",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-why", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "why", item: "শিক্ষা ও সামাজিক প্রতিষ্ঠান" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "why", item: "শিক্ষা ও সামাজিক প্রতিষ্ঠান" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) }),
          "শিক্ষা ও সামাজিক প্রতিষ্ঠান",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "testimonials", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "আমাদের গ্রামের কথা" }),
      /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "section-text", children: "Loading testimonials…" }), children: /* @__PURE__ */ jsx(
        Testimonials,
        {
          items: [
            { quote: "ফুলমুড়ী আমাদের শেকড় ঐতিহ্য ও সংস্কৃতির গ্রাম।", author: "বাসিন্দা, ফুলমুড়ী" },
            { quote: "কৃষি ও কমিউনিটি আমাদের জীবনের প্রধান অংশ।", author: "স্থানীয়, ফুলমুড়ী" },
            { quote: "শিক্ষা ও সামাজিক প্রতিষ্ঠান গ্রামের উন্নয়নে অবদান রাখছে।", author: "শিক্ষার্থী, ফুলমুড়ী" }
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "landing-stats", children: [
      /* @__PURE__ */ jsxs("div", { className: "stat-card ui-card card-stats", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "stats", item: "লোকসংখ্যা" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "stats", item: "লোকসংখ্যা" }), children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-value", children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Users, { size: 18 }) }),
          /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("span", { children: "…" }), children: /* @__PURE__ */ jsx(StatsCounter, { value: 1403, suffix: "" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-label", children: "লোকসংখ্যা" }),
        /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stat-card ui-card card-stats", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "stats", item: "শিক্ষা প্রতিষ্ঠান" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "stats", item: "শিক্ষা প্রতিষ্ঠান" }), children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-value", children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) }),
          /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("span", { children: "…" }), children: /* @__PURE__ */ jsx(StatsCounter, { value: 3, suffix: "+" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-label", children: "শিক্ষা প্রতিষ্ঠান" }),
        /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "faq", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "প্রশ্নোত্তর" }),
      /* @__PURE__ */ jsx("div", { className: "section-text", children: "ফুলমুড়ী গ্রামের অবস্থান, ইতিহাস, কৃষি ও শিক্ষাসংক্রান্ত সাধারণ প্রশ্নের উত্তর।" }),
      /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "section-text", children: "Loading FAQ…" }), children: /* @__PURE__ */ jsx(
        FaqAccordion,
        {
          items: [
            { question: "ফুলমুড়ী কোথায় অবস্থিত?", answer: "মুন্সীরহাট ইউনিয়ন, চৌদ্দগ্রাম উপজেলা, কুমিল্লা জেলা, চট্টগ্রাম বিভাগ।" },
            { question: "কৃষি প্রধান ফসল কী?", answer: "ধানসহ মৌসুমি ফসল; স্থানীয় কৃষির বৈশিষ্ট্য অনুযায়ী পরিবর্তিত।" },
            { question: "শিক্ষা প্রতিষ্ঠান কী কী আছে?", answer: "স্কুল, মাদ্রাসা ও সামাজিক প্রতিষ্ঠান বিস্তারিত প্রোফাইলে দেখুন।" },
            { question: "গ্রামের মানচিত্র কোথায়?", answer: "লোকেশন সেকশনে মানচিত্র ও দিকনির্দেশনা পাওয়া যাবে।" }
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "contact", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "যোগাযোগ ও ঠিকানা" }),
      /* @__PURE__ */ jsxs("div", { className: "contact-layout", children: [
        /* @__PURE__ */ jsxs("div", { className: "contact-form-wrapper", children: [
          /* @__PURE__ */ jsx("p", { className: "section-text", children: "আমরা আপনার কথা শুনতে চাই! গ্রাম সম্পর্কে প্রশ্ন, ভ্রমণ বা যেকোনো তথ্যের জন্য যোগাযোগ করুন।" }),
          /* @__PURE__ */ jsxs("form", { className: "contact-form", onSubmit: (e) => {
            e.preventDefault();
            console.log("[LandingPage] contact form submit");
          }, children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "c-name", children: "আপনার নাম" }),
              /* @__PURE__ */ jsx("input", { type: "text", id: "c-name", className: "form-input", placeholder: "আপনার নাম লিখুন" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "c-email", children: "ইমেইল ঠিকানা" }),
              /* @__PURE__ */ jsx("input", { type: "email", id: "c-email", className: "form-input", placeholder: "আপনার ইমেইল" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "c-msg", children: "আপনার বার্তা" }),
              /* @__PURE__ */ jsx("textarea", { id: "c-msg", className: "form-input", rows: "4", placeholder: "আপনার বার্তা লিখুন..." })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "btn-primary full-width", children: "বার্তা পাঠান" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "social-links", children: [
            /* @__PURE__ */ jsxs("a", { href: "#", className: "social-btn fb", onClick: (e) => e.preventDefault(), children: [
              /* @__PURE__ */ jsx(Globe, { size: 18, style: { marginRight: "8px" } }),
              " Facebook"
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "#", className: "social-btn wa", onClick: (e) => e.preventDefault(), children: [
              /* @__PURE__ */ jsx(MessageCircle, { size: 18, style: { marginRight: "8px" } }),
              " WhatsApp"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "map-wrapper", children: [
          /* @__PURE__ */ jsx("h3", { className: "section-subtitle", children: "আমাদের ঠিকানা" }),
          /* @__PURE__ */ jsx("p", { className: "section-text-sm", children: "ফুলমুড়ী মুন্সীরহাট ইউনিয়ন, চৌদ্দগ্রাম, কুমিল্লা।" }),
          /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "section-text", children: "Loading map…" }), children: /* @__PURE__ */ jsx(MapBlock, {}) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "culture", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "লোকসংস্কৃতি ও ঐতিহ্য" }),
      /* @__PURE__ */ jsxs("div", { className: "section-content", style: { marginBottom: "2rem" }, children: [
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "বাঙালির হাজার বছরের সংস্কৃতি ফুলমুড়ী গ্রামের পরতে পরতে মিশে আছে। বর্ষায় নৌকাবাইচ, শীতে পিঠা উৎসব, আর চৈত্র সংক্রান্তির মেলা এ যেন বারো মাসে তেরো পার্বণ। সন্ধ্যার পর গ্রামের উঠোনে বসে দাদী-নানীদের মুখে রূপকথার গল্প শোনা কিংবা পুঁথি পাঠের আসর আজও আমাদের মনে করিয়ে দেয় সেই সোনালী অতীতের কথা।" }),
        /* @__PURE__ */ jsx("p", { className: "section-text", children: "গ্রামের নারীদের হাতে বোনা নকশিকাঁথায় ফুটে ওঠে জীবনের সুখ-দুঃখের গল্প। মাটির তৈরি তৈজসপত্র আর বাঁশের কারুকাজ প্রমাণ করে আমাদের কারিগরদের নিপুণতা। এখানে জারি, সারি আর ভাটিয়ালি গানের সুরে মাঝিরা যখন নৌকা বায়, তখন প্রকৃতিও যেন সেই সুরে নেচে ওঠে।" })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "why-list", children: [
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-culture", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "culture", item: "পল্লীগীতি" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "culture", item: "পল্লীগীতি" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            console.log("[LandingPage] click culture: folk-song");
          }, children: "পল্লীগীতি ও লোকসঙ্গীত" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-culture", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "culture", item: "নকশিকাঁথা" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "culture", item: "নকশিকাঁথা" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            console.log("[LandingPage] click culture: nakshi-katha");
          }, children: "নকশিকাঁথা ও হস্তশিল্প" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-culture", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "culture", item: "গ্রামীণ খেলাধুলা" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "culture", item: "গ্রামীণ খেলাধুলা" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            console.log("[LandingPage] click culture: village-games");
          }, children: "গ্রামীণ খেলাধুলা" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-culture", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "culture", item: "উৎসব" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "culture", item: "উৎসব" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sprout, { size: 18 }) }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => {
            e.preventDefault();
            console.log("[LandingPage] click culture: festivals");
          }, children: "উৎসব ও মিলনমেলা" }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "nature", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "প্রাকৃতিক নিদর্শন" }),
      /* @__PURE__ */ jsxs("ul", { className: "why-list", children: [
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-nature", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "nature", item: "ধানক্ষেত" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "nature", item: "ধানক্ষেত" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sun, { size: 18 }) }),
          "ধানক্ষেত ও সবুজ প্রান্তর",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-nature", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "nature", item: "পুকুর" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "nature", item: "পুকুর" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(CloudRain, { size: 18 }) }),
          "পুকুর, বিল ও জলাশয়",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-nature", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "nature", item: "বটগাছ" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "nature", item: "বটগাছ" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(Sun, { size: 18 }) }),
          "বটগাছ, শ্বেতছায়া ও গ্রামের পথ",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-nature", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "nature", item: "কুয়াশা" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "nature", item: "কুয়াশা" }), children: [
          /* @__PURE__ */ jsx("span", { className: "ui-card-icon", children: /* @__PURE__ */ jsx(CloudRain, { size: 18 }) }),
          "ভোরের কুয়াশা ও সন্ধ্যার হাওয়া",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "market", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "হাট-বাজার দিন" }),
      /* @__PURE__ */ jsxs("ul", { className: "step-list", children: [
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-market", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "market", item: "Mon" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "market", item: "Mon" }), children: [
          /* @__PURE__ */ jsx("span", { className: "step-badge", children: "Mon" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h5", { children: "মুন্সীরহাট" }),
            /* @__PURE__ */ jsx("p", { children: "সবজি ও মাছের বাজার সকাল থেকে দুপুর।" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-market", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "market", item: "Thu" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "market", item: "Thu" }), children: [
          /* @__PURE__ */ jsx("span", { className: "step-badge", children: "Thu" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h5", { children: "চৌদ্দগ্রাম" }),
            /* @__PURE__ */ jsx("p", { children: "কৃষি উপকরণ ও দৈনন্দিন বাজার দুপুর থেকে বিকাল।" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "ui-card card-market", onMouseEnter: () => console.log("[LandingPage] hover card", { section: "market", item: "Sat" }), onMouseLeave: () => console.log("[LandingPage] leave card", { section: "market", item: "Sat" }), children: [
          /* @__PURE__ */ jsx("span", { className: "step-badge", children: "Sat" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h5", { children: "স্থানীয় হাট" }),
            /* @__PURE__ */ jsx("p", { children: "গৃহস্থালি জিনিস ও হস্তশিল্প সাপ্তাহিক আড্ডা।" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel", id: "festival", children: [
      /* @__PURE__ */ jsx("h2", { className: "section-title", children: "উৎসবের ক্যালেন্ডার" }),
      /* @__PURE__ */ jsxs("div", { className: "festival-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "festival-item ui-card card-festival", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "festival", item: "বৈশাখ নবান্ন" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "festival", item: "বৈশাখ নবান্ন" }), children: [
          "বৈশাখ নবান্ন",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "festival-item ui-card card-festival", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "festival", item: "জিলহজ কোরবানি" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "festival", item: "জিলহজ কোরবানি" }), children: [
          "জিলহজ কোরবানি",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "festival-item ui-card card-festival", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "festival", item: "শাবান/রমজান ইফতার মিলন" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "festival", item: "শাবান/রমজান ইফতার মিলন" }), children: [
          "শাবান/রমজান ইফতার মিলন",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "festival-item ui-card card-festival", onMouseEnter: () => console.debug("[LandingPage] hover card", { section: "festival", item: "ফাল্গুন বসন্ত উৎসব" }), onMouseLeave: () => console.debug("[LandingPage] leave card", { section: "festival", item: "ফাল্গুন বসন্ত উৎসব" }), children: [
          "ফাল্গুন বসন্ত উৎসব",
          /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "landing-footer", children: /* @__PURE__ */ jsxs("div", { className: "footer-bottom", children: [
      /* @__PURE__ */ jsx("img", { src: "/ফুলমুড়ী_গ্রাম.svg", alt: "ফুলমুড়ী গ্রাম লোগো", className: "footer-logo", onClick: () => console.log("[LandingPage] footer logo click") }),
      /* @__PURE__ */ jsx("div", { className: "footer-copy", children: "© 2026 ফুলমুড়ী গ্রাম" }),
      /* @__PURE__ */ jsx("div", { className: "footer-meta", children: "স্মার্ট গ্রাম | কমিউনিটি পোর্টাল" })
    ] }) }),
    /* @__PURE__ */ jsx(FeedbackButton, {})
  ] }) });
}
const openReceiptPdf = async (transaction) => {
  console.log("pdfReceipt: open start", transaction);
  const doc2 = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const pxToMm = (px) => px * 25.4 / 96;
  const loadFontAsBase64 = async (url2) => {
    const res = await fetch(url2);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };
  const ensureBengaliFont = async () => {
    try {
      console.log("pdfReceipt: font load");
      const base64 = await loadFontAsBase64("/fonts/NotoSansBengali-Regular.ttf");
      doc2.addFileToVFS("NotoSansBengali-Regular.ttf", base64);
      doc2.addFont("NotoSansBengali-Regular.ttf", "NotoSansBengali", "normal");
      doc2.setFont("NotoSansBengali", "normal");
    } catch (e) {
      console.log("pdfReceipt: font load failed", e);
      doc2.setFont("helvetica", "normal");
    }
  };
  const renderBanglaTextImage = async (text, fontSizePx = 12) => {
    try {
      const fontFace = new FontFace("NotoSansBengaliInline", "url(/fonts/NotoSansBengali-Regular.ttf)");
      await fontFace.load();
      document.fonts.add(fontFace);
      await document.fonts.ready;
      const scale = 4;
      const tmp = document.createElement("canvas").getContext("2d");
      tmp.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
      const m = tmp.measureText(text);
      const ascent = Math.ceil(m.actualBoundingBoxAscent || fontSizePx * 0.8);
      const descent = Math.ceil(m.actualBoundingBoxDescent || fontSizePx * 0.2);
      const w = Math.ceil(m.width) + 8;
      const h = ascent + descent + 6;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.fillStyle = "#000";
      ctx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, 0, ascent);
      const dataUrl = canvas.toDataURL("image/png");
      return { dataUrl, wMm: pxToMm(w), hMm: pxToMm(h) };
    } catch (e) {
      console.log("pdfReceipt: renderBanglaTextImage failed", e);
      return null;
    }
  };
  const getGeneratedAtText = () => {
    const d = /* @__PURE__ */ new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hh = String(hours).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const s = `Generated by fulmurigram.site on ${yyyy}-${mm}-${dd} at ${hh}:${min} ${ampm}`;
    console.log("pdfReceipt: footer text", s);
    return s;
  };
  const drawHeader = async () => {
    const pageWidth = doc2.internal.pageSize.getWidth();
    const titleImg = await renderBanglaTextImage("লেনদেন রসিদ", 14);
    if (titleImg) {
      const x = pageWidth / 2 - titleImg.wMm / 2;
      doc2.addImage(titleImg.dataUrl, "PNG", x, 18, titleImg.wMm, titleImg.hMm);
    }
  };
  const drawBody = async () => {
    doc2.setDrawColor(220);
    doc2.setFontSize(9);
    const pageWidth = doc2.internal.pageSize.getWidth();
    const contentWidth = Math.min(120, pageWidth - 20);
    const contentX = (pageWidth - contentWidth) / 2;
    const startY = 28;
    const rows = [
      ["সদস্য", transaction.memberName || "অজানা সদস্য"],
      ["ধরন", transaction.type || transaction.transactionType || "other"],
      ["পরিমাণ", `৳ ${(transaction.amount || 0).toLocaleString("bn-BD")}`],
      ["পেমেন্ট পদ্ধতি", transaction.paymentMethod || "cash"],
      ["তারিখ/সময়", `${transaction.date ? new Date(transaction.date).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : ""}${transaction.time ? ` • ${transaction.time}` : ""}`],
      ["রেফারেন্স", transaction.reference || ""],
      ["প্রক্রিয়াকারী", transaction.processedBy || "ক্যাশিয়ার"]
    ];
    let y = startY;
    for (const [label, value] of rows) {
      const labelImg = await renderBanglaTextImage(String(label), 10);
      if (labelImg) doc2.addImage(labelImg.dataUrl, "PNG", contentX + 4, y, labelImg.wMm, labelImg.hMm);
      const valImg = await renderBanglaTextImage(String(value), 11);
      if (valImg) doc2.addImage(valImg.dataUrl, "PNG", contentX + 38, y, valImg.wMm, valImg.hMm);
      const lineHeight = Math.max(8, (valImg?.hMm || 8) + 2);
      y += lineHeight;
    }
    const totalHeight = y - startY;
    doc2.roundedRect(contentX, startY - 4, contentWidth, totalHeight + 8, 2, 2);
  };
  const drawFooter = () => {
    const pageWidth = doc2.internal.pageSize.getWidth();
    const footerText = getGeneratedAtText();
    doc2.setFont("helvetica", "bold");
    doc2.setTextColor(37, 99, 235);
    doc2.setFontSize(10);
    doc2.text(footerText, pageWidth / 2, 138, { align: "center" });
  };
  await ensureBengaliFont();
  await drawHeader();
  await drawBody();
  drawFooter();
  const blob = doc2.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  console.log("pdfReceipt: open done");
};
const downloadReceiptPdf = async (transaction) => {
  console.log("pdfReceipt: download start", transaction);
  const doc2 = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const pxToMm = (px) => px * 25.4 / 96;
  const loadFontAsBase64 = async (url) => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };
  const ensureBengaliFont = async () => {
    try {
      console.log("pdfReceipt: font load");
      const base64 = await loadFontAsBase64("/fonts/NotoSansBengali-Regular.ttf");
      doc2.addFileToVFS("NotoSansBengali-Regular.ttf", base64);
      doc2.addFont("NotoSansBengali-Regular.ttf", "NotoSansBengali", "normal");
      doc2.setFont("NotoSansBengali", "normal");
    } catch (e) {
      console.log("pdfReceipt: font load failed", e);
      doc2.setFont("helvetica", "normal");
    }
  };
  const renderBanglaTextImage = async (text, fontSizePx = 12) => {
    try {
      const fontFace = new FontFace("NotoSansBengaliInline", "url(/fonts/NotoSansBengali-Regular.ttf)");
      await fontFace.load();
      document.fonts.add(fontFace);
      await document.fonts.ready;
      const scale = 4;
      const tmp = document.createElement("canvas").getContext("2d");
      tmp.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
      const m = tmp.measureText(text);
      const ascent = Math.ceil(m.actualBoundingBoxAscent || fontSizePx * 0.8);
      const descent = Math.ceil(m.actualBoundingBoxDescent || fontSizePx * 0.2);
      const w = Math.ceil(m.width) + 8;
      const h = ascent + descent + 6;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.fillStyle = "#000";
      ctx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, 0, ascent);
      const dataUrl = canvas.toDataURL("image/png");
      return { dataUrl, wMm: pxToMm(w), hMm: pxToMm(h) };
    } catch (e) {
      console.log("pdfReceipt: renderBanglaTextImage failed", e);
      return null;
    }
  };
  const getGeneratedAtText = () => {
    const d = /* @__PURE__ */ new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hh = String(hours).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const s = `Generated by fulmurigram.site on ${yyyy}-${mm}-${dd} at ${hh}:${min} ${ampm}`;
    console.log("pdfReceipt: footer text", s);
    return s;
  };
  const drawHeader = async () => {
    const pageWidth = doc2.internal.pageSize.getWidth();
    const titleImg = await renderBanglaTextImage("লেনদেন রসিদ", 14);
    if (titleImg) {
      const x = pageWidth / 2 - titleImg.wMm / 2;
      doc2.addImage(titleImg.dataUrl, "PNG", x, 18, titleImg.wMm, titleImg.hMm);
    }
  };
  const drawBody = async () => {
    doc2.setDrawColor(220);
    doc2.setFontSize(9);
    const pageWidth = doc2.internal.pageSize.getWidth();
    const contentWidth = Math.min(120, pageWidth - 20);
    const contentX = (pageWidth - contentWidth) / 2;
    const startY = 28;
    const rows = [
      ["সদস্য", transaction.memberName || "অজানা সদস্য"],
      ["ধরন", transaction.type || transaction.transactionType || "other"],
      ["পরিমাণ", `৳ ${(transaction.amount || 0).toLocaleString("bn-BD")}`],
      ["পেমেন্ট পদ্ধতি", transaction.paymentMethod || "cash"],
      ["তারিখ/সময়", `${transaction.date ? new Date(transaction.date).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : ""}${transaction.time ? ` • ${transaction.time}` : ""}`],
      ["রেফারেন্স", transaction.reference || ""],
      ["প্রক্রিয়াকারী", transaction.processedBy || "ক্যাশিয়ার"]
    ];
    let y = startY;
    for (const [label, value] of rows) {
      doc2.setTextColor(100);
      const labelImg = await renderBanglaTextImage(String(label), 10);
      if (labelImg) doc2.addImage(labelImg.dataUrl, "PNG", contentX + 4, y, labelImg.wMm, labelImg.hMm);
      doc2.setTextColor(30);
      const valImg = await renderBanglaTextImage(String(value), 11);
      if (valImg) doc2.addImage(valImg.dataUrl, "PNG", contentX + 38, y, valImg.wMm, valImg.hMm);
      const lineHeight = Math.max(8, (valImg?.hMm || 8) + 2);
      y += lineHeight;
    }
    const totalHeight = y - startY;
    doc2.roundedRect(contentX, startY - 4, contentWidth, totalHeight + 8, 2, 2);
  };
  const drawFooter = () => {
    const pageWidth = doc2.internal.pageSize.getWidth();
    const footerText = getGeneratedAtText();
    doc2.setFont("helvetica", "bold");
    doc2.setTextColor(37, 99, 235);
    doc2.setFontSize(10);
    doc2.text(footerText, pageWidth / 2, 138, { align: "center" });
  };
  await ensureBengaliFont();
  await drawHeader();
  await drawBody();
  drawFooter();
  const id = transaction?.transactionId || transaction?.id || "receipt";
  doc2.save(`receipt_${id}.pdf`);
  console.log("pdfReceipt: download done");
};
const DetailItem = ({ label, value, statusInfo }) => {
  console.log("TransactionDetailsCard: render detail", { label, value });
  return /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
    /* @__PURE__ */ jsx("div", { className: "label", children: label }),
    /* @__PURE__ */ jsx("div", { className: `value ${statusInfo ? "status" : ""}`, style: statusInfo ? { backgroundColor: statusInfo.bgColor, color: statusInfo.color } : {}, children: value ?? "N/A" })
  ] });
};
const TransactionDetailsCard = ({ transaction, isVisible, onClose }) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        console.log("TransactionDetailsCard: escape pressed");
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    console.log("TransactionDetailsCard: opened", transaction);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      console.log("TransactionDetailsCard: closed");
    };
  }, [isVisible, onClose]);
  if (!isVisible || !transaction) return null;
  const getTransactionTypeLabel = (type) => {
    const typeMap = {
      "monthly_deposit": "মাসিক জমা",
      "share_purchase": "শেয়ার ক্রয়",
      "loan_disbursement": "ঋণ প্রদান",
      "loan_repayment": "ঋণ পরিশোধ",
      "profit_distribution": "লাভ বিতরণ",
      "penalty": "জরিমানা",
      "subscription": "মাসিক চাঁদা",
      "loan": "ঋণ",
      "donation": "দান",
      "fine": "জরিমানা",
      "share": "শেয়ার",
      "withdrawal": "উত্তোলন",
      "other": "অন্যান্য"
    };
    return typeMap[type] || "অন্যান্য";
  };
  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      "cash": "নগদ",
      "bank": "ব্যাংক",
      "bank_transfer": "ব্যাংক ট্রান্সফার",
      "mobile": "মোবাইল ব্যাংকিং",
      "mobile_banking": "মোবাইল ব্যাংকিং",
      "card": "কার্ড",
      "check": "চেক"
    };
    return methodMap[method] || "অন্যান্য";
  };
  const getStatusInfo = (status) => {
    const statusMap = {
      "completed": { label: "সম্পন্ন", color: "#28a745", bgColor: "rgba(40, 167, 69, 0.1)" },
      "pending": { label: "অপেক্ষমাণ", color: "#ffc107", bgColor: "rgba(255, 193, 7, 0.1)" },
      "failed": { label: "ব্যর্থ", color: "#dc3545", bgColor: "rgba(220, 53, 69, 0.1)" },
      "processing": { label: "প্রক্রিয়াধীন", color: "#17a2b8", bgColor: "rgba(23, 162, 184, 0.1)" }
    };
    return statusMap[status] || { label: "অজানা", color: "#6c757d", bgColor: "rgba(108, 117, 125, 0.1)" };
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };
  const pickFirst = (...args) => args.find((v) => v !== void 0 && v !== null && v !== "") ?? null;
  const getMemberNameValue = (t) => {
    const v = pickFirst(t?.member_name, t?.memberName, t?.member?.name, t?.user_name, t?.user?.name, t?.name);
    console.log("TransactionDetailsCard: member name resolved", v);
    return v ?? "N/A";
  };
  const getAmountValue = (t) => {
    const v = pickFirst(t?.amount, t?.value, t?.total);
    console.log("TransactionDetailsCard: amount resolved", v);
    return v != null ? `৳${v}` : "N/A";
  };
  const getTypeValue = (t) => {
    const v = pickFirst(t?.type, t?.transaction_type, t?.category);
    console.log("TransactionDetailsCard: type raw", v);
    return getTransactionTypeLabel(v);
  };
  const getPaymentMethodValue = (t) => {
    const v = pickFirst(t?.payment_method, t?.paymentMethod, t?.method);
    console.log("TransactionDetailsCard: payment method raw", v);
    return getPaymentMethodLabel(v);
  };
  const getDateValue = (t) => {
    const v = pickFirst(t?.date, t?.created_at, t?.createdAt, t?.timestamp);
    console.log("TransactionDetailsCard: date raw", v);
    return formatDate(v);
  };
  const getTimeValue = (t) => {
    const v = pickFirst(t?.created_at, t?.createdAt, t?.timestamp, t?.date);
    console.log("TransactionDetailsCard: time raw", v);
    try {
      return new Date(v).toLocaleTimeString("bn-BD");
    } catch {
      return "N/A";
    }
  };
  getStatusInfo(transaction.status);
  const handleCopy = () => {
    console.log("TransactionDetailsCard: copy transaction id", transaction?.id);
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleViewPdf = () => {
    console.log("TransactionDetailsCard: view receipt requested", transaction);
    openReceiptPdf(transaction);
  };
  const handleDownloadPdf = () => {
    console.log("TransactionDetailsCard: download receipt requested", transaction);
    downloadReceiptPdf(transaction);
  };
  return /* @__PURE__ */ jsx("div", { className: "transaction-details-card-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "transaction-details-card", ref: cardRef, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "transaction-details-card-header", children: [
      /* @__PURE__ */ jsx("h2", { children: "লেনদেনের বিবরণ" }),
      /* @__PURE__ */ jsx("button", { className: "close-button", onClick: () => {
        console.log("TransactionDetailsCard: close clicked");
        onClose();
      }, children: /* @__PURE__ */ jsx(X, { size: 24 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "transaction-details-card-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "transaction-details-grid", children: [
        /* @__PURE__ */ jsx(DetailItem, { label: "সদস্য", value: getMemberNameValue(transaction) }),
        /* @__PURE__ */ jsx(DetailItem, { label: "পরিমাণ", value: getAmountValue(transaction) }),
        /* @__PURE__ */ jsx(DetailItem, { label: "ধরণ", value: getTypeValue(transaction) }),
        /* @__PURE__ */ jsx(DetailItem, { label: "পেমেন্ট পদ্ধতি", value: getPaymentMethodValue(transaction) }),
        /* @__PURE__ */ jsx(DetailItem, { label: "তারিখ", value: getDateValue(transaction) }),
        /* @__PURE__ */ jsx(DetailItem, { label: "সময়", value: getTimeValue(transaction) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "transaction-id-section", children: /* @__PURE__ */ jsxs("div", { className: "transaction-id-wrapper", children: [
        /* @__PURE__ */ jsx(Hash, { size: 16 }),
        /* @__PURE__ */ jsx("span", { className: "value", children: transaction.id }),
        /* @__PURE__ */ jsx("button", { className: "copy-button", onClick: handleCopy, children: copied ? /* @__PURE__ */ jsx(CheckCircle, { size: 16, color: "green" }) : /* @__PURE__ */ jsx(Copy, { size: 16 }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "transaction-details-card-footer", children: [
      /* @__PURE__ */ jsxs("button", { className: "action-button", onClick: handleViewPdf, children: [
        /* @__PURE__ */ jsx(Eye, { size: 20 }),
        "রসিদ দেখুন"
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "action-button", onClick: handleDownloadPdf, children: [
        /* @__PURE__ */ jsx(Download, { size: 20 }),
        "ডাউনলোড"
      ] })
    ] })
  ] }) });
};
console.log("[demoData] File loaded");
const demoMembers = [
  {
    id: "demo-member-1",
    name: "রহিম আলী",
    email: "rahim@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-01-15"),
    shareCount: 25,
    totalInvestment: 125e3,
    phone: "০১৭১১-১২৩৪৫৬",
    address: "ঢাকা, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-2",
    name: "করিম মিয়া",
    email: "karim@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-02-20"),
    shareCount: 15,
    totalInvestment: 75e3,
    phone: "০১৮১১-২৩৪৫৬৭",
    address: "চট্টগ্রাম, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-3",
    name: "সালমা বেগম",
    email: "salma@demo.com",
    role: "member",
    membershipType: "প্রিমিয়াম সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-03-10"),
    shareCount: 50,
    totalInvestment: 25e4,
    phone: "০১৯১১-৩৪৫৬৭৮",
    address: "সিলেট, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-4",
    name: "জামাল উদ্দিন",
    email: "jamal@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-04-05"),
    shareCount: 10,
    totalInvestment: 5e4,
    phone: "০১৬১১-৪৫৬৭৮৯",
    address: "রাজশাহী, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-5",
    name: "ফাতেমা খাতুন",
    email: "fatema@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-05-12"),
    shareCount: 20,
    totalInvestment: 1e5,
    phone: "০১৭২২-৫৬৭৮৯০",
    address: "খুলনা, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-6",
    name: "হাসান মাহমুদ",
    email: "hasan@demo.com",
    role: "member",
    membershipType: "প্রিমিয়াম সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-06-18"),
    shareCount: 40,
    totalInvestment: 2e5,
    phone: "০১৮২২-৬৭৮৯০১",
    address: "বরিশাল, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-7",
    name: "নাজমা আক্তার",
    email: "nazma@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-07-22"),
    shareCount: 12,
    totalInvestment: 6e4,
    phone: "০১৯২২-৭৮৯০১২",
    address: "রংপুর, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-8",
    name: "আবদুল কাদের",
    email: "abdul@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-08-30"),
    shareCount: 18,
    totalInvestment: 9e4,
    phone: "০১৬২২-৮৯০১২৩",
    address: "ময়মনসিংহ, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-9",
    name: "রোকেয়া সুলতানা",
    email: "rokeya@demo.com",
    role: "member",
    membershipType: "প্রিমিয়াম সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-09-14"),
    shareCount: 35,
    totalInvestment: 175e3,
    phone: "০১৭৩৩-৯০১২৩৪",
    address: "কুমিল্লা, বাংলাদেশ",
    status: "active"
  },
  {
    id: "demo-member-10",
    name: "মোস্তফা কামাল",
    email: "mostafa@demo.com",
    role: "member",
    membershipType: "নিয়মিত সদস্য",
    joinDate: /* @__PURE__ */ new Date("2023-10-08"),
    shareCount: 22,
    totalInvestment: 11e4,
    phone: "০১৮৩৩-০১২৩৪৫",
    address: "যশোর, বাংলাদেশ",
    status: "active"
  }
];
const demoTransactions = [
  {
    id: "demo-txn-1",
    memberId: "demo-member-1",
    memberName: "রহিম আলী",
    type: "deposit",
    amount: 5e3,
    date: /* @__PURE__ */ new Date("2025-12-01"),
    description: "মাসিক সঞ্চয়",
    status: "completed",
    category: "savings"
  },
  {
    id: "demo-txn-2",
    memberId: "demo-member-2",
    memberName: "করিম মিয়া",
    type: "deposit",
    amount: 3e3,
    date: /* @__PURE__ */ new Date("2025-12-02"),
    description: "শেয়ার ক্রয়",
    status: "completed",
    category: "share"
  },
  {
    id: "demo-txn-3",
    memberId: "demo-member-3",
    memberName: "সালমা বেগম",
    type: "investment",
    amount: 2e4,
    date: /* @__PURE__ */ new Date("2025-12-05"),
    description: "বিনিয়োগ তহবিলে জমা",
    status: "completed",
    category: "investment"
  },
  {
    id: "demo-txn-4",
    memberId: "demo-member-1",
    memberName: "রহিম আলী",
    type: "withdrawal",
    amount: 2e3,
    date: /* @__PURE__ */ new Date("2025-12-08"),
    description: "জরুরী উত্তোলন",
    status: "completed",
    category: "withdrawal"
  },
  {
    id: "demo-txn-5",
    memberId: "demo-member-4",
    memberName: "জামাল উদ্দিন",
    type: "deposit",
    amount: 4e3,
    date: /* @__PURE__ */ new Date("2025-12-10"),
    description: "মাসিক সঞ্চয়",
    status: "completed",
    category: "savings"
  },
  {
    id: "demo-txn-6",
    memberId: "demo-member-5",
    memberName: "ফাতেমা খাতুন",
    type: "deposit",
    amount: 6e3,
    date: /* @__PURE__ */ new Date("2025-12-12"),
    description: "শেয়ার ক্রয়",
    status: "completed",
    category: "share"
  },
  {
    id: "demo-txn-7",
    memberId: "demo-member-6",
    memberName: "হাসান মাহমুদ",
    type: "investment",
    amount: 15e3,
    date: /* @__PURE__ */ new Date("2025-12-15"),
    description: "বিনিয়োগ তহবিলে জমা",
    status: "completed",
    category: "investment"
  },
  {
    id: "demo-txn-8",
    memberId: "demo-member-7",
    memberName: "নাজমা আক্তার",
    type: "deposit",
    amount: 3500,
    date: /* @__PURE__ */ new Date("2025-12-18"),
    description: "মাসিক সঞ্চয়",
    status: "completed",
    category: "savings"
  },
  {
    id: "demo-txn-9",
    memberId: "demo-member-8",
    memberName: "আবদুল কাদের",
    type: "deposit",
    amount: 5e3,
    date: /* @__PURE__ */ new Date("2025-12-20"),
    description: "শেয়ার ক্রয়",
    status: "completed",
    category: "share"
  },
  {
    id: "demo-txn-10",
    memberId: "demo-member-9",
    memberName: "রোকেয়া সুলতানা",
    type: "investment",
    amount: 1e4,
    date: /* @__PURE__ */ new Date("2025-12-22"),
    description: "বিনিয়োগ তহবিলে জমা",
    status: "completed",
    category: "investment"
  },
  {
    id: "demo-txn-11",
    memberId: "demo-member-10",
    memberName: "মোস্তফা কামাল",
    type: "deposit",
    amount: 4500,
    date: /* @__PURE__ */ new Date("2025-12-24"),
    description: "মাসিক সঞ্চয়",
    status: "completed",
    category: "savings"
  },
  {
    id: "demo-txn-12",
    memberId: "demo-member-2",
    memberName: "করিম মিয়া",
    type: "withdrawal",
    amount: 1500,
    date: /* @__PURE__ */ new Date("2025-12-26"),
    description: "জরুরী উত্তোলন",
    status: "completed",
    category: "withdrawal"
  },
  {
    id: "demo-txn-13",
    memberId: "demo-member-3",
    memberName: "সালমা বেগম",
    type: "deposit",
    amount: 8e3,
    date: /* @__PURE__ */ new Date("2025-12-28"),
    description: "শেয়ার ক্রয়",
    status: "completed",
    category: "share"
  },
  {
    id: "demo-txn-14",
    memberId: "demo-member-4",
    memberName: "জামাল উদ্দিন",
    type: "investment",
    amount: 12e3,
    date: /* @__PURE__ */ new Date("2025-12-30"),
    description: "বিনিয়োগ তহবিলে জমা",
    status: "completed",
    category: "investment"
  }
];
console.log("[useDemoData] File loaded");
const AdminDashboard = () => {
  const { isDemo } = useMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalFunds: 0,
    monthlyDeposits: 0,
    recentTransactions: [],
    monthlyData: []
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [showFabMenu, setShowFabMenu] = useState(false);
  const generateMonthlyDepositsData = (transactions) => {
    const monthNames = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
    const last6Months = [];
    const currentDate = /* @__PURE__ */ new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      const monthlyDeposits = transactions.filter((t) => {
        if (!t.createdAt || t.transactionType !== "monthly_deposit") return false;
        const transactionDate = new Date(t.createdAt.seconds * 1e3);
        return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear();
      }).reduce((sum, t) => sum + (t.amount || 0), 0);
      last6Months.push({
        month: monthName,
        deposits: monthlyDeposits
      });
    }
    return last6Months;
  };
  const handleNewMember = () => {
    setShowFabMenu(false);
    navigate("/admin/members", { state: { openAddMemberModal: true } });
  };
  const handleNewTransaction = () => {
    setShowFabMenu(false);
    navigate("/add-transaction");
  };
  const toggleFabMenu = () => {
    setShowFabMenu(!showFabMenu);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFabMenu && !event.target.closest(".md-fab-container")) {
        setShowFabMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFabMenu]);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const isDemoMode = isDemo();
        if (isDemoMode) {
          const activeMembers = demoMembers.filter((m) => m.status === "active").length;
          const totalFunds = demoTransactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0);
          const monthlyDeposits = demoTransactions.filter((t) => t.type === "deposit" && t.category === "monthly").reduce((sum, t) => sum + t.amount, 0);
          const monthlyData2 = generateMonthlyDepositsData(demoTransactions.map((t) => ({
            ...t,
            transactionType: t.type,
            createdAt: { seconds: new Date(t.date).getTime() / 1e3 }
          })));
          setDashboardData({
            totalMembers: demoMembers.length,
            activeMembers,
            totalFunds,
            monthlyDeposits,
            recentTransactions: demoTransactions.slice(0, 10),
            monthlyData: monthlyData2
          });
          setLoading({ members: false, transactions: false, fundData: false, initial: false });
        } else {
          const [memberResult, fundSummary, transactions] = await Promise.all([
            MemberService.getAllMembers().then((result) => {
              if (result.success) {
                const members = result.data;
                const activeMembers = members.filter((member) => member.status === "active").length;
                setDashboardData((prev) => ({
                  ...prev,
                  totalMembers: members.length,
                  activeMembers
                }));
                setLoading((prev) => ({ ...prev, members: false }));
                return members;
              } else {
                console.error("Error loading members:", result.error);
                setLoading((prev) => ({ ...prev, members: false }));
                return [];
              }
            }).catch((error) => {
              console.error("Error loading members:", error);
              setLoading((prev) => ({ ...prev, members: false }));
              return [];
            }),
            FundService.getFundSummary().then((result) => {
              if (result.success && result.data) {
                const fundSummary2 = result.data;
                setDashboardData((prev) => ({
                  ...prev,
                  totalFunds: fundSummary2.totalAmount || 0,
                  monthlyDeposits: fundSummary2.monthlyDeposits || 0
                }));
                setLoading((prev) => ({ ...prev, fundData: false }));
                return fundSummary2;
              } else {
                console.error("Error loading fund summary:", result.error);
                setLoading((prev) => ({ ...prev, fundData: false }));
                return {};
              }
            }).catch((error) => {
              console.error("Error loading fund summary:", error);
              setLoading((prev) => ({ ...prev, fundData: false }));
              return {};
            }),
            TransactionService.getAllTransactions().then((result) => {
              if (result.success) {
                const allTransactions = result.data || [];
                const recentTransactions = allTransactions.slice(0, 10);
                const monthlyData2 = generateMonthlyDepositsData(allTransactions);
                setDashboardData((prev) => ({
                  ...prev,
                  recentTransactions,
                  monthlyData: monthlyData2
                }));
                setLoading((prev) => ({ ...prev, transactions: false }));
                return allTransactions;
              } else {
                console.error("Error loading transactions:", result.error);
                setLoading((prev) => ({ ...prev, transactions: false }));
                return [];
              }
            }).catch((error) => {
              console.error("Error loading transactions:", error);
              setLoading((prev) => ({ ...prev, transactions: false }));
              return [];
            })
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };
    loadDashboardData();
  }, [isDemo]);
  const summaryStats = [
    {
      title: "মোট সদস্য",
      value: dashboardData.totalMembers.toString(),
      change: `+${dashboardData.activeMembers}`,
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "মোট তহবিল",
      value: `৳ ${(dashboardData.totalFunds || 0).toLocaleString()}`,
      change: "+১২%",
      changeType: "increase",
      icon: PiggyBank,
      color: "bg-green-500"
    },
    {
      title: "মাসিক জমা",
      value: `৳ ${(dashboardData.monthlyDeposits || 0).toLocaleString()}`,
      change: "+৫%",
      changeType: "increase",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];
  const handleTransactionClick = (transaction, event) => {
    if (!transaction) {
      console.error("No transaction data provided");
      return;
    }
    setCardPosition({
      x: event.clientX,
      y: event.clientY
    });
    const safeTransaction = {
      id: transaction.id || "N/A",
      memberName: transaction.memberName || "অজানা সদস্য",
      transactionType: transaction.transactionType || transaction.type || "other",
      type: transaction.type || transaction.transactionType || "other",
      amount: transaction.amount || 0,
      date: transaction.date || transaction.createdAt || null,
      createdAt: transaction.createdAt || null,
      description: transaction.description || "",
      transactionId: transaction.transactionId || transaction.id || "N/A",
      status: transaction.status || "completed",
      paymentMethod: transaction.paymentMethod || "cash",
      month: transaction.month,
      monthName: transaction.monthName || "",
      reference: transaction.reference,
      processedBy: transaction.processedBy,
      ...transaction
      // Spread the original transaction to preserve any additional fields
    };
    setSelectedTransaction(safeTransaction);
    setShowTransactionCard(true);
  };
  const closeTransactionCard = () => {
    setShowTransactionCard(false);
    setSelectedTransaction(null);
  };
  const monthlyData = dashboardData.monthlyData || [];
  const getTransactionInfo = (transactionType) => {
    const typeMap = {
      "monthly_deposit": { label: "মাসিক জমা", action: "জমা দিয়েছেন", icon: PiggyBank, color: "text-green-600" },
      "share_purchase": { label: "শেয়ার ক্রয়", action: "শেয়ার কিনেছেন", icon: PiggyBank, color: "text-blue-600" },
      "loan_disbursement": { label: "ঋণ গ্রহণ", action: "ঋণ নিয়েছেন", icon: DollarSign, color: "text-orange-600" },
      "loan_repayment": { label: "ঋণ পরিশোধ", action: "ঋণ পরিশোধ করেছেন", icon: PiggyBank, color: "text-green-600" },
      "profit_distribution": { label: "লাভ বিতরণ", action: "লাভ পেয়েছেন", icon: PiggyBank, color: "text-green-600" },
      "penalty": { label: "জরিমানা", action: "জরিমানা দিয়েছেন", icon: DollarSign, color: "text-red-600" },
      "other": { label: "অন্যান্য", action: "লেনদেন করেছেন", icon: DollarSign, color: "text-gray-600" }
    };
    return typeMap[transactionType] || typeMap["other"];
  };
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true);
        const isDemoMode = isDemo();
        let transactionsData = [];
        if (isDemoMode) {
          transactionsData = demoTransactions.slice(0, 10);
        } else {
          const result = await TransactionService.getRecentTransactions(10);
          if (result.success && result.data) {
            transactionsData = result.data;
          }
        }
        if (transactionsData.length > 0) {
          const formattedActivities = transactionsData.map((transaction, index) => {
            const transactionInfo = getTransactionInfo(transaction.transactionType || transaction.type);
            const getTimeAgo = (transaction2) => {
              const transactionDate = isDemoMode ? new Date(transaction2.date) : transaction2.createdAt?.toDate ? transaction2.createdAt.toDate() : new Date(transaction2.createdAt.seconds * 1e3);
              const now = /* @__PURE__ */ new Date();
              const diffTime = Math.abs(now - transactionDate);
              const diffHours = Math.floor(diffTime / (1e3 * 60 * 60));
              const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
              if (diffHours < 1) return "এখনই";
              if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
              if (diffDays === 1) return "গতকাল";
              if (diffDays <= 7) return `${diffDays} দিন আগে`;
              if (diffDays <= 30) {
                const weeks = Math.floor(diffDays / 7);
                return `${weeks} সপ্তাহ আগে`;
              }
              return "এই মাসে";
            };
            return {
              id: transaction.id || index,
              type: transaction.transactionType || transaction.type,
              message: `${transaction.memberName || "সদস্য"} ${(transaction.amount || 0).toLocaleString()} টাকা ${transactionInfo.action}`,
              time: getTimeAgo(transaction),
              icon: transactionInfo.icon,
              color: transactionInfo.color,
              originalTransaction: isDemoMode ? {
                ...transaction,
                transactionType: transaction.type,
                createdAt: new Date(transaction.date)
              } : transaction
            };
          });
          setRecentActivities(formattedActivities);
        } else {
          setRecentActivities([]);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchRecentActivities();
  }, [isDemo]);
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => /* @__PURE__ */ jsx("div", { className: `animate-pulse bg-gray-200 rounded ${height} ${className}` });
  return /* @__PURE__ */ jsxs("div", { className: "admin-dashboard-mobile", children: [
    /* @__PURE__ */ jsx("div", { className: "md-surface-container", children: /* @__PURE__ */ jsxs("div", { className: "md-dashboard-content", children: [
      /* @__PURE__ */ jsx("div", { className: "md-stats-grid", children: summaryStats.map((stat, index) => /* @__PURE__ */ jsx("div", { className: "md-card md-stats-card", style: { animationDelay: `${index * 100}ms` }, children: /* @__PURE__ */ jsxs("div", { className: "md-card-content", children: [
        /* @__PURE__ */ jsx("div", { className: "md-stats-icon-container", children: /* @__PURE__ */ jsx("div", { className: `md-stats-icon ${stat.color}`, children: /* @__PURE__ */ jsx(stat.icon, { className: "h-6 w-6 text-white" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "md-stats-content", children: [
          /* @__PURE__ */ jsx("h3", { className: "md-title-large", children: index === 0 && loading.members || index === 1 && loading.fundData || index === 2 && loading.fundData || index === 3 && loading.fundData ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-6" }) : stat.value }),
          /* @__PURE__ */ jsx("p", { className: "md-body-medium", children: stat.title }),
          /* @__PURE__ */ jsxs("div", { className: `md-stats-change ${stat.changeType === "increase" ? "positive" : "negative"}`, children: [
            stat.changeType === "increase" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "md-label-medium", children: index === 0 && loading.members || index === 1 && loading.fundData || index === 2 && loading.fundData || index === 3 && loading.fundData ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-8" }) : stat.change })
          ] })
        ] })
      ] }) }, index)) }),
      /* @__PURE__ */ jsx("div", { className: "md-tab-container", children: /* @__PURE__ */ jsxs("div", { className: "md-tab-bar", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `md-tab ${activeTab === "overview" ? "active" : ""}`,
            onClick: () => setActiveTab("overview"),
            children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "md-label-medium", children: "সংক্ষিপ্ত" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `md-tab ${activeTab === "activities" ? "active" : ""}`,
            onClick: () => setActiveTab("activities"),
            children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "md-label-medium", children: "কার্যক্রম" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "md-tab-content", children: [
        activeTab === "overview" && /* @__PURE__ */ jsx("div", { className: "md-overview-content", children: /* @__PURE__ */ jsx("div", { className: "md-charts-container", children: /* @__PURE__ */ jsxs("div", { className: "md-card md-chart-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "md-card-header", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "md-title-medium", children: "মাসিক জমা" }),
              /* @__PURE__ */ jsx("p", { className: "md-body-small", children: "গত ৬ মাসের পরিসংখ্যান" })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "md-text-button", children: /* @__PURE__ */ jsx("span", { className: "md-label-large", children: "বিস্তারিত" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md-chart-container", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(BarChart, { data: monthlyData, children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "month", tick: { fontSize: 12 } }),
            /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 12 } }),
            /* @__PURE__ */ jsx(
              Tooltip,
              {
                formatter: (value) => `৳ ${value.toLocaleString()}`,
                contentStyle: {
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }
              }
            ),
            /* @__PURE__ */ jsx(Bar, { dataKey: "deposits", fill: "#6366f1", name: "মাসিক জমা", radius: [4, 4, 0, 0] })
          ] }) }) })
        ] }) }) }),
        activeTab === "activities" && /* @__PURE__ */ jsx("div", { className: "md-activities-content", children: /* @__PURE__ */ jsxs("div", { className: "md-card md-activities-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "md-card-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "md-card-header-content", children: [
              /* @__PURE__ */ jsx("h3", { className: "md-title-medium", children: "সাম্প্রতিক কার্যক্রম" }),
              /* @__PURE__ */ jsx("p", { className: "md-body-small text-gray-600", children: "সর্বশেষ লেনদেন এবং কার্যক্রম" })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "md-text-button md-button-primary",
                onClick: () => navigate("/transactions"),
                children: [
                  /* @__PURE__ */ jsx("span", { className: "md-label-large", children: "সব দেখুন" }),
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4 ml-1" })
                ]
              }
            )
          ] }),
          activitiesLoading ? /* @__PURE__ */ jsx("div", { className: "md-activities-loading", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-8", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-blue-600" }),
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-gray-600", children: "কার্যক্রম লোড হচ্ছে..." })
          ] }) }) : recentActivities.length === 0 ? /* @__PURE__ */ jsx("div", { className: "md-activities-empty", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [
            /* @__PURE__ */ jsx(Bell, { className: "h-12 w-12 text-gray-400 mb-4" }),
            /* @__PURE__ */ jsx("h4", { className: "md-title-small text-gray-600 mb-2", children: "কোন কার্যক্রম নেই" }),
            /* @__PURE__ */ jsx("p", { className: "md-body-small text-gray-500", children: "এখনও কোন লেনদেন বা কার্যক্রম হয়নি" })
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "md-list md-activities-list", children: recentActivities.map((activity, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "md-list-item md-activity-item",
              style: {
                animationDelay: `${index * 100}ms`,
                cursor: "pointer"
              },
              onClick: (e) => handleTransactionClick(activity.originalTransaction, e),
              children: [
                /* @__PURE__ */ jsx("div", { className: "md-list-item-leading", children: /* @__PURE__ */ jsx("div", { className: `md-list-icon md-activity-icon ${activity.color}`, children: /* @__PURE__ */ jsx(activity.icon, { className: "h-5 w-5" }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "md-list-item-content", children: [
                  /* @__PURE__ */ jsx("div", { className: "md-list-item-headline md-activity-message", children: activity.message }),
                  /* @__PURE__ */ jsxs("div", { className: "md-list-item-supporting-text", children: [
                    /* @__PURE__ */ jsx("span", { className: "md-badge md-badge-time", children: activity.time }),
                    activity.originalTransaction?.amount > 0 && /* @__PURE__ */ jsxs("span", { className: "md-badge md-badge-amount", children: [
                      "৳",
                      activity.originalTransaction.amount.toLocaleString()
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "md-list-item-trailing", children: /* @__PURE__ */ jsx("button", { className: "md-icon-button-small md-activity-menu", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) }) })
              ]
            },
            activity.id
          )) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "md-fab-container", children: [
      showFabMenu && /* @__PURE__ */ jsxs("div", { className: "md-fab-menu", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "md-fab md-fab-secondary",
            onClick: handleNewMember,
            title: "নতুন সদস্য যোগ করুন",
            children: [
              /* @__PURE__ */ jsx(UserPlus, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "md-fab-label", children: "নতুন সদস্য" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "md-fab md-fab-secondary",
            onClick: handleNewTransaction,
            title: "নতুন লেনদেন যোগ করুন",
            children: [
              /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "md-fab-label", children: "নতুন লেনদেন" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: `md-fab md-fab-primary ${showFabMenu ? "rotated" : ""}`,
          onClick: toggleFabMenu,
          title: "নতুন যোগ করুন",
          children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      TransactionDetailsCard,
      {
        transaction: selectedTransaction,
        isVisible: showTransactionCard,
        onClose: closeTransactionCard,
        position: cardPosition
      }
    )
  ] });
};
const banglaToEnglishMap = {
  // Vowels
  "অ": "a",
  "আ": "a",
  "ই": "i",
  "ঈ": "i",
  "উ": "u",
  "ঊ": "u",
  "ঋ": "ri",
  "এ": "e",
  "ঐ": "ai",
  "ও": "o",
  "ঔ": "au",
  // Consonants
  "ক": "k",
  "খ": "kh",
  "গ": "g",
  "ঘ": "gh",
  "ঙ": "ng",
  "চ": "ch",
  "ছ": "chh",
  "জ": "j",
  "ঝ": "jh",
  "ঞ": "ny",
  "ট": "t",
  "ঠ": "th",
  "ড": "d",
  "ঢ": "dh",
  "ণ": "n",
  "ত": "t",
  "থ": "th",
  "দ": "d",
  "ধ": "dh",
  "ন": "n",
  "প": "p",
  "ফ": "ph",
  "ব": "b",
  "ভ": "bh",
  "ম": "m",
  "য": "y",
  "র": "r",
  "ল": "l",
  "শ": "sh",
  "ষ": "sh",
  "স": "s",
  "হ": "h",
  "ড়": "r",
  "ঢ়": "rh",
  "য়": "y",
  "ৎ": "t",
  "ং": "ng",
  "ঃ": "h",
  "ঁ": "n",
  // Vowel marks (kar)
  "া": "a",
  "ি": "i",
  "ী": "i",
  "ু": "u",
  "ূ": "u",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "ai",
  "ো": "o",
  "ৌ": "au",
  // Numbers
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
  // Common conjuncts
  "ক্ষ": "ksh",
  "জ্ঞ": "gy",
  "ঞ্চ": "nch",
  "ঞ্জ": "nj",
  "ত্র": "tr",
  "দ্র": "dr",
  "ন্ত": "nt",
  "ন্দ": "nd",
  "ম্প": "mp",
  "ম্ব": "mb",
  "ল্প": "lp",
  "শ্চ": "shch",
  "স্ত": "st",
  "স্প": "sp",
  "হ্ম": "hm",
  "হ্ন": "hn"
};
const transliterateBanglaToEnglish = (banglaText) => {
  if (!banglaText || typeof banglaText !== "string") {
    return "";
  }
  let result = "";
  let i = 0;
  while (i < banglaText.length) {
    let matched = false;
    for (let len = 3; len >= 1; len--) {
      if (i + len <= banglaText.length) {
        const substring = banglaText.substring(i, i + len);
        if (banglaToEnglishMap[substring]) {
          result += banglaToEnglishMap[substring];
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      const char = banglaText[i];
      if (/[a-zA-Z0-9\s]/.test(char)) {
        result += char.toLowerCase();
      }
      i++;
    }
  }
  return result;
};
const generateEmailSafeName = (name) => {
  if (!name || typeof name !== "string") {
    return "user";
  }
  let processedName = transliterateBanglaToEnglish(name.trim());
  if (!processedName) {
    processedName = "user";
  }
  processedName = processedName.replace(/[^a-zA-Z0-9]/g, "");
  if (!processedName) {
    processedName = "user";
  }
  const firstPart = processedName.split(/\s+/)[0] || processedName;
  return firstPart.substring(0, 15).toLowerCase();
};
const generateStrongPassword = (baseName, length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%&*";
  const nameLength = Math.min(baseName.length, 6);
  let password = baseName.substring(0, nameLength);
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  const allChars = uppercase + lowercase + numbers + symbols;
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password;
};
const generateEmailCredentials = (name) => {
  const randomDigits = Math.floor(Math.random() * 900) + 100;
  const safeName = generateEmailSafeName(name);
  const strongPassword = generateStrongPassword(safeName, 12);
  return {
    email: `${safeName}${randomDigits}@fulmurigram.com`,
    password: strongPassword
  };
};
const MemberList = () => {
  const { user } = useAuth();
  const { isDemo } = useMode();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    phone: "",
    address: "",
    shareCount: "",
    nomineeName: "",
    nomineePhone: "",
    nomineeRelation: "",
    joiningDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    role: "member"
    // Default role is member
  });
  const [memberFormErrors, setMemberFormErrors] = useState({});
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [addMemberSucceeded, setAddMemberSucceeded] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberData, setEditMemberData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const scrollContainerRef = useRef(null);
  const sphereWrapperRef = useRef(null);
  const sphereProgressRef = useRef(0);
  const [detailSimple, setDetailSimple] = useState(false);
  const buildPlaceholderAvatar = (name, size = 128) => {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    const initials = (parts.slice(0, 2).map((p) => p[0] || "").join("") || "M").toUpperCase();
    const bg = "#e2e8f0";
    const text = "#1e293b";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="clip">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g clip-path="url(#clip)">
    <rect width="${size}" height="${size}" fill="${bg}"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(size * 0.4)}" font-weight="700" fill="${text}">${initials}</text>
</svg>`;
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return dataUrl;
  };
  const handleMemberClick = (member) => {
    console.log("MemberList: member clicked", { id: member.id, email: member.email, password: member.password });
    setSelectedMember(member);
    setShowDetailCard(true);
    setIsEditing(false);
    setEditMemberData({
      name: member.name || "",
      phone: member.phone || "",
      address: member.address || "",
      shareCount: String(member.shareCount || ""),
      joiningDate: member.joiningDate || member.joinDate || member.createdAt ? new Date(member.joiningDate || member.joinDate || member.createdAt?.toDate?.() || member.createdAt).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      nomineeName: member.nomineeName || "",
      nomineePhone: member.nomineePhone || "",
      nomineeRelation: member.nomineeRelation || "",
      role: member.role || "member",
      status: member.status || "active"
    });
    setShowDeleteConfirm(false);
  };
  const closeDetailCard = () => {
    setShowDetailCard(false);
    setSelectedMember(null);
    setIsEditing(false);
    setEditMemberData(null);
    setShowDeleteConfirm(false);
    setDetailSimple(false);
  };
  const handleEditInputChange = (field, value) => {
    console.log("MemberList: edit field change", { field, value });
    setEditMemberData((prev) => ({ ...prev, [field]: value }));
  };
  const validateEditForm = () => {
    const errors = {};
    if (!editMemberData?.name?.trim()) {
      errors.name = "নাম আবশ্যক";
    }
    if (!String(editMemberData?.shareCount || "").trim()) {
      errors.shareCount = "শেয়ার সংখ্যা আবশ্যক";
    } else if (isNaN(editMemberData.shareCount) || Number(editMemberData.shareCount) <= 0) {
      errors.shareCount = "সঠিক শেয়ার সংখ্যা দিন";
    }
    if ((editMemberData?.phone || "").trim() && !/^01[3-9]\d{8}$/.test(editMemberData.phone)) {
      errors.phone = "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)";
    }
    if ((editMemberData?.nomineePhone || "").trim() && !/^01[3-9]\d{8}$/.test(editMemberData.nomineePhone)) {
      errors.nomineePhone = "সঠিক নমিনির ফোন নম্বর দিন";
    }
    return errors;
  };
  const handleSaveMember = async () => {
    try {
      console.log("MemberList: handleSaveMember called", editMemberData);
      const errors = validateEditForm();
      if (Object.keys(errors).length > 0) {
        console.log("MemberList: edit validation errors", errors);
        setError("ফর্মের তথ্য ঠিক করুন");
        return;
      }
      const updateData = {
        name: editMemberData.name,
        phone: editMemberData.phone,
        address: editMemberData.address,
        shareCount: Number(editMemberData.shareCount),
        joiningDate: editMemberData.joiningDate,
        nomineeName: editMemberData.nomineeName,
        nomineePhone: editMemberData.nomineePhone,
        nomineeRelation: editMemberData.nomineeRelation,
        role: editMemberData.role,
        status: editMemberData.status
      };
      console.log("MemberList: updating member", { id: selectedMember.id, updateData });
      const result = await MemberService.updateMember(selectedMember.id, updateData);
      if (result.success) {
        console.log("MemberList: member updated successfully");
        setIsEditing(false);
        await fetchMembers();
        setSelectedMember((prev) => ({ ...prev, ...updateData }));
        console.log("MemberList: toast success - আপডেট সফল");
        toast.success("সদস্য তথ্য আপডেট হয়েছে");
        setError(null);
      } else {
        console.log("MemberList: member update failed", result.error);
        setError(result.error || "আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (e) {
      console.log("MemberList: member update exception", e);
      setError("আপডেট করতে সমস্যা হয়েছে");
    }
  };
  const handleDeleteMember = async () => {
    try {
      console.log("MemberList: handleDeleteMember called", { id: selectedMember.id });
      const result = await MemberService.deleteMember(selectedMember.id);
      if (result.success) {
        console.log("MemberList: member deleted successfully");
        setShowDetailCard(false);
        setIsEditing(false);
        setSelectedMember(null);
        setShowDeleteConfirm(false);
        await fetchMembers();
        console.log("MemberList: toast success - মুছে ফেলা হয়েছে");
        toast.success("সদস্য সফলভাবে মুছে ফেলা হয়েছে");
        setError(null);
      } else {
        console.log("MemberList: member delete failed", result.error);
        setError(result.error || "মুছতে সমস্যা হয়েছে");
      }
    } catch (e) {
      console.log("MemberList: member delete exception", e);
      setError("মুছতে সমস্যা হয়েছে");
    }
  };
  const copyToClipboard = async (text, fieldType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldType);
      setTimeout(() => setCopiedField(null), 2e3);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedField(fieldType);
        setTimeout(() => setCopiedField(null), 2e3);
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
      }
    }
  };
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isDemo()) {
        console.log("[MemberList] Using demo members");
        const membersWithSomitiId = demoMembers.map((member, index) => ({
          ...member,
          somiti_user_id: index + 1
        }));
        setMembers(membersWithSomitiId);
        setFilteredMembers(membersWithSomitiId);
        setLoading(false);
        return;
      }
      const result = await MemberService.getActiveMembers();
      if (result.success) {
        const sortedByCreatedAt = [...result.data].sort((a, b) => {
          const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
          const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
          if (createdA.getTime() !== createdB.getTime()) {
            return createdA - createdB;
          }
          return (a.id || "").localeCompare(b.id || "");
        });
        console.log("MemberList: somiti_user_id assigned by createdAt ascending order");
        const membersWithSomitiId = sortedByCreatedAt.map((member, index) => ({
          ...member,
          somiti_user_id: index + 1
        }));
        console.log("MemberList: somiti_user_id preview", membersWithSomitiId.slice(0, 5).map((m) => ({ id: m.id, somiti_user_id: m.somiti_user_id })));
        setMembers(membersWithSomitiId);
        setFilteredMembers(membersWithSomitiId);
      } else {
        setError(result.error);
        console.error("সদস্য তালিকা লোড করতে ত্রুটি:", result.error);
      }
    } catch (err) {
      setError("সদস্য তালিকা লোড করতে ত্রুটি হয়েছে");
      console.error("সদস্য তালিকা লোড করতে ত্রুটি:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);
  useEffect(() => {
    console.log("MemberList: name line-height fix applied (1.4)");
  }, []);
  const sphereImages = members.map((m) => ({
    id: m.id,
    src: m.photoURL || m.avatar || buildPlaceholderAvatar(m.name),
    alt: m.name || m.membershipId || "Member",
    title: m.name,
    description: m.membershipId ? `ID: ${m.membershipId}` : void 0
  }));
  useEffect(() => {
    console.log("MemberList: sphere images prepared", { count: sphereImages.length });
  }, [sphereImages.length]);
  useEffect(() => {
    console.log("MemberList: thinner card layout applied");
  }, []);
  useEffect(() => {
    console.log("MemberList: serial badge smaller; avatar/content raised (-10px / -3px)");
  }, []);
  useEffect(() => {
    const el = scrollContainerRef.current;
    const sphereEl = sphereWrapperRef.current;
    if (!el || !sphereEl) {
      console.log("MemberList: scroll container or sphere not ready");
      return;
    }
    let rafId = null;
    let lastLoggedTop = 0;
    const threshold = 320;
    const update = (top) => {
      const p = Math.max(0, Math.min(1, top / threshold));
      sphereProgressRef.current = p;
      sphereEl.style.opacity = String(1 - p);
      sphereEl.style.transform = `translate3d(0, -${p * 40}px, 0)`;
      const pe = p >= 0.9 ? "none" : "auto";
      if (sphereEl.style.pointerEvents !== pe) {
        sphereEl.style.pointerEvents = pe;
        console.log("MemberList: sphere pointer-events toggled", { progress: p, pointerEvents: pe });
      }
    };
    const onScroll = () => {
      const top = el.scrollTop || 0;
      if (rafId == null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          update(top);
        });
      }
      if (Math.abs(top - lastLoggedTop) >= 300) {
        lastLoggedTop = top;
        console.log("MemberList: rAF scroll progress", { top, p: Math.max(0, Math.min(1, top / threshold)) });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    console.log("MemberList: rAF scroll listener attached");
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      console.log("MemberList: rAF scroll listener detached");
    };
  }, []);
  useEffect(() => {
    console.log("MemberList navigation state:", location.state);
    if (location.state?.openAddMemberModal) {
      console.log("Opening add member modal from navigation");
      setShowAddMemberModal(true);
    }
  }, [location.state]);
  const handleInputChange = (field, value) => {
    setNewMemberData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (memberFormErrors[field]) {
      setMemberFormErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!newMemberData.name.trim()) {
      errors.name = "নাম আবশ্যক";
    }
    if (!newMemberData.shareCount.trim()) {
      errors.shareCount = "শেয়ার সংখ্যা আবশ্যক";
    } else if (isNaN(newMemberData.shareCount) || Number(newMemberData.shareCount) <= 0) {
      errors.shareCount = "সঠিক শেয়ার সংখ্যা দিন";
    }
    return errors;
  };
  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setMemberFormErrors(errors);
      return;
    }
    try {
      setSaving(true);
      const credentials = generateEmailCredentials(newMemberData.name);
      console.log("Generated credentials:", credentials);
      console.log("MemberList: duplicate check input", { email: credentials.email, phone: newMemberData.phone, name: newMemberData.name });
      const dupResult = await MemberService.isDuplicateMember({ phone: newMemberData.phone, email: credentials.email, name: newMemberData.name });
      console.log("MemberList: duplicate check result", dupResult);
      if (dupResult?.exists) {
        setError(`এই সদস্য ইতিমধ্যে আছে (${dupResult.by})`);
        return;
      }
      const registrationResponse = await registerUser(credentials.email, credentials.password);
      if (!registrationResponse.success) {
        throw new Error(registrationResponse.message || "Backend registration failed");
      }
      const { user_id } = registrationResponse;
      console.log("✅ Backend registration successful, user_id:", user_id);
      const memberData = {
        name: newMemberData.name,
        phone: newMemberData.phone,
        address: newMemberData.address,
        shareCount: newMemberData.shareCount,
        nomineeName: newMemberData.nomineeName,
        nomineePhone: newMemberData.nomineePhone,
        nomineeRelation: newMemberData.nomineeRelation,
        joiningDate: newMemberData.joiningDate,
        role: newMemberData.role || "member",
        email: credentials.email,
        password: credentials.password,
        user_id,
        // Save user_id from backend
        status: "active",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const addResult = await MemberService.addMember(memberData, user_id);
      if (addResult && addResult.success) {
        setAddMemberSucceeded(true);
        console.log("MemberList: toast success - সদস্য যোগ");
        toast.success(`${memberData.name} সফলভাবে সদস্য হিসেবে যোগ হয়েছেন`);
        await fetchMembers();
        console.log("MemberList: auto-closing add member modal after success");
        setShowAddMemberModal(false);
        console.log("MemberList: plaintext password not stored; email saved for credentials");
        setNewMemberData({
          name: "",
          phone: "",
          address: "",
          shareCount: "",
          nomineeName: "",
          nomineePhone: "",
          nomineeRelation: "",
          joiningDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          role: "member"
        });
        setMemberFormErrors({});
      } else {
        console.error("সদস্য যোগ করতে ত্রুটি:", addResult?.error);
        setAddMemberSucceeded(false);
        setError("সদস্য যোগ করতে ত্রুটি হয়েছে");
      }
    } catch (error2) {
      console.error("সদস্য যোগ করতে ত্রুটি:", error2);
      setError(error2.message || "সদস্য যোগ করতে ত্রুটি হয়েছে");
    } finally {
      setSaving(false);
    }
  };
  const handleCloseModal = () => {
    setShowAddMemberModal(false);
    setMemberFormErrors({});
  };
  useEffect(() => {
    let filtered = members;
    if (searchTerm) {
      filtered = filtered.filter(
        (member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.phone.includes(searchTerm)
      );
    }
    if (selectedRole !== "all") {
      filtered = filtered.filter((member) => member.role === selectedRole);
    }
    setFilteredMembers(filtered);
  }, [searchTerm, selectedRole, members]);
  const getRoleInfo = (role) => {
    switch (role) {
      case "admin":
        return { label: "অ্যাডমিন", color: "bg-red-100 text-red-800", icon: Crown };
      case "cashier":
        return { label: "ক্যাশিয়ার", color: "bg-blue-100 text-blue-800", icon: DollarSign };
      case "member":
        return { label: "সদস্য", color: "bg-green-100 text-green-800", icon: User };
      default:
        return { label: "সদস্য", color: "bg-gray-100 text-gray-800", icon: User };
    }
  };
  const getInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase();
  };
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center min-h-screen p-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-600 mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-12 h-12 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-red-800 mb-2", children: "ত্রুটি ঘটেছে" }),
      /* @__PURE__ */ jsx("p", { className: "text-red-600 mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchMembers,
          className: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors",
          children: "পুনরায় চেষ্টা করুন"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "member-list-container", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "member-scroll-container",
        ref: scrollContainerRef,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "img-sphere-page-wrapper",
              ref: sphereWrapperRef,
              children: /* @__PURE__ */ jsx(
                SphereImageGrid,
                {
                  images: sphereImages,
                  containerSize: 420,
                  sphereRadius: 180,
                  autoRotate: true,
                  disableSpotlight: true,
                  onImageClick: (img) => {
                    console.log("MemberList: sphere image clicked", img);
                    const m = members.find((x) => x.id === img.id);
                    if (m) {
                      setDetailSimple(true);
                      handleMemberClick(m);
                    } else {
                      console.log("MemberList: clicked image not mapped to member");
                    }
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "member-list-header", children: /* @__PURE__ */ jsx("div", { className: "member-list-header-content", children: (user?.role === "admin" || user?.role === "cashier") && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "add-member-btn",
              onClick: () => setShowAddMemberModal(true),
              children: [
                /* @__PURE__ */ jsx(UserPlus, { className: "h-5 w-5" }),
                /* @__PURE__ */ jsx("span", { children: "নতুন সদস্য যোগ করুন" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsx("div", { className: "member-cards-container", id: "member-cards", role: "list", children: loading ? (() => {
            console.log("MemberList: skeleton cards match actual card size");
            return /* @__PURE__ */ jsx("div", { className: "member-list-loading", role: "status", "aria-live": "polite", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "member-card member-card-minimal skeleton",
                role: "listitem",
                "aria-hidden": "true",
                style: { padding: "6px" },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "member-serial-number sk-line", style: { minWidth: "24px" } }),
                  /* @__PURE__ */ jsx("div", { className: "sk-avatar" }),
                  /* @__PURE__ */ jsxs("div", { className: "member-info", children: [
                    /* @__PURE__ */ jsx("h3", { className: "member-name", children: /* @__PURE__ */ jsx("div", { className: "sk-line", style: { width: "65%" } }) }),
                    /* @__PURE__ */ jsxs("div", { className: "member-address", children: [
                      /* @__PURE__ */ jsx("div", { className: "sk-icon" }),
                      /* @__PURE__ */ jsx("div", { className: "sk-line", style: { width: "80%" } })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "member-details-row", children: [
                      /* @__PURE__ */ jsx("div", { className: "sk-pill", style: { width: "110px" } }),
                      /* @__PURE__ */ jsx("span", { className: "sk-pill", style: { width: "80px" } })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "member-meta-row", children: [
                      /* @__PURE__ */ jsx("div", { className: "sk-icon" }),
                      /* @__PURE__ */ jsx("div", { className: "sk-line", style: { width: "40%" } })
                    ] })
                  ] })
                ]
              },
              i
            )) });
          })() : filteredMembers.map((member, index) => {
            const roleInfo = getRoleInfo(member.role);
            const RoleIcon = roleInfo.icon;
            const displayId = member.somiti_user_id;
            const joinDateStr = (() => {
              const jd = member.joiningDate || member.joinDate || member.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || member.createdAt;
              try {
                return jd ? new Date(jd).toLocaleDateString("bn-BD") : "";
              } catch (e) {
                console.log("MemberList: joinDate in list formatting failed", e);
                return "";
              }
            })();
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `member-card member-card-minimal ${member.role}`,
                role: "listitem",
                tabIndex: 0,
                onClick: () => {
                  setDetailSimple(false);
                  handleMemberClick(member);
                },
                style: { padding: "4px" },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "member-card-header-row", style: { gap: "3px" }, children: [
                    /* @__PURE__ */ jsxs("div", { className: "member-serial-badge", children: [
                      "#",
                      displayId
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: `member-role-badge ${member.role}`, children: [
                      /* @__PURE__ */ jsx(RoleIcon, { className: "w-3 h-3" }),
                      roleInfo.label
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "member-card-content", style: { gap: "4px", alignItems: "center" }, children: [
                    member.photoURL || member.avatar ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: member.photoURL || member.avatar,
                        alt: member.name,
                        className: "member-avatar"
                      }
                    ) : /* @__PURE__ */ jsx("div", { className: "member-avatar-placeholder", children: getInitials(member.name) }),
                    /* @__PURE__ */ jsxs("div", { className: "member-info", children: [
                      /* @__PURE__ */ jsx("h3", { className: "member-name", children: member.name }),
                      /* @__PURE__ */ jsxs("div", { className: "member-address", children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                        /* @__PURE__ */ jsx("span", { children: member.address || "ঠিকানা যোগ করা হয়নি" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "member-details-row", children: [
                        /* @__PURE__ */ jsxs("div", { className: "member-share-info", children: [
                          /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            member.shareCount,
                            " শেয়ার"
                          ] })
                        ] }),
                        joinDateStr && /* @__PURE__ */ jsxs("div", { className: "member-join-date", children: [
                          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                          /* @__PURE__ */ jsx("span", { children: joinDateStr })
                        ] })
                      ] })
                    ] })
                  ] })
                ]
              },
              member.id
            );
          }) }),
          filteredMembers.length === 0 && !loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx(Users, { className: "mx-auto h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "কোনো সদস্য পাওয়া যায়নি" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।" })
          ] }),
          (() => {
            console.log("MemberList: bottom spacer added (120px + safe-area + 24px)");
            return null;
          })(),
          /* @__PURE__ */ jsx("div", { className: "member-list-bottom-spacer", "aria-hidden": "true" })
        ]
      }
    ),
    showAddMemberModal && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
        /* @__PURE__ */ jsxs("h2", { className: "modal-title", children: [
          /* @__PURE__ */ jsx(UserPlus, { size: 20 }),
          "নতুন সদস্য যোগ করুন"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "modal-close-btn",
            onClick: handleCloseModal,
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "modal-body", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitNewMember, className: "modal-form", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
          /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
            /* @__PURE__ */ jsx(User, { size: 18 }),
            "মূল তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "নাম *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: `form-input ${memberFormErrors.name ? "error" : ""}`,
                  value: newMemberData.name,
                  onChange: (e) => handleInputChange("name", e.target.value),
                  placeholder: "সদস্যের নাম লিখুন"
                }
              ),
              memberFormErrors.name && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                /* @__PURE__ */ jsx(Phone, { size: 16 }),
                "ফোন নম্বর (ঐচ্ছিক)"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  className: `form-input ${memberFormErrors.phone ? "error" : ""}`,
                  value: newMemberData.phone,
                  onChange: (e) => handleInputChange("phone", e.target.value),
                  placeholder: "01XXXXXXXXX (ঐচ্ছিক)"
                }
              ),
              memberFormErrors.phone && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.phone })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 16 }),
              "ঠিকানা (ঐচ্ছিক)"
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: `form-textarea ${memberFormErrors.address ? "error" : ""}`,
                value: newMemberData.address,
                onChange: (e) => handleInputChange("address", e.target.value),
                placeholder: "সম্পূর্ণ ঠিকানা লিখুন (ঐচ্ছিক)",
                rows: "2"
              }
            ),
            memberFormErrors.address && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.address })
          ] })
        ] }),
        (user?.role === "admin" || user?.role === "cashier") && /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
          /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
            /* @__PURE__ */ jsx(Crown, { size: 18 }),
            "ভূমিকা নির্বাচন"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
              /* @__PURE__ */ jsx(Crown, { size: 16 }),
              "সদস্যের ভূমিকা (ঐচ্ছিক)"
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: `form-select ${memberFormErrors.role ? "error" : ""}`,
                value: newMemberData.role,
                onChange: (e) => handleInputChange("role", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "member", children: "সদস্য" }),
                  /* @__PURE__ */ jsx("option", { value: "cashier", children: "ক্যাশিয়ার" }),
                  /* @__PURE__ */ jsx("option", { value: "admin", children: "অ্যাডমিন" })
                ]
              }
            ),
            memberFormErrors.role && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.role }),
            /* @__PURE__ */ jsxs("div", { className: "role-info-minimal", children: [
              /* @__PURE__ */ jsxs("div", { className: "role-info-trigger", children: [
                /* @__PURE__ */ jsx("span", { className: "role-info-label", children: "ভূমিকা সম্পর্কে জানুন" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "role-info-toggle",
                    onClick: () => setShowRoleInfo(!showRoleInfo),
                    "aria-label": "ভূমিকার বিস্তারিত তথ্য দেখুন",
                    children: /* @__PURE__ */ jsx(Info, { size: 16 })
                  }
                )
              ] }),
              showRoleInfo && /* @__PURE__ */ jsx("div", { className: "role-info-details", children: /* @__PURE__ */ jsxs("div", { className: "role-descriptions", children: [
                /* @__PURE__ */ jsxs("div", { className: "role-item", children: [
                  /* @__PURE__ */ jsx("span", { className: "role-badge member", children: "সদস্য" }),
                  /* @__PURE__ */ jsx("span", { className: "role-desc", children: "সাধারণ অ্যাক্সেস ও তথ্য দেখার সুবিধা" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "role-item", children: [
                  /* @__PURE__ */ jsx("span", { className: "role-badge cashier", children: "ক্যাশিয়ার" }),
                  /* @__PURE__ */ jsx("span", { className: "role-desc", children: "লেনদেন ব্যবস্থাপনা ও আর্থিক কার্যক্রম" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "role-item", children: [
                  /* @__PURE__ */ jsx("span", { className: "role-badge admin", children: "অ্যাডমিন" }),
                  /* @__PURE__ */ jsx("span", { className: "role-desc", children: "সম্পূর্ণ নিয়ন্ত্রণ ও ব্যবস্থাপনা অধিকার" })
                ] })
              ] }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
          /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
            /* @__PURE__ */ jsx(DollarSign, { size: 18 }),
            "শেয়ার তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
                "শেয়ার সংখ্যা *"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  className: `form-input ${memberFormErrors.shareCount ? "error" : ""}`,
                  value: newMemberData.shareCount,
                  onChange: (e) => handleInputChange("shareCount", e.target.value),
                  placeholder: "কতটি শেয়ার কিনেছেন",
                  min: "1"
                }
              ),
              memberFormErrors.shareCount && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.shareCount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "যোগদানের তারিখ (ঐচ্ছিক)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  className: "form-input",
                  value: newMemberData.joiningDate,
                  onChange: (e) => handleInputChange("joiningDate", e.target.value)
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
          /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
            /* @__PURE__ */ jsx(Users, { size: 18 }),
            "নমিনি তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                /* @__PURE__ */ jsx(User, { size: 16 }),
                "নমিনির নাম (ঐচ্ছিক)"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: `form-input ${memberFormErrors.nomineeName ? "error" : ""}`,
                  value: newMemberData.nomineeName,
                  onChange: (e) => handleInputChange("nomineeName", e.target.value),
                  placeholder: "নমিনির নাম লিখুন (ঐচ্ছিক)"
                }
              ),
              memberFormErrors.nomineeName && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineeName })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                /* @__PURE__ */ jsx(Phone, { size: 16 }),
                "নমিনির ফোন (ঐচ্ছিক)"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  className: `form-input ${memberFormErrors.nomineePhone ? "error" : ""}`,
                  value: newMemberData.nomineePhone,
                  onChange: (e) => handleInputChange("nomineePhone", e.target.value),
                  placeholder: "01XXXXXXXXX (ঐচ্ছিক)"
                }
              ),
              memberFormErrors.nomineePhone && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineePhone })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "নমিনির সাথে সম্পর্ক (ঐচ্ছিক)" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: `form-select ${memberFormErrors.nomineeRelation ? "error" : ""}`,
                value: newMemberData.nomineeRelation,
                onChange: (e) => handleInputChange("nomineeRelation", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "সম্পর্ক নির্বাচন করুন (ঐচ্ছিক)" }),
                  /* @__PURE__ */ jsx("option", { value: "পিতা", children: "পিতা" }),
                  /* @__PURE__ */ jsx("option", { value: "মাতা", children: "মাতা" }),
                  /* @__PURE__ */ jsx("option", { value: "স্বামী", children: "স্বামী" }),
                  /* @__PURE__ */ jsx("option", { value: "স্ত্রী", children: "স্ত্রী" }),
                  /* @__PURE__ */ jsx("option", { value: "ভাই", children: "ভাই" }),
                  /* @__PURE__ */ jsx("option", { value: "বোন", children: "বোন" }),
                  /* @__PURE__ */ jsx("option", { value: "ছেলে", children: "ছেলে" }),
                  /* @__PURE__ */ jsx("option", { value: "মেয়ে", children: "মেয়ে" }),
                  /* @__PURE__ */ jsx("option", { value: "অন্যান্য", children: "অন্যান্য" })
                ]
              }
            ),
            memberFormErrors.nomineeRelation && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineeRelation })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-actions", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "form-btn form-btn-cancel",
              onClick: handleCloseModal,
              children: [
                /* @__PURE__ */ jsx(X, { size: 16 }),
                "বাতিল"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "form-btn form-btn-primary",
              disabled: saving,
              children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
                "সংরক্ষণ করা হচ্ছে..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Save, { size: 16 }),
                "সংরক্ষণ করুন"
              ] })
            }
          )
        ] })
      ] }) })
    ] }) }),
    showDetailCard && selectedMember && /* @__PURE__ */ jsx("div", { className: "member-detail-overlay", onClick: closeDetailCard, children: /* @__PURE__ */ jsxs("div", { className: "member-detail-card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "member-detail-header", children: [
        /* @__PURE__ */ jsx("div", { className: "member-detail-avatar", children: selectedMember.photoURL || selectedMember.avatar ? /* @__PURE__ */ jsx(
          "img",
          {
            src: selectedMember.photoURL || selectedMember.avatar,
            alt: selectedMember.name,
            className: "member-detail-avatar-img"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "member-detail-avatar-placeholder", children: getInitials(selectedMember.name) }) }),
        /* @__PURE__ */ jsxs("div", { className: "member-detail-info", children: [
          /* @__PURE__ */ jsx("h3", { className: "member-detail-name", children: selectedMember.name }),
          /* @__PURE__ */ jsx("span", { className: `member-detail-role-badge ${selectedMember.role}`, children: getRoleInfo(selectedMember.role).label })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "member-detail-close", onClick: closeDetailCard, children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
      ] }),
      !detailSimple && /* @__PURE__ */ jsxs("div", { className: "member-detail-content", children: [
        (user?.role === "admin" || user?.role === "cashier") && /* @__PURE__ */ jsxs("div", { className: "member-detail-section", children: [
          /* @__PURE__ */ jsxs("h4", { className: "member-detail-section-title", children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
            "লগইন তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "member-detail-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "ইমেইল:" }),
              /* @__PURE__ */ jsxs("div", { className: "member-detail-value-with-copy", children: [
                /* @__PURE__ */ jsx("span", { className: "member-detail-value code", children: selectedMember.email }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "copy-btn",
                    onClick: () => copyToClipboard(selectedMember.email, "email"),
                    title: "ইমেইল কপি করুন",
                    children: copiedField === "email" ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "পাসওয়ার্ড:" }),
              /* @__PURE__ */ jsxs("div", { className: "member-detail-value-with-copy", children: [
                /* @__PURE__ */ jsx("span", { className: "member-detail-value code", children: selectedMember.password }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "copy-btn",
                    onClick: () => copyToClipboard(selectedMember.password || "", "password"),
                    title: "পাসওয়ার্ড কপি করুন",
                    children: copiedField === "password" ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "member-detail-section", children: [
          /* @__PURE__ */ jsxs("h4", { className: "member-detail-section-title", children: [
            /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
            "যোগাযোগের তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "member-detail-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "ফোন:" }),
              isEditing ? /* @__PURE__ */ jsx("input", { className: "member-edit-input", value: editMemberData.phone, onChange: (e) => handleEditInputChange("phone", e.target.value) }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: selectedMember.phone })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "ঠিকানা:" }),
              isEditing ? /* @__PURE__ */ jsx("textarea", { className: "member-edit-textarea", value: editMemberData.address, onChange: (e) => handleEditInputChange("address", e.target.value) }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: selectedMember.address })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "member-detail-section", children: [
          /* @__PURE__ */ jsxs("h4", { className: "member-detail-section-title", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "w-4 h-4" }),
            "শেয়ার তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "member-detail-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "মোট শেয়ার:" }),
              isEditing ? /* @__PURE__ */ jsx("input", { type: "number", className: "member-edit-input", value: editMemberData.shareCount, onChange: (e) => handleEditInputChange("shareCount", e.target.value) }) : /* @__PURE__ */ jsxs("span", { className: "member-detail-value", children: [
                selectedMember.shareCount,
                " টি"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "যোগদানের তারিখ:" }),
              isEditing ? /* @__PURE__ */ jsx("input", { type: "date", className: "member-edit-input", value: editMemberData.joiningDate, onChange: (e) => handleEditInputChange("joiningDate", e.target.value) }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: (() => {
                const jd = selectedMember.joiningDate || selectedMember.joinDate || selectedMember.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || selectedMember.createdAt;
                try {
                  return jd ? new Date(jd).toLocaleDateString("bn-BD") : "N/A";
                } catch (e) {
                  console.log("MemberList: joiningDate formatting failed", e);
                  return "N/A";
                }
              })() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "member-detail-progress", children: [
            /* @__PURE__ */ jsxs("div", { className: "member-detail-progress-header", children: [
              /* @__PURE__ */ jsx("span", { children: "শেয়ার অগ্রগতি" }),
              /* @__PURE__ */ jsxs("span", { className: "member-detail-progress-percentage", children: [
                Math.min(100, selectedMember.shareCount / 200 * 100).toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "member-detail-progress-bar", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "member-detail-progress-fill",
                style: { width: `${Math.min(100, selectedMember.shareCount / 200 * 100)}%` }
              }
            ) })
          ] })
        ] }),
        selectedMember.nomineeName && /* @__PURE__ */ jsxs("div", { className: "member-detail-section", children: [
          /* @__PURE__ */ jsxs("h4", { className: "member-detail-section-title", children: [
            /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }),
            "নমিনি তথ্য"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "member-detail-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "নমিনির নাম:" }),
              isEditing ? /* @__PURE__ */ jsx("input", { className: "member-edit-input", value: editMemberData.nomineeName, onChange: (e) => handleEditInputChange("nomineeName", e.target.value) }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: selectedMember.nomineeName })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "সম্পর্ক:" }),
              isEditing ? /* @__PURE__ */ jsxs("select", { className: "member-edit-input", value: editMemberData.nomineeRelation, onChange: (e) => handleEditInputChange("nomineeRelation", e.target.value), children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "সম্পর্ক নির্বাচন করুন" }),
                /* @__PURE__ */ jsx("option", { value: "পিতা", children: "পিতা" }),
                /* @__PURE__ */ jsx("option", { value: "মাতা", children: "মাতা" }),
                /* @__PURE__ */ jsx("option", { value: "স্বামী", children: "স্বামী" }),
                /* @__PURE__ */ jsx("option", { value: "স্ত্রী", children: "স্ত্রী" }),
                /* @__PURE__ */ jsx("option", { value: "ভাই", children: "ভাই" }),
                /* @__PURE__ */ jsx("option", { value: "বোন", children: "বোন" }),
                /* @__PURE__ */ jsx("option", { value: "ছেলে", children: "ছেলে" }),
                /* @__PURE__ */ jsx("option", { value: "মেয়ে", children: "মেয়ে" }),
                /* @__PURE__ */ jsx("option", { value: "অন্যান্য", children: "অন্যান্য" })
              ] }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: selectedMember.nomineeRelation })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "member-detail-item", children: [
              /* @__PURE__ */ jsx("span", { className: "member-detail-label", children: "ফোন:" }),
              isEditing ? /* @__PURE__ */ jsx("input", { className: "member-edit-input", value: editMemberData.nomineePhone, onChange: (e) => handleEditInputChange("nomineePhone", e.target.value) }) : /* @__PURE__ */ jsx("span", { className: "member-detail-value", children: selectedMember.nomineePhone })
            ] })
          ] })
        ] })
      ] }),
      !detailSimple && (user?.role === "admin" || user?.role === "cashier") && /* @__PURE__ */ jsxs("div", { className: "member-detail-footer", children: [
        /* @__PURE__ */ jsx("div", { className: "md-footer-left", children: !isEditing ? /* @__PURE__ */ jsx("button", { type: "button", className: "edit-btn", onClick: () => {
          console.log("MemberList: enter edit mode (footer)");
          setIsEditing(true);
        }, children: /* @__PURE__ */ jsx("span", { children: "সম্পাদনা" }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "save-btn", onClick: handleSaveMember, children: /* @__PURE__ */ jsx("span", { children: "সংরক্ষণ" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "cancel-btn", onClick: () => {
            console.log("MemberList: cancel edit (footer)");
            setIsEditing(false);
            setEditMemberData({
              name: selectedMember.name || "",
              phone: selectedMember.phone || "",
              address: selectedMember.address || "",
              shareCount: String(selectedMember.shareCount || ""),
              joiningDate: selectedMember.joiningDate || selectedMember.joinDate || selectedMember.createdAt ? new Date(selectedMember.joiningDate || selectedMember.joinDate || selectedMember.createdAt?.toDate?.() || selectedMember.createdAt).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              nomineeName: selectedMember.nomineeName || "",
              nomineePhone: selectedMember.nomineePhone || "",
              nomineeRelation: selectedMember.nomineeRelation || "",
              role: selectedMember.role || "member",
              status: selectedMember.status || "active"
            });
          }, children: /* @__PURE__ */ jsx("span", { children: "বাতিল" }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "md-footer-right", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "delete-btn", onClick: () => {
            console.log("MemberList: delete button clicked");
            setShowDeleteConfirm(true);
          }, children: /* @__PURE__ */ jsx("span", { children: "মুছুন" }) }),
          showDeleteConfirm && /* @__PURE__ */ jsxs("div", { className: "delete-confirm-popup", children: [
            /* @__PURE__ */ jsxs("div", { className: "delete-confirm-text", children: [
              `You're going to delete "`,
              selectedMember.name,
              '" from database.'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "delete-confirm-actions", children: [
              /* @__PURE__ */ jsx("button", { type: "button", className: "delete-btn", onClick: () => {
                console.log("MemberList: confirm delete");
                handleDeleteMember();
              }, children: /* @__PURE__ */ jsx("span", { children: "Confirm" }) }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "cancel-btn", onClick: () => {
                console.log("MemberList: cancel delete");
                setShowDeleteConfirm(false);
              }, children: /* @__PURE__ */ jsx("span", { children: "Cancel" }) })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const SearchInput = ({
  value,
  onChange,
  placeholder = "খুঁজুন...",
  className = ""
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-gray-400" }) }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value,
        onChange,
        placeholder,
        className: `form-input pl-10 ${className}`
      }
    )
  ] });
};
const TableHeader = ({ columns }) => {
  return /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsx("tr", { children: columns.map((column, index) => /* @__PURE__ */ jsx(
    "th",
    {
      className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      children: column
    },
    index
  )) }) });
};
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default"
}) => {
  if (!isOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const modalSizeClass = size === "large" ? "modal__content--large" : "";
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: handleOverlayClick, children: /* @__PURE__ */ jsxs("div", { className: `modal ${modalSizeClass}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "modal__header", children: [
      /* @__PURE__ */ jsx("h2", { className: "modal__title", children: title }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "modal__close",
          onClick: onClose,
          "aria-label": "Close modal",
          children: "✕"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "modal__content", children })
  ] }) });
};
const InvestmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const investments = [
    {
      id: 1,
      title: "N/A",
      amount: 0,
      currentValue: 0,
      status: "active",
      bank: "N/A",
      investmentDate: "N/A",
      maturityDate: "N/A",
      expectedReturn: 0
    },
    {
      id: 2,
      title: "N/A",
      amount: 0,
      currentValue: 0,
      status: "active",
      bank: "N/A",
      investmentDate: "N/A",
      maturityDate: "N/A",
      expectedReturn: 0
    },
    {
      id: 3,
      title: "N/A",
      amount: 0,
      currentValue: 0,
      status: "matured",
      bank: "N/A",
      investmentDate: "N/A",
      maturityDate: "N/A",
      expectedReturn: 0
    }
  ];
  const investmentSummary = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    currentValue: investments.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalReturn: investments.reduce((sum, inv) => sum + (inv.currentValue - inv.amount), 0)
  };
  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch = investment.title.toLowerCase().includes(searchTerm.toLowerCase()) || investment.bank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || investment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const [newInvestment, setNewInvestment] = useState({
    title: "",
    amount: "",
    bank: "",
    investmentDate: "",
    maturityDate: "",
    expectedReturn: ""
  });
  const handleAddInvestment = () => {
    console.log("Adding investment:", newInvestment);
    setShowAddModal(false);
    setNewInvestment({
      title: "",
      amount: "",
      bank: "",
      investmentDate: "",
      maturityDate: "",
      expectedReturn: ""
    });
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: "investment-status-badge active", label: "সক্রিয়" },
      matured: { className: "investment-status-badge matured", label: "পরিপক্ব" },
      closed: { className: "investment-status-badge closed", label: "বন্ধ" }
    };
    const config = statusConfig[status] || statusConfig.active;
    return /* @__PURE__ */ jsx("span", { className: config.className, children: config.label });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "বিনিয়োগ ব্যবস্থাপনা" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "সমিতির বিনিয়োগ তথ্য ও পরিচালনা" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "investment-summary-card investment-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "investment-summary-icon blue", children: /* @__PURE__ */ jsx(DollarSign, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "মোট বিনিয়োগ" }),
          /* @__PURE__ */ jsxs("p", { className: "investment-amount large neutral", children: [
            "৳ ",
            investmentSummary.totalInvested.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "investment-summary-card positive investment-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "investment-summary-icon green", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "বর্তমান মূল্য" }),
          /* @__PURE__ */ jsxs("p", { className: "investment-amount large positive", children: [
            "৳ ",
            investmentSummary.currentValue.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: `investment-summary-card ${investmentSummary.totalReturn >= 0 ? "positive" : "negative"} investment-fade-in`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: `investment-summary-icon ${investmentSummary.totalReturn >= 0 ? "green" : "red"}`, children: /* @__PURE__ */ jsx(BarChart3, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "মোট রিটার্ন" }),
          /* @__PURE__ */ jsxs("p", { className: `investment-amount large ${investmentSummary.totalReturn >= 0 ? "positive" : "negative"}`, children: [
            "৳ ",
            investmentSummary.totalReturn.toLocaleString()
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "investment-search-container", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          SearchInput,
          {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "বিনিয়োগ বা ব্যাংকের নাম খুঁজুন...",
            className: "w-64"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            className: "investment-filter-select",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "সব অবস্থা" }),
              /* @__PURE__ */ jsx("option", { value: "active", children: "সক্রিয়" }),
              /* @__PURE__ */ jsx("option", { value: "matured", children: "পরিপক্ব" }),
              /* @__PURE__ */ jsx("option", { value: "closed", children: "বন্ধ" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
        "মোট ",
        filteredInvestments.length,
        " টি বিনিয়োগ পাওয়া গেছে"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx(
        TableHeader,
        {
          columns: [
            "বিনিয়োগের বিবরণ",
            "বিনিয়োগের পরিমাণ",
            "বর্তমান মূল্য",
            "অবস্থা",
            "কার্যক্রম"
          ]
        }
      ),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredInvestments.map((investment) => /* @__PURE__ */ jsxs("tr", { className: "investment-table-row", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: investment.title }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: investment.bank })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "investment-amount neutral", children: [
          "৳ ",
          investment.amount.toLocaleString()
        ] }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [
          /* @__PURE__ */ jsxs("div", { className: "investment-amount neutral", children: [
            "৳ ",
            investment.currentValue.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `text-xs investment-amount ${investment.currentValue >= investment.amount ? "positive" : "negative"}`, children: [
            investment.currentValue >= investment.amount ? "+" : "",
            "৳ ",
            (investment.currentValue - investment.amount).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(investment.status) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSelectedInvestment(investment);
                setShowDetailsModal(true);
              },
              className: "investment-action-btn view",
              children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "investment-action-btn edit", children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "investment-action-btn delete", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
        ] }) })
      ] }, investment.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Modal, { isOpen: showAddModal, onClose: () => setShowAddModal(false), title: "নতুন বিনিয়োগ যোগ করুন", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
        /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "বিনিয়োগের নাম" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newInvestment.title,
            onChange: (e) => setNewInvestment({ ...newInvestment, title: e.target.value }),
            className: "investment-modal-input",
            placeholder: "যেমন: ব্যাংক ফিক্সড ডিপোজিট"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
        /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "বিনিয়োগের পরিমাণ" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: newInvestment.amount,
            onChange: (e) => setNewInvestment({ ...newInvestment, amount: e.target.value }),
            className: "investment-modal-input",
            placeholder: "০"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
        /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "ব্যাংক/প্রতিষ্ঠান" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: newInvestment.bank,
            onChange: (e) => setNewInvestment({ ...newInvestment, bank: e.target.value }),
            className: "investment-modal-input",
            placeholder: "যেমন: ইসলামী ব্যাংক বাংলাদেশ"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
          /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "বিনিয়োগের তারিখ" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: newInvestment.investmentDate,
              onChange: (e) => setNewInvestment({ ...newInvestment, investmentDate: e.target.value }),
              className: "investment-modal-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
          /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "মেয়াদ শেষের তারিখ" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: newInvestment.maturityDate,
              onChange: (e) => setNewInvestment({ ...newInvestment, maturityDate: e.target.value }),
              className: "investment-modal-input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-field", children: [
        /* @__PURE__ */ jsx("label", { className: "investment-modal-label", children: "প্রত্যাশিত রিটার্ন (%)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            step: "0.1",
            value: newInvestment.expectedReturn,
            onChange: (e) => setNewInvestment({ ...newInvestment, expectedReturn: e.target.value }),
            className: "investment-modal-input",
            placeholder: "যেমন: ৮.৪"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "investment-modal-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowAddModal(false),
            className: "investment-modal-btn-cancel",
            children: "বাতিল"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAddInvestment,
            className: "investment-modal-btn-primary",
            children: "যোগ করুন"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: showDetailsModal,
        onClose: () => setShowDetailsModal(false),
        title: "বিনিয়োগের বিস্তারিত",
        children: selectedInvestment && /* @__PURE__ */ jsxs("div", { className: "investment-details-modal", children: [
          /* @__PURE__ */ jsxs("div", { className: "investment-details-header", children: [
            /* @__PURE__ */ jsx("h3", { className: "investment-details-title", children: selectedInvestment.title }),
            /* @__PURE__ */ jsx("p", { className: "investment-details-bank", children: selectedInvestment.bank })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "investment-details-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "বিনিয়োগের পরিমাণ" }),
              /* @__PURE__ */ jsxs("p", { className: "investment-details-value", children: [
                "৳ ",
                selectedInvestment.amount.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "বর্তমান মূল্য" }),
              /* @__PURE__ */ jsxs("p", { className: "investment-details-value", children: [
                "৳ ",
                selectedInvestment.currentValue.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "বিনিয়োগের তারিখ" }),
              /* @__PURE__ */ jsx("p", { className: "investment-details-value", children: new Date(selectedInvestment.investmentDate).toLocaleDateString("bn-BD") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "মেয়াদ শেষের তারিখ" }),
              /* @__PURE__ */ jsx("p", { className: "investment-details-value", children: selectedInvestment.maturityDate ? new Date(selectedInvestment.maturityDate).toLocaleDateString("bn-BD") : "নির্দিষ্ট নেই" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "investment-details-grid", children: [
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "প্রত্যাশিত রিটার্ন" }),
              /* @__PURE__ */ jsxs("p", { className: "investment-details-value", children: [
                selectedInvestment.expectedReturn,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "investment-details-item", children: [
              /* @__PURE__ */ jsx("p", { className: "investment-details-label", children: "লাভ/ক্ষতি" }),
              /* @__PURE__ */ jsxs("p", { className: `investment-details-value ${selectedInvestment.currentValue >= selectedInvestment.amount ? "profit" : "loss"}`, children: [
                "৳ ",
                (selectedInvestment.currentValue - selectedInvestment.amount).toLocaleString()
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] });
};
const ProfitDistribution = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const profitDistributions = [
    {
      id: 1,
      year: 2024,
      quarter: "Q2",
      totalProfit: 125e3,
      distributedAmount: 1e5,
      reservedAmount: 25e3,
      distributionDate: "2024-06-30",
      status: "distributed",
      profitRate: 12.5,
      memberCount: 71,
      perShareProfit: 1408
    },
    {
      id: 2,
      year: 2024,
      quarter: "Q1",
      totalProfit: 98e3,
      distributedAmount: 78400,
      reservedAmount: 19600,
      distributionDate: "2024-03-31",
      status: "distributed",
      profitRate: 11.2,
      memberCount: 70,
      perShareProfit: 1120
    },
    {
      id: 3,
      year: 2023,
      quarter: "Q4",
      totalProfit: 11e4,
      distributedAmount: 88e3,
      reservedAmount: 22e3,
      distributionDate: "2023-12-31",
      status: "distributed",
      profitRate: 13.8,
      memberCount: 68,
      perShareProfit: 1294
    }
  ];
  const memberProfits = [
    {
      id: 1,
      memberName: "মোহাম্মদ রহিম উদ্দিন",
      memberId: "SM-001",
      shareCount: 25,
      profitAmount: 35200,
      distributionDate: "2024-06-30",
      status: "paid",
      paymentMethod: "bank_transfer"
    },
    {
      id: 2,
      memberName: "ফাতেমা খাতুন",
      memberId: "SM-002",
      shareCount: 15,
      profitAmount: 21120,
      distributionDate: "2024-06-30",
      status: "paid",
      paymentMethod: "cash"
    },
    {
      id: 3,
      memberName: "আব্দুল কাদের",
      memberId: "SM-003",
      shareCount: 10,
      profitAmount: 14080,
      distributionDate: "2024-06-30",
      status: "pending",
      paymentMethod: null
    },
    {
      id: 4,
      memberName: "নাসির উদ্দিন আহমেদ",
      memberId: "SM-004",
      shareCount: 20,
      profitAmount: 28160,
      distributionDate: "2024-06-30",
      status: "paid",
      paymentMethod: "mobile_banking"
    }
  ];
  const yearlyProfitTrend = [
    { year: "২০২০", profit: 85e3, rate: 9.5 },
    { year: "২০২১", profit: 95e3, rate: 10.2 },
    { year: "২০২২", profit: 105e3, rate: 11.8 },
    { year: "২০২৩", profit: 118e3, rate: 12.1 },
    { year: "২০২৪", profit: 125e3, rate: 12.5 }
  ];
  const profitSources = [
    { source: "বিনিয়োগ রিটার্ন", amount: 75e3, percentage: 60, color: "#0A6CFF" },
    { source: "ব্যাংক সুদ", amount: 3e4, percentage: 24, color: "#00BFA5" },
    { source: "ব্যবসায়িক লাভ", amount: 15e3, percentage: 12, color: "#FF6B35" },
    { source: "অন্যান্য", amount: 5e3, percentage: 4, color: "#8B5CF6" }
  ];
  const distributionByShare = [
    { range: "১-১০ শেয়ার", members: 25, amount: 35200, avgProfit: 1408 },
    { range: "১১-২৫ শেয়ার", members: 30, amount: 63360, avgProfit: 2112 },
    { range: "২৬-৫০ শেয়ার", members: 12, amount: 50688, avgProfit: 4224 },
    { range: "৫০+ শেয়ার", members: 4, amount: 28160, avgProfit: 7040 }
  ];
  const currentDistribution = profitDistributions[0];
  const totalDistributed = memberProfits.filter((m) => m.status === "paid").reduce((sum, m) => sum + m.profitAmount, 0);
  const pendingDistribution = memberProfits.filter((m) => m.status === "pending").reduce((sum, m) => sum + m.profitAmount, 0);
  const filteredMembers = memberProfits.filter(
    (member) => member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [newDistribution, setNewDistribution] = useState({
    quarter: "Q3",
    year: "2024",
    totalProfit: "",
    distributionPercentage: 80,
    reservePercentage: 20,
    distributionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const handleDistributeProfit = () => {
    console.log("Distributing profit:", newDistribution);
    setShowDistributeModal(false);
    setNewDistribution({
      quarter: "Q3",
      year: "2024",
      totalProfit: "",
      distributionPercentage: 80,
      reservePercentage: 20,
      distributionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "লাভ বিতরণ ব্যবস্থাপনা" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "সদস্যদের মধ্যে লাভ বিতরণ ও ট্র্যাকিং" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowDistributeModal(true),
            className: "flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "লাভ বিতরণ করুন"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors", children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
          "রিপোর্ট ডাউনলোড"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-blue-100", children: /* @__PURE__ */ jsx(DollarSign, { className: "h-6 w-6 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "মোট লাভ" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
            "৳ ",
            currentDistribution.totalProfit.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-green-100", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-green-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "বিতরণকৃত" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
            "৳ ",
            totalDistributed.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-yellow-100", children: /* @__PURE__ */ jsx(Clock, { className: "h-6 w-6 text-yellow-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "বকেয়া" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
            "৳ ",
            pendingDistribution.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-purple-100", children: /* @__PURE__ */ jsx(Percent, { className: "h-6 w-6 text-purple-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "লাভের হার" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
            currentDistribution.profitRate,
            "%"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-teal-100", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6 text-teal-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-600", children: "মোট সদস্য" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: currentDistribution.memberCount })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "বার্ষিক লাভের ট্রেন্ড" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(LineChart, { data: yearlyProfitTrend, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "year" }),
          /* @__PURE__ */ jsx(YAxis, {}),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => `৳ ${value.toLocaleString()}` }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "profit", stroke: "#0A6CFF", strokeWidth: 2, name: "লাভ" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "লাভের উৎস" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(PieChart$2, { children: [
          /* @__PURE__ */ jsx(
            Pie,
            {
              data: profitSources,
              cx: "50%",
              cy: "50%",
              innerRadius: 60,
              outerRadius: 100,
              paddingAngle: 5,
              dataKey: "amount",
              children: profitSources.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => `৳ ${value.toLocaleString()}` })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: profitSources.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full mr-2`, style: { backgroundColor: item.color } }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: item.source })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            item.percentage,
            "%"
          ] })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "শেয়ার অনুযায়ী বিতরণ" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(BarChart, { data: distributionByShare, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "range" }),
          /* @__PURE__ */ jsx(YAxis, {}),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => `৳ ${value.toLocaleString()}` }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "amount", fill: "#0A6CFF" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "সাম্প্রতিক লাভ বিতরণ" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedYear,
            onChange: (e) => setSelectedYear(e.target.value),
            className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent",
            children: [
              /* @__PURE__ */ jsx("option", { value: "2024", children: "২০২৪" }),
              /* @__PURE__ */ jsx("option", { value: "2023", children: "২০২৩" }),
              /* @__PURE__ */ jsx("option", { value: "2022", children: "২০২২" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "সময়কাল" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "মোট লাভ" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "বিতরণকৃত" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "রিজার্ভ" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "লাভের হার" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "অবস্থা" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "কার্যক্রম" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: profitDistributions.map((distribution) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
              distribution.quarter,
              " ",
              distribution.year
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: distribution.distributionDate })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            "৳ ",
            distribution.totalProfit.toLocaleString()
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            "৳ ",
            distribution.distributedAmount.toLocaleString()
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            "৳ ",
            distribution.reservedAmount.toLocaleString()
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            distribution.profitRate,
            "%"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(distribution.status)}`, children: [
            distribution.status === "distributed" && "বিতরণ সম্পন্ন",
            distribution.status === "processing" && "প্রক্রিয়াধীন",
            distribution.status === "pending" && "অপেক্ষমান"
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedDistribution(distribution);
                  setShowDetailsModal(true);
                },
                className: "text-primary hover:text-blue-600 mr-3",
                children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx("button", { className: "text-secondary hover:text-teal-600", children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) })
          ] })
        ] }, distribution.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "সদস্যদের লাভ বিতরণের বিবরণ" }),
        /* @__PURE__ */ jsx(
          SearchInput,
          {
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "সদস্যের নাম বা আইডি খুঁজুন...",
            className: "w-64"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ jsx(
          TableHeader,
          {
            columns: [
              "সদস্যের তথ্য",
              "শেয়ার সংখ্যা",
              "লাভের পরিমাণ",
              "পেমেন্ট পদ্ধতি",
              "অবস্থা",
              "কার্যক্রম"
            ]
          }
        ),
        /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredMembers.map((member) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: member.memberName }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
              "আইডি: ",
              member.somiti_user_id
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            member.shareCount,
            " টি"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-gray-900", children: [
            "৳ ",
            member.profitAmount.toLocaleString()
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-900", children: [
            member.paymentMethod === "bank_transfer" && "ব্যাংক ট্রান্সফার",
            member.paymentMethod === "cash" && "নগদ",
            member.paymentMethod === "mobile_banking" && "মোবাইল ব্যাংকিং",
            !member.paymentMethod && "-"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`, children: [
            member.status === "paid" && "পরিশোধিত",
            member.status === "pending" && "অপেক্ষমান",
            member.status === "processing" && "প্রক্রিয়াধীন"
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [
            member.status === "pending" && /* @__PURE__ */ jsx("button", { className: "text-green-600 hover:text-green-800 mr-3", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "text-primary hover:text-blue-600", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }, member.id)) })
      ] }) })
    ] }),
    showDistributeModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "নতুন লাভ বিতরণ" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDistributeModal(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleDistributeProfit();
      }, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "কোয়ার্টার *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                required: true,
                value: newDistribution.quarter,
                onChange: (e) => setNewDistribution({ ...newDistribution, quarter: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Q1", children: "প্রথম কোয়ার্টার (Q1)" }),
                  /* @__PURE__ */ jsx("option", { value: "Q2", children: "দ্বিতীয় কোয়ার্টার (Q2)" }),
                  /* @__PURE__ */ jsx("option", { value: "Q3", children: "তৃতীয় কোয়ার্টার (Q3)" }),
                  /* @__PURE__ */ jsx("option", { value: "Q4", children: "চতুর্থ কোয়ার্টার (Q4)" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "বছর *" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                required: true,
                value: newDistribution.year,
                onChange: (e) => setNewDistribution({ ...newDistribution, year: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "2024", children: "২০২৪" }),
                  /* @__PURE__ */ jsx("option", { value: "2023", children: "২০২৩" }),
                  /* @__PURE__ */ jsx("option", { value: "2022", children: "২০২২" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "মোট লাভের পরিমাণ (৳) *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              required: true,
              value: newDistribution.totalProfit,
              onChange: (e) => setNewDistribution({ ...newDistribution, totalProfit: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
              placeholder: "মোট লাভের পরিমাণ লিখুন"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "বিতরণের শতাংশ *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                required: true,
                value: newDistribution.distributionPercentage,
                onChange: (e) => {
                  const dist = parseInt(e.target.value);
                  setNewDistribution({
                    ...newDistribution,
                    distributionPercentage: dist,
                    reservePercentage: 100 - dist
                  });
                },
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "রিজার্ভের শতাংশ" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: newDistribution.reservePercentage,
                readOnly: true,
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "বিতরণের তারিখ *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              required: true,
              value: newDistribution.distributionDate,
              onChange: (e) => setNewDistribution({ ...newDistribution, distributionDate: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            }
          )
        ] }),
        newDistribution.totalProfit && /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-900 mb-3", children: "গণনার পূর্বরূপ" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "বিতরণযোগ্য পরিমাণ:" }),
              /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                "৳ ",
                (newDistribution.totalProfit * newDistribution.distributionPercentage / 100).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "রিজার্ভ পরিমাণ:" }),
              /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                "৳ ",
                (newDistribution.totalProfit * newDistribution.reservePercentage / 100).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "প্রতি শেয়ার লাভ:" }),
              /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
                "৳ ",
                Math.round(newDistribution.totalProfit * newDistribution.distributionPercentage / 100 / 71).toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "মোট সদস্য:" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "৭১ জন" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowDistributeModal(false),
              className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50",
              children: "বাতিল"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600",
              children: "লাভ বিতরণ করুন"
            }
          )
        ] })
      ] })
    ] }) }),
    showDetailsModal && selectedDistribution && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [
          selectedDistribution.quarter,
          " ",
          selectedDistribution.year,
          " - লাভ বিতরণের বিস্তারিত"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDetailsModal(false),
            className: "text-gray-400 hover:text-gray-600",
            children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-blue-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "h-8 w-8 text-blue-600" }),
            /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-600", children: "মোট লাভ" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-blue-900", children: [
                "৳ ",
                selectedDistribution.totalProfit.toLocaleString()
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-green-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-8 w-8 text-green-600" }),
            /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-600", children: "বিতরণকৃত" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-green-900", children: [
                "৳ ",
                selectedDistribution.distributedAmount.toLocaleString()
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-purple-50 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(PieChart, { className: "h-8 w-8 text-purple-600" }),
            /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-purple-600", children: "রিজার্ভ" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-purple-900", children: [
                "৳ ",
                selectedDistribution.reservedAmount.toLocaleString()
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-3", children: "বিতরণের তথ্য" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "বিতরণের তারিখ:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: selectedDistribution.distributionDate })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "লাভের হার:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  selectedDistribution.profitRate,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "মোট সদস্য:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  selectedDistribution.memberCount,
                  " জন"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "প্রতি শেয়ার লাভ:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  "৳ ",
                  selectedDistribution.perShareProfit
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-3", children: "বিতরণের অনুপাত" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "বিতরণ:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  (selectedDistribution.distributedAmount / selectedDistribution.totalProfit * 100).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "রিজার্ভ:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  (selectedDistribution.reservedAmount / selectedDistribution.totalProfit * 100).toFixed(1),
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "bg-green-500 h-3 rounded-full",
                  style: { width: `${selectedDistribution.distributedAmount / selectedDistribution.totalProfit * 100}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-600 mt-1", children: [
                /* @__PURE__ */ jsx("span", { children: "বিতরণকৃত" }),
                /* @__PURE__ */ jsx("span", { children: "রিজার্ভ" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDetailsModal(false),
            className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50",
            children: "বন্ধ করুন"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600", children: "রিপোর্ট ডাউনলোড" })
      ] })
    ] }) })
  ] });
};
console.log("[ModeSwitcher] File loaded");
const ModeSwitcher = () => {
  const { mode, switchMode } = useMode();
  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      if (window.confirm(`আপনি কি ${newMode === "demo" ? "ডেমো" : "প্রোডাকশন"} মোডে যেতে চান? পৃষ্ঠা পুনরায় লোড হবে।`)) {
        switchMode(newMode);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mode-switcher-section", children: [
    /* @__PURE__ */ jsxs("div", { className: "mode-switcher-header", children: [
      /* @__PURE__ */ jsx(RefreshCw, { size: 20 }),
      /* @__PURE__ */ jsx("h3", { children: "মোড পরিবর্তন করুন" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mode-switcher-description", children: "প্রোডাকশন এবং ডেমো মোডের মধ্যে পরিবর্তন করুন। ডেমো মোডে নমুনা ডেটা প্রদর্শিত হবে।" }),
    /* @__PURE__ */ jsxs("div", { className: "mode-options", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: `mode-option ${mode === "production" ? "active" : ""}`,
          onClick: () => handleModeChange("production"),
          children: [
            /* @__PURE__ */ jsx("div", { className: "mode-option-icon production", children: /* @__PURE__ */ jsx(Database, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { className: "mode-option-content", children: [
              /* @__PURE__ */ jsx("h4", { children: "প্রোডাকশন মোড" }),
              /* @__PURE__ */ jsx("p", { children: "আসল ডেটা এবং সম্পূর্ণ কার্যকারিতা" })
            ] }),
            mode === "production" && /* @__PURE__ */ jsx("div", { className: "mode-checkmark", children: "✓" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: `mode-option ${mode === "demo" ? "active" : ""}`,
          onClick: () => handleModeChange("demo"),
          children: [
            /* @__PURE__ */ jsx("div", { className: "mode-option-icon demo", children: /* @__PURE__ */ jsx(TestTube, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { className: "mode-option-content", children: [
              /* @__PURE__ */ jsx("h4", { children: "ডেমো মোড" }),
              /* @__PURE__ */ jsx("p", { children: "নমুনা ডেটা দিয়ে পরীক্ষা করুন" })
            ] }),
            mode === "demo" && /* @__PURE__ */ jsx("div", { className: "mode-checkmark", children: "✓" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mode-current-status", children: /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "বর্তমান মোড:" }),
      " ",
      mode === "demo" ? "ডেমো মোড" : "প্রোডাকশন মোড"
    ] }) })
  ] });
};
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [saveStatus, setSaveStatus] = useState("");
  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    transactionAlerts: true,
    membershipAlerts: true,
    securityAlerts: true
  });
  const [systemPreferences, setSystemPreferences] = useState({
    language: "bn",
    theme: "light",
    currency: "BDT"
  });
  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSystemChange = (key, value) => {
    setSystemPreferences((prev) => ({ ...prev, [key]: value }));
  };
  const saveChanges = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 2e3);
    }, 500);
  };
  const tabs = [
    { id: "notifications", label: "নোটিফিকেশন", icon: Bell },
    { id: "system", label: "সিস্টেম", icon: Settings }
  ];
  const notificationItems = [
    { key: "systemAlerts", title: "সিস্টেম সতর্কতা", desc: "সিস্টেম ত্রুটি ও রক্ষণাবেক্ষণ", icon: Globe, color: "text-blue-500" },
    { key: "transactionAlerts", title: "লেনদেন সতর্কতা", desc: "নতুন লেনদেন ও আর্থিক কার্যক্রম", icon: Save, color: "text-green-500" },
    { key: "membershipAlerts", title: "সদস্যপদ সতর্কতা", desc: "নতুন সদস্য ও সদস্যপদ পরিবর্তন", icon: Bell, color: "text-yellow-500" },
    { key: "securityAlerts", title: "নিরাপত্তা সতর্কতা", desc: "সন্দেহজনক কার্যকলাপ ও নিরাপত্তা", icon: Shield, color: "text-red-500" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "admin-settings", children: [
    /* @__PURE__ */ jsxs("div", { className: "admin-settings-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-settings-header", children: [
        /* @__PURE__ */ jsx("h1", { className: "admin-settings-title", children: "অ্যাডমিন সেটিংস" }),
        /* @__PURE__ */ jsx("p", { className: "admin-settings-subtitle", children: "সিস্টেম ও প্রশাসনিক সেটিংস পরিচালনা করুন" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-settings-tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `admin-tab ${activeTab === tab.id ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(tab.icon, { className: "h-4 w-4 mr-2" }),
            tab.label
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "admin-tab-content", children: [
        activeTab === "notifications" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-section-header", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-icon", children: /* @__PURE__ */ jsx(Bell, {}) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "নোটিফিকেশন সেটিংস" }),
              /* @__PURE__ */ jsx("p", { className: "settings-section-subtitle", children: "আপনার নোটিফিকেশন পছন্দ পরিচালনা করুন" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "settings-grid", children: /* @__PURE__ */ jsxs("div", { className: "settings-group", children: [
            /* @__PURE__ */ jsxs("h3", { className: "settings-group-title", children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
              "সতর্কতা সেটিংস"
            ] }),
            notificationItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
              /* @__PURE__ */ jsxs("div", { className: "settings-item-info", children: [
                /* @__PURE__ */ jsx("h4", { children: item.title }),
                /* @__PURE__ */ jsx("p", { children: item.desc })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleNotificationChange(item.key),
                  className: `toggle-switch ${notificationSettings[item.key] ? "active" : ""}`
                }
              )
            ] }, item.key))
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "admin-notice", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "admin-notice-icon" }),
            /* @__PURE__ */ jsx("p", { className: "admin-notice-text", children: "সেটিংস স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়" })
          ] })
        ] }),
        activeTab === "system" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-section-header", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-icon", children: /* @__PURE__ */ jsx(Settings, {}) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "সিস্টেম সেটিংস" }),
              /* @__PURE__ */ jsx("p", { className: "settings-section-subtitle", children: "সিস্টেম পছন্দ কনফিগার করুন" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "settings-grid", children: /* @__PURE__ */ jsxs("div", { className: "settings-group", children: [
            /* @__PURE__ */ jsxs("h3", { className: "settings-group-title", children: [
              /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
              "সাধারণ সেটিংস"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "ভাষা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.language,
                  onChange: (e) => handleSystemChange("language", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "bn", children: "বাংলা" }),
                    /* @__PURE__ */ jsx("option", { value: "en", children: "English" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "থিম" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.theme,
                  onChange: (e) => handleSystemChange("theme", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "light", children: "হালকা" }),
                    /* @__PURE__ */ jsx("option", { value: "dark", children: "গাঢ়" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "মুদ্রা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.currency,
                  onChange: (e) => handleSystemChange("currency", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "BDT", children: "বাংলাদেশী টাকা (৳)" }),
                    /* @__PURE__ */ jsx("option", { value: "USD", children: "US Dollar ($)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: saveChanges,
                className: "settings-button settings-button-primary",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                  "সেটিংস সংরক্ষণ করুন"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(ModeSwitcher, {})
        ] })
      ] })
    ] }),
    saveStatus && /* @__PURE__ */ jsx("div", { className: `save-status ${saveStatus === "saving" ? "error" : "success"}`, children: saveStatus === "saving" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }),
      /* @__PURE__ */ jsx("span", { children: "সংরক্ষণ করা হচ্ছে..." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
      /* @__PURE__ */ jsx("span", { children: "সংরক্ষিত হয়েছে!" })
    ] }) })
  ] });
};
const supabaseUrl = getPublicEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getPublicEnv("VITE_SUPABASE_ANON_KEY");
let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[supabase] Missing environment. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build or window.__ENV__.");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
  console.log("[supabase] client initialized");
}
const STORAGE_BUCKET = "profile_photo";
const profilePhotoService = {
  async uploadProfilePhoto(userId, file) {
    try {
      if (!supabase) {
        console.error("Supabase client not initialized");
        throw new Error("Supabase client not initialized");
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
      await this.savePhotoURLToFirestore(userId, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw error;
    }
  },
  async deleteProfilePhoto(userId, photoURL) {
    try {
      if (!supabase) {
        console.error("Supabase client not initialized");
        throw new Error("Supabase client not initialized");
      }
      if (!photoURL) return;
      const urlParts = photoURL.split(`${STORAGE_BUCKET}/`);
      if (urlParts.length < 2) {
        throw new Error("Invalid photo URL");
      }
      const filePath = urlParts[1];
      const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      await this.savePhotoURLToFirestore(userId, null);
      return true;
    } catch (error) {
      console.error("Error deleting profile photo:", error);
      throw error;
    }
  },
  async savePhotoURLToFirestore(userId, photoURL) {
    try {
      const memberRef = doc(db, "members", userId);
      await updateDoc(memberRef, {
        photoURL: photoURL || null,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error saving photo URL to Firestore:", error);
      throw error;
    }
  },
  getPublicUrl(filePath) {
    if (!supabase) {
      console.error("Supabase client not initialized");
      throw new Error("Supabase client not initialized");
    }
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }
};
const ProfilePhotoModal = ({ isOpen, onClose, userId, currentPhotoURL, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels2) => {
    setCroppedAreaPixels(croppedAreaPixels2);
  }, []);
  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.95);
    });
  };
  const createImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error2) => reject(error2));
      image.src = url;
    });
  };
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ছবির আকার ৫ MB এর কম হতে হবে");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };
  const handleCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    setUploading(true);
    setError(null);
    try {
      const croppedBlob = await createCroppedImage(selectedImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const photoURL = await profilePhotoService.uploadProfilePhoto(userId, croppedFile);
      onPhotoUpdate(photoURL);
      setShowCropper(false);
      setSelectedImage(null);
      onClose();
    } catch (err) {
      setError("ছবি আপলোড করতে সমস্যা হয়েছে");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  const handleDelete = async () => {
    if (!currentPhotoURL) return;
    const confirmed = window.confirm("আপনি কি নিশ্চিত যে আপনি এই ছবি মুছে ফেলতে চান?");
    if (!confirmed) return;
    setError(null);
    setDeleting(true);
    try {
      await profilePhotoService.deleteProfilePhoto(userId, currentPhotoURL);
      onPhotoUpdate(null);
      onClose();
    } catch (err) {
      setError("ছবি মুছতে সমস্যা হয়েছে");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: showCropper ? null : onClose, children: /* @__PURE__ */ jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
      /* @__PURE__ */ jsx("h2", { children: showCropper ? "ছবি ক্রপ করুন" : "প্রোফাইল ছবি" }),
      /* @__PURE__ */ jsx("button", { className: "close-button", onClick: showCropper ? handleCropCancel : onClose, children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "modal-body", children: [
      error && /* @__PURE__ */ jsx("div", { className: "error-message", children: error }),
      showCropper ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "crop-container", children: /* @__PURE__ */ jsx(
          Cropper,
          {
            image: selectedImage,
            crop,
            zoom,
            aspect: 1,
            cropShape: "round",
            showGrid: false,
            onCropChange: setCrop,
            onZoomChange: setZoom,
            onCropComplete
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "crop-controls", children: [
          /* @__PURE__ */ jsx("label", { className: "zoom-label", children: "জুম" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: 1,
              max: 3,
              step: 0.1,
              value: zoom,
              onChange: (e) => setZoom(Number(e.target.value)),
              className: "zoom-slider"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "modal-actions", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "action-button upload-button",
              onClick: handleCropConfirm,
              disabled: uploading,
              children: [
                /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }),
                /* @__PURE__ */ jsx("span", { children: uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "action-button cancel-button",
              onClick: handleCropCancel,
              disabled: uploading,
              children: [
                /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }),
                /* @__PURE__ */ jsx("span", { children: "বাতিল করুন" })
              ]
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "photo-preview", children: currentPhotoURL ? /* @__PURE__ */ jsx("img", { src: currentPhotoURL, alt: "প্রোফাইল" }) : /* @__PURE__ */ jsxs("div", { className: "no-photo", children: [
          /* @__PURE__ */ jsx(Camera, { className: "h-16 w-16" }),
          /* @__PURE__ */ jsx("p", { children: "কোন ছবি নেই" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "modal-actions", children: [
          /* @__PURE__ */ jsxs("label", { className: "action-button upload-button", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                onChange: handleFileSelect,
                disabled: uploading || deleting,
                style: { display: "none" }
              }
            ),
            /* @__PURE__ */ jsx(Upload, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsx("span", { children: currentPhotoURL ? "ছবি পরিবর্তন করুন" : "ছবি আপলোড করুন" })
          ] }),
          currentPhotoURL && /* @__PURE__ */ jsxs(
            "button",
            {
              className: "action-button delete-button",
              onClick: handleDelete,
              disabled: uploading || deleting,
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" }),
                /* @__PURE__ */ jsx("span", { children: deleting ? "মুছে ফেলা হচ্ছে..." : "ছবি মুছুন" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "modal-info", children: [
          /* @__PURE__ */ jsx("p", { children: "• সর্বোচ্চ আকার: ৫ MB" }),
          /* @__PURE__ */ jsx("p", { children: "• সমর্থিত ফরম্যাট: JPG, PNG, GIF" })
        ] })
      ] })
    ] })
  ] }) });
};
const CashierDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { currentUser, loading: userLoading } = useUser();
  const { isDemo } = useMode();
  const [photoURL, setPhotoURL] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [somitiUserId, setSomitiUserId] = useState("");
  const avatarRef = React__default.useRef(null);
  console.log("[CashierDashboard] Contexts", { authUser, currentUser, userLoading });
  useEffect(() => {
    if (currentUser) {
      const url = currentUser.photoURL || null;
      setPhotoURL(url);
      console.log("[CashierDashboard] avatar init from currentUser", { photoURL: url });
    }
  }, [currentUser]);
  useEffect(() => {
    const computeSerial = async () => {
      if (!currentUser?.uid) return;
      try {
        console.log("[CashierDashboard] computeSerial:start", { uid: currentUser?.uid });
        let membersResult = await MemberService.getActiveMembers?.();
        if (!membersResult?.success) {
          membersResult = await MemberService.getAllMembers();
        }
        if (membersResult.success && membersResult.data) {
          const allMembers = membersResult.data;
          console.log("[CashierDashboard] members:fetched", { count: allMembers.length });
          const sortedMembers = allMembers.sort((a, b) => {
            const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            const dateA = new Date(joiningDateA);
            const dateB = new Date(joiningDateB);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB;
            }
            const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
            const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
            if (createdA.getTime() === createdB.getTime()) {
              return (a.id || "").localeCompare(b.id || "");
            }
            return createdA - createdB;
          });
          const currentUserIndex = sortedMembers.findIndex((member) => member.id === currentUser.uid);
          const calculatedSerial = currentUserIndex !== -1 ? String(currentUserIndex + 1) : "";
          setSomitiUserId(calculatedSerial);
          console.log("[CashierDashboard] computeSerial:done", { somitiUserId: calculatedSerial });
        }
      } catch (err) {
        console.error("[CashierDashboard] computeSerial:error", err);
      }
    };
    computeSerial();
  }, [currentUser]);
  useEffect(() => {
    if (!avatarRef.current) return;
    if (!photoURL) {
      console.log("[CashierDashboard] avatar glow disabled (no photoURL)");
      try {
        avatarRef.current.classList.remove("avatar-glow-on");
        avatarRef.current.style.removeProperty("--glow-start");
        avatarRef.current.style.removeProperty("--glow-end");
      } catch (e) {
        console.log("[CashierDashboard] avatar glow cleanup error", e);
      }
      return;
    }
    console.log("[CashierDashboard] avatar glow init for photo", { photoURL });
    const img = new Image();
    try {
      const isHttp = /^https?:/i.test(photoURL);
      const isBlobOrData = /^blob:|^data:/i.test(photoURL);
      if (isHttp && !isBlobOrData) {
        const url = new URL(photoURL);
        if (url.origin !== window.location.origin) {
          img.crossOrigin = "anonymous";
        }
      }
    } catch (e) {
      console.log("[CashierDashboard] avatar glow crossOrigin check error", e);
    }
    img.src = photoURL;
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const brighten = (v) => Math.min(255, Math.round(v * 1.15));
        const dim = (v) => Math.max(0, Math.round(v * 0.85));
        const start = `rgba(${brighten(r)}, ${brighten(g)}, ${brighten(b)}, 0.65)`;
        const end = `rgba(${dim(r)}, ${dim(g)}, ${dim(b)}, 0.18)`;
        console.log("[CashierDashboard] avatar glow colors", { r, g, b, start, end });
        avatarRef.current.style.setProperty("--glow-start", start);
        avatarRef.current.style.setProperty("--glow-end", end);
        avatarRef.current.classList.add("avatar-glow-on");
      } catch (e) {
        console.log("[CashierDashboard] avatar glow compute error, applying fallback gradient", e);
        const start = "rgba(59, 130, 246, 0.65)";
        const end = "rgba(14, 165, 233, 0.18)";
        avatarRef.current.style.setProperty("--glow-start", start);
        avatarRef.current.style.setProperty("--glow-end", end);
        avatarRef.current.classList.add("avatar-glow-on");
      }
    };
    img.onerror = (e) => {
      console.log("[CashierDashboard] avatar image load error, applying fallback gradient", e);
      const start = "rgba(59, 130, 246, 0.65)";
      const end = "rgba(14, 165, 233, 0.18)";
      avatarRef.current.style.setProperty("--glow-start", start);
      avatarRef.current.style.setProperty("--glow-end", end);
      avatarRef.current.classList.add("avatar-glow-on");
    };
  }, [photoURL]);
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fundViewMode, setFundViewMode] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fundData, setFundData] = useState({
    totalBalance: 0,
    availableCash: 0,
    monthlyExpense: 0,
    cashFlow: []
  });
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [paymentMethodSortOrder, setPaymentMethodSortOrder] = useState("desc");
  const [lastRefresh, setLastRefresh] = useState(/* @__PURE__ */ new Date());
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    phone: "",
    address: "",
    shareCount: "",
    nomineeName: "",
    nomineePhone: "",
    nomineeRelation: "",
    joiningDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [memberFormErrors, setMemberFormErrors] = useState({});
  const [error, setError] = useState(null);
  const closeTransactionCard = () => {
    setShowTransactionCard(false);
    setSelectedTransaction(null);
  };
  const refreshData = async () => {
    try {
      setLoading((prev) => ({ ...prev, initial: true }));
      setError(null);
      if (isDemo()) {
        console.log("[CashierDashboard] Using demo data");
        setMembers(demoMembers);
        setTransactions(demoTransactions);
        const totalFunds = demoTransactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0);
        const monthlyDeposits = demoTransactions.filter((t) => t.type === "deposit" && t.category === "monthly").reduce((sum, t) => sum + t.amount, 0);
        setFundData({
          totalBalance: totalFunds,
          availableCash: totalFunds * 0.8,
          monthlyDeposits,
          monthlyExpense: 5e3,
          cashFlow: []
        });
        setLoading({ members: false, transactions: false, fundData: false, initial: false });
        setLastRefresh(/* @__PURE__ */ new Date());
        return;
      }
      const [membersResult, transactionsResult, fundResult] = await Promise.all([
        MemberService.getAllMembers().then((result) => {
          if (result.success) {
            setMembers(result.data || []);
          } else {
            console.error("সদস্য তালিকা লোড করতে ত্রুটি:", result.error);
          }
          setLoading((prev) => ({ ...prev, members: false }));
          return result;
        }).catch((error2) => {
          console.error("সদস্য তালিকা লোড করতে ত্রুটি:", error2);
          setLoading((prev) => ({ ...prev, members: false }));
          return { success: false, error: error2 };
        }),
        TransactionService.getAllTransactions().then((result) => {
          if (result.success) {
            setTransactions(result.data || []);
          } else {
            console.error("লেনদেন তালিকা লোড করতে ত্রুটি:", result.error);
          }
          setLoading((prev) => ({ ...prev, transactions: false }));
          return result;
        }).catch((error2) => {
          console.error("লেনদেন তালিকা লোড করতে ত্রুটি:", error2);
          setLoading((prev) => ({ ...prev, transactions: false }));
          return { success: false, error: error2 };
        }),
        FundService.getFundSummary().then((result) => {
          if (result.success && result.data) {
            setFundData(result.data);
          }
          setLoading((prev) => ({ ...prev, fundData: false }));
          return result;
        }).catch((error2) => {
          console.error("তহবিল তথ্য লোড করতে ত্রুটি:", error2);
          setLoading((prev) => ({ ...prev, fundData: false }));
          return { success: false, error: error2 };
        })
      ]);
      setLastRefresh(/* @__PURE__ */ new Date());
    } catch (error2) {
      console.error("ডেটা রিফ্রেশ করতে ত্রুটি:", error2);
      setError("ডেটা লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  };
  useEffect(() => {
    refreshData();
  }, []);
  const handleAddMember = async (memberData, userId) => {
    try {
      setSaving(true);
      console.log("🚀 handleAddMember called with:", memberData);
      if (!userId) {
        console.error("❌ Missing userId for MemberService.addMember");
        return { success: false, error: "User ID is required" };
      }
      const addResult = await MemberService.addMember(memberData, userId);
      console.log("📡 MemberService.addMember result:", addResult);
      if (addResult.success) {
        console.log("✅ Member service returned success");
        console.log("✅ Returning success from handleAddMember");
        return { success: true };
      } else {
        console.error("❌ Member service returned error:", addResult.error);
        return { success: false, error: addResult.error };
      }
    } catch (error2) {
      console.error("💥 Exception in handleAddMember:", error2);
      return { success: false, error: error2.message };
    } finally {
      setSaving(false);
      console.log("🏁 handleAddMember finally block executed");
    }
  };
  const monthlySummary = {
    totalMembers: members.length,
    paidMembers: members.filter((member) => member.status === "active").length,
    unpaidMembers: members.filter((member) => member.status === "inactive").length,
    totalCollected: transactions.filter((t) => (t.transactionType === "monthly_deposit" || t.transactionType === "share_purchase") && new Date(t.createdAt?.seconds * 1e3).getMonth() === (/* @__PURE__ */ new Date()).getMonth()).reduce((sum, t) => sum + (t.amount || 0), 0),
    expectedAmount: members.length * 1200
    // Assuming 1200 per member monthly
  };
  const fundSummary = fundData;
  const [expenseFilter, setExpenseFilter] = useState("all");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("all");
  const expenseRecords = React__default.useMemo(() => {
    return transactions.filter((transaction) => ["expense", "loan_disbursement", "withdrawal"].includes(transaction.transactionType || transaction.type)).map((transaction) => ({
      id: transaction.id,
      description: transaction.description || transaction.note || "খরচ",
      amount: transaction.amount || 0,
      date: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3).toLocaleDateString("bn-BD") : (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD"),
      category: transaction.category || "other",
      invoiceNo: transaction.invoiceNo || `INV-${transaction.id}`,
      approvedBy: transaction.approvedBy || "সভাপতি",
      status: transaction.status || "approved",
      priority: transaction.priority || "medium",
      submittedBy: transaction.submittedBy || "ক্যাশিয়ার",
      submittedDate: transaction.submittedDate || (transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3).toLocaleDateString("bn-BD") : (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")),
      approvedDate: transaction.approvedDate || (transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3).toLocaleDateString("bn-BD") : (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")),
      paymentMethod: transaction.paymentMethod || "cash",
      vendor: transaction.vendor || "বিক্রেতা",
      notes: transaction.notes || transaction.description || "খরচের বিবরণ"
    })).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, [transactions]);
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cash":
        return "নগদ";
      case "bank_transfer":
        return "ব্যাংক ট্রান্সফার";
      case "mobile_banking":
        return "মোবাইল ব্যাংকিং";
      default:
        return method;
    }
  };
  const paymentMethods = React__default.useMemo(() => {
    if (!transactions.length) return [];
    const methodStats = transactions.reduce((acc, transaction) => {
      const method = transaction.paymentMethod || "cash";
      const amount = transaction.amount || 0;
      if (!acc[method]) {
        acc[method] = { amount: 0, count: 0 };
      }
      acc[method].amount += amount;
      acc[method].count += 1;
      return acc;
    }, {});
    const totalAmount = Object.values(methodStats).reduce((sum, stat) => sum + stat.amount, 0);
    return Object.entries(methodStats).map(([method, stats]) => ({
      method: getPaymentMethodLabel(method),
      amount: stats.amount,
      count: stats.count,
      percentage: totalAmount > 0 ? stats.amount / totalAmount * 100 : 0
    }));
  }, [transactions]);
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "subscription":
        return "মাসিক চাঁদা";
      case "loan":
        return "ঋণ";
      case "donation":
        return "দান";
      case "fine":
        return "জরিমানা";
      case "monthly_deposit":
        return "মাসিক জমা";
      case "share_purchase":
        return "শেয়ার ক্রয়";
      case "loan_payment":
        return "ঋণ পরিশোধ";
      default:
        return type;
    }
  };
  expenseRecords.filter((expense) => {
    const matchesStatus = expenseFilter === "all" || expense.status === expenseFilter;
    const matchesCategory = expenseCategoryFilter === "all" || expense.category === expenseCategoryFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || expense.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });
  const recentTransactions = React__default.useMemo(() => {
    return transactions.map((transaction) => ({
      id: transaction.id,
      memberName: transaction.memberName || "অজানা সদস্য",
      memberId: transaction.somiti_user_id || "N/A",
      type: transaction.transactionType || transaction.type || "other",
      amount: transaction.amount || 0,
      paymentMethod: transaction.paymentMethod || "cash",
      status: transaction.status || "completed",
      time: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3).toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }) : "N/A",
      date: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      description: transaction.description || getTransactionTypeLabel(transaction.transactionType || transaction.type || "other"),
      reference: transaction.transactionId || transaction.id || "N/A",
      processedBy: transaction.processedBy || "ক্যাশিয়ার"
    })).sort((a, b) => {
      const dateA = /* @__PURE__ */ new Date(a.date + " " + a.time);
      const dateB = /* @__PURE__ */ new Date(b.date + " " + b.time);
      return dateB - dateA;
    });
  }, [transactions]);
  recentTransactions.filter(
    (transaction) => transaction.memberName.toLowerCase().includes(transactionSearchTerm.toLowerCase()) || getTransactionTypeLabel(transaction.type).toLowerCase().includes(transactionSearchTerm.toLowerCase())
  );
  const sortedPaymentMethods = [...paymentMethods].sort((a, b) => {
    if (paymentMethodSortOrder === "desc") {
      return b.amount - a.amount;
    } else {
      return a.amount - b.amount;
    }
  });
  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = transactionFilter === "all" || transaction.status === transactionFilter;
    const matchesType = transactionTypeFilter === "all" || transaction.type === transactionTypeFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
    const matchesDateRange = (() => {
      if (dateRangeFilter === "all") return true;
      const transactionDate = new Date(transaction.date);
      const today = /* @__PURE__ */ new Date();
      const daysDiff = Math.floor((today - transactionDate) / (1e3 * 60 * 60 * 24));
      switch (dateRangeFilter) {
        case "today":
          return daysDiff === 0;
        case "week":
          return daysDiff <= 7;
        case "month":
          return daysDiff <= 30;
        case "quarter":
          return daysDiff <= 90;
        default:
          return true;
      }
    })();
    return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesDateRange;
  });
  [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "date":
        aValue = /* @__PURE__ */ new Date(a.date + " " + a.time);
        bValue = /* @__PURE__ */ new Date(b.date + " " + b.time);
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "member":
        aValue = a.memberName.toLowerCase();
        bValue = b.memberName.toLowerCase();
        break;
      case "type":
        aValue = a.type;
        bValue = b.type;
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  Math.ceil(filteredTransactions.length / itemsPerPage);
  const handleInputChange = (field, value) => {
    setNewMemberData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (memberFormErrors[field]) {
      setMemberFormErrors((prev) => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!newMemberData.name.trim()) {
      errors.name = "নাম আবশ্যক";
    }
    if (!newMemberData.shareCount.trim()) {
      errors.shareCount = "শেয়ার সংখ্যা আবশ্যক";
    } else if (isNaN(newMemberData.shareCount) || Number(newMemberData.shareCount) <= 0) {
      errors.shareCount = "সঠিক শেয়ার সংখ্যা দিন";
    }
    if (newMemberData.phone?.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.phone)) {
      errors.phone = "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)";
    }
    if (newMemberData.nomineePhone?.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.nomineePhone)) {
      errors.nomineePhone = "সঠিক নমিনির ফোন নম্বর দিন (01XXXXXXXXX)";
    }
    return errors;
  };
  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    console.log("🔥 handleSubmitNewMember called");
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("❌ Form validation errors:", errors);
      setMemberFormErrors(errors);
      return;
    }
    try {
      setSaving(true);
      console.log("💾 Setting saving to true");
      const credentials = generateEmailCredentials(newMemberData.name);
      console.log("🔐 Generated credentials:", credentials);
      console.log("CashierDashboard: duplicate check input", { email: credentials.email, phone: newMemberData.phone, name: newMemberData.name });
      const dupResult = await MemberService.isDuplicateMember({ phone: newMemberData.phone, email: credentials.email, name: newMemberData.name });
      console.log("CashierDashboard: duplicate check result", dupResult);
      if (dupResult?.exists) {
        setError(`এই সদস্য ইতিমধ্যে আছে (${dupResult.by})`);
        return;
      }
      const registrationResponse = await registerUser(credentials.email, credentials.password);
      if (!registrationResponse?.success) {
        throw new Error(registrationResponse?.message || "Backend registration failed");
      }
      const { user_id } = registrationResponse;
      console.log("✅ Backend registration successful, user_id:", user_id);
      const memberData = {
        name: newMemberData.name,
        phone: newMemberData.phone,
        address: newMemberData.address,
        shareCount: newMemberData.shareCount,
        nomineeName: newMemberData.nomineeName,
        nomineePhone: newMemberData.nomineePhone,
        nomineeRelation: newMemberData.nomineeRelation,
        joiningDate: newMemberData.joiningDate,
        role: newMemberData.role || "member",
        email: credentials.email,
        password: credentials.password,
        user_id,
        status: "active",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdBy: "ক্যাশিয়ার"
      };
      console.log("📝 নতুন সদস্য যোগ করা হচ্ছে (Firestore):", memberData);
      const result = await handleAddMember(memberData, user_id);
      console.log("📊 handleAddMember result:", result);
      if (result && result.success) {
        console.log("✅ Member added successfully");
        console.log("CashierDashboard: toast success - সদস্য যোগ");
        toast.success(`${newMemberData.name} সফলভাবে সমিতিতে যোগদান করেছেন।`);
        setNewMemberData({
          name: "",
          phone: "",
          address: "",
          shareCount: "",
          nomineeName: "",
          nomineePhone: "",
          nomineeRelation: "",
          joiningDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          role: "member"
        });
        setMemberFormErrors({});
        console.log("🔄 Form reset");
        setShowAddMemberModal(false);
        const updatedMembersResult = await MemberService.getAllMembers();
        console.log("📋 Updated members result:", updatedMembersResult);
        if (updatedMembersResult.success) {
          setMembers(updatedMembersResult.data || []);
          console.log("👥 Members list updated");
        }
      } else {
        console.error("❌ সদস্য যোগ করতে ত্রুটি:", result?.error || "Unknown error");
      }
    } catch (error2) {
      console.error("💥 সদস্য যোগ করতে ত্রুটি:", error2);
    } finally {
      setSaving(false);
      console.log("🏁 Setting saving to false");
    }
  };
  const handleCloseModal = () => {
    setShowAddMemberModal(false);
    setMemberFormErrors({});
  };
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => /* @__PURE__ */ jsx("div", { className: `animate-pulse bg-gray-200 rounded ${height} ${className}` });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "treasury-container cashier-dashboard", children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      console.log("[CashierDashboard] render profile header v3"),
      /* @__PURE__ */ jsxs("div", { className: "cashier-profile-header bg-white border border-gray-200 rounded-xl shadow-sm mb-3 p-4", children: [
        console.log("[CashierDashboard] header style upgrade applied"),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "cashier-header-avatar avatar-glow-on rounded-full shrink-0 flex items-center justify-center border-2 border-black bg-white transition",
              role: "button",
              tabIndex: 0,
              "aria-label": "প্রোফাইল ছবি পরিবর্তন",
              onClick: () => {
                console.log("[CashierDashboard] open photo modal");
                setIsPhotoModalOpen(true);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  console.log("[CashierDashboard] open photo modal via keyboard");
                  setIsPhotoModalOpen(true);
                }
              },
              ref: avatarRef,
              children: photoURL ? /* @__PURE__ */ jsx("img", { src: photoURL, alt: "avatar", className: "cashier-header-photo w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Camera, { className: "h-7 w-7 text-black" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            console.log("[CashierDashboard] responsive badge/layout enabled"),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold truncate", children: currentUser && currentUser.name || authUser && authUser.name || "ক্যাশিয়ার" }),
              console.log("[CashierDashboard] rich badge applied"),
              /* @__PURE__ */ jsxs("span", { className: "cashier-badge badge-rich", children: [
                /* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }),
                "ক্যাশিয়ার"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-gray-600 flex gap-4 flex-wrap", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              "আইডি: ",
              somitiUserId || currentUser?.id || authUser?.uid || ""
            ] }) }),
            console.log("[CashierDashboard] render profile chips v3"),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700", children: [
                "আইডি: ",
                somitiUserId || currentUser?.id || authUser?.uid || ""
              ] }),
              /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700", children: currentUser?.status || "সক্রিয়" })
            ] })
          ] }),
          console.log("[CashierDashboard] settings icon removed from header")
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        ProfilePhotoModal,
        {
          isOpen: isPhotoModalOpen,
          onClose: () => {
            console.log("[CashierDashboard] close photo modal");
            setIsPhotoModalOpen(false);
          },
          userId: currentUser?.uid,
          currentPhotoURL: photoURL,
          onPhotoUpdate: (newPhotoURL) => {
            console.log("[CashierDashboard] photo updated", { newPhotoURL });
            setPhotoURL(newPhotoURL);
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: refreshData,
          disabled: loading.initial,
          className: `icon-action-btn blue flex items-center gap-2 w-48 justify-center ${loading.initial ? "opacity-75 cursor-not-allowed" : ""}`,
          title: loading.initial ? "ডেটা লোড হচ্ছে..." : "সব ডেটা রিফ্রেশ করুন",
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading.initial ? "animate-spin" : ""}` }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: loading.initial ? "লোড হচ্ছে..." : "রিফ্রেশ করুন" })
          ]
        }
      ) }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-red-400" }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800", children: error }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto pl-3", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setError(null),
            className: "inline-flex text-red-400 hover:text-red-600",
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "treasury-card-header", children: [
          /* @__PURE__ */ jsx("h3", { className: "treasury-card-title", children: "মাসিক সারসংক্ষেপ" }),
          /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "treasury-summary-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: "মোট সদস্য" }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-value", children: loading.members ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-10" }) : monthlySummary.totalMembers }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-subtitle", children: "সক্রিয় সদস্য" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(Users, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: "মাসিক সংগ্রহ" }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-value", children: loading.transactions ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-24 h-10" }) : `৳ ${monthlySummary.totalCollected.toLocaleString()}` }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-subtitle", children: "এই মাসে" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "treasury-card bg-transparent! shadow-none! border-2 border-dashed border-gray-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: "ক্যাশিয়ার ব্যালেন্স" }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-value", children: loading.fundData ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-24 h-10" }) : `৳ ${fundSummary.totalBalance.toLocaleString()}` }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-subtitle", children: "হাতে নগদ" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(Wallet, { className: "w-5 h-5" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "treasury-card-header", children: [
          /* @__PURE__ */ jsxs("div", { className: "treasury-card-title", children: [
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx("h3", { children: "পেমেন্ট পদ্ধতি" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setPaymentMethodSortOrder(paymentMethodSortOrder === "desc" ? "asc" : "desc"),
              className: "p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200",
              title: "পরিমাণ অনুযায়ী সাজান",
              children: paymentMethodSortOrder === "desc" ? /* @__PURE__ */ jsx(SortDesc, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(SortAsc, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "treasury-summary-grid", children: loading.fundData ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-4" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-20 h-8" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-12 h-3" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(LoadingSkeleton, { className: "h-8 w-8 rounded-full" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-20 h-4" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-24 h-8" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-3" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(LoadingSkeleton, { className: "h-8 w-8 rounded-full" }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-18 h-4" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-8" }),
              /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-14 h-3" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(LoadingSkeleton, { className: "h-8 w-8 rounded-full" }) })
          ] }) })
        ] }) : sortedPaymentMethods.slice(0, 4).map((method, index) => {
          const getPaymentIcon = (methodName) => {
            if (methodName.includes("নগদ") || methodName.includes("ক্যাশ")) {
              return /* @__PURE__ */ jsx(Banknote, { className: "h-5 w-5" });
            } else if (methodName.includes("বিকাশ")) {
              return /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" });
            } else if (methodName.includes("ব্যাংক")) {
              return /* @__PURE__ */ jsx(Calculator, { className: "h-5 w-5" });
            } else {
              return /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" });
            }
          };
          return /* @__PURE__ */ jsxs("div", { className: "treasury-card treasury-card-compact", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: method.method }),
              /* @__PURE__ */ jsxs("div", { className: "treasury-card-value", children: [
                "৳ ",
                method.amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "treasury-card-subtitle", children: [
                method.count,
                " টি লেনদেন • ",
                method.percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: getPaymentIcon(method.method) })
          ] }, index);
        }) }),
        !loading.fundData && sortedPaymentMethods.length > 4 && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate("/transactions"),
            className: "text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200",
            children: [
              "আরও ",
              sortedPaymentMethods.length - 4,
              " টি পেমেন্ট পদ্ধতি দেখুন"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
        /* @__PURE__ */ jsx("div", { className: "treasury-card-header", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-title", children: [
          /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(Receipt, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("h3", { children: "খরচের রেকর্ড" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "treasury-summary-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
            /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
              /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: "মোট খরচ" }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-value", children: loading.transactions ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-24 h-8" }) : `৳ ${expenseRecords.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}` }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-subtitle", children: "এই মাসে" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(TrendingDown, { className: "h-5 w-5" }) })
          ] }),
          loading.transactions ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
              /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-20 h-4" }),
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-8" }),
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-24 h-3" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(LoadingSkeleton, { className: "h-8 w-8 rounded-full" }) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
              /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-18 h-4" }),
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-20 h-8" }),
                /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-16 h-3" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: /* @__PURE__ */ jsx(LoadingSkeleton, { className: "h-8 w-8 rounded-full" }) })
            ] }) })
          ] }) : expenseRecords.slice(0, 2).map((expense) => {
            const getExpenseIcon = (type) => {
              if (type === "expense") {
                return /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" });
              } else if (type === "loan_disbursement") {
                return /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-5 w-5" });
              } else if (type === "withdrawal") {
                return /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-5 w-5" });
              } else {
                return /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" });
              }
            };
            const getExpenseTypeLabel = (type) => {
              if (type === "expense") return "খরচ";
              if (type === "loan_disbursement") return "ঋণ প্রদান";
              if (type === "withdrawal") return "উত্তোলন";
              return "অন্যান্য";
            };
            return /* @__PURE__ */ jsx("div", { className: "treasury-card", children: /* @__PURE__ */ jsxs("div", { className: "treasury-card-content", children: [
              /* @__PURE__ */ jsxs("div", { className: "treasury-card-info", children: [
                /* @__PURE__ */ jsx("h3", { className: "treasury-card-label", children: getExpenseTypeLabel(expense.type) }),
                /* @__PURE__ */ jsxs("div", { className: "treasury-card-value", children: [
                  "৳ ",
                  expense.amount.toLocaleString()
                ] }),
                /* @__PURE__ */ jsx("div", { className: "treasury-card-subtitle", children: expense.description })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "treasury-card-icon", children: getExpenseIcon(expense.type) })
            ] }) }, expense.id);
          })
        ] }),
        !loading.transactions && expenseRecords.length > 3 && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate("/transactions"),
            className: "text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200",
            children: [
              "আরও ",
              expenseRecords.length - 3,
              " টি খরচ দেখুন"
            ]
          }
        ) })
      ] }),
      showAddMemberModal && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-container", children: [
        /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
          /* @__PURE__ */ jsxs("h2", { className: "modal-title", children: [
            /* @__PURE__ */ jsx(UserPlus, { size: 20 }),
            "নতুন সদস্য যোগ করুন"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "modal-close-btn",
              onClick: handleCloseModal,
              children: /* @__PURE__ */ jsx(X, { size: 20 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "modal-body", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitNewMember, className: "modal-form", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
            /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
              /* @__PURE__ */ jsx(User, { size: 18 }),
              "মূল তথ্য"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsx("label", { className: "form-label", children: "নাম *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: `form-input ${memberFormErrors.name ? "error" : ""}`,
                    value: newMemberData.name,
                    onChange: (e) => handleInputChange("name", e.target.value),
                    placeholder: "সদস্যের নাম লিখুন"
                  }
                ),
                memberFormErrors.name && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.name })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                  /* @__PURE__ */ jsx(Phone, { size: 16 }),
                  "ফোন নম্বর (ঐচ্ছিক)"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    className: `form-input ${memberFormErrors.phone ? "error" : ""}`,
                    value: newMemberData.phone,
                    onChange: (e) => handleInputChange("phone", e.target.value),
                    placeholder: "01XXXXXXXXX"
                  }
                ),
                memberFormErrors.phone && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.phone })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 16 }),
                "ঠিকানা (ঐচ্ছিক)"
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: `form-textarea ${memberFormErrors.address ? "error" : ""}`,
                  value: newMemberData.address,
                  onChange: (e) => handleInputChange("address", e.target.value),
                  placeholder: "সম্পূর্ণ ঠিকানা লিখুন",
                  rows: "2"
                }
              ),
              memberFormErrors.address && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.address })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
            /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
              /* @__PURE__ */ jsx(DollarSign, { size: 18 }),
              "শেয়ার তথ্য"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                  /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
                  "শেয়ার সংখ্যা *"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: `form-input ${memberFormErrors.shareCount ? "error" : ""}`,
                    value: newMemberData.shareCount,
                    onChange: (e) => handleInputChange("shareCount", e.target.value),
                    placeholder: "কতটি শেয়ার কিনেছেন",
                    min: "1"
                  }
                ),
                memberFormErrors.shareCount && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.shareCount })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsx("label", { className: "form-label", children: "যোগদানের তারিখ" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    className: "form-input",
                    value: newMemberData.joiningDate,
                    onChange: (e) => handleInputChange("joiningDate", e.target.value)
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
            /* @__PURE__ */ jsxs("h3", { className: "form-section-title", children: [
              /* @__PURE__ */ jsx(Users, { size: 18 }),
              "নমিনি তথ্য"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                  /* @__PURE__ */ jsx(User, { size: 16 }),
                  "নমিনির নাম (ঐচ্ছিক)"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: `form-input ${memberFormErrors.nomineeName ? "error" : ""}`,
                    value: newMemberData.nomineeName,
                    onChange: (e) => handleInputChange("nomineeName", e.target.value),
                    placeholder: "নমিনির নাম লিখুন"
                  }
                ),
                memberFormErrors.nomineeName && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineeName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
                  /* @__PURE__ */ jsx(Phone, { size: 16 }),
                  "নমিনির ফোন (ঐচ্ছিক)"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    className: `form-input ${memberFormErrors.nomineePhone ? "error" : ""}`,
                    value: newMemberData.nomineePhone,
                    onChange: (e) => handleInputChange("nomineePhone", e.target.value),
                    placeholder: "01XXXXXXXXX"
                  }
                ),
                memberFormErrors.nomineePhone && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineePhone })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsx("label", { className: "form-label", children: "নমিনির সাথে সম্পর্ক (ঐচ্ছিক)" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: `form-select ${memberFormErrors.nomineeRelation ? "error" : ""}`,
                  value: newMemberData.nomineeRelation,
                  onChange: (e) => handleInputChange("nomineeRelation", e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "সম্পর্ক নির্বাচন করুন" }),
                    /* @__PURE__ */ jsx("option", { value: "পিতা", children: "পিতা" }),
                    /* @__PURE__ */ jsx("option", { value: "মাতা", children: "মাতা" }),
                    /* @__PURE__ */ jsx("option", { value: "স্বামী", children: "স্বামী" }),
                    /* @__PURE__ */ jsx("option", { value: "স্ত্রী", children: "স্ত্রী" }),
                    /* @__PURE__ */ jsx("option", { value: "ভাই", children: "ভাই" }),
                    /* @__PURE__ */ jsx("option", { value: "বোন", children: "বোন" }),
                    /* @__PURE__ */ jsx("option", { value: "ছেলে", children: "ছেলে" }),
                    /* @__PURE__ */ jsx("option", { value: "মেয়ে", children: "মেয়ে" }),
                    /* @__PURE__ */ jsx("option", { value: "অন্যান্য", children: "অন্যান্য" })
                  ]
                }
              ),
              memberFormErrors.nomineeRelation && /* @__PURE__ */ jsx("span", { className: "error-message", children: memberFormErrors.nomineeRelation })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-actions", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "form-btn form-btn-cancel",
                onClick: handleCloseModal,
                children: [
                  /* @__PURE__ */ jsx(X, { size: 16 }),
                  "বাতিল"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "form-btn form-btn-primary",
                disabled: saving,
                children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
                  "সংরক্ষণ করা হচ্ছে..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Save, { size: 16 }),
                  "সংরক্ষণ করুন"
                ] })
              }
            )
          ] })
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(
      TransactionDetailsCard,
      {
        transaction: selectedTransaction,
        isVisible: showTransactionCard,
        onClose: closeTransactionCard,
        position: cardPosition
      }
    ),
    console.log("[CashierDashboard] render floating add button"),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "cashier-fab",
        "aria-label": "নতুন লেনদেন",
        onClick: () => {
          console.log("[CashierDashboard] FAB clicked -> navigate add transaction");
          navigate("/cashier/add-transaction");
        },
        onMouseEnter: () => {
          console.log("[CashierDashboard] FAB mouse enter");
        },
        onMouseLeave: () => {
          console.log("[CashierDashboard] FAB mouse leave");
        },
        children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6 text-white cashier-fab-icon" })
      }
    )
  ] });
};
const Transactions = () => {
  const navigate = useNavigate();
  const { isDemo } = useMode();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const formatListDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = dateObj.toLocaleString("en-US", { month: "long" }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };
  useEffect(() => {
    console.log("Transactions page mounted");
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (isDemo()) {
          console.log("[Transactions] Using demo data");
          const formattedTransactions = demoTransactions.map((transaction) => {
            const baseDate = new Date(transaction.date);
            return {
              id: transaction.id,
              type: transaction.type === "deposit" ? "income" : "expense",
              amount: transaction.amount || 0,
              method: transaction.paymentMethod || "নগদ",
              description: transaction.description || "",
              member: transaction.memberName || "অজানা",
              date: formatListDate(baseDate)
            };
          });
          setTransactions(formattedTransactions);
          setLoading(false);
          return;
        }
        const result = await TransactionService.getAllTransactions();
        if (result.success) {
          const formattedTransactions = result.data.map((transaction) => {
            const baseDate = transaction.date ? new Date(transaction.date) : transaction.createdAt ? new Date(transaction.createdAt.seconds * 1e3) : /* @__PURE__ */ new Date();
            return {
              id: transaction.id,
              type: transaction.type || "income",
              amount: transaction.amount || 0,
              method: transaction.paymentMethod || transaction.method || "নগদ",
              description: transaction.description || transaction.note || "",
              member: transaction.memberName || transaction.member || "অজানা",
              date: formatListDate(baseDate)
            };
          });
          setTransactions(formattedTransactions);
          console.log("Loaded transactions:", formattedTransactions.length);
        } else {
          console.error("লেনদেন লোড করতে ত্রুটি:", result.error);
          setTransactions([]);
        }
      } catch (error) {
        console.error("লেনদেন লোড করতে ত্রুটি:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [isDemo]);
  const getPaymentIcon = (method) => {
    if (method.includes("নগদ") || method.includes("ক্যাশ")) {
      return /* @__PURE__ */ jsx(Banknote, { className: "h-4 w-4" });
    } else if (method.includes("বিকাশ")) {
      return /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" });
    } else if (method.includes("ব্যাংক")) {
      return /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4" });
    } else {
      return /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" });
    }
  };
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.member.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesMethod = filterMethod === "all" || filterMethod === "cash" && transaction.method.includes("নগদ") || filterMethod === "bkash" && transaction.method.includes("বিকাশ") || filterMethod === "bank" && transaction.method.includes("ব্যাংক");
    return matchesSearch && matchesType && matchesMethod;
  });
  return /* @__PURE__ */ jsxs("div", { className: "transactions-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "transactions-header", children: [
      /* @__PURE__ */ jsxs("div", { className: "transactions-title-row", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => navigate(-1), className: "back-btn", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("h1", { className: "transactions-title", children: "সকল লেনদেন" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "transactions-filters", children: /* @__PURE__ */ jsxs("div", { className: "filters-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "বিবরণ বা সদস্য খুঁজুন...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "transactions-input pl-10"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filterType,
            onChange: (e) => setFilterType(e.target.value),
            className: "transactions-select",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "সব ধরনের" }),
              /* @__PURE__ */ jsx("option", { value: "income", children: "আয়" }),
              /* @__PURE__ */ jsx("option", { value: "expense", children: "খরচ" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filterMethod,
            onChange: (e) => setFilterMethod(e.target.value),
            className: "transactions-select",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "সব পদ্ধতি" }),
              /* @__PURE__ */ jsx("option", { value: "cash", children: "নগদ" }),
              /* @__PURE__ */ jsx("option", { value: "bkash", children: "বিকাশ" }),
              /* @__PURE__ */ jsx("option", { value: "bank", children: "ব্যাংক" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSearchTerm("");
              setFilterType("all");
              setFilterMethod("all");
            },
            className: "filters-clear",
            children: "ফিল্টার মুছুন"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "transactions-list", children: loading ? /* @__PURE__ */ jsx("div", { className: "transactions-loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) : filteredTransactions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "transactions-empty", children: "কোনো লেনদেন পাওয়া যায়নি" }) : /* @__PURE__ */ jsx("div", { children: filteredTransactions.map((transaction) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "transaction-item",
        onClick: (e) => {
          const normalizeMethod = (method) => {
            const m = (method || "").toLowerCase();
            if (m.includes("নগদ") || m.includes("cash")) return "cash";
            if (m.includes("বিকাশ") || m.includes("bkash") || m.includes("mobile")) return "mobile_banking";
            if (m.includes("ব্যাংক") || m.includes("bank")) return "bank_transfer";
            if (m.includes("কার্ড") || m.includes("card")) return "card";
            return method || "cash";
          };
          const safe = {
            id: transaction.id,
            memberName: transaction.member,
            type: transaction.type || "other",
            amount: transaction.amount || 0,
            paymentMethod: normalizeMethod(transaction.method),
            description: transaction.description || "",
            date: transaction.date,
            time: transaction.time,
            reference: transaction.reference || transaction.id,
            processedBy: transaction.processedBy || "ক্যাশিয়ার"
          };
          console.log("Transactions: open details", safe);
          setCardPosition({ x: e.clientX, y: e.clientY });
          setSelectedTransaction(safe);
          setShowTransactionCard(true);
        },
        children: /* @__PURE__ */ jsxs("div", { className: "item-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "item-left", children: [
            /* @__PURE__ */ jsx("div", { className: `transaction-icon ${transaction.type === "income" ? "income" : "expense"}`, children: transaction.type === "income" ? /* @__PURE__ */ jsx(TrendingUp, { className: `h-4 w-4 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}` }) : /* @__PURE__ */ jsx(TrendingDown, { className: `h-4 w-4 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}` }) }),
            /* @__PURE__ */ jsxs("div", { className: "transaction-text", children: [
              /* @__PURE__ */ jsx("h3", { children: transaction.description }),
              /* @__PURE__ */ jsx("p", { className: "member-name", children: transaction.member }),
              /* @__PURE__ */ jsxs("div", { className: "transaction-meta", children: [
                /* @__PURE__ */ jsxs("div", { className: "chip", children: [
                  getPaymentIcon(transaction.method),
                  /* @__PURE__ */ jsx("span", { children: transaction.method })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "chip", children: transaction.date })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "item-right", children: /* @__PURE__ */ jsxs("p", { className: `amount ${transaction.type === "income" ? "income" : "expense"}`, children: [
            transaction.type === "income" ? "+" : "-",
            "৳ ",
            (transaction.amount || 0).toLocaleString()
          ] }) })
        ] })
      },
      transaction.id
    )) }) }),
    /* @__PURE__ */ jsx(
      TransactionDetailsCard,
      {
        transaction: selectedTransaction,
        isVisible: showTransactionCard,
        onClose: () => {
          console.log("Transactions: close details");
          setShowTransactionCard(false);
          setSelectedTransaction(null);
        },
        position: cardPosition
      }
    )
  ] });
};
const Treasury = () => {
  const navigate = useNavigate();
  const { isDemo } = useMode();
  const [loading, setLoading] = useState({
    fundData: true,
    transactions: true
  });
  const [treasuryData, setTreasuryData] = useState({
    totalFunds: 0,
    monthlyDeposits: 0,
    totalWithdrawals: 0,
    recentTransactions: [],
    monthlyData: []
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const loadTreasuryData = async () => {
      try {
        setLoading((prev) => ({ ...prev, fundData: true, transactions: true }));
        const fundResult = await FundService.getFundSummary();
        if (fundResult.success) {
          const fundSummary = fundResult.data;
          setTreasuryData((prev) => ({
            ...prev,
            totalFunds: fundSummary.totalAmount || 0,
            monthlyDeposits: fundSummary.monthlyDeposits || 0,
            totalWithdrawals: fundSummary.totalWithdrawals || 0
          }));
          setLoading((prev) => ({ ...prev, fundData: false }));
        } else {
          console.error("Error loading fund summary:", fundResult.error);
          setLoading((prev) => ({ ...prev, fundData: false }));
        }
        const transactionResult = await TransactionService.getRecentTransactions(10);
        if (transactionResult.success) {
          const transactions = transactionResult.data;
          setTreasuryData((prev) => ({
            ...prev,
            recentTransactions: transactions
          }));
          setLoading((prev) => ({ ...prev, transactions: false }));
        } else {
          console.error("Error loading transactions:", transactionResult.error);
          setLoading((prev) => ({ ...prev, transactions: false }));
        }
      } catch (error) {
        console.error("Error loading treasury data:", error);
        setLoading((prev) => ({ ...prev, fundData: false, transactions: false }));
      }
    };
    loadTreasuryData();
  }, [isDemo]);
  const handleTransactionClick = (transaction, event) => {
    if (!transaction) {
      console.error("No transaction data provided");
      return;
    }
    setCardPosition({
      x: event.clientX,
      y: event.clientY
    });
    const safeTransaction = {
      id: transaction.id || "N/A",
      memberName: transaction.memberName || "অজানা সদস্য",
      transactionType: transaction.transactionType || transaction.type || "other",
      type: transaction.type || transaction.transactionType || "other",
      amount: transaction.amount || 0,
      date: transaction.date || transaction.createdAt || null,
      createdAt: transaction.createdAt || null,
      description: transaction.description || "",
      transactionId: transaction.transactionId || transaction.id || "N/A",
      status: transaction.status || "completed",
      paymentMethod: transaction.paymentMethod || "cash",
      month: transaction.month,
      monthName: transaction.monthName || "",
      reference: transaction.reference,
      processedBy: transaction.processedBy,
      ...transaction
      // Spread the original transaction to preserve any additional fields
    };
    setSelectedTransaction(safeTransaction);
    setShowTransactionCard(true);
  };
  const closeTransactionCard = () => {
    setShowTransactionCard(false);
    setSelectedTransaction(null);
  };
  const netBalance = treasuryData.totalFunds - treasuryData.totalWithdrawals;
  const summaryCards = [
    {
      title: "সঞ্চিত অর্থ",
      value: treasuryData.totalFunds,
      change: "+১২%",
      changeType: "increase",
      icon: PiggyBank,
      color: "bg-blue-500",
      loading: loading.fundData
    },
    {
      title: "মাসিক জমা",
      value: treasuryData.monthlyDeposits,
      change: "+৮%",
      changeType: "increase",
      icon: TrendingUp,
      color: "bg-green-500",
      loading: loading.fundData
    },
    {
      title: "বর্তমান তহবিল",
      value: netBalance,
      change: "+৫%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-purple-500",
      loading: loading.fundData
    }
  ];
  const getMonthName = (transaction) => {
    if (transaction.monthName) {
      return transaction.monthName;
    }
    const bengaliMonths = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর"
    ];
    const date = new Date(transaction.date?.seconds * 1e3 || transaction.createdAt?.seconds * 1e3 || Date.now());
    return bengaliMonths[date.getMonth()] || "এই মাসে";
  };
  const formatTransaction = (transaction) => {
    const typeMap = {
      "monthly_deposit": "মাসিক জমা",
      "share_purchase": "শেয়ার ক্রয়",
      "loan_disbursement": "ঋণ প্রদান",
      "loan_repayment": "ঋণ পরিশোধ",
      "profit_distribution": "লাভ বিতরণ",
      "penalty": "জরিমানা",
      "other": "অন্যান্য"
    };
    const incomeTypes = ["monthly_deposit", "share_purchase", "loan_repayment", "penalty"];
    return {
      id: transaction.id,
      type: typeMap[transaction.transactionType] || transaction.transactionType,
      amount: transaction.amount,
      memberName: transaction.memberName || "অজানা সদস্য",
      monthName: getMonthName(transaction),
      isIncome: incomeTypes.includes(transaction.transactionType)
    };
  };
  const LoadingSkeleton = ({ className }) => /* @__PURE__ */ jsx("div", { className: `animate-pulse bg-gray-200 rounded ${className}` });
  return /* @__PURE__ */ jsxs("div", { className: "treasury-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "treasury-header", children: [
      /* @__PURE__ */ jsx("h1", { className: "treasury-title", children: "কোষাগার" }),
      /* @__PURE__ */ jsx("p", { className: "treasury-subtitle", children: "সমিতির আর্থিক তথ্য ও লেনদেন" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "treasury-summary-grid", children: summaryCards.map((card, index) => {
        const Icon = card.icon;
        return /* @__PURE__ */ jsxs("div", { className: "treasury-card", children: [
          /* @__PURE__ */ jsxs("div", { className: "treasury-card-header", children: [
            /* @__PURE__ */ jsx("h3", { className: "treasury-card-title", children: card.title }),
            /* @__PURE__ */ jsx("div", { className: `treasury-card-icon ${card.color === "bg-green-500" ? "green" : card.color === "bg-purple-500" ? "purple" : ""}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            card.loading ? /* @__PURE__ */ jsx(LoadingSkeleton, { className: "w-20 h-6 mt-1" }) : /* @__PURE__ */ jsxs("p", { className: "treasury-card-value", children: [
              "৳ ",
              card.value.toLocaleString("bn-BD")
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `treasury-card-change ${card.changeType === "increase" ? "positive" : "negative"}`, children: [
              card.changeType === "increase" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: card.change })
            ] })
          ] })
        ] }, index);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "treasury-transactions", children: [
        /* @__PURE__ */ jsx("div", { className: "treasury-transactions-header", children: /* @__PURE__ */ jsxs("h2", { className: "treasury-transactions-title", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }),
          "সাম্প্রতিক লেনদেন"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          loading.transactions ? /* @__PURE__ */ jsx(LoadingAnimation, {}) : treasuryData.recentTransactions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "treasury-transactions-list", children: treasuryData.recentTransactions.map((transaction) => {
            const formattedTransaction = formatTransaction(transaction);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "treasury-transaction-item",
                style: { cursor: "pointer" },
                onClick: (e) => handleTransactionClick(transaction, e),
                children: [
                  /* @__PURE__ */ jsx("div", { className: `treasury-transaction-icon ${formattedTransaction.isIncome ? "deposit" : "withdrawal"}`, children: formattedTransaction.isIncome ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "treasury-transaction-details", children: [
                    /* @__PURE__ */ jsx("p", { className: "treasury-transaction-description", children: formattedTransaction.type }),
                    /* @__PURE__ */ jsxs("p", { className: "treasury-transaction-time", children: [
                      formattedTransaction.memberName,
                      " •",
                      /* @__PURE__ */ jsx("span", { className: "month-badge", style: {
                        backgroundColor: "#fff3e0",
                        color: "#f57c00",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: "600",
                        display: "inline-block",
                        marginLeft: "4px",
                        border: "1px solid #ffcc02"
                      }, children: formattedTransaction.monthName })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: `treasury-transaction-amount ${formattedTransaction.isIncome ? "positive" : "negative"}`, children: [
                    formattedTransaction.isIncome ? "+" : "-",
                    "৳ ",
                    (formattedTransaction.amount || 0).toLocaleString("bn-BD")
                  ] })
                ]
              },
              formattedTransaction.id
            );
          }) }) : /* @__PURE__ */ jsxs("div", { className: "treasury-empty", children: [
            /* @__PURE__ */ jsx(Clock, { className: "treasury-empty-icon" }),
            /* @__PURE__ */ jsx("p", { className: "treasury-empty-title", children: "কোনো লেনদেন পাওয়া যায়নি" }),
            /* @__PURE__ */ jsx("p", { className: "treasury-empty-description", children: "এখনো কোনো লেনদেন রেকর্ড করা হয়নি" })
          ] }),
          !loading.transactions && treasuryData.recentTransactions.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => navigate("/transactions"),
              className: "inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-sm transition-all duration-300 group",
              children: [
                /* @__PURE__ */ jsx("span", { children: "সব লেনদেন দেখুন" }),
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "treasury-coming-soon", children: [
        /* @__PURE__ */ jsx("div", { className: "treasury-coming-soon-icon", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }) }),
        /* @__PURE__ */ jsx("h3", { className: "treasury-coming-soon-title", children: "বিনিয়োগ বিভাগ" }),
        /* @__PURE__ */ jsx("p", { className: "treasury-coming-soon-description", children: "বিনিয়োগ ট্র্যাকিং, রিটার্ন ক্যালকুলেশন এবং পোর্টফোলিও ম্যানেজমেন্ট ফিচার শীঘ্রই যোগ করা হবে।" })
      ] }),
      /* @__PURE__ */ jsx(
        TransactionDetailsCard,
        {
          transaction: selectedTransaction,
          isVisible: showTransactionCard,
          onClose: closeTransactionCard,
          position: cardPosition
        }
      )
    ] })
  ] });
};
const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const handleClose = () => {
    navigate("/cashier", { replace: true });
  };
  return /* @__PURE__ */ jsx(
    AddTransaction,
    {
      isOpen,
      onClose: handleClose
    }
  );
};
const CashierSettings = () => {
  const [activeTab, setActiveTab] = useState("system");
  const [saveStatus, setSaveStatus] = useState("");
  console.log("CashierSettings render", { activeTab });
  const [systemPreferences, setSystemPreferences] = useState({
    language: "bn",
    theme: "light",
    currency: "BDT",
    receiptPrint: "auto"
  });
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryError, setLoginHistoryError] = useState("");
  useEffect(() => {
    const loadLoginHistory = async () => {
      const uid = localStorage.getItem("somiti_uid");
      const { data, error } = await fetchLoginHistory(uid);
      if (error) {
        setLoginHistoryError("লগইন ইতিহাস লোড করা যায়নি");
      } else {
        setLoginHistory(data || []);
      }
    };
    loadLoginHistory();
  }, []);
  const handleSystemChange = (key, value) => {
    setSystemPreferences((prev) => ({ ...prev, [key]: value }));
  };
  const saveChanges = () => {
    setSaveStatus("saving");
    console.log("CashierSettings saveChanges", { systemPreferences });
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 2e3);
    }, 500);
  };
  const tabs = [
    { id: "system", label: "সিস্টেম", icon: Settings },
    { id: "history", label: "লগইন ইতিহাস", icon: FileText }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "cashier-settings", children: [
    /* @__PURE__ */ jsxs("div", { className: "cashier-settings-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "cashier-settings-header", children: [
        /* @__PURE__ */ jsx("h1", { className: "cashier-settings-title", children: "ক্যাশিয়ার সেটিংস" }),
        /* @__PURE__ */ jsx("p", { className: "cashier-settings-subtitle", children: "ক্যাশিয়ার প্যানেল ও কার্যক্রম সেটিংস পরিচালনা করুন" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cashier-settings-tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            console.log("CashierSettings tab switch", tab.id);
            setActiveTab(tab.id);
          },
          className: `cashier-tab ${activeTab === tab.id ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(tab.icon, { className: "h-4 w-4 mr-2" }),
            tab.label
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "cashier-tab-content", children: [
        activeTab === "system" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-section-header", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-icon", children: /* @__PURE__ */ jsx(Settings, {}) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "সিস্টেম সেটিংস" }),
              /* @__PURE__ */ jsx("p", { className: "settings-section-subtitle", children: "সিস্টেম পছন্দ কনফিগার করুন" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "settings-grid", children: /* @__PURE__ */ jsxs("div", { className: "settings-group", children: [
            /* @__PURE__ */ jsxs("h3", { className: "settings-group-title", children: [
              /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4" }),
              "সাধারণ সেটিংস"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "ভাষা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.language,
                  onChange: (e) => handleSystemChange("language", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "bn", children: "বাংলা" }),
                    /* @__PURE__ */ jsx("option", { value: "en", children: "English" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "থিম" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.theme,
                  onChange: (e) => handleSystemChange("theme", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "light", children: "হালকা" }),
                    /* @__PURE__ */ jsx("option", { value: "dark", children: "গাঢ়" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "মুদ্রা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.currency,
                  onChange: (e) => handleSystemChange("currency", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "BDT", children: "বাংলাদেশী টাকা (৳)" }),
                    /* @__PURE__ */ jsx("option", { value: "USD", children: "US Dollar ($)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "রসিদ প্রিন্ট" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: systemPreferences.receiptPrint,
                  onChange: (e) => handleSystemChange("receiptPrint", e.target.value),
                  className: "settings-dropdown",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "auto", children: "স্বয়ংক্রিয়" }),
                    /* @__PURE__ */ jsx("option", { value: "manual", children: "ম্যানুয়াল" }),
                    /* @__PURE__ */ jsx("option", { value: "disabled", children: "নিষ্ক্রিয়" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: saveChanges,
                className: "settings-button settings-button-primary",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                  "সেটিংস সংরক্ষণ করুন"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "settings-section", style: { marginTop: "24px" }, children: [
            /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "লগইন ইতিহাস" }),
            loginHistoryError && /* @__PURE__ */ jsx("div", { className: "inline-error", children: /* @__PURE__ */ jsx("span", { children: loginHistoryError }) }),
            /* @__PURE__ */ jsx("div", { className: "settings-grid", children: /* @__PURE__ */ jsx("div", { className: "settings-group", children: loginHistory.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: "ইতিহাস" }),
              /* @__PURE__ */ jsx("div", { className: "settings-value", children: "কোনো ইতিহাস পাওয়া যায়নি অথবা সেশন নেই" })
            ] }) : loginHistory.map((row, idx) => /* @__PURE__ */ jsxs("div", { className: "settings-field", children: [
              /* @__PURE__ */ jsx("label", { className: "settings-label", children: row.created_at?.toDate ? new Date(row.created_at.toDate()).toLocaleString("bn-BD") : row.created_at ? new Date(row.created_at).toLocaleString("bn-BD") : "" }),
              /* @__PURE__ */ jsxs("div", { className: "settings-value", children: [
                "ডিভাইস: ",
                row.meta?.ua || "অজানা",
                " | আইপি: ",
                row.ip || "অজানা",
                " | ",
                row.meta?.country || "",
                row.meta?.city ? ", " + row.meta.city : ""
              ] })
            ] }, idx)) }) })
          ] })
        ] }),
        activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-section-header", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-icon", children: /* @__PURE__ */ jsx(FileText, {}) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "লগইন ইতিহাস" }),
              /* @__PURE__ */ jsx("p", { className: "settings-section-subtitle", children: "সাম্প্রতিক লগইন তথ্য" })
            ] })
          ] }),
          loginHistoryError && /* @__PURE__ */ jsx("div", { className: "inline-error", children: /* @__PURE__ */ jsx("span", { children: loginHistoryError }) }),
          /* @__PURE__ */ jsx("div", { className: "history-list", children: loginHistory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "history-item", children: /* @__PURE__ */ jsx("div", { className: "history-meta-line", children: "কোনো ইতিহাস পাওয়া যায়নি অথবা সেশন নেই" }) }) : loginHistory.map((row, idx) => /* @__PURE__ */ jsxs("div", { className: "history-item", children: [
            /* @__PURE__ */ jsx("div", { className: "history-date", children: row.created_at?.toDate ? new Date(row.created_at.toDate()).toLocaleString("bn-BD") : row.created_at ? new Date(row.created_at).toLocaleString("bn-BD") : "" }),
            /* @__PURE__ */ jsxs("div", { className: "history-meta-line", children: [
              "ডিভাইস: ",
              row.meta?.ua || "অজানা"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "history-meta-line", children: [
              "আইপি: ",
              row.ip || "অজানা",
              " | ",
              row.meta?.country || "",
              row.meta?.city ? ", " + row.meta.city : ""
            ] })
          ] }, idx)) })
        ] })
      ] })
    ] }),
    saveStatus && /* @__PURE__ */ jsx("div", { className: `save-status ${saveStatus === "saving" ? "error" : "success"}`, children: saveStatus === "saving" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }),
      /* @__PURE__ */ jsx("span", { children: "সংরক্ষণ করা হচ্ছে..." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
      /* @__PURE__ */ jsx("span", { children: "সংরক্ষিত হয়েছে!" })
    ] }) })
  ] });
};
console.log("[MemberDashboard] module loaded");
const MemberDashboard = () => {
  console.log("[MemberDashboard] render", { time: (/* @__PURE__ */ new Date()).toISOString() });
  const { currentUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState({ initial: true });
  const [somitiUserId, setSomitiUserId] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    memberRank: 0,
    yearsOfMembership: 0,
    attendanceRate: 0
  });
  const [photoURL, setPhotoURL] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [ownTransactions, setOwnTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(void 0);
  const nowYear = useMemo(() => (/* @__PURE__ */ new Date()).getFullYear(), []);
  const nowMonth = useMemo(() => (/* @__PURE__ */ new Date()).getMonth(), []);
  useEffect(() => {
    console.log("[MemberDashboard] mounted");
    return () => {
      console.log("[MemberDashboard] unmounted");
    };
  }, []);
  useEffect(() => {
    const loadMemberData = async () => {
      if (!currentUser?.uid) return;
      try {
        console.log("[MemberDashboard] loadMemberData:start", { uid: currentUser?.uid });
        setLoading({ initial: true });
        const membersResult = await MemberService.getActiveMembers();
        if (membersResult.success && membersResult.data) {
          const allMembers = membersResult.data;
          console.log("[MemberDashboard] activeMembers:fetched", { count: allMembers.length });
          const sortedByCreatedAt = [...allMembers].sort((a, b) => {
            const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
            const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
            if (createdA.getTime() !== createdB.getTime()) {
              return createdA - createdB;
            }
            return (a.id || "").localeCompare(b.id || "");
          });
          console.log("[MemberDashboard] somitiUserId ordered by createdAt ascending");
          const currentUserIndex = sortedByCreatedAt.findIndex((member) => member.id === currentUser.uid);
          const calculatedSomitiUserId = currentUserIndex !== -1 ? currentUserIndex + 1 : "";
          setSomitiUserId(calculatedSomitiUserId);
          console.log("[MemberDashboard] somitiUserId:calculated", { somitiUserId: calculatedSomitiUserId });
          const currentUserData = sortedByCreatedAt.find((member) => member.id === currentUser.uid);
          if (currentUserData) {
            setPhotoURL(currentUserData.photoURL || null);
            const actualJoiningDate = currentUserData.joiningDate || currentUserData.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || "";
            if (actualJoiningDate) {
              const joinDate2 = new Date(actualJoiningDate);
              setJoiningDate(joinDate2.toLocaleDateString("bn-BD"));
              const yearsOfMembership = Math.floor((/* @__PURE__ */ new Date() - joinDate2) / (365.25 * 24 * 60 * 60 * 1e3));
              setMemberStats({
                totalMembers: allMembers.length,
                memberRank: calculatedSomitiUserId,
                yearsOfMembership: Math.max(0, yearsOfMembership),
                attendanceRate: Math.floor(Math.random() * 30) + 70
                // Simulated attendance rate 70-100%
              });
              console.log("[MemberDashboard] stats:updated", {
                totalMembers: allMembers.length,
                memberRank: calculatedSomitiUserId,
                yearsOfMembership: Math.max(0, yearsOfMembership)
              });
            }
          }
        }
        setLoading({ initial: false });
        console.log("[MemberDashboard] loadMemberData:done");
      } catch (error) {
        console.error("[MemberDashboard] সদস্য তথ্য লোড করতে ত্রুটি:", error);
        setLoading({ initial: false });
      }
    };
    loadMemberData();
  }, [currentUser]);
  useEffect(() => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    console.log("[MemberDashboard] ownTransactions:subscribe", { uid });
    const q = query(collection(db, "transactions"), where("memberId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const tx = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("[MemberDashboard] ownTransactions:update", { count: tx.length });
      setOwnTransactions(tx);
    }, (err) => {
      console.error("[MemberDashboard] ownTransactions:error", err);
      setOwnTransactions([]);
    });
    return () => {
      console.log("[MemberDashboard] ownTransactions:unsub");
      unsub && unsub();
    };
  }, [currentUser]);
  const availableYears = useMemo(() => {
    const years = /* @__PURE__ */ new Set();
    ownTransactions.forEach((t) => {
      const d = typeof t.date?.toDate === "function" ? t.date.toDate() : t.date?.seconds ? new Date(t.date.seconds * 1e3) : t.date ? new Date(t.date) : t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1e3) : void 0;
      const y = d?.getFullYear?.();
      if (typeof y === "number") years.add(y);
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    console.log("[MemberDashboard] ownTransactions:availableYears", arr);
    return arr;
  }, [ownTransactions]);
  useEffect(() => {
    if (!selectedYear) {
      const def = availableYears.includes(nowYear) ? nowYear : availableYears[0];
      if (def) {
        setSelectedYear(def);
        console.log("[MemberDashboard] ownTransactions:selectedYear:default", def);
      }
    } else {
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
        setSelectedYear(availableYears[0]);
        console.log("[MemberDashboard] ownTransactions:selectedYear:adjusted", availableYears[0]);
      }
    }
  }, [availableYears, selectedYear, nowYear]);
  const ownAggregation = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    let totalPaid = 0;
    ownTransactions.forEach((t) => {
      const dateObj = typeof t.date?.toDate === "function" ? t.date.toDate() : t.date?.seconds ? new Date(t.date.seconds * 1e3) : t.date ? new Date(t.date) : t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1e3) : void 0;
      const yearInt = dateObj?.getFullYear?.();
      const monthInt = typeof t.month === "number" ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== "number" || typeof monthInt !== "number") return;
      if (typeof selectedYear === "number" && yearInt !== selectedYear) return;
      const amount = Number(t.amount) || 0;
      monthlyTotals[monthInt] += amount;
      totalPaid += amount;
    });
    console.log("[MemberDashboard] ownAggregation built", { totalPaid });
    return { monthlyTotals, totalPaid };
  }, [ownTransactions, selectedYear]);
  const shareCount = Number(currentUser?.shareCount || 0);
  const monthlyRate = shareCount * 500;
  const joinRaw = currentUser?.joiningDate || currentUser?.joinDate || null;
  const joinDate = joinRaw ? new Date(joinRaw) : void 0;
  const joinYear = joinDate?.getFullYear?.();
  const joinMonth = joinDate?.getMonth?.();
  let monthsDueCount = 0;
  if (typeof selectedYear === "number" && typeof joinYear === "number") {
    if (selectedYear < nowYear) {
      if (joinYear < selectedYear) monthsDueCount = 12;
      else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = 12 - joinMonth;
    } else if (selectedYear === nowYear) {
      if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
      else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = Math.max(0, nowMonth - joinMonth + 1);
    } else {
      monthsDueCount = 0;
    }
  }
  const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
  plannedDue - (ownAggregation.totalPaid || 0);
  if (userLoading || loading.initial) {
    console.log("[MemberDashboard] loading:active", { userLoading, initialData: loading.initial });
    return /* @__PURE__ */ jsx(LoadingAnimation, {});
  }
  console.log("[MemberDashboard] render:final", { state: { somitiUserId, joiningDate, memberStats } });
  return /* @__PURE__ */ jsxs("div", { className: "member-dashboard-home", children: [
    /* @__PURE__ */ jsx("div", { className: "member-profile-header", children: /* @__PURE__ */ jsxs("div", { className: "profile-content", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "profile-avatar",
          onClick: () => setIsPhotoModalOpen(true),
          role: "button",
          tabIndex: 0,
          onKeyDown: (e) => e.key === "Enter" && setIsPhotoModalOpen(true),
          children: photoURL ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("img", { src: photoURL, alt: "Profile", className: "profile-photo" }),
            /* @__PURE__ */ jsx("div", { className: "photo-overlay", children: /* @__PURE__ */ jsx(Camera, { className: "h-8 w-8" }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(User, { className: "h-20 w-20" }),
            /* @__PURE__ */ jsx("div", { className: "photo-overlay", children: /* @__PURE__ */ jsx(Camera, { className: "h-8 w-8" }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "profile-info", children: /* @__PURE__ */ jsx("div", { className: "profile-details", children: /* @__PURE__ */ jsx("h1", { children: currentUser?.name || "লোড হচ্ছে..." }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "profile-right-info", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "সদস্য আইডি: ",
          somitiUserId || "লোড হচ্ছে..."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "যোগদানের তারিখ: ",
          joiningDate || "লোড হচ্ছে..."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "membership-badge", children: [
          /* @__PURE__ */ jsx("p", { children: "সদস্যপদের ধরন" }),
          /* @__PURE__ */ jsx("p", { children: currentUser?.membershipType || "নিয়মিত সদস্য" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ProfilePhotoModal,
      {
        isOpen: isPhotoModalOpen,
        onClose: () => setIsPhotoModalOpen(false),
        userId: currentUser?.uid,
        currentPhotoURL: photoURL,
        onPhotoUpdate: (newPhotoURL) => setPhotoURL(newPhotoURL)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "stats-grid", children: [
      /* @__PURE__ */ jsx("div", { className: "stat-card blue", children: /* @__PURE__ */ jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-info", children: [
          /* @__PURE__ */ jsx("h3", { children: "সদস্য র‍্যাঙ্ক" }),
          /* @__PURE__ */ jsxs("p", { className: "value", children: [
            "#",
            memberStats.memberRank
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "subtitle", children: [
            "মোট ",
            memberStats.totalMembers,
            " জনের মধ্যে"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-icon", children: /* @__PURE__ */ jsx(Award, { className: "h-6 w-6" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "stat-card green", children: /* @__PURE__ */ jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-info", children: [
          /* @__PURE__ */ jsx("h3", { children: "সদস্যপদের বছর" }),
          /* @__PURE__ */ jsx("p", { className: "value", children: memberStats.yearsOfMembership }),
          /* @__PURE__ */ jsx("p", { className: "subtitle", children: "বছর সদস্য" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-icon", children: /* @__PURE__ */ jsx(Calendar, { className: "h-6 w-6" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "stat-card purple", children: /* @__PURE__ */ jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-info", children: [
          /* @__PURE__ */ jsx("h3", { children: "উপস্থিতির হার" }),
          /* @__PURE__ */ jsxs("p", { className: "value", children: [
            memberStats.attendanceRate,
            "%"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "subtitle", children: "সভায় উপস্থিতি" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-icon", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "stat-card orange", children: /* @__PURE__ */ jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "stat-info", children: [
          /* @__PURE__ */ jsx("h3", { children: "সদস্য স্ট্যাটাস" }),
          /* @__PURE__ */ jsx("p", { className: "value", children: "সক্রিয়" }),
          /* @__PURE__ */ jsx("p", { className: "subtitle", children: "ভাল অবস্থানে" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "stat-icon", children: /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "info-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "info-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "info-card-header", children: [
          /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-blue-600" }),
          /* @__PURE__ */ jsx("h3", { children: "ব্যক্তিগত তথ্য" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "info-list", children: [
          /* @__PURE__ */ jsxs("div", { className: "info-item", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "ইমেইল:" }),
            /* @__PURE__ */ jsx("span", { className: "value", children: currentUser?.email || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "info-item", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "ফোন:" }),
            /* @__PURE__ */ jsx("span", { className: "value", children: currentUser?.phone || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "info-item", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "ঠিকানা:" }),
            /* @__PURE__ */ jsx("span", { className: "value", children: currentUser?.address || "N/A" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "info-item", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-gray-500" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "জন্ম তারিখ:" }),
            /* @__PURE__ */ jsx("span", { className: "value", children: currentUser?.dateOfBirth || "N/A" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "info-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "info-card-header", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-5 w-5 text-yellow-600" }),
          /* @__PURE__ */ jsx("h3", { children: "সদস্যপদের সুবিধা" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "info-list", children: [
          /* @__PURE__ */ jsxs("div", { className: "benefit-item", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4 text-red-500" }),
            /* @__PURE__ */ jsx("span", { children: "সামাজিক নিরাপত্তা কভারেজ" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "benefit-item", children: [
            /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-green-500" }),
            /* @__PURE__ */ jsx("span", { children: "বিনিযোগের সুযোগ" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "benefit-item", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-blue-500" }),
            /* @__PURE__ */ jsx("span", { children: "আর্থিক শিক্ষা ও প্রশিক্ষণ" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "benefit-item", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-purple-500" }),
            /* @__PURE__ */ jsx("span", { children: "কমিউনিটি নেটওয়ার্ক" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "benefit-item", children: [
            /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-indigo-500" }),
            /* @__PURE__ */ jsx("span", { children: "জরুরি সহায়তা তহবিল" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "quick-actions", children: [
      /* @__PURE__ */ jsxs("div", { className: "quick-actions-header", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-indigo-600" }),
        /* @__PURE__ */ jsx("h3", { children: "দ্রুত কার্যক্রম" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "actions-grid", children: [
        /* @__PURE__ */ jsxs("button", { className: "action-button blue", children: [
          /* @__PURE__ */ jsx("div", { className: "icon", children: /* @__PURE__ */ jsx(Bell, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("span", { children: "নোটিশ দেখুন" })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "action-button green", children: [
          /* @__PURE__ */ jsx("div", { className: "icon", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("span", { children: "সদস্য তালিকা" })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "action-button purple", children: [
          /* @__PURE__ */ jsx("div", { className: "icon", children: /* @__PURE__ */ jsx(Calendar, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("span", { children: "সভার সময়সূচী" })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "action-button orange", children: [
          /* @__PURE__ */ jsx("div", { className: "icon", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("span", { children: "নিয়মাবলী" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "welcome-message", children: /* @__PURE__ */ jsxs("div", { className: "welcome-content", children: [
      /* @__PURE__ */ jsx("div", { className: "welcome-icon", children: /* @__PURE__ */ jsx(Heart, { className: "h-6 w-6 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { className: "welcome-text", children: [
        /* @__PURE__ */ jsxs("h3", { children: [
          "স্বাগতম, ",
          currentUser?.name?.split(" ")[0] || "সদস্য",
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "আমাদের সমিতিতে আপনার অংশগ্রহণের জন্য ধন্যবাদ। আপনার আর্থিক লক্ষ্য অর্জনে আমরা আপনার পাশে আছি।" })
      ] })
    ] }) })
  ] });
};
const ShareTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const deposits = [
    {
      id: 1,
      memberName: "মোহাম্মদ রহিম উদ্দিন",
      memberId: "SM-001",
      amount: 2e3,
      status: "paid"
    },
    {
      id: 2,
      memberName: "ফাতেমা খাতুন",
      memberId: "SM-002",
      amount: 1500,
      status: "paid"
    },
    {
      id: 3,
      memberName: "আব্দুল কাদের",
      memberId: "SM-003",
      amount: 1e3,
      status: "pending"
    },
    {
      id: 4,
      memberName: "নাসির উদ্দিন",
      memberId: "SM-004",
      amount: 2e3,
      status: "paid"
    },
    {
      id: 5,
      memberName: "সালমা বেগম",
      memberId: "SM-005",
      amount: 1200,
      status: "pending"
    }
  ];
  const totalCollected = deposits.filter((d) => d.status === "paid").reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = deposits.filter((d) => d.status === "pending").length;
  const paidCount = deposits.filter((d) => d.status === "paid").length;
  const filteredDeposits = deposits.filter(
    (deposit) => deposit.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || deposit.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsx("div", { className: "md-dashboard", children: /* @__PURE__ */ jsx("div", { className: "md-surface-container", children: /* @__PURE__ */ jsxs("div", { className: "md-dashboard-content", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "শেয়ার ট্র্যাকিং" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "সদস্যদের মাসিক জমার সংক্ষিপ্ত তথ্য" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-full bg-blue-100", children: /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "মোট সংগৃহীত" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
            "৳ ",
            totalCollected.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-full bg-green-100", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "পরিশোধিত" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
            paidCount,
            " জন"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 rounded-full bg-orange-100", children: /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-orange-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "বকেয়া" }),
          /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
            pendingCount,
            " জন"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm border mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "সদস্যের নাম বা আইডি খুঁজুন...",
          className: "flex-1 border-0 focus:ring-0 focus:outline-none text-sm"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b bg-gray-50", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900", children: "মাসিক জমার তালিকা" }) }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: filteredDeposits.map((deposit) => /* @__PURE__ */ jsx("div", { className: "p-4 hover:bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: deposit.memberName }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
            "আইডি: ",
            deposit.memberId
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-900", children: [
            "৳ ",
            deposit.amount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-full ${deposit.status === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`, children: deposit.status === "paid" ? "পরিশোধিত" : "বকেয়া" })
        ] })
      ] }) }) }) }, deposit.id)) }),
      filteredDeposits.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "কোনো রেকর্ড পাওয়া যায়নি" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
      "নতুন জমা যোগ করুন"
    ] }) })
  ] }) }) });
};
const FinancialSummary = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [userTransactions, setUserTransactions] = useState([]);
  const [financialData, setFinancialData] = useState({
    totalFund: 0,
    totalShares: 0,
    shareValue: 0,
    monthlyDeposit: 0,
    totalDeposits: 0,
    dueMonths: 0,
    nextPaymentDue: "",
    loanTaken: 0,
    loanRemaining: 0,
    profitEarned: 0
  });
  useEffect(() => {
    const toDateSafe2 = (val) => {
      try {
        if (!val) return void 0;
        if (typeof val?.toDate === "function") return val.toDate();
        if (typeof val === "string") return new Date(val);
        if (val?.seconds) return new Date(val.seconds * 1e3);
        return new Date(val);
      } catch (e) {
        console.warn("FinancialSummary: toDateSafe failed, returning undefined", e);
        return void 0;
      }
    };
    const loadFinancialData = async () => {
      const effectiveUserId = currentUser?.uid || currentUser?.id;
      if (!effectiveUserId) {
        console.log("FinancialSummary: skip loadFinancialData, no user_id");
        return;
      }
      try {
        setLoading(true);
        console.log("FinancialSummary: start loadFinancialData for user_id", effectiveUserId);
        const memberResult = await MemberService.getMemberById(effectiveUserId);
        const memberDoc = memberResult?.success ? memberResult.data : null;
        const shareCountFromMember = Number(memberDoc?.shareCount || 0);
        const joinDateRaw = memberDoc?.joiningDate ?? memberDoc?.joinDate;
        const memberJoinDate = toDateSafe2(joinDateRaw) || new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 1);
        console.log("FinancialSummary: member profile loaded", {
          shareCountFromMember,
          joiningDate: memberJoinDate?.toISOString?.() || memberJoinDate
        });
        const txQuery = query(
          collection(db, "transactions"),
          where("memberId", "==", effectiveUserId)
        );
        const txSnap = await getDocs(txQuery);
        const transactions = [];
        txSnap.forEach((doc2) => transactions.push({ id: doc2.id, ...doc2.data() }));
        console.log("FinancialSummary: transactions fetched", transactions.length);
        const monthlyDeposits = transactions.filter((t) => t.transactionType === "monthly_deposit");
        const sharePurchases = transactions.filter((t) => t.transactionType === "share_purchase");
        const loanDisbursements = transactions.filter((t) => t.transactionType === "loan_disbursement");
        const loanRepayments = transactions.filter((t) => t.transactionType === "loan_repayment");
        const profitDistributions = transactions.filter((t) => t.transactionType === "profit_distribution");
        const totalFund = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalDeposits = monthlyDeposits.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const avgMonthlyDeposit = monthlyDeposits.length > 0 ? Math.round(totalDeposits / monthlyDeposits.length) : 0;
        const totalSharesFromTx = sharePurchases.reduce((sum, t) => sum + (parseInt(t.shareAmount) || 0), 0);
        const totalShareValue = sharePurchases.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const sharePrice = 500;
        const totalShares = shareCountFromMember > 0 ? shareCountFromMember : totalSharesFromTx;
        const totalLoanTaken = loanDisbursements.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalLoanRepaid = loanRepayments.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const loanRemaining = totalLoanTaken - totalLoanRepaid;
        const totalProfitEarned = profitDistributions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const currentDate = /* @__PURE__ */ new Date();
        const monthsFromJoin = [];
        const startDate = new Date(memberJoinDate.getFullYear(), memberJoinDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
          monthsFromJoin.push(new Date(d));
        }
        const paidMonthKeys = /* @__PURE__ */ new Set();
        monthlyDeposits.forEach((t) => {
          const candidate = toDateSafe2(t?.date) || toDateSafe2(t?.createdAt);
          const yearInt = candidate?.getFullYear?.();
          const monthInt = typeof t.month === "number" ? t.month : candidate?.getMonth?.();
          if (typeof monthInt === "number" && typeof yearInt === "number") {
            paidMonthKeys.add(`${yearInt}-${monthInt}`);
          }
        });
        console.log("FinancialSummary: paidMonthKeys built", paidMonthKeys.size);
        const missedMonths = monthsFromJoin.filter((month) => {
          const key = `${month.getFullYear()}-${month.getMonth()}`;
          return !paidMonthKeys.has(key) && month <= endDate;
        });
        console.log("FinancialSummary: due months computed", missedMonths.length);
        setFinancialData({
          totalFund,
          totalShares,
          shareValue: totalShareValue || totalShares * sharePrice,
          monthlyDeposit: avgMonthlyDeposit,
          totalDeposits,
          dueMonths: missedMonths.length,
          nextPaymentDue: currentDate.toLocaleDateString("bn-BD"),
          loanTaken: totalLoanTaken,
          loanRemaining,
          profitEarned: totalProfitEarned
        });
      } catch (error) {
        console.error("আর্থিক তথ্য লোড করতে ত্রুটি:", error);
      } finally {
        setLoading(false);
        console.log("FinancialSummary: loadFinancialData completed");
      }
    };
    loadFinancialData();
  }, [currentUser]);
  useEffect(() => {
    const loadUserTransactions = async () => {
      if (!currentUser?.uid && !currentUser?.id) return;
      try {
        setTxLoading(true);
        const effectiveMemberId = currentUser.uid || currentUser.id;
        console.log("FinancialSummary: loading recent transactions from Firestore for memberId", effectiveMemberId);
        const q = query(
          collection(db, "transactions"),
          where("memberId", "==", effectiveMemberId),
          limit(25)
        );
        const snapshot = await getDocs(q);
        const tx = [];
        snapshot.forEach((doc2) => tx.push({ id: doc2.id, ...doc2.data() }));
        const sorted = tx.sort((a, b) => {
          const aTs = a.createdAt?.seconds || 0;
          const bTs = b.createdAt?.seconds || 0;
          return bTs - aTs;
        }).slice(0, 5);
        setUserTransactions(sorted);
        console.log("FinancialSummary: recent transactions loaded", sorted.length);
      } catch (error) {
        console.error("FinancialSummary: Firestore user transactions error", error);
        setUserTransactions([]);
      } finally {
        setTxLoading(false);
      }
    };
    loadUserTransactions();
  }, [currentUser]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "financial-summary", children: /* @__PURE__ */ jsx("div", { className: "financial-summary__container", children: /* @__PURE__ */ jsx("div", { className: "financial-summary__loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "financial-summary", children: /* @__PURE__ */ jsxs("div", { className: "financial-summary__container", children: [
    /* @__PURE__ */ jsxs("div", { className: "financial-summary__header", children: [
      /* @__PURE__ */ jsx("h1", { className: "financial-summary__title", children: "আর্থিক সারসংক্ষেপ" }),
      /* @__PURE__ */ jsx("p", { className: "financial-summary__subtitle", children: "আপনার ব্যক্তিগত আর্থিক তথ্যের সংক্ষিপ্ত বিবরণ" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "financial-summary__main-cards", children: [
      /* @__PURE__ */ jsxs("div", { className: "financial-card financial-card--fund", children: [
        /* @__PURE__ */ jsx("div", { className: "financial-card__header", children: /* @__PURE__ */ jsx("div", { className: "financial-card__icon", children: /* @__PURE__ */ jsx(Wallet, { size: 20 }) }) }),
        /* @__PURE__ */ jsx("div", { className: "financial-card__label", children: "মোট তহবিল" }),
        /* @__PURE__ */ jsxs("div", { className: "financial-card__value", children: [
          "৳ ",
          (financialData.totalFund || 0).toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "financial-card__description", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
          /* @__PURE__ */ jsx("span", { children: "সর্বমোট সম্পদ" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "financial-card financial-card--shares", children: [
        /* @__PURE__ */ jsx("div", { className: "financial-card__header", children: /* @__PURE__ */ jsx("div", { className: "financial-card__icon", children: /* @__PURE__ */ jsx(PieChart$1, { size: 20 }) }) }),
        /* @__PURE__ */ jsx("div", { className: "financial-card__label", children: "মোট শেয়ার" }),
        /* @__PURE__ */ jsxs("div", { className: "financial-card__value", children: [
          financialData.totalShares,
          " টি"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "financial-card__description", children: [
          /* @__PURE__ */ jsx(Target, { size: 16 }),
          /* @__PURE__ */ jsxs("span", { children: [
            "মূল্য: ৳ ",
            (financialData.shareValue || 0).toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `financial-card financial-card--due ${financialData.dueMonths === 0 ? "financial-card--success" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { className: "financial-card__header", children: /* @__PURE__ */ jsx("div", { className: "financial-card__icon", children: financialData.dueMonths > 0 ? /* @__PURE__ */ jsx(AlertTriangle, { size: 20 }) : /* @__PURE__ */ jsx(CheckCircle, { size: 20 }) }) }),
        /* @__PURE__ */ jsx("div", { className: "financial-card__label", children: "বকেয়া মাস" }),
        /* @__PURE__ */ jsxs("div", { className: "financial-card__value", children: [
          financialData.dueMonths,
          " মাস"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "financial-card__description", children: financialData.dueMonths > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Clock, { size: 16 }),
          /* @__PURE__ */ jsx("span", { children: "পরিশোধ করুন" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Award, { size: 16 }),
          /* @__PURE__ */ jsx("span", { children: "সব আপডেট" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "financial-summary__detail-cards", children: [
      /* @__PURE__ */ jsxs("div", { className: "detail-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "detail-card__header", children: [
          /* @__PURE__ */ jsxs("div", { className: "detail-card__title", children: [
            /* @__PURE__ */ jsx("div", { className: "detail-card__icon", children: /* @__PURE__ */ jsx(Calendar, { size: 16 }) }),
            "মাসিক জমা তথ্য"
          ] }),
          /* @__PURE__ */ jsx(ArrowUpRight, { size: 16, style: { color: "#94a3b8" } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "detail-card__content", children: [
          /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
            /* @__PURE__ */ jsx("span", { className: "detail-item__label", children: "মোট জমা:" }),
            /* @__PURE__ */ jsxs("span", { className: "detail-item__value", children: [
              "৳ ",
              (financialData.totalDeposits || 0).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
            /* @__PURE__ */ jsx("span", { className: "detail-item__label", children: "গড় মাসিক জমা:" }),
            /* @__PURE__ */ jsxs("span", { className: "detail-item__value", children: [
              "৳ ",
              (financialData.monthlyDeposit || 0).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
            /* @__PURE__ */ jsx("span", { className: "detail-item__label", children: "পরবর্তী পেমেন্ট:" }),
            /* @__PURE__ */ jsx("span", { className: "detail-item__value", children: financialData.nextPaymentDue })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "detail-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "detail-card__header", children: [
          /* @__PURE__ */ jsxs("div", { className: "detail-card__title", children: [
            /* @__PURE__ */ jsx("div", { className: "detail-card__icon", children: /* @__PURE__ */ jsx(DollarSign, { size: 16 }) }),
            "সাম্প্রতিক লেনদেন"
          ] }),
          /* @__PURE__ */ jsx(ArrowUpRight, { size: 16, style: { color: "#94a3b8" } })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "detail-card__content", children: txLoading ? /* @__PURE__ */ jsx("div", { className: "financial-summary__loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) : userTransactions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
          /* @__PURE__ */ jsx("span", { className: "detail-item__label", children: "স্বল্প তথ্য:" }),
          /* @__PURE__ */ jsx("span", { className: "detail-item__value", children: "কোন লেনদেন পাওয়া যায়নি" })
        ] }) : userTransactions.map((t) => {
          const createdAtDate = t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1e3) : /* @__PURE__ */ new Date();
          const dateStr = createdAtDate.toLocaleDateString("bn-BD");
          const timeStr = createdAtDate.toLocaleTimeString("bn-BD");
          const typeLabel = t.transactionType || t.type || "other";
          const amount = t.amount || 0;
          return /* @__PURE__ */ jsxs("div", { className: "detail-item", children: [
            /* @__PURE__ */ jsxs("span", { className: "detail-item__label", children: [
              typeLabel,
              " • ",
              /* @__PURE__ */ jsxs("span", { style: { color: "#64748b" }, children: [
                dateStr,
                " ",
                timeStr
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "detail-item__value", children: [
              "৳ ",
              amount.toLocaleString("bn-BD")
            ] })
          ] }, t.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "detail-card", children: [
      /* @__PURE__ */ jsx("div", { className: "detail-card__header", children: /* @__PURE__ */ jsxs("div", { className: "detail-card__title", children: [
        /* @__PURE__ */ jsx("div", { className: "detail-card__icon", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) }),
        "স্ট্যাটাস সারি"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "financial-summary__status-cards", children: [
        /* @__PURE__ */ jsx("div", { className: "status-card status-card--success", children: /* @__PURE__ */ jsxs("div", { className: "status-card__content", children: [
          /* @__PURE__ */ jsx("div", { className: "status-card__icon", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "status-card__info", children: [
            /* @__PURE__ */ jsx("div", { className: "status-card__title", children: "পেমেন্ট স্ট্যাটাস" }),
            /* @__PURE__ */ jsx("div", { className: "status-card__description", children: financialData.dueMonths === 0 ? "সম্পূর্ণ আপডেট" : `${financialData.dueMonths} মাস বকেয়া` })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "status-card status-card--info", children: /* @__PURE__ */ jsxs("div", { className: "status-card__content", children: [
          /* @__PURE__ */ jsx("div", { className: "status-card__icon", children: /* @__PURE__ */ jsx(PieChart$1, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "status-card__info", children: [
            /* @__PURE__ */ jsx("div", { className: "status-card__title", children: "শেয়ার হোল্ডার" }),
            /* @__PURE__ */ jsx("div", { className: "status-card__description", children: financialData.totalShares > 0 ? `${financialData.totalShares} শেয়ার সক্রিয়` : "কোন শেয়ার নেই" })
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
};
const NOTICES_COLLECTION = "notices";
class NoticeService {
  // Add new notice
  static async addNotice(noticeData) {
    try {
      const docRef = await addDoc(collection(db, NOTICES_COLLECTION), {
        ...noticeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        views: 0,
        status: noticeData.status || "active"
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("নোটিশ যোগ করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Get all notices
  static async getAllNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        notices.push({
          id: doc2.id,
          ...data,
          // Convert Firestore timestamp to date string if needed
          publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
          updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error("নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get notices by category
  static async getNoticesByCategory(category) {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where("category", "==", category),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        notices.push({
          id: doc2.id,
          ...data,
          publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
          updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error("ক্যাটেগরি অনুযায়ী নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get notices by priority
  static async getNoticesByPriority(priority) {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where("priority", "==", priority),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        notices.push({
          id: doc2.id,
          ...data,
          publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
          updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error("অগ্রাধিকার অনুযায়ী নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get active notices
  static async getActiveNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where("status", "==", "active"),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        notices.push({
          id: doc2.id,
          ...data,
          publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
          updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error("সক্রিয় নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get pinned notices
  static async getPinnedNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where("isPinned", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc2) => {
        const data = doc2.data();
        notices.push({
          id: doc2.id,
          ...data,
          publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
          updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error("পিন করা নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get notice by ID
  static async getNoticeById(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      const docSnap = await getDoc(noticeRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          success: true,
          data: {
            id: docSnap.id,
            ...data,
            publishDate: data.publishDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            createdAt: data.createdAt?.toDate?.() || /* @__PURE__ */ new Date(),
            updatedAt: data.updatedAt?.toDate?.() || /* @__PURE__ */ new Date()
          }
        };
      } else {
        return { success: false, error: "নোটিশ পাওয়া যায়নি" };
      }
    } catch (error) {
      console.error("নোটিশ লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Update notice
  static async updateNotice(noticeId, updateData) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("নোটিশ আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Delete notice
  static async deleteNotice(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await deleteDoc(noticeRef);
      return { success: true };
    } catch (error) {
      console.error("নোটিশ মুছতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Increment view count
  static async incrementViews(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("ভিউ কাউন্ট আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Toggle pin status
  static async togglePin(noticeId, isPinned) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        isPinned: !isPinned,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("পিন স্ট্যাটাস পরিবর্তন করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Update notice status
  static async updateStatus(noticeId, status) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("নোটিশ স্ট্যাটাস আপডেট করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Search notices
  static async searchNotices(searchTerm) {
    try {
      const allNoticesResult = await this.getAllNotices();
      if (!allNoticesResult.success) {
        return allNoticesResult;
      }
      const filteredNotices = allNoticesResult.data.filter(
        (notice) => notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || notice.content.toLowerCase().includes(searchTerm.toLowerCase()) || notice.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return { success: true, data: filteredNotices };
    } catch (error) {
      console.error("নোটিশ খুঁজতে ত্রুটি:", error);
      return { success: false, error: error.message, data: [] };
    }
  }
  // Get notices statistics
  static async getNoticesStats() {
    try {
      const allNoticesResult = await this.getAllNotices();
      if (!allNoticesResult.success) {
        return { success: false, error: allNoticesResult.error };
      }
      const notices = allNoticesResult.data;
      const stats = {
        total: notices.length,
        active: notices.filter((n) => n.status === "active").length,
        pinned: notices.filter((n) => n.isPinned).length,
        expiring: notices.filter((n) => this.isExpiringSoon(n.expiryDate)).length
      };
      return { success: true, data: stats };
    } catch (error) {
      console.error("নোটিশ পরিসংখ্যান লোড করতে ত্রুটি:", error);
      return { success: false, error: error.message };
    }
  }
  // Helper function to check if notice is expiring soon
  static isExpiringSoon(expiryDate) {
    if (!expiryDate) return false;
    const today = /* @__PURE__ */ new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }
}
const NoticeBoard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pinned: 0,
    expiring: 0
  });
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    category: "announcement",
    priority: "medium",
    expiryDate: "",
    tags: "",
    isPinned: false,
    attachments: []
  });
  useEffect(() => {
    console.log("NoticeBoard mounted", { role: user?.role });
    loadNotices();
    loadStats();
  }, []);
  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await NoticeService.getAllNotices();
      if (result.success) {
        setNotices(result.data);
      } else {
        setError(result.error);
        console.error("Failed to load notices:", result.error);
      }
    } catch (err) {
      setError("নোটিশ লোড করতে সমস্যা হয়েছে");
      console.error("Error loading notices:", err);
    } finally {
      setLoading(false);
    }
  };
  const loadStats = async () => {
    try {
      const result = await NoticeService.getNoticesStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };
  const handleCreateNotice = async () => {
    try {
      const noticeData = {
        ...newNotice,
        tags: newNotice.tags ? newNotice.tags.split(",").map((tag) => tag.trim()) : [],
        author: "বর্তমান ব্যবহারকারী",
        // This should come from auth context
        authorRole: "সদস্য",
        // This should come from user profile
        attachments: newNotice.attachments || []
      };
      const result = await NoticeService.addNotice(noticeData);
      if (result.success) {
        setShowCreateModal(false);
        setNewNotice({
          title: "",
          content: "",
          category: "announcement",
          priority: "medium",
          expiryDate: "",
          tags: "",
          isPinned: false,
          attachments: []
        });
        await loadNotices();
        await loadStats();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("নোটিশ তৈরি করতে সমস্যা হয়েছে");
      console.error("Error creating notice:", err);
    }
  };
  const handleNoticeView = async (notice) => {
    try {
      await NoticeService.incrementViews(notice.id);
      setSelectedNotice({ ...notice, views: (notice.views || 0) + 1 });
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error incrementing views:", err);
      setSelectedNotice(notice);
      setShowDetailsModal(true);
    }
  };
  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm("আপনি কি এই নোটিশটি মুছে ফেলতে চান?")) {
      try {
        const result = await NoticeService.deleteNotice(noticeId);
        if (result.success) {
          await loadNotices();
          await loadStats();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("নোটিশ মুছতে সমস্যা হয়েছে");
        console.error("Error deleting notice:", err);
      }
    }
  };
  const handleTogglePin = async (notice) => {
    try {
      const result = await NoticeService.togglePin(notice.id, notice.isPinned);
      if (result.success) {
        await loadNotices();
        await loadStats();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("পিন স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
      console.error("Error toggling pin:", err);
    }
  };
  const categories = [
    { value: "all", label: "সকল বিভাগ" },
    { value: "announcement", label: "ঘোষণা", icon: Bell },
    { value: "meeting", label: "সভা", icon: Users },
    { value: "decision", label: "সিদ্ধান্ত", icon: CheckCircle },
    { value: "information", label: "তথ্য", icon: AlertCircle },
    { value: "policy", label: "নীতিমালা", icon: FileText }
  ];
  const priorities = [
    { value: "all", label: "সকল অগ্রাধিকার" },
    { value: "high", label: "উচ্চ", color: "text-red-600 bg-red-100" },
    { value: "medium", label: "মধ্যম", color: "text-yellow-600 bg-yellow-100" },
    { value: "low", label: "নিম্ন", color: "text-green-600 bg-green-100" }
  ];
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || notice.content.toLowerCase().includes(searchTerm.toLowerCase()) || notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || notice.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });
  const sortedNotices = filteredNotices.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt);
  });
  const getCategoryIcon = (category) => {
    const categoryObj = categories.find((cat) => cat.value === category);
    return categoryObj ? categoryObj.icon : Bell;
  };
  const formatDate = (dateString) => {
    if (!dateString) return "তারিখ নেই";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD");
  };
  const handleInputChange = (field, value) => {
    setNewNotice((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "notice-board", children: /* @__PURE__ */ jsx("div", { className: "notice-loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "notice-board", children: /* @__PURE__ */ jsxs("div", { className: "notice-error", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 48 }),
      /* @__PURE__ */ jsx("h3", { children: "ত্রুটি ঘটেছে" }),
      /* @__PURE__ */ jsx("p", { children: error }),
      /* @__PURE__ */ jsx("button", { onClick: loadNotices, className: "retry-button", children: "পুনরায় চেষ্টা করুন" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "notice-board", children: [
    /* @__PURE__ */ jsxs("div", { className: "notice-board__container", children: [
      /* @__PURE__ */ jsxs("div", { className: "notice-board__header", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "notice-board__title", children: "নোটিশ বোর্ড" }),
          /* @__PURE__ */ jsx("p", { className: "notice-board__subtitle", children: "সমিতির সকল নোটিশ ও ঘোষণা" })
        ] }),
        user?.role === "admin" && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowCreateModal(true),
            className: "notice-board__create-btn",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              "নতুন নোটিশ"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "notice-board__summary", children: [
        /* @__PURE__ */ jsxs("div", { className: "summary-card", children: [
          /* @__PURE__ */ jsx("div", { className: "summary-card__icon summary-card__icon--total", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "summary-card__content", children: [
            /* @__PURE__ */ jsx("h3", { children: stats.total }),
            /* @__PURE__ */ jsx("p", { children: "মোট নোটিশ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "summary-card", children: [
          /* @__PURE__ */ jsx("div", { className: "summary-card__icon summary-card__icon--active", children: /* @__PURE__ */ jsx(CheckCircle, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "summary-card__content", children: [
            /* @__PURE__ */ jsx("h3", { children: stats.active }),
            /* @__PURE__ */ jsx("p", { children: "সক্রিয় নোটিশ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "summary-card", children: [
          /* @__PURE__ */ jsx("div", { className: "summary-card__icon summary-card__icon--pinned", children: /* @__PURE__ */ jsx(Pin, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "summary-card__content", children: [
            /* @__PURE__ */ jsx("h3", { children: stats.pinned }),
            /* @__PURE__ */ jsx("p", { children: "পিন করা নোটিশ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "summary-card", children: [
          /* @__PURE__ */ jsx("div", { className: "summary-card__icon summary-card__icon--expiring", children: /* @__PURE__ */ jsx(Clock, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "summary-card__content", children: [
            /* @__PURE__ */ jsx("h3", { children: stats.expiring }),
            /* @__PURE__ */ jsx("p", { children: "শীঘ্রই মেয়াদ শেষ" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "notice-board__filters", children: /* @__PURE__ */ jsxs("div", { className: "filters-row", children: [
        /* @__PURE__ */ jsx(
          SearchInput,
          {
            value: searchTerm,
            onChange: setSearchTerm,
            placeholder: "নোটিশ খুঁজুন...",
            className: "search-input"
          }
        ),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedCategory,
            onChange: (e) => setSelectedCategory(e.target.value),
            className: "filter-select",
            children: categories.map((category) => /* @__PURE__ */ jsx("option", { value: category.value, children: category.label }, category.value))
          }
        ),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedPriority,
            onChange: (e) => setSelectedPriority(e.target.value),
            className: "filter-select",
            children: priorities.map((priority) => /* @__PURE__ */ jsx("option", { value: priority.value, children: priority.label }, priority.value))
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "notice-board__content", children: sortedNotices.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "notice-board__empty", children: [
        /* @__PURE__ */ jsx(FileText, { size: 48 }),
        /* @__PURE__ */ jsx("h3", { children: "কোন নোটিশ পাওয়া যায়নি" }),
        /* @__PURE__ */ jsx("p", { children: "আপনার অনুসন্ধানের সাথে মিলে এমন কোন নোটিশ নেই।" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "notices-grid", children: sortedNotices.map((notice) => {
        const CategoryIcon = getCategoryIcon(notice.category);
        return /* @__PURE__ */ jsxs("div", { className: "notice-card", children: [
          notice.isPinned && /* @__PURE__ */ jsx("div", { className: "notice-card__pin", children: /* @__PURE__ */ jsx(Pin, { size: 14 }) }),
          /* @__PURE__ */ jsxs("div", { className: "notice-card__header", children: [
            /* @__PURE__ */ jsxs("div", { className: "notice-card__category", children: [
              /* @__PURE__ */ jsx(CategoryIcon, { size: 16 }),
              /* @__PURE__ */ jsx("span", { children: categories.find((cat) => cat.value === notice.category)?.label })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "notice-card__actions", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleTogglePin(notice),
                  className: `action-btn ${notice.isPinned ? "action-btn--pinned" : ""}`,
                  title: notice.isPinned ? "আনপিন করুন" : "পিন করুন",
                  children: /* @__PURE__ */ jsx(Pin, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleNoticeView(notice),
                  className: "action-btn",
                  title: "বিস্তারিত দেখুন",
                  children: /* @__PURE__ */ jsx(Eye, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDeleteNotice(notice.id),
                  className: "action-btn action-btn--danger",
                  title: "মুছে ফেলুন",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "notice-card__content", children: [
            /* @__PURE__ */ jsx("h3", { className: "notice-card__title", children: notice.title }),
            /* @__PURE__ */ jsx("p", { className: "notice-card__excerpt", children: notice.content.length > 120 ? notice.content.substring(0, 120) + "..." : notice.content })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "notice-card__meta", children: [
            /* @__PURE__ */ jsxs("div", { className: "notice-meta", children: [
              /* @__PURE__ */ jsx("span", { className: "notice-meta__author", children: notice.author }),
              /* @__PURE__ */ jsxs("span", { className: "notice-meta__role", children: [
                "(",
                notice.authorRole,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "notice-meta", children: /* @__PURE__ */ jsx("span", { className: "notice-meta__date", children: formatDate(notice.publishDate || notice.createdAt) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "notice-card__footer", children: [
            /* @__PURE__ */ jsxs("div", { className: "notice-badges", children: [
              /* @__PURE__ */ jsx("span", { className: `priority-badge priority-badge--${notice.priority}`, children: priorities.find((p) => p.value === notice.priority)?.label }),
              /* @__PURE__ */ jsx("span", { className: `status-badge status-badge--${notice.status}`, children: notice.status === "active" ? "সক্রিয়" : notice.status === "draft" ? "খসড়া" : "মেয়াদ শেষ" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "notice-stats", children: /* @__PURE__ */ jsxs("span", { className: "notice-stats__views", children: [
              /* @__PURE__ */ jsx(Eye, { size: 12 }),
              notice.views || 0
            ] }) })
          ] })
        ] }, notice.id);
      }) }) })
    ] }),
    showCreateModal && /* @__PURE__ */ jsx(Modal, { onClose: () => setShowCreateModal(false), children: /* @__PURE__ */ jsxs("div", { className: "modal__content", children: [
      /* @__PURE__ */ jsxs("div", { className: "modal__header", children: [
        /* @__PURE__ */ jsx("h2", { className: "modal__title", children: "নতুন নোটিশ তৈরি করুন" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowCreateModal(false),
            className: "modal__close",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleCreateNotice();
      }, className: "modal__form", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "নোটিশের শিরোনাম *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: newNotice.title,
              onChange: (e) => handleInputChange("title", e.target.value),
              className: "form-input",
              placeholder: "নোটিশের শিরোনাম লিখুন"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "বিস্তারিত বিবরণ *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              required: true,
              value: newNotice.content,
              onChange: (e) => handleInputChange("content", e.target.value),
              className: "form-textarea",
              placeholder: "নোটিশের বিস্তারিত বিবরণ লিখুন",
              rows: "4"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "বিভাগ *" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                required: true,
                value: newNotice.category,
                onChange: (e) => handleInputChange("category", e.target.value),
                className: "form-select",
                children: categories.filter((cat) => cat.value !== "all").map((category) => /* @__PURE__ */ jsx("option", { value: category.value, children: category.label }, category.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "অগ্রাধিকার *" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                required: true,
                value: newNotice.priority,
                onChange: (e) => handleInputChange("priority", e.target.value),
                className: "form-select",
                children: priorities.filter((p) => p.value !== "all").map((priority) => /* @__PURE__ */ jsx("option", { value: priority.value, children: priority.label }, priority.value))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "মেয়াদ শেষের তারিখ" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: newNotice.expiryDate,
                onChange: (e) => handleInputChange("expiryDate", e.target.value),
                className: "form-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "ট্যাগসমূহ" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: newNotice.tags,
                onChange: (e) => handleInputChange("tags", e.target.value),
                className: "form-input",
                placeholder: "কমা দিয়ে আলাদা করুন"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxs("label", { className: "form-checkbox", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: newNotice.isPinned,
              onChange: (e) => handleInputChange("isPinned", e.target.checked)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "checkbox-label", children: "এই নোটিশটি পিন করুন" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "modal__actions", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowCreateModal(false),
              className: "btn btn--secondary",
              children: "বাতিল"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "btn btn--primary",
              children: [
                /* @__PURE__ */ jsx(Send, { size: 16 }),
                "নোটিশ প্রকাশ করুন"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    showDetailsModal && selectedNotice && /* @__PURE__ */ jsx(Modal, { onClose: () => setShowDetailsModal(false), children: /* @__PURE__ */ jsxs("div", { className: "modal__content modal__content--large", children: [
      /* @__PURE__ */ jsxs("div", { className: "modal__header", children: [
        /* @__PURE__ */ jsx("h2", { className: "modal__title", children: selectedNotice.title }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDetailsModal(false),
            className: "modal__close",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "notice-details", children: [
        /* @__PURE__ */ jsx("div", { className: "notice-details__meta", children: /* @__PURE__ */ jsxs("div", { className: "notice-meta-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "লেখক:" }),
            /* @__PURE__ */ jsxs("span", { className: "meta-value", children: [
              selectedNotice.author,
              " (",
              selectedNotice.authorRole,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "প্রকাশের তারিখ:" }),
            /* @__PURE__ */ jsx("span", { className: "meta-value", children: formatDate(selectedNotice.publishDate || selectedNotice.createdAt) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "বিভাগ:" }),
            /* @__PURE__ */ jsx("span", { className: "meta-value", children: categories.find((cat) => cat.value === selectedNotice.category)?.label })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "অগ্রাধিকার:" }),
            /* @__PURE__ */ jsx("span", { className: `priority-badge priority-badge--${selectedNotice.priority}`, children: priorities.find((p) => p.value === selectedNotice.priority)?.label })
          ] }),
          selectedNotice.expiryDate && /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "মেয়াদ শেষ:" }),
            /* @__PURE__ */ jsx("span", { className: "meta-value", children: formatDate(selectedNotice.expiryDate) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ jsx("span", { className: "meta-label", children: "দেখা হয়েছে:" }),
            /* @__PURE__ */ jsxs("span", { className: "meta-value", children: [
              selectedNotice.views || 0,
              " বার"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "notice-details__content", children: [
          /* @__PURE__ */ jsx("h3", { children: "বিস্তারিত বিবরণ" }),
          /* @__PURE__ */ jsx("div", { className: "notice-content", children: selectedNotice.content })
        ] }),
        selectedNotice.tags && selectedNotice.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "notice-details__tags", children: [
          /* @__PURE__ */ jsx("h4", { children: "ট্যাগসমূহ" }),
          /* @__PURE__ */ jsx("div", { className: "tags-list", children: selectedNotice.tags.map((tag, index) => /* @__PURE__ */ jsxs("span", { className: "tag", children: [
            "#",
            tag
          ] }, index)) })
        ] }),
        selectedNotice.attachments && selectedNotice.attachments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "notice-details__attachments", children: [
          /* @__PURE__ */ jsx("h4", { children: "সংযুক্তি" }),
          /* @__PURE__ */ jsx("div", { className: "attachments-list", children: selectedNotice.attachments.map((attachment, index) => /* @__PURE__ */ jsxs("div", { className: "attachment-item", children: [
            /* @__PURE__ */ jsx(Paperclip, { size: 16 }),
            /* @__PURE__ */ jsx("span", { children: attachment })
          ] }, index)) })
        ] })
      ] })
    ] }) })
  ] });
};
const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "মোহাম্মদ রহিম উদ্দিন",
    memberId: "SM-001",
    phone: "০১৭১২৩৪৫৬৭৮",
    email: "rahim@example.com",
    address: "ঢাকা, বাংলাদেশ",
    joinDate: "২০২২-০১-১৫",
    membershipType: "নিয়মিত সদস্য",
    nidNumber: "১২৩৪৫৬৭৮৯০",
    emergencyContact: "০১৮১২৩৪৫৬৭৮",
    occupation: "ব্যবসায়ী"
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    monthlyStatements: true,
    paymentReminders: true,
    meetingNotifications: true,
    profitDistribution: true,
    systemUpdates: false
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: "90"
  });
  const [appPreferences, setAppPreferences] = useState({
    language: "bn",
    theme: "light",
    currency: "BDT",
    dateFormat: "dd/mm/yyyy",
    soundEnabled: true,
    autoLogout: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const handleProfileUpdate = () => {
    console.log("Profile updated:", profileData);
    setIsEditing(false);
  };
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }
    console.log("Password changed");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };
  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSecurityChange = (key, value) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handlePreferenceChange = (key, value) => {
    setAppPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const exportData = () => {
    console.log("Exporting user data...");
  };
  const deleteAccount = () => {
    if (confirm("আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট মুছে ফেলতে চান?")) {
      console.log("Account deletion requested");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "সেটিংস ও প্রোফাইল" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: "আপনার প্রোফাইল ও অ্যাপ্লিকেশন সেটিংস পরিচালনা করুন" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-card p-4", children: /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: [
        { id: "profile", label: "প্রোফাইল তথ্য", icon: User },
        { id: "security", label: "নিরাপত্তা", icon: Shield },
        { id: "notifications", label: "নোটিফিকেশন", icon: Bell },
        { id: "preferences", label: "পছন্দসমূহ", icon: Settings },
        { id: "data", label: "ডেটা ব্যবস্থাপনা", icon: Download }
      ].map((item) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(item.id),
          className: `w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`,
          children: [
            /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 mr-3" }),
            item.label
          ]
        },
        item.id
      )) }) }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-card p-6", children: [
        activeTab === "profile" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "প্রোফাইল তথ্য" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setIsEditing(!isEditing),
                className: "flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600",
                children: [
                  /* @__PURE__ */ jsx(Edit3, { className: "h-4 w-4 mr-2" }),
                  isEditing ? "বাতিল" : "সম্পাদনা"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "h-12 w-12 text-gray-400" }) }),
              isEditing && /* @__PURE__ */ jsx("button", { className: "absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-blue-600", children: /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: profileData.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
                "সদস্য আইডি: ",
                profileData.memberId
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: profileData.membershipType })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "পূর্ণ নাম" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: profileData.name,
                  onChange: (e) => setProfileData({ ...profileData, name: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "ফোন নম্বর" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: profileData.phone,
                  onChange: (e) => setProfileData({ ...profileData, phone: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "ইমেইল" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: profileData.email,
                  onChange: (e) => setProfileData({ ...profileData, email: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "জাতীয় পরিচয়পত্র" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: profileData.nidNumber,
                  onChange: (e) => setProfileData({ ...profileData, nidNumber: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "ঠিকানা" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 3,
                  value: profileData.address,
                  onChange: (e) => setProfileData({ ...profileData, address: e.target.value }),
                  disabled: !isEditing,
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "পেশা" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: profileData.occupation,
                  onChange: (e) => setProfileData({ ...profileData, occupation: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "জরুরি যোগাযোগ" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: profileData.emergencyContact,
                  onChange: (e) => setProfileData({ ...profileData, emergencyContact: e.target.value }),
                  disabled: !isEditing,
                  className: "form-input disabled:bg-gray-50"
                }
              )
            ] })
          ] }),
          isEditing && /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsEditing(false),
                className: "btn-secondary",
                children: "বাতিল"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleProfileUpdate,
                className: "flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
                  "সংরক্ষণ করুন"
                ]
              }
            )
          ] })
        ] }),
        activeTab === "security" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "নিরাপত্তা সেটিংস" }),
          /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "পাসওয়ার্ড পরিবর্তন" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "বর্তমান পাসওয়ার্ড" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: showPassword ? "text" : "password",
                      value: passwordData.currentPassword,
                      onChange: (e) => setPasswordData({ ...passwordData, currentPassword: e.target.value }),
                      className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "নতুন পাসওয়ার্ড" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    value: passwordData.newPassword,
                    onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }),
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "নতুন পাসওয়ার্ড নিশ্চিত করুন" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: showConfirmPassword ? "text" : "password",
                      value: passwordData.confirmPassword,
                      onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
                      className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirmPassword(!showConfirmPassword),
                      className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                      children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handlePasswordChange,
                  className: "flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600",
                  children: [
                    /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 mr-2" }),
                    "পাসওয়ার্ড পরিবর্তন করুন"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "নিরাপত্তা বিকল্পসমূহ" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "দ্বি-ফ্যাক্টর অথেন্টিকেশন" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "অতিরিক্ত নিরাপত্তার জন্য SMS কোড" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: securitySettings.twoFactorAuth,
                      onChange: (e) => handleSecurityChange("twoFactorAuth", e.target.checked),
                      className: "sr-only peer"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "লগইন সতর্কতা" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "নতুন ডিভাইস থেকে লগইনের সময় ইমেইল পাঠান" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: securitySettings.loginAlerts,
                      onChange: (e) => handleSecurityChange("loginAlerts", e.target.checked),
                      className: "sr-only peer"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "সেশন টাইমআউট" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: securitySettings.sessionTimeout,
                    onChange: (e) => handleSecurityChange("sessionTimeout", e.target.value),
                    className: "form-select",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "15", children: "১৫ মিনিট" }),
                      /* @__PURE__ */ jsx("option", { value: "30", children: "৩০ মিনিট" }),
                      /* @__PURE__ */ jsx("option", { value: "60", children: "১ ঘন্টা" }),
                      /* @__PURE__ */ jsx("option", { value: "120", children: "২ ঘন্টা" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        activeTab === "notifications" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "নোটিফিকেশন সেটিংস" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
            { key: "emailNotifications", label: "ইমেইল নোটিফিকেশন", desc: "গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান" },
            { key: "smsNotifications", label: "SMS নোটিফিকেশন", desc: "পেমেন্ট রিমাইন্ডার ও জরুরি বার্তা" },
            { key: "pushNotifications", label: "পুশ নোটিফিকেশন", desc: "অ্যাপে তাৎক্ষণিক বিজ্ঞপ্তি" },
            { key: "monthlyStatements", label: "মাসিক বিবৃতি", desc: "প্রতি মাসে আর্থিক বিবৃতি পান" },
            { key: "paymentReminders", label: "পেমেন্ট রিমাইন্ডার", desc: "বকেয়া পেমেন্টের জন্য অনুস্মারক" },
            { key: "meetingNotifications", label: "সভার বিজ্ঞপ্তি", desc: "আসন্ন সভা ও ইভেন্টের তথ্য" },
            { key: "profitDistribution", label: "লাভ বিতরণ", desc: "লাভ বিতরণের সময় বিজ্ঞপ্তি" },
            { key: "systemUpdates", label: "সিস্টেম আপডেট", desc: "নতুন ফিচার ও আপডেটের তথ্য" }
          ].map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: item.label }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: item.desc })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: notificationSettings[item.key],
                  onChange: () => handleNotificationChange(item.key),
                  className: "sr-only peer"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
            ] })
          ] }, item.key)) })
        ] }),
        activeTab === "preferences" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "অ্যাপ্লিকেশন পছন্দসমূহ" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "ভাষা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: appPreferences.language,
                  onChange: (e) => handlePreferenceChange("language", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "bn", children: "বাংলা" }),
                    /* @__PURE__ */ jsx("option", { value: "en", children: "English" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "থিম" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: appPreferences.theme,
                  onChange: (e) => handlePreferenceChange("theme", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "light", children: "হালকা" }),
                    /* @__PURE__ */ jsx("option", { value: "dark", children: "গাঢ়" }),
                    /* @__PURE__ */ jsx("option", { value: "auto", children: "স্বয়ংক্রিয়" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "মুদ্রা" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: appPreferences.currency,
                  onChange: (e) => handlePreferenceChange("currency", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "BDT", children: "বাংলাদেশী টাকা (৳)" }),
                    /* @__PURE__ */ jsx("option", { value: "USD", children: "US Dollar ($)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "তারিখ ফরম্যাট" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: appPreferences.dateFormat,
                  onChange: (e) => handlePreferenceChange("dateFormat", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "dd/mm/yyyy", children: "দিন/মাস/বছর" }),
                    /* @__PURE__ */ jsx("option", { value: "mm/dd/yyyy", children: "মাস/দিন/বছর" }),
                    /* @__PURE__ */ jsx("option", { value: "yyyy-mm-dd", children: "বছর-মাস-দিন" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "সাউন্ড ইফেক্ট" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "বোতাম ক্লিক ও নোটিফিকেশন সাউন্ড" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: appPreferences.soundEnabled,
                    onChange: (e) => handlePreferenceChange("soundEnabled", e.target.checked),
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border border-gray-200 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "স্বয়ংক্রিয় লগআউট" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: appPreferences.autoLogout,
                    onChange: (e) => handlePreferenceChange("autoLogout", e.target.checked),
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
              ] })
            ] })
          ] })
        ] }),
        activeTab === "data" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "ডেটা ব্যবস্থাপনা" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900", children: "ডেটা এক্সপোর্ট" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "আপনার সমস্ত ডেটা ডাউনলোড করুন" })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: exportData,
                  className: "flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600",
                  children: [
                    /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
                    "এক্সপোর্ট করুন"
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900", children: "ডেটা ইমপোর্ট" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "ব্যাকআপ ফাইল থেকে ডেটা পুনরুদ্ধার করুন" })
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [
                /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4 mr-2" }),
                "ইমপোর্ট করুন"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "border border-red-200 rounded-lg p-4 bg-red-50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-600 mt-0.5 mr-3" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-red-900", children: "অ্যাকাউন্ট মুছে ফেলুন" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 mt-1", children: "এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।" }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: deleteAccount,
                    className: "flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-3",
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                      "অ্যাকাউন্ট মুছে ফেলুন"
                    ]
                  }
                )
              ] })
            ] }) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const MemberSettings = () => {
  console.log("MemberSettings component module loaded.");
  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryError, setLoginHistoryError] = useState("");
  const { currentUser } = useUser();
  console.log("MemberSettings component rendered.");
  const [profileData, setProfileData] = useState({
    name: "",
    somiti_user_id: "",
    phone: "",
    email: "",
    address: "",
    role: "",
    status: "",
    shareCount: "",
    joiningDate: "",
    nomineeName: "",
    nomineePhone: "",
    nomineeRelation: "",
    user_id: "",
    createdAt: "",
    updatedAt: ""
  });
  useEffect(() => {
    const fetchMemberData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          console.log("Fetching member data for UID:", currentUser.uid);
          const memberDocRef = doc(db, "members", currentUser.uid);
          const memberDocSnap = await getDoc(memberDocRef);
          if (memberDocSnap.exists()) {
            const data = memberDocSnap.data();
            console.log("Member data found:", data);
            const allMembersSnap = await getDocs(collection(db, "members"));
            const allMembers = allMembersSnap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
            const sortedMembers = allMembers.sort((a, b) => {
              const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
              const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
              const dateA = new Date(joiningDateA);
              const dateB = new Date(joiningDateB);
              if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
              }
              const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || /* @__PURE__ */ new Date(0);
              const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || /* @__PURE__ */ new Date(0);
              if (createdA.getTime() === createdB.getTime()) {
                return a.id.localeCompare(b.id);
              }
              return createdA - createdB;
            });
            const currentUserIndex = sortedMembers.findIndex((member) => member.id === currentUser.uid);
            const somiti_user_id = currentUserIndex !== -1 ? currentUserIndex + 1 : "";
            console.log("Calculated somiti_user_id:", somiti_user_id);
            setProfileData({
              name: data.name || "",
              somiti_user_id,
              phone: data.phone || "",
              email: data.email || "",
              address: data.address || "",
              role: data.role || "member",
              status: data.status || "active",
              shareCount: data.shareCount || "0",
              joiningDate: data.joiningDate || "",
              nomineeName: data.nomineeName || "",
              nomineePhone: data.nomineePhone || "",
              nomineeRelation: data.nomineeRelation || "",
              user_id: data.user_id || currentUser.uid,
              createdAt: data.createdAt || "",
              updatedAt: data.updatedAt || ""
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching member data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.log("No current user found.");
      }
    };
    fetchMemberData();
    const loadLoginHistory = async () => {
      const uid = currentUser?.uid || localStorage.getItem("somiti_uid");
      const { data, error } = await fetchLoginHistory(uid);
      if (error) {
        setLoginHistoryError("লগইন ইতিহাস লোড করা যায়নি");
      } else {
        setLoginHistory(data || []);
      }
    };
    loadLoginHistory();
    return () => {
      console.log("MemberSettings component unmounted.");
    };
  }, [currentUser]);
  const [notificationSettings, setNotificationSettings] = useState({
    accountUpdates: true,
    paymentReminders: true,
    meetingNotifications: true,
    loanAlerts: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    passwordExpiry: "90"
  });
  const [systemPreferences, setSystemPreferences] = useState({
    language: "bn",
    theme: "light",
    currency: "BDT",
    dateFormat: "dd/mm/yyyy"
  });
  const handleNotificationChange = (key) => {
    console.log(`Notification setting toggled: ${key}`);
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSystemChange = (key, value) => {
    console.log(`System preference changed: ${key} = ${value}`);
    setSystemPreferences((prev) => ({ ...prev, [key]: value }));
  };
  const saveChanges = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("No user logged in or user ID is missing");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2e3);
      return;
    }
    console.log("Saving changes for user:", currentUser.uid);
    setSaveStatus("saving");
    try {
      const memberDocRef = doc(db, "members", currentUser.uid);
      await updateDoc(memberDocRef, {
        ...profileData,
        notificationSettings,
        securitySettings,
        systemPreferences,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      setSaveStatus("success");
      console.log("Changes saved successfully.");
    } catch (error) {
      console.error("Error updating document: ", error);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(""), 2e3);
    }
  };
  const tabs = [
    { id: "profile", label: "প্রোফাইল", icon: User },
    { id: "system", label: "সিস্টেম", icon: Settings },
    { id: "history", label: "লগইন ইতিহাস", icon: FileText }
  ];
  const notificationItems = [
    { key: "accountUpdates", title: "অ্যাকাউন্ট আপডেট", desc: "অ্যাকাউন্ট ও ব্যালেন্স পরিবর্তনের বিজ্ঞপ্তি" },
    { key: "paymentReminders", title: "পেমেন্ট রিমাইন্ডার", desc: "পেমেন্ট ও জমার তারিখ মনে করিয়ে দেওয়া" },
    { key: "meetingNotifications", title: "সভার বিজ্ঞপ্তি", desc: "সমিতির সভা ও অনুষ্ঠানের তথ্য" },
    { key: "loanAlerts", title: "ঋণ সতর্কতা", desc: "ঋণ পরিশোধ ও নতুন ঋণের তথ্য" }
  ];
  if (loading) {
    console.log("Loading state is true, showing loading animation.");
    return /* @__PURE__ */ jsx(LoadingAnimation, {});
  }
  console.log("Final render of MemberSettings component.");
  return /* @__PURE__ */ jsx("div", { className: "member-settings", children: /* @__PURE__ */ jsxs("div", { className: "member-settings-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "member-settings-header", children: [
      /* @__PURE__ */ jsx("h1", { className: "member-settings-title", children: "সদস্য সেটিংস" }),
      /* @__PURE__ */ jsx("p", { className: "member-settings-subtitle", children: "আপনার অ্যাকাউন্ট এবং পছন্দসমূহ পরিচালনা করুন" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "member-settings-tabs", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          console.log(`Switched to tab: ${tab.id}`);
          setActiveTab(tab.id);
        },
        className: `member-tab ${activeTab === tab.id ? "active" : ""}`,
        children: [
          /* @__PURE__ */ jsx(tab.icon, { className: "tab-icon" }),
          tab.label
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "member-tab-content", children: [
      activeTab === "profile" && /* @__PURE__ */ jsxs("div", { className: "profile-section", children: [
        /* @__PURE__ */ jsxs("div", { className: "readonly-notice", children: [
          /* @__PURE__ */ jsx("span", { className: "readonly-notice-icon", children: "ℹ️" }),
          /* @__PURE__ */ jsx("p", { className: "readonly-notice-text", children: "এই তথ্যগুলি শুধুমাত্র দেখার জন্য। পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "profile-section-header", children: [
          /* @__PURE__ */ jsx("div", { className: "profile-icon", children: /* @__PURE__ */ jsx(User, {}) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "profile-section-title", children: "প্রোফাইল তথ্য" }),
            /* @__PURE__ */ jsx("p", { className: "profile-section-subtitle", children: "আপনার ব্যক্তিগত এবং সদস্যপদ সংক্রান্ত তথ্য" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "profile-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "profile-group", children: [
            /* @__PURE__ */ jsx("h3", { className: "profile-group-title", children: "মৌলিক তথ্য" }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "নাম" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.name || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "সদস্য আইডি" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.somiti_user_id || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "ফোন নম্বর" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.phone || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "ইমেইল" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.email || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "ভূমিকা" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.role === "member" ? "সদস্য" : profileData.role || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "স্ট্যাটাস" }),
              /* @__PURE__ */ jsx("span", { className: `profile-status ${profileData.status === "active" ? "profile-status-active" : "profile-status-inactive"}`, children: profileData.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field profile-field-full", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "ঠিকানা" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value profile-value-address", children: profileData.address || "তথ্য নেই" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "profile-group", children: [
            /* @__PURE__ */ jsx("h3", { className: "profile-group-title", children: "শেয়ার তথ্য" }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "শেয়ার সংখ্যা" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.shareCount || "০" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "যোগদানের তারিখ" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.joiningDate || "তথ্য নেই" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "profile-group", children: [
            /* @__PURE__ */ jsx("h3", { className: "profile-group-title", children: "নমিনি তথ্য" }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "নমিনির নাম" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.nomineeName || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "নমিনির ফোন" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.nomineePhone || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "নমিনির সাথে সম্পর্ক" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.nomineeRelation || "তথ্য নেই" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "profile-group", children: [
            /* @__PURE__ */ jsx("h3", { className: "profile-group-title", children: "অ্যাকাউন্ট তথ্য" }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "ইউজার আইডি" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value profile-value-mono", children: profileData.somiti_user_id || "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "তৈরির তারিখ" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.createdAt && profileData.createdAt.toDate ? new Date(profileData.createdAt.toDate()).toLocaleDateString("bn-BD") : "তথ্য নেই" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "profile-field", children: [
              /* @__PURE__ */ jsx("label", { className: "profile-label", children: "সর্বশেষ আপডেট" }),
              /* @__PURE__ */ jsx("span", { className: "profile-value", children: profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString("bn-BD") : "তথ্য নেই" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "notifications" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "নোটিফিকেশন সেটিংস" }),
        /* @__PURE__ */ jsx("div", { className: "settings-list", children: notificationItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-item-text", children: [
            /* @__PURE__ */ jsx("h3", { className: "settings-item-title", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "settings-item-description", children: item.desc })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "settings-item-control", children: /* @__PURE__ */ jsxs("label", { className: "toggle-switch", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: notificationSettings[item.key],
                onChange: () => handleNotificationChange(item.key)
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "toggle-slider" })
          ] }) })
        ] }, item.key)) })
      ] }),
      activeTab === "system" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "সিস্টেম সেটিংস" }),
        /* @__PURE__ */ jsxs("div", { className: "settings-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-item-text", children: /* @__PURE__ */ jsx("h3", { className: "settings-item-title", children: "ভাষা" }) }),
            /* @__PURE__ */ jsx("div", { className: "settings-item-control", children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: "settings-dropdown",
                value: systemPreferences.language,
                onChange: (e) => handleSystemChange("language", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "bn", children: "বাংলা" }),
                  /* @__PURE__ */ jsx("option", { value: "en", children: "English" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-item-text", children: /* @__PURE__ */ jsx("h3", { className: "settings-item-title", children: "থিম" }) }),
            /* @__PURE__ */ jsx("div", { className: "settings-item-control", children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: "settings-dropdown",
                value: systemPreferences.theme,
                onChange: (e) => handleSystemChange("theme", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "light", children: "হালকা" }),
                  /* @__PURE__ */ jsx("option", { value: "dark", children: "গাঢ়" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-item-text", children: /* @__PURE__ */ jsx("h3", { className: "settings-item-title", children: "মুদ্রা" }) }),
            /* @__PURE__ */ jsx("div", { className: "settings-item-control", children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: "settings-dropdown",
                value: systemPreferences.currency,
                onChange: (e) => handleSystemChange("currency", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "BDT", children: "বাংলাদেশী টাকা (৳)" }),
                  /* @__PURE__ */ jsx("option", { value: "USD", children: "US Dollar ($)" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "settings-item", children: [
            /* @__PURE__ */ jsx("div", { className: "settings-item-text", children: /* @__PURE__ */ jsx("h3", { className: "settings-item-title", children: "তারিখ ফরম্যাট" }) }),
            /* @__PURE__ */ jsx("div", { className: "settings-item-control", children: /* @__PURE__ */ jsxs(
              "select",
              {
                className: "settings-dropdown",
                value: systemPreferences.dateFormat,
                onChange: (e) => handleSystemChange("dateFormat", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "dd/mm/yyyy", children: "DD/MM/YYYY" }),
                  /* @__PURE__ */ jsx("option", { value: "mm/dd/yyyy", children: "MM/DD/YYYY" }),
                  /* @__PURE__ */ jsx("option", { value: "yyyy-mm-dd", children: "YYYY-MM-DD" })
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ModeSwitcher, {}),
        /* @__PURE__ */ jsx("div", { className: "settings-footer", children: /* @__PURE__ */ jsxs("button", { onClick: saveChanges, className: "btn btn-primary", children: [
          /* @__PURE__ */ jsx(Save, { className: "btn-icon" }),
          "সেটিংস সংরক্ষণ করুন"
        ] }) })
      ] }),
      activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "settings-section", children: [
        /* @__PURE__ */ jsx("h2", { className: "settings-section-title", children: "লগইন ইতিহাস" }),
        loginHistoryError && /* @__PURE__ */ jsx("div", { className: "inline-error", children: /* @__PURE__ */ jsx("span", { children: loginHistoryError }) }),
        /* @__PURE__ */ jsx("div", { className: "history-list", children: loginHistory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "history-item", children: /* @__PURE__ */ jsx("div", { className: "history-meta-line", children: "কোনো ইতিহাস পাওয়া যায়নি বা সেশন নেই" }) }) : loginHistory.map((row, idx) => /* @__PURE__ */ jsxs("div", { className: "history-item", children: [
          /* @__PURE__ */ jsx("div", { className: "history-date", children: row.created_at?.toDate ? new Date(row.created_at.toDate()).toLocaleString("bn-BD") : row.created_at ? new Date(row.created_at).toLocaleString("bn-BD") : "" }),
          /* @__PURE__ */ jsxs("div", { className: "history-meta-line", children: [
            "ডিভাইস: ",
            row.meta?.ua || "অজানা"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "history-meta-line", children: [
            "আইপি: ",
            row.ip || "অজানা",
            " | ",
            row.meta?.country || "",
            row.meta?.city ? ", " + row.meta.city : ""
          ] })
        ] }, idx)) })
      ] }),
      saveStatus && /* @__PURE__ */ jsx("div", { className: `save-status ${saveStatus === "success" ? "success" : "error"}`, children: saveStatus === "success" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "status-icon" }),
        /* @__PURE__ */ jsx("span", { children: "সংরক্ষিত হয়েছে!" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Shield, { className: "status-icon" }),
        /* @__PURE__ */ jsx("span", { children: "ত্রুটি হয়েছে!" })
      ] }) })
    ] })
  ] }) });
};
const SecretRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("[SecretRoleSwitcher] subscribing to feedbacks");
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbackData = snapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data(),
        createdAt: doc2.data().createdAt?.toDate()
      }));
      setFeedbacks(feedbackData);
      setLoading(false);
    });
    return () => {
      console.log("[SecretRoleSwitcher] unsubscribe feedbacks");
      unsubscribe();
    };
  }, []);
  const handleDeleteFeedback = async (id) => {
    console.log("[SecretRoleSwitcher] delete feedback", id);
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      toast$1.success("Feedback deleted");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast$1.error("Failed to delete feedback");
    }
  };
  const handleRoleSwitch = (newRole) => {
    console.log("[SecretRoleSwitcher] switch role", newRole);
    ({
      name: `Debug ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`
    });
    localStorage.setItem("somiti_token", "debug-token");
    localStorage.setItem("somiti_uid", "debug-user");
    localStorage.setItem("somiti_role", newRole);
    alert(`Debug role activated: ${newRole}`);
    const roleRoutes = {
      admin: "/admin",
      cashier: "/cashier",
      member: "/member"
    };
    window.location.hash = `#${roleRoutes[newRole] || "/member"}`;
    window.location.reload();
  };
  const handleGoBack = () => {
    console.log("[SecretRoleSwitcher] go back");
    navigate(-1);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-100 flex flex-col lg:flex-row items-start justify-center p-4 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl p-6 w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-red-500" }),
          "Secret Role Switcher"
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleGoBack,
            className: "text-gray-500 hover:text-gray-700 flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 mb-4", children: [
          "Current Role: ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-600", children: user?.role })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-700", children: "Switch to:" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleRoleSwitch("admin"),
              className: "w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors",
              disabled: user?.role === "admin",
              children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-red-500" }),
                /* @__PURE__ */ jsx("span", { children: "Admin" }),
                user?.role === "admin" && /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-green-600", children: "Current" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleRoleSwitch("cashier"),
              className: "w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors",
              disabled: user?.role === "cashier",
              children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5 text-blue-500" }),
                /* @__PURE__ */ jsx("span", { children: "Cashier" }),
                user?.role === "cashier" && /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-green-600", children: "Current" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleRoleSwitch("member"),
              className: "w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors",
              disabled: user?.role === "member",
              children: [
                /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-green-500" }),
                /* @__PURE__ */ jsx("span", { children: "Member" }),
                user?.role === "member" && /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-green-600", children: "Current" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded", children: [
          /* @__PURE__ */ jsx("strong", { children: "Note:" }),
          " This is a debug tool for development testing. Role changes are temporary and will reset on page refresh."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-gray-400 text-center", children: "Access URL: /secret3278" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl p-4 w-full lg:max-w-2xl h-[70vh] lg:h-[80vh] flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4 border-b pb-4", children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MessageSquare, { className: "w-5 h-5 text-blue-500" }),
        "User Feedback",
        /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full", children: feedbacks.length })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-4 pr-1", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading feedback..." }) : feedbacks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300", children: "No feedback received yet" }) : feedbacks.map((feedback) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow relative group", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDeleteFeedback(feedback.id),
            className: "absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100",
            title: "Delete feedback",
            children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-gray-800 whitespace-pre-wrap mb-3 text-sm", children: feedback.message }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
            feedback.createdAt?.toLocaleString() || "Unknown date"
          ] }),
          feedback.page && /* @__PURE__ */ jsx("div", { className: "px-2 py-0.5 bg-gray-200 rounded text-[10px] font-mono truncate max-w-[150px]", children: feedback.page })
        ] })
      ] }, feedback.id)) })
    ] })
  ] });
};
console.log("[UnifiedMembersFinanceCardPage] file loaded");
const monthLabelsBn = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর"
];
const toDateSafe$1 = (val) => {
  try {
    if (!val) return void 0;
    if (typeof val?.toDate === "function") return val.toDate();
    if (typeof val === "string") return new Date(val);
    if (val?.seconds) return new Date(val.seconds * 1e3);
    return new Date(val);
  } catch (e) {
    console.warn("[UnifiedMembersFinanceCardPage] toDateSafe failed", e);
    return void 0;
  }
};
const UnifiedMembersFinanceCardPage = () => {
  console.log("[UnifiedMembersFinanceCardPage] render start");
  const { isDemo } = useMode();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(void 0);
  const nowYear = useMemo(() => (/* @__PURE__ */ new Date()).getFullYear(), []);
  const nowMonth = useMemo(() => (/* @__PURE__ */ new Date()).getMonth(), []);
  useEffect(() => {
    console.log("[UnifiedMembersFinanceCardPage] subscribing to members and transactions");
    if (isDemo()) {
      console.log("[UnifiedMembersFinanceCardPage] Using demo data");
      setMembers(demoMembers);
      setTransactions(demoTransactions.map((t) => ({
        ...t,
        memberId: t.memberId || t.userId,
        date: new Date(t.date),
        month: new Date(t.date).getMonth()
      })));
      setLoading(false);
      return;
    }
    const unsubMembers = onSnapshot(collection(db, "members"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("[UnifiedMembersFinanceCardPage] members updated", list.length);
      setMembers(list);
    }, (err) => {
      console.error("[UnifiedMembersFinanceCardPage] members snapshot error", err);
    });
    const unsubTx = onSnapshot(collection(db, "transactions"), (snap) => {
      const tx = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("[UnifiedMembersFinanceCardPage] transactions updated", tx.length);
      setTransactions(tx);
      setLoading(false);
    }, (err) => {
      console.error("[UnifiedMembersFinanceCardPage] transactions snapshot error", err);
      setLoading(false);
    });
    return () => {
      console.log("[UnifiedMembersFinanceCardPage] unsubscribing");
      unsubMembers && unsubMembers();
      unsubTx && unsubTx();
    };
  }, [isDemo]);
  const availableYears = useMemo(() => {
    const years = /* @__PURE__ */ new Set();
    transactions.forEach((t) => {
      const d = toDateSafe$1(t.date) || toDateSafe$1(t.createdAt);
      const y = d?.getFullYear?.();
      if (typeof y === "number") years.add(y);
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    console.log("[UnifiedMembersFinanceCardPage] availableYears", arr);
    return arr;
  }, [transactions]);
  useEffect(() => {
    const current = (/* @__PURE__ */ new Date()).getFullYear();
    if (!selectedYear) {
      const def = availableYears.includes(current) ? current : availableYears[0];
      if (def) {
        setSelectedYear(def);
        console.log("[UnifiedMembersFinanceCardPage] default selectedYear", def);
      }
    } else {
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
        setSelectedYear(availableYears[0]);
        console.log("[UnifiedMembersFinanceCardPage] adjusted selectedYear", availableYears[0]);
      }
    }
  }, [availableYears, selectedYear]);
  const aggregation = useMemo(() => {
    const byMember = /* @__PURE__ */ new Map();
    transactions.forEach((t) => {
      const memberId = t.memberId || t.userId || t.uid;
      if (!memberId) return;
      const dateObj = toDateSafe$1(t.date) || toDateSafe$1(t.createdAt);
      const yearInt = dateObj?.getFullYear?.();
      let monthInt = typeof t.month === "number" ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== "number" || typeof monthInt !== "number") return;
      if (typeof selectedYear === "number" && yearInt !== selectedYear) return;
      const amount = Number(t.amount) || 0;
      if (!byMember.has(memberId)) {
        byMember.set(memberId, { monthlyTotals: Array(12).fill(0), totalPaid: 0 });
      }
      const agg = byMember.get(memberId);
      agg.monthlyTotals[monthInt] += amount;
      agg.totalPaid += amount;
    });
    console.log("[UnifiedMembersFinanceCardPage] aggregation built", byMember.size);
    return byMember;
  }, [transactions, selectedYear]);
  const overall = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    let totalPaid = 0;
    let totalDue = 0;
    transactions.forEach((t) => {
      const dateObj = toDateSafe$1(t.date) || toDateSafe$1(t.createdAt);
      const yearInt = dateObj?.getFullYear?.();
      let monthInt = typeof t.month === "number" ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== "number" || typeof monthInt !== "number") return;
      if (typeof selectedYear === "number" && yearInt !== selectedYear) return;
      const amount = Number(t.amount) || 0;
      monthlyTotals[monthInt] += amount;
      totalPaid += amount;
    });
    members.forEach((member) => {
      const memberUid = member.user_id || member.id || member.membershipId || member.memberId;
      const agg = aggregation.get(memberUid) || { totalPaid: 0 };
      const shareCount = Number(member.shareCount) || 0;
      const monthlyRate = shareCount * 500;
      const joinRaw = member.joiningDate ?? member.joinDate ?? member.createdAt;
      const joinDate = toDateSafe$1(joinRaw) || new Date(selectedYear || (/* @__PURE__ */ new Date()).getFullYear(), 0, 1);
      const joinYear = joinDate?.getFullYear?.();
      const joinMonth = joinDate?.getMonth?.();
      let monthsDueCount = 0;
      if (typeof selectedYear === "number" && typeof joinYear === "number") {
        if (selectedYear < nowYear) {
          if (joinYear < selectedYear) monthsDueCount = 12;
          else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = 12 - joinMonth;
        } else if (selectedYear === nowYear) {
          if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
          else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = Math.max(0, nowMonth - joinMonth + 1);
        } else {
          monthsDueCount = 0;
        }
      }
      const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
      let bonusDue = 0;
      if (selectedYear === joinYear) {
        const joinMonthEligible = selectedYear < nowYear || selectedYear === nowYear && typeof joinMonth === "number" && joinMonth <= nowMonth;
        if (joinMonthEligible) {
          bonusDue = monthlyRate;
        }
      }
      const memberDue = plannedDue + bonusDue - (agg.totalPaid || 0);
      totalDue += Math.max(0, memberDue);
    });
    console.log("[UnifiedMembersFinanceCardPage] overall summary", { totalMembers: members.length, totalPaid, totalDue });
    return { monthlyTotals, totalPaid, totalDue, totalMembers: members.length };
  }, [transactions, selectedYear, members, aggregation]);
  const sortedMembers = useMemo(() => {
    const sorted = [...members].sort((a, b) => {
      const aDate = toDateSafe$1(a.createdAt) || /* @__PURE__ */ new Date(0);
      const bDate = toDateSafe$1(b.createdAt) || /* @__PURE__ */ new Date(0);
      if (aDate.getTime() !== bDate.getTime()) return aDate - bDate;
      return (a.id || "").localeCompare(b.id || "");
    });
    console.log("[UnifiedMembersFinanceCardPage] sortedMembers built", { count: sorted.length });
    return sorted;
  }, [members]);
  const serialMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    sortedMembers.forEach((m, idx) => map.set(m.id, idx + 1));
    console.log("[UnifiedMembersFinanceCardPage] serialMap built", { size: map.size });
    return map;
  }, [sortedMembers]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "unified-finance-card", children: /* @__PURE__ */ jsx("div", { className: "unified-finance-card__container", children: /* @__PURE__ */ jsx("div", { className: "unified-finance-card__loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) }) });
  }
  console.log("[UnifiedMembersFinanceCardPage] render table", { members: members.length });
  return /* @__PURE__ */ jsx("div", { className: "unified-finance-card", children: /* @__PURE__ */ jsxs("div", { className: "unified-finance-card__container", children: [
    /* @__PURE__ */ jsxs("div", { className: "unified-finance-card__header", children: [
      /* @__PURE__ */ jsx("h1", { className: "unified-finance-card__title", children: "একীভূত আর্থিক ওভারভিউ" }),
      /* @__PURE__ */ jsx("p", { className: "unified-finance-card__subtitle", children: "সমস্ত সদস্যের মাসভিত্তিক জমা" }),
      /* @__PURE__ */ jsxs("div", { className: "year-switcher", children: [
        /* @__PURE__ */ jsx("span", { className: "year-label", children: "বছর" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: "year-select",
            value: selectedYear ?? "",
            onChange: (e) => {
              const next = parseInt(e.target.value, 10);
              setSelectedYear(next);
              console.log("[UnifiedMembersFinanceCardPage] year selected", next);
            },
            children: availableYears.map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overall-summary", children: [
        /* @__PURE__ */ jsxs("div", { className: "summary-item", children: [
          /* @__PURE__ */ jsx("span", { className: "summary-label", children: "মোট সদস্য" }),
          /* @__PURE__ */ jsx("span", { className: "summary-value", children: overall.totalMembers })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "summary-item", children: [
          /* @__PURE__ */ jsx("span", { className: "summary-label", children: "মোট জমা" }),
          /* @__PURE__ */ jsxs("span", { className: "summary-value summary-value-paid", children: [
            "৳ ",
            Math.max(0, overall.totalPaid).toLocaleString("bn-BD")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "summary-item", children: [
          /* @__PURE__ */ jsx("span", { className: "summary-label", children: "মোট বকেয়া" }),
          /* @__PURE__ */ jsxs("span", { className: "summary-value summary-value-due", children: [
            "৳ ",
            Math.max(0, overall.totalDue).toLocaleString("bn-BD")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "unified-finance-card__table-wrapper", children: /* @__PURE__ */ jsxs("table", { className: "unified-finance-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "সদস্য ID" }),
        /* @__PURE__ */ jsx("th", { children: "সদস্য নাম" }),
        /* @__PURE__ */ jsx("th", { children: "শেয়ার" }),
        monthLabelsBn.map((m, idx) => /* @__PURE__ */ jsx("th", { children: m }, idx)),
        /* @__PURE__ */ jsx("th", { children: "মোট জমা" }),
        /* @__PURE__ */ jsx("th", { children: "মোট বকেয়া" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: sortedMembers.map((member) => {
        const memberUid = member.user_id || member.id || member.membershipId || member.memberId;
        const name = member.name || "অজানা";
        const shareCount = Number(member.shareCount) || 0;
        const monthlyRate = shareCount * 500;
        const agg = aggregation.get(memberUid) || { monthlyTotals: Array(12).fill(0), totalPaid: 0 };
        const totalPaid = agg.totalPaid || 0;
        const joinRaw = member.joiningDate ?? member.joinDate ?? member.createdAt;
        const joinDate = toDateSafe$1(joinRaw) || new Date(selectedYear || (/* @__PURE__ */ new Date()).getFullYear(), 0, 1);
        const joinYear = joinDate?.getFullYear?.();
        const joinMonth = joinDate?.getMonth?.();
        let monthsDueCount = 0;
        if (typeof selectedYear === "number" && typeof joinYear === "number") {
          if (selectedYear < nowYear) {
            if (joinYear < selectedYear) monthsDueCount = 12;
            else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = 12 - joinMonth;
          } else if (selectedYear === nowYear) {
            if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
            else if (joinYear === selectedYear && typeof joinMonth === "number") monthsDueCount = Math.max(0, nowMonth - joinMonth + 1);
          } else {
            monthsDueCount = 0;
          }
        }
        const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
        let bonusDue = 0;
        if (selectedYear === joinYear) {
          const joinMonthEligible = selectedYear < nowYear || selectedYear === nowYear && typeof joinMonth === "number" && joinMonth <= nowMonth;
          if (joinMonthEligible) {
            bonusDue = monthlyRate;
          }
        }
        const totalDue = plannedDue + bonusDue - totalPaid;
        console.log("[UnifiedMembersFinanceCardPage] row due calc", { memberUid, shareCount, monthlyRate, monthsDueCount, plannedDue, bonusDue, totalPaid, totalDue });
        const joinKey = (joinDate?.getFullYear?.() ?? (selectedYear || 0)) * 12 + (joinDate?.getMonth?.() ?? 0);
        console.log("[UnifiedMembersFinanceCardPage] row join info", { memberUid, joinDate: joinDate?.toISOString?.() || joinDate });
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "cell-id", children: serialMap.get(member.id) || "-" }),
          /* @__PURE__ */ jsx("td", { className: "cell-name", children: name }),
          /* @__PURE__ */ jsx("td", { className: "cell-share", children: shareCount }),
          agg.monthlyTotals.map((amt, idx) => {
            const cellKey = (selectedYear || (/* @__PURE__ */ new Date()).getFullYear()) * 12 + idx;
            const isBeforeJoin = cellKey < joinKey;
            const isFutureMonth = typeof selectedYear === "number" && (selectedYear > nowYear || selectedYear === nowYear && idx > nowMonth);
            return /* @__PURE__ */ jsx("td", { className: "cell-month", children: isBeforeJoin ? "" : isFutureMonth ? /* @__PURE__ */ jsx("span", { className: "dash-cell", children: "-" }) : amt > 0 ? /* @__PURE__ */ jsxs("span", { className: "amount-cell", children: [
              "৳ ",
              amt.toLocaleString("bn-BD")
            ] }) : /* @__PURE__ */ jsx("span", { className: "zero-cell", children: "৳ 0" }) }, idx);
          }),
          /* @__PURE__ */ jsxs("td", { className: "cell-total-paid", children: [
            "৳ ",
            totalPaid.toLocaleString("bn-BD")
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "cell-total-due", children: [
            "৳ ",
            Math.max(0, totalDue).toLocaleString("bn-BD")
          ] })
        ] }, memberUid || member.id);
      }) })
    ] }) })
  ] }) });
};
console.log("[MemberTablePage] file loaded");
const toDateSafe = (val) => {
  try {
    if (!val) return void 0;
    if (typeof val?.toDate === "function") return val.toDate();
    if (typeof val === "string") return new Date(val);
    if (val?.seconds) return new Date(val.seconds * 1e3);
    return new Date(val);
  } catch (e) {
    console.warn("[MemberTablePage] toDateSafe failed", e);
    return void 0;
  }
};
const MemberTablePage = () => {
  console.log("[MemberTablePage] render start");
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        if (!currentUser) {
          console.log("[MemberTablePage] no currentUser yet, waiting");
          setTransactions([]);
          return;
        }
        const effectiveId = currentUser?.uid || currentUser?.id;
        console.log("[MemberTablePage] fetching transactions for user", { effectiveId });
        let txs = [];
        const res = await TransactionService.getTransactionsByUserId(effectiveId);
        if (res.success) {
          txs = res.data || [];
          console.log("[MemberTablePage] getTransactionsByUserId result", { count: txs.length });
        } else {
          console.error("[MemberTablePage] getTransactionsByUserId error", res.error);
        }
        if (!txs.length) {
          console.log("[MemberTablePage] fallback: filtering all transactions by member id variants");
          const all = await TransactionService.getAllTransactions();
          if (all.success) {
            const allTx = all.data || [];
            txs = allTx.filter((t) => {
              const linkId = t.userId || t.memberId || t.uid || t.member_id || t.user_id;
              return linkId === effectiveId;
            });
            console.log("[MemberTablePage] fallback filtered transactions", { count: txs.length });
          } else {
            console.error("[MemberTablePage] getAllTransactions error", all.error);
          }
        }
        const sorted = [...txs].sort((a, b) => {
          const aDate = toDateSafe(a.createdAt) || toDateSafe(a.date) || /* @__PURE__ */ new Date(0);
          const bDate = toDateSafe(b.createdAt) || toDateSafe(b.date) || /* @__PURE__ */ new Date(0);
          return bDate - aDate;
        }).map((t, idx) => ({ ...t, serial: idx + 1 }));
        console.log("[MemberTablePage] transactions loaded", sorted.length);
        setTransactions(sorted);
      } catch (e) {
        console.error("[MemberTablePage] loadTransactions error", e);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [currentUser]);
  const formatDate = (val) => {
    const d = toDateSafe(val);
    return d ? d.toLocaleDateString("bn-BD") : "";
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "member-table", children: /* @__PURE__ */ jsx("div", { className: "member-table__container", children: /* @__PURE__ */ jsx("div", { className: "member-table__loading", children: /* @__PURE__ */ jsx(LoadingAnimation, {}) }) }) });
  }
  console.log("[MemberTablePage] render table", { count: transactions.length });
  const TYPE_META = {
    monthly_deposit: { label: "মাসিক জমা", tone: "pos" },
    share_purchase: { label: "শেয়ার ক্রয়", tone: "pos" },
    loan_repayment: { label: "ঋণ পরিশোধ", tone: "pos" },
    penalty: { label: "জরিমানা", tone: "pos" },
    donation: { label: "দান", tone: "pos" },
    loan_disbursement: { label: "ঋণ বিতরণ", tone: "neg" },
    profit_distribution: { label: "লাভ বণ্টন", tone: "neg" },
    expense: { label: "খরচ", tone: "neg" },
    subscription: { label: "সাবস্ক্রিপশন", tone: "pos" },
    withdrawal: { label: "উত্তোলন", tone: "neg" }
  };
  const formatType = (val) => {
    const key = (val || "").toLowerCase();
    const meta = TYPE_META[key] || { label: val || "অন্যান্য", tone: "neu" };
    return meta;
  };
  return /* @__PURE__ */ jsx("div", { className: "member-table", children: /* @__PURE__ */ jsxs("div", { className: "member-table__container", children: [
    /* @__PURE__ */ jsxs("div", { className: "member-table__header", children: [
      /* @__PURE__ */ jsx("h1", { className: "member-table__title", children: "আমার লেনদেনের তালিকা" }),
      /* @__PURE__ */ jsx("p", { className: "member-table__subtitle", children: "সাম্প্রতিক লেনদেন, পেমেন্ট পদ্ধতি ও অবস্থা" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "member-table__wrapper", children: /* @__PURE__ */ jsxs("table", { className: "member-table__table member-table__table--rich", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "সিরিয়াল" }),
        /* @__PURE__ */ jsx("th", { children: "টাইপ" }),
        /* @__PURE__ */ jsx("th", { children: "টাকার পরিমাণ" }),
        /* @__PURE__ */ jsx("th", { children: "পেমেন্ট পদ্ধতি" }),
        /* @__PURE__ */ jsx("th", { children: "রেফারেন্স" }),
        /* @__PURE__ */ jsx("th", { children: "তারিখ" }),
        /* @__PURE__ */ jsx("th", { children: "অবস্থা" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: transactions.map((t) => {
        const { label, tone } = formatType(t.transactionType || t.type);
        const amount = Number(t.amount) || 0;
        const method = t.paymentMethod || t.method || "";
        const reference = t.paymentReference || t.reference || "";
        const created = t.createdAt || t.date;
        const status = t.status || "completed";
        const amountClass = tone === "pos" ? "amount-positive" : tone === "neg" ? "amount-negative" : "amount-neutral";
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "cell-serial", children: t.serial }),
          /* @__PURE__ */ jsx("td", { className: "cell-type", children: /* @__PURE__ */ jsx("span", { className: `badge badge--type badge--${tone}`, children: label }) }),
          /* @__PURE__ */ jsx("td", { className: `cell-amount ${amountClass}`, children: amount.toLocaleString("bn-BD") }),
          /* @__PURE__ */ jsx("td", { className: "cell-method", children: /* @__PURE__ */ jsx("span", { className: "badge badge--method", children: method || "—" }) }),
          /* @__PURE__ */ jsx("td", { className: "cell-ref", children: reference || "—" }),
          /* @__PURE__ */ jsx("td", { className: "cell-date", children: formatDate(created) }),
          /* @__PURE__ */ jsx("td", { className: "cell-status", children: /* @__PURE__ */ jsx("span", { className: `badge badge--status status--${status}`, children: status }) })
        ] }, t.id);
      }) })
    ] }) })
  ] }) });
};
const New = () => {
  const [members, setMembers] = useState([]);
  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
    return initials || "M";
  };
  const buildPlaceholderAvatar = (name, size = 128) => {
    const initials = getInitials(name);
    const bg = "#e2e8f0";
    const text = "#1e293b";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="clip">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g clip-path="url(#clip)">
    <rect width="${size}" height="${size}" fill="${bg}"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(size * 0.4)}" font-weight="700" fill="${text}">${initials}</text>
</svg>`;
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return dataUrl;
  };
  useEffect(() => {
    console.log("[New] page mounted");
    const loadMembers = async () => {
      try {
        const res = await MemberService.getActiveMembers();
        if (res.success) {
          console.log("[New] loaded members", { count: res.data.length });
          setMembers(res.data);
        } else {
          console.error("[New] load members failed", res.error);
        }
      } catch (err) {
        console.error("[New] load members error", err);
      }
    };
    loadMembers();
  }, []);
  const images = members.map((m) => ({
    id: m.id,
    src: m.photoURL || m.avatar || buildPlaceholderAvatar(m.name),
    alt: m.name || m.membershipId || "Member",
    title: m.name,
    description: m.membershipId ? `ID: ${m.membershipId}` : void 0
  }));
  useEffect(() => {
    console.log("[New] images prepared", { count: images.length });
  }, [images.length]);
  return /* @__PURE__ */ jsxs("div", { className: "w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-primary-600", children: "New Components" }),
    /* @__PURE__ */ jsx(
      SphereImageGrid,
      {
        images,
        containerSize: 420,
        sphereRadius: 180,
        autoRotate: true
      }
    )
  ] });
};
const ModeSelector = () => {
  const { user, logout } = useAuth();
  const { switchMode } = useMode();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    sessionStorage.setItem("hasSeenModeSelector", "true");
    if (mode === "demo") {
      const roles = ["admin", "cashier", "member"];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      localStorage.setItem("somiti_token", "demo-token");
      localStorage.setItem("somiti_uid", "demo-user");
      localStorage.setItem("somiti_role", randomRole);
      switchMode("demo");
      console.log("[ModeSelector] Demo mode selected, reloading to initialize demo user");
      setTimeout(() => {
        window.location.href = `/#/${randomRole}`;
        window.location.reload();
      }, 300);
    } else {
      console.log("[ModeSelector] Production mode selected, performing logout");
      logout();
      switchMode("production");
      localStorage.removeItem("somiti_token");
      localStorage.removeItem("somiti_uid");
      localStorage.removeItem("somiti_role");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    }
  };
  const modes = [
    {
      id: "production",
      title: "প্রোডাকশন মোড",
      subtitle: "Production Mode",
      description: "আসল ডেটা এবং সম্পূর্ণ কার্যকারিতা সহ লগইন করুন",
      features: [
        "আসল সদস্য এবং লেনদেন",
        "Firebase ডেটাবেস সংযোগ",
        "সম্পূর্ণ সুরক্ষা এবং অনুমতি"
      ],
      icon: Database,
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      id: "demo",
      title: "ডেমো মোড",
      subtitle: "Demo Mode",
      description: "লগইন ছাড়াই নমুনা ডেটা দিয়ে অ্যাপ্লিকেশন পরীক্ষা করুন",
      features: [
        "নমুনা সদস্য এবং লেনদেন",
        "কোনো লগইনের প্রয়োজন নেই",
        "নিরাপদ পরীক্ষা পরিবেশ"
      ],
      icon: TestTube,
      color: "#10b981",
      bgColor: "#f0fdf4"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "mode-selector-container", children: [
    /* @__PURE__ */ jsx(
      Meta,
      {
        title: "মোড নির্বাচন - ফুলমুড়ী যুব ফাউন্ডেশন",
        description: "প্রোডাকশন বা ডেমো মোড নির্বাচন করুন"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mode-selector-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "mode-selector-header", children: [
        /* @__PURE__ */ jsx("h1", { className: "mode-selector-title", children: "মোড নির্বাচন করুন" }),
        /* @__PURE__ */ jsx("p", { className: "mode-selector-subtitle", children: "আপনি কীভাবে অ্যাপ্লিকেশন ব্যবহার করতে চান?" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mode-cards-container", children: modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mode-card ${isSelected ? "selected" : ""}`,
            onClick: () => handleModeSelect(mode.id),
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mode-icon-wrapper",
                  style: { backgroundColor: mode.bgColor },
                  children: /* @__PURE__ */ jsx(
                    Icon,
                    {
                      size: 32,
                      strokeWidth: 2,
                      style: { color: mode.color }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mode-content", children: [
                /* @__PURE__ */ jsx("h2", { className: "mode-title", children: mode.title }),
                /* @__PURE__ */ jsx("p", { className: "mode-subtitle-en", children: mode.subtitle }),
                /* @__PURE__ */ jsx("p", { className: "mode-description", children: mode.description }),
                /* @__PURE__ */ jsx("ul", { className: "mode-features", children: mode.features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "mode-feature", children: [
                  /* @__PURE__ */ jsx(Check, { size: 16, style: { color: mode.color } }),
                  /* @__PURE__ */ jsx("span", { children: feature })
                ] }, index)) })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "mode-select-btn",
                  style: {
                    backgroundColor: mode.color,
                    color: "white"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: "নির্বাচন করুন" }),
                    /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
                  ]
                }
              ),
              isSelected && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "selection-checkmark",
                  style: { backgroundColor: mode.color },
                  children: /* @__PURE__ */ jsx(Check, { size: 16, color: "white", strokeWidth: 3 })
                }
              )
            ]
          },
          mode.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mode-selector-footer", children: /* @__PURE__ */ jsx("p", { children: "আপনি যেকোনো সময় সেটিংস থেকে মোড পরিবর্তন করতে পারবেন" }) })
    ] })
  ] });
};
const AppRoutes = ({ helmetContext = {} }) => {
  return /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(ModeProvider, { children: /* @__PURE__ */ jsx(UserProvider, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/secret3278", element: /* @__PURE__ */ jsx(SecretRoleSwitcher, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/new", element: /* @__PURE__ */ jsx(New, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(LandingPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/mode-selector", element: /* @__PURE__ */ jsx(ModeSelector, {}) }),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: "/*",
        element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(MainApp, {}) })
      }
    )
  ] }) }) }) }) });
};
const MainApp = () => {
  const { user } = useAuth();
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Navigate, { to: user ? `/${user.role}` : "/", replace: true }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(AdminDashboard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/members", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(MemberList, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/treasury", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(Treasury, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/notice-board", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(NoticeBoard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(AdminSettings, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/investments", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(InvestmentManagement, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/profit-distribution", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(ProfitDistribution, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/admin/share-tracking", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsx(ShareTracking, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/add-transaction", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin", "cashier"], children: /* @__PURE__ */ jsx(AddTransactionPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(CashierDashboard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/transactions", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(Transactions, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/treasury", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(Treasury, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/add-transaction", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(AddTransactionPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/members", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(MemberList, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(CashierSettings, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/cashier/unified-finance", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["cashier"], children: /* @__PURE__ */ jsx(UnifiedMembersFinanceCardPage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(MemberDashboard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/financial-summary", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(FinancialSummary, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/table", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(MemberTablePage, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/notice-board", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin"], children: /* @__PURE__ */ jsx(NoticeBoard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/members", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(MemberList, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/profile", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(ProfileSettings, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/member/settings", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["member", "admin", "cashier"], children: /* @__PURE__ */ jsx(MemberSettings, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/new", element: /* @__PURE__ */ jsx(ProtectedRoute, { allowedRoles: ["admin", "cashier", "member"], children: /* @__PURE__ */ jsx(New, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
  ] }) });
};
async function prerender(url) {
  const helmetContext = {};
  const { prelude } = await prerender$1(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(AppRoutes, { helmetContext }) }) })
  );
  return { prelude, helmet: helmetContext.helmet };
}
export {
  prerender
};
