import { useState } from "react";
import { submitIntakeForm } from "../services/api";

function IntakeFormPage() {
  const [formData, setFormData] = useState({
    submittedBy: "Parent / Guardian",
    requesterName: "",
    requesterPhone: "",
    requesterEmail: "",
    relationshipToYouth: "",

    clientName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    identifiesNonBinary: false,
    identifiesTransgender: false,
    pronouns: "",
    autismSpectrumDisorder: false,
    autismSpectrumLevel: "",
    height: "",
    weight: "",
    hairColor: "",
    eyeColor: "",
    marks: "",
    likes: "",
    dislikes: "",
    participatingBehavior: "",
    impulsiveBehavior: "",
    siblingsInHome: "",
    familyDynamics: "",
    bedroomLayout: "",
    sportsOrHobbies: "",
    athleticLevel: "",
    custody: "",
    biologicalOrAdopted: "",
  });

  const [message, setMessage] = useState("");

  function updateField(field: string, value: string | boolean) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    setMessage("");

    if (!formData.requesterName.trim()) {
      setMessage("Requester name is required.");
      return;
    }

    if (!formData.requesterPhone.trim()) {
      setMessage("Requester phone is required.");
      return;
    }

    if (!formData.requesterEmail.trim()) {
      setMessage("Requester email is required.");
      return;
    }

    if (!formData.clientName.trim()) {
      setMessage("Client or organization name is required.");
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage("Youth first and last name are required.");
      return;
    }

    if (!formData.dateOfBirth.trim()) {
      setMessage("Youth date of birth is required.");
      return;
    }

    try {
      const result = await submitIntakeForm(formData);
      setMessage(
        `Request submitted successfully. Case Number: ${result.caseNumber}`
      );
    } catch (error) {
      console.error("Failed to submit intake:", error);
      setMessage("Failed to submit request.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            GuardianOps Transport Services
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Request a Transport Quote
          </h1>

          <p className="mt-2 max-w-3xl text-slate-500">
            Complete this form to request a youth transport quote.
            This form may be completed by a parent, guardian, agency, facility, or internal employee.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
            {message}
          </div>
        )}

        <SectionTitle
          title="Requester Information"
          description="Tell us who is submitting this request."
        />

        <section className="mt-5 grid gap-5 md:grid-cols-2">
          <Select
            label="Submitted By"
            value={formData.submittedBy}
            onChange={(v) => updateField("submittedBy", v)}
            options={[
              "Parent / Guardian",
              "Internal Employee",
              "Agency / Facility",
              "Other",
            ]}
          />

          <Field
            label="Relationship to Youth"
            value={formData.relationshipToYouth}
            onChange={(v) => updateField("relationshipToYouth", v)}
            placeholder="Parent, guardian, case worker, intake coordinator..."
          />

          <Field
            label="Requester Name"
            value={formData.requesterName}
            onChange={(v) => updateField("requesterName", v)}
          />

          <Field
            label="Requester Phone"
            value={formData.requesterPhone}
            onChange={(v) => updateField("requesterPhone", v)}
          />

          <Field
            label="Requester Email"
            value={formData.requesterEmail}
            onChange={(v) => updateField("requesterEmail", v)}
          />

          <Field
            label="Client / Organization Name"
            value={formData.clientName}
            onChange={(v) => updateField("clientName", v)}
            placeholder="Family, agency, facility, or referring organization"
          />
        </section>

        <SectionTitle
          title="Youth Information"
          description="Provide the basic information needed to begin transport review."
        />

        <section className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="First Name"
            value={formData.firstName}
            onChange={(v) => updateField("firstName", v)}
          />

          <Field
            label="Middle Name"
            value={formData.middleName}
            onChange={(v) => updateField("middleName", v)}
          />

          <Field
            label="Last Name"
            value={formData.lastName}
            onChange={(v) => updateField("lastName", v)}
          />

          <Field
            label="Preferred Name"
            value={formData.preferredName}
            onChange={(v) => updateField("preferredName", v)}
          />

          <Field
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(v) => updateField("dateOfBirth", v)}
          />

          <Field
            label="Gender"
            value={formData.gender}
            onChange={(v) => updateField("gender", v)}
          />

          <Field
            label="Pronouns"
            value={formData.pronouns}
            onChange={(v) => updateField("pronouns", v)}
          />

          <Field
            label="Custody"
            value={formData.custody}
            onChange={(v) => updateField("custody", v)}
          />

          <Field
            label="Biological or Adopted"
            value={formData.biologicalOrAdopted}
            onChange={(v) => updateField("biologicalOrAdopted", v)}
          />

          <Checkbox
            label="Identifies as Non-Binary"
            checked={formData.identifiesNonBinary}
            onChange={(v) => updateField("identifiesNonBinary", v)}
          />

          <Checkbox
            label="Identifies as Transgender"
            checked={formData.identifiesTransgender}
            onChange={(v) => updateField("identifiesTransgender", v)}
          />
        </section>

        <SectionTitle
          title="Medical, Behavioral, and Physical Details"
          description="These details help the operations team prepare a safe quote and transport plan."
        />

        <section className="mt-5 grid gap-5 md:grid-cols-2">
          <Checkbox
            label="Autism Spectrum Disorder"
            checked={formData.autismSpectrumDisorder}
            onChange={(v) => updateField("autismSpectrumDisorder", v)}
          />

          <Field
            label="Autism Spectrum Level"
            value={formData.autismSpectrumLevel}
            onChange={(v) => updateField("autismSpectrumLevel", v)}
          />

          <Field
            label="Height"
            value={formData.height}
            onChange={(v) => updateField("height", v)}
          />

          <Field
            label="Weight"
            value={formData.weight}
            onChange={(v) => updateField("weight", v)}
          />

          <Field
            label="Hair Color"
            value={formData.hairColor}
            onChange={(v) => updateField("hairColor", v)}
          />

          <Field
            label="Eye Color"
            value={formData.eyeColor}
            onChange={(v) => updateField("eyeColor", v)}
          />

          <TextArea
            label="Identifying Marks"
            value={formData.marks}
            onChange={(v) => updateField("marks", v)}
          />

          <TextArea
            label="Likes"
            value={formData.likes}
            onChange={(v) => updateField("likes", v)}
          />

          <TextArea
            label="Dislikes"
            value={formData.dislikes}
            onChange={(v) => updateField("dislikes", v)}
          />

          <TextArea
            label="Participating Behavior"
            value={formData.participatingBehavior}
            onChange={(v) => updateField("participatingBehavior", v)}
          />

          <TextArea
            label="Impulsive Behavior"
            value={formData.impulsiveBehavior}
            onChange={(v) => updateField("impulsiveBehavior", v)}
          />

          <TextArea
            label="Siblings in the Home"
            value={formData.siblingsInHome}
            onChange={(v) => updateField("siblingsInHome", v)}
          />

          <TextArea
            label="Family Dynamics"
            value={formData.familyDynamics}
            onChange={(v) => updateField("familyDynamics", v)}
          />

          <TextArea
            label="Bedroom Layout"
            value={formData.bedroomLayout}
            onChange={(v) => updateField("bedroomLayout", v)}
          />

          <TextArea
            label="Sports or Hobbies"
            value={formData.sportsOrHobbies}
            onChange={(v) => updateField("sportsOrHobbies", v)}
          />

          <Field
            label="Athletic Level"
            value={formData.athleticLevel}
            onChange={(v) => updateField("athleticLevel", v)}
          />
        </section>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-bold text-slate-950">What happens next?</p>

          <p className="mt-2 text-slate-600">
            Once submitted, a team member will review the request, prepare quote
            details and follow up with you.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
          >
            Submit Quote Request
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-1 text-slate-500">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-950">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5"
      />
      {label}
    </label>
  );
}

export default IntakeFormPage;