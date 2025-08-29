import { Container } from "@/components/container";
import { MarqueImg } from "@/components/marquee-img";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Settings,
  Mic,
  ClipboardCheck,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Check,
  Bot,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

// Data for the sections, defined once at the top
const howItWorksSteps = [
  {
    icon: <Settings className="h-10 w-10 text-purple-600" />,
    title: "1. Customize Your Interview",
    description:
      "Select your industry, the specific role, and the type of interview you want to practice. Tailor the experience to your needs.",
  },
  {
    icon: <Mic className="h-10 w-10 text-purple-600" />,
    title: "2. Talk to Our AI",
    description:
      "Engage in a realistic conversation with our advanced AI interviewer. It asks relevant questions and adapts based on your unique responses.",
  },
  {
    icon: <ClipboardCheck className="h-10 w-10 text-purple-600" />,
    title: "3. Get Instant Feedback",
    description:
      "Receive a detailed report analyzing your answers, delivery, and confidence. Pinpoint where you excel and how you can improve.",
  },
];

const featuresList = [
  "Realistic Interview Simulations",
  "Comprehensive Performance Analysis",
  "Clarity & Confidence Score",
  "Customizable Interviews for Any Role",
  "Unlimited Practice Sessions",
];

const whyAIBenefits = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Build Unshakeable Confidence",
    description:
      "Walk into any room knowing you've prepared for the toughest questions and can present the best version of yourself.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Eliminate Interview Anxiety",
    description:
      "Get comfortable with interview pressure in a safe, private space. Our tool helps you conquer nerves by making the unknown familiar.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Outshine The Competition",
    description:
      "While others are just reading articles, you're getting hands-on practice and refining your skills with cutting-edge technology.",
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* =======================================================================
          HERO SECTION
      ======================================================================= */}
      <Container className="py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Unlock Your Interview
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              {" "}
              Superpower
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Boost your interview skills and increase your success rate with
            AI-driven insights. Discover a smarter way to prepare, practice, and
            stand out.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/generate">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Start Your Free Mock Interview
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* =======================================================================
          HOW IT WORKS SECTION
      ======================================================================= */}
      <div className="bg-gray-50/80 py-20 md:py-28">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Prepare for Success in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From setup to feedback, our process is designed to be simple,
              intuitive, and effective.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* =======================================================================
          MARQUEE SECTION
      ======================================================================= */}
      <div className="w-full my-12">
        <Marquee pauseOnHover>
          <MarqueImg img="/assets/img/logo/amazon.png" />
          <MarqueImg img="/assets/img/logo/deloitte.png" />
          <MarqueImg img="/assets/img/logo/google.png" />
          <MarqueImg img="/assets/img/logo/meta.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/netflix.png" />
          <MarqueImg img="/assets/img/logo/oracle.png" />
        </Marquee>
      </div>

      {/* =======================================================================
          FEATURES SECTION
      ======================================================================= */}
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-semibold text-purple-600">FEATURES</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Your Personal AI Interview Coach
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide everything you need to walk into your next interview
              feeling prepared and confident.
            </p>
            <ul className="mt-8 space-y-4">
              {featuresList.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="font-semibold">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:flex flex-col space-y-4 rounded-lg bg-slate-50 p-6 shadow-inner border border-gray-200">
            {/* AI Interviewer's Chat Bubble */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                {/* You might need to import the 'Bot' icon from lucide-react */}
                <Bot className="h-6 w-6 text-purple-700" />
              </div>
              <div className="bg-white p-3 rounded-lg rounded-bl-none border shadow-sm">
                <p className="text-sm text-gray-800">
                  So, tell me about yourself...
                </p>
              </div>
            </div>

            {/* User's Example Response Bubble */}
            <div className="flex items-start justify-end gap-3 mt-2">
              <div className="bg-purple-600 text-white p-3 rounded-lg rounded-br-none max-w-xs shadow-sm">
                <p className="text-sm">
                  "Certainly. I'm a product manager with over 4 years of
                  experience, specializing in SaaS products. I'm passionate
                  about user-centric design and recently led a team that
                  increased user retention by 15% through targeted feature
                  improvements."
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-semibold text-gray-700">
                Prepare for common questions like:
              </h5>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What are your biggest strengths and weaknesses?</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Describe a challenging situation you faced at work.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Why are you interested in this role at our company?
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* =======================================================================
          WHY AI SUPERPOWER SECTION
      ======================================================================= */}
      <div className="bg-gray-50/80 py-20 md:py-28">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Stop Guessing, Start Improving
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transform your preparation and gain a tangible edge in today's
              competitive job market.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyAIBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <div className="flex items-center text-purple-600">
                  {benefit.icon}
                  <h3 className="ml-4 text-xl font-bold">{benefit.title}</h3>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* =======================================================================
          FINAL CALL TO ACTION SECTION
      ======================================================================= */}
      <Container className="py-20 md:py-28 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Ready to Land Your Dream Job?
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Don't leave your interview to chance. Take control of your preparation
          with powerful AI insights. Start practicing today and make your next
          interview your best one.
        </p>
        <div className="mt-8">
          <Link to="/generate">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Start My Free Interview Now
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
