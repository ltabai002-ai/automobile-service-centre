import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity, ArrowRight, Bell, BriefcaseBusiness, CalendarCheck, Car, Check,
  ChevronRight, CircleDollarSign, Clock3, FileCheck2, Gauge, Headphones,
  MapPin, Menu, MessageCircle, Navigation, Phone, Route as RouteIcon, ShieldCheck,
  Smartphone, Target, Trophy, UserCheck, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/infield-showroom-hero.webp";
import deliveryImage from "@/assets/infield-car-delivery.webp";
import featTeamTrack from "@/assets/feat_team_track.png";
import featTestDrive from "@/assets/feat_test_drive.png";
import featLeadPipe from "@/assets/feat_lead_pipe.png";
const featureImages = [featTeamTrack, featTestDrive, featLeadPipe, heroImage, deliveryImage, heroImage];

type Icon = typeof Users;
type FormState = { name:string; showroom:string; phone:string; email:string; city:string; executives:string; vehicle_type:string; message:string };
const initialForm:FormState = { name:"",showroom:"",phone:"",email:"",city:"",executives:"",vehicle_type:"",message:"" };
const waBase = "https://wa.me/919164060961";

const status = [
  ["RK","Rajesh K.","On Test Drive","status-drive"],
  ["PS","Priya S.","With Customer","status-customer"],
  ["AV","Amit V.","Field Visit","status-field"],
  ["NM","Neha M.","Available","status-available"],
];
const problems:[Icon,string,string][] = [
  [Car,"Test drive gone — kab wapas aayega?","No idea where the car or the executive is."],
  [Clock3,"Home demo — kitna time lagega?","Executives leave and nobody knows for how long."],
  [MapPin,"Field visit — customer mila ya nahi?","No proof the meeting really happened."],
  [Users,"Customers waiting unattended","Walk-ins leave because nobody knew who was free."],
  [FileCheck2,"Leads lost in registers","Follow-ups missed, hot leads go cold."],
  [CircleDollarSign,"Incentive disputes every month","Manual commission sheets, endless arguments."],
];
const features:[Icon,string,string,string][] = [
  [Activity,"Live Sales Team Tracking","See every executive's status in real time.","team-tracking"],
  [RouteIcon,"Test Drive Management","Every test drive recorded, timed and verified.","test-drives"],
  [Target,"Lead Pipeline","Walk-in to delivery, no lead forgotten.","lead-pipeline"],
  [Bell,"Out-of-Showroom Alerts","Know when someone is out 30+ minutes.","alerts"],
  [CalendarCheck,"Booking to Delivery","Loan, insurance, RTO and PDI tracked.","delivery"],
  [Trophy,"Incentives & Commission","Auto-calculated, no disputes.","incentives"],
];
const why:[Icon,string][] = [[Activity,"Live Team Visibility"],[RouteIcon,"Verified Test Drives"],[Target,"No Lost Leads"],[CalendarCheck,"Faster Deliveries"],[CircleDollarSign,"Fair Incentives"],[Smartphone,"Android & iPhone"],[Headphones,"Setup Support Included"]];

function Logo({light=false}:{light?:boolean}) { return <a href="#top" className="logo" aria-label="InField home"><span className="logo-mark"><Navigation/></span><span className={light?"text-foreground-inverse":"text-foreground-inverse"}>In<span>Field</span></span></a> }
function SectionTitle({children,dark=false}:{children:ReactNode;dark?:boolean}) { return <div className={`section-title ${dark?"section-title-dark":""}`}><i/><h2>{children}</h2><i/></div> }
function Reveal({children,className=""}:{children:ReactNode;className?:string}) { const reduced=useReducedMotion(); return <motion.div className={className} initial={reduced?false:{opacity:0,y:24}} whileInView={reduced?undefined:{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.52,ease:"easeOut"}}>{children}</motion.div> }
function CtaLink({children,outline=false,className="",href="#contact"}:{children:ReactNode;outline?:boolean;className?:string;href?:string}) { return <Button asChild size="lg" variant={outline?"heroOutline":"hero"} className={className}><a href={href}>{children}</a></Button> }

