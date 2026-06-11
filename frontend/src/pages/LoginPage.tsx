import HeroPanel from "../components/HeroPanel";

function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <HeroPanel />

      <div className="w-1/2 flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-[650px]">
          <h2 className="text-5xl font-bold mb-4">
            Welcome Back
          </h2>

          <p className="text-xl text-slate-500">
            Sign in to your GuardianOps Account
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;