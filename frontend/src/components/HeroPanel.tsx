import backgroundImage from "../assets/images/background-image.png";
import guardianLogo from "../assets/logos/guardianops-logo.png";

import shieldCheckIcon from "../assets/icons/shield-check.svg";
import peopleIcon from "../assets/icons/people-icon.svg";
import locationPinIcon from "../assets/icons/location-pin.svg";
import securityLockIcon from "../assets/icons/security-lock.svg";

function HeroPanel() {
  return (
    <section
      className="relative hidden min-h-screen w-1/2 overflow-hidden bg-cover lg:block"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "20% center",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/15" />

      <div className="relative z-10 flex h-full flex-col items-center px-12 py-10">
        <img
          src={guardianLogo}
          alt="GuardianOps Logo"
          className="mb-4 w-32"
        />

        <h1 className="text-center text-5xl font-extrabold tracking-tight text-slate-950 drop-shadow-sm">
          GUARDIAN<span className="text-amber-400">OPS</span>
        </h1>

        <p className="mt-2 text-2xl font-extrabold text-slate-950">
          Secure Transport. Trusted Care.
        </p>

        <div className="mt-auto mb-20 w-full max-w-md space-y-6">
          <FeatureItem
            icon={shieldCheckIcon}
            title="Secure"
            description="Protecting Sensitive Data With Enterprise Grade Security"
          />

          <FeatureItem
            icon={peopleIcon}
            title="Reliable"
            description="Coordinated Transport Operations You Can Trust"
          />

          <FeatureItem
            icon={locationPinIcon}
            title="Transparent"
            description="Real-Time Updates and Complete Visibility"
          />
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 text-sm font-semibold text-white">
          <img
            src={securityLockIcon}
            alt="Security Lock"
            className="h-9 w-9 object-contain"
          />
          <span>Your data is protected with bank level encryption</span>
        </div>
      </div>
    </section>
  );
}

type FeatureItemProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <img src={icon} alt="" className="h-14 w-14 shrink-0 object-contain" />

      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-white">{description}</p>
      </div>
    </div>
  );
}

export default HeroPanel;