'use client';
import { useState } from 'react';
import { site } from '../lib/site';

const MAX = 500;

// The form checks the entries, then opens the visitor's email app with the message addressed and ready to send.
// (No server needed: the message goes straight from their inbox to ours.)
export default function ContactForm() {
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(null);
  const [len, setLen] = useState(0);

  const onSubmit = e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = (f.get('name') || '').trim(), email = (f.get('email') || '').trim(), topic = f.get('topic'), message = (f.get('message') || '').trim();
    const next = {};
    if (!name) next.name = 'Please tell us your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Please enter a valid email, like name@example.com.';
    if (!f.get('consent')) next.consent = 'Please confirm so we can reply to you.';
    setErr(next);
    if (Object.keys(next).length) { e.currentTarget.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const subject = `${topic} — ${name}`;
    const body = `${message || '(No message written)'}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(name.split(' ')[0]);
    e.currentTarget.reset(); setLen(0);
  };

  if (sent) {
    return (
      <div className="form-done" role="status">
        <h3>Almost there, {sent}.</h3>
        <p>Your email app should now open with your message ready to send. If nothing opened, write to us directly at <a className="ulink" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <button className="cx ghosty" onClick={() => setSent(null)}>Write another message</button>
      </div>
    );
  }

  return (
    <form className="rv" style={{ '--d': '.1s' }} onSubmit={onSubmit} noValidate>
      <div className="f2">
        <label className="f">Name <b aria-hidden="true">*</b>
          <input name="name" autoComplete="name" aria-invalid={!!err.name} aria-describedby="e-name" />
          <span className="err" id="e-name">{err.name}</span>
        </label>
        <label className="f">Email <b aria-hidden="true">*</b>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!err.email} aria-describedby="e-email" />
          <span className="err" id="e-email">{err.email}</span>
        </label>
      </div>
      <label className="f">What's this about?
        <select name="topic"><option>Collaboration</option><option>Careers</option><option>Press</option><option>Something else</option></select>
      </label>
      <label className="f">Message <span className="count">{len}/{MAX}</span>
        <textarea name="message" rows={3} maxLength={MAX} onChange={e => setLen(e.target.value.length)} placeholder="A few lines about what you're curious about"></textarea>
      </label>
      <label className="chk"><input type="checkbox" name="consent" aria-invalid={!!err.consent} />
        <span>I agree to be contacted about this message.</span></label>
      <span className="err" role="alert">{err.consent}</span>
      <button className="cx solid" type="submit" style={{ justifySelf: 'start', padding: '12px 20px' }}>Send message →</button>
      <p className="fine">Fields marked * are required. Sending opens your email app.</p>
    </form>
  );
}
