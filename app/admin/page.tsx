"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  title_en?: string | null;
  category: string;
  subcategory?: string | null;
  year: string;
  location: string;
  content: string;
  image_url: string;
  gallery_urls?: string[] | null;
  bilibili_bvid?: string | null;
};

const subcategoryOptions: Record<string, { value: string; label: string }[]> = {
  design: [
    { value: "practice", label: "实践项目" },
    { value: "competition", label: "国际竞赛" },
  ],
  research: [{ value: "research", label: "研究作品" }],
  other: [
    { value: "event", label: "活动策划" },

    { value: "wechat", label: "新媒体宣传 / 微信公众号" },
    { value: "video_web", label: "新媒体宣传 / 视频网页" },
    { value: "xiaohongshu", label: "新媒体宣传 / 小红书" },

    { value: "arch_photo", label: "影像 / 建筑/景观摄影" },
    { value: "landscape_photo", label: "影像 / 风光摄影" },
    { value: "travel_video", label: "影像 / 旅行摄像" },
  ],
};

export default function AdminPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("design");
  const [subcategory, setSubcategory] = useState("practice");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [bilibiliBvid, setBilibiliBvid] = useState("");
  const isVideoProject =
    subcategory === "video_web" ||
    subcategory === "travel_video";

  useEffect(() => {
    checkUser();
    loadProjects();
  }, []);

  async function uploadGalleryInBatches(files: File[]) {
    const batchSize = 3
    const results: string[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);

      const urls = await Promise.all(
        batch.map(async (file) => {
          const url = await uploadSingleImage(file);

          setUploadStatus(
            `正在上传 ${file.name}`
          );

          return url;
        })
      );

      results.push(...urls);

      setUploadProgress(
        Math.round((results.length / files.length) * 100)
      );

      setUploadStatus(
        `已上传 ${results.length} / ${files.length}`
      );
    }

    return results;
  }

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) router.push("/login");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setTitleEn("");
    setCategory("design");
    setSubcategory("practice");
    setYear("");
    setLocation("");
    setContent("");
    setCoverFile(null);
    setGalleryFiles([]);
    setCurrentGallery([]);
    setUploadProgress(0);
    setUploadStatus("");
    setBilibiliBvid("");
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setSubcategory(subcategoryOptions[value][0].value);
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setTitle(project.title || "");
    setTitleEn(project.title_en || "");
    setCategory(project.category || "design");
    setSubcategory(
      project.subcategory ||
        subcategoryOptions[project.category]?.[0]?.value ||
        ""
    );
    setYear(project.year || "");
    setLocation(project.location || "");
    setContent(project.content || "");
    setCoverFile(null);
    setGalleryFiles([]);
    setCurrentGallery(project.gallery_urls || []);
    setBilibiliBvid(project.bilibili_bvid || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  async function compressImage(file: File): Promise<File> {
    const maxSize = 5 * 1024 * 1024;

    if (file.size <= maxSize) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const canvas = document.createElement("canvas");

        const maxWidth = 1600;
        let quality = 0.78;

        const scale = Math.min(
          1,
          maxWidth / img.width
        );

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        function exportBlob() {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Image compression failed"));
                return;
              }

              if (blob.size <= maxSize || quality <= 0.45) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".jpg"),
                  {
                    type: "image/jpeg",
                  }
                );

                resolve(compressedFile);
              } else {
                quality -= 0.1;
                exportBlob();
              }
            },
            "image/jpeg",
            quality
          );
        }

        exportBlob();
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };

      img.src = url;
    });
  }


  async function uploadSingleImage(file: File) {
    const compressedFile =
      file.size > 5 * 1024 * 1024
        ? await compressImage(file)
        : file;

    const extension = "jpg";
    const fileName = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, compressedFile, {
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    return publicUrl;
  }

  async function deleteImageByUrl(url?: string | null) {
    if (!url) return;

    const fileName = url.split("/").pop();

    if (fileName) {
      await supabase.storage.from("images").remove([fileName]);
    }
  }

  async function removeGalleryImage(imageUrl: string) {
    if (!editingId) return;

    if (!confirm("确定删除这张图集图片？")) return;

    try {
      await deleteImageByUrl(imageUrl);

      const newGallery = currentGallery.filter((url) => url !== imageUrl);

      const { error } = await supabase
        .from("projects")
        .update({ gallery_urls: newGallery })
        .eq("id", editingId);

      if (error) throw error;

      setCurrentGallery(newGallery);
      await loadProjects();

      alert("图片已删除");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function deleteProject(project: Project) {
    if (!confirm("确定删除该项目？")) return;

    try {
      await deleteImageByUrl(project.image_url);

      for (const url of project.gallery_urls || []) {
        await deleteImageByUrl(url);
      }

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;

      await loadProjects();
      resetForm();

      alert("删除成功");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSave() {
    if (!title) {
      alert("请输入中文标题");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStatus("Preparing upload...");

      const currentProject = projects.find((p) => p.id === editingId);

      let imageUrl = editingId ? currentProject?.image_url || "" : "";
      let galleryUrls = editingId ? currentGallery : [];

      const totalFiles =
        (coverFile ? 1 : 0) + galleryFiles.length;

      let uploadedCount = 0;

      function updateProgress(fileName: string) {
        uploadedCount += 1;

        const percent = Math.round(
          (uploadedCount / totalFiles) * 100
        );

        setUploadProgress(percent);

        setUploadStatus(
          `已上传 ${uploadedCount} / ${totalFiles}：${fileName}`
        );
      }

      if (coverFile) {
        setUploadStatus(`正在上传封面：${coverFile.name}`);

        const newCoverUrl = await uploadSingleImage(coverFile);

        updateProgress(coverFile.name);

        if (editingId && currentProject?.image_url) {
          await deleteImageByUrl(currentProject.image_url);
        }

        imageUrl = newCoverUrl;
      }

      if (galleryFiles.length > 0) {
        setUploadStatus(
          `正在上传图集：0 / ${galleryFiles.length}`
        );

        const uploadedGalleryUrls =
          await uploadGalleryInBatches(galleryFiles);

        galleryUrls = [
          ...galleryUrls,
          ...uploadedGalleryUrls,
        ];
      }

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update({
            title,
            title_en: titleEn,
            category,
            subcategory,
            year,
            location,
            content,
            image_url: imageUrl,
            gallery_urls: galleryUrls,
            bilibili_bvid: bilibiliBvid,
          })
          .eq("id", editingId);

        if (error) throw error;

        alert("修改成功");
      } else {
        if (!coverFile) {
          alert("请选择封面图片");
          return;
        }

        const { error } = await supabase.from("projects").insert([
          {
            title,
            title_en: titleEn,
            category,
            subcategory,
            year,
            location,
            content,
            image_url: imageUrl,
            gallery_urls: galleryUrls,
            bilibili_bvid: bilibiliBvid,
          },
        ]);

        if (error) throw error;

        alert("上传成功");
      }

      resetForm();
      await loadProjects();
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-10 py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl">Admin Panel</h1>

        <button
          onClick={logout}
          className="border px-6 py-3 hover:bg-black hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="中文标题 Chinese Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-4 w-full"
        />

        <input
          type="text"
          placeholder="English Title"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="border p-4 w-full"
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border p-4 w-full"
        >
          <option value="design">Design</option>
          <option value="research">Research</option>
          <option value="other">Others</option>
        </select>

        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="border p-4 w-full"
        >
          {subcategoryOptions[category].map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-4 w-full"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-4 w-full"
        />

        <textarea
          placeholder="Project Description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-4 w-full min-h-[220px]"
        />

        <div className="mb-8">
          <p className="mb-2 text-sm text-neutral-500">
            封面图片 Cover Image
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverFile(e.target.files?.[0] || null)
            }
          />
        </div>

        {isVideoProject ? (
          <div key="bilibili-input">
            <p className="mb-2 text-sm text-neutral-500">
              Bilibili BV号
            </p>

            <input
              type="text"
              placeholder="例如：BV1xx411c7mD"
              value={bilibiliBvid ?? ""}
              onChange={(e) => setBilibiliBvid(e.target.value)}
              className="border p-4 w-full"
            />
          </div>
        ) : (
          <div key="gallery-input">
            <p className="mb-2 text-sm text-neutral-500">
              新增图集图片 Add Gallery Images
            </p>

            <input
              key="gallery-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(Array.from(e.target.files || []))
              }
            />
          </div>
        )}

        {!isVideoProject && editingId && currentGallery.length > 0 && (
          <div>
            <p className="mb-3 text-sm text-neutral-500">
              已上传图集 Existing Gallery
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentGallery.map((url) => (
                <div key={url} className="border p-2">
                  <img
                    src={url}
                    alt="gallery"
                    className="w-full h-28 object-cover"
                  />

                  <button
                    onClick={() => removeGalleryImage(url)}
                    className="mt-2 w-full border px-3 py-2 text-sm hover:bg-black hover:text-white"
                  >
                    Delete Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4">
            <div className="h-2 w-full bg-neutral-200">
              <div
                className="h-2 bg-black transition-all duration-300"
                style={{
                  width: `${uploadProgress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              {uploadStatus || `Uploading... ${uploadProgress}%`}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="border px-8 py-4 hover:bg-black hover:text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "Upload Project"}
          </button>

          {editingId && (
            <button onClick={resetForm} className="border px-8 py-4">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl mb-8">Projects</h2>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border p-6 flex items-center gap-6"
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="w-40 h-28 object-cover"
              />

              <div className="flex-1">
                <h3 className="text-xl">{project.title}</h3>

                {project.title_en && (
                  <p className="text-sm text-neutral-500">
                    {project.title_en}
                  </p>
                )}

                <p className="text-neutral-500 mt-2">
                  {project.category} / {project.subcategory}
                </p>

                <p className="text-sm mt-2">{project.year}</p>

                <p className="text-sm mt-2 text-neutral-400">
                  Gallery: {project.gallery_urls?.length || 0} images
                </p>
              </div>

              <button
                onClick={() => editProject(project)}
                className="border px-4 py-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProject(project)}
                className="border px-4 py-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}