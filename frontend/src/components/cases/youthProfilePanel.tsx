import { useEffect, useState } from "react";
import { getYouthProfile } from "../../services/api";

type YouthProfile = {
  id: string;
  caseId: string;
  caseNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  preferredName?: string | null;
  dateOfBirth: string;
  gender: string;
  identifiesNonBinary: boolean;
  identifiesTransgender: boolean;
  pronouns?: string | null;
  autismSpectrumDisorder: boolean;
  autismSpectrumLevel?: string | null;
  height?: string | null;
  weight?: string | null;
  hairColor?: string | null;
  eyeColor?: string | null;
  marks?: string | null;
  likes?: string | null;
  dislikes?: string | null;
  participatingBehavior?: string | null;
  impulsiveBehavior?: string | null;
  siblingsInHome?: string | null;
  familyDynamics?: string | null;
  bedroomLayout?: string | null;
  sportsOrHobbies?: string | null;
  athleticLevel?: string | null;
  custody?: string | null;
  biologicalOrAdopted?: string | null;
};

function YouthProfilePanel({ caseId }: { caseId: string }) {
  const [profile, setProfile] = useState<YouthProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getYouthProfile(caseId);
        setProfile(data);
      } catch {
        setProfile(null);
      }
    }

    loadProfile();
  }, [caseId]);

  if (!profile) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Youth Profile</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Detail label="Name" value={`${profile.firstName} ${profile.middleName || ""} ${profile.lastName}`} />
        <Detail label="Preferred Name" value={profile.preferredName} />
        <Detail label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
        <Detail label="Gender" value={profile.gender} />
        <Detail label="Pronouns" value={profile.pronouns} />
        <Detail label="Non-Binary" value={profile.identifiesNonBinary ? "Yes" : "No"} />
        <Detail label="Transgender" value={profile.identifiesTransgender ? "Yes" : "No"} />
        <Detail label="Autism Spectrum Disorder" value={profile.autismSpectrumDisorder ? "Yes" : "No"} />
        <Detail label="Autism Spectrum Level" value={profile.autismSpectrumLevel} />
        <Detail label="Height" value={profile.height} />
        <Detail label="Weight" value={profile.weight} />
        <Detail label="Hair Color" value={profile.hairColor} />
        <Detail label="Eye Color" value={profile.eyeColor} />
        <Detail label="Marks" value={profile.marks} />
        <Detail label="Likes" value={profile.likes} />
        <Detail label="Dislikes" value={profile.dislikes} />
        <Detail label="Participating Behavior" value={profile.participatingBehavior} />
        <Detail label="Impulsive Behavior" value={profile.impulsiveBehavior} />
        <Detail label="Siblings in Home" value={profile.siblingsInHome} />
        <Detail label="Family Dynamics" value={profile.familyDynamics} />
        <Detail label="Bedroom Layout" value={profile.bedroomLayout} />
        <Detail label="Sports / Hobbies" value={profile.sportsOrHobbies} />
        <Detail label="Athletic Level" value={profile.athleticLevel} />
        <Detail label="Custody" value={profile.custody} />
        <Detail label="Biological or Adopted" value={profile.biologicalOrAdopted} />
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default YouthProfilePanel;