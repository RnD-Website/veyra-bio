'use client';
import Molecule from './Molecule';

// Large, cropped close-ups of three molecules, used as a faint background layer in the footer.
export default function FooterMolecules() {
  return (
    <div className="foot-mol" aria-hidden="true">
      <div className="fm"><Molecule kind="ring" zoom={1.55} spin={1} /></div>
      <div className="fm"><Molecule kind="helix" zoom={1.35} spin={-1} /></div>
      <div className="fm"><Molecule kind="branch" zoom={1.55} spin={1} /></div>
    </div>
  );
}
