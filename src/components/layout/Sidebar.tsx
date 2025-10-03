// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Briefcase, Users, ClipboardList, LayoutDashboard } from "lucide-react"; // <-- Import LayoutDashboard icon

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo">TalentFlow</h1>
      </div>
      <nav className="px-4">
        <ul>
          {/* Dashboard Link */}
          <li>
            <NavLink
              to="/app"
              end // Use 'end' to prevent it from matching child routes
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`
              }
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/app/jobs" // <-- Update paths to match nesting
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
              to="/app/candidates" // <-- Update paths to match nesting
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
              to="/app/assessments" // <-- Update paths to match nesting
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