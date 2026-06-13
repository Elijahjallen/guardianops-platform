import { useStaffStore } from "../../store/staffStore";

function FieldStaffStatus() {
  const staff = useStaffStore((state) => state.staff);

  const activeCount = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  ).length;

  const busyCount = staff.filter((member) => member.status === "Busy").length;
  const offlineCount = staff.filter(
    (member) => member.status === "Off Duty"
  ).length;

  const totalStaff = staff.length || 1;

  const activePercent = Math.round((activeCount / totalStaff) * 100);
  const busyPercent = Math.round((busyCount / totalStaff) * 100);
  const offlinePercent = Math.round((offlineCount / totalStaff) * 100);

  const activeDegrees = (activePercent / 100) * 360;
  const busyDegrees = activeDegrees + (busyPercent / 100) * 360;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Field Staff Status</h2>

      <div className="mt-6 flex items-center gap-6">
        <div
          className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              #22c55e 0deg ${activeDegrees}deg,
              #f59e0b ${activeDegrees}deg ${busyDegrees}deg,
              #d1d5db ${busyDegrees}deg 360deg
            )`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-4xl font-bold text-slate-950">
              {activeCount}
            </span>
            <span className="text-lg font-semibold text-slate-700">
              Active
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <Legend
            color="bg-green-500"
            label="Active"
            value={`${activeCount} (${activePercent}%)`}
          />
          <Legend
            color="bg-orange-400"
            label="Busy"
            value={`${busyCount} (${busyPercent}%)`}
          />
          <Legend
            color="bg-slate-300"
            label="Offline"
            value={`${offlineCount} (${offlinePercent}%)`}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4 text-center">
        <button className="font-semibold text-blue-600">View All Staff</button>
      </div>
    </section>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[14px_1fr_auto] items-center gap-3">
      <span className={`h-3.5 w-3.5 rounded ${color}`} />
      <span className="text-sm text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

export default FieldStaffStatus;