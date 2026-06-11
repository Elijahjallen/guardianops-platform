import backgroundImage from "../assets/images/BackGroundImage.png";
import guardianLogo from "../assets/images/GuardianOps Logo.png";

function HeroPanel() {
  return (
    <div
      className="w-1/2 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 flex flex-col items-center pt-12">
        <img
          src={guardianLogo}
          alt="GuardianOps Logo"
          className="w-64 mb-6"
        />

        <h1 className="text-6xl font-bold text-white">
          GUARDIANOPS
        </h1>
      </div>
    </div>
  );
}

export default HeroPanel;