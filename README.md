# 3M DISTRIBUTION — Site corporate

Site vitrine premium pour **3M DISTRIBUTION**, entreprise spécialisée dans la distribution alimentaire, l’approvisionnement et la commercialisation de produits alimentaires.

Le site est développé exclusivement en **HTML5, CSS3 et JavaScript Vanilla**, sans framework ni dépendance de production.

---

## 1. Aperçu

- Design éditorial premium : vert profond, blanc cassé, beige et accent doré.
- Typographies : **Manrope** (titres), **Inter** (textes), **Playfair Display** (accents).
- Sections : accueil, entreprise, produits, services, équipe, raisons de nous choisir, contact.
- Catalogue filtrable et facilement extensible.
- Menu mobile plein écran accessible.
- Animations discrètes au scroll, respect de `prefers-reduced-motion`.
- Formulaire de contact validé côté client, prêt à être connecté à un backend.
- Bouton WhatsApp affiché uniquement lorsqu’un numéro est configuré.
- SEO : balises meta, Open Graph, données structurées, images avec textes alternatifs.

---

## 2. Structure du projet

```text
3M_DISTRIBUTION/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/          # Photos et variantes responsives
│   └── logo/            # Logo, favicon et icône Apple
├── README.md
├── robots.txt
└── sitemap.xml
```

---

## 3. Lancer le site en local

### Option simple

Ouvrir `index.html` dans un navigateur.

### Option recommandée (serveur local)

Depuis le dossier du projet :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

Avec VS Code, l’extension **Live Server** fonctionne également.

---

## 4. Personnalisation

### 4.1 Coordonnées de l’entreprise

Les coordonnées sont centralisées dans `js/script.js`, dans l’objet `SITE_CONFIG` :

```js
const SITE_CONFIG = {
  phone: "+00 00 00 00 00",
  phoneHref: "tel:+000000000000",
  email: "contact@3mdistribution.com",
  address: "Votre adresse — Ville, Pays",
  hours: "Lun – Sam · 8h – 18h",
  whatsappNumber: "",
  whatsappMessage: "Bonjour 3M DISTRIBUTION, ..."
};
```

- `phone` : numéro affiché.
- `phoneHref` : lien téléphonique, au format `tel:+indicatif...`.
- `email` : adresse e-mail.
- `address` : adresse postale.
- `hours` : horaires.
- `whatsappNumber` : numéro international **sans `+`, sans espaces** (ex. `2250700000000`). Laisser vide pour masquer le bouton WhatsApp.
- `whatsappMessage` : message pré-rempli dans WhatsApp.

Pour que les coordonnées restent visibles même si JavaScript est désactivé, mettre également à jour les valeurs de secours dans `index.html` (attributs `data-contact` et `data-contact-link`).

### 4.2 Équipe

Dans `index.html`, section `#equipe` :

- Les noms affichés sont `Mamadou Touré`, `Mouhamadou Moustapha Touré` et `Mamadou THIAM`.
- Remplacer les descriptions et les périmètres (`profile__scope`) si nécessaire.
- Les portraits sont des icônes de profil par défaut (`.profile__avatar` en SVG). Pour utiliser de vraies photos, remplacer chaque `<svg class="profile__avatar">` par un `<img>` avec `alt` décrivant la personne.

### 4.3 Produits

Chaque catégorie est un bloc `<article class="product-card">` dans la section `#produits`.

Pour ajouter une catégorie :

1. Dupliquer un bloc `<article class="product-card">`.
2. Modifier `data-group` (`dry`, `fresh`, `drinks` ou une nouvelle valeur).
3. Modifier le numéro, le titre, la description, le texte alternatif et l’image.
4. Ajouter un bouton de filtre correspondant dans `.filters` si nécessaire.

Les filtres sont gérés automatiquement par `initProductFilters()` dans `js/script.js`.

### 4.4 Images

Les images de démonstration proviennent d’**Unsplash** et sont incluses localement dans `assets/images/`.

Chaque visuel dispose de variantes responsives :

- `image.jpg` : version principale ;
- `image-800.jpg`, `image-600.jpg`, etc. : variantes utilisées dans `srcset`.

Pour remplacer une image :

