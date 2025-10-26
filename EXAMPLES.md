# Exemples d'utilisation

Ce document contient des exemples pratiques d'utilisation du serveur MCP Apple iCalendar avec Claude Code.

## Configuration initiale

Avant d'utiliser ces exemples, assurez-vous que :
1. Le serveur MCP est installé et compilé
2. La configuration MCP est correctement ajoutée à Claude Code
3. Les permissions d'accès au Calendrier sont accordées

## Exemples par scénario

### 1. Découvrir vos calendriers

**Vous :** Claude, montre-moi tous mes calendriers disponibles

**Claude utilisera :** `list_calendars`

**Résultat attendu :** Liste de tous vos calendriers (Travail, Personnel, Anniversaires, etc.)

---

### 2. Voir l'agenda de la semaine

**Vous :** Claude, montre-moi tous mes événements du calendrier "Travail" pour les 7 prochains jours

**Claude utilisera :** `get_events` avec `calendar_name: "Travail"` et `days_ahead: 7`

**Résultat attendu :** Liste détaillée des événements à venir

---

### 3. Planifier une réunion

**Vous :** Claude, crée une réunion "Sprint Planning" dans mon calendrier "Travail" le 20 janvier 2025 de 10h à 11h30, lieu "Salle de conf A", avec la description "Planification du sprint Q1"

**Claude utilisera :** `create_event` avec tous les paramètres

**Résultat attendu :** Confirmation de création de l'événement

---

### 4. Créer un événement récurrent (note)

**Vous :** Claude, crée un événement "Standup quotidien" tous les jours de la semaine à 9h pendant 15 minutes

**Note :** La récurrence n'est pas directement supportée par cette version. Claude devra créer plusieurs événements individuels ou vous suggérer de le faire manuellement dans l'application Calendrier.

---

### 5. Rechercher tous les rendez-vous médicaux

**Vous :** Claude, trouve tous mes rendez-vous qui contiennent le mot "médecin" ou "docteur" dans les 90 prochains jours

**Claude utilisera :** `search_events` avec `query: "médecin"` puis `query: "docteur"`, `days_ahead: 90`

**Résultat attendu :** Liste de tous les événements correspondants

---

### 6. Modifier l'heure d'un événement

**Vous :** Claude, change l'événement "Réunion d'équipe" dans mon calendrier "Travail" pour qu'il commence à 15h au lieu de 14h (garde la même durée)

**Claude utilisera :** `update_event` avec `new_start_date` et `new_end_date`

**Résultat attendu :** Confirmation de la mise à jour

---

### 7. Ajouter un lieu à un événement existant

**Vous :** Claude, ajoute le lieu "Café Central, 123 Rue Main" à mon événement "Déjeuner avec Marie"

**Claude utilisera :** `update_event` avec `new_location`

**Résultat attendu :** Confirmation de l'ajout du lieu

---

### 8. Annuler un événement

**Vous :** Claude, supprime l'événement "Réunion annulée" de mon calendrier "Travail"

**Claude utilisera :** `delete_event`

**Résultat attendu :** Confirmation de la suppression

---

### 9. Planifier plusieurs événements d'un coup

**Vous :** Claude, crée ces trois événements dans mon calendrier "Travail" :
- "Revue de code" le 15 janvier à 14h pour 1h
- "Démo produit" le 16 janvier à 10h pour 2h
- "Rétrospective" le 17 janvier à 16h pour 1h30

**Claude utilisera :** Trois appels successifs à `create_event`

**Résultat attendu :** Trois confirmations de création

---

### 10. Vérifier les conflits d'horaire

**Vous :** Claude, j'ai une nouvelle réunion proposée le 20 janvier à 14h. Est-ce que j'ai déjà quelque chose à ce moment-là ?

**Claude utilisera :** `get_events` pour récupérer les événements du 20 janvier et analyser les horaires

**Résultat attendu :** Information sur les conflits potentiels

---

### 11. Résumé de la journée

**Vous :** Claude, fais-moi un résumé de mes événements pour aujourd'hui

**Claude utilisera :** `get_events` avec `days_ahead: 1` et formatera un résumé

**Résultat attendu :** Liste organisée des événements du jour

---

### 12. Trouver du temps libre

**Vous :** Claude, regarde mon calendrier "Travail" et dis-moi quand j'ai 2 heures de libre cette semaine

**Claude utilisera :** `get_events` avec `days_ahead: 7` et analysera les créneaux disponibles

**Résultat attendu :** Suggestions de créneaux horaires libres

---

### 13. Mettre à jour plusieurs aspects d'un événement

**Vous :** Claude, pour l'événement "Présentation client", change le titre en "Présentation Q1 - Client ABC", le lieu en "Visioconférence - Zoom", et ajoute la description "Lien Zoom : https://zoom.us/j/123456"

**Claude utilisera :** `update_event` avec `new_summary`, `new_location`, et `new_description`

**Résultat attendu :** Confirmation de toutes les modifications

---

### 14. Préparer la semaine

**Vous :** Claude, aide-moi à préparer ma semaine. Montre-moi tous mes événements des 7 prochains jours et identifie ceux qui nécessitent une préparation (réunions, présentations, etc.)

**Claude utilisera :** `get_events` et analysera les types d'événements

**Résultat attendu :** Liste organisée avec recommandations

---

### 15. Nettoyer les anciens événements

**Vous :** Claude, trouve tous les événements avec "test" dans le titre et supprime-les de mon calendrier "Personnel"

**Claude utilisera :** `search_events` avec `query: "test"` puis plusieurs `delete_event`

**Résultat attendu :** Liste des événements supprimés

---

## Formats de date supportés

Le serveur accepte plusieurs formats de date pour AppleScript :

```
"1/15/2025 2:00:00 PM"
"January 15, 2025 at 2:00:00 PM"
"15/1/2025 14:00:00"
```

Claude peut généralement convertir vos demandes en langage naturel vers ces formats.

## Conseils d'utilisation

1. **Soyez spécifique** : Mentionnez toujours le nom exact du calendrier
2. **Format des dates** : Laissez Claude gérer la conversion des dates
3. **Événements similaires** : Si plusieurs événements ont le même nom, précisez avec des détails supplémentaires (date, lieu)
4. **Vérification** : Demandez à Claude de vérifier avant de supprimer des événements importants

## Limitations connues

- Pas de support natif pour les événements récurrents (nécessite création multiple)
- La recherche est sensible à la casse pour les noms de calendriers
- Les rappels (alarmes) ne sont pas encore supportés dans cette version
- Les invitations et participants ne sont pas gérés

## Suggestions d'amélioration futures

Si vous avez des idées pour améliorer ce serveur MCP, n'hésitez pas à contribuer ou à ouvrir une issue !
