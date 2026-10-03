import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Route as RouteIcon, Target, Bell, CalendarCheck, Trophy,
  MessageCircle, BarChart3, CheckCircle2, ArrowLeft, ArrowRight,
  Building2, Car, Sparkles, Navigation, UserCheck, Check, Briefcase, HelpCircle, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Logo from "@/components/Logo";
import { sendLeadToGoogleSheet } from "@/lib/googleSheet";

export type QuestionnaireData = {
  role: string;
  customRole?: string;
  selectedChallenges: string[];
  name: string;
  showroomName: string;
  phone: string;
  city: string;
  teamSize: string;
};

interface Props {
  onComplete: (data: QuestionnaireData) => void;
  onSkip?: () => void;
}

export const ROLES = [
  {
    id: "owner",
    title: "Showroom Owner / Dealer Principal",
    icon: Building2,
    badge: "Executive",
    desc: "Focus on overall revenue, ROI, profitability, and staff accountability across branches."
  },
  {
    id: "gm",
    title: "General Manager / Branch Head",
    icon: Users,
    badge: "Operations",
    desc: "Oversee daily operations, team performance, customer satisfaction & delivery speed."
  },
  {
    id: "sales_manager",
    title: "Sales Manager",
    icon: Target,
    badge: "Sales Lead",
    desc: "Manage sales executives, monitor walk-ins, track deal pipeline & prevent lead drop-off."
  },
  {
    id: "sales_exec",
    title: "Sales Executive / Consultant",
    icon: UserCheck,
    badge: "Frontline",
    desc: "Handle walk-in customers, conduct test drives, manage follow-ups & earn fair commissions."
  },
  {
    id: "testdrive_coord",
    title: "Test Drive & Fleet Coordinator",
    icon: RouteIcon,
    badge: "Fleet",
    desc: "Control test drive car availability, vehicle safety, key logs & customer feedback."
  },
  {
    id: "pdi_ops",
    title: "Operations, PDI & Delivery Lead",
    icon: CalendarCheck,
    badge: "Delivery",
    desc: "Manage pre-delivery inspection, RTO documentation, finance, insurance & car key handovers."
  },
  {
    id: "other",
    title: "Other Designation",
    icon: Briefcase,
    badge: "Custom",
    desc: "Specify your custom role or designation in the dealership."
  }
];

export const CHALLENGES = [
  {
    id: "untracked_drives",
    title: "Untracked Test Drives & Home Demos",
    icon: Car,
    badge: "Fleet & Time",
    desc: "No idea where cars or executives are when they leave the showroom, or how long they will take."
  },
  {
    id: "unattended_walkins",
    title: "Customers Waiting Unattended in Showroom",
    icon: Users,
    badge: "Walk-In Experience",
    desc: "Walk-in customers leave frustrated because nobody knows which sales executive is free or available."
  },
  {
    id: "lost_leads",
    title: "Leads Lost in Registers & Missed Follow-ups",
    icon: Target,
    badge: "Sales Pipeline",
    desc: "Enquiries & hot leads get forgotten in paper registers without timely follow-up reminders."
  },
  {
    id: "out_showroom",
    title: "Executives Away 30+ Mins Without Active Customer",
    icon: Bell,
    badge: "Staff Accountability",
    desc: "Team members spending unproductive time outside without active customer meetings or status updates."
  },
  {
    id: "delivery_delays",
    title: "Delayed Delivery Workflow (Loans, RTO & PDI)",
    icon: CalendarCheck,
    badge: "Delivery Delay",
    desc: "Miscommunication between sales, finance, insurance, RTO, and PDI causing car handover delays."
  },
  {
    id: "incentive_disputes",
    title: "Monthly Incentive & Commission Disputes",
    icon: Trophy,
    badge: "Payout Conflict",
    desc: "End-of-month arguments over manual commission sheets, test drive logs, and deal credits."
  },
  {
    id: "slow_followup",
    title: "Slow WhatsApp Communication & Quotation Sending",
    icon: MessageCircle,
    badge: "Communication",
    desc: "Delay in sending instant quotation PDFs, brochures, and follow-up reminders to prospects on WhatsApp."
  },
  {
    id: "lack_reporting",
    title: "Lack of Real-Time Daily Analytics & ROI Reports",
    icon: BarChart3,
    badge: "Management Insights",
    desc: "No clear visibility into daily test drive conversion rates, executive rankings, and deal velocity."
  }
];

