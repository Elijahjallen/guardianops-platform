import { useEffect, useState } from "react";
import { createCaseActivity, getCaseActivity } from "../../services/api";

type CaseActivity = {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

type CaseActivityTimelineProps = {
  caseId: string;
  caseNumber: string;
};

function CaseActivityTimeline({
  caseId,
  caseNumber,
}: CaseActivityTimelineProps) {
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function loadActivities() {
    try {
      const data = await getCaseActivity(caseId);
      setActivities(data);
    } catch (error) {
      console.error("Failed to load case activity:", error);
    }
  }

  useEffect(() => {
    loadActivities();
  }, [caseId]);

  async function handleAddActivity() {
    setMessage("");

    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return;
    }

    try {
      const storedUser = localStorage.getItem("guardianops-user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      await createCaseActivity({
        caseId,
        caseNumber,
        title,
        description,
        createdBy: user?.name || "System",
      });

      setTitle("");
      setDescription("");
      await loadActivities();
    } catch (error) {
      console.error("Failed to create case activity:", error);
      setMessage("Failed to add activity.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">
        Case Activity Timeline
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Add case updates that can be shared across operations and parent portal views.
      </p>

      {message && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
          {message}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="font-bold text-slate-950">Add Update</h3>

        <div className="mt-4 grid gap-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Update title, e.g. Pickup completed"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the update..."
            rows={3}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAddActivity}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Add Update
            </button>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

            <div>
              <p className="font-bold text-slate-950">{activity.title}</p>
              <p className="mt-1 text-slate-600">{activity.description}</p>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                {activity.createdBy} · {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-500">
            No activity updates yet.
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(dateValue: string) {
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

export default CaseActivityTimeline;