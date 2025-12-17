// src/i18n/config.ts

// Core i18next library.
import i18n from "i18next";                      
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next, Translation } from "react-i18next";
import { select } from "react-i18next/icu.macro";

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
          cancel: "Afbreken",
          step2_title: "Bekijk activiteitdetails",
          price_per_ticket: "€ {{price}} per kaartje",
          max_participants: "Maximaal aantal deelnemers: {{capacity}}",
          location_label: "Locatie: {{location}}",
          min_age_note: "Let op: Vanaf {{minage}} jaar oud",
          back_to_list: "Terug naar activiteitenlijst",
          add: "Toevoegen",
          minage: "Minimumleeftijd",
          totaal_price: "Totaalprijs",
          reserve_now: "reserveer nu",
          how_many_people: "Voor hoeveel personen wilt u reserveren?",
          welcome_message: "Welkom bij Boer Bert's camping!",
          stap_3: "Selecteer betaalmethode",
          select_payment_method: "Selecteer betaalmethode",
          scan_payment_card: "Scan uw betaalkaart",
          proceed_to_counter: "Ga verder bij de balie",
          receipt_at_counter: "U krijgt daar uw bon",
          selected_payment_method: "Gekozen betaalmethode: {{selectedPaymentMethod}}"
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
          cancel: "Abbrechen",
          step2_title: "Aktivitäten-Details ansehen",
          price_per_ticket: "€ {{price}} pro Ticket",
          max_participants: "Maximale Teilnehmerzahl: {{capacity}}",
          location_label: "Ort: {{location}}",
          min_age_note: "Achtung: Ab {{minage}} Jahren",
          back_to_list: "Zurück zur Aktivitätenliste",
          add: "Hinzufügen",
          minage: "Mindestalter",
          total_price: "Gesamtpreis",
          reserve_now: "jetzt reservieren",
          how_many_people: "Für wie viele Personen möchten Sie reservieren?",
          welcome_message: "Willkommen auf dem Campingplatz von Bauer Bert!",
          stap_3: "Zahlungsmethode auswählen",
          select_payment_method: "Zahlungsmethode auswählen",
          scan_payment_card: "Scannen Sie Ihre Zahlungskarte",
          proceed_to_counter: "Gehen Sie zur Kasse",
          receipt_at_counter: "Sie erhalten dort Ihre Quittung",
          selected_payment_method: "Ausgewählte Zahlungsmethode: {{selectedPaymentMethod}}"
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
            cancel: "Cancel",
            step2_title: "View activity details",
            price_per_ticket: "€ {{price}} per ticket",
            max_participants: "Maximum participants: {{capacity}}",
            location_label: "Location: {{location}}",
            min_age_note: "Note: From age {{minage}} and up",
            back_to_list: "Back to activities list",
            add: "Add",
            minage: "Minimum age",
            total_price: "Total price",
            reserve_now: "Reserve now",
            how_many_people: "For how many people would you like to reserve?",
            welcome_message: "Welcome to Boer Bert's camping!",
            stap_3: "Select payment method",
            select_payment_method: "Select payment method",
            scan_payment_card: "Scan your payment card",
            proceed_to_counter: "Proceed to the counter",
            receipt_at_counter: "You will receive your receipt there",
            selected_payment_method: "Selected payment method: {{selectedPaymentMethod}}"
        }
      }
    },
  });

export default i18n;