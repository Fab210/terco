// Prières et mystères du Rosaire en français
const PRAYERS = {
  signe: {
    name: "Signe de la Croix",
    body: "Au nom du Père, et du Fils, et du Saint-Esprit. Amen."
  },
  credo: {
    name: "Symbole des Apôtres (Je crois en Dieu)",
    body: "Je crois en Dieu, le Père tout-puissant, créateur du ciel et de la terre ; et en Jésus-Christ, son Fils unique, notre Seigneur, qui a été conçu du Saint-Esprit, est né de la Vierge Marie, a souffert sous Ponce Pilate, a été crucifié, est mort et a été enseveli, est descendu aux enfers, le troisième jour est ressuscité des morts, est monté aux cieux, est assis à la droite de Dieu le Père tout-puissant, d'où il viendra juger les vivants et les morts. Je crois en l'Esprit Saint, à la sainte Église catholique, à la communion des saints, à la rémission des péchés, à la résurrection de la chair, à la vie éternelle. Amen."
  },
  pater: {
    name: "Notre Père",
    body: "Notre Père, qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi à ceux qui nous ont offensés. Et ne nous laisse pas entrer en tentation, mais délivre-nous du Mal. Amen."
  },
  ave: {
    name: "Je vous salue Marie",
    body: "Je vous salue, Marie, pleine de grâce ; le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni. Sainte Marie, Mère de Dieu, priez pour nous, pauvres pécheurs, maintenant et à l'heure de notre mort. Amen."
  },
  gloria: {
    name: "Gloire au Père",
    body: "Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, pour les siècles des siècles. Amen."
  },
  fatima: {
    name: "Prière de Fatima",
    body: "Ô mon Jésus, pardonnez-nous nos péchés, préservez-nous du feu de l'enfer, conduisez au ciel toutes les âmes, surtout celles qui ont le plus besoin de votre miséricorde."
  },
  salveRegina: {
    name: "Salve Regina (Je vous salue, Reine)",
    body: "Salut, ô Reine, Mère de miséricorde, notre vie, notre douceur, notre espérance, salut ! Enfants d'Ève, exilés, nous crions vers vous ; vers vous nous soupirons, gémissant et pleurant dans cette vallée de larmes. Ô vous, notre avocate, tournez vers nous vos regards miséricordieux, et après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles. Ô clémente, ô miséricordieuse, ô douce Vierge Marie. Amen."
  }
};

// Foi, Espérance, Charité — trois Ave introductifs
const INITIAL_AVE_INTENTIONS = [
  "Pour la Foi",
  "Pour l'Espérance",
  "Pour la Charité"
];

