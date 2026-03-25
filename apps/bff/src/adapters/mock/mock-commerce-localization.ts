import type {
  Breadcrumb,
  Collection,
  LanguageCode,
  LocaleContext,
  Menu,
  Page,
  Product,
} from "@commerce/shared-types";
import type { CmsRawPage } from "../../ports/cms.port";
import {
  collections,
  defaultLocaleContext,
  normalizeLanguage,
  products,
} from "./mock-data";

type ProductCopy = {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type CollectionCopy = {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type PageCopy = {
  title?: string;
  body?: string;
  bodySummary?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type CmsBlockCopy = {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  html?: string;
  imageAltText?: string;
};

export type LocalizationTelemetry = {
  language: LanguageCode;
  fallbackCount: number;
  totalFields: number;
};

export type LocalizedResult<T> = {
  value: T;
  telemetry: LocalizationTelemetry;
};

const PRODUCT_COPY: Record<LanguageCode, Record<string, ProductCopy>> = {
  en: {},
  es: {
    "ceramic-brake-pads": {
      title: "Pastillas de freno ceramicas",
      description:
        "Pastillas de freno ceramicas de alto rendimiento con menos polvo y ruido. Compatibles con la mayoria de sedanes y SUV.",
    },
    "drilled-rotors": {
      title: "Discos perforados y ranurados",
      description:
        "Discos de freno perforados y ranurados para mejor disipacion de calor y frenado mas potente.",
    },
    "performance-air-filter": {
      title: "Filtro de aire de alto rendimiento",
      description:
        "Filtro de aire lavable y reutilizable de alto flujo. Mejora la respuesta del acelerador.",
    },
    "iridium-spark-plugs": {
      title: "Bujias de iridio (juego de 4)",
      description:
        "Bujias con punta de iridio de larga duracion para un encendido fiable y mejor eficiencia.",
    },
    "coilover-kit": {
      title: "Kit coilover ajustable",
      description:
        "Kit de suspension coilover con altura ajustable y 32 niveles de amortiguacion para calle o pista.",
    },
    "sway-bar-end-links": {
      title: "Bieletas de barra estabilizadora",
      description:
        "Bieletas reforzadas con casquillos de poliuretano para una conduccion mas firme en curvas.",
    },
    "led-headlight-bulbs": {
      title: "Bombillas LED para faros (par)",
      description:
        "Bombillas LED blanco 6000K. Reemplazo plug-and-play con ventilacion integrada.",
    },
    "smoked-tail-lights": {
      title: "Cubiertas ahumadas para luces traseras",
      description:
        "Cubiertas ahumadas resistentes a rayos UV para un estilo mas deportivo.",
    },
    "cat-back-exhaust": {
      title: "Sistema de escape cat-back",
      description:
        "Escape cat-back en acero inoxidable con doble salida pulida. Mas potencia y sonido deportivo.",
    },
    "exhaust-tip-clamp-on": {
      title: "Punta de escape con abrazadera",
      description:
        'Punta universal de acero inoxidable con abrazadera. Compatible con tubos de 2.5" a 3".',
    },
    "short-ram-intake": {
      title: "Kit de admision short ram",
      description:
        "Admision short ram de aluminio pulido con filtro conico de alto flujo y montaje sencillo.",
    },
    "wheel-spacers": {
      title: "Separadores de rueda (par)",
      description:
        "Separadores hubcentric de aluminio billet T6 para una postura mas agresiva.",
    },
    "winter-tire-set": {
      title: "Set de neumaticos de invierno (4 unidades)",
      description:
        "Neumaticos de invierno sin clavos con tecnologia avanzada de agarre en nieve. Clasificacion severa para condiciones extremas.",
    },
    "tire-chains": {
      title: "Cadenas de nieve reforzadas",
      description:
        "Cadenas de nieve faciles de instalar para condiciones invernales extremas. Compatible con la mayoria de vehiculos.",
    },
    "windshield-ice-scraper": {
      title: "Rascador de hielo para parabrisas",
      description:
        "Rascador de hielo resistente con mango de espuma y cepillo de nieve integrado. Rompe el hielo y la escarcha gruesa.",
    },
    "winter-wiper-blades": {
      title: "Escobillas limpiaparabrisas de invierno (par)",
      description:
        "Escobillas tipo beam con cubierta de goma para evitar acumulacion de hielo. Rendimiento en todas las condiciones.",
    },
    "roof-cargo-box": {
      title: "Caja de techo para carga",
      description:
        "Portaequipajes aerodinamico de techo con capacidad de 16 pies cubicos. Resistente al agua y con cerradura para almacenamiento seguro en viajes por carretera.",
    },
    "portable-power-station": {
      title: "Estacion de energia portatil",
      description:
        "Estacion de energia portatil multifuncion con capacidad de 300Wh. Incluye tomas de CA, puertos USB, capacidad de arranque y entrada de carga solar para aventuras fuera de la red.",
    },
    "car-detailing-kit": {
      title: "Kit de detallado premium para automovil",
      description:
        "Kit completo de detallado con jabon de lavado, cera, toallas de microfibra, abrillantador de neumaticos y limpiador de interiores. Todo para un acabado de salon.",
    },
  },
  nl: {
    "ceramic-brake-pads": {
      title: "Keramische remblokken",
      description:
        "Hoogwaardige keramische remblokken met minder stof en geluid. Geschikt voor de meeste sedans en SUV's.",
    },
    "drilled-rotors": {
      title: "Geperforeerde en gegroefde remschijven",
      description:
        "Geperforeerde en gegroefde remschijven voor betere warmteafvoer en remprestaties.",
    },
    "performance-air-filter": {
      title: "Performance luchtfilter",
      description:
        "Wasbaar en herbruikbaar high-flow luchtfilter voor betere gasrespons.",
    },
    "iridium-spark-plugs": {
      title: "Iridium bougies (set van 4)",
      description:
        "Langdurige iridium bougies voor betrouwbare ontsteking en betere efficientie.",
    },
    "coilover-kit": {
      title: "Verstelbare coilover kit",
      description:
        "Volledig in hoogte verstelbare coilover set met 32 dempingsstanden voor straat of circuit.",
    },
    "sway-bar-end-links": {
      title: "Stabilisatorstang koppelstangen",
      description:
        "Heavy-duty koppelstangen met polyurethaan bussen voor strakker bochtengedrag.",
    },
    "led-headlight-bulbs": {
      title: "LED koplamp lampen (paar)",
      description:
        "6000K helder witte LED lampen. Plug-and-play vervanging met ingebouwde koeling.",
    },
    "smoked-tail-lights": {
      title: "Getinte achterlichtcovers",
      description:
        "UV-bestendige getinte achterlichtcovers voor een sportieve uitstraling.",
    },
    "cat-back-exhaust": {
      title: "Cat-back uitlaatsysteem",
      description:
        "RVS cat-back uitlaat met dubbele gepolijste eindstukken voor meer vermogen en geluid.",
    },
    "exhaust-tip-clamp-on": {
      title: "Klem-uitlaattip",
      description:
        'Universele roestvrijstalen uitlaattip met klem. Past op 2.5" tot 3" pijpen.',
    },
    "short-ram-intake": {
      title: "Short ram inlaatkit",
      description:
        "Gepolijste aluminium short ram inlaat met high-flow filter en eenvoudige montage.",
    },
    "wheel-spacers": {
      title: "Wielspacers (paar)",
      description:
        "Naafgecentreerde wielspacers van T6 billet aluminium voor een agressievere stance.",
    },
    "winter-tire-set": {
      title: "Premium winterbanden set (4 stuks)",
      description:
        "Spijkerloze winterbanden met geavanceerde sneeuwgrip technologie. Severe snow rated voor extreme omstandigheden.",
    },
    "tire-chains": {
      title: "Heavy-duty sneeuwkettingen",
      description:
        "Eenvoudig te installeren sneeuwkettingen voor extreme wintercondities. Geschikt voor de meeste personenauto's en lichte vrachtwagens.",
    },
    "windshield-ice-scraper": {
      title: "IJskrabber voor voorruit",
      description:
        "Heavy-duty ijskrabber met schuimgrip handvat en ingebouwde sneeuwborstel. Breekt door dik ijs en vorst.",
    },
    "winter-wiper-blades": {
      title: "Winter ruitenwissers set (paar)",
      description:
        "Beam-style winterruitenwissers met rubberen hoes om ijsophoping te voorkomen. All-weather prestaties.",
    },
    "roof-cargo-box": {
      title: "Dakkoffer",
      description:
        "Aerodynamische dakdrager met 16 kubieke voet capaciteit. Waterdicht en afsluitbaar voor veilige opslag tijdens reizen.",
    },
    "portable-power-station": {
      title: "Draagbaar energiestation",
      description:
        "Multifunctioneel draagbaar energiestation met 300Wh capaciteit. Met AC stopcontacten, USB-poorten, startcapaciteit en solar oplaad-ingang voor off-grid avonturen.",
    },
    "car-detailing-kit": {
      title: "Premium auto detailing kit",
      description:
        "Compleet detailing kit met waszeep, was, microfiber doeken, bandenglans en interieur reiniger. Alles voor een showroom afwerking.",
    },
  },
  fr: {
    "ceramic-brake-pads": {
      title: "Plaquettes de frein ceramique",
      description:
        "Plaquettes de frein ceramique haute performance avec moins de poussiere et de bruit.",
    },
    "drilled-rotors": {
      title: "Disques perfores et rainures",
      description:
        "Disques de frein perfores et rainures pour une meilleure dissipation thermique.",
    },
    "performance-air-filter": {
      title: "Filtre a air performance",
      description:
        "Filtre a air haut debit lavable et reutilisable pour une meilleure reponse.",
    },
    "iridium-spark-plugs": {
      title: "Bougies iridium (lot de 4)",
      description:
        "Bougies a pointe iridium longue duree pour un allumage fiable.",
    },
    "coilover-kit": {
      title: "Kit combines filetes reglable",
      description:
        "Kit suspension combine filete reglable en hauteur avec 32 niveaux d'amortissement.",
    },
    "sway-bar-end-links": {
      title: "Biellettes de barre stabilisatrice",
      description:
        "Biellettes renforcees avec silentblocs polyurethane pour un meilleur comportement.",
    },
    "led-headlight-bulbs": {
      title: "Ampoules LED de phare (paire)",
      description:
        "Ampoules LED blanc 6000K. Remplacement plug-and-play avec refroidissement integre.",
    },
    "smoked-tail-lights": {
      title: "Caches de feux arriere fumes",
      description:
        "Caches de feux arriere fumes resistants aux UV pour un look personnalise.",
    },
    "cat-back-exhaust": {
      title: "Echappement cat-back",
      description:
        "Ligne cat-back inox avec doubles sorties polies. Plus de puissance et un son sportif.",
    },
    "exhaust-tip-clamp-on": {
      title: "Embout d'echappement a collier",
      description:
        'Embout universel inox a collier. Compatible avec tubes de 2.5" a 3".',
    },
    "short-ram-intake": {
      title: "Kit admission short ram",
      description:
        "Admission short ram en aluminium poli avec filtre conique haut debit.",
    },
    "wheel-spacers": {
      title: "Elargisseurs de voie (paire)",
      description:
        "Elargisseurs de voie hubcentriques en aluminium T6 pour une stance plus agressive.",
    },
    "winter-tire-set": {
      title: "Ensemble de pneus hiver premium (lot de 4)",
      description:
        "Pneus hiver sans clous avec technologie avancee d'adherence sur neige. Homologues severe snow pour conditions extremes.",
    },
    "tire-chains": {
      title: "Chaines neige renforcees",
      description:
        "Chaines neige faciles a installer pour conditions hivernales extremes. Compatible avec la plupart des vehicules.",
    },
    "windshield-ice-scraper": {
      title: "Raclette a glace pour pare-brise",
      description:
        "Raclette a glace robuste avec poignee en mousse et brosse a neige integree. Brise la glace et le givre epais.",
    },
    "winter-wiper-blades": {
      title: "Balais d'essuie-glace hiver (paire)",
      description:
        "Balais type beam avec protection caoutchouc contre l'accumulation de glace. Performance tout temps.",
    },
    "roof-cargo-box": {
      title: "Coffre de toit",
      description:
        "Coffre de toit aerodynamique avec capacite de 16 pieds cubes. Etanche et verrouillable pour stockage securise lors de voyages.",
    },
    "portable-power-station": {
      title: "Station d'energie portable",
      description:
        "Station d'energie portable multifonction avec capacite de 300Wh. Comprend prises CA, ports USB, capacite de demarrage et entree de charge solaire pour aventures hors reseau.",
    },
    "car-detailing-kit": {
      title: "Kit de detailing automobile premium",
      description:
        "Kit de detailing complet avec savon de lavage, cire, serviettes en microfibre, brillant pour pneus et nettoyant interieur. Tout pour une finition salle d'exposition.",
    },
  },
};

const COLLECTION_COPY: Record<LanguageCode, Record<string, CollectionCopy>> = {
  en: {},
  es: {
    brakes: {
      title: "Frenos",
      description: "Pastillas, discos y pinzas de freno",
    },
    pads: {
      title: "Pastillas de freno",
      description: "Pastillas de freno ceramicas y semimetalicas",
    },
    rotors: {
      title: "Discos de freno",
      description: "Discos perforados, ranurados y OEM",
    },
    engine: {
      title: "Motor",
      description: "Filtros de aire, bujias y sistemas de admision",
    },
    filters: {
      title: "Filtros de aire",
      description: "Filtros de aire de rendimiento y reemplazo OEM",
    },
    ignition: {
      title: "Encendido",
      description: "Bujias, bobinas y componentes de encendido",
    },
    suspension: {
      title: "Suspension",
      description: "Coilovers, barras estabilizadoras y bujes",
    },
    lighting: {
      title: "Iluminacion",
      description: "Faros, luces traseras y mejoras LED",
    },
    exhaust: {
      title: "Escape",
      description: "Sistemas cat-back, silenciadores y puntas",
    },
    Oil: {
      title: "Aceite",
      description: "Aceites y fluidos para mantenimiento",
    },
    winter: {
      title: "Esenciales de invierno",
      description:
        "Neumaticos, cadenas, fluidos y accesorios de invierno para conduccion segura",
    },
    tires: {
      title: "Neumaticos de invierno",
      description: "Neumaticos de invierno sin clavos y accesorios",
    },
    accessories: {
      title: "Accesorios de invierno",
      description: "Cadenas de nieve, escobillas de invierno y mas",
    },
    fluids: {
      title: "Fluidos de invierno",
      description:
        "Liquido limpiaparabrisas descongelante y fluidos de mantenimiento",
    },
    summer: {
      title: "Esenciales de verano",
      description:
        "Equipamiento para viajes, equipo de emergencia y productos de cuidado del automovil para aventuras de verano",
    },
    travel: {
      title: "Esenciales para viajes por carretera",
      description: "Cajas de techo, portaequipajes y accesorios de viaje",
    },
    emergency: {
      title: "Equipo de emergencia",
      description: "Arrancadores, kits de emergencia y equipo de seguridad",
    },
    detailing: {
      title: "Detallado de automoviles",
      description: "Lavado, encerado, pulido y productos de detallado interior",
    },
  },
  nl: {
    brakes: {
      title: "Remmen",
      description: "Remblokken, remschijven en remklauwen",
    },
    pads: {
      title: "Remblokken",
      description: "Keramische en semi-metalen remblokken",
    },
    rotors: {
      title: "Remschijven",
      description: "Geperforeerde, gegroefde en OEM remschijven",
    },
    engine: {
      title: "Motor",
      description: "Luchtfilters, bougies en inlaatsystemen",
    },
    filters: {
      title: "Luchtfilters",
      description: "Performance en OEM vervangende luchtfilters",
    },
    ignition: {
      title: "Ontsteking",
      description: "Bougies, bobines en ontstekingscomponenten",
    },
    suspension: {
      title: "Vering",
      description: "Coilovers, stabilisatoren en rubbers",
    },
    lighting: {
      title: "Verlichting",
      description: "Koplampen, achterlichten en LED upgrades",
    },
    exhaust: {
      title: "Uitlaat",
      description: "Cat-back systemen, dempers en uitlaattips",
    },
    Oil: {
      title: "Olie",
      description: "Motorolie en onderhoudsvloeistoffen",
    },
    winter: {
      title: "Winter essentials",
      description:
        "Winterbanden, kettingen, vloeistoffen en accessoires voor veilig winterrijden",
    },
    tires: {
      title: "Winterbanden",
      description: "Spijkerloze winterbanden en bandaccessoires",
    },
    accessories: {
      title: "Winter accessoires",
      description: "Sneeuwkettingen, winterruitenwissers en meer",
    },
    fluids: {
      title: "Winter vloeistoffen",
      description:
        "Ontdooiende ruitensproeiervloeistof en onderhoudsvloeistoffen",
    },
    summer: {
      title: "Zomer essentials",
      description:
        "Reisuitrusting, noodapparatuur en autoonderhoud producten voor zomeravonturen",
    },
    travel: {
      title: "Roadtrip essentials",
      description: "Dakkoffers, bagagedragers en reisaccessoires",
    },
    emergency: {
      title: "Noodapparatuur",
      description: "Startboosters, noodkits en veiligheidsuitrusting",
    },
    detailing: {
      title: "Auto detailing",
      description: "Wassen, waxen, polijsten en interieur detailing producten",
    },
  },
  fr: {
    brakes: {
      title: "Freins",
      description: "Plaquettes, disques et etriers de frein",
    },
    pads: {
      title: "Plaquettes de frein",
      description: "Plaquettes ceramiques et semi-metalliques",
    },
    rotors: {
      title: "Disques de frein",
      description: "Disques perfores, rainures et OEM",
    },
    engine: {
      title: "Moteur",
      description: "Filtres a air, bougies et admissions",
    },
    filters: {
      title: "Filtres a air",
      description: "Filtres a air performance et remplacement OEM",
    },
    ignition: {
      title: "Allumage",
      description: "Bougies, bobines et composants d'allumage",
    },
    suspension: {
      title: "Suspension",
      description: "Combines filetes, barres stabilisatrices et silentblocs",
    },
    lighting: {
      title: "Eclairage",
      description: "Phares, feux arriere et upgrades LED",
    },
    exhaust: {
      title: "Echappement",
      description: "Lignes cat-back, silencieux et embouts",
    },
    Oil: {
      title: "Huile",
      description: "Huiles moteur et fluides d'entretien",
    },
    winter: {
      title: "Essentiels hiver",
      description:
        "Pneus, chaines, fluides et accessoires hiver pour une conduite securisee",
    },
    tires: {
      title: "Pneus hiver",
      description: "Pneus hiver sans clous et accessoires",
    },
    accessories: {
      title: "Accessoires hiver",
      description: "Chaines neige, balais hiver et plus",
    },
    fluids: {
      title: "Fluides hiver",
      description: "Liquide lave-glace degivrant et fluides d'entretien",
    },
    summer: {
      title: "Essentiels ete",
      description:
        "Equipement de voyage, materiel d'urgence et produits d'entretien automobile pour les aventures estivales",
    },
    travel: {
      title: "Essentiels road trip",
      description: "Coffres de toit, porte-bagages et accessoires de voyage",
    },
    emergency: {
      title: "Equipement d'urgence",
      description: "Demarreurs, kits d'urgence et equipement de securite",
    },
    detailing: {
      title: "Detailing automobile",
      description:
        "Lavage, cirage, polissage et produits de detailing interieur",
    },
  },
};

const MENU_TITLE_COPY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    All: "Todo",
    Brakes: "Frenos",
    Engine: "Motor",
    Suspension: "Suspension",
    Lighting: "Iluminacion",
    Exhaust: "Escape",
    oil: "Aceite",
    Home: "Inicio",
    About: "Acerca de",
    "Terms & Conditions": "Terminos y condiciones",
    "Privacy Policy": "Politica de privacidad",
    FAQ: "Preguntas frecuentes",
    "All Parts": "Todas las piezas",
    Winter: "Invierno",
    Summer: "Verano",
  },
  nl: {
    All: "Alles",
    Brakes: "Remmen",
    Engine: "Motor",
    Suspension: "Vering",
    Lighting: "Verlichting",
    Exhaust: "Uitlaat",
    oil: "Olie",
    Home: "Home",
    About: "Over ons",
    "Terms & Conditions": "Voorwaarden",
    "Privacy Policy": "Privacybeleid",
    FAQ: "Veelgestelde vragen",
    "All Parts": "Alle onderdelen",
    Winter: "Winter",
    Summer: "Zomer",
  },
  fr: {
    All: "Tout",
    Brakes: "Freins",
    Engine: "Moteur",
    Suspension: "Suspension",
    Lighting: "Eclairage",
    Exhaust: "Echappement",
    oil: "Huile",
    Home: "Accueil",
    About: "A propos",
    "Terms & Conditions": "Conditions generales",
    "Privacy Policy": "Politique de confidentialite",
    FAQ: "FAQ",
    "All Parts": "Toutes les pieces",
    Winter: "Hiver",
    Summer: "Ete",
  },
};

const PAGE_COPY: Record<LanguageCode, Record<string, PageCopy>> = {
  en: {},
  es: {
    about: {
      title: "Acerca de",
      body: "<p>Somos una empresa moderna de recambios comprometida con productos de calidad y una gran experiencia de compra.</p>",
      bodySummary: "Somos una empresa moderna de recambios.",
      seoTitle: "Acerca de nosotros",
      seoDescription: "Conoce nuestra empresa y mision.",
    },
    "terms-and-conditions": {
      title: "Terminos y condiciones",
      body: "<p>Estos son los terminos y condiciones para usar nuestra tienda.</p>",
      bodySummary: "Terminos y condiciones.",
      seoTitle: "Terminos y condiciones",
      seoDescription: "Lee nuestros terminos y condiciones.",
    },
    "privacy-policy": {
      title: "Politica de privacidad",
      body: "<p>Tu privacidad es importante para nosotros.</p>",
      bodySummary: "Nuestra politica de privacidad.",
      seoTitle: "Politica de privacidad",
      seoDescription: "Lee nuestra politica de privacidad.",
    },
    faq: {
      title: "Preguntas frecuentes",
      body: "<h2>FAQ</h2><h3>Cuanto tarda el envio?</h3><p>De 5 a 7 dias habiles.</p>",
      bodySummary: "Preguntas frecuentes.",
      seoTitle: "Preguntas frecuentes",
      seoDescription: "Preguntas frecuentes.",
    },
  },
  nl: {
    about: {
      title: "Over ons",
      body: "<p>Wij zijn een moderne auto-onderdelenwinkel met focus op kwaliteit en een sterke klantbeleving.</p>",
      bodySummary: "Wij zijn een moderne auto-onderdelenwinkel.",
      seoTitle: "Over ons",
      seoDescription: "Lees meer over ons bedrijf en onze missie.",
    },
    "terms-and-conditions": {
      title: "Voorwaarden",
      body: "<p>Dit zijn de algemene voorwaarden voor het gebruik van onze winkel.</p>",
      bodySummary: "Algemene voorwaarden.",
      seoTitle: "Voorwaarden",
      seoDescription: "Lees onze algemene voorwaarden.",
    },
    "privacy-policy": {
      title: "Privacybeleid",
      body: "<p>Jouw privacy is belangrijk voor ons.</p>",
      bodySummary: "Ons privacybeleid.",
      seoTitle: "Privacybeleid",
      seoDescription: "Lees ons privacybeleid.",
    },
    faq: {
      title: "Veelgestelde vragen",
      body: "<h2>FAQ</h2><h3>Hoe lang duurt verzending?</h3><p>5-7 werkdagen.</p>",
      bodySummary: "Veelgestelde vragen.",
      seoTitle: "Veelgestelde vragen",
      seoDescription: "Veelgestelde vragen.",
    },
  },
  fr: {
    about: {
      title: "A propos",
      body: "<p>Nous sommes une entreprise moderne de pieces auto engagee pour la qualite et l'experience client.</p>",
      bodySummary: "Nous sommes une entreprise moderne de pieces auto.",
      seoTitle: "A propos de nous",
      seoDescription: "Decouvrez notre entreprise et notre mission.",
    },
    "terms-and-conditions": {
      title: "Conditions generales",
      body: "<p>Voici les conditions generales d'utilisation de notre boutique.</p>",
      bodySummary: "Conditions generales.",
      seoTitle: "Conditions generales",
      seoDescription: "Consultez nos conditions generales.",
    },
    "privacy-policy": {
      title: "Politique de confidentialite",
      body: "<p>Votre vie privee est importante pour nous.</p>",
      bodySummary: "Notre politique de confidentialite.",
      seoTitle: "Politique de confidentialite",
      seoDescription: "Consultez notre politique de confidentialite.",
    },
    faq: {
      title: "FAQ",
      body: "<h2>FAQ</h2><h3>Quel est le delai de livraison?</h3><p>5 a 7 jours ouvres.</p>",
      bodySummary: "Questions frequentes.",
      seoTitle: "FAQ",
      seoDescription: "Questions frequentes.",
    },
  },
};

const CMS_BLOCK_COPY: Record<
  LanguageCode,
  Record<string, Record<string, CmsBlockCopy>>
> = {
  en: {},
  es: {
    home: {
      "block-1": {
        heading: "Oferta de verano",
        subheading: "Hasta 40% de descuento en piezas de rendimiento",
        ctaLabel: "Comprar ahora",
        imageAltText: "Banner oferta de verano",
      },
      "block-2": {
        heading: "Productos destacados",
      },
      "block-3": {
        heading: "Novedades",
      },
    },
  },
  nl: {
    home: {
      "block-1": {
        heading: "Zomeractie",
        subheading: "Tot 40% korting op performance onderdelen",
        ctaLabel: "Nu shoppen",
        imageAltText: "Zomeractie banner",
      },
      "block-2": {
        heading: "Topkeuzes",
      },
      "block-3": {
        heading: "Nieuw binnen",
      },
    },
  },
  fr: {
    home: {
      "block-1": {
        heading: "Soldes d'ete",
        subheading: "Jusqu'a 40% de reduction sur les pieces performance",
        ctaLabel: "Acheter",
        imageAltText: "Banniere soldes d'ete",
      },
      "block-2": {
        heading: "Top produits",
      },
      "block-3": {
        heading: "Nouveautes",
      },
    },
  },
};

const OPTION_NAME_COPY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    Axle: "Eje",
    Size: "Tamano",
    Fitment: "Compatibilidad",
    "Heat Range": "Rango termico",
    Position: "Posicion",
    "Bulb Size": "Tamano de bombilla",
    "Tip Style": "Estilo de punta",
    Finish: "Acabado",
    "Pipe Diameter": "Diametro del tubo",
    Thickness: "Grosor",
    "Vehicle Type": "Tipo de vehiculo",
    "Temperature Rating": "Clasificacion de temperatura",
    Length: "Longitud",
    Type: "Tipo",
    Capacity: "Capacidad",
    "Peak Amps": "Amperaje maximo",
    "Kit Type": "Tipo de kit",
  },
  nl: {
    Axle: "As",
    Size: "Maat",
    Fitment: "Pasvorm",
    "Heat Range": "Warmtegraad",
    Position: "Positie",
    "Bulb Size": "Lampmaat",
    "Tip Style": "Tipstijl",
    Finish: "Afwerking",
    "Pipe Diameter": "Pijpdiameter",
    Thickness: "Dikte",
    "Vehicle Type": "Voertuigtype",
    "Temperature Rating": "Temperatuurclassificatie",
    Length: "Lengte",
    Type: "Type",
    Capacity: "Capaciteit",
    "Peak Amps": "Piek amperage",
    "Kit Type": "Kit type",
  },
  fr: {
    Axle: "Essieu",
    Size: "Taille",
    Fitment: "Compatibilite",
    "Heat Range": "Indice thermique",
    Position: "Position",
    "Bulb Size": "Taille d'ampoule",
    "Tip Style": "Style d'embout",
    Finish: "Finition",
    "Pipe Diameter": "Diametre du tube",
    Thickness: "Epaisseur",
    "Vehicle Type": "Type de vehicule",
    "Temperature Rating": "Classification de temperature",
    Length: "Longueur",
    Type: "Type",
    Capacity: "Capacite",
    "Peak Amps": "Amperage de pointe",
    "Kit Type": "Type de kit",
  },
};

