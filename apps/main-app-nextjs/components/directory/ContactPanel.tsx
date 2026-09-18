/**
 * Everything a reader needs to reach one installer, in one panel.
 * installer-profile.md §3 sections 4 and 10, merged.
 *
 * The old page had them apart: two buttons under the name, and a "Contact &
 * Location" card at the very bottom repeating the phone. §3 keeps both — the
 * buttons are the action and the list is reference — but only one of them
 * should look like a call to action, and the reference copy should not be a
 * scroll away from the name it belongs to. So it is one panel that sticks
 * beside the page on desktop and sits under the content on a phone.
 *
 * THE BUTTONS HERE ARE DESKTOP-ONLY, deliberately. Below `lg` the panel is at
 * the bottom of the page, and a call button that far down is a button nobody
 * presses — so the page renders its own copy inline under the name, where the
 * phone reader is. That is the specimen's arrangement; the duplication is
 * intentional and it is the only element duplicated.
 *
 * Rule 3: the icons are `ink-subtle`, not brand. They label the rows; they are
 * not things you can press. On the old page they were all brand orange, which
 * made five decorations louder than the actions beside them.
 *
 * `AtSign` rather than an Instagram glyph: lucide-react dropped its brand
 * icons, and the row is labelled Instagram in text anyway. A handle is what
 * the value is, so an @ is the honest mark for it.
 *
 * Rule 2 and the `<dl>`: every value in the list is a link except the address,
 * and links here keep their underline — sky on ink is 2.68:1, so colour alone
 * cannot say "link". §6 asks for this block to be marked up as a definition
 * list, which is what it has always been: icon + label + value.
 */
import { AtSign, ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react';

import { instagram, mapsUrl } from '@/lib/directory/urls';
import type { InstallerProfile } from '@/lib/directory/types';
import { CallButton, WhatsAppButton } from './ContactButtons';

function Fact({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-sm">
      {/* eslint-disable-next-line no-restricted-syntax -- 2px optical alignment of the
          icon to the label's cap height, not vertical rhythm. The scale starts at 4px
          and there is no token for this; snapping to mt-2xs visibly drops the icon. */}
      <span className="mt-0.5 shrink-0 text-ink-subtle">{icon}</span>
      <div className="min-w-0">
        <dt className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</dt>
        <dd className="mt-2xs break-words text-sm">{children}</dd>
      </div>
    </div>
  );
}

export function ContactPanel({ business }: { business: InstallerProfile }) {
  const { name, phone, email, website, address, city, level1 } = business;
  const maps = mapsUrl(business.googleMapsLink, city, level1);
  const social = instagram(business.instagramId);

  // First word of the business name. "Contact Adree" reads as a company you
  // could ring; "Contact Adree Energy Systems Private Limited" is a form
  // heading. Names run to 70 characters, so the full one cannot sit here.
  const shortName = name.trim().split(' ')[0];

  return (
    <div className="rounded-lg border border-line bg-surface p-lg lg:sticky lg:top-lg">
      <h2 className="text-lg leading-tight">Contact {shortName}</h2>

      {phone ? (
        <div className="mt-md hidden flex-col gap-xs lg:flex">
          <CallButton phone={phone} wide />
          <WhatsAppButton phone={phone} wide />
        </div>
      ) : null}

      <dl className="mt-lg grid gap-md border-t border-line pt-lg">
        {phone ? (
          <Fact icon={<Phone aria-hidden className="size-4" />} label="Phone">
            <a href={`tel:${phone}`} className="tabular-nums">
              {phone}
            </a>
          </Fact>
        ) : null}

        {email ? (
          <Fact icon={<Mail aria-hidden className="size-4" />} label="Email">
            <a href={`mailto:${email}`}>{email}</a>
          </Fact>
        ) : null}

        {website ? (
          <Fact icon={<Globe aria-hidden className="size-4" />} label="Website">
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </Fact>
        ) : null}

        {social ? (
          <Fact icon={<AtSign aria-hidden className="size-4" />} label="Instagram">
            <a href={social.href} target="_blank" rel="noopener noreferrer">
              {social.handle}
            </a>
          </Fact>
        ) : null}

        {address ? (
          <Fact icon={<MapPin aria-hidden className="size-4" />} label="Address">
            <span className="text-ink-muted">{address}</span>
          </Fact>
        ) : null}

        {maps ? (
          <Fact icon={<ExternalLink aria-hidden className="size-4" />} label="Directions">
            <a href={maps} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </Fact>
        ) : null}
      </dl>
    </div>
  );
}
