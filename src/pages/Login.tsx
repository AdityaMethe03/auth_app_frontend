import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, Lock, CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import type LoginData from "@/models/LoginData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/store";
import OAuth2Buttons from "@/components/OAuth2Buttons";
function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    tenantId: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    //validation:
    if (loginData.email.trim() === "") {
      toast.error("Input required !");
      return;
    }
    if (loginData.tenantId.trim() === "") {
      toast.error("Tenant code is required.");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Input required !");
      return;
    }

    //server call for login
    // console.log(event.target);
    // console.log(loginData);

    try {
      setLoading(true);
      setError(null);
      // const userInfo = await loginUser(loginData);

      //login function : useAuth
      await login(loginData);
      toast.success("Login success");
      // console.log(userInfo);
      navigate("/dashboard");

      //save the current user logged in informations
      //localstorage
    } catch (error: any) {
      console.error("Login request failed", error);
      const status = error?.response?.status;
      const message =
        status === 400 || status === 401
          ? "Authentication failed!"
          : "Unable to sign in. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl rounded-2xl p-6">
          <CardContent>
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-center"
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-muted-foreground mt-2"
            >
              Login to access your authentication app
            </motion.p>

            {/* error section */}
            {error && (
              <div className="mt-6">
                <Alert variant={"destructive"}>
                  <CheckCircle2Icon />
                  <AlertTitle>
                    {error}
                  </AlertTitle>
                </Alert>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant code</Label>
                <Input id="tenantId" name="tenantId" value={loginData.tenantId} onChange={handleInputChange} placeholder="your-tenant" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    name="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                disabled={loading}
                className="w-full cursor-pointer rounded-2xl text-lg"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Please wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-[1px] bg-border"></div>
                <span className="text-muted-foreground text-sm">OR</span>
                <div className="flex-1 h-[1px] bg-border"></div>
              </div>

              {/* OAuth Buttons */}
              <OAuth2Buttons tenantId={loginData.tenantId} />
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