const OPTION_VALUE_COPY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    Front: "Delantero",
    Rear: "Trasero",
    Universal: "Universal",
    "Direct-Fit": "Ajuste directo",
    Polished: "Pulido",
    "Burnt Titanium": "Titanio quemado",
    Chrome: "Cromado",
    Black: "Negro",
    "Front & Rear Set": "Juego delantero y trasero",
    "Passenger Car": "Automovil de pasajeros",
    "Light Truck": "Camioneta ligera",
    SUV: "SUV",
    Standard: "Estandar",
    Telescoping: "Telescopico",
    "With Brush": "Con cepillo",
    Basic: "Basico",
    Premium: "Premium",
    Professional: "Profesional",
  },
  nl: {
    Front: "Voor",
    Rear: "Achter",
    Universal: "Universeel",
    "Direct-Fit": "Direct passend",
    Polished: "Gepolijst",
    "Burnt Titanium": "Gebrand titanium",
    Chrome: "Chroom",
    Black: "Zwart",
    "Front & Rear Set": "Voor- en achterset",
    "Passenger Car": "Personenauto",
    "Light Truck": "Lichte vrachtwagen",
    SUV: "SUV",
    Standard: "Standaard",
    Telescoping: "Telescopisch",
    "With Brush": "Met borstel",
    Basic: "Basis",
    Premium: "Premium",
    Professional: "Professioneel",
  },
  fr: {
    Front: "Avant",
    Rear: "Arriere",
    Universal: "Universel",
    "Direct-Fit": "Montage direct",
    Polished: "Poli",
    "Burnt Titanium": "Titane brule",
    Chrome: "Chrome",
    Black: "Noir",
    "Front & Rear Set": "Kit avant et arriere",
    "Passenger Car": "Voiture particuliere",
    "Light Truck": "Camionnette",
    SUV: "SUV",
    Standard: "Standard",
    Telescoping: "Telescopique",
    "With Brush": "Avec brosse",
    Basic: "Basique",
    Premium: "Premium",
    Professional: "Professionnel",
  },
};

