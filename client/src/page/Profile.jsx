import React, { useState, useRef } from "react";
import {
  Camera,
  LogOut,
  ShieldAlert,
  Trash2,
  User,
  Monitor,
  Shield,
  Check,
  AlertTriangle,
} from "lucide-react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "kkdw",
    email: "khank11111999@gmail.com",
    avatar: null,
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [saveStatus, setSaveStatus] = useState("");
  const fileInputRef = useRef(null);
  const { logout, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const triggerSaveAnimation = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 800);
  };
  const handleSingleSessionLogout = () => {
    logout();
    if (isAuthenticated === false) navigate("/login");
  };

  return (
   
    <div
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        paddingLeft: "40px",
        paddingRight: "40px",
        boxSizing: "border-box",
      }}
      className="bg-[#F9F9FB] min-h-screen animate-in fade-in duration-200 text-left pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start w-full pt-8">
        <div className="md:col-span-1 space-y-6 text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-[#0F0F14]">
              Settings
            </h1>
            <p className="text-xs text-[#82828A] leading-relaxed">
              Manage your personal account profile, active logins, and data
              security.
            </p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "profile", label: "My Profile", icon: User },
              { id: "security", label: "Device Sessions", icon: Shield },
              {
                id: "danger",
                label: "Account Management",
                icon: AlertTriangle,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSection(tab.id);
                    document
                      .getElementById(tab.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeSection === tab.id
                      ? "bg-white text-[#3B30EC] shadow-xs border border-[#E2E2E9]"
                      : "text-[#62626A] hover:text-[#0F0F14] hover:bg-[#E8E8EF]/60"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6 w-full">
          <section
            id="profile"
            className="bg-white border border-[#E2E2E9] rounded-2xl shadow-xs transition-all hover:shadow-sm overflow-hidden text-left w-full"
          >
            <div className="p-6 border-b border-[#F4F4F7] bg-[#FDFDFD]">
              <h3 className="text-sm font-bold text-[#0F0F14]">My Profile</h3>
              <p className="text-[11px] text-[#82828A] mt-0.5">
                Update your visual presence and identity handles across the
                workspace.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="relative group cursor-pointer w-20 h-20 rounded-2xl bg-[#F4F4F7] border-2 border-dashed border-[#C4C4D0] hover:border-[#3B30EC] overflow-hidden flex items-center justify-center text-[#82828A] transition-all shrink-0 shadow-xs"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-xl font-black font-mono text-[#3B30EC]">
                      {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "M"}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-[#0F0F14]/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera size={14} className="animate-pulse" />
                    <span className="text-[9px] font-bold mt-1 tracking-wider uppercase font-mono">
                      Change
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 w-full grid grid-cols-1 gap-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-[#62626A] uppercase tracking-wider mb-1.5">
                      Profile Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full bg-[#F4F4F7] border border-[#E2E2E9] focus:border-[#3B30EC] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#0F0F14] outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-bold text-[#62626A] uppercase tracking-wider">
                        Email Address
                      </label>
                      <span className="text-[9px] bg-[#E8E8EF] px-1.5 py-0.5 rounded-md text-[#62626A] font-mono font-bold">
                        Read Only
                      </span>
                    </div>
                    <div className="w-full bg-[#F0F0F5]/70 border border-[#E2E2E9] rounded-xl px-3.5 py-2.5 text-xs text-[#82828A] cursor-not-allowed flex items-center justify-between font-mono">
                      <span>{profile.email}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#82828A]/40"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#F4F4F7]">
                <button
                  onClick={triggerSaveAnimation}
                  disabled={saveStatus !== ""}
                  className="bg-[#3B30EC] hover:bg-[#2A20DF] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {saveStatus === "saving" && (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  )}
                  {saveStatus === "saved" && (
                    <Check size={12} className="text-emerald-400" />
                  )}
                  {saveStatus === "" && "Save Changes"}
                  {saveStatus === "saving" && "Saving Changes..."}
                  {saveStatus === "saved" && "Changes Saved"}
                </button>
              </div>
            </div>
          </section>

          <section
            id="security"
            className="bg-white border border-[#E2E2E9] rounded-2xl shadow-xs transition-all hover:shadow-sm text-left w-full"
          >
            <div className="p-6 border-b border-[#F4F4F7] bg-[#FDFDFD]">
              <h3 className="text-sm font-bold text-[#0F0F14]">
                Device Sessions
              </h3>
              <p className="text-[11px] text-[#82828A] mt-0.5">
                View where you are logged in and log out safely if needed.
              </p>
            </div>

            <div className="p-6 space-y-4 w-full">
              <div className="bg-[#F4F4F7] rounded-xl p-4 border border-[#E2E2E9] flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg text-[#3B30EC] border border-[#E2E2E9]">
                    <Monitor size={14} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#0F0F14]">
                      Current Device
                    </p>
                    <p className="text-[10px] font-mono text-[#82828A] mt-0.5">
                      Chrome Browser • Linux Platform (Active Now)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSingleSessionLogout}
                  className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 border border-[#E2E2E9] hover:border-red-200 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  <LogOut size={12} /> Log out from this device
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F4F4F7] w-full">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-bold text-[#0F0F14]">
                    Other Logged-in Devices
                  </p>
                  <p className="text-[11px] text-[#82828A]">
                    Log out from all extra active sessions on mobile apps or
                    other computers.
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/70 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0">
                  <ShieldAlert size={14} /> Log out from all other devices
                </button>
              </div>
            </div>
          </section>

          <section
            id="danger"
            className="bg-[#FFF8F8] border border-red-200/60 rounded-2xl shadow-xs overflow-hidden text-left w-full"
          >
            <div className="p-6 border-b border-red-100/60 bg-gradient-to-r from-red-50/50 to-transparent">
              <h3 className="text-sm font-bold text-red-800">
                Account Management
              </h3>
              <p className="text-[11px] text-red-700/70 mt-0.5">
                Temporarily pause your workspace profile or delete it
                permanently.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button className="flex flex-col items-start justify-between bg-white hover:bg-amber-50/30 border border-amber-200 p-5 rounded-xl transition-all group text-left w-full shadow-xs">
                <div className="text-amber-600 bg-amber-50 p-2 rounded-lg group-hover:scale-105 transition-transform mb-4">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F0F14]">
                    Disable Account
                  </h4>
                  <p className="text-[10px] text-[#82828A] mt-1 leading-relaxed">
                    Temporarily hide your profile. You can re-enable and log
                    back in anytime without losing your files.
                  </p>
                </div>
              </button>

              <button className="flex flex-col items-start justify-between bg-red-600 hover:bg-red-700 p-5 rounded-xl transition-all group text-left text-white shadow-md shadow-red-600/5 w-full">
                <div className="bg-white/15 p-2 rounded-lg group-hover:scale-105 transition-transform mb-4">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Delete Account</h4>
                  <p className="text-[10px] text-white/80 mt-1 leading-relaxed">
                    Permanently delete your account profile along with all saved
                    data. This process cannot be undone.
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
