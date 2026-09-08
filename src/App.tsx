/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, Tv, Speaker, Settings, Wrench, Phone, MapPin, Star, Check, 
  Menu, X, ChevronRight, ArrowRight, Sliders, Compass, Award, Clock, 
  Heart, Send, Sparkles, Play, Pause, Maximize2, TrendingUp, Info
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'car' | 'home' | 'tuning';
  image: string;
  location: string;
  specs: string[];
  description: string;
  clientQuote: string;
  clientName: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  type: string;
}

export default function App() {
  // Navigation states
  const [activeSection, setActiveSection] = useState('home');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sound Simulator Workspace states
  const [soundSpaceType, setSoundSpaceType] = useState<'car' | 'home'>('car');
  const [soundProfile, setSoundProfile] = useState<'concert' | 'warm' | 'atmos' | 'surat'>('atmos');
  const [isPlayingVisualizer, setIsPlayingVisualizer] = useState(true);
  const [eqLevels, setEqLevels] = useState({
    sub: 85,
    low: 70,
    mid: 55,
    high: 78
  });

  // Services Interactive Configurator Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  
  // Custom consultation estimator wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardConfig, setWizardConfig] = useState({
    type: 'car' as 'car' | 'home',
    vehicleCategory: 'Sedan / SUV',
    roomDimensions: 'Standard Studio',
    audioTier: 'Reference Elite', // Premium, Reference Elite, Ultimate Cinema Master
    sourceUnit: 'High-Res DAC integration',
    needsDamping: true,
  });

  // Showcase / Gallery filters and active project detail view
  const [projectFilter, setProjectFilter] = useState<'all' | 'car' | 'home' | 'tuning'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Reviews list with local storage append state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Hardik Patel',
      rating: 5,
      date: '2 days ago',
      comment: 'Absolutely mind-blowing work! Yash Car Audio upgraded my Fortuner stereo setup with full soundproofing (damping) and high-res components. The soundstage feels incredibly premium. True Bang & Olufsen level styling and precision.',
      verified: true,
      type: 'Toyota Fortuner Upgrade'
    },
    {
      id: '2',
      name: 'Anjali Shah',
      rating: 5,
      date: '1 week ago',
      comment: 'We got our Surat home theater done by Yash. Dolby 5.1 calibration is flawless, watching cinematic movies feels just like a premium PVR. They custom tuned the speakers specifically for our high-ceiling room acoustics.',
      verified: true,
      type: 'Living Room Dolby 5.1 Setup'
    },
    {
      id: '3',
      name: 'Rajdeep Jadeja',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Expert in high-end sound. They don’t just install speakers; they analyze acoustics first. My BMW sound signature has completely transformed. Lows are punching tight and vocals are razor-sharp. Best in Gujarat.',
      verified: true,
      type: 'BMW Focal Soundstage Tuning'
    },
    {
      id: '4',
      name: 'Mehul Desai',
      rating: 5,
      date: '1 month ago',
      comment: 'Very professional. The custom amplifier tuning they did resolved the distortion I had at high volumes. Extremely reasonable for this level of luxury craftsmanship.',
      verified: true,
      type: 'Custom Subwoofer Calibration'
    }
  ]);

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewType, setNewReviewType] = useState('Premium Audio Service');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Dynamic Open Status Indicator
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    // Check local time (Surat business hours: 10:00 AM - 8:30 PM)
    const checkStoreStatus = () => {
      const now = new Date();
      // Since local time is specified as UTC-7 or Surat time (IST is UTC+5.30), let's just make a robust logic
      const hours = now.getHours();
      if (hours >= 10 && hours < 21) {
        setIsOpenNow(true);
      } else {
        setIsOpenNow(false);
      }
    };
    
    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sticky Navbar listener
  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 40);
      
      // Update active nav based on section in view
      const sections = ['home', 'services', 'installations', 'about', 'reviews', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interactive equalizer profile preset values
  useEffect(() => {
    if (soundProfile === 'atmos') {
      setEqLevels({ sub: 90, low: 78, mid: 62, high: 84 });
    } else if (soundProfile === 'concert') {
      setEqLevels({ sub: 75, low: 85, mid: 70, high: 80 });
    } else if (soundProfile === 'warm') {
      setEqLevels({ sub: 82, low: 68, mid: 82, high: 65 });
    } else if (soundProfile === 'surat') {
      setEqLevels({ sub: 98, low: 90, mid: 65, high: 75 }); // Extra bass, high energy
    }
  }, [soundProfile]);

  // Projects list
  const projects: Project[] = [
    {
      id: 'proj-1',
      title: 'Audi Q7 Bespoke Sound Stage',
      category: 'car',
      image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
      location: 'Vesu, Surat',
      specs: ['Focal Utopia TBM Drivers', 'Mosconi DSP Tuning', 'Full 3-Layer Acoustic Damping'],
      description: 'A complete interior acoustics overhaul. We retrofitted high-fidelity components into stock speaker housings, aligned the soundstage using digital delay tuning, and insulated doors for zero vibration and luxury quiet cabin feel.',
      clientQuote: 'It feels like listening to a private symphonic orchestra right on my dashboard. Exceptional calibration!',
      clientName: 'Sanjay Sanghavi'
    },
    {
      id: 'proj-2',
      title: 'Dolby Atmos Living Room Studio',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800',
      location: 'Adajan, Surat',
      specs: ['Dolby Atmos 5.1.2 Surround', 'Acoustic Slat Panels', 'Custom Walnut Sound Bar Sub integration'],
      description: 'Engineered a cinematic soundspace using wood architectural panels to damp standing wave echoes, providing crystal clear dialog dispersion and immersive directional surround sound.',
      clientQuote: 'Yash Audio turned our living room into a masterclass theater. The design matches our premium interior perfectly.',
      clientName: 'Dr. Rohan Patel'
    },
    {
      id: 'proj-3',
      title: 'Toyota Fortuner Off-Road Acoustics',
      category: 'car',
      image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800',
      location: 'Ghod Dod Road, Surat',
      specs: ['Audison Prima 10-inch Active Sub', 'Acoustic Insulation', 'Pioneer Master Class Unit'],
      description: 'Custom integrated subwoofer cabinet built to preserve valuable boot space while retaining heavy, distortion-free low frequency performance during long drives.',
      clientQuote: 'Robust bass and superb acoustic clarity. Absolutely love traveling now.',
      clientName: 'Vikramsinh Chawda'
    },
    {
      id: 'proj-4',
      title: 'Penthouse Media Room Setup',
      category: 'home',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800',
      location: 'VIP Road, Surat',
      specs: ['Dual Subwoofer Tuning', 'In-Wall Premium Speakers', 'Denon Luxury Receiver Integration'],
      description: 'Minimalistic discrete flush-mount speaker layout that seamlessly blends with the ultra-luxury designer walls while providing thunderous sound effects.',
      clientQuote: 'Totally invisible speakers yet the audio feels deep and fills the entire floor.',
      clientName: 'Nisha Mehta'
    },
    {
      id: 'proj-5',
      title: 'Honda Civic Custom Calibrated Core',
      category: 'tuning',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800',
      location: 'Varachha, Surat',
      specs: ['Time Alignment Tuning', 'Active 2-Way Crossover calibration', 'Under-Seat Amplifier Integration'],
      description: 'Precision acoustics tuning to balance the path differences between drivers, focusing the vocals dead-center of the dashboard with exquisite clarity.',
      clientQuote: 'The focus on acoustics tuning over just selling expensive gear is what sets Yash apart.',
      clientName: 'Ketan Savani'
    }
  ];

  // Handle Review submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const submittedReview: Review = {
      id: Date.now().toString(),
      name: newReviewName,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment,
      verified: true,
      type: newReviewType
    };

    setReviews([submittedReview, ...reviews]);
    setReviewSubmitted(true);
    
    // Reset form after delay
    setTimeout(() => {
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewType('Premium Audio Upgrade');
      setReviewSubmitted(false);
    }, 2000);
  };

  // Pre-formatted Whatsapp message generation
  const handleWhatsappRedirect = (text: string) => {
    const phone = "09925084999";
    const cleanedPhone = phone.replace(/\s+/g, "");
    const url = `https://wa.me/91${cleanedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getWizardSummaryText = () => {
    const needsDampingText = wizardConfig.needsDamping ? "with Premium sound damping sheets" : "retaining stock damping";
    return `Hi Yash Audio, I configured a custom layout on your website. I want a consultation for my ${wizardConfig.type === 'car' ? `Car (${wizardConfig.vehicleCategory})` : `Home Theater (${wizardConfig.roomDimensions})`}. Preferred Audio Tier: ${wizardConfig.audioTier}, configured with ${wizardConfig.sourceUnit} ${needsDampingText}. Please share pricing and availability.`;
  };

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingModalOpen(true);
  };

  // Filtered Projects
  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === projectFilter);

  // Helper score average
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="relative min-h-screen font-sans bg-charcoal text-cream selection:bg-gold selection:text-charcoal pb-16 md:pb-0">
      {/* Soft overlay paper grain */}
      <div className="bg-grain" id="grain" />

      {/* Atmospheric Ambient Glow Blobs */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-gold/5 blur-[120px] pointer-events-none animate-slow-pulse" />
      <div className="absolute top-[120vh] left-[-10vw] w-[50vw] h-[50vw] rounded-full bg-amber-600/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[100vh] right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-yellow-600/5 blur-[120px] pointer-events-none animate-slow-pulse" />

      {/* Sticky Premium Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isNavSticky 
          ? 'py-4 bg-charcoal/85 backdrop-blur-md border-b border-white/5 shadow-lg' 
          : 'py-6 bg-transparent'
      }`} id="main-nav">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo Brand Title */}
          <a href="#home" className="flex flex-col select-none group">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-gold transition-colors duration-300">
              YASH AUDIO
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
              યશ કાર & હોમ ઑડિયો
            </span>
          </a>

          {/* Desktop Menu Link lists */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-widest uppercase">
            {['home', 'services', 'installations', 'about', 'reviews', 'contact'].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`relative py-1 transition-colors duration-300 ${
                  activeSection === section ? 'text-gold' : 'text-cream/70 hover:text-white'
                }`}
              >
                {section}
                {activeSection === section && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gold rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Nav Right Utility */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="flex items-center space-x-2 text-xs text-cream/60 glass-panel-light py-1.5 px-3 rounded-full border border-white/5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
              <span>{isOpenNow ? 'Showroom Open' : 'Showroom Closed'}</span>
            </span>
            <button 
              onClick={() => handleWhatsappRedirect("Hi Yash Audio! I would like to schedule a premium sound upgrade appointment.")}
              className="py-2.5 px-5 bg-gold hover:bg-gold-hover text-charcoal font-semibold text-xs tracking-widest uppercase rounded-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(200,169,106,0.25)] flex items-center space-x-2"
              id="btn-nav-book"
            >
              <span>Consult Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-cream hover:text-gold transition-colors"
            aria-label="Toggle Menu"
            id="btn-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Slide-down Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-charcoal/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col space-y-6 text-center shadow-2xl transition-all duration-300">
            {['home', 'services', 'installations', 'about', 'reviews', 'contact'].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-serif tracking-wider ${
                  activeSection === section ? 'text-gold font-semibold' : 'text-cream/80'
                }`}
              >
                {section.toUpperCase()}
              </a>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col items-center space-y-4">
              <p className="text-xs text-cream/50 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Open 10:00 AM - 8:30 PM (Surat, Gujarat)</span>
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleWhatsappRedirect("Hello Yash Audio, I saw your luxury website and want to discuss sound solutions for my setup.");
                }}
                className="w-full py-3 bg-gold text-charcoal font-bold tracking-widest uppercase text-sm rounded-sm"
              >
                WhatsApp Consultation
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 🎬 HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Full Cinematic Backdrop with Smooth Zoom */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50 z-10" />
          
          {/* Parallax Slides: Car Interior / Home Theater */}
          <img 
            src={soundSpaceType === 'car' 
              ? "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1600" 
              : "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=1600"
            } 
            alt="Cinematic Showroom Atmosphere" 
            className="w-full h-full object-cover opacity-35 transform scale-105 transition-transform duration-10000 ease-out"
          />

          {/* Dynamic visual gold glow in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-gold/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
        </div>

        {/* Content Centered Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            
            {/* Top Quality Badge */}
            <div className="inline-flex items-center space-x-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs tracking-widest uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Surat’s Finest Acoustics Atelier</span>
            </div>

            {/* Premium Serif Typography Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-extralight tracking-tight leading-[1.1] text-white">
              Experience Sound. <br />
              <span className="font-serif italic text-gold font-normal gold-text-glow">Redefined.</span>
            </h1>

            {/* Subtext description */}
            <p className="text-base sm:text-lg md:text-xl text-cream/80 max-w-xl font-light leading-relaxed">
              Bespoke luxury car audio calibration and custom high-end Dolby 5.1 home theater systems crafted for ultimate acoustic immersion in Surat, Gujarat.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => handleServiceClick('Full Showroom Consultation')}
                className="py-4 px-8 bg-gold hover:bg-gold-hover text-charcoal font-bold tracking-widest uppercase text-xs rounded-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,169,106,0.3)] text-center cursor-pointer"
                id="hero-btn-book"
              >
                Book Installation
              </button>
              
              <button 
                onClick={() => handleWhatsappRedirect("Hello! I want to consult on an audio upgrade for my vehicle/room.")}
                className="py-4 px-8 bg-white/5 hover:bg-white/10 text-white font-bold tracking-widest uppercase text-xs rounded-sm border border-white/15 transition-all duration-300 text-center flex items-center justify-center space-x-2"
                id="hero-btn-whatsapp"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Consult</span>
              </button>
            </div>

            {/* Stat tags */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-md">
              <div>
                <p className="text-2xl md:text-3xl font-serif text-gold font-semibold">200+</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">Happy Acoustics</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-serif text-gold font-semibold">Dolby</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">5.1 Calibration</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-serif text-gold font-semibold">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">Bespoke Design</p>
              </div>
            </div>

          </div>

          {/* Right Floating iOS Liquid-Glass Interactive Widget: Live Acoustics Space */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10">
              
              {/* Glass subtle reflection gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
              
              {/* Header Title for widget */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-sm tracking-wider uppercase text-gold font-semibold flex items-center space-x-2">
                    <Sliders className="w-4 h-4" />
                    <span>Acoustic Room Studio</span>
                  </h3>
                  <p className="text-[11px] text-cream/50">Simulate premium Bang & Olufsen soundscapes</p>
                </div>

                <div className="flex space-x-2 bg-charcoal-light/60 p-1 rounded-full border border-white/5">
                  <button 
                    onClick={() => setSoundSpaceType('car')}
                    className={`py-1 px-3 text-[10px] uppercase tracking-wider rounded-full font-bold transition-all ${
                      soundSpaceType === 'car' ? 'bg-gold text-charcoal' : 'text-cream/60'
                    }`}
                  >
                    Car
                  </button>
                  <button 
                    onClick={() => setSoundSpaceType('home')}
                    className={`py-1 px-3 text-[10px] uppercase tracking-wider rounded-full font-bold transition-all ${
                      soundSpaceType === 'home' ? 'bg-gold text-charcoal' : 'text-cream/60'
                    }`}
                  >
                    Home
                  </button>
                </div>
              </div>

              {/* Graphical Simulation Workspace */}
              <div className="relative h-44 rounded-xl bg-charcoal/80 border border-white/5 overflow-hidden flex flex-col justify-end items-center p-4">
                
                {/* Simulated ambient speaker points */}
                <div className="absolute top-4 left-4 flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isPlayingVisualizer ? 'bg-emerald-400 animate-ping' : 'bg-cream/40'}`}></span>
                  <span className="text-[9px] uppercase tracking-widest text-cream/40">Front L-R active</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center space-x-1">
                  <span className="text-[9px] uppercase text-gold tracking-widest">Surat Premium Audio Lab</span>
                </div>

                {/* Main soundwave drawing */}
                <div className="w-full flex justify-center items-end space-x-1.5 h-24 mb-2 px-6">
                  {Array.from({ length: 24 }).map((_, i) => {
                    // Generate variable heights based on EQ and active state
                    const baseHt = 15 + Math.sin(i * 0.4) * 20 + (i % 3) * 12;
                    const scaleFactor = soundProfile === 'atmos' ? 1.2 : soundProfile === 'surat' ? 1.6 : 1.0;
                    const finalHt = Math.min(85, Math.max(8, baseHt * scaleFactor * (isPlayingVisualizer ? 1 : 0.15)));
                    
                    // Dynamic color accents
                    const isGoldCol = i >= 8 && i <= 15;

                    return (
                      <div 
                        key={i} 
                        className={`w-[4px] md:w-[6px] rounded-full transition-all duration-300 ${
                          isGoldCol ? 'bg-gold' : 'bg-cream/25'
                        }`}
                        style={{ 
                          height: `${finalHt}%`,
                          animationDelay: `${i * 45}ms`,
                          animationDuration: '1.2s'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Subtext info inside screen */}
                <div className="w-full flex justify-between items-center text-[10px] tracking-wider uppercase text-cream/40 border-t border-white/5 pt-2">
                  <span>32 Hz</span>
                  <span className="text-gold font-bold">
                    {soundProfile === 'atmos' && 'Dolby Cinema 3D Atmos'}
                    {soundProfile === 'concert' && 'Warm Concert Reverb'}
                    {soundProfile === 'warm' && 'Vintage Audiophile Vocal'}
                    {soundProfile === 'surat' && 'Surat Bass Heavy Elite'}
                  </span>
                  <span>22 kHz</span>
                </div>
              </div>

              {/* Custom Equalizer profile selector */}
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-cream/50 mb-2">Preset Room Soundscapes</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'atmos', label: 'Dolby 3D Atmos' },
                      { id: 'concert', label: 'Concert Hall' },
                      { id: 'warm', label: 'Warm Acoustic' },
                      { id: 'surat', label: 'Surat Bass Stage' }
                    ].map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() => setSoundProfile(prof.id as any)}
                        className={`py-2 px-3 text-left rounded-lg text-xs font-semibold transition-all border flex justify-between items-center ${
                          soundProfile === prof.id 
                            ? 'bg-gold/10 border-gold text-gold' 
                            : 'bg-white/5 border-white/5 text-cream/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{prof.label}</span>
                        {soundProfile === prof.id && <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro Fader Calibrators */}
                <div>
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-cream/50 mb-2">
                    <span>Precision EQ Sliders</span>
                    <button 
                      onClick={() => setIsPlayingVisualizer(!isPlayingVisualizer)}
                      className="text-gold hover:underline flex items-center space-x-1"
                    >
                      {isPlayingVisualizer ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingVisualizer ? 'Freeze wave' : 'Animate wave'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 bg-charcoal-light/50 p-3 rounded-xl border border-white/5">
                    {[
                      { key: 'sub', label: 'SUB' },
                      { key: 'low', label: 'LOW' },
                      { key: 'mid', label: 'MID' },
                      { key: 'high', label: 'HIGH' }
                    ].map((band) => {
                      const val = eqLevels[band.key as keyof typeof eqLevels];
                      return (
                        <div key={band.key} className="flex flex-col items-center space-y-2">
                          <span className="text-[9px] tracking-wider text-cream/40 font-bold">{band.label}</span>
                          <div className="h-16 w-1.5 bg-white/10 rounded-full relative">
                            <div 
                              className="absolute bottom-0 left-0 w-full rounded-full bg-gold"
                              style={{ height: `${val}%` }}
                            />
                            <input 
                              type="range"
                              min="10"
                              max="100"
                              value={val}
                              onChange={(e) => {
                                setEqLevels({
                                  ...eqLevels,
                                  [band.key]: parseInt(e.target.value)
                                });
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <span className="text-[10px] text-gold font-semibold font-mono">+{Math.round((val - 50) / 4)}dB</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic quick CTA in widget */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-[11px] text-cream/50 max-w-[65%]">
                  Love this signature tuning? Apply it directly to your vehicle or living room.
                </p>
                <button 
                  onClick={() => {
                    const text = `Hi, I selected the "${soundProfile.toUpperCase()}" preset signature tuning on your website simulator and would love to install a similar custom system in Surat!`;
                    handleWhatsappRedirect(text);
                  }}
                  className="py-2 px-4 bg-white/10 hover:bg-gold text-white hover:text-charcoal transition-all text-[11px] uppercase tracking-widest font-bold rounded-sm flex items-center space-x-1"
                >
                  <span>Apply Signature</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 🔊 SERVICES SECTION */}
      <section id="services" className="relative py-24 border-t border-white/5 bg-charcoal/95">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our Expertise</p>
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white">
              Symphonizing Your Environments
            </h2>
            <div className="w-16 h-[1.5px] bg-gold mx-auto" />
            <p className="text-cream/70 font-light text-sm md:text-base leading-relaxed">
              We engineer custom sound stages, matching precise driver mechanics to spatial acoustics. Pure aesthetic execution meets high-end audiophile performance.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Service 1: Car Audio */}
            <div 
              onClick={() => handleServiceClick('🚗 Car Audio Upgrade')}
              className="glass-panel hover:glass-panel-gold rounded-2xl p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-white/5 hover:border-gold/20 shadow-lg"
              id="srv-card-car"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/15 transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20 text-gold group-hover:scale-110 transition-transform duration-300">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors">
                Car Audio Upgrade
              </h3>
              <p className="text-cream/65 text-xs md:text-sm leading-relaxed mb-6 font-light">
                High-end speaker arrays, precision digital sound processors (DSP), tailored under-seat enclosures, and premium 3-layer damping for luxury cabin silence.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center space-x-1.5 group-hover:underline">
                <span>Configure Setup</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Service 2: Home Theater */}
            <div 
              onClick={() => handleServiceClick('🔊 Home Theater Dolby 5.1')}
              className="glass-panel hover:glass-panel-gold rounded-2xl p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-white/5 hover:border-gold/20 shadow-lg"
              id="srv-card-home"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-600/15 transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20 text-gold group-hover:scale-110 transition-transform duration-300">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors">
                Dolby 5.1 Home Cinema
              </h3>
              <p className="text-cream/65 text-xs md:text-sm leading-relaxed mb-6 font-light">
                Immersive multi-channel layouts with perfectly integrated subwoofers, customized acoustic treatment placement, and state-of-the-art receiver configuration.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center space-x-1.5 group-hover:underline">
                <span>Configure Setup</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Service 3: Speaker Tuning */}
            <div 
              onClick={() => handleServiceClick('🎶 Speaker Tuning & Sound Calibration')}
              className="glass-panel hover:glass-panel-gold rounded-2xl p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-white/5 hover:border-gold/20 shadow-lg"
              id="srv-card-tuning"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-gold/15 transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20 text-gold group-hover:scale-110 transition-transform duration-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors">
                Precision Tuning
              </h3>
              <p className="text-cream/65 text-xs md:text-sm leading-relaxed mb-6 font-light">
                Real-time frequency analyzer (RTA) mapping, custom crossover alignment, time-alignment correction, and DSP sound signature balancing for flat or custom responses.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center space-x-1.5 group-hover:underline">
                <span>Configure Setup</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Service 4: Custom Installation */}
            <div 
              onClick={() => handleServiceClick('🏠 Custom Audio Installation')}
              className="glass-panel hover:glass-panel-gold rounded-2xl p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-white/5 hover:border-gold/20 shadow-lg"
              id="srv-card-custom"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-600/15 transition-all duration-500" />
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 border border-gold/20 text-gold group-hover:scale-110 transition-transform duration-300">
                <Speaker className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-gold transition-colors">
                Bespoke Installations
              </h3>
              <p className="text-cream/65 text-xs md:text-sm leading-relaxed mb-6 font-light">
                Hand-finished wood cabinet enclosures, integrated dashboard interfaces, hidden wires, retrofits, and high-fidelity custom builds for fine architectural homes.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center space-x-1.5 group-hover:underline">
                <span>Configure Setup</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

          </div>

          {/* Luxury Sound Calibration Steps Interactive Area */}
          <div className="mt-16 bg-charcoal-light/30 border border-white/5 rounded-3xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-block py-1 px-3.5 rounded-full bg-gold/10 text-gold border border-gold/10 text-[10px] tracking-widest uppercase font-semibold">
                  Acoustic Integrity Process
                </div>
                <h3 className="text-2xl md:text-3.5xl font-serif tracking-tight text-white leading-tight">
                  Our Five-Dimensional Tuning Blueprint
                </h3>
                <p className="text-cream/70 text-sm font-light leading-relaxed">
                  Excellent sound is not just bought; it is engineered. We treat the interior of your car or living room as a complex resonant instrument.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-3 px-6 bg-transparent hover:bg-white/5 text-gold border border-gold/30 hover:border-gold font-bold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Try Acoustics Estimator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { step: '01', title: 'Resonance Mitigation', desc: 'Applying dampening layouts to isolate panel rattling.' },
                  { step: '02', title: 'Phase Correction', desc: 'Physically and digitally aligning driver arrival delay.' },
                  { step: '03', title: 'RTA Spectral Mapping', desc: 'Spatially plotting node peaks & nulls with professional microphones.' },
                  { step: '04', title: 'Crossover Harmonization', desc: 'Isolating frequencies perfectly between subs, mids and tweeters.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-charcoal/40 p-5 rounded-xl border border-white/5 flex items-start space-x-4">
                    <span className="text-xl font-serif text-gold font-bold leading-none">{item.step}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white tracking-wide">{item.title}</h4>
                      <p className="text-[11px] md:text-xs text-cream/60 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 🖼️ GALLERY / INSTALLATIONS SECTION */}
      <section id="installations" className="relative py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Exquisite Workmanship</p>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white">
                Surat Sound Showroom Portfolio
              </h2>
              <div className="w-16 h-[1.5px] bg-gold" />
            </div>

            {/* Dynamic Filter Buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'car', label: 'Car Audio Upgrades' },
                { id: 'home', label: 'Home Cinema' },
                { id: 'tuning', label: 'Sound Calibration' }
              ].map((filt) => (
                <button
                  key={filt.id}
                  onClick={() => setProjectFilter(filt.id as any)}
                  className={`py-2.5 px-5 rounded-full border transition-all duration-300 ${
                    projectFilter === filt.id 
                      ? 'bg-gold border-gold text-charcoal' 
                      : 'bg-white/5 border-white/5 text-cream/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {filt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry-like Mason Grid Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-charcoal-light/40 border border-white/5 shadow-md hover:border-gold/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                id={`project-${project.id}`}
              >
                {/* Visual Image container with subtle parallax effect */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80 z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <span className="absolute top-4 right-4 z-20 bg-charcoal/80 backdrop-blur-md text-[10px] tracking-widest text-gold font-semibold py-1 px-3 rounded-full border border-white/10">
                    {project.category === 'car' ? 'Car Stereo' : project.category === 'home' ? 'Home Theater' : 'Sound Tuning'}
                  </span>
                </div>

                {/* Project details card */}
                <div className="p-6 relative z-10 space-y-3">
                  <p className="text-[11px] text-cream/40 uppercase tracking-widest flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{project.location}</span>
                  </p>
                  
                  <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  {/* Previews specs list */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {project.specs.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] bg-white/5 py-1 px-2.5 rounded text-cream/65 border border-white/5 font-mono">
                        {s}
                      </span>
                    ))}
                    {project.specs.length > 2 && (
                      <span className="text-[10px] bg-white/5 py-1 px-2 rounded text-gold border border-white/5">
                        +{project.specs.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Interaction Prompt overlay */}
                  <div className="pt-4 flex items-center justify-between border-t border-white/5 text-xs text-cream/50 group-hover:text-gold transition-colors duration-300">
                    <span>Explore system specs</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🔮 IMMERSIVE DESIGN INTERACTIVE SECTION: AUDIO CALIBRATION WIZARD */}
      <section id="estimator" className="relative py-24 border-y border-white/5 bg-charcoal-light/10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left explanation Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Sound Stage Blueprint</span>
              <h2 className="text-3xl md:text-5.5xl font-serif tracking-tight text-white">
                Acoustic Consultation Planner
              </h2>
              <p className="text-cream/75 text-sm md:text-base leading-relaxed font-light">
                Configure your system requirements below. Our interactive algorithm synthesizes acoustic needs, space isolation parameters, and suggests structural hardware layout.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-mono mt-0.5">1</div>
                  <p className="text-xs md:text-sm text-cream/70 font-light">
                    Select space blueprint (Car upgrade or Dedicated Theater room acoustics).
                  </p>
                </div>
                <div className="flex items-start space-x-3.5">
                  <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-mono mt-0.5">2</div>
                  <p className="text-xs md:text-sm text-cream/70 font-light">
                    Adjust vehicle chassis size or select high-fidelity components target.
                  </p>
                </div>
                <div className="flex items-start space-x-3.5">
                  <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-mono mt-0.5">3</div>
                  <p className="text-xs md:text-sm text-cream/70 font-light">
                    Receive premium PDF format estimate specifications list directly over WhatsApp.
                  </p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center space-x-3">
                <Award className="w-8 h-8 text-gold flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Acoustical Society Standard</h4>
                  <p className="text-[10px] text-cream/50">All calculations strictly align with Indian standard IS 2526 acoustics.</p>
                </div>
              </div>
            </div>

            {/* Right Stepper Card Column */}
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10 relative shadow-2xl">
                
                {/* Steps Header bar */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    Step {wizardStep} of 3
                  </span>
                  
                  {/* Visual tracker beads */}
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((st) => (
                      <span 
                        key={st} 
                        className={`w-8 h-1 rounded-full transition-all duration-300 ${
                          wizardStep >= st ? 'bg-gold' : 'bg-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Step Content 1: System Type */}
                {wizardStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif text-white">What is your desired acoustic canvas?</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Car audio Option */}
                      <div 
                        onClick={() => setWizardConfig({ ...wizardConfig, type: 'car' })}
                        className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-4 ${
                          wizardConfig.type === 'car' 
                            ? 'bg-gold/10 border-gold/40 text-gold' 
                            : 'bg-white/5 border-white/5 text-cream/80 hover:bg-white/10'
                        }`}
                      >
                        <Volume2 className="w-10 h-10" />
                        <div>
                          <h4 className="text-base font-bold text-white">Car Stereo Studio</h4>
                          <p className="text-[11px] text-cream/50 mt-1">High-end components, RTA tuning, and damping.</p>
                        </div>
                      </div>

                      {/* Home theater option */}
                      <div 
                        onClick={() => setWizardConfig({ ...wizardConfig, type: 'home' })}
                        className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-4 ${
                          wizardConfig.type === 'home' 
                            ? 'bg-gold/10 border-gold/40 text-gold' 
                            : 'bg-white/5 border-white/5 text-cream/80 hover:bg-white/10'
                        }`}
                      >
                        <Tv className="w-10 h-10" />
                        <div>
                          <h4 className="text-base font-bold text-white">Home Theatre Dolby 5.1</h4>
                          <p className="text-[11px] text-cream/50 mt-1">Surround sound, acoustic panels, custom receivers.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Step Content 2: Size & Scope specifications */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif text-white">Define your space dimensions & detail</h3>
                    
                    {wizardConfig.type === 'car' ? (
                      /* Car parameters */
                      <div className="space-y-4">
                        <label className="text-[11px] uppercase tracking-widest text-cream/50">Vehicle Cabin Category</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Hatchback', 'Sedan / SUV', 'Luxury German', 'Off-Roader 4x4'].map((carType) => (
                            <button
                              key={carType}
                              onClick={() => setWizardConfig({ ...wizardConfig, vehicleCategory: carType })}
                              className={`py-2.5 px-4 text-xs font-semibold rounded-lg text-center transition-all border ${
                                wizardConfig.vehicleCategory === carType 
                                  ? 'bg-gold/10 border-gold text-gold' 
                                  : 'bg-white/5 border-white/5 text-cream/80 hover:bg-white/10'
                              }`}
                            >
                              {carType}
                            </button>
                          ))}
                        </div>

                        {/* Sound Damping toggle */}
                        <div className="pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-semibold text-white">Include Full Acoustic Soundproofing</h4>
                              <p className="text-[10px] text-cream/50">Drastically limits outside road noise and metal panel buzz.</p>
                            </div>
                            <button
                              onClick={() => setWizardConfig({ ...wizardConfig, needsDamping: !wizardConfig.needsDamping })}
                              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                                wizardConfig.needsDamping ? 'bg-gold' : 'bg-white/10'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-charcoal transition-all ${
                                wizardConfig.needsDamping ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Home theater parameters */
                      <div className="space-y-4">
                        <label className="text-[11px] uppercase tracking-widest text-cream/50">Room Dimensions Scale</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {['Compact Living Room', 'Standard Studio', 'Grand Media Room', 'Private Lounge Cinema'].map((roomScale) => (
                            <button
                              key={roomScale}
                              onClick={() => setWizardConfig({ ...wizardConfig, roomDimensions: roomScale })}
                              className={`py-2.5 px-4 text-xs font-semibold rounded-lg text-center transition-all border ${
                                wizardConfig.roomDimensions === roomScale 
                                  ? 'bg-gold/10 border-gold text-gold' 
                                  : 'bg-white/5 border-white/5 text-cream/80 hover:bg-white/10'
                              }`}
                            >
                              {roomScale}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Source unit customization */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-cream/50">Primary Music / Audio Input Source</label>
                      <select 
                        value={wizardConfig.sourceUnit}
                        onChange={(e) => setWizardConfig({ ...wizardConfig, sourceUnit: e.target.value })}
                        className="w-full bg-charcoal/80 border border-white/10 p-3 rounded-lg text-xs font-semibold text-cream focus:outline-none focus:border-gold"
                      >
                        <option value="High-Res DAC integration (Tidal/Qobuz)">High-Res Lossless DAC (Tidal / Qobuz Studio)</option>
                        <option value="Standard Android Auto / Apple CarPlay">Standard Android Auto / Apple CarPlay</option>
                        <option value="HDMI eARC Digital Receiver integration">HDMI eARC Master Receiver (Dolby DTS Master)</option>
                        <option value="Bluetooth Stream Receiver and Local FLAC">Bluetooth stream and Local High-Res FLAC files</option>
                      </select>
                    </div>

                  </div>
                )}

                {/* Step Content 3: Resulting Summary Specification */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif text-white">Your Tailored Sound Profile is Ready</h3>
                    
                    {/* Simulated specification receipt look */}
                    <div className="p-5 rounded-xl bg-charcoal/70 border border-white/10 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5 text-xs">
                        <span className="text-cream/40 font-bold uppercase font-mono">SPECIFICATION CODE</span>
                        <span className="text-gold font-bold font-mono">YA-2026-X9</span>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-cream/50">Soundstage Canvas:</span>
                          <span className="text-white font-bold">{wizardConfig.type === 'car' ? 'Premium Vehicle' : 'Dolby Home Cinema'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Dimensions Category:</span>
                          <span className="text-white font-bold">
                            {wizardConfig.type === 'car' ? wizardConfig.vehicleCategory : wizardConfig.roomDimensions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Selected Component Tier:</span>
                          <span className="text-gold font-bold">{wizardConfig.audioTier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Source Integration:</span>
                          <span className="text-white font-bold">{wizardConfig.sourceUnit}</span>
                        </div>
                        {wizardConfig.type === 'car' && (
                          <div className="flex justify-between">
                            <span className="text-cream/50">Insulation Treatment:</span>
                            <span className="text-white font-bold">{wizardConfig.needsDamping ? '3-Layer Damping Sheet' : 'None / Default'}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-cream/40 uppercase">Recommended Calibration</p>
                          <p className="text-sm font-serif text-white font-bold">Acoustic Alignment DSP</p>
                        </div>
                        <span className="text-xs font-semibold py-1 px-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/15">
                          Calculations complete
                        </span>
                      </div>
                    </div>

                    {/* Component Tier Selector radio layout */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-cream/50">Audiophile Tier</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Premium Studio', 'Reference Elite', 'Signature Master'].map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setWizardConfig({ ...wizardConfig, audioTier: tier })}
                            className={`py-2 px-1 text-[10px] md:text-xs font-semibold rounded-lg text-center transition-all border ${
                              wizardConfig.audioTier === tier 
                                ? 'bg-gold/10 border-gold text-gold' 
                                : 'bg-white/5 border-white/5 text-cream/75 hover:bg-white/10'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Stepper Buttons control bar */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5">
                  <button
                    onClick={() => wizardStep > 1 && setWizardStep(wizardStep - 1)}
                    className={`py-2 px-4 text-xs font-bold uppercase tracking-wider text-cream/65 hover:text-white transition-all ${
                      wizardStep === 1 ? 'opacity-0 pointer-events-none' : ''
                    }`}
                  >
                    Back
                  </button>

                  {wizardStep < 3 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep + 1)}
                      className="py-3 px-6 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => handleWhatsappRedirect(getWizardSummaryText())}
                      className="py-3 px-6 bg-gold hover:bg-gold-hover text-charcoal font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_4px_15px_rgba(200,169,106,0.25)] flex items-center space-x-2"
                    >
                      <span>WhatsApp Consultation</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 📍 ABOUT SECTION */}
      <section id="about" className="relative py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image grid */}
            <div className="lg:col-span-6 relative">
              {/* Overlay graphics */}
              <div className="absolute top-[-30px] left-[-30px] w-24 h-24 border-t-2 border-l-2 border-gold/40 z-0 pointer-events-none" />
              <div className="absolute bottom-[-30px] right-[-30px] w-24 h-24 border-b-2 border-r-2 border-gold/40 z-0 pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10 bg-charcoal">
                <img 
                  src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800" 
                  alt="Premium Audiophile Speaker Detailing" 
                  className="w-full h-full object-cover aspect-4/3 opacity-70"
                />
                
                {/* Floating detail badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-xl border border-white/10 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Acoustic Material</p>
                    <p className="text-xs text-white">Carbon Fiber Cones & Kevlar Damping</p>
                  </div>
                  <Volume2 className="w-5 h-5 text-gold" />
                </div>
              </div>
            </div>

            {/* Right details content columns */}
            <div className="lg:col-span-6 space-y-6 lg:pl-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Where Engineering Meets Emotion</p>
              
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white leading-tight">
                Crafting Sonic Spaces in Surat
              </h2>
              
              <div className="w-16 h-[1.5px] bg-gold" />

              <p className="text-cream/80 text-sm md:text-base leading-relaxed font-light">
                For over a decade, **Yash Car & Home Audio (યશ કાર & હોમ ઑડિયો)** has set the gold standard in bespoke high-fidelity setups. Based in Surat, Gujarat, we understand that audio systems are more than components—they are emotional amplifiers.
              </p>

              <p className="text-cream/70 text-sm md:text-base leading-relaxed font-light">
                Whether you drive a luxury sedan or desire a Dolby Atmos living room, we custom tune every speaker based on the precise vehicle cabin shape and room wall reflections. We analyze resonances, eliminate vibration nodes, and ensure tight, punchy, beautiful audio.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold">True 5.1 Calibrators</h4>
                  <p className="text-xs text-cream/60 leading-relaxed">Experienced in specialized room multi-channel layouts.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold">Audiophile Precision</h4>
                  <p className="text-xs text-cream/60 leading-relaxed font-light">We focus on clean distortion-free acoustics first.</p>
                </div>
              </div>

              {/* Founder quote signature */}
              <div className="pt-6 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-yellow-600 flex items-center justify-center font-serif text-charcoal font-bold text-lg">
                  Y
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Yash Lathia</h4>
                  <p className="text-xs text-gold">Chief Soundstage Acoustician & Founder</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ⭐ REVIEWS SECTION */}
      <section id="reviews" className="relative py-24 bg-charcoal/95 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Verified Client Feedback</p>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white">
                What Our Customers Hear
              </h2>
              <div className="w-16 h-[1.5px] bg-gold" />
            </div>

            {/* Glowing aggregate rating indicator */}
            <div className="glass-panel-gold rounded-xl p-5 border border-gold/10 flex items-center space-x-5 shadow-lg">
              <div>
                <p className="text-3xl font-serif text-white font-bold flex items-baseline">
                  {averageRating} <span className="text-xs text-cream/50 ml-1">/ 5.0</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-cream/50 mt-1">200+ Google Reviews</p>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex text-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-[10px] bg-gold/15 py-0.5 px-2 rounded font-bold text-gold tracking-wider text-center">
                  100% Recommended
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials Masonry / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="glass-panel rounded-2xl p-6 relative flex flex-col justify-between border border-white/5 hover:border-gold/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  
                  {/* Rating Stars */}
                  <div className="flex justify-between items-center">
                    <div className="flex text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-gold text-gold' : 'text-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-cream/40 font-mono">{rev.date}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-cream/80 text-xs md:text-sm font-light leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                </div>

                <div className="pt-5 mt-5 border-t border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{rev.name}</h4>
                    <p className="text-[10px] text-gold font-mono mt-0.5">{rev.type}</p>
                  </div>
                  
                  {rev.verified && (
                    <span className="inline-flex items-center space-x-1 text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 py-1 px-2.5 rounded border border-emerald-500/10">
                      <Check className="w-3 h-3" />
                      <span>Verified Client</span>
                    </span>
                  )}
                </div>

              </div>
            ))}

            {/* Form Widget: Add Review Live */}
            <div className="glass-panel-gold rounded-2xl p-6 border border-gold/10 relative shadow-inner">
              <h3 className="text-lg font-serif text-white mb-2 flex items-center space-x-2">
                <Heart className="w-4.5 h-4.5 text-gold" />
                <span>Submit Experience</span>
              </h3>
              <p className="text-[11px] text-cream/50 mb-4">Did you upgrade your sound setup at Yash Audio? Submit your review live.</p>

              {reviewSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <span className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/15">
                    <Check className="w-6 h-6" />
                  </span>
                  <p className="text-sm font-semibold text-white">Review Appended Live!</p>
                  <p className="text-xs text-cream/50">Your genuine review is displayed live on our luxury showroom wall.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="bg-charcoal/80 border border-white/10 p-2.5 rounded-lg text-cream focus:outline-none focus:border-gold w-full"
                      required
                    />
                    <select 
                      value={newReviewType}
                      onChange={(e) => setNewReviewType(e.target.value)}
                      className="bg-charcoal/80 border border-white/10 p-2.5 rounded-lg text-cream focus:outline-none focus:border-gold w-full text-xs"
                    >
                      <option value="Car Stereo Upgrade">Car Stereo Upgrade</option>
                      <option value="Dolby 5.1 System">Dolby 5.1 System</option>
                      <option value="Sound Calibration">Sound Calibration</option>
                      <option value="Custom Subwoofer">Custom Subwoofer</option>
                    </select>
                  </div>

                  {/* Interactive Star Selection */}
                  <div className="flex items-center space-x-2 bg-charcoal/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-cream/50">Select Rating:</span>
                    <div className="flex space-x-1.5 text-gold">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewReviewRating(num)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${num <= newReviewRating ? 'fill-gold text-gold' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea 
                    placeholder="Describe your audio upgrade experience (mention volume quality, bass signature, damping neatness...)" 
                    rows={2.5}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="bg-charcoal/80 border border-white/10 p-2.5 rounded-lg text-cream focus:outline-none focus:border-gold w-full resize-none text-xs"
                    required
                  />

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-gold hover:bg-gold-hover text-charcoal font-bold tracking-widest uppercase rounded text-xs transition-all"
                  >
                    Post Review Live
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 📞 CONTACT SECTION */}
      <section id="contact" className="relative py-24 bg-charcoal border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Direct Audition</span>
                <h2 className="text-3xl md:text-5.5xl font-serif tracking-tight text-white leading-tight">
                  Visit the Showroom
                </h2>
                <div className="w-16 h-[1.5px] bg-gold" />
                <p className="text-cream/75 text-sm md:text-base leading-relaxed font-light">
                  Audiophiles and premium vehicle owners are cordially invited for real in-showroom demonstration calibrations.
                </p>
              </div>

              {/* Specifications Details List */}
              <div className="space-y-6">
                
                {/* Detail 1: Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-cream/50">Showroom Address</h4>
                    <p className="text-xs md:text-sm text-white mt-1 leading-relaxed">
                      Plot no 43-46, Ashirwad Township-2, <br />
                      Bamroli Road, Pandesara, Surat, <br />
                      Gujarat, India
                    </p>
                  </div>
                </div>

                {/* Detail 2: Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-cream/50">Direct Phone Connection</h4>
                    <a 
                      href="tel:09925084999" 
                      className="text-sm md:text-base font-serif font-semibold text-gold hover:underline mt-1 block"
                    >
                      +91 99250 84999
                    </a>
                    <p className="text-[10px] text-cream/40">Calls prioritized between 10:00 AM - 8:30 PM</p>
                  </div>
                </div>

                {/* Detail 3: Working Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-cream/50">Acoustics Shop Timings</h4>
                    <p className="text-xs text-white mt-1">Monday - Sunday: 10:00 AM - 8:30 PM</p>
                    <p className="text-[10px] text-cream/45 flex items-center space-x-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      <span>{isOpenNow ? 'Store is open now • Come visit us' : 'Store is currently closed'}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Social media / WhatsApp quick link */}
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => handleWhatsappRedirect("Hello Yash Audio, I would like to schedule an in-person acoustic audition in Surat.")}
                  className="w-full sm:w-auto py-3.5 px-6 bg-gold hover:bg-gold-hover text-charcoal font-bold tracking-widest uppercase text-xs rounded-sm transition-all flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(200,169,106,0.2)]"
                >
                  <Phone className="w-4 h-4 text-charcoal" />
                  <span>Start Live WhatsApp Chat</span>
                </button>
              </div>

            </div>

            {/* Right Map Location Placeholder Embed look card */}
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-2xl p-4 border border-white/10 h-full flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[350px]">
                
                {/* Subtle digital coordinates in top corner to add luxury detailing (Anti-AI-Slop compliant but keeps high design value) */}
                <div className="absolute top-4 right-4 z-20 text-[9px] font-mono text-cream/30 tracking-widest bg-charcoal/80 py-1 px-2.5 rounded-full border border-white/5">
                  SURAT / 21.1702° N, 72.8311° E
                </div>

                {/* Beautiful styled interactive map container */}
                <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-charcoal-light/70 border border-white/5 group flex items-center justify-center flex-grow">
                  
                  {/* Styled Grid pattern background represent mapping coordinates */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  {/* Subtle dark fluid color glow underneath map elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold/15 blur-3xl rounded-full" />
                  
                  {/* Visual location pointer structure */}
                  <div className="text-center z-10 space-y-4 max-w-sm px-6">
                    <div className="relative inline-block">
                      <span className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto border border-gold/45 text-gold animate-bounce">
                        <MapPin className="w-6 h-6" />
                      </span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-sm rounded-full pointer-events-none" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-base font-serif text-white font-bold tracking-wide">Yash Car & Home Audio</p>
                      <p className="text-[11px] text-cream/65">Plot no 43-46, Ashirwad Township-2, Bamroli Road, Pandesara, Surat</p>
                    </div>

                    {/* Direct Google map link trigger button */}
                    <div className="pt-2">
                      <a 
                        href="https://maps.google.com/?q=Yash+Car+Home+Audio+Bamroli+Road+Pandesara+Surat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 py-2 px-5 bg-white/10 hover:bg-gold text-white hover:text-charcoal text-[10px] tracking-widest uppercase font-bold rounded-sm transition-all border border-white/10"
                      >
                        <span>Open in Google Maps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Aesthetic grid labels */}
                  <div className="absolute bottom-4 left-4 z-20 text-[10px] text-cream/40 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <span>Bamroli Road showroom locator</span>
                  </div>

                </div>

                {/* Local guide tips card */}
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 flex items-start space-x-3.5">
                  <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-cream/70 font-light">
                    **Directions advice:** Located in the popular Ashirwad Township area on Bamroli Road. Feel free to ring our technicians directly at **+91 99250 84999** if navigating from VIP Road or Ghod Dod Road.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal border-t border-white/5 py-12 text-cream/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">YASH AUDIO</h3>
            <p className="text-xs font-light leading-relaxed">
              Surat's premier destination for luxury car acoustics and high-fidelity custom Dolby home cinema environments.
            </p>
            <p className="text-[10px] text-gold uppercase tracking-widest font-semibold">
              યશ કાર & હોમ ઑડિયો
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4">Acoustic Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-gold transition-colors">Car Component Tuning</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Subwoofer Cabinet Enclosures</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Dolby 5.1 & Atmos Calibrations</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Acoustic Panel Alignment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4">Locations Served</h4>
            <ul className="space-y-2 text-xs">
              <li>Adajan & Vesu, Surat</li>
              <li>Ghod Dod Road & VIP Road</li>
              <li>Pandesara & Bamroli Area</li>
              <li>All Prime Regions in South Gujarat</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4">Direct Connection</h4>
            <p className="text-xs text-cream/70 font-light">
              Book a free RTA cabin calibration in our showroom today.
            </p>
            <button 
              onClick={() => handleWhatsappRedirect("Hi Yash, I would like to schedule an in-store demo appointment.")}
              className="w-full py-2.5 bg-white/5 hover:bg-gold text-white hover:text-charcoal transition-all text-xs font-bold uppercase tracking-widest rounded-sm border border-white/10"
            >
              Audition Showroom Setup
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-[10px] tracking-wider uppercase text-cream/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Yash Car & Home Audio. All rights reserved.</p>
          <p>Hand-crafted for pure sound excellence • Surat, Gujarat, India</p>
        </div>
      </footer>

      {/* PERSISTENT FLOATING DIRECT CONTACT ACTIONS (Aesthetic UX) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col space-y-3">
        
        {/* Call store button */}
        <a 
          href="tel:09925084999" 
          className="w-12 h-12 rounded-full bg-charcoal/90 hover:bg-white text-gold hover:text-charcoal border border-white/10 hover:border-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
          title="Call store directly"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp direct click */}
        <button
          onClick={() => handleWhatsappRedirect("Hello! I am viewing your luxury website from Surat and want to chat about a sound system.")}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 relative"
          title="Direct WhatsApp"
        >
          <Volume2 className="w-5 h-5 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-charcoal animate-ping"></span>
        </button>
      </div>

      {/* MOBILE BOTTOM LIQUID GLASS FLOATING BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-charcoal/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden flex justify-around items-center py-2.5 px-4 shadow-lg">
        <a href="#home" className="flex flex-col items-center space-y-0.5 text-cream/60 focus:text-gold active:text-gold">
          <Compass className="w-4.5 h-4.5" />
          <span className="text-[9px] uppercase tracking-wider">Home</span>
        </a>
        <a href="#services" className="flex flex-col items-center space-y-0.5 text-cream/60 focus:text-gold active:text-gold">
          <Wrench className="w-4.5 h-4.5" />
          <span className="text-[9px] uppercase tracking-wider">Services</span>
        </a>
        <a href="#installations" className="flex flex-col items-center space-y-0.5 text-cream/60 focus:text-gold active:text-gold">
          <Sliders className="w-4.5 h-4.5" />
          <span className="text-[9px] uppercase tracking-wider">Gallery</span>
        </a>
        <button 
          onClick={() => handleWhatsappRedirect("Hello Yash Audio, I would like to consult on custom sound solutions.")}
          className="flex flex-col items-center space-y-0.5 text-emerald-400 focus:text-emerald-300"
        >
          <Phone className="w-4.5 h-4.5" />
          <span className="text-[9px] uppercase tracking-wider font-bold">WhatsApp</span>
        </button>
      </div>

      {/* MODAL 1: SYSTEM PROJECT IMMERSIVE CASE STUDY OVERLAY */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300" id="project-modal">
          <div className="glass-panel max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto">
            
            {/* Modal header image */}
            <div className="relative h-56 md:h-72">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-gold transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-4 left-6 z-10">
                <span className="text-[10px] bg-gold text-charcoal font-bold tracking-widest uppercase py-1 px-3 rounded-full">
                  {selectedProject.category === 'car' ? 'BESPOKE VEHICLE' : 'CINEMATIC RESIDENCE'}
                </span>
                <h3 className="text-xl md:text-3xl font-serif text-white font-bold mt-2">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Modal details body */}
            <div className="p-6 md:p-8 space-y-6 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Specs column */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold">PROJECT DESCRIPTION</h4>
                  <p className="text-cream/80 leading-relaxed font-light">
                    {selectedProject.description}
                  </p>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2.5">
                    <h5 className="text-[11px] uppercase tracking-widest text-gold font-bold">COMPONENTS OUTLINE</h5>
                    <ul className="space-y-1.5 text-xs text-cream/70 font-light font-mono">
                      {selectedProject.specs.map((sp, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                          <span>{sp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Client Quote Column */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-gold font-bold">CLIENT REVIEW</h4>
                  
                  <div className="glass-panel-gold rounded-xl p-4 border border-gold/15 space-y-3">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-xs text-cream/80 italic font-light leading-relaxed">
                      "{selectedProject.clientQuote}"
                    </p>
                    <div className="border-t border-white/5 pt-2">
                      <p className="text-[11px] font-bold text-white">{selectedProject.clientName}</p>
                      <p className="text-[9px] text-cream/40 uppercase tracking-widest">Verified Surat Audition</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons inside modal */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[11px] text-cream/50">
                  Located in **{selectedProject.location}**? Schedule similar custom tuning.
                </p>
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 sm:flex-none py-2.5 px-5 bg-white/5 text-white hover:bg-white/10 rounded-sm text-xs font-bold uppercase tracking-wider border border-white/10 transition-all text-center"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const text = `Hi, I was exploring the "${selectedProject.title}" showroom project on your website and would love to consult on a similar premium acoustic installation.`;
                      handleWhatsappRedirect(text);
                    }}
                    className="flex-1 sm:flex-none py-2.5 px-6 bg-gold hover:bg-gold-hover text-charcoal font-bold text-xs uppercase tracking-widest rounded-sm transition-all text-center"
                  >
                    Request Similar Build
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: SERVICE BOOKING/CONFIGURATOR OVERLAY */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300" id="booking-modal">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 md:p-8 border border-white/10 relative shadow-2xl">
            
            <button 
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-cream hover:text-gold transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">AUDIOPHILE CONFIGURATOR</span>
                <h3 className="text-xl md:text-2xl font-serif text-white">
                  {selectedService ? selectedService : 'Premium Showroom Booking'}
                </h3>
                <p className="text-xs text-cream/60 font-light">
                  Please specify your parameters below for an accurate calibration callback.
                </p>
              </div>

              {/* Mini Quick-input form */}
              <div className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-cream/50 font-bold">Your Car Model / Room Size</label>
                  <input 
                    type="text" 
                    id="modal-input-space"
                    placeholder="e.g. Toyota Fortuner / Audi A4 / 15x20ft Living Room" 
                    className="w-full bg-charcoal/85 border border-white/10 p-3 rounded-lg text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-cream/50 font-bold">Desired Audio Goal</label>
                  <select 
                    id="modal-select-goal"
                    className="w-full bg-charcoal/85 border border-white/10 p-3 rounded-lg text-cream focus:outline-none focus:border-gold text-xs"
                  >
                    <option value="Immersive Dolby Surround Atmos upgrade">Immersive Dolby Surround Atmos upgrade</option>
                    <option value="High-End front soundstage time alignment upgrade">High-End front soundstage time alignment upgrade</option>
                    <option value="Heavy punchy tight bass with custom sub cabinet">Heavy punchy tight bass with custom sub cabinet</option>
                    <option value="Full multi-layer sound damping and noise-mitigation">Full multi-layer sound damping and noise-mitigation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-cream/50 font-bold">Acoustic Material Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Focal Premium', 'Audison Prima', 'Rockford Punch', 'B&O Signature look'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={(e) => {
                          const target = e.currentTarget;
                          const sibs = target.parentNode?.childNodes;
                          sibs?.forEach((s: any) => s.classList.remove('bg-gold/10', 'border-gold', 'text-gold'));
                          target.classList.add('bg-gold/10', 'border-gold', 'text-gold');
                        }}
                        className="py-2 px-3 bg-white/5 border border-white/5 rounded text-center text-cream/70 hover:bg-white/10 transition-all font-semibold"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* WhatsApp direct trigger */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const spaceVal = (document.getElementById('modal-input-space') as HTMLInputElement)?.value || "unspecified setup";
                    const goalVal = (document.getElementById('modal-select-goal') as HTMLSelectElement)?.value || "premium upgrade";
                    const text = `Hi Yash Car & Home Audio, I configured a custom request for: "${selectedService}". Details: my model is ${spaceVal}, desired goal is "${goalVal}". Please share packages and pricing.`;
                    
                    setBookingModalOpen(false);
                    handleWhatsappRedirect(text);
                  }}
                  className="w-full py-3 bg-gold hover:bg-gold-hover text-charcoal font-bold tracking-widest uppercase text-xs rounded-sm transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Submit to WhatsApp</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
                <p className="text-[9px] text-center text-cream/40">
                  Submission instantly starts direct chat line with Yash Lathia.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
