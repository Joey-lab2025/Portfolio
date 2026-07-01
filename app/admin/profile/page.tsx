"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileAdminPage() {
  const [nameZh, setNameZh] = useState("刘康");
  const [nameEn, setNameEn] = useState("JOEY");
  const [title, setTitle] = useState("Landscape Architecture");
  const [intro, setIntro] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data } = await supabase
      .from("site_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) {
      setNameZh(data.name_zh || "刘康");
      setNameEn(data.name_en || "JOEY");
      setTitle(data.title || "Landscape Architecture");
      setIntro(data.intro || "");
      setAvatarUrl(data.avatar_url || "");
    }
  }

  async function uploadAvatar(file: File) {
    const extension = file.name.split(".").pop();
    const fileName = `avatar-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return publicUrl;
  }

  async function saveProfile() {
    try {
      setLoading(true);

      let finalAvatarUrl = avatarUrl;

      if (file) {
        finalAvatarUrl = await uploadAvatar(file);
      }

      const { error } = await supabase
        .from("site_profile")
        .upsert({
          id: 1,
          name_zh: nameZh,
          name_en: nameEn,
          title,
          intro,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert("保存成功");
      setAvatarUrl(finalAvatarUrl);
      setFile(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-10 py-20">
      <h1 className="text-5xl mb-10">Profile</h1>

      <div className="space-y-6">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-32 w-32 rounded-full object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <input
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="English Name"
          className="border p-4 w-full"
        />

        <input
          value={nameZh}
          onChange={(e) => setNameZh(e.target.value)}
          placeholder="中文名"
          className="border p-4 w-full"
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-4 w-full"
        />

        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Intro"
          className="border p-4 w-full min-h-[160px]"
        />

        <button
          onClick={saveProfile}
          disabled={loading}
          className="border px-8 py-4 hover:bg-black hover:text-white"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </main>
  );
}