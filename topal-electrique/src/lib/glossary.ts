export type GlossaryTerm = {
  slug: string;
  fr: { term: string; definition: string };
  en: { term: string; definition: string };
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: 'ampere',
    fr: { term: 'Ampère (A)', definition: 'Unité de mesure de l\'intensité du courant électrique. Plus l\'ampérage est élevé, plus de courant circule dans le circuit. Les panneaux résidentiels sont généralement dimensionnés à 100A, 200A ou 400A selon les besoins de la propriété.' },
    en: { term: 'Ampere (A)', definition: 'The unit of measurement for electrical current intensity. The higher the amperage, the more current flows through the circuit. Residential panels are typically rated at 100A, 200A, or 400A depending on the property\'s needs.' },
  },
  {
    slug: 'borne-de-recharge-ev',
    fr: { term: 'Borne de recharge EV', definition: 'Station de recharge pour véhicules électriques installée à domicile ou en milieu commercial. Les bornes de niveau 2 (240V) sont les plus courantes en résidentiel. L\'installation doit être effectuée par un maître électricien certifié RBQ et peut être admissible à des subventions gouvernementales.' },
    en: { term: 'EV Charging Station', definition: 'A charging station for electric vehicles installed at home or in commercial settings. Level 2 chargers (240V) are the most common for residential use. Installation must be done by a licensed master electrician and may qualify for government rebates.' },
  },
  {
    slug: 'cable-arme',
    fr: { term: 'Câble armé (AC90)', definition: 'Type de câble électrique protégé par une gaine métallique flexible en acier ou en aluminium. Offre une protection mécanique supérieure au câble Romex et est requis dans certaines situations comme les locaux techniques, les greniers ou les sous-sols non finis.' },
    en: { term: 'Armored Cable (AC90)', definition: 'An electrical cable protected by a flexible metal sheath made of steel or aluminum. It offers superior mechanical protection compared to Romex cable and is required in certain situations such as utility rooms, attics, or unfinished basements.' },
  },
  {
    slug: 'cable-romex',
    fr: { term: 'Câble Romex (NMD90)', definition: 'Câble électrique à usage résidentiel composé de fils de cuivre isolés regroupés dans une gaine plastique. Le NMD90 est le câble résidentiel standard au Canada. Il est utilisé pour le câblage intérieur dans les murs et les plafonds des maisons.' },
    en: { term: 'Romex Cable (NMD90)', definition: 'A residential electrical cable made of insulated copper wires grouped in a plastic sheath. NMD90 is the standard residential cable in Canada, used for interior wiring inside walls and ceilings.' },
  },
  {
    slug: 'circuit',
    fr: { term: 'Circuit électrique', definition: 'Ensemble de conducteurs formant un chemin fermé permettant au courant électrique de circuler de la source jusqu\'aux appareils et de revenir. Un circuit est protégé par un disjoncteur ou un fusible dans le panneau électrique.' },
    en: { term: 'Electrical Circuit', definition: 'A set of conductors forming a closed path that allows electrical current to flow from the source to appliances and back. Each circuit is protected by a breaker or fuse in the electrical panel.' },
  },
  {
    slug: 'cmeq',
    fr: { term: 'CMEQ', definition: 'La Corporation des maîtres électriciens du Québec est l\'organisme officiel qui regroupe, représente et encadre les entreprises d\'électricité au Québec. Être membre de la CMEQ est une condition essentielle pour exercer légalement la profession d\'entrepreneur électricien au Québec.' },
    en: { term: 'CMEQ', definition: 'The Corporation des maîtres électriciens du Québec (CMEQ) is the official body that groups, represents, and oversees electrical contractors in Quebec. CMEQ membership is an essential requirement to legally practice as an electrical contractor in Quebec.' },
  },
  {
    slug: 'code-de-construction-du-quebec',
    fr: { term: 'Code de construction du Québec', definition: 'Règlement établissant les normes minimales de construction et d\'installation pour assurer la sécurité des personnes et des biens. Le chapitre V du Code de construction du Québec est consacré à l\'électricité et incorpore le Code canadien de l\'électricité (CSA C22.1).' },
    en: { term: 'Quebec Construction Code', definition: 'A regulation establishing minimum construction and installation standards to ensure the safety of people and property. Chapter V of the Quebec Construction Code is dedicated to electricity and incorporates the Canadian Electrical Code (CSA C22.1).' },
  },
  {
    slug: 'compteur-electrique',
    fr: { term: 'Compteur électrique', definition: 'Appareil installé par Hydro-Québec qui mesure la consommation d\'électricité d\'un bâtiment en kilowattheures (kWh). Le compteur se trouve généralement à l\'extérieur du bâtiment, à l\'entrée de service électrique.' },
    en: { term: 'Electricity Meter', definition: 'A device installed by Hydro-Québec that measures a building\'s electricity consumption in kilowatt-hours (kWh). The meter is typically located outside the building at the electrical service entrance.' },
  },
  {
    slug: 'conduit',
    fr: { term: 'Conduit électrique', definition: 'Tube rigide ou flexible servant à protéger et guider les câbles électriques. Les conduits peuvent être en acier galvanisé, en PVC ou en aluminium. Ils sont obligatoires dans les milieux commerciaux et industriels, ainsi que dans certaines zones résidentielles exposées.' },
    en: { term: 'Electrical Conduit', definition: 'A rigid or flexible tube used to protect and route electrical cables. Conduits can be made of galvanized steel, PVC, or aluminum. They are mandatory in commercial and industrial settings and in certain exposed residential areas.' },
  },
  {
    slug: 'court-circuit',
    fr: { term: 'Court-circuit', definition: 'Connexion non intentionnelle de faible résistance entre deux conducteurs de potentiels différents, causant un flux de courant excessif. Un court-circuit peut provoquer des dommages matériels graves, des incendies et des risques d\'électrocution. Le disjoncteur ou le fusible est conçu pour interrompre le circuit immédiatement.' },
    en: { term: 'Short Circuit', definition: 'An unintentional low-resistance connection between two conductors of different potentials, causing excessive current flow. A short circuit can cause serious property damage, fires, and electrocution risks. The breaker or fuse is designed to immediately interrupt the circuit.' },
  },
  {
    slug: 'csa',
    fr: { term: 'CSA (Association canadienne de normalisation)', definition: 'Organisme indépendant qui développe les normes techniques au Canada. En électricité, la norme CSA C22.1 constitue le Code canadien de l\'électricité. Tout équipement électrique vendu et installé au Canada doit porter la certification CSA.' },
    en: { term: 'CSA (Canadian Standards Association)', definition: 'An independent organization that develops technical standards in Canada. In electricity, CSA C22.1 constitutes the Canadian Electrical Code. All electrical equipment sold and installed in Canada must carry CSA certification.' },
  },
  {
    slug: 'disjoncteur',
    fr: { term: 'Disjoncteur', definition: 'Dispositif de protection automatique qui interrompt le courant électrique lorsqu\'un circuit est soumis à une surcharge ou à un court-circuit. Contrairement au fusible, le disjoncteur peut être réarmé manuellement après avoir été déclenché. Il est situé dans le panneau électrique.' },
    en: { term: 'Circuit Breaker', definition: 'An automatic protection device that interrupts electrical current when a circuit is overloaded or short-circuited. Unlike a fuse, a circuit breaker can be manually reset after tripping. It is located in the electrical panel.' },
  },
  {
    slug: 'disjoncteur-afci',
    fr: { term: 'Disjoncteur AFCI', definition: 'Disjoncteur à détection d\'arc électrique (Arc-Fault Circuit Interrupter) qui détecte les arcs électriques dangereux causés par des fils endommagés ou des connexions défectueuses, avant qu\'ils ne provoquent un incendie. Obligatoire dans les chambres à coucher selon le Code de construction du Québec.' },
    en: { term: 'AFCI Breaker', definition: 'An Arc-Fault Circuit Interrupter that detects dangerous electrical arcs caused by damaged wires or faulty connections before they cause a fire. Required in bedrooms according to the Quebec Construction Code.' },
  },
  {
    slug: 'disjoncteur-gfci',
    fr: { term: 'Disjoncteur GFCI / DDI', definition: 'Disjoncteur différentiel à courant de défaut (Ground-Fault Circuit Interrupter) qui détecte les fuites de courant à la terre et coupe le circuit en moins de 1/40e de seconde pour prévenir l\'électrocution. Obligatoire dans les salles de bain, cuisines, garages, extérieurs et sous-sols.' },
    en: { term: 'GFCI Breaker', definition: 'A Ground-Fault Circuit Interrupter that detects current leaks to ground and cuts the circuit in less than 1/40th of a second to prevent electrocution. Required in bathrooms, kitchens, garages, outdoors, and basements.' },
  },
  {
    slug: 'eclairage-del',
    fr: { term: 'Éclairage DEL (LED)', definition: 'Technologie d\'éclairage à diodes électroluminescentes, beaucoup plus efficace que les ampoules incandescentes ou fluorescentes. Les DEL consomment jusqu\'à 80% moins d\'énergie, durent 25 fois plus longtemps et ne contiennent pas de mercure. Fortement recommandés pour réduire les coûts d\'électricité.' },
    en: { term: 'LED Lighting', definition: 'Light-emitting diode lighting technology, far more efficient than incandescent or fluorescent bulbs. LEDs consume up to 80% less energy, last 25 times longer, and contain no mercury. Highly recommended to reduce electricity costs.' },
  },
  {
    slug: 'entree-de-service',
    fr: { term: 'Entrée de service', definition: 'Point de raccordement entre le réseau d\'Hydro-Québec et l\'installation électrique d\'un bâtiment. Comprend les fils de service aérien ou souterrain, le compteur et le panneau principal. La capacité de l\'entrée de service (100A, 200A, 400A) détermine la puissance électrique disponible.' },
    en: { term: 'Service Entrance', definition: 'The connection point between the Hydro-Québec network and a building\'s electrical system. It includes overhead or underground service wires, the meter, and the main panel. The service entrance capacity (100A, 200A, 400A) determines the available electrical power.' },
  },
  {
    slug: 'fil-de-phase',
    fr: { term: 'Fil de phase (fil chaud)', definition: 'Conducteur qui porte le courant électrique de la source vers les appareils. Dans le câblage résidentiel nord-américain, le fil chaud est généralement noir ou rouge. Il est important de ne jamais toucher un fil chaud à mains nues — toujours couper l\'alimentation au panneau avant toute intervention.' },
    en: { term: 'Hot Wire (Live Wire)', definition: 'The conductor that carries electrical current from the source to appliances. In North American residential wiring, the hot wire is typically black or red. Never touch a hot wire with bare hands — always turn off the power at the panel before any work.' },
  },
  {
    slug: 'fil-de-terre',
    fr: { term: 'Fil de terre (conducteur de mise à la terre)', definition: 'Conducteur de sécurité vert ou non isolé qui relie les parties métalliques des appareils électriques à la terre. En cas de défaut d\'isolement, le fil de terre permet d\'évacuer le courant de fuite et de déclencher le disjoncteur, prévenant ainsi les risques d\'électrocution.' },
    en: { term: 'Ground Wire', definition: 'A green or bare safety conductor that connects metal parts of electrical appliances to the ground. In case of insulation failure, the ground wire safely directs fault current to trip the breaker, preventing electrocution.' },
  },
  {
    slug: 'fil-neutre',
    fr: { term: 'Fil neutre', definition: 'Conducteur blanc qui complète le circuit en ramenant le courant depuis les appareils vers la source. Bien qu\'il ne soit pas considéré comme « chaud », le fil neutre peut tout de même transporter du courant et doit être manipulé avec précaution lors des travaux électriques.' },
    en: { term: 'Neutral Wire', definition: 'A white conductor that completes the circuit by returning current from appliances back to the source. Although not considered "hot," the neutral wire can still carry current and must be handled carefully during electrical work.' },
  },
  {
    slug: 'fusible',
    fr: { term: 'Fusible', definition: 'Dispositif de protection électrique composé d\'un fil métallique qui fond et interrompt le circuit lorsque le courant dépasse sa valeur nominale. Les fusibles sont à usage unique, contrairement aux disjoncteurs qui peuvent être réarmés. On les retrouve principalement dans les anciennes installations électriques.' },
    en: { term: 'Fuse', definition: 'An electrical protection device consisting of a metal wire that melts and interrupts the circuit when current exceeds its rated value. Fuses are single-use, unlike breakers which can be reset. They are mainly found in older electrical installations.' },
  },
  {
    slug: 'inspection-electrique',
    fr: { term: 'Inspection électrique', definition: 'Vérification obligatoire effectuée par un inspecteur de la Régie du bâtiment du Québec (RBQ) après la réalisation de travaux électriques soumis à permis. L\'inspection valide la conformité des travaux aux normes du Code de construction du Québec. Le maître électricien est responsable d\'obtenir cette inspection.' },
    en: { term: 'Electrical Inspection', definition: 'A mandatory check conducted by a Régie du bâtiment du Québec (RBQ) inspector after completing electrical work requiring a permit. The inspection validates compliance with Quebec Construction Code standards. The master electrician is responsible for obtaining this inspection.' },
  },
  {
    slug: 'installation-triphasee',
    fr: { term: 'Installation triphasée', definition: 'Système d\'alimentation électrique utilisant trois courants alternatifs déphasés de 120° l\'un par rapport à l\'autre. Le triphasé est utilisé principalement en milieu commercial et industriel pour alimenter des équipements à forte puissance comme les moteurs, les compresseurs et les systèmes CVC.' },
    en: { term: 'Three-Phase Installation', definition: 'An electrical power system using three alternating currents phased 120° apart. Three-phase power is primarily used in commercial and industrial settings to power high-demand equipment such as motors, compressors, and HVAC systems.' },
  },
  {
    slug: 'interrupteur',
    fr: { term: 'Interrupteur', definition: 'Dispositif mécanique permettant d\'ouvrir ou de fermer un circuit électrique pour contrôler l\'alimentation d\'un luminaire ou d\'un appareil. Les interrupteurs existent en plusieurs configurations : simple, double, va-et-vient (3 voies) et multivoies (4 voies) pour les grandes pièces ou les couloirs.' },
    en: { term: 'Switch', definition: 'A mechanical device used to open or close an electrical circuit to control power to a light fixture or appliance. Switches come in several configurations: single-pole, double-pole, 3-way (for controlling a light from two locations), and 4-way (for three or more locations).' },
  },
  {
    slug: 'interrupteur-gradateur',
    fr: { term: 'Gradateur (dimmer)', definition: 'Interrupteur électronique permettant de régler l\'intensité lumineuse d\'un luminaire de 0 à 100%. Les gradateurs modernes sont compatibles avec les ampoules DEL et peuvent contribuer à réduire la consommation d\'énergie. Il est important de vérifier la compatibilité entre le gradateur et le type d\'ampoule utilisé.' },
    en: { term: 'Dimmer Switch', definition: 'An electronic switch that adjusts the brightness of a light fixture from 0 to 100%. Modern dimmers are compatible with LED bulbs and can help reduce energy consumption. It\'s important to verify compatibility between the dimmer and the type of bulb used.' },
  },
  {
    slug: 'kilowattheure',
    fr: { term: 'Kilowattheure (kWh)', definition: 'Unité d\'énergie électrique correspondant à la consommation de 1 000 watts pendant une heure. C\'est l\'unité utilisée par Hydro-Québec pour facturer la consommation d\'électricité. Par exemple, une ampoule de 100W allumée pendant 10 heures consomme 1 kWh.' },
    en: { term: 'Kilowatt-Hour (kWh)', definition: 'A unit of electrical energy equal to the consumption of 1,000 watts over one hour. It is the unit used by Hydro-Québec to bill electricity consumption. For example, a 100W bulb left on for 10 hours consumes 1 kWh.' },
  },
  {
    slug: 'luminaire',
    fr: { term: 'Luminaire', definition: 'Terme générique désignant tout appareil d\'éclairage électrique, qu\'il soit encastré, suspendu, appliqué au mur ou au plafond. L\'installation d\'un luminaire nécessite une boîte électrique approuvée pour supporter le poids de l\'appareil et garantir une connexion sécuritaire.' },
    en: { term: 'Light Fixture', definition: 'A generic term for any electrical lighting device, whether recessed, pendant, wall-mounted, or ceiling-mounted. Installing a light fixture requires an approved electrical box that can support the weight of the fixture and ensure a safe connection.' },
  },
  {
    slug: 'maitre-electricien',
    fr: { term: 'Maître électricien', definition: 'Entrepreneur électricien titulaire d\'une licence de la Régie du bâtiment du Québec (RBQ) et membre de la CMEQ. Seul un maître électricien peut légalement exécuter des travaux électriques soumis à permis au Québec. La licence atteste d\'une formation, d\'une expérience et d\'un niveau de compétence certifiés.' },
    en: { term: 'Master Electrician', definition: 'An electrical contractor holding a Régie du bâtiment du Québec (RBQ) licence and CMEQ membership. Only a master electrician can legally perform permit-required electrical work in Quebec. The licence certifies training, experience, and a recognized level of competency.' },
  },
  {
    slug: 'mise-a-la-terre',
    fr: { term: 'Mise à la terre', definition: 'Connexion électrique reliant les parties conductrices d\'une installation à la terre (sol). La mise à la terre est une mesure de sécurité fondamentale qui protège contre les chocs électriques, réduit les risques d\'incendie et assure le bon fonctionnement des disjoncteurs différentiels.' },
    en: { term: 'Grounding', definition: 'An electrical connection linking the conductive parts of an installation to the earth (ground). Grounding is a fundamental safety measure that protects against electric shocks, reduces fire risks, and ensures proper functioning of GFCI devices.' },
  },
  {
    slug: 'mise-a-niveau-electrique',
    fr: { term: 'Mise à niveau électrique', definition: 'Travaux visant à moderniser et à améliorer une installation électrique existante pour la mettre en conformité avec les normes actuelles ou pour augmenter sa capacité. Comprend généralement le remplacement d\'un panneau vétuste, l\'ajout de circuits, l\'installation de prises GFCI et la mise à la terre du système.' },
    en: { term: 'Electrical Upgrade', definition: 'Work aimed at modernizing and improving an existing electrical installation to bring it up to current standards or increase its capacity. Typically includes replacing an outdated panel, adding circuits, installing GFCI outlets, and grounding the system.' },
  },
  {
    slug: 'ohm',
    fr: { term: 'Ohm (Ω)', definition: 'Unité de mesure de la résistance électrique. La résistance d\'un conducteur détermine la facilité avec laquelle le courant le traverse. La loi d\'Ohm établit la relation fondamentale entre tension (V), courant (A) et résistance (Ω) : V = R × I.' },
    en: { term: 'Ohm (Ω)', definition: 'The unit of measurement for electrical resistance. A conductor\'s resistance determines how easily current flows through it. Ohm\'s law establishes the fundamental relationship between voltage (V), current (A), and resistance (Ω): V = R × I.' },
  },
  {
    slug: 'panneau-electrique',
    fr: { term: 'Panneau électrique (tableau électrique)', definition: 'Boîtier métallique situé généralement au sous-sol ou dans une salle utilitaire qui contient les disjoncteurs protégeant chaque circuit de la maison. Le panneau est le point central de distribution de l\'électricité dans le bâtiment. Sa capacité (100A, 200A, 400A) détermine la puissance électrique totale disponible.' },
    en: { term: 'Electrical Panel', definition: 'A metal enclosure typically located in the basement or utility room containing the circuit breakers protecting each circuit in the home. The panel is the central distribution point for electricity in the building. Its capacity (100A, 200A, 400A) determines total available electrical power.' },
  },
  {
    slug: 'permis-electrique',
    fr: { term: 'Permis électrique', definition: 'Autorisation municipale obligatoire pour la réalisation de la plupart des travaux électriques au Québec (remplacement de panneau, ajout de circuits, rénovations). Le maître électricien est responsable d\'obtenir le permis et de faire inspecter les travaux. Des travaux sans permis peuvent invalider l\'assurance habitation.' },
    en: { term: 'Electrical Permit', definition: 'A mandatory municipal authorization for most electrical work in Quebec (panel replacement, adding circuits, renovations). The master electrician is responsible for obtaining the permit and scheduling the inspection. Work done without a permit can void home insurance.' },
  },
  {
    slug: 'prise-de-courant',
    fr: { term: 'Prise de courant (prise murale)', definition: 'Dispositif encastré dans le mur permettant le branchement des appareils électriques. Les prises résidentielles standard au Canada sont à 120V/15A ou 120V/20A. Certains appareils puissants (sécheuse, cuisinière, borne EV) nécessitent des prises spéciales à 240V.' },
    en: { term: 'Electrical Outlet', definition: 'A device embedded in the wall for connecting electrical appliances. Standard residential outlets in Canada are 120V/15A or 120V/20A. Certain high-power appliances (dryer, stove, EV charger) require special 240V outlets.' },
  },
  {
    slug: 'prise-gfci',
    fr: { term: 'Prise GFCI (prise DDI)', definition: 'Prise de courant avec protection différentielle intégrée qui coupe le courant en cas de fuite à la terre. Reconnaissable par ses deux boutons TEST et RESET situés entre les fentes. Obligatoire dans les zones humides : salles de bain, cuisine, garage, extérieur et sous-sol selon le Code de construction du Québec.' },
    en: { term: 'GFCI Outlet', definition: 'An outlet with built-in ground-fault protection that cuts power in case of a ground fault. Identifiable by its TEST and RESET buttons between the slots. Required in wet areas: bathrooms, kitchens, garages, outdoors, and basements per the Quebec Construction Code.' },
  },
  {
    slug: 'rbq',
    fr: { term: 'RBQ (Régie du bâtiment du Québec)', definition: 'Organisme gouvernemental québécois responsable de l\'application des lois et règlements en matière de construction, dont le Code de construction du Québec. La RBQ délivre les licences d\'entrepreneur et d\'artisan en construction, supervise les inspections et protège le public contre les pratiques non conformes.' },
    en: { term: 'RBQ (Régie du bâtiment du Québec)', definition: 'The Quebec government body responsible for enforcing construction laws and regulations, including the Quebec Construction Code. The RBQ issues contractor and tradesperson licences, oversees inspections, and protects the public against non-compliant practices.' },
  },
  {
    slug: 'relais',
    fr: { term: 'Relais électrique', definition: 'Interrupteur électromagnétique commandé par un faible courant électrique pour contrôler un circuit à courant plus élevé. Utilisé dans les systèmes de contrôle, les thermostats, les systèmes domotiques et les équipements industriels. Le relais permet d\'isoler électriquement les circuits de commande des circuits de puissance.' },
    en: { term: 'Electrical Relay', definition: 'An electromagnetic switch controlled by a small electric current to control a higher-current circuit. Used in control systems, thermostats, home automation, and industrial equipment. Relays electrically isolate control circuits from power circuits.' },
  },
  {
    slug: 'service-electrique',
    fr: { term: 'Service électrique', definition: 'Désigne l\'ensemble du système d\'alimentation en électricité d\'un bâtiment depuis le réseau d\'Hydro-Québec, incluant les fils de service, le compteur et le panneau principal. La capacité du service (ampérage) détermine la puissance électrique maximale disponible dans le bâtiment.' },
    en: { term: 'Electrical Service', definition: 'The complete electrical supply system for a building from the Hydro-Québec network, including service wires, the meter, and the main panel. The service capacity (amperage) determines the maximum electrical power available in the building.' },
  },
  {
    slug: 'surcharge',
    fr: { term: 'Surcharge électrique', definition: 'Situation où un circuit est soumis à un courant supérieur à sa capacité nominale, provoquant une surchauffe des conducteurs. Une surcharge prolongée peut endommager les câbles, faire fondre les isolants et causer un incendie. Le disjoncteur détecte la surcharge et coupe automatiquement le circuit pour protéger l\'installation.' },
    en: { term: 'Electrical Overload', definition: 'A situation where a circuit carries more current than its rated capacity, causing conductors to overheat. Prolonged overloading can damage wires, melt insulation, and cause a fire. The circuit breaker detects the overload and automatically cuts the circuit to protect the installation.' },
  },
  {
    slug: 'tableau-de-distribution',
    fr: { term: 'Tableau de distribution (sous-panneau)', definition: 'Panneau secondaire alimenté par le panneau principal et servant à distribuer l\'électricité dans une zone spécifique d\'un bâtiment, comme un atelier, un garage ou un étage. Les tableaux de distribution sont utilisés lorsque le nombre de circuits dépasse la capacité du panneau principal.' },
    en: { term: 'Distribution Panel (Sub-Panel)', definition: 'A secondary panel fed by the main panel, used to distribute electricity in a specific area of a building such as a workshop, garage, or floor. Distribution panels are used when the number of circuits exceeds the main panel\'s capacity.' },
  },
  {
    slug: 'thermostat',
    fr: { term: 'Thermostat électrique', definition: 'Dispositif de contrôle qui régule la température d\'une pièce en commandant un système de chauffage ou de climatisation. Les thermostats modernes sont programmables ou intelligents (connectés Wi-Fi) et permettent de réduire significativement la consommation d\'énergie grâce à une gestion précise des horaires de chauffage.' },
    en: { term: 'Electric Thermostat', definition: 'A control device that regulates room temperature by controlling a heating or cooling system. Modern thermostats are programmable or smart (Wi-Fi connected) and can significantly reduce energy consumption through precise scheduling of heating and cooling.' },
  },
  {
    slug: 'transformateur',
    fr: { term: 'Transformateur', definition: 'Appareil électromagnétique qui modifie la tension d\'un courant alternatif sans changer sa fréquence. Les transformateurs sont utilisés pour élever la tension pour le transport d\'électricité longue distance, puis la réduire à des niveaux sécuritaires pour les bâtiments (240V ou 120V en résidentiel).' },
    en: { term: 'Transformer', definition: 'An electromagnetic device that changes the voltage of an alternating current without changing its frequency. Transformers are used to step up voltage for long-distance power transmission, then step it down to safe levels for buildings (240V or 120V residential).' },
  },
  {
    slug: 'volt',
    fr: { term: 'Volt (V)', definition: 'Unité de mesure de la tension électrique, aussi appelée différence de potentiel. La tension représente la « pression » qui pousse le courant dans les conducteurs. Au Canada, la tension standard est de 120V pour les prises ordinaires et 240V pour les appareils puissants (sécheuse, cuisinière, borne EV).' },
    en: { term: 'Volt (V)', definition: 'The unit of measurement for electrical voltage, also called potential difference. Voltage represents the "pressure" pushing current through conductors. In Canada, the standard voltage is 120V for regular outlets and 240V for high-power appliances (dryer, stove, EV charger).' },
  },
  {
    slug: 'watt',
    fr: { term: 'Watt (W)', definition: 'Unité de mesure de la puissance électrique. La puissance correspond à la quantité d\'énergie consommée ou produite par seconde. Elle est calculée par la formule P = V × I (puissance = tension × intensité). Une ampoule DEL typique consomme entre 8 et 15 watts.' },
    en: { term: 'Watt (W)', definition: 'The unit of measurement for electrical power. Power represents the amount of energy consumed or produced per second, calculated with P = V × I (power = voltage × current). A typical LED bulb consumes between 8 and 15 watts.' },
  },
];

export function getTermsByLocale(locale: 'fr' | 'en') {
  return GLOSSARY_TERMS.map((t) => ({
    slug: t.slug,
    term: t[locale].term,
    definition: t[locale].definition,
  })).sort((a, b) => a.term.localeCompare(b.term, locale, { sensitivity: 'base' }));
}
