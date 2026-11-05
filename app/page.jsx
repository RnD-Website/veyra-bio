import Header from '../components/Header';
import Process from '../components/Process';
import ContactForm from '../components/ContactForm';
import Reveal from '../components/Reveal';
import Scene from '../components/Scene';
import SideNav from '../components/SideNav';
import OverviewCards from '../components/OverviewCards';
import AudienceSelector from '../components/AudienceSelector';
import FooterMolecules from '../components/FooterMolecules';
import ScrollFX from '../components/ScrollFX';
import ScrollText from '../components/ScrollText';
import CopyEmail from '../components/CopyEmail';
import { SectionHead } from '../components/ui';
import { site } from '../lib/site';

const faqs = [
  ['What does Veyra Bio do?', 'We build tools that read molecular chains one unit at a time and present the results in a clear, comparable form that teams can discuss and share.'],
  ['Who is it for?', 'Research teams, clinical partners and technology partners. The "Who it\'s for" section shows how each might work with us.'],
  ['How does the method work?', 'In four steps: Gather, Unfold, Read and Align. The Method section walks through what happens at each step and what you get from it.'],
  ['How do I get started?', 'Send us a short note through the contact form. Tell us who you are and what you are curious about, and we will reply by email.'],
  ['What happens to the details I send?', 'The contact form opens your own email app with your message ready to send, so what you write goes straight to us and nowhere else.'],
  ['Are you hiring?', 'We are always glad to hear from curious scientists, engineers and designers. Take a look at Careers, or simply send us a note.'],
];

const teams = [
  ['Science', 'Molecular methods and analysis'],
  ['Engineering', 'Software, data and instruments'],
  ['Design', 'Clear results, clearly shown'],
  ['Operations', 'Keeping everything running'],
];

