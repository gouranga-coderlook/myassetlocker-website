"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { fetchProfileIfNeeded, setProfile, setAvatarUploading, setAvatarUploadProgress } from "@/store/slices/profileSlice";
import {
  authService,
  getAvatarUrl,
  fetchMediaBlob,
  type UpdateProfileDto,
} from "@/lib/api/authService";
import {
  validatePhoneNumber,
  getAllCountries,
  getCountryInfo,
  type CountryCode,
} from "@/lib/utils/phoneValidation";
import Image from "next/image";
import Hero from "@/components/Hero";
import AuthLoadingView from "@/components/AuthLoadingView";
import Input from "@/components/ui/Input";
import toast, { Toaster } from "react-hot-toast";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_MB = 2;

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhoneNumber: string;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, authHydrated, user, openAuthPopup } = useAuth();
  const { profileData: profile, loading: profileLoading, error: profileError } = useAppSelector((state) => state.profile);
  const loading = isAuthenticated && (profileLoading || (!!user?.id && !profile));

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [showDeletePhotoConfirm, setShowDeletePhotoConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  /** Progress value shown in UI; increments slowly (0,1,2,...) toward uploadProgress */
  const [displayProgress, setDisplayProgress] = useState(0);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const uploadedBlobUrlRef = useRef<string | null>(null);
  const [serverAvatarBlobUrl, setServerAvatarBlobUrl] = useState<string | null>(null);
  const [serverAvatarFetchFailed, setServerAvatarFetchFailed] = useState(false);
  const { register, setValue, getValues, watch, handleSubmit, trigger, formState: { errors, isValid } } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobilePhoneNumber: "",
    },
    mode: "onChange",
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const mobilePhoneNumber = watch("mobilePhoneNumber");

  const allCountries = useMemo(
    () => getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const countryInfo = useMemo(() => getCountryInfo(selectedCountry), [selectedCountry]);
  const phonePlaceholder = countryInfo.placeholder;
  const countryName = countryInfo.name;

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchProfileIfNeeded());
    }
  }, [isAuthenticated, user?.id, dispatch]);

  useEffect(() => {
    if (!profile) return;
    setValue("firstName", profile.firstName ?? "", { shouldValidate: true });
    setValue("lastName", profile.lastName ?? "", { shouldValidate: true });
    setValue("email", profile.email ?? user?.email ?? "", { shouldValidate: true });
    setValue("mobilePhoneNumber", parsePhoneForDisplay(profile.mobilePhoneNumber ?? "") ?? "", { shouldValidate: true });
    setSelectedCountry(inferCountryFromPhone(profile.mobilePhoneNumber ?? "") ?? "US");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.firstName, profile?.lastName, profile?.email, profile?.mobilePhoneNumber, user?.email, setValue]);

  useEffect(() => {
    return () => {
      if (uploadedBlobUrlRef.current) {
        URL.revokeObjectURL(uploadedBlobUrlRef.current);
        uploadedBlobUrlRef.current = null;
      }
    };
  }, []);

  /** Animate displayProgress slowly toward uploadProgress (0, 1, 2, 3, ...); snap to 100 when upload completes so success check shows */
  useEffect(() => {
    if (uploadProgress === null) {
      setDisplayProgress(0);
      return;
    }
    const target = Math.min(uploadProgress, 100);
    if (target >= 100) {
      setDisplayProgress(100);
      return;
    }
    const stepMs = 80;
    const id = setInterval(() => {
      setDisplayProgress((p) => Math.min(p + 1, target));
    }, stepMs);
    return () => clearInterval(id);
  }, [uploadProgress]);

  // Server avatar: fetch image from GET /media/view/{id} (with auth) and show as blob URL
  const serverMediaId = avatarRemoved
    ? null
    : (profile?.avatar ?? (profile as { media?: string })?.media ?? user?.avatar ?? (user as { media?: string })?.media ?? null);
  const isServerMediaId =
    serverMediaId &&
    !serverMediaId.startsWith("data:") &&
    !serverMediaId.startsWith("blob:") &&
    !serverMediaId.startsWith("http");

  useEffect(() => {
    if (!isServerMediaId || !serverMediaId) {
      if (serverAvatarBlobUrl) {
        URL.revokeObjectURL(serverAvatarBlobUrl);
        setServerAvatarBlobUrl(null);
      }
      setServerAvatarFetchFailed(false);
      return;
    }
    setServerAvatarFetchFailed(false);
    let revoked = false;
    fetchMediaBlob(serverMediaId)
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
  }, [serverMediaId ?? ""]);

  function parsePhoneForDisplay(phone: string): string {
    if (!phone || !phone.trim()) return "";
    const digits = phone.replace(/\D/g, "");
    for (const c of allCountries) {
      const code = c.dialCode;
      if (digits.startsWith(code)) {
        const national = digits.slice(code.length);
        const validation = validatePhoneNumber(national, null, {
          country: c.code as CountryCode,
        });
        return validation.formatted;
      }
    }
    return phone;
  }

  function inferCountryFromPhone(phone: string): CountryCode | null {
    if (!phone || !phone.trim()) return null;
    const digits = phone.replace(/\D/g, "");
    for (const c of allCountries) {
      if (digits.startsWith(c.dialCode)) return c.code as CountryCode;
    }
    return null;
  }

  const handlePhoneChange = (value: string) => {
    const maxDigits = countryInfo.maxLength;
    const digits = value.replace(/\D/g, "");
    if (digits.length > maxDigits) {
      const truncated = digits.slice(0, maxDigits);
      const validation = validatePhoneNumber(truncated, null, {
        country: selectedCountry,
      });
      setValue("mobilePhoneNumber", validation.formatted, { shouldValidate: true });
      setPhoneError(phoneTouched ? validation.errorMessage : null);
      return;
    }
    const validation = validatePhoneNumber(value, null, { country: selectedCountry });
    setValue("mobilePhoneNumber", validation.formatted, { shouldValidate: true });
    if (!validation.formatted.trim()) setPhoneError(null);
    else if (phoneTouched) setPhoneError(validation.errorMessage);
    void trigger("mobilePhoneNumber");
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const validation = validatePhoneNumber(getValues("mobilePhoneNumber"), null, {
      country: selectedCountry,
    });
    setPhoneError(validation.errorMessage);
    void trigger("mobilePhoneNumber");
  };

  const handleCountryChange = (newCountry: CountryCode) => {
    setSelectedCountry(newCountry);
    setPhoneTouched(true);
    if (mobilePhoneNumber) {
      const digits = mobilePhoneNumber.replace(/\D/g, "");
      if (digits.length > 0) {
        const newCountryInfo = getCountryInfo(newCountry);
        const truncatedDigits = digits.slice(0, newCountryInfo.maxLength);
        const validation = validatePhoneNumber(truncatedDigits, null, {
          country: newCountry,
        });
        setValue("mobilePhoneNumber", validation.formatted, { shouldValidate: true });
        setPhoneError(validation.errorMessage);
        void trigger("mobilePhoneNumber");
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please use a JPEG, PNG, GIF, or WebP image for your profile photo.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Profile photo must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
      return;
    }
    e.target.value = "";
    setAvatarRemoved(false);
    const userId = user?.id;
    if (!userId) return;

    if (uploadedBlobUrlRef.current) {
      URL.revokeObjectURL(uploadedBlobUrlRef.current);
      uploadedBlobUrlRef.current = null;
    }

    dispatch(setAvatarUploading(true));
    dispatch(setAvatarUploadProgress(0));
    setUploadProgress(0);
    // Let 0% paint before starting upload so user sees progress start from 0
    await new Promise((r) => requestAnimationFrame(r));
    try {
      const updated = await authService.uploadProfileImage(file, userId, (percent) => {
        setUploadProgress((prev) => (percent >= (prev ?? 0) ? percent : prev));
        dispatch(setAvatarUploadProgress(percent));
      });
      dispatch(updateUser(updated));
      dispatch(setProfile(updated));
      setAvatarPreview(null);

      const blobUrl = URL.createObjectURL(file);
      uploadedBlobUrlRef.current = blobUrl;
      setAvatarPreview(blobUrl);

      setUploadProgress(100);
      dispatch(setAvatarUploadProgress(100));
      toast.success("Profile photo updated successfully.");
      setTimeout(() => {
        setUploadProgress(null);
        dispatch(setAvatarUploadProgress(null));
        dispatch(setAvatarUploading(false));
      }, 600);
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? "Unable to upload profile photo. Please try again.";
      toast.error(msg);
      setUploadProgress(null);
      dispatch(setAvatarUploadProgress(null));
      dispatch(setAvatarUploading(false));
    }
  };

  const handleAvatarRemove = () => {
    const serverAvatar =
      profile?.avatar ?? (profile as { media?: string })?.media ?? user?.avatar;
    if (serverAvatar && user?.id) {
      setShowDeletePhotoConfirm(true);
    } else {
      if (uploadedBlobUrlRef.current) {
        URL.revokeObjectURL(uploadedBlobUrlRef.current);
        uploadedBlobUrlRef.current = null;
      }
      setAvatarPreview(null);
      setAvatarRemoved(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmDeleteProfilePicture = async () => {
    if (!user?.id) return;
    setRemovingAvatar(true);
    try {
      const updated = await authService.deleteProfilePicture(user.id);
      dispatch(updateUser(updated));
      dispatch(setProfile(updated));
      if (uploadedBlobUrlRef.current) {
        URL.revokeObjectURL(uploadedBlobUrlRef.current);
        uploadedBlobUrlRef.current = null;
      }
      setAvatarPreview(null);
      setAvatarRemoved(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowDeletePhotoConfirm(false);
      toast.success("Profile photo removed successfully.");
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? "Unable to remove profile photo. Please try again.";
      toast.error(msg);
    } finally {
      setRemovingAvatar(false);
    }
  };

  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!profile) return;
    if (!values.email.trim()) {
      toast.error("Email address is required.");
      return;
    }

    const validation = validatePhoneNumber(values.mobilePhoneNumber, null, {
      country: selectedCountry,
    });
    if (!values.mobilePhoneNumber.trim()) {
      setPhoneTouched(true);
      setPhoneError("Phone number is required.");
      toast.error("Phone number is required.");
      return;
    }
    if (!validation.isValid) {
      setPhoneTouched(true);
      setPhoneError(validation.errorMessage);
      toast.error(validation.errorMessage ?? "Please enter a valid phone number.");
      return;
    }

    const digits = values.mobilePhoneNumber.replace(/\D/g, "");
    const mobilePhoneNumberWithCountry = digits
      ? `+${countryInfo.dialCode} ${digits}`
      : undefined;

    const payload: UpdateProfileDto = {
      firstName: values.firstName.trim() || undefined,
      lastName: values.lastName.trim() || undefined,
      mobilePhoneNumber: mobilePhoneNumberWithCountry,
    };
    if (avatarRemoved) payload.avatar = null;
    else if (avatarPreview) payload.avatar = avatarPreview;

    setSaving(true);
    try {
      const updated = await authService.updateProfile(payload);
      dispatch(updateUser(updated));
      dispatch(setProfile(updated));
      setAvatarPreview(null);
      setAvatarRemoved(false);
      toast.success("Your profile has been updated successfully.");
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? "Unable to update profile. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!authHydrated) {
    return (
      <AuthLoadingView
        headline="My Profile"
        bodyText="Manage your account and preferences"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <Hero
          backgroundImage="/products-1.png"
          headline="My Profile"
          bodyText="Manage your account and preferences"
          height="compact"
        />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in to view your profile
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your profile and account settings
            </p>
            <button
              onClick={openAuthPopup}
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#ea9637] to-[#FB9A2D] text-white font-semibold rounded-xl hover:from-[#d8852a] hover:to-[#e88a25] transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileMediaId = (profile as { media?: string })?.media;
  const userMediaId = (user as { media?: string })?.media;
  const currentAvatar = avatarRemoved
    ? null
    : avatarPreview ??
      profile?.avatar ??
      profileMediaId ??
      user?.avatar ??
      userMediaId;
  // Prefer: 1) just-uploaded blob, 2) image from GET /media/view/{id} (fetched with auth), 3) direct URL
  const avatarSrc =
    currentAvatar?.startsWith("blob:") || currentAvatar?.startsWith("data:")
      ? currentAvatar
      : isServerMediaId && serverAvatarBlobUrl
        ? serverAvatarBlobUrl
        : currentAvatar && !isServerMediaId
          ? (getAvatarUrl(currentAvatar) ?? null)
          : null;
  const initials = (
    firstName ||
    profile?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.email?.slice(0, 1) ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  /** Show loading spinner when fetching avatar image from API (GET /media/view/{id}). Stop when fetch fails (e.g. 500). */
  const avatarImageLoading = isServerMediaId && !serverAvatarBlobUrl && !serverAvatarFetchFailed;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Toaster position="top-right" />
      <Hero
        backgroundImage="/products-1.png"
        headline="My Profile"
        bodyText="Your account and preferences"
        height="compact"
      />
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 sm:p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-full space-y-3">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit(onSubmitProfile)} className="p-8 sm:p-10">
              <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                  {/* Relative container: clips blur and overlays to circle */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-100 ring-offset-2">
                    <div className="relative w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-400 overflow-hidden">
                      {avatarSrc ? (
                        <Image
                          src={avatarSrc}
                          alt="User avatar"
                          fill
                          sizes="112px"
                          unoptimized
                          className="object-cover object-center transition-all duration-300 ease-out"
                          style={{
                            filter: uploadProgress != null ? "blur(3px)" : "none",
                            opacity: uploadProgress != null ? 0.6 : 1,
                          }}
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    {/* Vertical progress overlay: fills from top to bottom, with percentage (displayProgress counts up slowly) */}
                    {uploadProgress != null && displayProgress < 100 && (
                      <>
                        <div
                          className="absolute left-0 top-0 w-full rounded-b-full bg-black/50 transition-all duration-150 ease-out pointer-events-none"
                          style={{ height: `${displayProgress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-white text-sm font-semibold drop-shadow-md">
                            {displayProgress}%
                          </span>
                        </div>
                      </>
                    )}
                    {/* Green check and 100% when upload finishes (snap to 100 if finished before counter) */}
                    {uploadProgress !== null && displayProgress === 100 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full pointer-events-none animate-fade-in">
                        <span className="text-3xl text-green-500 font-bold" aria-hidden>✓</span>
                        <span className="text-white text-xs font-semibold drop-shadow-md">100%</span>
                      </div>
                    )}
                    {/* Loading when fetching avatar image from API */}
                    {avatarImageLoading && uploadProgress === null && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40">
                        <span className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                    {uploadProgress === null && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-[#f8992f] focus:ring-offset-2 focus:ring-offset-transparent"
                      aria-label="Change profile photo"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V11z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"
                        />
                      </svg>
                    </button>
                  )}
                  {/* Trash (remove avatar) on the circle - bottom-right */}
                  {currentAvatar && uploadProgress === null && (
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      disabled={removingAvatar}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-70 disabled:cursor-not-allowed z-10"
                      aria-label="Remove profile photo"
                    >
                      {removingAvatar ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleAvatarChange}
                    className="hidden"
                    aria-label="Upload profile photo"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, GIF or WebP, max {MAX_IMAGE_SIZE_MB} MB
                </p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="profile-first-name"
                    type="text"
                    label="First name"
                    required
                    error={errors.firstName?.message}
                    className="py-2.5 text-gray-900 placeholder-gray-400 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f]/30 focus:border-[#f8992f]"
                    placeholder="First name"
                    {...register("firstName", {
                      required: "First name is required.",
                    })}
                  />
                  <Input
                    id="profile-last-name"
                    type="text"
                    label="Last name"
                    required
                    error={errors.lastName?.message}
                    className="py-2.5 text-gray-900 placeholder-gray-400 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f8992f]/30 focus:border-[#f8992f]"
                    placeholder="Last name"
                    {...register("lastName", {
                      required: "Last name is required.",
                    })}
                  />
                </div>
                <div>
                  <Input
                    id="profile-email"
                    type="email"
                    label="Email address"
                    required
                    error={errors.email?.message}
                    value={email}
                    readOnly
                    className="py-2.5 text-gray-500 bg-gray-50 border-gray-200 rounded-lg cursor-not-allowed focus:border-gray-200"
                    {...register("email", {
                      required: "Email address is required.",
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone number
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#f8992f]/30 focus-within:border-[#f8992f]">
                    <select
                      value={selectedCountry}
                      onChange={(e) =>
                        handleCountryChange(e.target.value as CountryCode)
                      }
                      className="px-3 py-2.5 bg-gray-50 text-gray-700 border-r border-gray-200 text-sm focus:outline-none"
                    >
                      {allCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} +{c.dialCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={mobilePhoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={handlePhoneBlur}
                      placeholder={phonePlaceholder}
                      maxLength={countryInfo.maxLength + 15}
                      className="flex-1 min-w-0 px-4 py-2.5 text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 bg-transparent"
                      aria-invalid={!!(phoneError && phoneTouched)}
                      aria-describedby={
                        phoneError && phoneTouched
                          ? "profile-phone-error"
                          : undefined
                      }
                    />
                  </div>
                  {phoneError && phoneTouched && (
                    <p
                      id="profile-phone-error"
                      className="mt-1.5 text-sm text-red-600"
                      role="alert"
                    >
                      {phoneError}
                    </p>
                  )}
                  {!phoneError && mobilePhoneNumber && phoneTouched && (
                    <p className="mt-1.5 text-xs text-emerald-600">
                      Valid {countryName} number
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving || !isValid || !!phoneError || !mobilePhoneNumber.trim()}
                  className="w-full py-3 px-4 bg-[#f8992f] hover:bg-[#e88a25] text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#f8992f]/40 focus:ring-offset-2"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {showDeletePhotoConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-photo-title"
          onClick={(e) =>
            e.target === e.currentTarget &&
            !removingAvatar &&
            setShowDeletePhotoConfirm(false)
          }
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-photo-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Remove profile photo?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Your profile photo will be removed. You can add a new one anytime.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeletePhotoConfirm(false)}
                disabled={removingAvatar}
                className="px-4 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProfilePicture}
                disabled={removingAvatar}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {removingAvatar ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Removing…
                  </>
                ) : (
                  "Remove photo"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
