/**
 * The two controls the calculators need: a slider and a dropdown.
 *
 * **Native `<input type="range">` and `<select>`, no Radix.** The SvelteKit
 * pages use shadcn's `Slider` and `Select`, which are bits-ui underneath —
 * roughly 20KB of runtime to reimplement two controls the platform already
 * ships. The README budgets Radix for a combobox, and a combobox is a
 * different thing: it filters as you type over a long list. Nothing here
 * filters. FAQ.tsx made the same call for the same reason ("no Radix
 * needed") and it is the precedent this follows.
 *
 * What the native controls give for free, and what a rebuilt one has to earn
 * back: keyboard support (arrows, Home/End, Page Up/Down on the range), the
 * platform's own focus ring, the phone's native picker wheel for the select,
 * form autofill, and correct announcement in every screen reader without an
 * aria attribute being written.
 *
 * The one thing genuinely lost is the styled dropdown panel — a native
 * `<option>` list is drawn by the OS and cannot be themed. On a page whose
 * job is arithmetic, that is a good trade.
 *
 * Both are unlabelled-by-default hazards, so `label` is required on each and
 * wired with `useId` rather than a hand-written id: the solar calculator and
 * the subsidy checker both render a field called "state", and two `id="state"`
 * on one page would point every label at the first one.
 */
import { useId } from 'react';

/** Shared with LeadForm's FIELD, minus the placeholder colour a select has no use for. */
const CONTROL =
  'w-full rounded-md border border-line-strong bg-surface px-sm py-xs text-base transition-colors duration-fast ease-standard disabled:opacity-60';

export function RangeField({
  label,
  value,
  readout,
  min,
  max,
  step,
  hint,
  onChange
}: {
  label: string;
  value: number;
  /** The current value, already formatted — "Rs 3,00,000", "9.0%", "3 kW". */
  readout: string;
  min: number;
  max: number;
  step: number;
  /** The range in words, under the track: "Rs 500 - Rs 15,000". */
  hint: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2xs">
      <div className="flex items-baseline justify-between gap-sm">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {/* aria-hidden: the input already announces its own value, so a live
            readout here would have the screen reader say every number twice. */}
        <span aria-hidden className="text-base font-semibold tabular-nums text-action">
          {readout}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-action"
      />
      <p className="text-2xs text-ink-subtle">{hint}</p>
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  placeholder,
  disabled = false,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  /**
   * The empty first option, for the two selects that start unchosen. A select
   * with no placeholder cannot represent "not answered yet" — it would show
   * the first state in the list as though the reader had picked it.
   */
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2xs">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={CONTROL}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
