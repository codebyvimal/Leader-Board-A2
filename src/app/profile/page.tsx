"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { mockPublicProfile, PublicProfile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Camera, Link as LinkIcon, MapPin, ShieldCheck, Upload } from "lucide-react";

type StoredProfileMedia = {
  avatarDataUrl?: string;
  coverDataUrl?: string;
};

const PROFILE_MEDIA_KEY = "ascend:profileMedia:v1";

function readStoredMedia(): StoredProfileMedia {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROFILE_MEDIA_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredProfileMedia;
  } catch {
    return {};
  }
}

function writeStoredMedia(next: StoredProfileMedia) {
  try {
    window.localStorage.setItem(PROFILE_MEDIA_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<PublicProfile>(mockPublicProfile);
  const [media, setMedia] = useState<StoredProfileMedia>(() => readStoredMedia());

  useEffect(() => {
    if (Object.keys(media).length > 0) writeStoredMedia(media);
  }, [media]);

  const avatarFallback = useMemo(() => {
    const parts = profile.displayName.trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || profile.avatarInitials;
  }, [profile.avatarInitials, profile.displayName]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 lg:gap-8">
            <div>
              <p className="text-accent font-medium tracking-widest text-xs lg:text-sm mb-2">PUBLIC PROFILE</p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Profile</h1>
              <p className="text-gray-400 mt-2 lg:mt-3 max-w-2xl text-sm lg:text-base">
                Your profile is public inside ASCEND. Update your avatar + cover (thumbnail) and keep your info clean.
              </p>
            </div>
            <div className="flex sm:hidden items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-2 rounded-full border border-accent/20">
              <ShieldCheck className="w-4 h-4" />
              Public view enabled
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-2 rounded-full border border-accent/20">
              <ShieldCheck className="w-4 h-4" />
              Public view enabled
            </div>
          </header>

          <section className="glass-card rounded-2xl overflow-hidden border border-white/10">
            {/* Cover / Thumbnail */}
            <div className="relative h-44 md:h-56 bg-white/5">
              {media.coverDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.coverDataUrl}
                  alt="Profile cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-accent/10 via-white/5 to-purple-900/10" />
              )}

              <label className="absolute top-4 right-4 inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md transition-colors">
                <Upload className="w-4 h-4" />
                Change cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await fileToDataUrl(file);
                    setMedia((m) => ({ ...m, coverDataUrl: url }));
                    e.currentTarget.value = "";
                  }}
                />
              </label>

              {/* Avatar */}
              <div className="absolute left-6 md:left-8 -bottom-10 md:-bottom-12">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border border-white/10 bg-background shadow-2xl overflow-hidden flex items-center justify-center">
                    {media.avatarDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media.avatarDataUrl}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold text-white">
                        {avatarFallback}
                      </div>
                    )}
                  </div>

                  <label className="absolute -right-3 -bottom-3 w-10 h-10 rounded-xl bg-accent hover:bg-accent/90 text-white border border-accent/30 shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center justify-center cursor-pointer transition-colors">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await fileToDataUrl(file);
                        setMedia((m) => ({ ...m, avatarDataUrl: url }));
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="pt-14 md:pt-16 px-6 md:px-8 pb-8">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Public card */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="text-2xl font-bold text-white truncate">{profile.displayName}</div>
                      <div className="text-gray-400 mt-1">@{profile.handle}</div>
                      <div className="text-gray-200 mt-4">{profile.headline}</div>
                    </div>
                  </div>

                  <div className="mt-6 text-gray-300 leading-relaxed max-w-2xl">
                    {profile.bio}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
                    {profile.location && (
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate max-w-[240px]">{profile.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit */}
                <div className="w-full lg:w-[420px]">
                  <div className="text-sm font-semibold text-white mb-4">Edit public information</div>

                  <div className="space-y-4">
                    <Field label="Display name">
                      <input
                        value={profile.displayName}
                        onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Handle">
                      <input
                        value={profile.handle}
                        onChange={(e) => setProfile((p) => ({ ...p, handle: e.target.value.replace(/\s+/g, "") }))}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Headline">
                      <input
                        value={profile.headline}
                        onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Bio">
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                        className={cn(inputClass, "min-h-[110px] resize-none")}
                      />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Location">
                        <input
                          value={profile.location ?? ""}
                          onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Website">
                        <input
                          value={profile.website ?? ""}
                          onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                        onClick={() => setMedia({})}
                      >
                        Reset images
                      </button>
                      <div className="text-xs text-gray-600">
                        Images save locally (no backend yet).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{props.label}</label>
      {props.children}
    </div>
  );
}

const inputClass =
  "w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

