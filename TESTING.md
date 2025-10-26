# Guide de test

Ce guide vous aide à tester le serveur MCP Apple iCalendar après l'installation.

## Prérequis de test

Avant de commencer les tests :

1. ✅ Le serveur est compilé (`npm run build`)
2. ✅ La configuration MCP est ajoutée à Claude Code
3. ✅ L'application Calendrier d'Apple est ouverte
4. ✅ Vous avez au moins un calendrier configuré
5. ✅ Les permissions d'accès au Calendrier sont accordées

## Tests de base

### Test 1 : Vérifier la compilation

```bash
cd apple-icalendar-mcp
npm run build
```

**Résultat attendu :** Aucune erreur, dossier `dist/` créé avec `index.js`

### Test 2 : Vérifier la structure des fichiers

```bash
ls -la dist/
```

**Résultat attendu :** Fichiers `index.js`, `index.d.ts`, et `index.js.map` présents

## Tests fonctionnels avec Claude Code

### Test 3 : Liste des calendriers

**Commande à Claude :**
```
Liste tous mes calendriers disponibles
```

**Vérification :**
- Claude utilise l'outil `list_calendars`
- La réponse contient une liste de vos calendriers
- Les noms correspondent à ceux dans l'application Calendrier

### Test 4 : Récupération d'événements

**Préparation :** Créez manuellement un événement de test dans l'application Calendrier

**Commande à Claude :**
```
Montre-moi les événements de mon calendrier "Travail" pour les 30 prochains jours
```

**Vérification :**
- Claude utilise l'outil `get_events`
- L'événement de test apparaît dans la liste
- Les dates, heures et détails sont corrects

### Test 5 : Création d'événement

**Commande à Claude :**
```
Crée un événement de test "MCP Test Event" dans mon calendrier "Travail" demain à 15h pour 1 heure
```

**Vérification :**
- Claude utilise l'outil `create_event`
- Message de confirmation reçu
- L'événement apparaît dans l'application Calendrier
- Les détails sont corrects (date, heure, durée)

### Test 6 : Recherche d'événements

**Commande à Claude :**
```
Recherche tous les événements contenant "Test"
```

**Vérification :**
- Claude utilise l'outil `search_events`
- L'événement "MCP Test Event" créé précédemment apparaît
- Les résultats incluent le nom du calendrier

### Test 7 : Modification d'événement

**Commande à Claude :**
```
Change l'heure de l'événement "MCP Test Event" à 16h et ajoute le lieu "Bureau"
```

**Vérification :**
- Claude utilise l'outil `update_event`
- Message de confirmation reçu
- Les modifications apparaissent dans l'application Calendrier
- L'heure est bien 16h
- Le lieu "Bureau" est ajouté

### Test 8 : Suppression d'événement

**Commande à Claude :**
```
Supprime l'événement "MCP Test Event" de mon calendrier "Travail"
```

**Vérification :**
- Claude utilise l'outil `delete_event`
- Message de confirmation reçu
- L'événement n'apparaît plus dans l'application Calendrier

## Tests de cas limites

### Test 9 : Calendrier inexistant

**Commande à Claude :**
```
Montre les événements du calendrier "CalendrierQuiNExistePas"
```

**Résultat attendu :** Message d'erreur clair indiquant que le calendrier n'existe pas

### Test 10 : Événement inexistant

**Commande à Claude :**
```
Supprime l'événement "ÉvénementInexistant" du calendrier "Travail"
```

**Résultat attendu :** Message d'erreur indiquant que l'événement n'a pas été trouvé

### Test 11 : Format de date invalide

**Commande à Claude :**
```
Crée un événement le "32 janvier 2025" (date invalide)
```

**Résultat attendu :** Claude ou AppleScript retourne une erreur de format de date

## Tests d'intégration

### Test 12 : Scénario complet

Exécutez cette séquence complète :

1. **Liste calendriers** → Notez le nom d'un calendrier
2. **Crée événement** "Intégration Test 1" pour demain 10h
3. **Crée événement** "Intégration Test 2" pour demain 14h
4. **Récupère événements** pour demain
5. **Recherche** "Intégration"
6. **Modifie** "Intégration Test 1" pour 11h
7. **Supprime** les deux événements

**Vérification :** Chaque étape fonctionne et les modifications sont visibles dans l'application Calendrier

## Diagnostic des problèmes

### Problème : Le serveur ne répond pas

**Diagnostics :**
```bash
# Vérifier que le fichier existe
ls -la apple-icalendar-mcp/dist/index.js

# Vérifier les permissions
chmod +x apple-icalendar-mcp/dist/index.js

# Tester l'exécution directe
node apple-icalendar-mcp/dist/index.js
```

### Problème : Erreurs AppleScript

**Diagnostics :**
```bash
# Tester AppleScript manuellement
osascript -e 'tell application "Calendar" to get name of calendars'

# Vérifier les permissions système
# Préférences Système > Sécurité et confidentialité > Confidentialité > Calendrier
```

### Problème : Dates non reconnues

**Solutions :**
- Utilisez des formats de date explicites : "1/15/2025 2:00:00 PM"
- Laissez Claude gérer la conversion
- Vérifiez la locale système (format US vs EU)

## Checklist de validation finale

Avant de considérer le serveur comme fonctionnel :

- [ ] Tous les tests de base passent
- [ ] Tous les 8 tests fonctionnels passent
- [ ] Au moins 2 tests de cas limites passent
- [ ] Le scénario d'intégration complet fonctionne
- [ ] Les modifications sont visibles dans l'application Calendrier
- [ ] Aucune erreur dans les logs
- [ ] Les permissions système sont correctes

## Logs et débogage

Pour voir les logs du serveur MCP dans Claude Code, consultez :
- Les réponses d'erreur dans Claude Code
- La console où Claude Code est lancé
- Les logs système macOS pour AppleScript

## Rapport de bug

Si vous rencontrez des problèmes, incluez :
1. Version de macOS
2. Version de Node.js (`node --version`)
3. Logs d'erreur complets
4. Étapes pour reproduire le problème
5. Configuration MCP utilisée

## Performance

Temps de réponse attendus :
- `list_calendars` : < 1 seconde
- `get_events` : 1-3 secondes
- `create_event` : 1-2 secondes
- `search_events` : 2-5 secondes (selon le nombre d'événements)

Si les temps sont significativement plus longs, vérifiez :
- La taille de vos calendriers
- Les performances système
- Les processus en arrière-plan
