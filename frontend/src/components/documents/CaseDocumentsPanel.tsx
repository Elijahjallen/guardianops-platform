import { useEffect, useState } from "react";
import { getCaseDocuments, uploadCaseDocument } from "../../services/api";

type CaseDocument = {
  id: string;
  caseId: string;
  caseNumber: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
};

type CaseDocumentsPanelProps = {
  caseId: string;
  caseNumber: string;
};

function CaseDocumentsPanel({ caseId, caseNumber }: CaseDocumentsPanelProps) {
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function loadDocuments() {
    try {
      const data = await getCaseDocuments(caseId);
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setMessage("Failed to load documents.");
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [caseId]);

  async function handleUpload() {
    setMessage("");

    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      const storedUser = localStorage.getItem("guardianops-user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caseId", caseId);
      formData.append("caseNumber", caseNumber);
      formData.append("uploadedBy", user?.name || "System");

      await uploadCaseDocument(formData);

      setSelectedFile(null);
      setMessage("Document uploaded successfully.");
      await loadDocuments();
    } catch (error) {
      console.error("Failed to upload document:", error);
      setMessage("Failed to upload document.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Case Documents</h2>

      <p className="mt-1 text-sm text-slate-500">
        Upload and view documents connected to this transport case.
      </p>

      {message && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
          {message}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <label className="mb-2 block font-bold text-slate-950">
          Upload Document
        </label>

        <input
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleUpload}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-bold text-slate-950">
                {document.originalName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Uploaded by {document.uploadedBy} ·{" "}
                {formatDateTime(document.createdAt)}
              </p>
            </div>

            <a
              href={`http://localhost:5001${document.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-blue-600 px-4 py-2 font-bold text-blue-600 hover:bg-blue-50"
            >
              View
            </a>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-500">
            No documents uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
}

function formatDateTime(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default CaseDocumentsPanel;