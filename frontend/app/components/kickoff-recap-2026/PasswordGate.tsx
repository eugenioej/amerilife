"use client";

import { useState } from "react";

interface PasswordGateProps {
  children: React.ReactNode;
}

const PAGE_PASSWORD = "Kickoff2026";

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("kickoff-2026-access") === "true";
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password === PAGE_PASSWORD) {
      localStorage.setItem("kickoff-2026-access", "true");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div className="kickoff-page">
      {authorized ? (
        children
      ) : (
        <div className="mx-auto flex min-h-[100vh] max-w-lg items-center justify-center px-6">
          <div className="w-full rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="mb-3 text-center text-3xl font-semibold text-[#244260]">
              Enter Password
            </h1>

            <p className="mb-6 text-center text-sm text-gray-600">
              Please enter the password provided to access Kickoff 2026
              conference materials.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-4 w-full rounded border border-gray-300 px-4 py-3"
              />

              {error && (
                <p className="mb-4 text-center text-sm text-red-600">
                  Incorrect password.
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded bg-[#244260] px-4 py-3 text-white transition hover:bg-[#1d3550]"
              >
                View Conference Materials
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}