function TeamPhone({dashboard=false}:{dashboard?:boolean}) { return <div className="phone-shell">
  <div className="phone-top"><span>9:41</span><span>● ● ▰</span></div>
  <div className="phone-head"><div><small>SHOWROOM 01</small><strong>{dashboard?"Live Dashboard":"Sales Team · Live"}</strong></div><Activity className="text-primary"/></div>
  {dashboard && <div className="counter-grid">{[["3","Available"],["2","With Customer"],["1","Test Drive"],["1","Field Visit"]].map(([n,l])=><div key={l}><strong>{n}</strong><small>{l}</small></div>)}</div>}
  {dashboard && <MiniMap/>}
  <div className="team-list">{status.map(([initial,name,label,cls])=><div className="team-row" key={name}><span className="avatar">{initial}</span><span><strong>{name}</strong><small>Updated just now</small></span><b className={cls}>{label}</b></div>)}</div>
  {dashboard && <div className="pipeline-mini"><span>Pipeline</span><b>18 active leads</b><em>₹46.8 L</em></div>}
</div> }
function MiniMap() { return <div className="mini-map"><svg viewBox="0 0 320 150" aria-label="Live showroom area map"><path d="M-10 120 C55 75 85 100 135 60 S235 22 330 48"/><path d="M25 5 C60 45 110 38 150 100 S240 142 300 115"/><circle cx="83" cy="73" r="7" className="dot-green"/><circle cx="170" cy="62" r="7" className="dot-blue"/><circle cx="245" cy="105" r="7" className="dot-purple"/><circle cx="208" cy="35" r="7" className="dot-amber"/></svg><span className="map-live">LIVE</span></div> }
function BrowserFrame({children,title}:{children:ReactNode;title:string}) { return <div className="browser-frame"><div className="browser-bar"><span/><span/><span/><b>{title}</b></div>{children}</div> }
function Benefits({items}:{items:string[]}) { return <ul className="benefits">{items.map(x=><li key={x}><span><Check/></span>{x}</li>)}</ul> }

