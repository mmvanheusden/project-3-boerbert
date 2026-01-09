// src/i18n/config.ts

// Core i18next library.
import i18n from "i18next";                      
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next, Translation } from "react-i18next";

i18n
  // Add React bindings as a plugin.
  .use(initReactI18next)
  // Initialize the i18next instance.
  .init({
    // Config options

    // Specifies the default language (locale) used
    // when a user visits our site for the first time.
    // We use English here, but feel free to use
    // whichever locale you want.                   
    lng: "en",

    // Fallback locale used when a translation is
    // missing in the active locale. Again, use your
    // preferred locale here. 
    fallbackLng: "en",

    // Enables useful output in the browser’s
    // dev console.
    debug: true,

    // Normally, we want `escapeValue: true` as it
    // ensures that i18next escapes any code in
    // translation messages, safeguarding against
    // XSS (cross-site scripting) attacks. However,
    // React does this escaping itself, so we turn 
    // it off in i18next.
    interpolation: {
      escapeValue: false,
    },

    // Translation messages. Add any languages
    // you want here.
    resources: {
      // Dutch
      nl: {
        // `translation` is the default namespace.
        // More details about namespaces shortly.
        translation: {
          hello_world: "Hallo, Wereld!",
          stap_1: "Kies een activiteit",
          book: "Boeken",
          activity_label: "ACTIVITEIT",
          view_details: "Bekijken",
          loading: "Laden...",
          error_prefix: "Fout: ",
          cancel: "Ga terug naar beginscherm",
          step2_title: "Bekijk activiteitdetails",
          price_per_ticket: "€ {{price}} per kaartje",
          max_participants: "Maximaal aantal deelnemers: {{capacity}}",
          location_label: "Locatie: {{location}}",
          min_age_note: "Let op: Vanaf {{minage}} jaar oud",
          back_to_list: "Terug naar activiteitenlijst",
          add: "Toevoegen",
          minage: "Minimumleeftijd",
          continue_bookingflow: "Bevestig details en ga door met boeken",
          boeking_samenvatting: "Bevestig details van uw boeking",
          search_activities: "Zoek activiteiten",
        },
      },
      // German
      de: {
        translation: {
          hello_world: "Hallo, Welt!",
          stap_1: "Wähle eine Aktivität",
          book: "Buchen",
          activity_label: "AKTIVITÄT",
          view_details: "Ansehen",
          loading: "Laden...",
          error_prefix: "Fehler: ",
          cancel: "Zurück zum Hauptbildschirm",
          step2_title: "Aktivitäten-Details ansehen",
          price_per_ticket: "€ {{price}} pro Ticket",
          max_participants: "Maximale Teilnehmerzahl: {{capacity}}",
          location_label: "Ort: {{location}}",
          min_age_note: "Achtung: Ab {{minage}} Jahren",
          back_to_list: "Zurück zur Aktivitätenliste",
          add: "Hinzufügen",
          minage: "Mindestalter",
          continue_bookingflow: "Details bestätigen und mit der Buchung fortfahren",
          boeking_samenvatting: "Bestätigen Sie die Details Ihrer Buchung",
          search_activities: "Aktivitäten suchen",
        },
      },
      //english
      en: {
        translation: {
            hello_world: "Hello, world!",
            stap_1: "Choose an activity",
            book: "Book",
            activity_label: "ACTIVITY",
            view_details: "View",
            loading: "Loading...",
            error_prefix: "Error: ",
            cancel: "Go back to main screen",
            step2_title: "View activity details",
            price_per_ticket: "€ {{price}} per ticket",
            max_participants: "Maximum participants: {{capacity}}",
            location_label: "Location: {{location}}",
            min_age_note: "Note: From age {{minage}} and up",
            back_to_list: "Back to activities list",
            add: "Add",
            minage: "Minimum age",
            continue_bookingflow: "Confirm details and continue booking",
            boeking_samenvatting: "Confirm details of your booking",
            search_activities: "Search activities",

        }
      }
    },
  });

export default i18n;