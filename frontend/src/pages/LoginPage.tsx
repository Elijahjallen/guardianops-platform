import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroPanel from "../components/HeroPanel";
import { login as loginUser } from "../services/api";

import googleSignInButton from "../assets/images/google-signin-button.png";
import customerIcon from "../assets/icons/customer-icon.svg";
import employeeIcon from "../assets/icons/employee-icon.svg";
import emailIcon from "../assets/icons/email-icon.svg";
import lockIcon from "../assets/icons/lock-icon.svg";

function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<"parent" | "employee">(
    "parent"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn() {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Email address is required.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      const data = await loginUser(email, password);

      const userRole = data.user.role;

      const employeeRoles = ["Admin", "Employee", "Case Manager", "Field Staff"];
      const parentRoles = ["Parent", "Client"];

      const isEmployeeLogin =
        selectedRole === "employee" && employeeRoles.includes(userRole);

      const isParentLogin =
        selectedRole === "parent" && parentRoles.includes(userRole);

      if (!isEmployeeLogin && !isParentLogin) {
        setErrorMessage(
          `This account is registered as ${userRole}. Please select the correct login type.`
        );
        return;
      }

      localStorage.setItem("guardianops-token", data.token);
      localStorage.setItem("guardianops-user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-3">
      <div className="flex min-h-[calc(100vh-24px)] overflow-hidden rounded-[40px] bg-white shadow-sm">
        <HeroPanel />

        <section className="flex w-full items-center justify-center bg-slate-100 px-4 sm:px-6 lg:w-[48%]">
          <div className="w-full max-w-[900px] rounded-[32px] bg-white px-8 py-12 shadow-xl sm:px-10 lg:px-14">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Welcome Back
            </h2>

            <p className="mt-3 text-lg text-slate-700 sm:text-xl">
              Sign in to your GuardianOps Account
            </p>

            <div className="mt-8">
              <p className="mb-3 font-bold text-slate-950">Login as</p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <RoleButton
                  title="Customer / Parent"
                  subtitle="View your case updates"
                  icon={customerIcon}
                  active={selectedRole === "parent"}
                  onClick={() => setSelectedRole("parent")}
                />

                <RoleButton
                  title="Employee"
                  subtitle="Access Employee Portal"
                  icon={employeeIcon}
                  active={selectedRole === "employee"}
                  onClick={() => setSelectedRole("employee")}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="mt-8">
              <label className="mb-2 block font-bold text-slate-950">
                Email Address
              </label>

              <div className="mb-5 flex h-16 items-center gap-4 rounded-xl border border-slate-300 px-5">
                <img src={emailIcon} alt="Email" className="h-7 w-7" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-lg outline-none placeholder:text-slate-400"
                />
              </div>

              <label className="mb-2 block font-bold text-slate-950">
                Password
              </label>

              <div className="flex h-16 items-center gap-4 rounded-xl border border-slate-300 px-5">
                <img src={lockIcon} alt="Password" className="h-7 w-7" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-lg outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-lg font-semibold text-slate-950">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-5 w-5"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-left text-lg font-bold text-blue-600 hover:text-blue-700 sm:text-right"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleSignIn}
                className="mt-7 h-16 w-full rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md transition hover:bg-blue-700"
              >
                Sign In
              </button>

              <div className="my-7 flex items-center gap-5">
                <div className="h-px flex-1 bg-slate-300" />
                <span className="font-bold text-slate-950">or</span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>

              <button
                type="button"
                className="flex h-16 w-full items-center justify-center rounded-xl border border-slate-300 bg-white"
              >
                <img
                  src={googleSignInButton}
                  alt="Google Sign In"
                  className="h-10 object-contain"
                />
              </button>

              <p className="mt-5 text-center font-semibold text-slate-500">
                Don’t Have an Account?{" "}
                <button
                  type="button"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Contact your Administrator
                </button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

type RoleButtonProps = {
  title: string;
  subtitle: string;
  icon: string;
  active: boolean;
  onClick: () => void;
};

function RoleButton({
  title,
  subtitle,
  icon,
  active,
  onClick,
}: RoleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-28 items-center justify-between rounded-xl border px-6 py-4 text-left transition ${
        active
          ? "border-blue-600 bg-blue-50"
          : "border-slate-300 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-5">
        <img src={icon} alt={title} className="h-16 w-16 object-contain" />

        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-sm leading-tight text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={`ml-4 h-7 w-7 shrink-0 rounded-full border-2 ${
          active
            ? "border-blue-600 bg-blue-600 shadow-[inset_0_0_0_5px_white]"
            : "border-slate-400 bg-white"
        }`}
      />
    </button>
  );
}

export default LoginPage;