function TeamMockup() {
  return (
    <BrowserFrame title="Live Team Map">
      <div className="tracking-mock" style={{ background: "var(--surface-light)", padding: "20px" }}>
        <div style={{ position: "relative", background: "var(--foreground-inverse)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ height: "245px" }}><MiniMap /></div>
          
          <motion.div className="map-label label-a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5, type: "spring" }} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            Rajesh K. <small style={{ color: "var(--status-drive)" }}>Test Drive</small>
          </motion.div>
          <motion.div className="map-label label-b" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5, type: "spring" }} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            Neha M. <small style={{ color: "var(--status-available)" }}>Available</small>
          </motion.div>
          <motion.div className="map-label label-c" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5, type: "spring" }} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            Amit V. <small style={{ color: "var(--status-field)" }}>Field</small>
          </motion.div>
        </div>

        <div className="activity-feed" style={{ marginTop: "16px", background: "var(--foreground-inverse)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <b style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "14px" }}>
            <Activity size={16} color="var(--primary)" /> LIVE ACTIVITY
          </b>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "var(--surface-light)", borderRadius: "8px" }}>
              <span style={{ background: "var(--status-available)", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 }}></span>
              <p style={{ margin: 0, padding: 0, border: "none", fontSize: "11px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                <b>Neha M.</b> marked status as <span style={{ color: "var(--status-available)", display: "inline-block", background: "none", width: "auto", height: "auto", margin: 0, fontWeight: "800" }}>Available</span>
              </p>
              <small style={{ marginLeft: "auto", color: "var(--muted-foreground)", fontSize: "9px", flexShrink: 0 }}>Just now</small>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "var(--surface-light)", borderRadius: "8px" }}>
              <span style={{ background: "var(--status-drive)", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 }}></span>
              <p style={{ margin: 0, padding: 0, border: "none", fontSize: "11px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                <b>Rajesh K.</b> started a <span style={{ color: "var(--status-drive)", display: "inline-block", background: "none", width: "auto", height: "auto", margin: 0, fontWeight: "800" }}>Test Drive</span>
              </p>
              <small style={{ marginLeft: "auto", color: "var(--muted-foreground)", fontSize: "9px", flexShrink: 0 }}>2m ago</small>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "var(--surface-light)", borderRadius: "8px" }}>
              <span style={{ background: "var(--status-customer)", width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 }}></span>
              <p style={{ margin: 0, padding: 0, border: "none", fontSize: "11px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                <b>Priya S.</b> assigned to <span style={{ color: "var(--status-customer)", display: "inline-block", background: "none", width: "auto", height: "auto", margin: 0, fontWeight: "800" }}>Walk-in</span>
              </p>
              <small style={{ marginLeft: "auto", color: "var(--muted-foreground)", fontSize: "9px", flexShrink: 0 }}>5m ago</small>
            </motion.div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
function TestDriveMockup(){return <div className="three-phones"><div className="mini-phone"><b>Test Drive Form</b>{["Customer  Mr. Sharma","Model  SUV XYZ","Reg  DL-01-AB-1234","Executive  Rajesh K.","Start  3:45 PM"].map(x=><p key={x}>{x}</p>)}<button>Start Test Drive</button></div><div className="mini-phone active-drive"><b>Test Drive Live</b><MiniMap/><strong>12:04</strong><span><Gauge/> 48 km/h</span></div><div className="mini-phone"><b>Drive Summary</b>{[["Duration","25 min"],["Distance","12 km"],["Rating","★★★★★"],["Follow-up","Required"],["Returned","4:10 PM"]].map(x=><p key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></p>)}</div></div>}
function PipelineMockup(){const cols=[["Walk-In","Mrs. Mehta · Sedan · ₹9.8 L"],["Hot Lead","Mr. Khan · SUV · ₹14.2 L"],["Test Drive Done","Mr. Sharma · SUV XYZ · ₹12.5 L"],["Negotiation","Ms. Gupta · EV · ₹18.6 L"],["Booking","Mr. Iyer · SUV · ₹15.4 L"],["Delivery","Mrs. Bose · Sedan · ₹11.1 L"]]; return <BrowserFrame title="Lead Pipeline"><div className="pipeline-alert"><Bell/> 3 follow-ups due today <small>Sample data</small></div><div className="kanban">{cols.map(([a,b],i)=><div className={`kanban-col k${i}`} key={a}><b>{a}</b><article><span>{b.slice(0,2)}</span><p>{b}</p><small>Follow-up today</small></article></div>)}</div><div className="stats-row"><b>Walk-In → Booking <em>18%</em></b><b>Hot Lead → Delivery <em>42%</em></b></div></BrowserFrame>}
function AlertMockup(){return <BrowserFrame title="Showroom Geofence"><div className="geofence"><div className="geo-ring"><span className="geo-pin">AV</span><div className="showroom">SHOWROOM</div></div><div className="timers"><span>05</span><span>15</span><span>30</span><b>35 min</b></div><div className="alert-phones"><div><Bell/><b>Amit V. out of showroom</b><p>35 mins, no active customer</p></div><div><Navigation/><b>Please update your status</b><p>You are outside the showroom area.</p></div></div></div></BrowserFrame>}
function DeliveryMockup(){return <BrowserFrame title="Booking #IF-2909"><div className="booking"><div><small>CUSTOMER</small><h4>Mr. Sharma · SUV XYZ</h4><div className="money-grid"><p>Ex-showroom<b>₹12,50,000</b></p><p>Down Payment<b>₹2,50,000</b></p><p>Loan<b>₹10,00,000</b></p><p>EMI<b>₹20,758 × 60</b></p></div></div><div className="checklist">{["Loan Approved","Insurance Done","RTO Registration","PDI Complete"].map(x=><p key={x}><span><Check/></span>{x}</p>)}<b><CalendarCheck/> Delivery: 30 Sep, 11:00 AM</b></div><div className="customer-msg">Your SUV XYZ is ready for delivery on 30 Sep 🎉</div></div></BrowserFrame>}
function IncentiveMockup(){return <BrowserFrame title="September Leaderboard · Sample data"><div className="leaderboard">{[["1","Rajesh K.","14","12","₹1.62 Cr","120%"],["2","Priya S.","11","10","₹1.28 Cr","100%"],["3","Neha M.","9","8","₹1.02 Cr","80%"]].map(r=><div key={r[0]}><strong>#{r[0]}</strong><b>{r[1]}</b><span>{r[2]} bookings</span><span>{r[3]} deliveries</span><span>{r[4]}</span><em>{r[5]}</em></div>)}<article><small>RAJESH'S INCENTIVE</small><b>12 cars × ₹3,000 = ₹36,000</b><b>+ Target Bonus ₹5,000</b><strong>₹41,000 <span>PAID ✓</span></strong></article><div className="award-row"><span>Star Salesperson</span><span>Test Drive King</span><span>Delivery Champion</span></div></div></BrowserFrame>}

function FeatureBlock({id,num,eyebrow,line1,line2,sub,benefits,mockup,dark=false,reverse=false,alert=false}:{id:string;num:string;eyebrow:string;line1:string;line2:string;sub:string;benefits:string[];mockup:ReactNode;dark?:boolean;reverse?:boolean;alert?:boolean}) { return <section id={id} className={`feature-block ${dark?"feature-dark":""}`}><div className={`container feature-layout ${reverse?"feature-reverse":""}`}><Reveal className="feature-copy"><span className="eyebrow">{num}. {eyebrow}</span><h3>{line1}<br/><em className={alert?"text-alert":"text-primary"}>{line2}</em></h3><p>{sub}</p><Benefits items={benefits}/><a className="text-link" href="#contact">Book a Free Demo <ArrowRight/></a></Reveal><Reveal className="feature-visual">{mockup}</Reveal></div></section> }

export default function InFieldLanding(){
 const [menu,setMenu]=useState(false); const [form,setForm]=useState<FormState>(initialForm); const [errors,setErrors]=useState<Partial<FormState>>({}); const [sending,setSending]=useState(false); const [success,setSuccess]=useState(""); const [contactVisible,setContactVisible]=useState(false);
 useEffect(()=>{document.body.style.overflow=menu?"hidden":""; return()=>{document.body.style.overflow=""}},[menu]);
 useEffect(()=>{const el=document.querySelector("#contact"); if(!el)return; const ob=new IntersectionObserver(([entry])=>setContactVisible(entry.isIntersecting),{threshold:.1});ob.observe(el);return()=>ob.disconnect()},[]);
 const close=()=>setMenu(false);
 const update=(key:keyof FormState,value:string)=>{setForm(v=>({...v,[key]:value}));setErrors(v=>({...v,[key]:undefined}))};
 const submit=async(e:FormEvent)=>{e.preventDefault();const next:Partial<FormState>={};if(form.name.trim().length<2)next.name="Enter your full name";if(form.showroom.trim().length<2)next.showroom="Enter your dealership name";if(!/^[6-9]\d{9}$/.test(form.phone))next.phone="Enter a valid 10-digit Indian number";if(form.email&&!/^\S+@\S+\.\S+$/.test(form.email))next.email="Enter a valid email";if(!form.executives)next.executives="Select team size";if(!form.vehicle_type)next.vehicle_type="Select vehicle type";setErrors(next);if(Object.keys(next).length)return;setSending(true);const {error}=await supabase.from("demo_requests").insert({...form,email:form.email||null,city:form.city||null,message:form.message||null});setSending(false);if(error){setErrors({message:"Couldn't send right now. Please try again."});return}const msg=`Hi InField Team, I want a free demo for my showroom.\nName: ${form.name}\nShowroom: ${form.showroom}\nPhone: ${form.phone}\nCity: ${form.city}\nSales Executives: ${form.executives}\nVehicle Type: ${form.vehicle_type}\nMessage: ${form.message}`;const url=`${waBase}?text=${encodeURIComponent(msg)}`;setSuccess(url);window.open(url,"_blank","noopener,noreferrer")};
 return <div id="top" className="site-shell">
  <header className="nav"><div className="container nav-inner"><Logo/><nav className="desktop-nav">{[["The Problem","#problem"],["Features","#features"],["How It Works","#how-it-works"],["FAQ","#faq"],["Contact","#contact"]].map(x=><a key={x[0]} href={x[1]}>{x[0]}</a>)}</nav><div className="nav-actions"><a href="tel:+919164060961"><Phone/>+91 9164060961</a><CtaLink>BOOK A FREE DEMO</CtaLink></div><Button variant="ghostInverse" size="icon" className="menu-button" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu/></Button></div></header>
  {menu&&<motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}}><div><Logo/><Button variant="ghostInverse" size="icon" onClick={close} aria-label="Close menu"><X/></Button></div><nav>{[["The Problem","#problem"],["Features","#features"],["How It Works","#how-it-works"],["FAQ","#faq"],["Contact","#contact"]].map(x=><a key={x[0]} href={x[1]} onClick={close}>{x[0]}<ChevronRight/></a>)}</nav><a className="mobile-phone" href="tel:+919164060961"><Phone/> +91 9164060961</a></motion.div>}
  <main>
   <section className="hero"><img src={heroImage} width={1536} height={1024} alt="Indian car showroom sales team assisting a customer"/><div className="hero-shade"/><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow">SALES MANAGEMENT APP FOR CAR SHOWROOMS</span><p className="hook">Kaun free hai? Kaun test drive pe hai? Kaunsa lead stuck hai?</p><h1>Track Your Sales Team,<br/>Test Drives & Every Deal<br/><em>From One App.</em></h1><p className="hero-sub">See who's free, who's on a test drive and which lead is stuck — live. From walk-in to booking, delivery and incentives.</p><div className="hero-buttons"><CtaLink>BOOK A FREE DEMO</CtaLink><CtaLink href="#features" outline>SEE HOW IT WORKS</CtaLink></div></div><motion.div className="hero-phone" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:.7,delay:.15}}><TeamPhone/></motion.div></div><div className="container trust-strip">{[[Activity,"Live Sales Team Tracking"],[RouteIcon,"Test Drive Records"],[Target,"Lead Pipeline"],[CircleDollarSign,"Auto Incentives"]].map(([I,t])=><div key={String(t)}><I/><span>{t}</span></div>)}</div></section>
   <section id="problem" className="section light-section"><div className="container"><SectionTitle>RUNNING A SHOWROOM WITHOUT <span>VISIBILITY</span></SectionTitle><div className="problem-grid">{problems.map(([I,t,d])=><Reveal className="problem-card" key={t}><I/><div><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div><p className="closing-line">Every lost minute is a lost customer. And a lost deal.</p></div></section>
   <section className="solution section"><div className="container"><SectionTitle dark>ONE APP. <span>YOUR ENTIRE SHOWROOM SALES.</span></SectionTitle><p className="section-sub">InField digitally manages your sales team, test drives, customer enquiries and deal pipeline — all in one app.</p><Reveal className="solution-stage"><div className="float-card float-a"><Car/><span><b>Rajesh K. · Mr. Sharma</b><small>SUV XYZ · Test Drive</small></span></div><TeamPhone dashboard/><div className="float-card float-b"><Target/><span><b>Deal stage: Negotiation</b><small>Expected closure: 28 Sep</small></span></div></Reveal><div className="status-legend">{[["Available","status-available"],["With Customer","status-customer"],["On Test Drive","status-drive"],["Field Visit","status-field"],["Alert","status-alert"]].map(x=><span key={x[0]}><i className={x[1]}/>{x[0]}</span>)}</div></div></section>
   <section id="features" className="section light-section"><div className="container"><SectionTitle>EVERYTHING YOUR SHOWROOM <span>NEEDS</span></SectionTitle><div className="features-grid">{features.map(([I,t,d,id],i)=><Reveal className={`feature-card feature-img-${i+1}`} key={t}><img className="feature-card-bg" src={featureImages[i]} alt="" loading="lazy"/><div><I/><h3>{t}</h3><p>{d}</p><a href={`#${id}`}>See how it works <ArrowRight/></a></div><ChevronRight className="mobile-chevron"/></Reveal>)}</div></div></section>
   <FeatureBlock id="team-tracking" num="01" eyebrow="LIVE SALES TEAM TRACKING" line1="Know Who's Free, Busy or Out —" line2="In Real Time." sub="One live view of every executive, customer interaction and field movement." benefits={["Live status of every executive","Assign new walk-ins to whoever is free","Activity feed with timestamps"]} mockup={<TeamMockup/>}/>
   <FeatureBlock id="test-drives" num="02" eyebrow="TEST DRIVE MANAGEMENT" line1="Every Test Drive —" line2="Recorded & Verified." sub="Replace paper registers with a complete, time-stamped test drive record." benefits={["Car, customer, time and route saved automatically","Time-stamped records","Customer feedback after every drive"]} mockup={<TestDriveMockup/>} reverse/>
   <FeatureBlock id="lead-pipeline" num="03" eyebrow="LEAD PIPELINE" line1="Every Enquiry in One Pipeline —" line2="No Lead Left Behind." sub="Move every prospect from walk-in to delivery with the next action always visible." benefits={["Follow-up reminders at every stage","See which lead is stuck","Conversion rates at a glance"]} mockup={<PipelineMockup/>}/>
   <FeatureBlock id="alerts" num="04" eyebrow="OUT-OF-SHOWROOM ALERTS" line1="Out of Showroom for 30+ Minutes?" line2="You'll Know Instantly." sub="Protect productive time without tracking your team beyond working hours." benefits={["Set your own showroom radius","Alert only after 30 minutes without an active customer","Tracking only during working hours"]} mockup={<AlertMockup/>} dark reverse alert/>
   <FeatureBlock id="delivery" num="05" eyebrow="BOOKING TO DELIVERY" line1="From Booking to Car Keys —" line2="Every Step Tracked." sub="Keep finance, insurance, registration, inspection and delivery in sync." benefits={["All documents tracked in one place","Delivery date visible to the manager","Customer kept updated at every stage"]} mockup={<DeliveryMockup/>}/>
   <FeatureBlock id="incentives" num="06" eyebrow="INCENTIVES & COMMISSION" line1="Incentives Calculated Automatically —" line2="Zero Disputes." sub="Turn verified performance into transparent monthly payouts." benefits={["Test drives, bookings, deliveries and revenue per executive","Commission and bonus auto-calculated","Monthly leaderboard motivates the team"]} mockup={<IncentiveMockup/>} reverse/>
   <section className="blue-banner"><div className="container"><h2>See InField running in your showroom.</h2><Button asChild variant="inverse" size="lg"><a href="#contact">BOOK A FREE DEMO</a></Button></div></section>
   <section className="section light-section"><div className="container"><SectionTitle>WHY SHOWROOM OWNERS CHOOSE <span>INFIELD</span></SectionTitle><div className="why-row">{why.map(([I,t])=><div key={t}><I/><b>{t}</b></div>)}</div><div className="vehicle-strip">Built for dealerships of every size <span/> Cars <span/> SUVs <span/> Two-Wheelers <span/> Commercial Vehicles <span/> Pre-Owned</div></div></section>
   <section id="how-it-works" className="section steps-section"><div className="container"><SectionTitle>HOW TO GET <span>STARTED</span></SectionTitle><div className="steps">{[[Phone,"Book a Free Demo"],[Users,"Add Your Sales Team"],[MapPin,"Set Your Showroom Radius"],[Activity,"Track Team, Test Drives & Leads Live"],[CircleDollarSign,"Incentives Calculated Automatically"]].map(([I,t],i)=><div key={String(t)}><span className="step-icon"><I/><b>{i+1}</b></span><h3>{t}</h3>{i<4&&<ArrowRight className="step-arrow"/>}</div>)}</div></div></section>
   <section id="faq" className="section faq-section"><div className="container narrow"><SectionTitle>QUESTIONS SHOWROOM OWNERS <span>ASK</span></SectionTitle><Accordion type="single" collapsible className="faq-list">{["Do my executives need a smartphone?","Does tracking work only during working hours?","How is test drive route recorded?","Can I use it for multiple showrooms?","Is my customer data safe?","How long does setup take?","How much does it cost?"].map((q,i)=><AccordionItem value={`q${i}`} key={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>[CONFIRM]</AccordionContent></AccordionItem>)}</Accordion></div></section>
   <section id="contact" className="contact-section"><img src={deliveryImage} loading="lazy" width={1536} height={864} alt="Customer receiving keys at an Indian car showroom"/><div className="contact-shade"/><div className="container contact-layout"><div className="contact-copy"><span className="eyebrow">BOOK YOUR FREE DEMO</span><h2>DRIVE SALES.<br/><em>DELIVER SMILES.</em></h2><p>Manage your entire showroom sales from one app.</p><Benefits items={["Free demo","No obligation","Setup support included"]}/></div><form className="demo-form" onSubmit={submit} noValidate><div className="form-grid"><Field label="Full Name*" error={errors.name}><input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your name"/></Field><Field label="Showroom / Dealership Name*" error={errors.showroom}><input value={form.showroom} onChange={e=>update("showroom",e.target.value)} placeholder="Dealership name"/></Field><Field label="Phone*" error={errors.phone}><div className="phone-input"><span>+91</span><input inputMode="numeric" maxLength={10} value={form.phone} onChange={e=>update("phone",e.target.value.replace(/\D/g,""))} placeholder="10-digit number"/></div></Field><Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="Email address"/></Field><Field label="City"><input value={form.city} onChange={e=>update("city",e.target.value)} placeholder="City"/></Field><Field label="Number of Sales Executives*" error={errors.executives}><select value={form.executives} onChange={e=>update("executives",e.target.value)}><option value="">Select…</option>{["1–5","6–15","16–30","30+"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Vehicle Type*" error={errors.vehicle_type}><select value={form.vehicle_type} onChange={e=>update("vehicle_type",e.target.value)}><option value="">Select…</option>{["Cars","Two-Wheelers","Both","Commercial"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Message" error={errors.message} full><textarea value={form.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us about your showroom"/></Field></div><Button type="submit" variant="hero" size="lg" className="submit-button" disabled={sending}>{sending?<><span className="spinner"/> SENDING…</>:"BOOK MY FREE DEMO ON WHATSAPP →"}</Button>{success&&<div className="success"><Check/> Request received. <a href={success} target="_blank" rel="noreferrer">Didn't open WhatsApp? Click here</a></div>}</form></div></section>
  </main>
  <footer className="footer"><div className="container footer-grid"><div><div className="logo-badge"><Logo/></div><p>Sales management app for car showrooms & dealerships.</p></div><FooterCol title="Features" links={["Live Team Tracking","Test Drives","Lead Pipeline","Out-of-Showroom Alerts","Booking to Delivery","Incentives"]}/><FooterCol title="Company" links={["About","Contact","FAQ"]}/><div><h3>Contact</h3><a href="tel:+919164060961">+91 9164060961</a><a href={`${waBase}?text=Hi%20InField%20Team`} target="_blank" rel="noreferrer">WhatsApp</a><span>Email [CONFIRM]</span></div></div><div className="footer-bottom"><div className="container"><span>© 2026 InField. All rights reserved.</span><nav><a href="#top">Privacy Policy</a><a href="#top">Terms & Conditions</a></nav></div></div></footer>
  <a className="whatsapp" href={`${waBase}?text=Hi%20InField%20Team%2C%20I%27m%20interested%20in%20InField%20for%20my%20showroom.`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle/><span>Chat on WhatsApp</span></a>
  {!contactVisible&&<div className="mobile-bar"><a href="tel:+919164060961"><Phone/> Call</a><a href="#contact">BOOK A FREE DEMO</a></div>}
 </div>
}
function Field({label,error,children,full=false}:{label:string;error?:string;children:ReactNode;full?:boolean}){return <label className={full?"field full":"field"}><span>{label}</span>{children}{error&&<small>{error}</small>}</label>}
function FooterCol({title,links}:{title:string;links:string[]}){return <div><h3>{title}</h3>{links.map(x=><a href={x==="FAQ"?"#faq":x==="Contact"?"#contact":"#features"} key={x}>{x}</a>)}</div>}