const BREADCRUMB_COPY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  es: {
    Home: "Inicio",
    Categories: "Categorias",
  },
  nl: {
    Home: "Home",
    Categories: "Categorieen",
  },
  fr: {
    Home: "Accueil",
    Categories: "Categories",
  },
};

const FEATURED_LINKS: Menu[] = [
  { title: "All Parts", path: "/categories" },
  { title: "Brakes", path: "/categories/brakes" },
  { title: "Engine", path: "/categories/engine" },
  { title: "Exhaust", path: "/categories/exhaust" },
];

const collectionByHandle = new Map<string, Collection>();
for (const collection of collections) {
  collectionByHandle.set(collection.handle, collection);
  for (const subcollection of collection.subcollections ?? []) {
    collectionByHandle.set(subcollection.handle, subcollection);
  }
}

export function resolveLocalizationLanguage(
  localeContext?: LocaleContext,
): LanguageCode {
  const normalized = normalizeLanguage(
    localeContext?.language ?? localeContext?.locale,
  );
  return normalized ?? defaultLocaleContext.language;
}

export function localizeProduct(
  product: Product,
  localeContext?: LocaleContext,
): LocalizedResult<Product> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const copy = PRODUCT_COPY[language][product.handle];

  const title = translated(telemetry, copy?.title, product.title);
  const description = translated(
    telemetry,
    copy?.description,
    product.description,
  );

  const localized: Product = {
    ...product,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    seo: {
      ...product.seo,
      title: translated(
        telemetry,
        copy?.seoTitle ?? copy?.title,
        product.seo.title,
      ),
      description: translated(
        telemetry,
        copy?.seoDescription ?? copy?.description,
        product.seo.description,
      ),
    },
    featuredImage: {
      ...product.featuredImage,
      altText: title,
    },
    images: product.images.map((image) => ({
      ...image,
      altText: title,
    })),
    options: product.options.map((option) => {
      const localizedOptionName = translated(
        telemetry,
        OPTION_NAME_COPY[language][option.name],
        option.name,
      );
      return {
        ...option,
        name: localizedOptionName,
        values: option.values.map((value) =>
          translated(telemetry, OPTION_VALUE_COPY[language][value], value),
        ),
      };
    }),
    variants: product.variants.map((variant) => {
      const localizedSelectedOptions = variant.selectedOptions.map(
        (selected) => ({
          ...selected,
          name: translated(
            telemetry,
            OPTION_NAME_COPY[language][selected.name],
            selected.name,
          ),
          value: translated(
            telemetry,
            OPTION_VALUE_COPY[language][selected.value],
            selected.value,
          ),
        }),
      );

      const localizedVariantTitle =
        localizedSelectedOptions[0]?.value ?? variant.title;

      return {
        ...variant,
        title: translated(telemetry, localizedVariantTitle, variant.title),
        selectedOptions: localizedSelectedOptions,
      };
    }),
    breadcrumbs: product.breadcrumbs?.map((breadcrumb) =>
      localizeBreadcrumb(breadcrumb, language, telemetry),
    ),
  };

  return {
    value: localized,
    telemetry,
  };
}

