// components/UserMenu.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfileIfNeeded } from "@/store/slices/profileSlice";
import { getAvatarUrl, fetchMediaBlob } from "@/lib/api/authService";
import SignOutDialog from "./SignOutDialog";
import toast from "react-hot-toast";

interface UserMenuProps {
  onMobileMenuClose?: () => void;
}

export default function UserMenu({ onMobileMenuClose }: UserMenuProps = {}) {
  const dispatch = useAppDispatch();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile.profileData);
  const avatarUploading = useAppSelector((state) => state.profile.avatarUploading);
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [serverAvatarBlobUrl, setServerAvatarBlobUrl] = useState<string | null>(null);
  const [serverAvatarFetchFailed, setServerAvatarFetchFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Ensure profile is in store when user is logged in (single API call, no duplicate fetch)
  useEffect(() => {
    if (user?.id) dispatch(fetchProfileIfNeeded());
  }, [user?.id, dispatch]);

  // Avatar: prefer profile store (header shows profile image; profile page updates this first)
  const avatarFromProfile = profile?.avatar ?? (profile as { media?: string })?.media;
  const avatarFromUser = user?.avatar ?? (user as { media?: string })?.media;
  const mediaId = avatarFromProfile ?? avatarFromUser;
  const isServerMediaId =
    mediaId &&
    !mediaId.startsWith("data:") &&
    !mediaId.startsWith("blob:") &&
    !mediaId.startsWith("http");
  useEffect(() => {
    const id = isServerMediaId ? (mediaId as string) : null;
    if (!id) {
      setServerAvatarBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setServerAvatarFetchFailed(false);
      return;
    }
    setServerAvatarFetchFailed(false);
    let revoked = false;
    fetchMediaBlob(id)
      .then((blob) => {
        if (revoked) return;
        const url = URL.createObjectURL(blob);
        setServerAvatarBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      })
      .catch(() => {
        if (!revoked) {
          setServerAvatarBlobUrl(null);
          setServerAvatarFetchFailed(true);
        }
      });
    return () => {
      revoked = true;
      setServerAvatarBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId ?? ""]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const firstName =
    profile?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";
  const fullName =
    profile?.firstName ||
    user?.name ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    user.email;
  const email = profile?.email || user.email;

  // Generate avatar initials
  const getInitials = () => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleSignOut = () => {
    setShowSignOutDialog(true);
    setIsOpen(false);
  };

  const confirmSignOut = () => {
    signOut();
    setShowSignOutDialog(false);
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
    toast.success("Signed out successfully");
  };

  const handleBookingClick = () => {
    setIsOpen(false);
    router.push("/bookings");
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const handleCartClick = () => {
    setIsOpen(false);
    router.push("/cart");
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push("/profile");
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const handleDashboardClick = () => {
    setIsOpen(false);
    router.push("/dashboard");
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  // Never use direct API URL for server media ID (img would send no auth -> 401). Use blob or null.
  const avatarUrl = isServerMediaId
    ? (serverAvatarBlobUrl ?? null)
    : getAvatarUrl(avatarFromProfile ?? avatarFromUser);

  /** Show loading when uploading new avatar or when fetching avatar image from API. Stop loading when fetch fails (e.g. 500). */
  const avatarLoading = avatarUploading || (isServerMediaId && !serverAvatarBlobUrl && !serverAvatarFetchFailed);

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Avatar Button */}
        <button
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="User menu"
        >
          {/* Avatar */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] flex items-center justify-center text-white font-semibold text-sm overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={firstName}
                className="absolute inset-0 w-full h-full object-cover object-center rounded-full"
              />
            ) : (
              getInitials()
            )}
            {avatarLoading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {/* First Name */}
          <span className="hidden md:block text-sm font-semibold text-gray-700">
            {firstName}
          </span>
          {/* Dropdown Icon */}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute right-0 top-full w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 md:block max-md:fixed max-md:right-4 max-md:top-auto max-md:mt-0 max-md:shadow-lg"
          >
            {/* User Info Section - clickable, goes to profile (industry standard) */}
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-full px-4 py-4 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-left hover:from-[#e08d30] hover:to-[#f09028] transition-colors cursor-pointer"
              aria-label="Go to profile"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#f8992f] font-bold text-lg shrink-0 overflow-hidden">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={firstName}
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-full"
                    />
                  ) : (
                    getInitials()
                  )}
                  {avatarLoading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                      <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {fullName}
                  </p>
                  <p className="text-white/80 text-xs truncate">{email}</p>
                  {profile?.mobilePhoneNumber && (
                    <p className="text-white/70 text-xs truncate mt-0.5">
                      {profile.mobilePhoneNumber}
                    </p>
                  )}
                </div>
                <svg className="w-4 h-4 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Menu Items */}
            <div className="px-2 py-2 border-t border-gray-200">
              {/* Dashboard */}
              <button
                onClick={handleDashboardClick}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-18v10h8V3h-8zM3 21h8v-6H3v6z"
                  />
                </svg>
                <span>Dashboard</span>
              </button>

              {/* Profile */}
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>My Profile</span>
              </button>

              {/* Bookings */}
              <button
                onClick={handleBookingClick}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Bookings</span>
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer mt-1"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Cart</span>
              </button>
            </div>

            {/* Sign Out Button */}
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-center text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Confirmation Dialog */}
      {showSignOutDialog && (
        <SignOutDialog
          onConfirm={confirmSignOut}
          onCancel={() => setShowSignOutDialog(false)}
        />
      )}
    </>
  );
}
