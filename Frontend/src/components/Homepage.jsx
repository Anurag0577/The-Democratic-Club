import { useState, useEffect, useRef } from "react";
import logo_img from '../assets/Images/the_democratic_club_logo_white.png'
import useAuthStore from '../store/useAuthStore.js'


// ─── Inline styles / design tokens ───────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@1&display=swap');

  .dc-root, .dc-root * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: rgb(114, 255, 33);
    --bg: rgb(10, 10, 10);
    --surface: rgb(13, 13, 13);
    --surface-alt: rgb(17, 17, 17);
    --text: rgb(255, 255, 255);
    --text-muted: rgba(255, 255, 255, 0.56);
    --border: rgba(255, 255, 255, 0.1);
    --radius-sm: 12px;
    --radius-md: 16px;
    --radius-lg: 24px;
  }

  .dc-root {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
  }

  .italic-serif { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; }

  /* ── Glow blobs ── */
  .blob-wrap {
    position: absolute; left: 50%; pointer-events: none;
    transform: translateX(-50%);
  }
  @keyframes spin-cw  { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(360deg);  } }
  @keyframes spin-ccw { from { transform: translate(-50%,-50%) rotate(0deg);   } to { transform: translate(-50%,-50%) rotate(-360deg); } }
  .blob-outer { position: absolute; left: 50%; top: 50%; border-radius: 50%; animation: spin-cw  10s linear infinite; filter: blur(70px); }
  .blob-inner { position: absolute; left: 50%; top: 50%; border-radius: 50%; animation: spin-ccw 12s linear infinite; filter: blur(32px); }

  /* ── Nav ── */
  .dc-nav {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 50;
    padding: 16px 0; backdrop-filter: blur(12px);
  }
  .dc-nav-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; justify-content: center; align-items: center;
  }
  .dc-nav-menu {
    display: flex; align-items: center; gap: 16px;
    background: rgba(0,0,0,.5); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 6px 24px;
    backdrop-filter: blur(12px);
    flex-wrap: wrap; justify-content: space-between;
  }
  .dc-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text); font-weight: 500; }
  .dc-logo svg { color: var(--brand); }
  .dc-nav-links { display: flex; align-items: center; gap: 4px; list-style: none; }
  .dc-nav-links a { padding: 8px 14px; font-size: 14px; font-weight: 500; color: var(--text); text-decoration: none; transition: color .2s; }
  .dc-nav-links a:hover { color: var(--text-muted); }
  .btn-primary {
    background: var(--brand); color: #000; font-weight: 600; font-size: 14px;
    padding: 10px 24px; border-radius: var(--radius-sm); text-decoration: none;
    transition: opacity .2s, transform .2s; white-space: nowrap; border: none; cursor: pointer;
  }
  .btn-primary:hover { opacity: .85; transform: translateY(-1px); }
  .btn-secondary {
    background: var(--surface); color: var(--text); font-weight: 500; font-size: 14px;
    padding: 10px 24px; border-radius: var(--radius-sm); text-decoration: none;
    box-shadow: 0 0 0 1px rgba(255,255,255,.08); transition: background .2s; border: none; cursor: pointer; white-space: nowrap;
  }
  .btn-secondary:hover { background: rgba(255,255,255,.1); }

  /* ── Hero ── */
  .hero {
    position: relative; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; overflow: hidden; text-align: center;
  }
  .hero-blob-wrap { bottom: -300px; width: 1100px; height: 700px; }
  .hero-blob-outer { width: 380px; height: 380px; background: conic-gradient(from 0deg,#72FF21,#4DFF00,#00a6ff,#4797ff,#044fff,#72FF21); }
  .hero-blob-inner { width: 280px; height: 280px; background: conic-gradient(from 0deg,#D4FFAD,#139ce5,#72FF21); }
  .hero-content { position: relative; z-index: 2; max-width: 900px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .hero-eyebrow { font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--brand); }
  .hero-h1 { font-size: clamp(36px, 7vw, 80px); font-weight: 500; letter-spacing: -.04em; line-height: 1.1; }
  .hero-sub { font-size: clamp(16px, 2vw, 20px); color: var(--text-muted); max-width: 700px; line-height: 1.65; }
  .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .btn-hero-primary {
    background: var(--brand); color: #000; font-weight: 600; font-size: 16px;
    padding: 14px 28px; border-radius: var(--radius-sm); text-decoration: none;
    transition: opacity .2s, box-shadow .2s, transform .2s;
  }
  .btn-hero-primary:hover { opacity: .9; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(114,255,33,.3); }
  .btn-hero-secondary {
    background: var(--surface); color: var(--text); font-weight: 500; font-size: 16px;
    padding: 14px 28px; border-radius: var(--radius-sm); text-decoration: none;
    box-shadow: 0 0 0 1px rgba(255,255,255,.08); transition: background .2s;
  }
  .btn-hero-secondary:hover { background: rgba(255,255,255,.1); }

  /* ── Sections ── */
  .section { padding: 80px 32px; max-width: 1280px; margin: 0 auto; }
  .section-bg { background: rgba(13,13,13,.2); }
  .section-bg-dark { background: rgba(13,13,13,.3); }
  .section-header { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; margin-bottom: 56px; }
  .pill { display: inline-block; padding: 6px 12px; border: 1px solid var(--border); background: var(--surface-alt); border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; }
  .section-h2 { font-size: clamp(28px, 5vw, 60px); font-weight: 500; letter-spacing: -.04em; line-height: 1.1; max-width: 800px; }

  /* ── The Problem ── */
  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .problem-eyebrow { color: var(--brand); font-weight: 700; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; }
  .problem-h2 { font-size: clamp(28px, 4vw, 48px); font-weight: 500; letter-spacing: -.04em; margin: 16px 0 24px; line-height: 1.1; }
  .problem-copy p { color: var(--text-muted); font-size: 17px; line-height: 1.7; margin-bottom: 20px; }
  .problem-copy strong { color: var(--text); }
  .problem-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .problem-card {
    aspect-ratio: 1; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 24px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; gap: 12px; font-size: 14px; font-weight: 500;
  }
  .problem-card:nth-child(2), .problem-card:nth-child(4) { transform: translateY(32px); }
  .problem-card .emoji { font-size: 28px; }

  /* ── How it works ── */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .step {
    position: relative; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 32px; overflow: hidden;
    transition: border-color .3s;
  }
  .step:hover { border-color: rgba(114,255,33,.5); }
  .step::before {
    content: ''; position: absolute; top: 0; right: 0; width: 120px; height: 120px;
    background: rgba(114,255,33,.1); border-radius: 50%; filter: blur(40px);
    transition: background .3s;
  }
  .step:hover::before { background: rgba(114,255,33,.2); }
  .step-num { font-size: 48px; font-weight: 700; color: rgba(114,255,33,.3); line-height: 1; }
  .step-title { font-size: 26px; font-weight: 500; letter-spacing: -.02em; }
  .step-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
  .step-body { font-size: 15px; color: var(--text-muted); line-height: 1.65; }

  /* ── Comparison ── */
  .compare-wrap { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }
  .compare-col { display: flex; flex-direction: column; gap: 24px; align-items: center; width: 100%; max-width: 440px; }
  .compare-label { font-size: 28px; font-weight: 500; letter-spacing: -.02em; display: flex; align-items: center; gap: 12px; }
  .compare-label.muted { color: #555; }
  .compare-list {
    width: 100%; padding: 32px; border: 1px solid var(--border); border-radius: var(--radius-lg);
    display: flex; flex-direction: column; gap: 20px; background: var(--surface); position: relative; overflow: hidden;
  }
  .compare-list.highlight { background: var(--bg); }
  .compare-item { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 500; }
  .compare-item.bad { color: var(--text-muted); }
  .compare-item.good { color: var(--text); }
  .compare-icon { width: 20px; height: 20px; flex-shrink: 0; }

  /* ── Features ── */
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
  .feature-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 32px; display: flex; flex-direction: column; gap: 16px;
  }
  .feature-num {
    width: 48px; height: 48px; background: rgba(114,255,33,.1); border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--brand);
  }
  .feature-title { font-size: 18px; font-weight: 500; }
  .feature-body { font-size: 14px; color: var(--text-muted); line-height: 1.65; }

  /* ── FAQ ── */
  .faq-wrap { max-width: 720px; margin: 0 auto; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-btn {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 24px 0; text-align: left; font-size: 17px; font-weight: 500;
    background: none; border: none; color: var(--text); cursor: pointer; gap: 16px;
  }
  .faq-icon { position: relative; width: 12px; height: 12px; flex-shrink: 0; }
  .faq-bar { position: absolute; background: var(--text); border-radius: 2px; transition: transform .3s; }
  .faq-h { top: 5px; left: 0; width: 12px; height: 2px; }
  .faq-v { top: 0; left: 5px; width: 2px; height: 12px; }
  .faq-v.open { transform: rotate(90deg); }
  .faq-answer { overflow: hidden; transition: max-height .4s ease; }
  .faq-answer p { font-size: 15px; color: var(--text-muted); line-height: 1.7; padding-bottom: 24px; }

  /* ── CTA ── */
  .cta-section { position: relative; padding: 80px 32px; overflow: hidden; }
  .cta-blob-wrap { bottom: -280px; width: 900px; height: 600px; }
  .cta-blob-outer { width: 380px; height: 380px; background: conic-gradient(from 0deg,#72FF21,#4DFF00,#00a6ff,#4797ff,#044fff,#72FF21); opacity: .8; }
  .cta-blob-inner { width: 280px; height: 280px; background: conic-gradient(from 0deg,#D4FFAD,#139ce5,#72FF21); }
  .cta-box {
    position: relative; z-index: 2; max-width: 900px; margin: 0 auto;
    background: rgba(0,0,0,.4); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 64px 48px; display: flex; flex-direction: column; align-items: center;
    gap: 20px; text-align: center; backdrop-filter: blur(8px);
  }
  .cta-h2 { font-size: clamp(28px, 5vw, 60px); font-weight: 500; letter-spacing: -.04em; max-width: 480px; line-height: 1.1; }
  .cta-sub { font-size: 18px; color: var(--text-muted); max-width: 560px; line-height: 1.65; }
  .cta-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }

  /* ── Footer ── */
  .footer {
    background: rgba(0,0,0,.5); border-top: 1px solid var(--border);
    padding: 64px 32px 24px; backdrop-filter: blur(8px);
  }
  .footer-inner { max-width: 1280px; margin: 0 auto; }
  .footer-top { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 48px; margin-bottom: 48px; }
  .footer-brand { display: flex; flex-direction: column; gap: 24px; max-width: 420px; }
  .footer-logo { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 500; text-decoration: none; color: var(--text); letter-spacing: -.04em; }
  .footer-tagline { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
  .footer-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
  .footer-form { display: flex; gap: 8px; flex-wrap: wrap; }
  .footer-input {
    flex: 1; min-width: 180px; padding: 10px 12px; border-radius: var(--radius-sm);
    border: none; background: #1c1c1c; color: var(--text); font-size: 14px;
  }
  .footer-input::placeholder { color: var(--text-muted); }
  .footer-links { display: flex; gap: 48px; flex-wrap: wrap; }
  .footer-col h4 { font-size: 16px; font-weight: 500; margin-bottom: 16px; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .footer-col a { font-size: 13px; color: var(--text-muted); text-decoration: none; transition: color .2s; }
  .footer-col a:hover { color: var(--text); }
  .footer-bottom { border-top: 1px solid var(--border); padding-top: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .footer-copy { font-size: 13px; color: var(--text-muted); }

  /* ── Scroll animation ── */
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1); }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .problem-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .compare-wrap { flex-direction: column; align-items: center; }
  }
  @media (max-width: 600px) {
    .dc-nav-links { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .problem-cards { grid-template-columns: 1fr 1fr; }
    .cta-box { padding: 40px 24px; }
    .section { padding: 56px 20px; }
  }
`;

// ─── SVG icons ───────────────────────────────────────────────────────────────
const MusicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);
const CheckIcon = () => (
  <svg className="compare-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);
const CrossIcon = () => (
  <svg className="compare-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// ─── Scroll-animate hook ──────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Blob({ wrapClass, outerClass, innerClass }) {
  return (
    <div className={`blob-wrap ${wrapClass}`} style={{ zIndex: 1 }}>
      <div className={`blob-outer ${outerClass}`} />
      <div className={`blob-inner ${innerClass}`} />
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-btn" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className="faq-icon">
          <span className="faq-bar faq-h" />
          <span className={`faq-bar faq-v ${open ? "open" : ""}`} />
        </span>
      </button>
      <div className="faq-answer" style={{ maxHeight: open ? 300 : 0 }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function FadeSection({ children, style }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in" style={style}>{children}</div>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function Homepage() {

    // store variables
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initialiseToken = useAuthStore((state) => state.initialiseToken)
    const openLoginModel = useAuthStore(state => state.openLoginModel);
    const openSignupModel = useAuthStore(state => state.openSignupModel);


    // run initialiseToken function when homepage load
    useEffect(() => {
        initialiseToken();
    }, [initialiseToken])

  return (
    <div className="dc-root">
      <style>{css}</style>

      {/* ── Nav ── */}
      <header className="dc-nav w-full">
        <nav className="dc-nav-inner w-full">
          <div className="dc-nav-menu w-full ">
            <div className="left-container">
                <img src={logo_img} alt="The Democratic Club logo" className="h-12 lg:h-15" />
            </div>
            <div className="flex gap-3">
                {
                    (isAuthenticated) ? (
                        <div className="flex items-center gap-1 ">
                            <div className="h-8 w-8 border rounded-full p-1 flex items-center justify-center m-5 cursor-pointer ">
                                <div className="text-center">{(user.firstname) ? user.firstname[0].toUpperCase() : 'X' }</div>
                            </div>
                        </div>
                    ) : (
                        <ul className="dc-nav-links">
                            <li key='' onClick={openLoginModel} ><a href='#'>Login</a></li>
                            <li key='' onClick={openSignupModel} ><a href='#'>Signup</a></li>
                        </ul>
                    )
                }
                <a href="#" className="btn-primary">Create a Room</a>

            </div>
            
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="hero" >
        <Blob wrapClass="hero-blob-wrap" outerClass="hero-blob-outer" innerClass="hero-blob-inner" />
        <div className="hero-content">
          <FadeSection>
            <h1 className="hero-h1">The <span className="italic-serif">Aux Cord</span> Just Got a <span className="italic-serif">Constitution.</span></h1>
          </FadeSection>
          <FadeSection>
            <p className="hero-sub">
              Welcome to the Republic of Sound—the first music queue built by the people, for the people.
              No more music dictators hijacking the speaker; here, your guests run the room. Share a link,
              add your favorite tracks, and let democracy settle the score.
            </p>
          </FadeSection>
          <FadeSection>
            <div className="hero-ctas">
              <a href="/dashboard" className="btn-hero-primary">Get Started</a>
              <a href="#the-problem" className="btn-hero-secondary">Why we built this</a>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── The Problem ── */}
      <div className="section-bg" id="the-problem">
        <div className="section">
          <div className="problem-grid">
            <FadeSection>
              <div>
                <p className="problem-eyebrow">The Music Conflict</p>
                <h2 className="problem-h2">Spotify wasn't designed for <span className="italic-serif">crowds.</span></h2>
                <div className="problem-copy">
                  <p><strong>The Party DJ Problem:</strong> One person controls the music. They play what <em>they</em> like. You're left shouting requests over the bass or feeling ignored while someone else hogs the aux cord all night.</p>
                  <p><strong>The Spotify Limitation:</strong> Great for your headphones, terrible for your living room. Spotify Jam gives everyone the power to skip—leading to absolute chaos and "song-sniping."</p>
                  <p><strong>The Social Friction:</strong> Asking to play a song is awkward. Seeing your song buried at the bottom of a 200-track queue is frustrating. We fixed the social politics of music.</p>
                </div>
              </div>
            </FadeSection>
            <FadeSection style={{ transitionDelay: "200ms" }}>
              <div className="problem-cards">
                {[["🔇","No more shouting requests"],["🚫","No more AUX cable hogs"],["🔀","No more skip wars"],["🗳️","Total group consensus"]].map(([emoji, label]) => (
                  <div key={label} className="problem-card">
                    <span className="emoji">{emoji}</span>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>
        </div>
      </div>

      {/* ── How it Works ── */}
      <div id="how-it-works">
        <div className="section">
          <FadeSection>
            <div className="section-header">
              <span className="pill">The Flow</span>
              <h2 className="section-h2">Democracy in <span className="italic-serif">60 seconds.</span></h2>
            </div>
          </FadeSection>
          <div className="steps">
            {[
              ["01","Create a Room","Host logs in with Spotify. One click creates a unique, encrypted room link. No app download for anyone."],
              ["02","Share the Link","Guests scan a QR or tap a link. They immediately see the active queue and can start searching Spotify's millions of tracks."],
              ["03","Vote to Play","Upvote what you love. The song with the most votes automatically moves to the 'Next' slot. Pure musical justice."],
            ].map(([num, title, body]) => (
              <FadeSection key={num}>
                <div className="step">
                  <div className="step-head">
                    <span className="step-num">{num}</span>
                    <h4 className="step-title">{title}</h4>
                  </div>
                  <p className="step-body">{body}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Comparison ── */}
      <div className="section-bg-dark" id="comparison">
        <div className="section">
          <FadeSection>
            <div className="section-header">
              <span className="pill">Comparison</span>
              <h2 className="section-h2">Why join <span className="italic-serif">The Club?</span></h2>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="compare-wrap">
              <div className="compare-col">
                <p className="compare-label muted">Standard Playlists</p>
                <ul className="compare-list">
                  {["One person's taste defines the night","Constant 'Can I play a song?' requests","Spotify Jam chaos: people skip songs","Guests feel excluded from the vibe"].map(t => (
                    <li key={t} className="compare-item bad"><CrossIcon /><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div className="compare-col">
                <p className="compare-label"><MusicIcon /><span>The Democratic Club</span></p>
                <ul className="compare-list highlight" style={{ position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "conic-gradient(from 228deg,#D4FFAD,#139ce5,#72FF21)", filter: "blur(32px)", top: -250, right: -250, animation: "spin-ccw 12s linear infinite", opacity: .6 }} />
                  {["Real-time voting determines order","Collective governance of the AUX","Only Host can skip/pause (No chaos)","Full social engagement for guests"].map(t => (
                    <li key={t} className="compare-item good" style={{ position: "relative", zIndex: 1 }}><CheckIcon /><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeSection>
        </div>
      </div>

      {/* ── Features ── */}
      <div id="features">
        <div className="section">
          <FadeSection>
            <div className="section-header">
              <span className="pill">The Toolkit</span>
              <h2 className="section-h2">Giving power back to the <span className="italic-serif">listeners.</span></h2>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="features-grid">
              {[
                ["01","Democratic Queue","The 'First-come-first-served' era is over. Songs with more upvotes rise. A song added 30 mins ago can be overtaken by a banger added just now."],
                ["02","Live Search & Preview","Search all of Spotify. Listen to a 30s preview before you add it to the queue to make sure it's the right remix."],
                ["03","Zero-App Entry","Nobody wants to download an app at a party. One scan, one browser tab, full control. Instant access for everyone."],
                ["04","Synced State","Every phone in the room updates instantly. When the host hits play, everyone sees the same progress bar and album art."],
                ["05","Admin Veto","Hosts are the 'Super-Admins'. You provide the speakers and the Spotify account—you keep the final word on skips and volume."],
                ["06","Spotify Integrated","Direct connection to Spotify's playback engine. Full tracks, high-quality audio, and legal streaming every time."],
              ].map(([num, title, body]) => (
                <div key={num} className="feature-card">
                  <div className="feature-num">{num}</div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-body">{body}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div id="faq" style={{ padding: "80px 32px" }}>
        <FadeSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, marginBottom: 8 }}>Curious?</h2>
            <p style={{ color: "var(--text-muted)" }}>How we keep the peace in the room.</p>
          </div>
          <div className="faq-wrap">
            <FaqItem
              q="Is this different from a Spotify Jam?"
              a="Very. In a Jam, everyone can skip songs and change the queue at will, which often leads to chaos. In The Democratic Club, the queue is ordered by votes, and only the host can skip or pause. It's democracy, not anarchy."
            />
            <FaqItem
              q="Do my guests need Spotify Premium?"
              a="Nope. Only the host (the person whose device is playing the music) needs a Spotify Premium account. Guests don't even need a Spotify account at all to vote or add songs."
            />
            <FaqItem
              q="What if someone adds a terrible song?"
              a="That's the beauty of the system! If a song is bad, the room simply won't upvote it, and it will stay at the bottom of the queue forever. If it's truly offensive, the host can delete it instantly from the Admin Dashboard."
            />
          </div>
        </FadeSection>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section">
        {/* <Blob wrapClass="cta-blob-wrap" outerClass="cta-blob-outer" innerClass="cta-blob-inner" /> */}
        <FadeSection>
          <div className="cta-box">
            <span className="pill">Ready to host?</span>
            <h2 className="cta-h2">Take back the <span className="italic-serif">vibe.</span></h2>
            <p className="cta-sub">Join thousands of hosts who have ended the aux cord wars forever. Connect Spotify and start your first room in 30 seconds.</p>
            <div className="cta-btns">
              <a href="#" className="btn-hero-primary">Create Room Now</a>
              <a href="#how-it-works" className="btn-hero-secondary">See Demo</a>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="footer-logo">
                <MusicIcon />
                <span>Democratic <span className="italic-serif">Club</span></span>
              </a>
              <div>
                <p className="footer-tagline">Join the musical revolution</p>
                <p className="footer-desc">Never let one person ruin the vibe again.</p>
                <div className="footer-form">
                  <input className="footer-input" type="email" placeholder="Your email address" />
                  <button className="btn-primary">Join</button>
                </div>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#how-it-works">How it works</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#the-problem">The Problem</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <ul>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2024 The Democratic Club. Spotify account required for host.</p>
            <p className="footer-copy">overthrowing musical dictatorships</p>
          </div>
        </div>
      </footer>
    </div>
  );
}