export default function ShowroomQuestionnaire({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRoleText, setCustomRoleText] = useState<string>("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  
  // Showroom details form
  const [formData, setFormData] = useState({
    name: "",
    showroomName: "",
    phone: "",
    city: "",
    teamSize: "6-15"
  });

  const toggleChallenge = (id: string) => {
    setSelectedChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && !selectedRole) return;
    if (step === 2 && selectedChallenges.length === 0) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const finalRole = selectedRole === "other" ? (customRoleText || "Dealership Representative") : (ROLES.find(r => r.id === selectedRole)?.title || selectedRole);
    
    // Send to Google Sheet (with error handling so questionnaire flow isn't blocked)
    try {
      await sendLeadToGoogleSheet({
        name: formData.name,
        showroomName: formData.showroomName,
        phone: formData.phone,
        city: formData.city,
        teamSize: formData.teamSize,
        role: finalRole,
        selectedChallenges,
        source: "Questionnaire Wizard"
      });
    } catch (err) {
      console.error("[Questionnaire] Google Sheet submission error:", err);
    }

    setSubmitting(false);

    onComplete({
      role: finalRole,
      customRole: customRoleText,
      selectedChallenges,
      name: formData.name,
      showroomName: formData.showroomName,
      phone: formData.phone,
      city: formData.city,
      teamSize: formData.teamSize
    });
  };

  const activeRoleObj = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[oklch(0.17_0.015_255)] text-[oklch(1_0_0)] flex flex-col justify-between p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[oklch(0.53_0.21_264)] opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[oklch(0.72_0.19_145)] opacity-15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-white/10 z-10">
        <Logo showTagline />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span>Step {step} of 4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.53_0.21_264)]"></span>
            <span>Requirement Wizard</span>
          </div>

          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs font-semibold text-white/70 hover:text-white underline decoration-white/30 transition-colors"
            >
              Skip to Full Website →
            </button>
          )}
        </div>
      </header>

      {/* Progress Line */}
      <div className="max-w-5xl w-full mx-auto mt-4 z-10">
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-[oklch(0.53_0.21_264)] h-full"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[oklch(0.53_0.21_264)] bg-[oklch(0.53_0.21_264)]/10 px-3 py-1 rounded-full border border-[oklch(0.53_0.21_264)]/20">
                  <Sparkles className="w-3.5 h-3.5" /> First Step
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display uppercase">
                  What is your <span className="text-[oklch(0.53_0.21_264)]">Role</span> in the Dealership?
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
                  Select your role so we can tailor the relevant features and solution package for your daily workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                {ROLES.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex gap-4 items-start ${
                        isSelected
                          ? "bg-[oklch(0.53_0.21_264)]/20 border-[oklch(0.53_0.21_264)] shadow-lg shadow-[oklch(0.53_0.21_264)]/10"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className={`p-3 rounded-lg flex-none ${isSelected ? "bg-[oklch(0.53_0.21_264)] text-white" : "bg-white/10 text-white/80"}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-white">{role.title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/60">
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed">{role.desc}</p>

                        {role.id === "other" && isSelected && (
                          <div className="pt-2">
                            <input
                              type="text"
                              placeholder="Enter your designation / role..."
                              value={customRoleText}
                              onChange={e => setCustomRoleText(e.target.value)}
                              className="w-full bg-black/40 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[oklch(0.53_0.21_264)]"
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  disabled={!selectedRole}
                  onClick={handleNext}
                  size="lg"
                  className="bg-[oklch(0.53_0.21_264)] hover:bg-[oklch(0.53_0.21_264)]/90 text-white font-bold px-8 shadow-lg shadow-[oklch(0.53_0.21_264)]/20"
                >
                  Continue to Challenges <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BIGGEST CHALLENGE QUESTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[oklch(0.59_0.22_28)] bg-[oklch(0.59_0.22_28)]/10 px-3 py-1 rounded-full border border-[oklch(0.59_0.22_28)]/20">
                  <AlertTriangle className="w-3.5 h-3.5" /> Second Step
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display uppercase">
                  What is your <span className="text-[oklch(0.59_0.22_28)]">Biggest Challenge</span> in your Showroom?
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                  Select the main operational pain points you want to solve. You can select multiple.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 max-h-[52vh] overflow-y-auto pr-1 scrollbar-thin">
                {CHALLENGES.map(ch => {
                  const Icon = ch.icon;
                  const isChecked = selectedChallenges.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => toggleChallenge(ch.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex gap-3.5 items-start ${
                        isChecked
                          ? "bg-[oklch(0.53_0.21_264)]/20 border-[oklch(0.53_0.21_264)] shadow-md"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-none border ${
                        isChecked ? "bg-[oklch(0.53_0.21_264)] border-[oklch(0.53_0.21_264)] text-white" : "border-white/30 bg-black/20"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isChecked ? "text-[oklch(0.53_0.21_264)]" : "text-white/60"}`} />
                            <h3 className="font-bold text-sm text-white">{ch.title}</h3>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                            {ch.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 leading-normal">{ch.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-2.5 rounded-lg border border-white/30 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/60 hidden sm:inline">
                    {selectedChallenges.length} challenge(s) selected
                  </span>
                  <Button
                    disabled={selectedChallenges.length === 0}
                    onClick={handleNext}
                    size="lg"
                    className="bg-[oklch(0.53_0.21_264)] hover:bg-[oklch(0.53_0.21_264)]/90 text-white font-bold px-8"
                  >
                    Next: Dealership Info <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DEALERSHIP DETAILS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[oklch(0.77_0.17_75)] bg-[oklch(0.77_0.17_75)]/10 px-3 py-1 rounded-full border border-[oklch(0.77_0.17_75)]/20">
                  <Building2 className="w-3.5 h-3.5" /> Third Step
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display uppercase">
                  Tell Us About <span className="text-[oklch(0.53_0.21_264)]">Your Showroom</span>
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
                  Provide a few details so we can tailor demo access and platform configuration.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[oklch(0.53_0.21_264)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">Showroom / Dealership Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Honda Showroom"
                      value={formData.showroomName}
                      onChange={e => setFormData({ ...formData, showroomName: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[oklch(0.53_0.21_264)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">Phone / WhatsApp Number</label>
                    <div className="flex items-center bg-black/40 border border-white/20 rounded-lg overflow-hidden focus-within:border-[oklch(0.53_0.21_264)]">
                      <span className="px-3 text-xs font-bold text-white/60 bg-white/5 border-r border-white/10 py-2.5">+91</span>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/80 uppercase tracking-wider">City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[oklch(0.53_0.21_264)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/80 uppercase tracking-wider">Showroom Sales Team Size</label>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {["1-5", "6-15", "16-50", "50+"].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, teamSize: size })}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          formData.teamSize === size
                            ? "bg-[oklch(0.53_0.21_264)] border-[oklch(0.53_0.21_264)] text-white"
                            : "bg-black/30 border-white/10 text-white/60 hover:bg-white/5"
                        }`}
                      >
                        {size} Executives
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-2.5 rounded-lg border border-white/30 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <Button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  size="lg"
                  className="bg-[oklch(0.53_0.21_264)] hover:bg-[oklch(0.53_0.21_264)]/90 text-white font-bold px-8"
                >
                  {submitting ? (
                    "Entering..."
                  ) : (
                    <>Enter Website & Explore Platform <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CUSTOMIZED SOLUTION SUMMARY & REDIRECT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-[oklch(0.72_0.19_145)]/20 text-[oklch(0.72_0.19_145)] rounded-2xl flex items-center justify-center mx-auto border border-[oklch(0.72_0.19_145)]/30 shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[oklch(0.72_0.19_145)] bg-[oklch(0.72_0.19_145)]/10 px-3 py-1 rounded-full border border-[oklch(0.72_0.19_145)]/20">
                  Customized Platform Profile Ready
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display uppercase">
                  Welcome, <span className="text-[oklch(0.53_0.21_264)]">{formData.name || "Showroom Partner"}</span>!
                </h1>
                <p className="text-white/70 text-sm md:text-base">
                  We have configured a tailored solution view for your role as <b>{activeRoleObj?.title || "Dealership Representative"}</b> at <b>{formData.showroomName || "your showroom"}</b>.
                </p>
              </div>

              {/* Requirement Summary Card */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto text-left space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-bold text-white/50 uppercase">Configured Role</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[oklch(0.53_0.21_264)]" />
                      {selectedRole === "other" ? (customRoleText || "Custom Role") : activeRoleObj?.title}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 bg-[oklch(0.59_0.22_28)]/20 text-[oklch(0.59_0.22_28)] rounded-full border border-[oklch(0.59_0.22_28)]/30">
                    {selectedChallenges.length} Challenges Identified
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    Selected Showroom Pain Points to Solve:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedChallenges.map(cId => {
                      const ch = CHALLENGES.find(c => c.id === cId);
                      if (!ch) return null;
                      const Icon = ch.icon;
                      return (
                        <div key={cId} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-black/30 border border-white/10 text-xs">
                          <Icon className="w-4 h-4 text-[oklch(0.59_0.22_28)] flex-none" />
                          <span className="font-semibold text-white/90 truncate">{ch.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/30 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  size="lg"
                  className="w-full bg-[oklch(0.53_0.21_264)] hover:bg-[oklch(0.53_0.21_264)]/90 text-white font-bold py-6 text-base shadow-xl shadow-[oklch(0.53_0.21_264)]/25"
                >
                  {submitting ? (
                    <>Saving & Entering...</>
                  ) : (
                    <>Enter Website & Explore Platform <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-5xl w-full mx-auto text-center py-4 border-t border-white/10 text-xs text-white/40 z-10">
        InField — Sales Team, Test Drive & Lead Management App for Car Showrooms
      </footer>
    </div>
  );
}
