import packageJson from '../../../package.json'

/**
 * AuthBrandPanel is the left-hand panel of the auth pages
 */
export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute inset-0 overflow-hidden rounded-br-[6rem] bg-primary xl:rounded-br-[8rem]">
        <div className="auth-blob-drift absolute -right-20 -bottom-20 size-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -top-16 -left-16 size-56 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-10 text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-semibold tracking-tight">TaskDesk</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <TaskStackIllustration className="w-full max-w-[280px]" />
        </div>

        <div className="space-y-3">
          <p className="max-w-xs text-sm text-primary-foreground/70">
            Assign, track, and close tasks across your team, in one shared workspace.
          </p>
          <p className="text-xs text-primary-foreground/50">
            TaskDesk v{packageJson.version} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Abstract stack-of-task-cards motif. The two back cards carry colorful
 * skeleton placeholder bars, while the front card has already resolved: a
 * solid check badge draws itself in and a status pill breathes. Cards
 * drift gently up and down, out of phase, so the whole thing reads as
 * "alive" without competing with the form. Every animation backs off
 * under prefers-reduced-motion (see index.css).
 */
function TaskStackIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 220" fill="none" className={className}>
      {/* Card 1 */}
      <g className="auth-float-a">
        <rect x="40" y="18" width="200" height="56" rx="10" className="stroke-current opacity-15" strokeWidth="1.5" />
        <circle cx="58" cy="36" r="4" fill="#38bdf8" opacity="0.85" />
        <rect x="74" y="31" width="118" height="6" rx="3" fill="#38bdf8" opacity="0.2" />
        <rect x="74" y="45" width="78" height="6" rx="3" fill="#38bdf8" opacity="0.14" />
      </g>

      {/* Card 2 */}
      <g className="auth-float-b">
        <rect x="24" y="82" width="232" height="56" rx="10" className="stroke-current opacity-30" strokeWidth="1.5" />
        <circle cx="44" cy="100" r="4" fill="#a78bfa" opacity="0.85" />
        <rect x="60" y="95" width="140" height="6" rx="3" fill="#a78bfa" opacity="0.2" />
        <rect x="60" y="109" width="90" height="6" rx="3" fill="#a78bfa" opacity="0.14" />
      </g>

      {/* Card 3 — resolved */}
      <rect
        x="16"
        y="146"
        width="248"
        height="60"
        rx="10"
        className="fill-background stroke-current"
        strokeWidth="1.5"
      />

      <circle cx="42" cy="176" r="10" fill="#10b981" />
      <path
        d="M37.5 176l3 3 6.5-7"
        className="auth-draw-check"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="64" y="167" width="120" height="6" rx="3" className="fill-[#7ddc5a] opacity-60" />
      <rect x="64" y="181" width="80" height="6" rx="3" className="fill-[#7ddc5a] opacity-40" />

      <rect x="216" y="164" width="32" height="14" rx="7" fill="#fbbf24" className="auth-pulse-soft" />
    </svg>
  )
}
