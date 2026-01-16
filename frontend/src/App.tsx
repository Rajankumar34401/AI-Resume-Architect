import Editor from './components/Editor';
import { Preview } from './components/Preview';

function App() {
  return (
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden font-sans">
      {/* LEFT SIDE: Editor (40%) */}
      <div className="flex flex-col w-[40%] h-full border-r border-slate-800">
        <header className="p-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Emerald Logo Box */}
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)]"></div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white uppercase">
                CareerForge <span className="text-emerald-500">Pro</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Implementation Phase</p>
            </div>
          </div>
        </header>

        {/* Editor Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-20 custom-scrollbar">
          <Editor />
        </div>
      </div>

      {/* RIGHT SIDE: Preview (60%) */}
      <div className="w-[60%] h-full bg-[#0f172a] flex justify-center items-start overflow-y-auto p-10 custom-scrollbar">
        {/* Scaling logic: Adjust scale-[0.5] if still not visible */}
        <div className="relative origin-top transform scale-[0.55] lg:scale-[0.65] xl:scale-[0.75] 2xl:scale-[0.85] transition-all duration-500 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.7)]">
          
          {/* Neon Glow behind the paper */}
          <div className="absolute -inset-10 bg-emerald-500/10 blur-[120px] rounded-full"></div>
          
          <div className="relative bg-white">
             <Preview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;