export function localizeProducts(
  input: Product[],
  localeContext?: LocaleContext,
): LocalizedResult<Product[]> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const value = input.map((product) => {
    const localized = localizeProduct(product, localeContext);
    mergeTelemetry(telemetry, localized.telemetry);
    return localized.value;
  });
  return { value, telemetry };
}

export function localizeCollection(
  collection: Collection,
  localeContext?: LocaleContext,
): LocalizedResult<Collection> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  return {
    value: localizeCollectionWithTelemetry(collection, language, telemetry),
    telemetry,
  };
}

export function localizeCollections(
  input: Collection[],
  localeContext?: LocaleContext,
): LocalizedResult<Collection[]> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);

  const value = input.map((collection) =>
    localizeCollectionWithTelemetry(collection, language, telemetry),
  );
  return { value, telemetry };
}

export function localizeMenu(
  input: Menu[],
  localeContext?: LocaleContext,
): LocalizedResult<Menu[]> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const value = input.map((item) => ({
    ...item,
    title: translated(
      telemetry,
      MENU_TITLE_COPY[language][item.title],
      item.title,
    ),
  }));
  return { value, telemetry };
}

export function localizeFeaturedLinks(
  localeContext?: LocaleContext,
): LocalizedResult<Menu[]> {
  return localizeMenu(FEATURED_LINKS, localeContext);
}

