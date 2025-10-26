# Apple iCalendar MCP Server

Un serveur MCP (Model Context Protocol) qui permet à Claude Code d'interagir avec l'application Calendrier d'Apple sur macOS.

## Fonctionnalités

Ce serveur MCP expose les outils suivants pour gérer vos calendriers Apple :

- **list_calendars** - Liste tous les calendriers disponibles
- **get_events** - Récupère les événements d'un calendrier spécifique
- **create_event** - Crée un nouvel événement dans un calendrier
- **delete_event** - Supprime un événement d'un calendrier
- **update_event** - Met à jour un événement existant
- **search_events** - Recherche des événements par mot-clé dans tous les calendriers

## Prérequis

- macOS (requis pour l'application Calendrier d'Apple)
- Node.js 18 ou supérieur
- L'application Calendrier d'Apple doit être installée et configurée

## Installation

### 1. Installer les dépendances

```bash
cd apple-icalendar-mcp
npm install
```

### 2. Compiler le projet

```bash
npm run build
```

### 3. Configurer Claude Code

Ajoutez ce serveur MCP à votre configuration Claude Code. Créez ou modifiez le fichier de configuration MCP :

**Pour Claude Desktop** (~/.config/claude/claude_desktop_config.json) :

```json
{
  "mcpServers": {
    "apple-icalendar": {
      "command": "node",
      "args": ["/chemin/absolu/vers/apple-icalendar-mcp/dist/index.js"]
    }
  }
}
```

**Pour Claude Code CLI**, créez/modifiez le fichier de configuration MCP :

```json
{
  "mcpServers": {
    "apple-icalendar": {
      "command": "node",
      "args": ["/chemin/absolu/vers/apple-icalendar-mcp/dist/index.js"]
    }
  }
}
```

Remplacez `/chemin/absolu/vers/` par le chemin complet vers le dossier du projet.

## Utilisation

Une fois configuré, vous pouvez utiliser Claude Code pour interagir avec vos calendriers Apple :

### Exemples de commandes

**Lister tous les calendriers :**
```
Claude, liste mes calendriers
```

**Voir les événements d'un calendrier :**
```
Claude, montre-moi les événements de mon calendrier "Travail" pour les 7 prochains jours
```

**Créer un nouvel événement :**
```
Claude, crée un événement "Réunion d'équipe" le 15 janvier 2025 de 14h à 15h dans mon calendrier "Travail"
```

**Rechercher des événements :**
```
Claude, recherche tous les événements contenant "dentiste"
```

**Modifier un événement :**
```
Claude, change l'heure de l'événement "Réunion d'équipe" à 15h
```

**Supprimer un événement :**
```
Claude, supprime l'événement "Réunion annulée" de mon calendrier "Travail"
```

## Détails des outils

### list_calendars

Liste tous les calendriers disponibles.

**Paramètres :** Aucun

**Retour :** Liste des calendriers avec leur nom et description

### get_events

Récupère les événements d'un calendrier spécifique.

**Paramètres :**
- `calendar_name` (string, requis) - Le nom du calendrier
- `days_ahead` (number, optionnel) - Nombre de jours à l'avance (défaut: 30)

**Retour :** Liste des événements avec leurs détails

### create_event

Crée un nouvel événement dans un calendrier.

**Paramètres :**
- `calendar_name` (string, requis) - Le nom du calendrier
- `summary` (string, requis) - Le titre de l'événement
- `start_date` (string, requis) - Date et heure de début (format: "1/15/2025 2:00:00 PM")
- `end_date` (string, requis) - Date et heure de fin
- `location` (string, optionnel) - Lieu de l'événement
- `description` (string, optionnel) - Description de l'événement

**Retour :** Message de confirmation

### delete_event

Supprime un événement d'un calendrier.

**Paramètres :**
- `calendar_name` (string, requis) - Le nom du calendrier
- `event_summary` (string, requis) - Le titre de l'événement à supprimer

**Retour :** Message de confirmation

### update_event

Met à jour un événement existant.

**Paramètres :**
- `calendar_name` (string, requis) - Le nom du calendrier
- `event_summary` (string, requis) - Le titre actuel de l'événement
- `new_summary` (string, optionnel) - Nouveau titre
- `new_start_date` (string, optionnel) - Nouvelle date de début
- `new_end_date` (string, optionnel) - Nouvelle date de fin
- `new_location` (string, optionnel) - Nouveau lieu
- `new_description` (string, optionnel) - Nouvelle description

**Retour :** Message de confirmation

### search_events

Recherche des événements par mot-clé dans tous les calendriers.

**Paramètres :**
- `query` (string, requis) - Mot-clé à rechercher
- `days_ahead` (number, optionnel) - Nombre de jours à l'avance (défaut: 30)

**Retour :** Liste des événements correspondants

## Format des dates

Les dates doivent être au format accepté par AppleScript, par exemple :
- "1/15/2025 2:00:00 PM"
- "January 15, 2025 at 2:00:00 PM"
- "15/1/2025 14:00:00"

## Permissions

La première fois que vous utilisez le serveur, macOS vous demandera d'autoriser l'accès au Calendrier. Acceptez cette permission pour que le serveur fonctionne correctement.

## Développement

### Mode développement avec rechargement automatique

```bash
npm run dev
```

### Structure du projet

```
apple-icalendar-mcp/
├── src/
│   └── index.ts          # Code principal du serveur
├── dist/                 # Fichiers compilés (généré)
├── package.json          # Configuration npm
├── tsconfig.json         # Configuration TypeScript
└── README.md            # Documentation
```

## Dépannage

### Le serveur ne se connecte pas

1. Vérifiez que le chemin dans la configuration est correct et absolu
2. Vérifiez que le projet a été compilé (`npm run build`)
3. Vérifiez les permissions d'accès au Calendrier dans Préférences Système > Sécurité et confidentialité

### Les événements ne sont pas trouvés

1. Vérifiez que le nom du calendrier est exact (sensible à la casse)
2. Vérifiez que l'application Calendrier contient bien les événements
3. Vérifiez le format des dates utilisées

### Erreurs AppleScript

Les erreurs AppleScript seront affichées dans les réponses. Vérifiez :
- Que l'application Calendrier est accessible
- Que les noms de calendriers et événements sont corrects
- Que les dates sont dans un format valide

## Limitations

- Fonctionne uniquement sur macOS
- Requiert l'application Calendrier d'Apple
- Le format des dates doit suivre les conventions AppleScript
- La recherche d'événements se fait par correspondance de chaîne simple

## Licence

MIT

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
