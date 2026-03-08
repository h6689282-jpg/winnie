import React from "react";
import { Link } from "react-router-dom";
import { Heart, Users, Sparkles, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const previewUsers = [
  {
    id: 1,
    name: "Alice",
    age: 25,
    location: "Taipei",
    bio: "Coffee lover, hiking on weekends, and always looking for good conversations.",
    interests: ["Coffee", "Hiking", "Movies"],
  },
  {
    id: 2,
    name: "Ryan",
    age: 28,
    location: "Taichung",
    bio: "Frontend engineer, gym enthusiast, and a big fan of live music.",
    interests: ["Coding", "Fitness", "Music"],
  },
  {
    id: 3,
    name: "Mia",
    age: 24,
    location: "Tainan",
    bio: "Traveling, photography, and discovering cute cafes around the city.",
    interests: ["Travel", "Photography", "Cafe"],
  },
];

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smart Matching",
    description: "Find people based on interests, profile details, and mutual likes.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Easy Profile Setup",
    description: "Create your profile quickly and show who you are with tags and intro.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Instant Match",
    description: "When both users like each other, a match is created instantly.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Add your basic info, bio, and interests to introduce yourself.",
  },
  {
    step: "02",
    title: "Discover People",
    description: "Browse user cards and choose who you want to like or pass.",
  },
  {
    step: "03",
    title: "Start Matching",
    description: "Get matched when someone likes you back and begin your story.",
  },
];

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">MeetNow</p>
            <p className="text-xs text-slate-500">Dating App Demo</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-pink-600">Features</a>
          <a href="#how-it-works" className="transition hover:text-pink-600">How It Works</a>
          <a href="#preview" className="transition hover:text-pink-600">Preview</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Profile
              </Link>
              <Link to="/discover" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Discover
              </Link>
              <Link to="/matches" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Matches
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Login
              </Link>
              <Link to="/register" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-violet-50" />
      <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full border border-pink-200 bg-white/80 px-4 py-1 text-sm font-medium text-pink-600 shadow-sm">
            Simple Matching Experience
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Find Your Match,
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"> Start Your Story</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Meet people who share your interests through a clean and modern matching experience.
            This project showcases a dating platform MVP built for full-stack interview presentation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-95">
              Get Started
            </Link>
            <Link to="/discover" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              View Demo
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span>Profile Setup</span>
            <span>Like / Pass</span>
            <span>Instant Match</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-pink-500 via-rose-400 to-violet-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">Discover</span>
                <Heart className="h-5 w-5" />
              </div>
              <div className="mt-6 rounded-3xl bg-white/20 p-4 backdrop-blur-sm">
                <div className="h-56 rounded-2xl bg-white/30" />
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Sophia, 26</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" /> Taipei
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/90">
                    Loves travel, brunch, and spontaneous weekend adventures.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Travel', 'Cafe', 'Movies'].map((tag) => (
                      <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="flex-1 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm">
                  Pass
                </button>
                <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm">
                  Like
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Features</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Built for a simple and intuitive matching flow
          </h2>
          <p className="mt-4 text-slate-600">
            Focused on the core dating app experience: profile creation, discovery, likes, and matches.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-md">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Start connecting in three simple steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="rounded-3xl bg-white p-8 shadow-sm">
              <span className="text-sm font-bold tracking-[0.25em] text-pink-500">{item.step}</span>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <section id="preview" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Preview</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Example user cards on the discover page
            </h2>
          </div>
          <p className="max-w-2xl text-slate-600">
            These cards simulate the profile discovery experience and make the homepage feel closer to a real product.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {previewUsers.map((user) => (
            <div key={user.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-64 bg-gradient-to-br from-rose-200 via-pink-100 to-violet-200" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {user.name}, {user.age}
                  </h3>
                  <span className="text-sm text-slate-500">{user.location}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{user.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.interests.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-14 text-center text-white shadow-2xl md:px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">Get Started</p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Ready to meet someone new?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Build your profile, explore user cards, and experience the full matching flow in this interview-ready demo project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:opacity-90">
              Create Account
            </Link>
            <Link to="/login" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
        <p>© 2026 MeetNow. Built for portfolio and interview demo.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-pink-600">About</a>
          <a href="#" className="hover:text-pink-600">Privacy</a>
          <a href="#" className="hover:text-pink-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
