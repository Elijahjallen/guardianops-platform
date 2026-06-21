import { useEffect, useState } from "react";
import {
  getStaff,
  getYouthProfile,
  updateCase,
  updateYouthProfile,
} from "../../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
  assignedCaseManager?: string | null;
  assignedFieldStaff?: string | null;
  transportDate?: string | null;
  pickupLocation?: string | null;
  destinationLocation?: string | null;
  travelBooked?: boolean;
  flightConfirmation?: string | null;
  hotelConfirmation?: string | null;
  casePriority?: string;
  quoteAmount?: number | null;
  quoteStatus?: string | null;
  quoteSentDate?: string | null;
  quoteApprovedDate?: string | null;
  scheduledPickupTime?: string | null;
  scheduledDropoffTime?: string | null;
  departureAirport?: string | null;
  arrivalAirport?: string | null;
  assignedEscortId?: string | null;
  schedulingStatus?: string | null;
  airlineName?: string | null;
  flightNumber?: string | null;
  flightDeparture?: string | null;
  flightArrival?: string | null;
  hotelName?: string | null;
  hotelCheckIn?: string | null;
  hotelCheckOut?: string | null;
  rentalCarCompany?: string | null;
  rentalConfirmation?: string | null;
  flightCost?: number | null;
  hotelCost?: number | null;
  mealCost?: number | null;
  groundCost?: number | null;
  otherCost?: number | null;
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  status: string;
};

type EditCaseModalProps = {
  isOpen: boolean;
  caseItem: ApiCase | null;
  onClose: () => void;
  onCaseUpdated: () => void;
};

