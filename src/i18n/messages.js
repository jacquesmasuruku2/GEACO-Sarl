/**
 * Textes FR / EN centralisés pour évolution multilingue sans surcouche lourde.
 * Clés hiérarchiques : utiliser la notation pointée avec resolveMessage().
 */

export const messages = {
  fr: {
    brand: {
      short: 'GEACO SARL',
      long: "Groupe d'études agronomiques et de construction",
    },
    header: {
      regionLine: 'République démocratique du Congo · Nord-Kivu',
    },
    nav: {
      home: 'accueil',
      about: 'à propos',
      personnel: 'personnel',
      services: 'services',
      projects: 'projets',
      blog: 'blog',
      partnerships: 'partenariats',
      contact: 'contact',
      legal: 'mentions légales',
      servicesOverview: 'vue d’ensemble',
      aboutOverview: 'présentation',
      faq: 'FAQ',
    },
    home: {
      metaTitle: 'GEACO SARL — Agronomie, génie civil & hydraulique rurale',
      metaDesc:
        'Entreprise congolaise : études, conception et réalisation de projets intégrés en agriculture et construction. Goma & Butembo, Nord-Kivu.',
      heroTitle: 'Solutions durables pour territoires ruraux et urbains',
      heroLead:
        'GEACO SARL accompagne les communautés du Nord-Kivu et au-delà avec une expertise intégrée : agronomie, génie civil et hydraulique rurale, ancrée dans le terrain.',
      ctaQuote: 'Demander un devis',
      ctaContact: 'Nous contacter',
      ctaProjects: 'Découvrir nos projets',
      visionTitle: 'Vision',
      visionText:
        'Devenir un acteur majeur en Afrique centrale dans la mise en œuvre de solutions durables en agriculture et en infrastructures rurales.',
      missionTitle: 'Mission',
      missionItems: [
        'Améliorer la productivité agricole',
        'Développer les infrastructures rurales',
        'Promouvoir les technologies modernes (irrigation, énergie solaire, etc.)',
      ],
      servicesTitle: 'Domaines d’intervention',
      servicesLead:
        'Une approche intégrée — du diagnostic à la mise en œuvre — pour des projets adaptés au contexte local.',
      strengthsTitle: 'Atouts',
      strengths: [
        { title: 'Équipe multidisciplinaire', text: 'Agronomie, BTP, hydraulique et encadrement de terrain.' },
        { title: 'Connaissance du terrain', text: 'Présence à Goma et Butembo, ancrage Nord-Kivu.' },
        { title: 'Approche intégrée', text: 'Agriculture et construction coordonnées sur un même chantier de développement.' },
        { title: 'Flexibilité & innovation', text: 'Solutions techniques réalistes et évolutives.' },
      ],
      partnersTeaserTitle: 'Partenariats',
      partnersTeaser:
        'Nous recherchons des partenaires semenciers, organisations agricoles, bailleurs et ONG internationales.',
      partnersCta: 'Proposer un partenariat',
      breadcrumbParent: 'GEACO SARL',
      breadcrumbCurrent: 'Nos expertises terrain',
      expertiseSectionTitle: 'Nos expertises',
      expertiseSectionIntro:
        'Nous mettons au service des bailleurs, des collectivités et des opérateurs agricoles nos compétences pour concevoir et réaliser des travaux d’agronomie, de génie civil et d’hydraulique rurale, partout en Afrique centrale et au Nord-Kivu.',
      panelAgKicker: 'Agronomie',
      panelAgLead:
        'Sécurité alimentaire, études de sols, environnement et accompagnement des producteurs : une chaîne complète de la parcelle au marché.',
      panelCivilKicker: 'Génie civil',
      panelCivilLead:
        'Routes, bâtiments, ouvrages d’art et infrastructures de base : maîtrise d’œuvre et exécution adaptées aux contraintes locales.',
      panelHydroKicker: 'Hydraulique',
      panelHydroLead:
        'Irrigation, drainage, forages et adductions : sécuriser l’eau pour les cultures et les communautés.',
      solutionCafeSpotlight: {
        badge: 'Projet filière',
        title: 'Solution Café — du champ à l’export',
        lead:
          'Projet opérationnel de GEACO SARL : structurer la chaîne du café congolais, de la production à la commercialisation internationale, en soutenant les producteurs et la qualité.',
        bullets: [
          'Production et encadrement à la parcelle',
          'Traitement, transformation et conformité qualité',
          'Accès aux marchés internationaux et partenariats logistiques',
        ],
        cta: 'Découvrir la filière Solution Café',
      },
      newsSectionTitle: 'Actualités & projets',
      newsMore: 'Voir toutes les actualités',
      newsItems: [
        {
          date: '14.04.2026',
          cats: ['Actualités', 'Hydraulique'],
          title: 'Optimisation d’un périmètre irrigué communautaire',
        },
        {
          date: '09.04.2026',
          cats: ['Actualités', 'Génie civil'],
          title: 'Renforcement d’un axe rural prioritaire pour l’écoulement des récoltes',
        },
        {
          date: '02.04.2026',
          cats: ['Actualités', 'Agronomie'],
          title: 'Campagne d’encadrement technique sur itinéraires culturaux durables',
        },
      ],
      promoEyebrow: 'Essentiel GEACO',
      promoTitle: 'Une entreprise intégrée au service des territoires',
      promoText:
        'Découvrez notre organisation, nos principes d’intervention, nos implantations à Goma et Butembo, et nos engagements envers les communautés et les partenaires techniques.',
      promoCta: 'Découvrir l’entreprise',
      statsSectionTitle: 'Chiffres clés',
      stats: [
        { value: '3', label: 'domaines d’expertise intégrés' },
        { value: '2', label: 'implantations — Goma & Bweremana' },
        { value: '99', label: 'ans — horizon de la société' },
      ],
      ctaBandTitle: 'Construisez votre projet avec nous',
      ctaBandText:
        'Vous souhaitez contribuer à des chantiers de développement à fort impact et gagner en compétence sur le terrain ? Parlons-en.',
      ctaBandBtn: 'Nous rejoindre',
    },
    about: {
      metaTitle: 'À propos — GEACO SARL',
      metaDesc: 'Présentation, valeurs et équipe dirigeante de GEACO SARL.',
      title: 'À propos de GEACO',
      intro:
        'GEACO SARL est une société à responsabilité limitée enregistrée en République démocratique du Congo. Nous concevons et réalisons des projets intégrés en agriculture et construction pour renforcer la résilience des territoires.',
      valuesTitle: 'Valeurs & engagement',
      values: [
        'Excellence technique et respect des normes applicables',
        'Transparence vis-à-vis des parties prenantes et des communautés',
        'Durabilité environnementale et sociale des interventions',
      ],
      teamTitle: 'Associés & expertise',
      team: [
        {
          name: 'Baraka Musa Eric',
          role: 'Ingénieur en bâtiment et travaux publics',
          bio: 'Pilotage des ouvrages, routes, bâtiments et infrastructures hydrauliques.',
        },
        {
          name: 'Naomi Mukobelwa Sifa',
          role: 'Ingénieure en agronomie et vétérinaire',
          bio: 'Sécurité alimentaire, cultures, élevage et accompagnement des producteurs.',
        },
      ],
      approachTitle: 'Approche intégrée',
      approachText:
        'Combiner études agronomiques, aménagements hydro-agricoles et travaux de génie civil permet d’aligner la production, l’accès à l’eau et la connectivité physique des exploitations et villages.',
    },
    faq: {
      metaTitle: 'FAQ — GEACO SARL',
      metaDesc:
        'Réponses aux questions fréquentes : périmètre d’intervention, demande de devis, délais, secteurs et collaboration avec bailleurs et collectivités.',
      title: 'Foire aux questions',
      lead: 'Informations utiles avant de nous contacter pour une étude, un chantier ou un partenariat.',
      items: [
        {
          q: 'Dans quelles zones GEACO SARL intervient-elle ?',
          a: 'Nous sommes implantés à Goma et Butembo (Nord-Kivu) et intervenons sur des projets en RDC et en Afrique centrale selon les appels d’offres et mandats reçus.',
        },
        {
          q: 'Comment demander un devis ou une étude ?',
          a: 'Utilisez la page Contact avec un résumé du besoin, la localisation et les délais souhaités. Nous revenons vers vous pour affiner le périmètre technique et administratif.',
        },
        {
          q: 'Quels types de projets réalisez-vous ?',
          a: 'Études et travaux en agronomie et environnement, génie civil (routes, bâtiments, ouvrages), hydraulique rurale (forages, adductions), ainsi que des filières agricoles intégrées (ex. café).',
        },
        {
          q: 'Travaillez-vous avec des bailleurs et des ONG ?',
          a: 'Oui : appels d’offres, conventions avec bailleurs internationaux, collectivités et opérateurs agricoles font partie de notre activité courante.',
        },
        {
          q: 'Quels délais faut-il prévoir ?',
          a: 'Les délais dépendent de la complexité des études, des saisons pour le terrain agricole et des autorisations. Une fourchette vous est communiquée après analyse du dossier.',
        },
        {
          q: 'Proposez-vous du renforcement des capacités ?',
          a: 'Oui, dans la continuité de nos missions : transfert de pratiques vers les techniciens locaux, producteurs et partenaires.',
        },
      ],
    },
    notFound: {
      metaTitle: 'Page introuvable — GEACO SARL',
      metaDesc:
        'Cette adresse ne correspond à aucune page du site. Retournez à l’accueil ou consultez nos rubriques principales.',
      breadcrumb: 'Erreur 404',
      title: 'Page introuvable',
      lead:
        'L’adresse que vous avez saisie ne correspond à aucune page de notre site. Elle a peut-être été déplacée ou le lien est incomplet.',
      pathLabel: 'Chemin demandé',
      hint: 'Vérifiez l’orthographe de l’URL ou poursuivez la visite depuis les accès ci-dessous.',
      homeCta: 'Retour à l’accueil',
      contactCta: 'Nous contacter',
      quickTitle: 'Poursuivre sur le site',
      tileServicesTitle: 'Services',
      tileServicesDesc: 'Agronomie, génie civil, hydraulique rurale et filières.',
      tileProjectsTitle: 'Projets',
      tileProjectsDesc: 'Réalisations et références représentatives.',
      tileBlogTitle: 'Blog',
      tileBlogDesc: 'Actualités, articles et regards sur le terrain.',
      tilePartnersTitle: 'Partenariats',
      tilePartnersDesc: 'Proposer une collaboration avec GEACO.',
    },
    services: {
      metaTitle: 'Services — GEACO SARL',
      metaDesc:
        'Agronomie, génie civil, hydraulique rurale, commerce et filière Solution Café — études, travaux et export.',
      title: 'Nos services',
      lead:
        'Quatre axes complémentaires — agronomie, génie civil, hydraulique rurale et filière café — pour des projets cohérents de la production à l’export.',
      agronomy: {
        title: 'Agronomie & environnement',
        items: [
          'Études agronomiques et diagnostics de sols',
          'Études environnementales et analyses d’impact',
          'Sécurité alimentaire, cultures et protection des plantes',
          'Élevage, santé animale et gestion des parcours',
          'Fourniture d’intrants et de semences de qualité',
          'Encadrement technique des agriculteurs et des coopératives',
        ],
      },
      civil: {
        title: 'Génie civil & infrastructures',
        items: [
          'Routes rurales et ouvrages d’art',
          'Bâtiments publics, scolaires et communautaires',
          'Ouvrages hydrauliques et structures associées',
          'Infrastructures WASH, télécommunications et électricité (études & appui)',
          'Bureau d’études techniques et architecturales',
        ],
      },
      hydro: {
        title: 'Hydraulique rurale',
        items: [
          'Aménagement hydro-agricole : irrigation et drainage',
          'Forage mécanique de puits et captages',
          'Adductions, stockage et distribution d’eau',
          'Intégration solaire pour pompage et petites énergies',
        ],
      },
      commerce: {
        title: 'Commerce & renforcement des capacités',
        text:
          'Achat, importation et vente de matériaux de construction, équipements électriques et informatiques ; produits agricoles ; formation professionnelle et transfert de compétences.',
      },
      solutionCafe: {
        navTitle: 'solution café',
      },
      hub: {
        backToHub: 'Toutes les prestations',
        contactCta: 'Nous contacter',
        chooseTitle: 'Choisir une prestation',
        chooseLead: 'Accédez au détail de chaque domaine ou à la filière Solution Café.',
        cardCta: 'Voir le détail',
      },
      detail: {
        agronomie: {
          metaTitle: 'Agronomie & environnement — GEACO SARL',
          metaDesc:
            'Études agronomiques, sécurité alimentaire, élevage, intrants et encadrement des producteurs au Nord-Kivu et en RDC.',
          title: 'Agronomie & environnement',
          heroImage:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80',
          intro:
            'Nous accompagnons les exploitations et institutions dans une approche scientifique et terrain : diagnostic des sols, filières végétales et animales, protection de l’environnement et renforcement des capacités.',
          sections: [
            {
              title: 'Études et diagnostics',
              items: [
                'Études agronomiques et diagnostics de sols',
                'Études environnementales et analyses d’impact',
                'Cartographie des risques et des potentialités agricoles',
              ],
            },
            {
              title: 'Productions et filières',
              items: [
                'Sécurité alimentaire, cultures et protection des plantes',
                'Élevage, santé animale et gestion des parcours',
                'Fourniture d’intrants et de semences de qualité',
              ],
            },
            {
              title: 'Accompagnement',
              text: 'Encadrement technique des agriculteurs et des coopératives, démonstration de pratiques et suivi des itinéraires techniques.',
            },
          ],
        },
        civil: {
          metaTitle: 'Génie civil & infrastructures — GEACO SARL',
          metaDesc:
            'Routes, bâtiments, ouvrages d’art, WASH, études techniques et maîtrise d’œuvre pour infrastructures de base en RDC.',
          title: 'Génie civil & infrastructures',
          heroImage:
            'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80',
          intro:
            'Du bureau d’études à la mise en œuvre, nous concevons et réalisons des ouvrages adaptés aux contraintes locales, en veillant à la durabilité technique et au coût maîtrisé.',
          sections: [
            {
              title: 'Infrastructures de transport et d’ingénierie',
              items: [
                'Routes en terre et routes revêtues, ouvrages d’art (ponts, dalots)',
                'Bâtiments publics, scolaires et communautaires',
                'Contrôle et réalisation des activités de bâtiments et travaux publics',
              ],
            },
            {
              title: 'Eau, énergie et télécommunications',
              items: [
                'Projets d’eau et d’assainissement (WASH)',
                'Projets d’électricité et d’hydraulique',
                'Développement de techniques d’information et de télécommunication',
              ],
            },
            {
              title: 'Bureau d’études',
              text: 'Conception architecturale et technique, assistance à maîtrise d’ouvrage et coordination de chantier.',
            },
          ],
        },
        hydro: {
          metaTitle: 'Hydraulique rurale — GEACO SARL',
          metaDesc:
            'Irrigation, drainage, forages mécaniques, adductions et intégration solaire pour sécuriser l’eau en milieu rural.',
          title: 'Hydraulique rurale',
          heroImage:
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1800&q=80',
          intro:
            'L’eau est au cœur des territoires agricoles. Nous dimensionnons et réalisons des ouvrages pour l’irrigation, l’abreuvement et l’alimentation des communautés.',
          sections: [
            {
              title: 'Aménagements hydro-agricoles',
              items: [
                'Irrigation et drainage de périmètres',
                'Réseaux primaires et secondaires, stockage',
                'Intégration solaire pour pompage et petites énergies',
              ],
            },
            {
              title: 'Captage et distribution',
              items: [
                'Forage mécanique des puits',
                'Adductions, captages et distribution d’eau potable',
              ],
            },
          ],
        },
        solutionCafe: {
          metaTitle: 'Solution Café — GEACO SARL',
          metaDesc:
            'Filière café du champ à l’export : production, transformation et marchés internationaux pour le café congolais.',
          title: 'Solution Café',
          projectBadge: 'Projet opérationnel — filière café GEACO',
          heroImage:
            'https://images.unsplash.com/photo-1447933601408-4c668d815b56?auto=format&fit=crop&w=1800&q=80',
          intro:
            'Le Groupe d’études agronomiques et de construction (GEACO SARL) porte le projet Solution Café : une filière structurante qui valorise le café congolais, de la production à l’exportation, avec une exigence de qualité et de traçabilité.',
          sections: [
            {
              title: 'Un projet d’entreprise, ancré terrain et marchés',
              text:
                'Solution Café n’est pas un simple slogan : il s’agit d’un programme opérationnel qui relie les producteurs, les étapes de tri et de transformation, et l’accès aux acheteurs internationaux. L’objectif est double : revaloriser le travail des coopératives et des petits producteurs, et positionner le café congolais sur des segments de marché exigeants.',
            },
            {
              title: 'Périmètre « du champ à la tasse »',
              items: [
                'Sélection variétale, conduite culturale et récolte encadrée',
                'Post-récolte : tri, séchage, contrôle de défauts et préparation export',
                'Logistique, documentation d’export et relations acheteurs',
              ],
            },
            {
              title: 'Nos prestations sur la filière',
              items: [
                'Production de café de qualité',
                'Traitement et transformation',
                'Exportations vers les marchés internationaux',
              ],
            },
            {
              title: 'Qualité et durabilité',
              text: 'Avec Solution Café, nous garantissons un café naturel, authentique et durable, cultivé avec passion et respect de l’environnement.',
            },
            {
              title: 'Notre engagement',
              text: 'Soutenir les producteurs locaux, promouvoir l’agriculture durable et offrir aux consommateurs un café qui reflète la richesse du terroir congolais.',
            },
            {
              title: 'Contact Solution Café',
              text: 'Pour plus d’informations : +243 836 895 855 / 097 747 2158 — geacosarl@gmail.com',
            },
            {
              title: '',
              text: 'GEACO SARL — Cultiver l’avenir, bâtir le durable.',
            },
          ],
        },
      },
    },
    projects: {
      metaTitle: 'Projets & réalisations — GEACO SARL',
      metaDesc: 'Exemples d’interventions et impacts sur les communautés.',
      title: 'Projets & réalisations',
      lead:
        'Cette section présente des typologies d’interventions réalisées ou accompagnées par nos équipes. Les fiches détaillées pourront être enrichies au fil des projets.',
      items: [
        {
          title: 'Aménagement hydro-agricole villageois',
          tag: 'Hydraulique',
          desc: 'Conception de périmètres irrigués, optimisation des réseaux primaires/secondaires et formation des comités d’eau.',
          impact: 'Réduction des pertes d’eau et hausse des rendements sur les cultures de contre-saison.',
        },
        {
          title: 'Route rurale & ouvrages',
          tag: 'Génie civil',
          desc: 'Travaux de terrassement, drainage latéral et protection des talus sur axes agricoles.',
          impact: 'Meilleur accès aux marchés et aux services pour les producteurs.',
        },
        {
          title: 'Appui agronomique de proximité',
          tag: 'Agronomie',
          desc: 'Démonstration de pratiques culturales, gestion intégrée de la fertilité et suivi parcelle.',
          impact: 'Adoption progressive de itinéraires techniques rentables et durables.',
        },
      ],
      note: 'Pour une étude de cas ou un dossier technique, contactez-nous : nous documentons volontiers nos références selon les appels d’offres.',
      impactLabel: 'Impact',
    },
    partnerships: {
      metaTitle: 'Partenariats — GEACO SARL',
      metaDesc: 'Collaborations recherchées avec semenciers, ONG, bailleurs et organisations agricoles.',
      title: 'Partenariats',
      lead:
        'Nous construisons des alliances pour amplifier l’impact : co-financement, mise en œuvre conjointe, transfert de technologies et chaînes de valeur agricoles.',
      typesTitle: 'Profils recherchés',
      types: [
        'Entreprises semencières et fournisseurs d’intrants',
        'Organisations agricoles et coopératives',
        'Bailleurs de fonds et programmes de développement',
        'ONG internationales et agences techniques',
      ],
      activeTitle: 'Partenaires actifs',
      activeLead:
        'Organisations avec lesquelles nous collaborons actuellement ou récemment sur des opérations documentées (liste éditoriale).',
      activeEmpty:
        'Aucun partenaire public pour le moment. Les cartes sont gérées depuis l’espace d’administration (Supabase).',
      partnersScrollHint:
        'Faites défiler horizontalement pour parcourir tous les partenaires publiés (souris, trackpad ou glissement au doigt).',
      formTitle: 'Formulaire partenariat',
      formOrg: 'Organisation représentée ou cadre de soumission',
      formOrgHint:
        'Indiquez le nom de la structure dont vous êtes le représentant (coopérative, ONG, entreprise, bailleur, etc.), ou précisez que vous soumettez cette proposition en tant qu’organisation.',
      formName: 'Nom du contact',
      formEmail: 'Email',
      formMessage: 'Proposition de collaboration',
      formSubmit: 'Envoyer la proposition',
      formValidationError:
        'Veuillez indiquer l’organisation ou le cadre de soumission, le nom du contact, l’email et un message d’au moins 10 caractères.',
    },
    blog: {
      metaTitle: 'Blog — GEACO SARL',
      metaDesc: 'Actualités, retours de terrain et regards sur nos filières et infrastructures.',
      title: 'Blog',
      lead: 'Articles publiés par l’équipe : priorité au terrain, aux projets et aux partenariats.',
      empty:
        'Aucun article pour cette langue pour le moment. Publiez un article depuis l’administration (Supabase) ou revenez plus tard.',
      loading: 'Chargement des articles…',
      readMore: 'Lire la suite',
      backToList: 'Tous les articles',
      shareNav: 'Partager cet article',
      shareTitle: 'Partager',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareLinkedin: 'LinkedIn',
    },
    personnel: {
      metaTitle: 'Personnel — GEACO SARL',
      metaDesc: 'Organisation, compétences et culture projet de l’équipe GEACO.',
      title: 'Personnel',
      lead: 'Une structure agile qui associe bureau d’études, encadrement terrain et pilotage de projets intégrés.',
      intro:
        'GEACO SARL s’appuie sur des profils complémentaires — agronomie, génie civil, hydraulique, logistique et filières agricoles — pour répondre aux appels d’offres, aux bailleurs et aux collectivités, avec une exigence de conformité et de sécurité sur les chantiers.',
      pillarsTitle: 'Faire équipe sur le long terme',
      pillars: [
        'Responsabilisation des chefs de mission et des techniciens terrain',
        'Montée en compétences continue et transfert vers les partenaires locaux',
        'Respect des standards techniques et des délais convenus avec le maître d’ouvrage',
      ],
      staffTitle: 'Équipe : cartes par fonction',
      loadingStaff: 'Chargement de l’équipe…',
      loadError: 'Impossible de charger l’équipe depuis la base',
      sourceDb: 'Équipe affichée depuis la base de données (modifiable dans l’administration).',
      cardLinkEmail: 'Email',
      cardLinkFacebook: 'Facebook',
      cardLinkLinkedin: 'LinkedIn',
      staffGroups: [
        {
          title: 'Direction & associés fondateurs',
          members: [
            {
              name: 'Baraka Musa Eric',
              role: 'Gérant',
              focus: 'Génie civil & infrastructures',
              bio: 'Pilotage des grands chantiers, coordination bureau d’études / exécution, ouvrages routiers, bâtiments et ouvrages hydrauliques.',
            },
            {
              name: 'Naomi Mukobelwa Sifa',
              role: 'Associée',
              focus: 'Agronomie & filières agricoles',
              bio: 'Ingénierie agronomique, sécurité alimentaire, filières végétales et accompagnement des producteurs ; co-pilotage du programme Solution Café.',
            },
          ],
        },
        {
          title: 'Secrétariat général',
          members: [
            {
              name: 'Jacques MASURUKU',
              role: 'Secrétaire général',
              focus: 'Coordination administrative, suivi institutionnel et appui à la direction',
              bio: 'Assure la cohérence des correspondances, le suivi des dossiers internes et externes, la préparation des réunions et le lien avec les partenaires et administrations.',
            },
          ],
        },
      ],
    },
    contact: {
      metaTitle: 'Contact — GEACO SARL',
      metaDesc: 'Siège Goma, agence Butembo, téléphones et email.',
      title: 'Contact',
      lead: 'Écrivez-nous pour un devis, une étude ou une collaboration.',
      formTitle: 'Message général',
      formName: 'Nom complet',
      formEmail: 'Email',
      formPhone: 'Téléphone',
      formSubject: 'Objet',
      formMessage: 'Message',
      formSubmit: 'Envoyer',
      addressesTitle: 'Adresses',
      goma: 'Siège social — Goma',
      butembo: 'Agence — Butembo',
      mapTitle: 'Localisation (Goma)',
      thanksTitle: 'Message bien reçu',
      thanksBody:
        'Nous vous remercions pour votre message. Nous allons l’analyser et vous revenir dans le plus bref délai.',
      thanksClosing: 'Merci,',
      thanksBrand: '— GEACO SARL',
      formValidationError:
        'Veuillez remplir l’objet, le nom complet, l’email, le téléphone (obligatoire) et un message d’au moins 10 caractères.',
      followTitle: 'Suivre GEACO en ligne',
      followLead:
        'Pour augmenter la visibilité de notre entreprise et renforcer la confiance en ligne, suivez la page Facebook de GEACO ASBL et la page LinkedIn du groupe d’études agronomiques et de construction.',
      followFacebook: 'Facebook — GEACO ASBL',
      followLinkedin: 'LinkedIn — GEACO',
    },
    legal: {
      metaTitle: 'Mentions légales — GEACO SARL',
      metaDesc: 'Informations légales issues des statuts (indicatif, mai 2025).',
      title: 'Mentions légales',
      intro:
        'Les informations ci-dessous reprennent des extraits fournis par la société à titre de transparence. Pour tout acte juridique, se référer aux statuts authentiques.',
      company: 'Dénomination',
      companyValue: 'Groupe d’études agronomiques et de construction (GEACO SARL)',
      form: 'Forme juridique',
      formValue: 'Société à responsabilité limitée (SARL)',
      capital: 'Capital social',
      capitalValue: '2.000.000 FC',
      duration: 'Durée de la société',
      durationValue: '99 ans',
      statutes: 'Date des statuts',
      statutesValue: 'Mai 2025',
      objectTitle: 'Objet social (synthèse)',
      objectItems: [
        'Bureau d’études techniques et architecturales : infrastructures de base (bâtiments, routes, ouvrages d’art, WASH, télécommunication, électricité, hydraulique).',
        'Forage mécanique des puits.',
        'Industrie et commerce de matériaux de construction, équipements électriques et informatiques.',
        'Formation professionnelle et renforcement des capacités.',
        'Agronomie & vétérinaire : sécurité alimentaire, productions végétales et animales, protection des plantes, gestion des sols, élevage.',
        'Industrie agricole : produits agricoles et semences.',
      ],
      capitalDetail:
        'Le capital est composé de 100 parts sociales de 20.000 FC chacune, entièrement libérées.',
      associatesTitle: 'Associés fondateurs',
      associates: [
        'Baraka Musa Eric, ingénieur en bâtiment et travaux publics — 50 parts sociales.',
        'Naomi Mukobelwa Sifa, ingénieure en agronomie et vétérinaire — 50 parts sociales.',
      ],
      governanceTitle: 'Gouvernance',
      governanceManager:
        'Monsieur Baraka Musa Eric est désigné comme gérant pour un premier mandat de quatre années, renouvelable. Il détient le pouvoir de direction et engage la société pour tous les actes relevant de l’objet social, avec possibilité de délégation pour la direction technique et commerciale.',
      governanceAg:
        'Les décisions collectives sont prises en assemblée générale. Les modifications des statuts requièrent l’accord d’au moins les trois quarts du capital social.',
      financeTitle: 'Bénéfices et dividendes',
      financeText:
        'Les produits nets de l’exercice, déduction faite des frais généraux et charges, constituent les bénéfices nets. Une réserve légale est constituée à hauteur d’un dixième des bénéfices. Les dividendes sont mis en paiement après approbation des comptes par l’assemblée générale.',
      finalTitle: 'Entrée en vigueur et litiges',
      finalText:
        'Les statuts entrent en vigueur après obtention du numéro de Registre du Commerce et du Crédit Mobilier (RCCM). Toute contestation est d’abord réglée par arbitrage.',
    },
    forms: {
      honeypot: 'Ne pas remplir ce champ',
      privacyNote:
        'En envoyant ce formulaire, vous acceptez que nous utilisions vos coordonnées pour répondre à votre demande. Pas de newsletter sans consentement explicite.',
      storedInSupabase:
        'Votre message est enregistré de façon sécurisée dans notre base (Supabase) : seule l’équipe habilitée peut le consulter.',
      supabaseNotConfigured:
        'Envoi impossible : le site n’a pas reçu les clés Supabase au moment du build. Sur Vercel, ouvrez le projet → Settings → Environment Variables : ajoutez exactement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (mêmes noms que dans .env.example), cochez Production, enregistrez puis Redeploy. En local, placez ces lignes dans le fichier .env à la racine de geaco-sarl (pas seulement dans le chat) et relancez npm run dev.',
      formSending: 'Envoi en cours…',
      formErrorValidation: 'Veuillez remplir correctement tous les champs obligatoires.',
      formErrorSend: 'L’envoi a échoué. Réessayez plus tard ou écrivez-nous directement par email.',
    },
    footer: {
      tagline: 'Agronomie · Génie civil · Hydraulique rurale — RDC',
      contactTitle: 'Contact',
      exploreTitle: 'Navigation',
      expertiseTitle: 'Expertises',
      socialNav: 'Réseaux sociaux GEACO',
      followFacebook: 'Page Facebook GEACO ASBL (nouvel onglet)',
      followLinkedin: 'Page LinkedIn GEACO (nouvel onglet)',
    },
  },
  en: {
    brand: {
      short: 'GEACO SARL',
      long: 'Agronomic studies & construction group',
    },
    header: {
      regionLine: 'Democratic Republic of the Congo · North Kivu',
    },
    nav: {
      home: 'home',
      about: 'about',
      personnel: 'staff',
      services: 'services',
      projects: 'projects',
      blog: 'blog',
      partnerships: 'partnerships',
      contact: 'contact',
      legal: 'legal notice',
      servicesOverview: 'overview',
      aboutOverview: 'overview',
      faq: 'FAQ',
    },
    home: {
      metaTitle: 'GEACO SARL — Agronomy, civil engineering & rural hydraulics',
      metaDesc:
        'Congolese firm: studies, design and delivery of integrated agriculture and construction projects. Goma & Butembo, North Kivu.',
      heroTitle: 'Sustainable solutions for rural and urban territories',
      heroLead:
        'GEACO SARL supports communities in North Kivu and beyond with integrated expertise in agronomy, civil engineering and rural water, grounded in local realities.',
      ctaQuote: 'Request a quote',
      ctaContact: 'Contact us',
      ctaProjects: 'Explore our projects',
      visionTitle: 'Vision',
      visionText:
        'Become a leading actor in Central Africa for sustainable agriculture and rural infrastructure delivery.',
      missionTitle: 'Mission',
      missionItems: [
        'Improve agricultural productivity',
        'Develop rural infrastructure',
        'Promote modern technologies (irrigation, solar energy, etc.)',
      ],
      servicesTitle: 'Core sectors',
      servicesLead:
        'An integrated approach—from diagnostics to implementation—for projects adapted to local contexts.',
      strengthsTitle: 'Why work with us',
      strengths: [
        { title: 'Multidisciplinary team', text: 'Agronomy, civil works, hydraulics and field coaching.' },
        { title: 'Local footprint', text: 'Offices in Goma and Butembo, deep knowledge of North Kivu.' },
        { title: 'Integrated delivery', text: 'Agriculture and construction aligned on the same development pathway.' },
        { title: 'Flexibility & innovation', text: 'Pragmatic, scalable technical solutions.' },
      ],
      partnersTeaserTitle: 'Partnerships',
      partnersTeaser:
        'We seek partnerships with seed companies, farmer organizations, donors and international NGOs.',
      partnersCta: 'Start a partnership',
      breadcrumbParent: 'GEACO SARL',
      breadcrumbCurrent: 'Field expertise',
      expertiseSectionTitle: 'Our expertise',
      expertiseSectionIntro:
        'We mobilise agronomy, civil engineering and rural hydraulics for donors, local authorities and agricultural operators across Central Africa and North Kivu.',
      panelAgKicker: 'Agronomy',
      panelAgLead:
        'Food security, soil and environmental studies, and farmer coaching—from plot to market.',
      panelCivilKicker: 'Civil works',
      panelCivilLead:
        'Roads, buildings, civil structures and basic infrastructure: design and delivery suited to local constraints.',
      panelHydroKicker: 'Hydraulics',
      panelHydroLead:
        'Irrigation, drainage, drilling and water supply—securing water for crops and communities.',
      newsSectionTitle: 'News & projects',
      newsMore: 'View all news',
      newsItems: [
        {
          date: '14 Apr 2026',
          cats: ['News', 'Hydraulics'],
          title: 'Optimising a community irrigated perimeter',
        },
        {
          date: '9 Apr 2026',
          cats: ['News', 'Civil engineering'],
          title: 'Upgrading a priority rural corridor for crop evacuation',
        },
        {
          date: '2 Apr 2026',
          cats: ['News', 'Agronomy'],
          title: 'Field coaching campaign on sustainable crop itineraries',
        },
      ],
      promoEyebrow: 'GEACO essentials',
      promoTitle: 'An integrated company serving territories',
      promoText:
        'Learn about our organisation, operating principles, offices in Goma and Butembo, and commitments to communities and technical partners.',
      promoCta: 'Discover the company',
      statsSectionTitle: 'Key figures',
      stats: [
        { value: '3', label: 'integrated expertise areas' },
        { value: '2', label: 'locations — Goma & Butembo' },
        { value: '99', label: 'years — corporate duration' },
      ],
      ctaBandTitle: 'Build your project with us',
      ctaBandText:
        'Want to contribute to high-impact development works and strengthen field skills? Let’s talk.',
      ctaBandBtn: 'Join us',
    },
    about: {
      metaTitle: 'About — GEACO SARL',
      metaDesc: 'Presentation, values and leadership team.',
      title: 'About GEACO',
      intro:
        'GEACO SARL is a limited liability company registered in the Democratic Republic of the Congo. We design and deliver integrated agriculture and construction projects to strengthen territorial resilience.',
      valuesTitle: 'Values',
      values: [
        'Technical excellence and compliance with applicable standards',
        'Transparency towards stakeholders and communities',
        'Environmental and social sustainability of interventions',
      ],
      teamTitle: 'Shareholders & expertise',
      team: [
        {
          name: 'Baraka Musa Eric',
          role: 'Civil and structural engineer',
          bio: 'Delivery of buildings, roads, hydraulic structures and related infrastructure.',
        },
        {
          name: 'Naomi Mukobelwa Sifa',
          role: 'Agronomist & veterinarian',
          bio: 'Food security, crop and livestock systems, farmer support.',
        },
      ],
      approachTitle: 'Integrated approach',
      approachText:
        'Combining agronomic studies, hydro-agricultural schemes and civil works aligns production, water access and physical connectivity for farms and villages.',
    },
    faq: {
      metaTitle: 'FAQ — GEACO SARL',
      metaDesc:
        'Answers to common questions: areas of work, requesting a quote, timelines, sectors and collaboration with donors and local authorities.',
      title: 'Frequently asked questions',
      lead: 'Useful information before you contact us for a study, works or a partnership.',
      items: [
        {
          q: 'Where does GEACO SARL work?',
          a: 'We are based in Goma and Butembo (North Kivu) and take on projects across the DRC and Central Africa depending on tenders and mandates.',
        },
        {
          q: 'How do I request a quote or a study?',
          a: 'Use the Contact page with a short description of the need, location and desired timeline. We follow up to refine the technical and administrative scope.',
        },
        {
          q: 'What kinds of projects do you deliver?',
          a: 'Studies and works in agronomy and environment, civil engineering (roads, buildings, structures), rural hydraulics (boreholes, water networks), and integrated agricultural value chains (e.g. coffee).',
        },
        {
          q: 'Do you work with donors and NGOs?',
          a: 'Yes: tenders, agreements with international donors, local authorities and agricultural operators are part of our regular work.',
        },
        {
          q: 'What lead times should we expect?',
          a: 'Timelines depend on study complexity, field seasons for agronomy and permitting. We provide a range after reviewing the file.',
        },
        {
          q: 'Do you offer capacity building?',
          a: 'Yes, as part of our assignments: transferring practices to local technicians, farmers and partners.',
        },
      ],
    },
    notFound: {
      metaTitle: 'Page not found — GEACO SARL',
      metaDesc:
        'This URL does not match any page on the site. Return home or browse our main sections.',
      breadcrumb: '404 error',
      title: 'Page not found',
      lead:
        'The address you entered does not match any page on our site. It may have moved or the link may be incomplete.',
      pathLabel: 'Requested path',
      hint: 'Check the spelling of the URL or continue from the shortcuts below.',
      homeCta: 'Back to home',
      contactCta: 'Contact us',
      quickTitle: 'Continue on the site',
      tileServicesTitle: 'Services',
      tileServicesDesc: 'Agronomy, civil engineering, rural hydraulics and value chains.',
      tileProjectsTitle: 'Projects',
      tileProjectsDesc: 'Selected works and field references.',
      tileBlogTitle: 'Blog',
      tileBlogDesc: 'News, articles and field perspectives.',
      tilePartnersTitle: 'Partnerships',
      tilePartnersDesc: 'Explore collaboration with GEACO.',
    },
    services: {
      metaTitle: 'Services — GEACO SARL',
      metaDesc:
        'Agronomy, civil engineering, rural hydraulics, trade and the Solution Café value chain—studies, works and export.',
      title: 'Our services',
      lead:
        'Four complementary areas—agronomy, civil engineering, rural hydraulics and the coffee value chain—for coherent projects from production to export.',
      agronomy: {
        title: 'Agronomy & environment',
        items: [
          'Agronomic studies and soil diagnostics',
          'Environmental studies and impact analysis',
          'Food security, crops and plant protection',
          'Livestock, animal health and grazing management',
          'Supply of inputs and quality seed',
          'Technical coaching for farmers and cooperatives',
        ],
      },
      civil: {
        title: 'Civil engineering & infrastructure',
        items: [
          'Rural roads and civil structures',
          'Public, school and community buildings',
          'Hydraulic works and associated structures',
          'WASH, telecom and power infrastructure (studies & support)',
          'Technical and architectural design office',
        ],
      },
      hydro: {
        title: 'Rural hydraulics',
        items: [
          'Hydro-agricultural development: irrigation and drainage',
          'Mechanical well drilling and intakes',
          'Water supply, storage and distribution',
          'Solar integration for pumping and small-scale energy',
        ],
      },
      commerce: {
        title: 'Trade & capacity building',
        text:
          'Import and sale of construction materials, electrical and IT equipment; agricultural products; vocational training and skills transfer.',
      },
      solutionCafe: {
        navTitle: 'solution coffee',
      },
      hub: {
        backToHub: 'All services',
        contactCta: 'Contact us',
        chooseTitle: 'Choose a service line',
        chooseLead: 'Open a detailed page for each expertise or the Solution Café programme.',
        cardCta: 'View details',
      },
      detail: {
        agronomie: {
          metaTitle: 'Agronomy & environment — GEACO SARL',
          metaDesc:
            'Agronomic studies, food security, livestock, inputs and farmer support in North Kivu and the DRC.',
          title: 'Agronomy & environment',
          heroImage:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80',
          intro:
            'We support farms and institutions with science-based field work: soil diagnostics, crop and livestock systems, environmental protection and capacity building.',
          sections: [
            {
              title: 'Studies and diagnostics',
              items: [
                'Agronomic studies and soil diagnostics',
                'Environmental studies and impact assessments',
                'Mapping of agricultural risks and opportunities',
              ],
            },
            {
              title: 'Production and value chains',
              items: [
                'Food security, crops and plant protection',
                'Livestock, animal health and grazing management',
                'Supply of quality inputs and seed',
              ],
            },
            {
              title: 'Field support',
              text: 'Technical coaching for farmers and cooperatives, demonstration plots and monitoring of crop itineraries.',
            },
          ],
        },
        civil: {
          metaTitle: 'Civil engineering & infrastructure — GEACO SARL',
          metaDesc:
            'Roads, buildings, civil structures, WASH, studies and supervision for basic infrastructure in the DRC.',
          title: 'Civil engineering & infrastructure',
          heroImage:
            'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80',
          intro:
            'From design office to works delivery, we engineer and build structures suited to local constraints, with sound durability and controlled cost.',
          sections: [
            {
              title: 'Transport and engineering structures',
              items: [
                'Earth and paved roads, civil structures (bridges, culverts)',
                'Public, school and community buildings',
                'Control and delivery of building and civil engineering works',
              ],
            },
            {
              title: 'Water, energy and telecoms',
              items: [
                'Water and sanitation (WASH) projects',
                'Power and hydraulics projects',
                'Information and communication technology development',
              ],
            },
            {
              title: 'Design office',
              text: 'Architectural and technical design, owner’s engineer support and site coordination.',
            },
          ],
        },
        hydro: {
          metaTitle: 'Rural hydraulics — GEACO SARL',
          metaDesc:
            'Irrigation, drainage, mechanical drilling, water supply and solar integration to secure rural water.',
          title: 'Rural hydraulics',
          heroImage:
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1800&q=80',
          intro:
            'Water is central to agricultural territories. We design and build works for irrigation, livestock watering and community supply.',
          sections: [
            {
              title: 'Hydro-agricultural development',
              items: [
                'Perimeter irrigation and drainage',
                'Primary and secondary networks, storage',
                'Solar integration for pumping and small-scale energy',
              ],
            },
            {
              title: 'Abstraction and distribution',
              items: ['Mechanical well drilling', 'Water supply, intakes and potable distribution'],
            },
          ],
        },
        solutionCafe: {
          metaTitle: 'Solution Café — GEACO SARL',
          metaDesc:
            'Coffee value chain from field to export: production, processing and international markets for Congolese coffee.',
          title: 'Solution Café',
          heroImage:
            'https://images.unsplash.com/photo-1447933601408-4c668d815b56?auto=format&fit=crop&w=1800&q=80',
          intro:
            'GEACO SARL presents Solution Café, a full value chain programme that promotes Congolese coffee from production through export.',
          sections: [
            {
              title: 'What we deliver on the chain',
              items: [
                'Quality coffee production',
                'Processing and transformation',
                'Exports to international markets',
              ],
            },
            {
              title: 'Quality and sustainability',
              text: 'With Solution Café we commit to natural, authentic and sustainable coffee, grown with care and respect for the environment.',
            },
            {
              title: 'Our commitment',
              text: 'Support local growers, promote sustainable agriculture and offer consumers coffee that reflects the richness of Congolese terroir.',
            },
            {
              title: 'Solution Café contact',
              text: 'For more information: +243 836 895 855 / 097 747 2158 — geacosarl@gmail.com',
            },
            {
              title: '',
              text: 'GEACO SARL — Cultivate the future, build for sustainability.',
            },
          ],
        },
      },
    },
    projects: {
      metaTitle: 'Projects — GEACO SARL',
      metaDesc: 'Sample interventions and community impact.',
      title: 'Projects & references',
      lead:
        'Illustrative types of assignments delivered or supported by our teams. Detailed case studies can be added over time.',
      items: [
        {
          title: 'Village hydro-agricultural scheme',
          tag: 'Hydraulics',
          desc: 'Irrigated perimeter design, primary/secondary network optimization and water committee training.',
          impact: 'Lower water losses and higher yields for off-season crops.',
        },
        {
          title: 'Rural road & structures',
          tag: 'Civil works',
          desc: 'Earthworks, side drainage and slope protection on agricultural corridors.',
          impact: 'Improved access to markets and services for producers.',
        },
        {
          title: 'Field agronomic support',
          tag: 'Agronomy',
          desc: 'Crop practice demonstrations, integrated soil fertility management and plot monitoring.',
          impact: 'Progressive adoption of profitable, sustainable crop itineraries.',
        },
      ],
      note: 'For detailed references tailored to tenders, contact us—we document assignments as required.',
      impactLabel: 'Impact',
    },
    partnerships: {
      metaTitle: 'Partnerships — GEACO SARL',
      metaDesc: 'Collaboration with seed companies, NGOs, donors and farmer organizations.',
      title: 'Partnerships',
      lead:
        'We build alliances to scale impact: co-financing, joint implementation, technology transfer and agricultural value chains.',
      typesTitle: 'Profiles we look for',
      types: [
        'Seed companies and input suppliers',
        'Farmer organizations and cooperatives',
        'Donors and development programmes',
        'International NGOs and technical agencies',
      ],
      activeTitle: 'Active partners',
      activeLead:
        'Organisations we currently work with—or have recently worked with—on documented operations (editorial list).',
      activeEmpty:
        'No public partners yet. Cards are managed from the admin area (Supabase).',
      partnersScrollHint:
        'Scroll horizontally to browse all published partners (mouse, trackpad or swipe).',
      formTitle: 'Partnership form',
      formOrg: 'Represented organization or submission context',
      formOrgHint:
        'Enter the name of the organization you represent (cooperative, NGO, company, donor, etc.), or state clearly that you are submitting this proposal on behalf of an organization.',
      formName: 'Contact name',
      formEmail: 'Email',
      formMessage: 'Collaboration proposal',
      formSubmit: 'Send proposal',
      formValidationError:
        'Please provide the organization or submission context, contact name, email and a message of at least 10 characters.',
    },
    blog: {
      metaTitle: 'Blog — GEACO SARL',
      metaDesc: 'News, field insights and perspectives on our value chains and infrastructure work.',
      title: 'Blog',
      lead: 'Articles from our team—field operations, projects and partnerships first.',
      empty:
        'No articles in this language yet. Publish from the admin panel (Supabase) or check back later.',
      loading: 'Loading articles…',
      readMore: 'Read more',
      backToList: 'All articles',
      shareNav: 'Share this article',
      shareTitle: 'Share',
      shareWhatsapp: 'WhatsApp',
      shareFacebook: 'Facebook',
      shareLinkedin: 'LinkedIn',
    },
    personnel: {
      metaTitle: 'People & organisation — GEACO SARL',
      metaDesc: 'Team skills, roles and how we deliver integrated projects.',
      title: 'Staff',
      lead: 'Complementary profiles combining design office, field supervision and integrated project management.',
      intro:
        'GEACO SARL brings together agronomy, civil engineering, hydraulics, logistics and agricultural value chains to serve tenders, donors and local authorities, with strong compliance and site safety requirements.',
      pillarsTitle: 'How we work together',
      pillars: [
        'Clear ownership for project managers and field technicians',
        'Continuous upskilling and knowledge transfer to local partners',
        'Adherence to technical standards and agreed timelines with clients',
      ],
      staffTitle: 'Team: role-based cards',
      loadingStaff: 'Loading team…',
      loadError: 'Could not load the team from the database',
      sourceDb: 'Team loaded from the database (editable in the admin panel).',
      cardLinkEmail: 'Email',
      cardLinkFacebook: 'Facebook',
      cardLinkLinkedin: 'LinkedIn',
      staffGroups: [
        {
          title: 'Leadership & founding shareholders',
          members: [
            {
              name: 'Baraka Musa Eric',
              role: 'Managing director',
              focus: 'Civil engineering & infrastructure',
              bio: 'Delivery of major works, design-to-site coordination, roads, buildings and hydraulic structures.',
            },
            {
              name: 'Naomi Mukobelwa Sifa',
              role: 'Shareholder',
              focus: 'Agronomy & agricultural value chains',
              bio: 'Agronomic engineering, food security, crop systems and farmer support; co-leads the Solution Café programme.',
            },
          ],
        },
        {
          title: 'General secretariat',
          members: [
            {
              name: 'Jacques MASURUKU',
              role: 'Secretary general',
              focus: 'Administrative coordination, institutional liaison and executive support',
              bio: 'Ensures correspondence, internal and external case tracking, meeting preparation, and liaison with partners and authorities.',
            },
          ],
        },
      ],
    },
    contact: {
      metaTitle: 'Contact — GEACO SARL',
      metaDesc: 'Goma headquarters, Butembo office, phones and email.',
      title: 'Contact',
      lead: 'Reach out for a quote, a study or a collaboration.',
      formTitle: 'General message',
      formName: 'Full name',
      formEmail: 'Email',
      formPhone: 'Phone',
      formSubject: 'Subject',
      formMessage: 'Message',
      formSubmit: 'Send',
      addressesTitle: 'Addresses',
      goma: 'Head office — Goma',
      butembo: 'Branch — Butembo',
      mapTitle: 'Map (Goma)',
      thanksTitle: 'Message received',
      thanksBody:
        'Thank you for your message. We will review it carefully and get back to you as soon as possible.',
      thanksClosing: 'Thank you,',
      thanksBrand: '— GEACO SARL',
      formValidationError:
        'Please fill in subject, full name, email, phone (required) and a message of at least 10 characters.',
      followTitle: 'Follow GEACO online',
      followLead:
        'To strengthen visibility and trust, follow the official GEACO ASBL Facebook page and the LinkedIn page of the agronomic studies and construction group.',
      followFacebook: 'Facebook — GEACO ASBL',
      followLinkedin: 'LinkedIn — GEACO',
    },
    legal: {
      metaTitle: 'Legal notice — GEACO SARL',
      metaDesc: 'Legal information from corporate statutes (May 2025, indicative).',
      title: 'Legal notice',
      intro:
        'The information below summarises extracts provided by the company for transparency. For any legal act, refer to the authenticated statutes.',
      company: 'Company name',
      companyValue: 'Groupe d’études agronomiques et de construction (GEACO SARL)',
      form: 'Legal form',
      formValue: 'Private limited company (SARL)',
      capital: 'Share capital',
      capitalValue: '2,000,000 CDF',
      duration: 'Company duration',
      durationValue: '99 years',
      statutes: 'Statutes date',
      statutesValue: 'May 2025',
      objectTitle: 'Corporate purpose (summary)',
      objectItems: [
        'Technical and architectural design office: basic infrastructure (buildings, roads, structures, WASH, telecom, power, hydraulics).',
        'Mechanical well drilling.',
        'Trading of construction materials, electrical and IT equipment.',
        'Vocational training and capacity building.',
        'Agronomy & veterinary: food security, crop and livestock production, plant protection, soil management, animal husbandry.',
        'Agricultural industry: agricultural products and seeds.',
      ],
      capitalDetail:
        'Share capital consists of 100 shares of 20,000 CDF each, fully paid up.',
      associatesTitle: 'Founding shareholders',
      associates: [
        'Baraka Musa Eric, civil engineer — 50 shares.',
        'Naomi Mukobelwa Sifa, agronomist and veterinarian — 50 shares.',
      ],
      governanceTitle: 'Governance',
      governanceManager:
        'Mr Baraka Musa Eric is appointed manager for an initial four-year renewable term. He holds executive authority and binds the company for all acts within the corporate purpose, with the option to delegate technical and commercial management.',
      governanceAg:
        'Collective decisions are taken in general meeting. By-law amendments require approval of at least three quarters of the share capital.',
      financeTitle: 'Profits and dividends',
      financeText:
        'Net income for the year, after general expenses and charges, constitutes net profit. A legal reserve is built up to one tenth of profits. Dividends are paid after accounts are approved by the general meeting.',
      finalTitle: 'Entry into force and disputes',
      finalText:
        'The statutes take effect after obtaining the RCCM registration number. Any dispute shall first be settled by arbitration.',
    },
    forms: {
      honeypot: 'Leave this field empty',
      privacyNote:
        'By submitting this form you agree that we use your details to answer your request. No newsletter without explicit consent.',
      storedInSupabase:
        'Your message is stored securely in our database (Supabase); only authorised staff can read it.',
      supabaseNotConfigured:
        'Cannot send: Supabase keys were not available at build time. On Vercel: Project → Settings → Environment Variables — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (exact names, Production), save, then Redeploy. Locally: put them in .env at the project root and restart npm run dev.',
      formSending: 'Sending…',
      formErrorValidation: 'Please fill in all required fields.',
      formErrorSend: 'Sending failed. Please try again later or email us directly.',
    },
    footer: {
      tagline: 'Agronomy · Civil engineering · Rural hydraulics — DRC',
      contactTitle: 'Contact',
      exploreTitle: 'Explore',
      expertiseTitle: 'Expertise',
      socialNav: 'GEACO on social media',
      followFacebook: 'GEACO ASBL Facebook page (opens in new tab)',
      followLinkedin: 'GEACO LinkedIn page (opens in new tab)',
    },
  },
}
