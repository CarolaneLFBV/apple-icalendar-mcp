# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-10-26

### Ajouté

- Serveur MCP initial pour Apple iCalendar
- Outil `list_calendars` pour lister tous les calendriers
- Outil `get_events` pour récupérer les événements d'un calendrier
- Outil `create_event` pour créer de nouveaux événements
- Outil `delete_event` pour supprimer des événements
- Outil `update_event` pour modifier des événements existants
- Outil `search_events` pour rechercher des événements par mot-clé
- Documentation complète en français
- Exemples d'utilisation détaillés
- Support pour les dates, lieux et descriptions d'événements

### Fonctionnalités principales

- Intégration complète avec l'application Calendrier d'Apple via AppleScript
- Support de multiples calendriers
- Gestion CRUD complète des événements (Create, Read, Update, Delete)
- Recherche textuelle dans tous les calendriers
- Format de date flexible compatible avec AppleScript

### Limitations connues

- Pas de support pour les événements récurrents
- Pas de gestion des rappels/alarmes
- Pas de gestion des participants/invitations
- macOS uniquement

## [Future]

### Prévu pour les versions futures

- Support des événements récurrents
- Gestion des rappels et alarmes
- Support des participants et invitations
- Export/Import au format iCal (.ics)
- Gestion des catégories et tags
- Support des calendriers partagés
- Notifications pour les événements à venir