export default function Home() {
  return (
    <>
      <Scene />
      <Reveal />
      <ScrollFX />
      <Header />
      <SideNav />
      <main id="main">
        {/* 1. What is this? */}
        <section id="hero" className="dk" data-pose="0">
          <div className="pin">
            <h1 className="rv" style={{ '--d': '.06s' }}>Clarity at the molecular scale</h1>
            <p className="hero-sub rv" style={{ '--d': '.14s' }}>Veyra Bio helps research teams <u>see</u>, <u>read</u> and <u>compare</u> molecular chains, and understand the results in plain language.</p>
            <div className="hero-btns rv" style={{ '--d': '.22s' }}>
              <a className="cx solid" href="#facts">See how it works</a>
              <a className="cx solid sq" href="#facts" aria-label="Go">→</a>
            </div>
            <div className="scrollchip rv" style={{ '--d': '.3s' }}>
              <span className="cx ghosty">Scroll</span>
              <a className="cx ghosty sq" href="#facts" aria-label="Scroll down">↓</a>
            </div>
          </div>
        </section>

        {/* 2. In thirty seconds */}
        <section id="facts" className="dk sect" data-pose="5">
          <SectionHead eyebrow="Overview" title="Veyra in thirty seconds" lead="Three quick answers, so you can decide whether to keep reading." />
          <OverviewCards />
          <div className="row-actions rv"><a className="cx solid" href="#process">Explore the method</a><a className="cx ghosty" href="#faq">Jump to questions</a></div>
        </section>

        {/* 3. How does it work? */}
        <Process />

        {/* 4. Is it for me? */}
        <section id="audience" className="dk sect" data-pose="5">
          <SectionHead center eyebrow="Who it's for" title="Find yourself in the picture" lead="Three kinds of teams we build for. Pick the one closest to you." />
          <div className="rv"><AudienceSelector /></div>
        </section>

        {/* 5. Can I trust them? */}
        <section id="statement" className="lt about-sec" data-pose="2">
          <div className="about2">
            <span className="about-eyebrow rv text-label uppercase"><i></i>About Veyra</span>
            <div className="about-top">
              <h2 className="rv text-h1 text-head" data-par=".06">Slow science,<br /><span className="font-light text-accent">told clearly.</span></h2>
              <ScrollText className="text-lead text-copy max-w-[26rem]">We make molecular results easier to read, compare and share, so teams can spend their time on the questions that matter.</ScrollText>
            </div>
            <div className="about-mol rv" style={{ '--d': '.15s' }} data-scrub>
              <svg className="mol-diagram" viewBox="0 0 1000 230" role="img" aria-label="Three atoms joined by bonds: patience, precision and plain language">
                <defs>
                  <radialGradient id="atA" cx="34%" cy="28%" r="75%"><stop offset="0" stopColor="#ffffff" /><stop offset=".3" stopColor="#8fbaff" /><stop offset="1" stopColor="#204287" /></radialGradient>
                  <radialGradient id="atB" cx="34%" cy="28%" r="75%"><stop offset="0" stopColor="#ffffff" /><stop offset=".3" stopColor="#9fdcff" /><stop offset="1" stopColor="#2f63d8" /></radialGradient>
                  <radialGradient id="atC" cx="34%" cy="28%" r="75%"><stop offset="0" stopColor="#ffffff" /><stop offset=".3" stopColor="#bfe9e6" /><stop offset="1" stopColor="#3f7fb0" /></radialGradient>
                  <radialGradient id="atS" cx="34%" cy="28%" r="75%"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#7fb0ff" /></radialGradient>
                </defs>
                <g className="bonds" fill="none" strokeLinecap="round">
                  <path className="bond" d="M168 132 L500 84" pathLength="1" />
                  <path className="bond" d="M500 76 L832 124" pathLength="1" />
                  <path className="bond" d="M500 92 L832 140" pathLength="1" />
                  <path className="bond thin" d="M168 132 L92 188" pathLength="1" />
                  <path className="bond thin" d="M500 84 L560 28" pathLength="1" />
                  <path className="bond thin" d="M832 132 L900 190" pathLength="1" />
                  <path className="bond thin" d="M832 132 L912 84" pathLength="1" />
                </g>
                <g className="atoms">
                  <g className="atom a1"><circle cx="168" cy="132" r="46" fill="url(#atA)" /><circle cx="92" cy="188" r="13" fill="url(#atS)" /></g>
                  <g className="atom a2"><circle cx="500" cy="84" r="46" fill="url(#atB)" /><circle cx="560" cy="28" r="12" fill="url(#atS)" /></g>
                  <g className="atom a3"><circle cx="832" cy="132" r="46" fill="url(#atC)" /><circle cx="900" cy="190" r="13" fill="url(#atS)" /><circle cx="912" cy="84" r="11" fill="url(#atS)" /></g>
                </g>
              </svg>
              <ul className="about-vals">
                <li><span className="vn">01</span><b>Patience</b><p>Good science takes the time it takes. We design for careful, not fast.</p></li>
                <li><span className="vn">02</span><b>Precision</b><p>Every step is described honestly, including what we don't yet know.</p></li>
                <li><span className="vn">03</span><b>Plain language</b><p>If it can't be explained simply, it isn't ready to be shown.</p></li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Questions */}
        <section id="faq" className="lt sect" data-pose="6">
          <SectionHead center eyebrow="Questions" title="Answered plainly" lead={<>The things people usually ask first. Can't find yours? <a className="ulink" href="#contact">Ask us</a>.</>} />
          <div className="faq" data-scrub>
            {faqs.map(([q, a], k) => (
              <details key={q} open={k === 0} style={{ '--i': k }}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>

        {/* 7. Join */}
        <section id="careers" className="dk sect" data-pose="3">
          <div className="cgrid">
            <div>
              <span className="rv mb-4 block text-label uppercase opacity-75">Careers</span>
              <h2 className="rv mb-5 text-h1 text-head" data-par=".05">Help write what comes next</h2>
              <ScrollText className="max-w-[28rem] text-lead text-copy">We are a small team of curious builders and scientists. We don't have open roles listed right now, but we would love to hear from you.</ScrollText>
              <div className="row-actions rv"><a className="btn ghost" href="#contact">Say hello →</a></div>
            </div>
            <ul className="teams" data-scrub>
              {teams.map(([t, d], k) => (
                <li key={t} style={{ '--i': k }}><b>{t}</b><span>{d}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Act */}
        <section id="contact" className="dk" data-pose="4">
          <div className="cg">
            <div>
              <span className="rv mb-4 block text-label uppercase opacity-75">Contact</span>
              <h2 className="rv mb-5 text-h1 text-head" data-par=".05">Start a conversation</h2>
              <p className="rv max-w-[28rem] text-lead text-copy" style={{ '--d': '.06s' }}>Tell us who you are and what you're curious about. A sentence or two is plenty.</p>
              <ol className="next rv" style={{ '--d': '.1s' }}>
                <li><b>You write</b> a short note.</li>
                <li><b>We read</b> every message.</li>
                <li><b>We reply</b> by email.</li>
              </ol>
              <div className="cinfo rv" style={{ '--d': '.14s' }}><a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="foot dk">
        <FooterMolecules />
        <div className="foot-in">
          <div className="foot-cta">
            <span className="rv mb-4 block text-label uppercase opacity-75">Get in touch</span>
            <h2 className="rv mb-8 text-h1 text-head" data-par=".04">Clearer science<br /><span className="font-light text-accent">starts with a question.</span></h2>
            <div className="foot-actions rv" style={{ '--d': '.1s' }}>
              <a className="cx solid" href="#contact">Send a message →</a>
              <CopyEmail email={site.email} />
            </div>
          </div>
          <div className="foot-grid">
            <div className="foot-brand">
              <span className="brand"><i></i>veyra/bio</span>
              <p>Molecular results, made clear.</p>
            </div>
            <nav className="foot-cols" aria-label="Footer">
              <div><b>Explore</b><a href="#facts">Overview</a><a href="#process">Method</a><a href="#audience">Who it's for</a></div>
              <div><b>Company</b><a href="#statement">About</a><a href="#faq">FAQ</a><a href="#careers">Careers</a></div>
              <div><b>Contact</b><a href="#contact">Send a message</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
            </nav>
          </div>
          <div className="foot-word" aria-hidden="true" data-scrub="end">veyra</div>
          <div className="foot-bot">
            <p className="legal">© {site.year} {site.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
