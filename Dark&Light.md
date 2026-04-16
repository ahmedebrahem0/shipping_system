Subject: Implement Premium Dark/Light Mode with Navbar Toggle

"I want to implement a professional Dark/Light mode system using next-themes and Tailwind CSS. Please follow these requirements strictly:

1. Background Configuration:

Dark Mode: Use a deep base color #020617 with this specific radial gradient overlay:
bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_24%)]

Light Mode: Use a clean bg-slate-50 or bg-white.

2. ThemeToggle Component:

Create a ThemeToggle component using lucide-react (Sun for light mode, Moon for dark mode).

Add a smooth rotation animation or fade effect when switching between icons.

The button should be a rounded-xl or rounded-full ghost button with a subtle hover background.

3. Navbar Integration:

Integrate the ThemeToggle into the existing Navbar component.

Place it on the right side (near the user profile/notifications).

For the Navbar in Dark Mode, apply backdrop-blur-md with a semi-transparent background like bg-slate-950/50 and a thin bottom border border-white/5.

4. Global Implementation:

Update tailwind.config.ts with darkMode: 'class'.

Wrap the application in a ThemeProvider (from next-themes) in the root layout.tsx.

Ensure all dashboard cards, text, and icons throughout the app automatically adapt using Tailwind's dark: prefix (e.g., text-slate-900 dark:text-slate-100).

5. Smooth Transitions:

Apply a global CSS transition in globals.css for background-color and border-color to ensure the switch between modes feels smooth and premium, not instant and jarring."