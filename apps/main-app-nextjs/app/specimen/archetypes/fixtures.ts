/**
 * Real rows from live, 2026-09-06. Nothing here is invented.
 *
 * The specimen proposes a design; the data keeps it honest. These are the actual
 * business names (up to 70 characters), the actual blank addresses, the actual
 * missing phone number, the actual photographs installers uploaded, and the
 * actual geography. A layout that only works against tidy sample data is not a
 * layout for this site.
 *
 * Phone numbers and the email local-part are masked — this repo is public and a
 * live address here would simply be scraped. Both keep their real length so the
 * layout is still tested honestly. Everything else is public directory content
 * already published on solarvipani.com.
 *
 * Aggregate measurements behind the design choices are in archetype/data.md.
 */

export type Installer = {
  name: string;
  address: string | null;
  city: string;
  phone: string | null;
  slug: string;
  services: number[];
  projects: number;
  /** Newest project photo, when the business has one. */
  thumb: string | null;
};

/** Pune district — 22 installers. The density the directory is growing into. */
export const PUNE: Installer[] = [
  {
    "name": "Bharat Solar Urja ",
    "address": null,
    "city": "Pune",
    "phone": "963706XXXX",
    "slug": "bharat-solar-urja-pune",
    "services": [
      1,
      2,
      3,
      4,
      5
    ],
    "projects": 2,
    "thumb": "projects/vdvjyeojllpi1zxq9idt"
  },
  {
    "name": "SHREESHA ENERGY SOLUTIONS",
    "address": null,
    "city": "Pune",
    "phone": null,
    "slug": "shreesha-energy-solutions-pune",
    "services": [],
    "projects": 2,
    "thumb": "projects/l1iigmytcak44wuxvnms"
  },
  {
    "name": "Calorie Systems Pvt Ltd ",
    "address": "Sonvanewasti, Talawade MIDC, Pune 411042",
    "city": "Pimpri-Chinchwad",
    "phone": "866905XXXX",
    "slug": "calorie-system-pvt-ltd-pimpri-chinchwad",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Conservit Power Solutions Pvt Ltd",
    "address": "Office no 301, H Wing, La Vida Loca, Near VIBGYOR school, Pimple Saudagar 411027",
    "city": "Pimpri-Chinchwad",
    "phone": "702002XXXX",
    "slug": "conservit-power-solutions-pvt-ltd-pimpri-chinchwad",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Dabun Solar",
    "address": "Bhamburda city Bavdhan Pune 411005",
    "city": "Pune",
    "phone": "922685XXXX",
    "slug": "dabun-solar-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "MAHESHWAR ELECTRICALS",
    "address": "Daund, Pune, Maharashtra, 413801",
    "city": "Daund",
    "phone": "739199XXXX",
    "slug": "maheshwar-electricals-daund",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Mahakalpa technology India Pvt Ltd",
    "address": "Shop no 12 sara city C4 Chakan tal khed Diat pune 410501",
    "city": "Khed",
    "phone": "762062XXXX",
    "slug": "mahakalpa-technology-india-pvt-ltd-chakan",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Om sai infotech ",
    "address": "Pune 411043",
    "city": "Pune",
    "phone": "988178XXXX",
    "slug": "om-sai-infotech-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Omni Ecoshield EPC Solutions LLP",
    "address": "A1002 Balaji Generosia Baner Pune",
    "city": "Pune",
    "phone": "927210XXXX",
    "slug": "omni-ecoshield-epc-solutions-llp-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Orbit Solar",
    "address": "A-210, Ellora Shopee Mall, Indrayaninagar, Bhosari, Pune 26.",
    "city": "Pune",
    "phone": "989042XXXX",
    "slug": "orbit-solar-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "PUNCA",
    "address": "Unit No.38,Electronic Sadan No.1, 411026",
    "city": "Pimpri-Chinchwad",
    "phone": "0976655XXXX",
    "slug": "punca-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Power Next Energies",
    "address": "353,CENTER STREET PUNE 411001",
    "city": "Pune-City",
    "phone": "992107XXXX",
    "slug": "power-next-energies-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Rudraksha Agency",
    "address": "Bori bk , Tal.:-Junnar,Dis.:-Pune",
    "city": "Junnar",
    "phone": "777583XXXX",
    "slug": "rudraksha-agency-junnar",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "S'unlimited Solar",
    "address": "501, Aariv Elegant, Lane Number 7, Laxman Nagar, Behind NIA, Baner, Pune 411045",
    "city": "Pune",
    "phone": "0917555XXXX",
    "slug": "sunlimited-solar-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "SKYRAYS SOLARS AND SERVICES ",
    "address": "At ,Shreyas Plaza, shop No.4 More(Bramhanwada) chowk,Otur.Tel-Junnar,Dist -Pune 412409",
    "city": "Junnar",
    "phone": "845959XXXX",
    "slug": "skyrays-solars-and-services-junnar",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Shunya Solar",
    "address": "A1, Vastunagar Society, Bibwewadi Kondhwa Rd, Market Yard, Pune, Maharashtra 411037",
    "city": "Pune",
    "phone": "775881XXXX",
    "slug": "shunya-solar-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Sukhai Managment Services",
    "address": "Pimpri Chinchwad",
    "city": "Pimpri-Chinchwad",
    "phone": "899974XXXX",
    "slug": "sukhai-managment-services-chinchwad",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "SunVision Solar Energy ",
    "address": "1ST FLOOR, SN-36/18 FLAT NO 05, SHIVLEELA APPT, 56 SAMBHAJI NAGAR, SK Dental & Heart Clinic, Dhankawadi, Pune, Pune, Maharashtra, 411043",
    "city": "Pune",
    "phone": "774480XXXX",
    "slug": "sunvision-solar-energy-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Sunpower Solar Solutions ",
    "address": "Shegaon Distk Buldana",
    "city": "Pune",
    "phone": "983472XXXX",
    "slug": "sunpower-solar-solutions-shegaon-branch-a0dabd",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "Suryamitra enterprises ",
    "address": "om shanti krupa building, Near, Mundhwa Bridge, Raghoba Patil Nagar, Shree Datta Colony, Sainath Nagar, Kharadi, Pune, Maharashtra 411014",
    "city": "Haveli",
    "phone": "762066XXXX",
    "slug": "suryamitra-enterprises-kharadi",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "TSM ENGINEERING AND FMS ",
    "address": "Pune",
    "city": "Pune",
    "phone": "915888XXXX",
    "slug": "tsm-engineering-and-fms-pune",
    "services": [
      1,
      2,
      3
    ],
    "projects": 0,
    "thumb": null
  },
  {
    "name": "bright Global Energy ",
    "address": "Tukai darshan, Fursungi, Pune 412308",
    "city": "Haveli",
    "phone": "901194XXXX",
    "slug": "bright-global-energy-fursungi",
    "services": [
      1,
      2,
      4
    ],
    "projects": 0,
    "thumb": null
  }
];