export function localizePage(
  page: Page,
  localeContext?: LocaleContext,
): LocalizedResult<Page> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const copy = PAGE_COPY[language][page.handle];

  const value: Page = {
    ...page,
    title: translated(telemetry, copy?.title, page.title),
    body: translated(telemetry, copy?.body, page.body),
    bodySummary: translated(telemetry, copy?.bodySummary, page.bodySummary),
    seo: page.seo
      ? {
          ...page.seo,
          title: translated(
            telemetry,
            copy?.seoTitle ?? copy?.title,
            page.seo.title,
          ),
          description: translated(
            telemetry,
            copy?.seoDescription ?? copy?.bodySummary,
            page.seo.description,
          ),
        }
      : page.seo,
  };

  return { value, telemetry };
}

export function localizePages(
  input: Page[],
  localeContext?: LocaleContext,
): LocalizedResult<Page[]> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const value = input.map((page) => {
    const localized = localizePage(page, localeContext);
    mergeTelemetry(telemetry, localized.telemetry);
    return localized.value;
  });
  return { value, telemetry };
}

export function localizeCmsPage(
  page: CmsRawPage,
  localeContext?: LocaleContext,
): LocalizedResult<CmsRawPage> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);
  const blockCopy = CMS_BLOCK_COPY[language][page.slug] ?? {};

  const value: CmsRawPage = {
    ...page,
    blocks: page.blocks.map((block) => {
      const copy = blockCopy[block.id];

      if (block.type === "hero-banner") {
        return {
          ...block,
          heading: translated(telemetry, copy?.heading, block.heading),
          subheading: translatedOptional(
            telemetry,
            copy?.subheading,
            block.subheading,
          ),
          ctaLabel: translatedOptional(
            telemetry,
            copy?.ctaLabel,
            block.ctaLabel,
          ),
          image: {
            ...block.image,
            altText: translated(
              telemetry,
              copy?.imageAltText,
              block.image.altText,
            ),
          },
        };
      }

      if (
        block.type === "featured-products" ||
        block.type === "product-carousel"
      ) {
        return {
          ...block,
          heading: translated(telemetry, copy?.heading, block.heading),
        };
      }

      if (block.type === "rich-text") {
        return {
          ...block,
          html: translated(telemetry, copy?.html, block.html),
        };
      }

      return block;
    }),
  };

  return { value, telemetry };
}

