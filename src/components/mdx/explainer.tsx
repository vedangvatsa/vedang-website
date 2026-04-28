'use client';



export function Explainer() {
  return (
    <div className="my-12 p-8 border rounded-2xl bg-card text-card-foreground shadow-sm overflow-hidden relative">
      <h3 className="text-xl font-semibold mb-8 text-center">The Vibe Coding Shift</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Old Way */}
        <div className="flex-1 w-full p-6 rounded-xl border bg-muted/30">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">The Old Way</h4>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M16 18l6-6-6-6" />
                <path d="M8 6l-6 6 6 6" />
              </svg>
            </div>
            <p className="text-center font-medium">You write the syntax.</p>
            <p className="text-center text-sm text-muted-foreground mt-2">Months of coding, debugging, and fixing semicolons.</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex flex-col items-center justify-center text-muted-foreground">
          <div className="animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* New Way */}
        <div className="flex-1 w-full p-6 rounded-xl border bg-primary/5 border-primary/20">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4 text-center">The Vibe Way</h4>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <p className="text-center font-medium">You write the vision.</p>
            <p className="text-center text-sm text-muted-foreground mt-2">AI writes the syntax. You act as the Creative Director.</p>
          </div>
        </div>
      </div>
      
      {/* Background Decorative SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
