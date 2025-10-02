// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Briefcase, Users, ClipboardList } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo">TalentFlow</h1>
      </div>
      <nav className="px-4">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <Briefcase className="mr-3 h-5 w-5" />
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/candidates"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <Users className="mr-3 h-5 w-5" />
              Candidates
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/assessments"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Assessments
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}