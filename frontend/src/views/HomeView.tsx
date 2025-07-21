import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

export default function HomeView() {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 min-h-screen bg-no-repeat bg-right-top lg:bg-home lg:bg-home-xl">
        <div className="max-w-7xl mx-auto px-6 lg:flex lg:items-center lg:justify-between gap-10">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 drop-shadow-sm">
              Todas tus{" "}
              <span className="text-violet-600 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Redes Sociales
              </span>{" "}
              en un solo enlace
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-lg">
              Únete a más de{" "}
              <span className="font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                200 mil developers
              </span>{" "}
              compartiendo sus perfiles de TikTok, Facebook, Instagram, YouTube, GitHub y más.
            </p>

            <div className="pt-4">
              <SearchForm />
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div 
                    key={item}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/150?img=${item})`,
                      backgroundSize: 'cover'
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">+200k usuarios activos</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}