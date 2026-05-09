"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicProfile, getCurrentProfile, fallbackProfile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Camera, Link as LinkIcon, MapPin, ShieldCheck, Upload, User, Zap, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ProfileSection() {
  const [profile, setProfile] = useState<PublicProfile>(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getCurrentProfile();
      if (data) setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  const avatarFallback = useMemo(() => {
    const parts = profile.displayName.trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || profile.avatarInitials;
  }, [profile.avatarInitials, profile.displayName]);

  const handleSave = async () => {
    if (!profile.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.displayName,
          username: profile.handle,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
        })
        .eq("id", profile.id);
        
      if (error) console.error("Error saving profile", error);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const uploadMedia = async (file: File, type: "avatar" | "cover") => {
    if (!profile.id) return;
    
    if (type === "avatar") setUploadingAvatar(true);
    else setUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profile_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile_media")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Update profile
      const updateData = type === "avatar" 
        ? { avatar_url: publicUrl } 
        : { cover_url: publicUrl };

      await supabase.from("profiles").update(updateData).eq("id", profile.id);

      setProfile(p => ({
        ...p,
        ...(type === "avatar" ? { avatarUrl: publicUrl } : { coverUrl: publicUrl })
      }));

    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      else setUploadingCover(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-[var(--gold)] font-orbitron animate-pulse uppercase tracking-[0.3em]">Initializing Neural Link...</div>;
  }

  return (
    <section id="profile" className="py-12 lg:py-20 border-t border-[var(--line)]">
      <header className="mb-10 lg:mb-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 lg:gap-8">
        <div>
          <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] lg:text-xs mb-3 uppercase flex items-center gap-2">
            <User className="w-4 h-4" />
            Operator Identification
          </p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
            Profile
          </h1>
          <p className="text-[var(--text-soft)] mt-4 lg:mt-5 max-w-2xl text-sm lg:text-[16px] font-medium leading-relaxed">
            Update your neural footprint. Your identity within the ASCEND protocol is defined by your consistency and verification history.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-[var(--gold)] bg-[var(--gold)]/10 px-5 py-3 rounded-xl border border-[var(--gold)]/20 font-orbitron uppercase tracking-widest shadow-[0_0_15px_var(--glow-gold)]">
          <ShieldCheck className="w-4 h-4" />
          Sync: Online
        </div>
      </header>

      <div className="glass-panel rounded-3xl overflow-hidden border border-[var(--line)] shadow-2xl">
        {/* Cover / Thumbnail */}
        <div className="relative h-48 md:h-64 bg-white/[0.02]">
          {profile.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.coverUrl}
              alt="Profile cover"
              className="w-full h-full object-cover opacity-60 grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[var(--gold)]/5 via-white/[0.02] to-transparent" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-0)] to-transparent" />

          <label className="absolute top-6 right-6 inline-flex items-center gap-2 cursor-pointer text-[10px] font-black text-white bg-black/60 hover:bg-[var(--gold)] hover:text-[var(--bg-0)] border border-white/10 px-5 py-3 rounded-xl backdrop-blur-xl transition-all font-orbitron uppercase tracking-widest shadow-xl group">
            {uploadingCover ? (
              <span className="animate-pulse">Uploading...</span>
            ) : (
              <>
                <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadMedia(e.target.files[0], "cover");
                  }}
                />
              </>
            )}
          </label>

          {/* Avatar */}
          <div className="absolute left-8 md:left-10 -bottom-12 md:-bottom-16">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg-0)] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center group-hover:border-[var(--gold)] transition-colors duration-500">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--bg-0)] to-[var(--bg-1)] flex items-center justify-center text-3xl font-black text-[var(--gold)] font-orbitron">
                    {avatarFallback}
                  </div>
                )}
                <div className="absolute inset-0 bg-[var(--gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <label className="absolute -right-3 -bottom-3 w-12 h-12 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-muted)] text-[var(--bg-0)] border border-[var(--gold)]/30 shadow-[0_0_20px_var(--glow-gold)] flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 z-10">
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-[var(--bg-0)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) uploadMedia(e.target.files[0], "avatar");
                      }}
                    />
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-20 md:pt-24 px-8 md:px-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Public card */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="text-3xl font-black text-white truncate font-orbitron tracking-tight flex items-center gap-4">
                    {profile.displayName}
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--glow-gold)] animate-pulse" />
                  </div>
                  <div className="text-[var(--gold)] mt-2 font-black text-xs uppercase tracking-[0.2em] opacity-60">@{profile.handle}</div>
                  <div className="text-[17px] text-white mt-6 font-bold leading-relaxed">{profile.headline || "Unconfigured Operator"}</div>
                </div>
              </div>

              <div className="mt-8 text-[var(--text-soft)] leading-relaxed max-w-2xl font-medium text-[15px]">
                {profile.bio || "No bio data provided."}
              </div>

              <div className="mt-10 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
                {profile.location && (
                  <div className="inline-flex items-center gap-3 bg-white/5 border border-[var(--line)] rounded-xl px-5 py-3 text-[var(--text-soft)]">
                    <MapPin className="w-4 h-4 text-[var(--gold)]" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <div className="inline-flex items-center gap-3 bg-white/5 border border-[var(--line)] rounded-xl px-5 py-3 text-[var(--text-soft)] hover:text-white hover:border-[var(--gold)]/30 transition-all cursor-pointer">
                    <LinkIcon className="w-4 h-4 text-[var(--gold)]" />
                    <span className="truncate max-w-[280px]">{profile.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit */}
            <div className="w-full lg:w-[440px] space-y-10">
              <div>
                <h3 className="text-xs font-black text-white mb-6 font-orbitron uppercase tracking-[0.2em] flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
                  Identity Configuration
                </h3>

                <div className="space-y-6">
                  <Field label="Operator Name">
                    <input
                      value={profile.displayName}
                      onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="System Handle">
                    <input
                      value={profile.handle}
                      onChange={(e) => setProfile((p) => ({ ...p, handle: e.target.value.replace(/\s+/g, "") }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Status Headline">
                    <input
                      value={profile.headline}
                      onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Bio Data">
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      className={cn(inputClass, "min-h-[120px] resize-none")}
                    />
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving || !profile.id}
                      className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-muted)] text-[var(--bg-0)] px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Syncing..." : "Sync Profile"}
                    </button>
                    <div className="text-[10px] text-[var(--text-soft)] opacity-40 font-black uppercase tracking-widest italic">
                      Network Sync Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] ml-1">{props.label}</label>
      {props.children}
    </div>
  );
}

const inputClass =
  "w-full bg-[var(--bg-0)]/60 border border-[var(--line)] rounded-2xl py-4 px-5 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-all font-bold text-[15px]";