/** A district served by a single installer. */
export const LONE: Installer = {
  "name": "The Tiger Associates",
  "address": "Dudheri",
  "city": "Kathumar",
  "phone": "797665XXXX",
  "slug": "the-tiger-associates-kathumar",
  "services": [
    1,
    2,
    3
  ],
  "projects": 0,
  "thumb": null
};

/** Every city in Pune district, flagged by whether an installer serves it. */
export const PUNE_CITIES: { name: string; slug: string; linked: boolean }[] = [
  {
    "name": "Alandi",
    "slug": "alandi",
    "linked": false
  },
  {
    "name": "Ambegaon",
    "slug": "ambegaon",
    "linked": false
  },
  {
    "name": "Baramati",
    "slug": "baramati",
    "linked": false
  },
  {
    "name": "Bhor",
    "slug": "bhor",
    "linked": false
  },
  {
    "name": "Daund",
    "slug": "daund",
    "linked": true
  },
  {
    "name": "Fursungi Uruli Devachi",
    "slug": "fursungi-uruli-devachi",
    "linked": false
  },
  {
    "name": "Haveli",
    "slug": "haveli",
    "linked": true
  },
  {
    "name": "Indapur",
    "slug": "indapur",
    "linked": false
  },
  {
    "name": "Jejuri",
    "slug": "jejuri",
    "linked": false
  },
  {
    "name": "Junnar",
    "slug": "junnar",
    "linked": true
  },
  {
    "name": "Khed",
    "slug": "khed",
    "linked": true
  },
  {
    "name": "Lonavala",
    "slug": "lonavala",
    "linked": false
  },
  {
    "name": "Mawal",
    "slug": "mawal",
    "linked": false
  },
  {
    "name": "Mulshi",
    "slug": "mulshi",
    "linked": false
  },
  {
    "name": "Pimpri-Chinchwad",
    "slug": "pimpri-chinchwad",
    "linked": true
  },
  {
    "name": "Pune",
    "slug": "pune",
    "linked": true
  },
  {
    "name": "Pune-City",
    "slug": "pune-city",
    "linked": true
  },
  {
    "name": "Purandhar",
    "slug": "purandhar",
    "linked": false
  },
  {
    "name": "Rajgurunagar",
    "slug": "rajgurunagar",
    "linked": false
  },
  {
    "name": "Sasvad",
    "slug": "sasvad",
    "linked": false
  },
  {
    "name": "Shirur",
    "slug": "shirur",
    "linked": false
  },
  {
    "name": "Talegaon Dabhade",
    "slug": "talegaon-dabhade",
    "linked": false
  },
  {
    "name": "Velhe",
    "slug": "velhe",
    "linked": false
  },
  {
    "name": "Wadgaon",
    "slug": "wadgaon",
    "linked": false
  }
];

