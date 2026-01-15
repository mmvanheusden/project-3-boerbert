// src/i18n/config.ts

// Core i18next library.
import i18n from "i18next";
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next } from "react-i18next";

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
                    activity: "Activiteit",
                    activity_details: "Activiteitsdetails",
                    back_to_activities_list: "Terug naar activiteitenlijst",
                    back_to_activity_view: "Terug naar activiteitsdetails",
                    back_to_confirmation: "Terug naar boekingsbevestiging",
                    back_to_email: "Terug naar e-mailinvoer",
                    back_to_paymentmethod: "Terug naar betaalmethodeselectie",
                    back_to_campingspot: "Terug naar campingplaatsselectie",
                    book_areyousure: "Weet je zeker dat je deze activiteit wil boeken?",
                    booking_details: "Boekingsdetails",
                    campingspot_overview: "Campingplaatsnummer doorgeven",
                    cancel: "Afbreken",
                    choose_an_activity: "Activiteitsoverzicht",
                    choose_payment_method: "Kies betaalmethode",
                    confirm_booking: "Boekingsbevestiging",
                    confirm_booking_details: "Bevestig details",
                    datetime: "Datum en tijd",
                    duration: "Tijdsduur",
                    email_updates: "Emailupdates",
                    enter_campingspot: "Geef uw campingplaatsnummer door",
                    hours: "uur",
                    how_many_people: "Voor hoeveel personen wil u reserveren?",
                    location: "Locatie",
                    location_label: "Locatie: {{location}}",
                    max_participants: "Maximaal aantal deelnemers: {{capacity}}",
                    min_age: "Vanaf {{age}} jaar oud",
                    minimum_age: "Minimumleeftijd",
                    pay_cash: "Betaal contant bij de balie",
                    pay_digital: "Betaal digitaal met QR-code",
                    payment_status: "Betalingsstatus",
                    payment_successful: "Betaling gelukt!",
                    person: "persoon",
                    price_per_person: "€ {{price}} per persoon",
                    price_sum: "Totaalprijs: € {{price}}",
                    error_select: "Selecteer een tijdslot a.u.b.", 
                    proceed: "Doorgaan",
                    proceed_at_counter: "Ga naar de balie om de betaling af te ronden",
                    proceed_without_email_updates: "Doorgaan zonder e-mail door de geven",
                    receive_email_updates: "Wilt u updates over uw boeking via e-mail ontvangen?",
                    scan_qrcode: "U kunt de QR-code scannen via uw bankapp",
                    select_payment_method: "Selecteer een betaalmethode",
                    select_timeslot: "Selecteer een tijdslot",
                    selected_amount: "Hoeveelheid",
                    selected_amount_persons: "{{amount}} personen",
                    slots_available: "plaatsen vrij",
                    slots_available_after_booking: "Na reserveren nog {{slots}} plaatsen vrij",
                    state_error: "Storing",
                    state_loading: "Laden...",
                    state_ok: "OK",
                    view_details: "Bekijken",
                    welcome: "Welkom",
                    locationlist: "Locatie:",
                    all_ages: "Alle leeftijden",
                    type: "Type",
                    age: "Leeftijd",
                    target_audience: "Doelgroep",
                    price: "Prijs",
                    email_placeholder: "Voer een E-mail in",
                    back_to_start: "Terug naar begin",
                    verification: "Voer de code in",
                    here: "Voer hier in",
                    not_available: "Niet beschikbaar",
                },
            }, // German
            de: {
                translation: {
                    activity: "Aktivität",
                    activity_details: "Aktivitätsdetails",
                    back_to_activities_list: "Zurück zur Aktivitätsliste",
                    back_to_activity_view: "Zurück zu den Aktivitätsdetails",
                    back_to_confirmation: "Zurück zur Buchungsbestätigung",
                    back_to_email: "Zurück zum E-Mail-Eintrag",
                    back_to_paymentmethod: "Zurück zur Auswahl der Zahlungsart",
                    back_to_campingspot: "Zurück zur Campingplatzübersicht",
                    book_areyousure: "Sind Sie sicher, dass Sie diese Aktivität buchen möchten?",
                    booking_details: "Buchungsdetails",
                    campingspot_overview: "Geben Sie die Nummer des Campingplatzes an",
                    cancel: "Abbrechen",
                    choose_an_activity: "Aktivitätsübersicht",
                    choose_payment_method: "Wählen Sie die Zahlungsmethode",
                    confirm_booking: "Buchungsbestätigung",
                    confirm_booking_details: "Bestätigen Sie die Details",
                    datetime: "Datum und Uhrzeit",
                    duration: "Dauer",
                    email_updates: "E-Mail-Updates",
                    enter_campingspot: "Geben Sie Ihre Stellplatznummer an",
                    hours: "Uhr",
                    how_many_people: "Für wie viele Personen möchten Sie reservieren?",
                    location: "Standort",
                    location_label: "Standort: {{location}}",
                    max_participants: "Maximale Teilnehmerzahl: {{capacity}}",
                    min_age: "Aus {{age}} Jahre alt",
                    minimum_age: "Mindestalter",
                    pay_cash: "Bezahlen Sie bar am Schalter",
                    pay_digital: "Bezahlen Sie digital mit QR-Code",
                    payment_status: "Zahlungsstatus",
                    payment_successful: "Zahlung erfolgreich!",
                    person: "Person",
                    price_per_person: "€ {{price}} pro Person",
                    price_sum: "Gesamtpreis: € {{price}}",
                    error_select: "Bitte wählen Sie einen Zeitraum.",
                    proceed: "Fohrtfahren",
                    proceed_at_counter: "Begeben Sie sich zur Rezeption, um die Zahlung abzuschließen.",
                    proceed_without_email_updates: "Fahren Sie fort, ohne eine E-Mail zu senden",
                    receive_email_updates: "Möchten Sie Updates zu Ihrer Buchung per E-Mail erhalten?",
                    scan_qrcode: "Sie können den QR-Code über Ihre Banking-App scannen",
                    select_payment_method: "Wählen Sie eine Zahlungsmethode aus",
                    select_timeslot: "Wählen Sie ein Zeitfenster aus",
                    selected_amount: "Menge",
                    selected_amount_persons: "{{amount}} Personen",
                    slots_available: "Plätze zur Verfügung",
                    slots_available_after_booking: "Nach Reservierung {{slots}} Plätze zur Verfügung",
                    state_error: "Ausfall",
                    state_loading: "Laden...",
                    state_ok: "OK",
                    view_details: "Zum Anschauen",
                    welcome: "Wilkommen",
                    locationlist: "Standort:",
                    all_ages: "Alle Altersgruppen",
                    type: "Typ",
                    age: "Alter",
                    target_audience: "Zielgruppe",
                    price: "Preis",
                    email_placeholder: "Geben Sie eine E-Mail ein",
                    back_to_start: "Zurück zum Anfang",
                    verification: "Code eingeben",
                    here: "Hier eintragen",
                    not_available: "Nicht verfügbar",
                }
            }, // English
            en: {
                translation: {
                    activity: "Activity",
                    activity_details: "Activity details",
                    back_to_activities_list: "Back to activity list",
                    back_to_activity_view: "Back to activity details",
                    back_to_confirmation: "Back to booking confirmation",
                    back_to_email: "Back to email entry",
                    back_to_paymentmethod: "Back to payment method selection",
                    back_to_campingspot: "Back to camping spot selection",
                    book_areyousure: "Are you sure you want to book this activity?",
                    booking_details: "Booking details",
                    campingspot_overview: "Provide camping site number",
                    cancel: "Cancel",
                    choose_an_activity: "Activity overview",
                    choose_payment_method: "Choose payment method",
                    confirm_booking: "Booking confirmation",
                    confirm_booking_details: "Confirm details",
                    datetime: "Date and time",
                    duration: "Duration",
                    email_updates: "Email updates",
                    enter_campingspot: "Provide your camping pitch number",
                    hours: "hours",
                    how_many_people: "How many people do you want to make a reservation for?",
                    location: "Location",
                    location_label: "Location: {{location}}",
                    max_participants: "Maximum number of participants: {{capacity}}",
                    min_age: "From {{age}} years old",
                    minimum_age: "Minimum age",
                    pay_cash: "Pay in cash at the counter",
                    pay_digital: "Pay digitally with QR code",
                    payment_status: "Payment status",
                    payment_successful: "Payment successful!",
                    person: "person",
                    price_per_person: "€ {{price}} per person",
                    price_sum: "Total price: € {{price}}",
                    error_select: "Please select a timeslot.",
                    proceed: "Continue",
                    proceed_at_counter: "Go to the reception desk to complete the payment",
                    proceed_without_email_updates: "Continue without submitting an email",
                    receive_email_updates: "Would you like to receive updates about your booking via email?",
                    scan_qrcode: "You can scan the QR code via your banking app",
                    select_payment_method: "Select a payment method",
                    select_timeslot: "Select a time slot",
                    selected_amount: "Quantity",
                    selected_amount_persons: "{{amount}} persons",
                    slots_available: "places available",
                    slots_available_after_booking: "After reservation {{slots}} places available",
                    state_error: "Outage",
                    state_loading: "Loading...",
                    state_ok: "OK",
                    view_details: "View details",
                    welcome: "Welcome",
                    locationlist: "Location:",
                    all_ages: "All ages",
                    type: "Type",
                    age: "Age",
                    target_audience: "Target audience",
                    price: "Price",
                    email_placeholder: "Please enter an E-mail",
                    back_to_start: "Back to start",
                    verification: "Enter the code ",
                    here: "Enter here",
                    not_available: "Not available",
                }
            }
        },
    });

export default i18n;