function EditCaseModal({
  isOpen,
  caseItem,
  onClose,
  onCaseUpdated,
}: EditCaseModalProps) {
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const [assignedCaseManager, setAssignedCaseManager] = useState("");
  const [assignedFieldStaff, setAssignedFieldStaff] = useState("");
  const [transportDate, setTransportDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [travelBooked, setTravelBooked] = useState(false);
  const [flightConfirmation, setFlightConfirmation] = useState("");
  const [hotelConfirmation, setHotelConfirmation] = useState("");
  const [casePriority, setCasePriority] = useState("Standard");

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteStatus, setQuoteStatus] = useState("Pending");
  const [quoteSentDate, setQuoteSentDate] = useState("");
  const [quoteApprovedDate, setQuoteApprovedDate] = useState("");

  const [scheduledPickupTime, setScheduledPickupTime] = useState("");
  const [scheduledDropoffTime, setScheduledDropoffTime] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [assignedEscortId, setAssignedEscortId] = useState("");
  const [schedulingStatus, setSchedulingStatus] = useState("Not Scheduled");

  const [airlineName, setAirlineName] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDeparture, setFlightDeparture] = useState("");
  const [flightArrival, setFlightArrival] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [rentalCarCompany, setRentalCarCompany] = useState("");
  const [rentalConfirmation, setRentalConfirmation] = useState("");

  const [flightCost, setFlightCost] = useState("");
  const [hotelCost, setHotelCost] = useState("");
  const [mealCost, setMealCost] = useState("");
  const [groundCost, setGroundCost] = useState("");
  const [otherCost, setOtherCost] = useState("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [identifiesNonBinary, setIdentifiesNonBinary] = useState(false);
  const [identifiesTransgender, setIdentifiesTransgender] = useState(false);
  const [pronouns, setPronouns] = useState("");
  const [autismSpectrumDisorder, setAutismSpectrumDisorder] = useState(false);
  const [autismSpectrumLevel, setAutismSpectrumLevel] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [marks, setMarks] = useState("");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [participatingBehavior, setParticipatingBehavior] = useState("");
  const [impulsiveBehavior, setImpulsiveBehavior] = useState("");
  const [siblingsInHome, setSiblingsInHome] = useState("");
  const [familyDynamics, setFamilyDynamics] = useState("");
  const [bedroomLayout, setBedroomLayout] = useState("");
  const [sportsOrHobbies, setSportsOrHobbies] = useState("");
  const [athleticLevel, setAthleticLevel] = useState("");
  const [custody, setCustody] = useState("");
  const [biologicalOrAdopted, setBiologicalOrAdopted] = useState("");

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStaff() {
      try {
        const staff = await getStaff();
        setStaffList(staff);
      } catch (error) {
        console.error("Failed to load staff:", error);
      }
    }

    if (isOpen) {
      loadStaff();
    }
  }, [isOpen]);

  useEffect(() => {
    async function loadYouthProfile() {
      if (!caseItem?.id) return;

      try {
        const profile = await getYouthProfile(caseItem.id);

        setFirstName(profile.firstName || "");
        setMiddleName(profile.middleName || "");
        setLastName(profile.lastName || "");
        setPreferredName(profile.preferredName || "");
        setDateOfBirth(formatInputDate(profile.dateOfBirth || ""));
        setGender(profile.gender || "");
        setIdentifiesNonBinary(Boolean(profile.identifiesNonBinary));
        setIdentifiesTransgender(Boolean(profile.identifiesTransgender));
        setPronouns(profile.pronouns || "");
        setAutismSpectrumDisorder(Boolean(profile.autismSpectrumDisorder));
        setAutismSpectrumLevel(profile.autismSpectrumLevel || "");
        setHeight(profile.height || "");
        setWeight(profile.weight || "");
        setHairColor(profile.hairColor || "");
        setEyeColor(profile.eyeColor || "");
        setMarks(profile.marks || "");
        setLikes(profile.likes || "");
        setDislikes(profile.dislikes || "");
        setParticipatingBehavior(profile.participatingBehavior || "");
        setImpulsiveBehavior(profile.impulsiveBehavior || "");
        setSiblingsInHome(profile.siblingsInHome || "");
        setFamilyDynamics(profile.familyDynamics || "");
        setBedroomLayout(profile.bedroomLayout || "");
        setSportsOrHobbies(profile.sportsOrHobbies || "");
        setAthleticLevel(profile.athleticLevel || "");
        setCustody(profile.custody || "");
        setBiologicalOrAdopted(profile.biologicalOrAdopted || "");
      } catch {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setPreferredName("");
        setDateOfBirth("");
        setGender("");
      }
    }

    if (isOpen && caseItem) {
      loadYouthProfile();
    }
  }, [isOpen, caseItem]);

  useEffect(() => {
    if (caseItem) {
      setClientName(caseItem.clientName);
      setStatus(caseItem.status);
      setDestination(caseItem.destination);
      setPickupDate(formatInputDate(caseItem.pickupDate));
      setAssignedCaseManager(caseItem.assignedCaseManager || "");
      setAssignedFieldStaff(caseItem.assignedFieldStaff || "");
      setTransportDate(formatInputDate(caseItem.transportDate || ""));
      setPickupLocation(caseItem.pickupLocation || "");
      setDestinationLocation(caseItem.destinationLocation || "");
      setTravelBooked(Boolean(caseItem.travelBooked));
      setFlightConfirmation(caseItem.flightConfirmation || "");
      setHotelConfirmation(caseItem.hotelConfirmation || "");
      setCasePriority(caseItem.casePriority || "Standard");
      setQuoteAmount(caseItem.quoteAmount?.toString() || "");
      setQuoteStatus(caseItem.quoteStatus || "Pending");
      setQuoteSentDate(formatInputDate(caseItem.quoteSentDate || ""));
      setQuoteApprovedDate(formatInputDate(caseItem.quoteApprovedDate || ""));
      setScheduledPickupTime(formatInputDateTime(caseItem.scheduledPickupTime || ""));
      setScheduledDropoffTime(formatInputDateTime(caseItem.scheduledDropoffTime || ""));
      setDepartureAirport(caseItem.departureAirport || "");
      setArrivalAirport(caseItem.arrivalAirport || "");
      setAssignedEscortId(caseItem.assignedEscortId || "");
      setSchedulingStatus(caseItem.schedulingStatus || "Not Scheduled");
      setAirlineName(caseItem.airlineName || "");
      setFlightNumber(caseItem.flightNumber || "");
      setFlightDeparture(formatInputDateTime(caseItem.flightDeparture || ""));
      setFlightArrival(formatInputDateTime(caseItem.flightArrival || ""));
      setHotelName(caseItem.hotelName || "");
      setHotelCheckIn(formatInputDate(caseItem.hotelCheckIn || ""));
      setHotelCheckOut(formatInputDate(caseItem.hotelCheckOut || ""));
      setRentalCarCompany(caseItem.rentalCarCompany || "");
      setRentalConfirmation(caseItem.rentalConfirmation || "");
      setFlightCost(caseItem.flightCost?.toString() || "");
      setHotelCost(caseItem.hotelCost?.toString() || "");
      setMealCost(caseItem.mealCost?.toString() || "");
      setGroundCost(caseItem.groundCost?.toString() || "");
      setOtherCost(caseItem.otherCost?.toString() || "");
    }
  }, [caseItem]);

  if (!isOpen || !caseItem) return null;

  const caseManagers = staffList.filter(
    (staff) => staff.role === "Case Manager" && staff.status !== "Inactive"
  );

  const fieldStaff = staffList.filter(
    (staff) =>
      (staff.role === "Field Staff" ||
        staff.role === "Field Transport Specialist") &&
      staff.status !== "Inactive"
  );

  async function handleSave() {
    if (!caseItem) return;

    setMessage("");

    try {
      await updateCase(caseItem.id, {
        caseNumber: caseItem.caseNumber,
        clientName,
        status,
        destination,
        pickupDate,
        staffName: undefined,
        assignedCaseManager: assignedCaseManager || undefined,
        assignedFieldStaff: assignedFieldStaff || undefined,
        transportDate: transportDate || undefined,
        pickupLocation: pickupLocation || undefined,
        destinationLocation: destinationLocation || undefined,
        travelBooked,
        flightConfirmation: flightConfirmation || undefined,
        hotelConfirmation: hotelConfirmation || undefined,
        casePriority,
        quoteAmount: quoteAmount ? Number(quoteAmount) : undefined,
        quoteStatus,
        quoteSentDate: quoteSentDate || undefined,
        quoteApprovedDate: quoteApprovedDate || undefined,
        scheduledPickupTime: scheduledPickupTime || undefined,
        scheduledDropoffTime: scheduledDropoffTime || undefined,
        departureAirport: departureAirport || undefined,
        arrivalAirport: arrivalAirport || undefined,
        assignedEscortId: assignedEscortId || undefined,
        schedulingStatus,
        airlineName: airlineName || undefined,
        flightNumber: flightNumber || undefined,
        flightDeparture: flightDeparture || undefined,
        flightArrival: flightArrival || undefined,
        hotelName: hotelName || undefined,
        hotelCheckIn: hotelCheckIn || undefined,
        hotelCheckOut: hotelCheckOut || undefined,
        rentalCarCompany: rentalCarCompany || undefined,
        rentalConfirmation: rentalConfirmation || undefined,
        flightCost: flightCost ? Number(flightCost) : undefined,
        hotelCost: hotelCost ? Number(hotelCost) : undefined,
        mealCost: mealCost ? Number(mealCost) : undefined,
        groundCost: groundCost ? Number(groundCost) : undefined,
        otherCost: otherCost ? Number(otherCost) : undefined,
      });

      if (firstName && lastName && dateOfBirth && gender) {
        await updateYouthProfile(caseItem.id, {
          firstName,
          middleName,
          lastName,
          preferredName,
          dateOfBirth,
          gender,
          identifiesNonBinary,
          identifiesTransgender,
          pronouns,
          autismSpectrumDisorder,
          autismSpectrumLevel,
          height,
          weight,
          hairColor,
          eyeColor,
          marks,
          likes,
          dislikes,
          participatingBehavior,
          impulsiveBehavior,
          siblingsInHome,
          familyDynamics,
          bedroomLayout,
          sportsOrHobbies,
          athleticLevel,
          custody,
          biologicalOrAdopted,
        });
      }

      onCaseUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update case:", error);
      setMessage("Failed to update case or youth profile.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Review Case</h2>
            <p className="mt-1 text-slate-500">
              Review intake details, assign staff, manage quotes, schedule
              transport, track bookings, and manage expenses.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <SectionTitle title="Case Review" />

          <ReadOnlyField label="Case Number" value={caseItem.caseNumber} />

          <Field label="Client Name" value={clientName} onChange={setClientName} />

          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              "Pending",
              "Under Review",
              "Scheduled",
              "Ready For Transport",
              "In Transit",
              "Completed",
              "Cancelled",
            ]}
          />

          <Select
            label="Priority"
            value={casePriority}
            onChange={setCasePriority}
            options={["Standard", "High", "Urgent"]}
          />

          <Select
            label="Assigned Case Manager"
            value={assignedCaseManager}
            onChange={setAssignedCaseManager}
            options={caseManagers.map((staff) => staff.name)}
            placeholder="Select case manager"
          />

          <Select
            label="Assigned Field Staff"
            value={assignedFieldStaff}
            onChange={setAssignedFieldStaff}
            options={fieldStaff.map((staff) => staff.name)}
            placeholder="Select field staff"
          />

          <Field label="Pickup Date" type="date" value={pickupDate} onChange={setPickupDate} />
          <Field label="Transport Date" type="date" value={transportDate} onChange={setTransportDate} />
          <Field label="Pickup Location" value={pickupLocation} onChange={setPickupLocation} />
          <Field label="Destination Location" value={destinationLocation} onChange={setDestinationLocation} />
          <Field label="Destination" value={destination} onChange={setDestination} />

          <Select
            label="Travel Booked"
            value={travelBooked ? "Yes" : "No"}
            onChange={(value) => setTravelBooked(value === "Yes")}
            options={["No", "Yes"]}
          />

          <Field label="Flight Confirmation" value={flightConfirmation} onChange={setFlightConfirmation} />
          <Field label="Hotel Confirmation" value={hotelConfirmation} onChange={setHotelConfirmation} />

          <SectionTitle title="Youth Profile" />

          <Field label="First Name" value={firstName} onChange={setFirstName} />
          <Field label="Middle Name" value={middleName} onChange={setMiddleName} />
          <Field label="Last Name" value={lastName} onChange={setLastName} />
          <Field label="Preferred Name" value={preferredName} onChange={setPreferredName} />
          <Field label="Date of Birth" type="date" value={dateOfBirth} onChange={setDateOfBirth} />
          <Field label="Gender" value={gender} onChange={setGender} />

          <Select
            label="Identifies Non-Binary"
            value={identifiesNonBinary ? "Yes" : "No"}
            onChange={(value) => setIdentifiesNonBinary(value === "Yes")}
            options={["No", "Yes"]}
          />

          <Select
            label="Identifies Transgender"
            value={identifiesTransgender ? "Yes" : "No"}
            onChange={(value) => setIdentifiesTransgender(value === "Yes")}
            options={["No", "Yes"]}
          />

          <Field label="Pronouns" value={pronouns} onChange={setPronouns} />

          <Select
            label="Autism Spectrum Disorder"
            value={autismSpectrumDisorder ? "Yes" : "No"}
            onChange={(value) => setAutismSpectrumDisorder(value === "Yes")}
            options={["No", "Yes"]}
          />

          <Field label="Autism Spectrum Level" value={autismSpectrumLevel} onChange={setAutismSpectrumLevel} />
          <Field label="Height" value={height} onChange={setHeight} />
          <Field label="Weight" value={weight} onChange={setWeight} />
          <Field label="Hair Color" value={hairColor} onChange={setHairColor} />
          <Field label="Eye Color" value={eyeColor} onChange={setEyeColor} />
          <TextArea label="Marks / Identifiers" value={marks} onChange={setMarks} />
          <TextArea label="Likes" value={likes} onChange={setLikes} />
          <TextArea label="Dislikes" value={dislikes} onChange={setDislikes} />
          <TextArea label="Participating Behavior" value={participatingBehavior} onChange={setParticipatingBehavior} />
          <TextArea label="Impulsive Behavior" value={impulsiveBehavior} onChange={setImpulsiveBehavior} />
          <TextArea label="Siblings in Home" value={siblingsInHome} onChange={setSiblingsInHome} />
          <TextArea label="Family Dynamics" value={familyDynamics} onChange={setFamilyDynamics} />
          <TextArea label="Bedroom Layout" value={bedroomLayout} onChange={setBedroomLayout} />
          <TextArea label="Sports or Hobbies" value={sportsOrHobbies} onChange={setSportsOrHobbies} />
          <Field label="Athletic Level" value={athleticLevel} onChange={setAthleticLevel} />
          <TextArea label="Custody" value={custody} onChange={setCustody} />
          <Field label="Biological or Adopted" value={biologicalOrAdopted} onChange={setBiologicalOrAdopted} />

          <SectionTitle title="Quote Management" />

          <Field label="Quote Amount" type="number" value={quoteAmount} onChange={setQuoteAmount} />

          <Select
            label="Quote Status"
            value={quoteStatus}
            onChange={setQuoteStatus}
            options={["Pending", "Drafted", "Sent", "Approved", "Declined"]}
          />

          <Field label="Quote Sent Date" type="date" value={quoteSentDate} onChange={setQuoteSentDate} />
          <Field label="Quote Approved Date" type="date" value={quoteApprovedDate} onChange={setQuoteApprovedDate} />

          <SectionTitle title="Scheduling" />

          <Select
            label="Scheduling Status"
            value={schedulingStatus}
            onChange={setSchedulingStatus}
            options={[
              "Not Scheduled",
              "Scheduling Pending",
              "Scheduled",
              "Travel Booked",
              "In Progress",
              "Completed",
              "Cancelled",
            ]}
          />

          <Select
            label="Assigned Escort"
            value={assignedEscortId}
            onChange={setAssignedEscortId}
            options={fieldStaff.map((staff) => staff.id)}
            placeholder="Select escort"
          />

          <Field label="Scheduled Pickup Time" type="datetime-local" value={scheduledPickupTime} onChange={setScheduledPickupTime} />
          <Field label="Scheduled Dropoff Time" type="datetime-local" value={scheduledDropoffTime} onChange={setScheduledDropoffTime} />
          <Field label="Departure Airport" value={departureAirport} onChange={setDepartureAirport} />
          <Field label="Arrival Airport" value={arrivalAirport} onChange={setArrivalAirport} />

          <SectionTitle title="Travel Booking Tracker" />

          <Field label="Airline" value={airlineName} onChange={setAirlineName} />
          <Field label="Flight Number" value={flightNumber} onChange={setFlightNumber} />
          <Field label="Flight Departure" type="datetime-local" value={flightDeparture} onChange={setFlightDeparture} />
          <Field label="Flight Arrival" type="datetime-local" value={flightArrival} onChange={setFlightArrival} />
          <Field label="Hotel Name" value={hotelName} onChange={setHotelName} />
          <Field label="Hotel Check-In" type="date" value={hotelCheckIn} onChange={setHotelCheckIn} />
          <Field label="Hotel Check-Out" type="date" value={hotelCheckOut} onChange={setHotelCheckOut} />
          <Field label="Rental Car Company" value={rentalCarCompany} onChange={setRentalCarCompany} />
          <Field label="Rental Confirmation" value={rentalConfirmation} onChange={setRentalConfirmation} />

          <SectionTitle title="Expense Tracking" />

          <Field label="Flight Cost" type="number" value={flightCost} onChange={setFlightCost} />
          <Field label="Hotel Cost" type="number" value={hotelCost} onChange={setHotelCost} />
          <Field label="Meal Cost" type="number" value={mealCost} onChange={setMealCost} />
          <Field label="Ground Transportation Cost" type="number" value={groundCost} onChange={setGroundCost} />
          <Field label="Other Cost" type="number" value={otherCost} onChange={setOtherCost} />
        </div>

        <div className="sticky bottom-0 mt-8 flex justify-end gap-4 border-t border-slate-200 bg-white pt-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="md:col-span-2 border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
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

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatInputDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function formatInputDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export default EditCaseModal;