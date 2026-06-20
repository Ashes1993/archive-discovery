"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateMovieAdmin, deleteMovieAdmin } from "@/actions/admin";
import { uploadPoster } from "@/actions/cloudinary";
import { GlassButton } from "@/components/ui/GlassButton";

const getImageUrl = (archiveId, posterFile) => {
  if (!posterFile) return null;
  if (posterFile.startsWith("http")) return posterFile;
  return `https://archive.org/download/${archiveId}/${posterFile}`;
};

export default function AdminClient({
  initialData,
  currentPage,
  currentSearch,
  currentFilter,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const [editingMovie, setEditingMovie] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Cloudinary Upload State & Ref
  const [isUploading, setIsUploading] = useState(false);
  const posterInputRef = useRef(null);

  useEffect(() => {
    if (editingMovie || previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editingMovie, previewImage]);

  const updateUrl = (newPage, newSearch, newFilter) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage);
    if (newSearch) params.set("search", newSearch);
    if (newFilter && newFilter !== "all") params.set("filter", newFilter);

    startTransition(() => {
      router.push(`/admin?${params.toString()}`);
    });
  };

  // --- CLOUDINARY UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadPoster(formData);

    if (res.success) {
      // Inject the new URL into the input field instantly
      if (posterInputRef.current) {
        posterInputRef.current.value = res.url;
      }
      setPreviewImage(res.url); // Show the uploaded image preview
    } else {
      alert("Upload failed: " + res.error);
    }

    setIsUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      runtime: formData.get("runtime"),
      color: formData.get("color"),
      posterFile: formData.get("posterFile"),
      videoFile: formData.get("videoFile"),
      creator: formData.get("creator"),
      isVerified: formData.get("isVerified") === "on",
    };

    const res = await updateMovieAdmin(editingMovie.id, {
      ...data,
      archiveId: editingMovie.archiveId,
    });
    if (res.success) {
      setEditingMovie(null);
    } else {
      alert("Failed to save changes.");
    }
  };

  const handleDelete = async (id, title) => {
    if (
      window.confirm(
        `Are you absolutely sure you want to delete "${title}"? This cannot be undone.`,
      )
    ) {
      const res = await deleteMovieAdmin(id);
      if (!res.success) alert("Failed to delete movie.");
    }
  };

  return (
    <>
      <div className="space-y-6 relative">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface border border-border-subtle p-4 rounded-md">
          <div className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateUrl(1, searchInput, currentFilter)
              }
              className="w-full bg-noir border border-border-subtle text-silver px-4 py-2 text-sm focus:border-gold outline-none transition-colors"
            />
            <GlassButton
              onClick={() => updateUrl(1, searchInput, currentFilter)}
              className="px-6 py-2 text-sm border-border-subtle hover:border-gold"
            >
              Search
            </GlassButton>
          </div>

          <div className="flex gap-2">
            <select
              value={currentFilter}
              onChange={(e) => updateUrl(1, searchInput, e.target.value)}
              className="bg-noir border border-border-subtle text-pewter px-4 py-2 text-sm focus:border-gold outline-none cursor-pointer"
            >
              <option value="all">All Movies</option>
              <option value="missing_poster">Missing Poster</option>
              <option value="missing_director">Missing Director</option>
              <option value="missing_year">Missing Year</option>
              <option value="missing_runtime">Missing Runtime</option>
              <option value="missing_color">Missing Color</option>
              <option value="missing_description">Missing Description</option>
            </select>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-surface border border-border-subtle rounded-md overflow-x-auto relative min-h-[500px]">
          {isPending && (
            <div className="absolute inset-0 bg-noir/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <span className="text-gold font-mono animate-pulse">
                Updating Vault Data...
              </span>
            </div>
          )}
          <table className="w-full text-left text-sm text-pewter whitespace-nowrap">
            <thead className="text-xs text-silver uppercase bg-noir border-b border-border-subtle font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Poster</th>
                <th className="px-6 py-4">Title & ID</th>
                <th className="px-6 py-4">Director</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4">Runtime</th>
                <th className="px-6 py-4">Downloads</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialData.movies.map((movie) => {
                const imageUrl = getImageUrl(movie.archiveId, movie.posterFile);
                return (
                  <tr
                    key={movie.id}
                    className={`border-b border-border-subtle/50 hover:bg-white/5 transition-colors ${movie.isVerified ? "opacity-40 grayscale hover:opacity-100 hover:grayscale-0" : ""}`}
                  >
                    <td className="px-6 py-4">
                      {movie.isVerified ? (
                        <span className="text-emerald-500 font-mono text-xs border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded-sm">
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-500 font-mono text-xs border border-amber-500/30 bg-amber-500/10 px-2 py-1 rounded-sm">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={movie.title || "Movie Poster"}
                          width={40}
                          height={56}
                          className="object-cover cursor-pointer border border-border-subtle hover:border-gold transition-colors"
                          onClick={() => setPreviewImage(imageUrl)}
                        />
                      ) : (
                        <div className="w-10 h-14 bg-noir border border-red-500/50 flex items-center justify-center text-[10px] text-red-500/80">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-silver font-serif font-bold text-base line-clamp-1 max-w-[200px]">
                        {movie.title}
                      </p>
                      <p className="text-[10px] font-mono mt-1 text-zinc-500">
                        {movie.archiveId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-1 max-w-[150px]">
                        {movie.creator || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">{movie.year || "—"}</td>
                    <td className="px-6 py-4">{movie.color || "—"}</td>
                    <td className="px-6 py-4">
                      {movie.runtime ? `${movie.runtime}m` : "—"}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {movie.downloads ? movie.downloads.toLocaleString() : "0"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-1 max-w-[200px] text-xs">
                        {movie.description || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => setEditingMovie(movie)}
                        className="text-gold hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id, movie.title)}
                        className="text-red-500/80 hover:text-red-500 font-mono text-xs uppercase tracking-widest transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center font-mono text-xs text-pewter">
          <p>
            Page {currentPage} of {initialData.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                updateUrl(currentPage - 1, searchInput, currentFilter)
              }
              className="px-4 py-2 border border-border-subtle hover:border-gold disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <button
              disabled={currentPage >= initialData.totalPages}
              onClick={() =>
                updateUrl(currentPage + 1, searchInput, currentFilter)
              }
              className="px-4 py-2 border border-border-subtle hover:border-gold disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* REACT PORTALS FOR MODALS */}
      {mounted &&
        previewImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                className="absolute -top-10 right-0 text-white hover:text-gold font-mono uppercase tracking-widest text-sm"
                onClick={() => setPreviewImage(null)}
              >
                [Close]
              </button>
              <Image
                src={previewImage}
                alt="Metadata Preview"
                fill
                sizes="(max-width: 768px) 100 vm, 600px"
                className="object-contain border border-border-subtle shadow-2xl"
                priority
              />
            </div>
          </div>,
          document.body,
        )}

      {mounted &&
        editingMovie &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end bg-black/50 backdrop-blur-sm">
            <div
              className="absolute inset-0"
              onClick={() => setEditingMovie(null)}
            />

            <div className="relative w-full max-w-md h-full bg-surface border-l border-border-subtle p-8 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-silver">
                    Edit Metadata
                  </h2>
                  <p className="text-xs font-mono text-pewter mt-1">
                    {editingMovie.archiveId}
                  </p>
                </div>
                <button
                  onClick={() => setEditingMovie(null)}
                  className="text-pewter hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingMovie.title}
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider">
                    Creator / Director
                  </label>
                  <input
                    type="text"
                    name="creator"
                    defaultValue={editingMovie.creator || ""}
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingMovie.description || ""}
                    rows={4}
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      defaultValue={editingMovie.year || ""}
                      className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider">
                      Runtime (min)
                    </label>
                    <input
                      type="number"
                      name="runtime"
                      defaultValue={editingMovie.runtime || ""}
                      className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider">
                    Color Standard
                  </label>
                  <select
                    name="color"
                    defaultValue={editingMovie.color || ""}
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                  >
                    <option value="">Unknown</option>
                    <option value="Black & White">Black & White</option>
                    <option value="Color">Color</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider flex justify-between items-end">
                    <span>Poster Path / URL</span>
                    <div className="flex gap-4 items-center">
                      {editingMovie.posterFile && (
                        <span
                          className="text-pewter cursor-pointer hover:text-white transition-colors"
                          onClick={() => {
                            const currentVal =
                              posterInputRef.current?.value ||
                              editingMovie.posterFile;
                            setPreviewImage(
                              getImageUrl(editingMovie.archiveId, currentVal),
                            );
                          }}
                        >
                          👁 Preview
                        </span>
                      )}

                      {/* --- CLOUDINARY UPLOAD BUTTON --- */}
                      <label className="text-emerald-500 cursor-pointer hover:text-emerald-400 transition-colors font-bold">
                        {isUploading ? "⏳ Uploading..." : "⬆ Upload New"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="posterFile"
                    ref={posterInputRef} // Connects the upload injection
                    defaultValue={editingMovie.posterFile || ""}
                    placeholder="Filename OR full http:// URL"
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider">
                    Video Filename
                  </label>
                  <input
                    type="text"
                    name="videoFile"
                    defaultValue={editingMovie.videoFile || ""}
                    className="w-full bg-noir border border-border-subtle text-silver px-4 py-3 text-sm focus:border-gold outline-none text-[11px]"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-sm cursor-pointer hover:bg-emerald-500/10 transition-colors mt-8">
                  <input
                    type="checkbox"
                    name="isVerified"
                    defaultChecked={editingMovie.isVerified}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-silver">
                      Mark as Verified
                    </span>
                    <span className="text-xs font-mono text-pewter">
                      Pushes to back of queue
                    </span>
                  </div>
                </label>

                <div className="pt-6 border-t border-border-subtle flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingMovie(null)}
                    className="flex-1 px-4 py-3 border border-border-subtle text-silver hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gold text-noir font-bold hover:bg-white transition-colors"
                  >
                    Save Metadata
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
