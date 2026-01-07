# Project 3 - Boer Bert

## Bronnen
 - https://icon-sets.iconify.design/ (Icoontjes)

###Nieuwe dependency
*Als er een nieuwe dependency in het project komt, moet je deze downloaden. Zo werken alle bibliotheken die we gebruiken in het project.*

Dit doe je door in de map van de backend met Bun de dependencies te installeren, 
```bash
bun install
```

In de frontend met NPM:
```bash
npm install
```

Daarna zou alles weer moeten werken. Zorg ervoor dat je de "Run Frontend" en "Run Backend" taken in VSCode herstart en niet meerdere keren tegelijkertijd draait.

## Instructies:
### Backend:
1. Kopieer `.env.example` naar `.env` en vul de configuratie van de database in. Deze moet worden gehost op [Turso](https://turso.tech/).

_**Wijzigingen in het databaseschema?**_  
Sync de database in `backend/` met `npx drizzle-kit push` of door <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> > `> Tasks: Run Task` > `Sync Drizzle Database`
