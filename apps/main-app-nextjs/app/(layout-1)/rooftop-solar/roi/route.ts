import { movedTo } from '@/lib/redirects';
import { contentUrl } from '@/lib/directory/urls';

// A legacy URL that only ever redirected: the ROI page lives under
// solar-financing. Kept on contentUrl() rather than inlined to the now
// country-less '/solar-financing/roi' so the target cannot drift if the family
// ever moves again.
//
// No trailing slash: `trailingSlash` is off, so '/solar-financing/roi/' would
// cost an extra normalization hop on top of this redirect.
export function GET(request: Request) {
  return movedTo(contentUrl('/solar-financing/roi'), request);
}
