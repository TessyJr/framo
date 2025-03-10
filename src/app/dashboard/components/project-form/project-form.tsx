"use client";

import { useState } from "react";
import { createProject } from "./actions";
import { User } from "@supabase/supabase-js";

export default function ProjectForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    await createProject(user, formData);

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">Project Form</h1>

      <form action={handleCreateProject} className="space-y-4">
        <div>
          <label htmlFor="projectName">Project Name</label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            className="w-full border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="projectDescription">Project Description</label>
          <input
            id="projectDescription"
            name="projectDescription"
            type="text"
            className="w-full border p-2"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-500 p-2 text-white"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
