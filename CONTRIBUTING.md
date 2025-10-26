# Guide de contribution

Merci de votre intérêt pour contribuer au serveur MCP Apple iCalendar ! Ce document vous guidera à travers le processus de contribution.

## Comment contribuer

Il existe plusieurs façons de contribuer à ce projet :

1. **Signaler des bugs** - Ouvrez une issue détaillée
2. **Proposer des améliorations** - Suggérez de nouvelles fonctionnalités
3. **Améliorer la documentation** - Corrigez ou étendez la documentation
4. **Soumettre du code** - Proposez des pull requests

## Signaler un bug

Lorsque vous signalez un bug, incluez :

- **Description claire** du problème
- **Étapes pour reproduire** le bug
- **Comportement attendu** vs comportement observé
- **Environnement** :
  - Version de macOS
  - Version de Node.js
  - Version du serveur MCP
- **Logs d'erreur** complets
- **Captures d'écran** si applicable

## Proposer une nouvelle fonctionnalité

Avant de proposer une fonctionnalité :

1. Vérifiez qu'elle n'existe pas déjà
2. Vérifiez qu'elle n'est pas déjà proposée dans les issues
3. Assurez-vous qu'elle correspond à l'objectif du projet

Dans votre proposition, incluez :

- **Description** de la fonctionnalité
- **Cas d'usage** concrets
- **API proposée** (si applicable)
- **Exemples d'utilisation**

## Processus de développement

### 1. Fork et clone

```bash
# Fork le projet sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/apple-icalendar-mcp.git
cd apple-icalendar-mcp
```

### 2. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Développer

Suivez ces principes :

- **Code propre** : Suivez les conventions TypeScript
- **Types stricts** : Utilisez TypeScript correctement
- **Commentaires** : Documentez le code complexe
- **Commits atomiques** : Un commit = une modification logique

### 5. Tester

```bash
# Compiler
npm run build

# Tester manuellement avec Claude Code
# Suivez le guide TESTING.md
```

### 6. Commit

Utilisez des messages de commit clairs :

```
feat: Ajoute support des événements récurrents
fix: Corrige le parsing des dates avec timezone
docs: Met à jour les exemples d'utilisation
refactor: Simplifie la gestion des erreurs AppleScript
```

Format des commits :

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, point-virgules manquants, etc.
- `refactor:` - Refactoring du code
- `test:` - Ajout de tests
- `chore:` - Maintenance, dépendances, etc.

### 7. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Créez une Pull Request sur GitHub avec :

- **Titre clair** décrivant le changement
- **Description détaillée** :
  - Quel problème résout-elle ?
  - Comment l'avez-vous testé ?
  - Captures d'écran si applicable
- **Lien vers l'issue** (si applicable)

## Standards de code

### TypeScript

```typescript
// ✅ BON
function createEvent(
  calendarName: string,
  summary: string,
  startDate: string,
  endDate: string
): string {
  // Implementation
}

// ❌ MAUVAIS
function createEvent(calendarName, summary, startDate, endDate) {
  // Implementation
}
```

### Gestion d'erreurs

```typescript
// ✅ BON
try {
  const result = runAppleScript(script);
  return result;
} catch (error: any) {
  throw new Error(`Failed to create event: ${error.message}`);
}

// ❌ MAUVAIS
try {
  const result = runAppleScript(script);
  return result;
} catch (error) {
  return "Error";
}
```

### AppleScript

```applescript
-- ✅ BON : Scripte structuré et lisible
tell application "Calendar"
  set targetCal to first calendar whose name is "${calendarName}"
  tell targetCal
    set newEvent to make new event with properties {summary:"${summary}"}
  end tell
  return "Event created: " & summary of newEvent
end tell

-- ❌ MAUVAIS : Scripte sur une ligne difficile à lire
tell application "Calendar" to tell first calendar whose name is "${calendarName}" to make new event with properties {summary:"${summary}"}
```

## Fonctionnalités souhaitées

Voici quelques fonctionnalités que nous aimerions voir :

- [ ] Support des événements récurrents
- [ ] Gestion des rappels et alarmes
- [ ] Support des participants et invitations
- [ ] Export/Import au format .ics
- [ ] Tests unitaires automatisés
- [ ] Support des catégories/tags
- [ ] Gestion des calendriers partagés
- [ ] Notifications pour événements à venir
- [ ] Support des fuseaux horaires
- [ ] Mode batch pour créer plusieurs événements

## Architecture

### Structure du code

```
src/
  index.ts          # Point d'entrée, serveur MCP
  │
  ├─ AppleScript    # Fonctions qui génèrent et exécutent AppleScript
  │  ├─ runAppleScript()
  │  └─ [futures fonctions]
  │
  ├─ Calendar       # Logique métier calendrier
  │  ├─ listCalendars()
  │  ├─ getEvents()
  │  ├─ createEvent()
  │  ├─ updateEvent()
  │  ├─ deleteEvent()
  │  └─ searchEvents()
  │
  └─ MCP Server     # Gestion du protocole MCP
     ├─ Tool definitions
     └─ Request handlers
```

### Ajouter un nouvel outil

1. **Définir l'outil** dans le tableau `TOOLS`
2. **Implémenter la logique** (fonction AppleScript)
3. **Ajouter le handler** dans `CallToolRequestSchema`
4. **Documenter** dans README.md et EXAMPLES.md
5. **Ajouter des tests** dans TESTING.md

Exemple :

```typescript
// 1. Définir l'outil
{
  name: "mon_nouvel_outil",
  description: "Description de l'outil",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "..." }
    },
    required: ["param1"]
  }
}

// 2. Implémenter la fonction
function monNouvelOutil(param1: string): string {
  const script = `...`;
  return runAppleScript(script);
}

// 3. Ajouter le handler
case "mon_nouvel_outil": {
  const { param1 } = args as any;
  const result = monNouvelOutil(param1);
  return {
    content: [{ type: "text", text: result }]
  };
}
```

## Tests

Pour l'instant, les tests sont manuels (voir TESTING.md).

Contributions bienvenues pour :
- Tests unitaires avec Jest
- Tests d'intégration
- Tests end-to-end
- CI/CD avec GitHub Actions

## Documentation

Lorsque vous modifiez le code :

1. **README.md** - Mettez à jour si l'API change
2. **EXAMPLES.md** - Ajoutez des exemples d'utilisation
3. **CHANGELOG.md** - Documentez les changements
4. **TESTING.md** - Ajoutez des tests pour la nouvelle fonctionnalité
5. **Commentaires** - Documentez le code complexe

## Questions ?

N'hésitez pas à :
- Ouvrir une issue pour poser des questions
- Rejoindre les discussions sur GitHub
- Contacter les mainteneurs

## Code de conduite

Soyez respectueux, constructif et inclusif. Nous voulons que ce projet soit accueillant pour tous.

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

Merci de contribuer au serveur MCP Apple iCalendar ! 🎉