export function localizeCartLineMerchandise(
  params: {
    productHandle: string;
    productTitle?: string;
    merchandiseId: string;
    merchandiseTitle: string;
    selectedOptions: { name: string; value: string }[];
  },
  localeContext?: LocaleContext,
): LocalizedResult<{
  productTitle: string;
  merchandiseTitle: string;
  selectedOptions: { name: string; value: string }[];
}> {
  const language = resolveLocalizationLanguage(localeContext);
  const telemetry = createTelemetry(language);

  const product = products.find(
    (candidate) => candidate.handle === params.productHandle,
  );
  if (!product) {
    telemetry.totalFields += 1;
    telemetry.fallbackCount += 1;
    return {
      value: {
        productTitle: params.productTitle ?? params.productHandle,
        merchandiseTitle: params.merchandiseTitle,
        selectedOptions: params.selectedOptions,
      },
      telemetry,
    };
  }

  const localizedProduct = localizeProduct(product, localeContext);
  mergeTelemetry(telemetry, localizedProduct.telemetry);

  const variant = localizedProduct.value.variants.find(
    (candidate) => candidate.id === params.merchandiseId,
  );

  return {
    value: {
      productTitle: localizedProduct.value.title,
      merchandiseTitle: translated(
        telemetry,
        variant?.title,
        params.merchandiseTitle,
      ),
      selectedOptions:
        variant?.selectedOptions.map((selected) => ({
          name: selected.name,
          value: selected.value,
        })) ??
        params.selectedOptions.map((selected) => ({
          name: translated(
            telemetry,
            OPTION_NAME_COPY[language][selected.name],
            selected.name,
          ),
          value: translated(
            telemetry,
            OPTION_VALUE_COPY[language][selected.value],
            selected.value,
          ),
        })),
    },
    telemetry,
  };
}

