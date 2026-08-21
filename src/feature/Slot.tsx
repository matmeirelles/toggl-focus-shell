/**
 * FEATURE_SLOT
 *
 * Friday: mount the assessment feature here. Keep the shell intact.
 *
 * placements:
 * - "topbar"  — entry point next to the timer controls
 * - "calendar" — overlay, side panel, or inline UI on the calendar
 *
 * Buttons inside YOUR feature must work. The rest of the app can stay dead.
 *
 * Calendar overlay is pointer-events-none. Put pointer-events-auto on your feature root.
 */
export type FeatureSlotPlacement = 'topbar' | 'calendar'

export function FeatureSlot({ placement }: { placement: FeatureSlotPlacement }) {
  return <div data-feature-slot={placement} className="contents" />
}
