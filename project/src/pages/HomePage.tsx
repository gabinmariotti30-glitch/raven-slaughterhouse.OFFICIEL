export function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#3C1D0E] mb-4">
            Raven Slaughterhouse
          </h1>
          <div className="w-32 h-1 bg-[#D38A00] mx-auto"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-[#3C1D0E] mb-6">
            À propos de nous
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Raven Slaughterhouse est un abattoir fondé en 1996. Fort de son
            expérience, il approvisionne les entreprises de la ville avec des
            produits carnés de qualité, préparés dans le respect des normes
            sanitaires et industrielles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#3C1D0E] mb-8 text-center">
            Notre équipe de direction
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#FDFDFD] rounded-lg border-2 border-[#D38A00]">
              <div className="w-24 h-24 bg-[#3C1D0E] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#D38A00] text-3xl font-bold">SO</span>
              </div>
              <h3 className="text-xl font-bold text-[#3C1D0E] mb-2">
                Sarah O'Connor
              </h3>
              <p className="text-[#D38A00] font-semibold">
                Présidente Directrice Générale
              </p>
            </div>

            <div className="text-center p-6 bg-[#FDFDFD] rounded-lg border-2 border-[#D38A00]">
              <div className="w-24 h-24 bg-[#3C1D0E] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#D38A00] text-3xl font-bold">TG</span>
              </div>
              <h3 className="text-xl font-bold text-[#3C1D0E] mb-2">
                Théo Gabi
              </h3>
              <p className="text-[#D38A00] font-semibold">Co-Directeur</p>
            </div>

            <div className="text-center p-6 bg-[#FDFDFD] rounded-lg border-2 border-[#D38A00]">
              <div className="w-24 h-24 bg-[#3C1D0E] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#D38A00] text-3xl font-bold">SO</span>
              </div>
              <h3 className="text-xl font-bold text-[#3C1D0E] mb-2">
                Smark OnIls
              </h3>
              <p className="text-[#D38A00] font-semibold">Chef d'équipe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