/** The states with installers, with real coverage ratios. */
export const STATES: { name: string; slug: string; districts: number; covered: number; installers: number }[] = [
  {
    "name": "Andhra Pradesh",
    "slug": "andhra-pradesh",
    "districts": 26,
    "covered": 5,
    "installers": 5
  },
  {
    "name": "Assam",
    "slug": "assam",
    "districts": 35,
    "covered": 14,
    "installers": 24
  },
  {
    "name": "Bihar",
    "slug": "bihar",
    "districts": 38,
    "covered": 4,
    "installers": 8
  },
  {
    "name": "Chhattisgarh",
    "slug": "chhattisgarh",
    "districts": 33,
    "covered": 2,
    "installers": 3
  },
  {
    "name": "Dadra and Nagar Haveli and Daman and Diu",
    "slug": "dadra-and-nagar-haveli-and-daman-and-diu",
    "districts": 3,
    "covered": 1,
    "installers": 1
  },
  {
    "name": "Delhi",
    "slug": "delhi",
    "districts": 11,
    "covered": 6,
    "installers": 11
  },
  {
    "name": "Goa",
    "slug": "goa",
    "districts": 2,
    "covered": 1,
    "installers": 1
  },
  {
    "name": "Gujarat",
    "slug": "gujarat",
    "districts": 33,
    "covered": 17,
    "installers": 53
  },
  {
    "name": "Haryana",
    "slug": "haryana",
    "districts": 22,
    "covered": 6,
    "installers": 12
  },
  {
    "name": "Jharkhand",
    "slug": "jharkhand",
    "districts": 24,
    "covered": 3,
    "installers": 3
  },
  {
    "name": "Karnataka",
    "slug": "karnataka",
    "districts": 31,
    "covered": 11,
    "installers": 30
  },
  {
    "name": "Kerala",
    "slug": "kerala",
    "districts": 14,
    "covered": 14,
    "installers": 106
  },
  {
    "name": "Madhya Pradesh",
    "slug": "madhya-pradesh",
    "districts": 55,
    "covered": 15,
    "installers": 28
  },
  {
    "name": "Maharashtra",
    "slug": "maharashtra",
    "districts": 36,
    "covered": 33,
    "installers": 164
  },
  {
    "name": "Odisha",
    "slug": "odisha",
    "districts": 30,
    "covered": 5,
    "installers": 7
  },
  {
    "name": "Punjab",
    "slug": "punjab",
    "districts": 23,
    "covered": 2,
    "installers": 2
  },
  {
    "name": "Rajasthan",
    "slug": "rajasthan",
    "districts": 50,
    "covered": 14,
    "installers": 33
  },
  {
    "name": "Tamil Nadu",
    "slug": "tamil-nadu",
    "districts": 38,
    "covered": 19,
    "installers": 41
  },
  {
    "name": "Telangana",
    "slug": "telangana",
    "districts": 33,
    "covered": 2,
    "installers": 6
  },
  {
    "name": "Uttar Pradesh",
    "slug": "uttar-pradesh",
    "districts": 75,
    "covered": 37,
    "installers": 96
  },
  {
    "name": "Uttarakhand",
    "slug": "uttarakhand",
    "districts": 13,
    "covered": 2,
    "installers": 2
  },
  {
    "name": "West Bengal",
    "slug": "west-bengal",
    "districts": 22,
    "covered": 7,
    "installers": 7
  }
];

/** Where the directory is deepest. */
export const TOP_DISTRICTS: { name: string; state: string; installers: number }[] = [
  {
    "name": "Ernakulam",
    "state": "Kerala",
    "installers": 22
  },
  {
    "name": "Pune",
    "state": "Maharashtra",
    "installers": 22
  },
  {
    "name": "Lucknow",
    "state": "Uttar Pradesh",
    "installers": 17
  },
  {
    "name": "Jaipur",
    "state": "Rajasthan",
    "installers": 16
  },
  {
    "name": "Bengaluru Urban",
    "state": "Karnataka",
    "installers": 14
  },
  {
    "name": "Ahmedabad",
    "state": "Gujarat",
    "installers": 13
  },
  {
    "name": "Thrissur",
    "state": "Kerala",
    "installers": 12
  },
  {
    "name": "Thiruvananthapuram",
    "state": "Kerala",
    "installers": 11
  }
];

export type Profile = {
  name: string;
  address: string | null;
  city: string;
  district: string;
  state: string;
  email: string | null;
  website: string | null;
  maps: string | null;
  phone: string | null;
  description: string | null;
  services: number[];
  brands: number[];
  slug: string;
};

