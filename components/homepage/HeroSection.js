export default function HeroSection() {
  return (
    <section id="home" className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="text-white/80 mb-6 tracking-wider">
            Bangladesh Best Event Management Company
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-[80px] font-bold text-white mb-4 tracking-tight leading-none">
            
          <span className=" font-thin"> WELCOME TO THE </span>
            <br />
            OFF WHITE
          </h1>
          
          <p className="text-white/80 text-lg mb-12">
            Kuakata,Mahipur,ptuakhali,Bangladesh
          </p>

          <a 
            href="tel:+880199728069" 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-transform inline-block"
          >
            Call Us
            <span className="ml-2">→</span>
          </a>
        </div>

        {/* Right Image */}
        <div className="relative h-full">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl -z-10 transform translate-x-1/2"></div>
          <div className="relative z-10">
            <img 
              src="/images/business-man.png" 
              alt="Business Summit" 
              className="w-full h-auto max-w-lg xl:max-w-xl mx-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
