import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function Auth() {
  const { setUser,user } = useUserContext();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   useEffect(() => {
      if (user) {
        navigate("/admin");
      }else{
         toast.warning("You need to log in first.");
      }
    }, [user, navigate]);
  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
    setFormData({ username: "", email: "", password: "" });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { username, email, password } = formData;

    try {
      const response = isSignIn
        ? await api.post("/auth/login", { email, password })
        : await api.post("/auth/signup", { username, email, password });

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          token: response.data.token,
          username: response.data.username,
        })
      );

      setUser({
        token: response.data.token,
        username: response.data.username,
      });

      toast.success(`Welcome ${response.data.username}`);
      setFormData({ username: "", email: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-[var(--color-surface)]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary)]">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          {!isSignIn && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[var(--color-primary)] text-white font-semibold rounded hover:bg-blue-800 transition"
          >
            {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
          {error && (
            <p className="text-[var(--color-danger)] text-sm text-center mt-2">
              {error}
            </p>
          )}
          <p className="text-center text-sm text-[var(--color-muted)]">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={toggleAuth}
              className="text-[var(--color-primary)] cursor-pointer font-medium hover:underline"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