/**
 * One installer profile.
 *
 * Chosen for what it can show: a phone number, six photographed installations,
 * every service and every panel brand filled in. Its description is the
 * two-word placeholder 94.6% of profiles carry, so the design simply omits
 * that paragraph rather than printing "Solar panel installer" under a heading —
 * which is what the other 608 pages will do too.
 */
export const PROFILE: Profile = {
  "name": "Adree Energy Systems Private Limited ",
  "address": "H.No-68, Ground Floor, GMCH Road, Christian Basti, Guwahati-781005",
  "city": "Guwahati",
  "district": "Kamrup Metro",
  "state": "Assam",
  "email": "adreeenXXXX@gmail.com",
  "website": "https://adreeenergy.in/",
  "maps": "https://maps.app.goo.gl/xQrCoUedV7BTnp9d6",
  "phone": "789600XXXX",
  "description": "Solar panel installer",
  "services": [
    1,
    2,
    3,
    4,
    5,
    6
  ],
  "brands": [
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ],
  "slug": "adree-energy-systems-private-limited-guwahati"
};

export const PROFILE_PROJECTS: { title: string; pincode: string | null; date: string; cid: string; w: number; h: number }[] = [
  {
    "title": "5kW Agricultural Solar Installation at [Sivasagar]",
    "pincode": "785640",
    "date": "2026-07-03",
    "cid": "projects/b83bamc8fcf2ducxvkhw",
    "w": 1200,
    "h": 900
  },
  {
    "title": "5kW Agricultural Solar Installation at [Jorhat]",
    "pincode": "785683",
    "date": "2026-07-03",
    "cid": "projects/zjtmbvymsquguqtfga9g",
    "w": 1200,
    "h": 900
  },
  {
    "title": "5kW Residential Solar Installation with ₹78,000 subsidy under PM Surya Ghar Yojana at [Guwahati]",
    "pincode": "781001",
    "date": "2026-06-10",
    "cid": "projects/josjcsuuagilkcicgjql",
    "w": 1200,
    "h": 900
  },
  {
    "title": "5kW Agricultural Solar Installation at [Guwahati]",
    "pincode": "781037",
    "date": "2026-04-08",
    "cid": "projects/owf3tjcoapvrbrbb0veu",
    "w": 1200,
    "h": 900
  },
  {
    "title": "3kW Residential Solar Installation with ₹85,800 subsidy under PM Surya Ghar Yojana at [Bokakhat]",
    "pincode": "785612",
    "date": "2026-03-30",
    "cid": "projects/hyk9itqzog5ol2bl9mog",
    "w": 1200,
    "h": 900
  },
  {
    "title": "6kW Residential Solar Installation with ₹85,500 subsidy under PM Surya Ghar Yojana at [Guwahati]",
    "pincode": "781005",
    "date": "2026-02-02",
    "cid": "projects/qnbvowcnlknsfo8ahbxf",
    "w": 948,
    "h": 1288
  }
];

/** The cities this installer's district covers. */
export const PROFILE_AREAS: string[] = [
  "Azara",
  "Chandrapur",
  "Dispur",
  "Guwahati",
  "Kamrup Metro",
  "Sonapur"
];

/** The description 608 of 643 profiles carry verbatim. */
export const BOILERPLATE_DESCRIPTION = 'Solar panel installer';

export const SERVICE_NAMES: Record<number, string> = {
  1: 'Panel installation',
  2: 'Net metering',
  3: 'Subsidy paperwork',
  4: 'Financing',
  5: 'Panel cleaning',
  6: 'Agricultural solar'
};

export const BRAND_NAMES: Record<number, string> = {
  1: 'Waaree Energies',
  2: 'Adani Solar',
  3: 'Tata Power Solar',
  4: 'Vikram Solar',
  5: 'Goldi Solar',
  6: 'RenewSys',
  7: 'Loom Solar'
};

/**
 * The cloud name is public — it is in every image URL the live site serves. The
 * real app reads PUBLIC_CLOUDINARY_CLOUD_NAME; the specimen is dev-only and
 * self-contained, so it is inlined rather than adding an env var to this app.
 *
 * Crop gravity is `g_auto`, and it is not a detail. These are rooftop photographs:
 * crop from the top and a square thumbnail is pure sky, crop from the centre and
 * you cut through the watermarks and phone numbers installers bake along the
 * bottom edge. `g_auto` picks the subject instead, which on this library means
 * the array itself. Verified by rendering — `g_north` produced blank white tiles.
 */
export const thumbUrl = (id: string, w: number, h: number) =>
  `https://res.cloudinary.com/djiuiq129/image/upload/c_fill,g_auto,w_${w},h_${h},q_auto,f_auto/${id}`;

export const photoUrl = (id: string, w: number) =>
  `https://res.cloudinary.com/djiuiq129/image/upload/c_limit,w_${w},q_auto,f_auto/${id}`;

/** Initials, for the rows where no photograph exists yet. */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