const MYSTERY_SETS = {
  joyeux: {
    id: "joyeux",
    name: "Mystères Joyeux",
    days: ["Lundi", "Samedi"],
    color: "#e8d4b4",
    accent: "#b88746",
    icon: "✨",
    mysteries: [
      {
        title: "L'Annonciation",
        fruit: "Fruit du mystère : l'humilité",
        text: "L'ange Gabriel annonce à Marie qu'elle sera la Mère du Sauveur. Marie répond : « Je suis la servante du Seigneur ; qu'il me soit fait selon ta parole. » (Lc 1, 38)"
      },
      {
        title: "La Visitation",
        fruit: "Fruit du mystère : la charité fraternelle",
        text: "Marie se rend en hâte chez sa cousine Élisabeth. Au son de sa salutation, l'enfant tressaille de joie dans le sein d'Élisabeth, qui s'écrie : « Tu es bénie entre toutes les femmes. » (Lc 1, 42)"
      },
      {
        title: "La Nativité",
        fruit: "Fruit du mystère : l'esprit de pauvreté, le détachement",
        text: "Jésus naît à Bethléem dans une étable. Les anges chantent : « Gloire à Dieu au plus haut des cieux et paix sur la terre aux hommes qu'il aime. » (Lc 2, 14)"
      },
      {
        title: "La Présentation au Temple",
        fruit: "Fruit du mystère : l'obéissance, la pureté",
        text: "Marie et Joseph présentent Jésus au Temple. Le vieillard Siméon le reconnaît comme « la lumière qui se révèle aux nations ». (Lc 2, 32)"
      },
      {
        title: "Le Recouvrement de Jésus au Temple",
        fruit: "Fruit du mystère : la recherche de Dieu en toutes choses",
        text: "Après trois jours de recherche, Marie et Joseph retrouvent Jésus au Temple. Il leur dit : « Ne saviez-vous pas qu'il me faut être chez mon Père ? » (Lc 2, 49)"
      }
    ]
  },
  lumineux: {
    id: "lumineux",
    name: "Mystères Lumineux",
    days: ["Jeudi"],
    color: "#cfe3f0",
    accent: "#3d7ea6",
    icon: "☀",
    mysteries: [
      {
        title: "Le Baptême de Jésus",
        fruit: "Fruit du mystère : l'ouverture à l'Esprit Saint",
        text: "Jésus est baptisé dans le Jourdain. Une voix venue des cieux dit : « Celui-ci est mon Fils bien-aimé, en qui j'ai mis tout mon amour. » (Mt 3, 17)"
      },
      {
        title: "Les Noces de Cana",
        fruit: "Fruit du mystère : la confiance en Marie",
        text: "À la prière de sa Mère, Jésus accomplit son premier miracle en changeant l'eau en vin. Marie nous dit : « Faites tout ce qu'il vous dira. » (Jn 2, 5)"
      },
      {
        title: "L'Annonce du Royaume",
        fruit: "Fruit du mystère : la conversion du cœur",
        text: "Jésus proclame : « Le temps est accompli, et le Royaume de Dieu est tout proche. Convertissez-vous et croyez à la Bonne Nouvelle. » (Mc 1, 15)"
      },
      {
        title: "La Transfiguration",
        fruit: "Fruit du mystère : le désir de la sainteté",
        text: "Sur le mont Thabor, Jésus se transfigure devant Pierre, Jacques et Jean. Son visage resplendit comme le soleil. (Mt 17, 2)"
      },
      {
        title: "L'Institution de l'Eucharistie",
        fruit: "Fruit du mystère : l'amour eucharistique",
        text: "À la dernière Cène, Jésus prend le pain et dit : « Ceci est mon corps livré pour vous. Faites cela en mémoire de moi. » (Lc 22, 19)"
      }
    ]
  },
  douloureux: {
    id: "douloureux",
    name: "Mystères Douloureux",
    days: ["Mardi", "Vendredi"],
    color: "#e0c8c8",
    accent: "#8b3a3a",
    icon: "✝",
    mysteries: [
      {
        title: "L'Agonie de Jésus au Jardin des Oliviers",
        fruit: "Fruit du mystère : la contrition de nos péchés",
        text: "Au jardin de Gethsémani, Jésus prie : « Mon Père, s'il est possible, que cette coupe passe loin de moi ! Cependant, non pas comme je veux, mais comme tu veux. » (Mt 26, 39)"
      },
      {
        title: "La Flagellation",
        fruit: "Fruit du mystère : la mortification des sens",
        text: "Jésus est lié à la colonne et flagellé par ordre de Pilate. « Par ses blessures, nous sommes guéris. » (Is 53, 5)"
      },
      {
        title: "Le Couronnement d'épines",
        fruit: "Fruit du mystère : l'humilité du cœur",
        text: "Les soldats tressent une couronne d'épines et la posent sur la tête de Jésus en se moquant : « Salut, roi des Juifs ! » (Mt 27, 29)"
      },
      {
        title: "Le Portement de la Croix",
        fruit: "Fruit du mystère : la patience dans les épreuves",
        text: "Jésus porte sa croix vers le Calvaire. Il dit : « Si quelqu'un veut venir à ma suite, qu'il prenne sa croix et qu'il me suive. » (Mt 16, 24)"
      },
      {
        title: "La Crucifixion et la mort de Jésus",
        fruit: "Fruit du mystère : l'amour de Dieu et le salut des âmes",
        text: "Jésus meurt sur la croix pour nous sauver. Avant d'expirer, il dit : « Père, entre tes mains je remets mon esprit. » (Lc 23, 46)"
      }
    ]
  },
  glorieux: {
    id: "glorieux",
    name: "Mystères Glorieux",
    days: ["Mercredi", "Dimanche"],
    color: "#e8dcc4",
    accent: "#b58a2c",
    icon: "✠",
    mysteries: [
      {
        title: "La Résurrection",
        fruit: "Fruit du mystère : la foi",
        text: "Le troisième jour, Jésus ressuscite des morts. L'ange dit aux femmes : « Pourquoi cherchez-vous le Vivant parmi les morts ? Il n'est pas ici, il est ressuscité. » (Lc 24, 5-6)"
      },
      {
        title: "L'Ascension",
        fruit: "Fruit du mystère : l'espérance et le désir du Ciel",
        text: "Jésus monte au Ciel sous les yeux de ses disciples. « Et moi, je suis avec vous tous les jours, jusqu'à la fin du monde. » (Mt 28, 20)"
      },
      {
        title: "La Pentecôte",
        fruit: "Fruit du mystère : la docilité à l'Esprit Saint",
        text: "L'Esprit Saint descend sur Marie et les Apôtres réunis au Cénacle, sous la forme de langues de feu. (Ac 2, 3-4)"
      },
      {
        title: "L'Assomption de Marie",
        fruit: "Fruit du mystère : la grâce d'une bonne mort",
        text: "La Vierge Marie est élevée au Ciel, corps et âme, pour partager la gloire de son Fils."
      },
      {
        title: "Le Couronnement de Marie",
        fruit: "Fruit du mystère : la persévérance et la confiance en Marie",
        text: "Marie est couronnée Reine du Ciel et de la terre. « Un signe grandiose apparut dans le ciel : une Femme, ayant le soleil pour manteau, la lune sous les pieds, et sur la tête une couronne de douze étoiles. » (Ap 12, 1)"
      }
    ]
  }
};

// Choix automatique selon le jour de la semaine
function getSuggestedSet() {
  const day = new Date().getDay(); // 0=Dim, 1=Lun, ..., 6=Sam
  switch (day) {
    case 1: return MYSTERY_SETS.joyeux;       // Lundi
    case 2: return MYSTERY_SETS.douloureux;   // Mardi
    case 3: return MYSTERY_SETS.glorieux;     // Mercredi
    case 4: return MYSTERY_SETS.lumineux;     // Jeudi
    case 5: return MYSTERY_SETS.douloureux;   // Vendredi
    case 6: return MYSTERY_SETS.joyeux;       // Samedi
    case 0: return MYSTERY_SETS.glorieux;     // Dimanche
  }
}

function getDayName() {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[new Date().getDay()];
}
