"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "jd">("resume");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFileUpload(e: any) {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
    }
  }

  async function handleSubmit() {
    if (!file) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/generate-interview-question", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      const encoded = encodeURIComponent(JSON.stringify(data));
      router.push(`/intervieww?pageData=${encoded}`);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
      <h2 className="text-3xl font-extrabold mb-8">Welcome, AMAN KUMAR</h2>

      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
      >
        + Create Interview
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[650px] p-8 shadow-xl relative animate-fadeIn">
            <button
              onClick={() => !loading && setOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6">
              Please Submit following details.
            </h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => !loading && setActiveTab("resume")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "resume"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Resume Upload
              </button>

              <button
                onClick={() => !loading && setActiveTab("jd")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "jd"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Job Description
              </button>
            </div>

            {activeTab === "resume" && (
              <div className="border border-gray-300 p-10 rounded-xl bg-gray-50">
                <h3 className="text-center text-lg font-semibold mb-4">
                  Upload file
                </h3>

                <label
                  className={`flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-xl 
                  ${file ? "border-purple-500" : "border-gray-300"}
                  bg-white cursor-pointer hover:border-purple-500 transition-all`}
                >
                  <Upload className="w-12 h-12 text-gray-500" />
                  <p className="mt-3 text-gray-500">
                    Drag or drop your file here or click to upload
                  </p>

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {file && (
                  <p className="mt-4 text-center text-green-600 font-medium">
                    Uploaded: {file.name}
                  </p>
                )}
              </div>
            )}

            {activeTab === "jd" && (
              <div className="p-4 border border-gray-300 rounded-xl bg-gray-50">
                <textarea
                  placeholder="Paste Job Description..."
                  className="w-full h-40 p-4 border rounded-xl"
                  disabled={loading}
                ></textarea>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                disabled={loading}
                onClick={() => setOpen(false)}
                className="px-6 py-2 text-gray-600 hover:text-black disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={!file || loading}
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 
                  ${
                    !file || loading
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