1. Déposer la nouvelle image dans `assets/images/`.
2. Conserver le même nom de fichier, ou adapter `src` et `srcset` dans `index.html`.
3. Vérifier les dimensions indiquées dans les attributs `width` / `height`.
4. Mettre à jour le texte alternatif.

**Important :** les photos d’équipe sont des portraits de démonstration. Elles doivent être remplacées par les photos réelles des collaborateurs avant la mise en ligne. Les visuels produits et logistiques doivent également être remplacés par les photos de l’entreprise pour une communication authentique.

### 4.5 Couleurs et typographies

Les variables sont définies en haut de `css/style.css` :

```css
:root {
  --green-900: #123D2B;
  --green-700: #26734D;
  --cream: #F8F8F3;
  --sand: #E9E3D5;
  --ink: #171C19;
  --gold: #C5A46D;
  /* ... */
}
```

Modifier ces variables permet d’ajuster l’identité visuelle de façon globale.

---

## 5. Formulaire de contact et backend

Le formulaire est validé côté client (champs requis, format e-mail, téléphone, consentement) et affiche actuellement une confirmation locale après soumission.

Le point d’intégration backend est commenté dans `js/script.js`, fonction `initContactForm()`. Remplacer la temporisation par un appel `fetch` vers votre API :

```js
fetch("/api/contact", {
  method: "POST",
  headers: { Accept: "application/json" },
  body: new FormData(form)
})
```

Points de vigilance pour la mise en production :

- Valider et assainir les données côté serveur.
- Mettre en place une protection anti-spam (honeypot déjà présent, CAPTCHA ou limitation de débit si nécessaire).
- Ne jamais exposer de clés secrètes dans le JavaScript front-end.
- Configurer l’envoi d’e-mail ou l’enregistrement en base côté serveur.
- Ajouter une politique de confidentialité si des données personnelles sont conservées.

---

## 6. SEO et mise en ligne

Avant publication :

1. Remplacer `https://www.3mdistribution.com/` par le domaine réel dans :
   - la balise `canonical` ;
   - les balises Open Graph / Twitter ;
   - le JSON-LD ;
   - `sitemap.xml` et `robots.txt`.
2. Remplacer `assets/images/og-image.jpg` par un visuel de partage définitif.
3. Vérifier le titre et la meta description.
4. Renseigner les coordonnées réelles et, si disponible, l’adresse postale dans les données structurées.
5. Tester le site sur mobile, tablette et desktop.
6. Vérifier les performances avec Lighthouse ou PageSpeed Insights.
7. Configurer HTTPS et la redirection HTTP → HTTPS.

Le site utilise :

- une structure sémantique (`header`, `main`, `section`, `footer`) ;
- un seul `h1` par page ;
- des textes alternatifs descriptifs ;
- un chargement différé des images sous la ligne de flottaison ;
- un préchargement de l’image héro ;
- des variantes d’images responsives ;
- des polices avec `display=swap`.

---

## 7. Accessibilité

- Lien d’évitement « Aller au contenu principal ».
- Navigation clavier et styles de focus visibles.
- Menu mobile avec gestion de `aria-expanded`, attribut `inert`, fermeture par `Échap` et piège de focus.
- Formulaire avec labels, messages d’erreur et `aria-live`.
- Animations désactivées si `prefers-reduced-motion` est activé.
- Contrastes vérifiés sur les principaux textes.

---

## 8. Compatibilité

Navigateurs modernes : Chrome, Edge, Firefox, Safari (versions récentes).

Le site utilise `IntersectionObserver`, les variables CSS, `aspect-ratio`, `clamp()` et `100svh`. Des comportements de repli simples sont prévus pour le JavaScript désactivé : contenu visible, navigation accessible (le menu mobile est remplacé par une navigation repliée dans l’en-tête) et message d’aide à la place du formulaire fonctionnel.

---

## 9. Crédits

- Photos de démonstration : [Unsplash](https://unsplash.com) — licence Unsplash.
- Typographies : [Google Fonts](https://fonts.google.com) — Manrope, Inter, Playfair Display.
- Icônes : SVG inline, aucune bibliothèque externe.

Les visuels et portraits sont des placeholders destinés à être remplacés par les contenus officiels de 3M DISTRIBUTION.
