import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Instagram, Linkedin, Twitter, Link } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold tracking-tight">
              HYPERFANTASY
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#work" className="text-sm hover:text-white/60 transition">Works</a>
              <a href="#about" className="text-sm hover:text-white/60 transition">About</a>
              <a href="#services" className="text-sm hover:text-white/60 transition">Services</a>
              <Button variant="outline" className="border-white/20 hover:bg-white/10">
                Contact
              </Button>
              <Link href="/projects" className="text-sm hover:text-white/60 transition">
                Work
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
              We craft digital
              <br />
              <span className="text-white/40">experiences</span>
            </h1>
            <p className="text-xl text-white/60 mb-12 max-w-2xl">
              A creative studio specializing in design, development, and digital strategy. 
              We help brands stand out in the digital landscape.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 group">
              View Our Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section id="work" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-12">Selected Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
                  01
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-white/60 transition">Brand Identity Design</h3>
              <p className="text-white/40">Visual Design, Branding</p>
            </div>

            {/* Project 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
                  02
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-white/60 transition">E-commerce Platform</h3>
              <p className="text-white/40">Web Development, UI/UX</p>
            </div>

            {/* Project 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-900/20 to-teal-900/20 rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
                  03
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-white/60 transition">Mobile App Design</h3>
              <p className="text-white/40">Product Design, Mobile</p>
            </div>

            {/* Project 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-lg mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
                  04
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-white/60 transition">Digital Campaign</h3>
              <p className="text-white/40">Marketing, Strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                We believe in
                <br />
                <span className="text-white/40">creative excellence</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Hyperfantasy is a creative studio founded on the belief that great design 
                can transform businesses. We combine strategic thinking with beautiful 
                execution to create digital experiences that resonate.
              </p>
            </div>
            <div className="space-y-8">
              <div>
                <div className="text-6xl font-bold mb-2">50+</div>
                <div className="text-white/40">Projects Completed</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">30+</div>
                <div className="text-white/40">Happy Clients</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2">5+</div>
                <div className="text-white/40">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-white/40 mb-16">What We Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-4xl">🎨</div>
              <h3 className="text-2xl font-semibold">Brand Design</h3>
              <p className="text-white/60">
                Creating distinctive visual identities that capture the essence of your brand 
                and resonate with your audience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl">💻</div>
              <h3 className="text-2xl font-semibold">Web Development</h3>
              <p className="text-white/60">
                Building fast, beautiful, and responsive websites using modern technologies 
                and best practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl">📱</div>
              <h3 className="text-2xl font-semibold">Digital Strategy</h3>
              <p className="text-white/60">
                Crafting comprehensive digital strategies that drive growth and deliver 
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let's create something
            <br />
            amazing together
          </h2>
          <p className="text-xl text-black/60 mb-12">
            Have a project in mind? We'd love to hear about it.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-black/90 group">
            <Mail className="mr-2" size={20} />
            Get in Touch
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">HYPERFANTASY</div>
              <p className="text-white/40">Creative Studio © 2025</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white transition">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-white/40 hover:text-white transition">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