export function createTelemetry(language: LanguageCode): LocalizationTelemetry {
  return {
    language,
    fallbackCount: 0,
    totalFields: 0,
  };
}

export function mergeTelemetry(
  target: LocalizationTelemetry,
  source: LocalizationTelemetry,
): void {
  target.fallbackCount += source.fallbackCount;
  target.totalFields += source.totalFields;
}

export function telemetryCoverage(telemetry: LocalizationTelemetry): number {
  if (telemetry.totalFields === 0) {
    return 1;
  }
  return (
    (telemetry.totalFields - telemetry.fallbackCount) / telemetry.totalFields
  );
}

function localizeCollectionWithTelemetry(
  collection: Collection,
  language: LanguageCode,
  telemetry: LocalizationTelemetry,
): Collection {
  const copy = COLLECTION_COPY[language][collection.handle];
  return {
    ...collection,
    title: translated(telemetry, copy?.title, collection.title),
    description: translated(
      telemetry,
      copy?.description,
      collection.description,
    ),
    seo: {
      ...collection.seo,
      title: translated(
        telemetry,
        copy?.seoTitle ?? copy?.title,
        collection.seo.title,
      ),
      description: translated(
        telemetry,
        copy?.seoDescription ?? copy?.description,
        collection.seo.description,
      ),
    },
    subcollections: collection.subcollections?.map((subcollection) =>
      localizeCollectionWithTelemetry(subcollection, language, telemetry),
    ),
  };
}

function localizeBreadcrumb(
  breadcrumb: Breadcrumb,
  language: LanguageCode,
  telemetry: LocalizationTelemetry,
): Breadcrumb {
  if (breadcrumb.path === "/") {
    return {
      ...breadcrumb,
      title: translated(
        telemetry,
        BREADCRUMB_COPY[language]["Home"],
        breadcrumb.title,
      ),
    };
  }

  if (breadcrumb.path.startsWith("/categories")) {
    const segments = breadcrumb.path.split("/").filter(Boolean);
    const maybeHandle = segments[segments.length - 1];
    if (maybeHandle) {
      const collection = collectionByHandle.get(maybeHandle);
      const translatedFromCollection = collection
        ? COLLECTION_COPY[language][collection.handle]?.title
        : undefined;
      return {
        ...breadcrumb,
        title: translated(
          telemetry,
          translatedFromCollection ??
            BREADCRUMB_COPY[language][breadcrumb.title],
          breadcrumb.title,
        ),
      };
    }
  }

  return {
    ...breadcrumb,
    title: translated(
      telemetry,
      MENU_TITLE_COPY[language][breadcrumb.title],
      breadcrumb.title,
    ),
  };
}

function translated(
  telemetry: LocalizationTelemetry,
  localized: string | undefined,
  canonical: string,
): string {
  telemetry.totalFields += 1;
  if (localized === undefined || localized === null || localized === "") {
    telemetry.fallbackCount += 1;
    return canonical;
  }
  return localized;
}

function translatedOptional(
  telemetry: LocalizationTelemetry,
  localized: string | undefined,
  canonical?: string,
): string | undefined {
  if (canonical === undefined && localized === undefined) {
    return undefined;
  }
  return translated(telemetry, localized, canonical ?? "");
}
