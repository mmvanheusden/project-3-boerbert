import {InferSelectModel} from "drizzle-orm";
import dayjs from "dayjs";
import {bookingsTable} from "./bookings/model";
import * as handlebars from "handlebars";
import * as fs from "node:fs";
import {activitiesTable} from "./activities/model";
import {slotsTable} from "./slots/model";

export function composeBookingReminderEmail(booking: InferSelectModel<typeof bookingsTable>, activity: InferSelectModel<typeof activitiesTable>, slot: InferSelectModel<typeof slotsTable>) {
	const contentTemplate = handlebars.compile(fs.readFileSync('emails/boekingsherinnering/content.hbs', 'utf8'));
	const subjectTemplate =  handlebars.compile(fs.readFileSync('emails/boekingsherinnering/subject.hbs', 'utf8'));

	const content = contentTemplate({
		activity_name: activity!.title.nl,
		slot_datetime: dayjs(slot.date).locale("nl").format("D[ ]MMMM[ om ]HH:mm"),
		activity_location: activity!.location.nl,
		activity_minage: activity!.minage == "0" ? "Alle leeftijden" : activity!.minage + "+",
		booking_amount: booking.amount,
		activity_price: `€ ${activity!.price.toFixed(2).dot2comma().replace(",00", ",-")}`
	});

	const subject = subjectTemplate({
		slot_date: dayjs(slot.date).locale("nl").format("D[ ]MMMM"),
	});

	return {subject, content};
}

export function composeBookingConfirmationEmail(booking: InferSelectModel<typeof bookingsTable>, activity: InferSelectModel<typeof activitiesTable>, slot: InferSelectModel<typeof slotsTable>) {
	const contentTemplate = handlebars.compile(fs.readFileSync('emails/boekingsbevestiging/content.hbs', 'utf8'));
	const subjectTemplate =  handlebars.compile(fs.readFileSync('emails/boekingsbevestiging/subject.hbs', 'utf8'));

	const content = contentTemplate({
		activity_name: activity!.title.nl,
		slot_datetime: dayjs(slot.date).locale("nl").format("D[ ]MMMM[ om ]HH:mm"),
		activity_location: activity!.location.nl,
		activity_minage: activity!.minage == "0" ? "Alle leeftijden" : activity!.minage + "+",
		booking_amount: booking.amount,
		activity_price: `€ ${activity!.price.toFixed(2).dot2comma().replace(",00", ",-")}`
	});

	const subject = subjectTemplate({
		slot_date: dayjs(slot.date).locale("nl").format("D[ ]MMMM"),
	});

	return {subject, content};
}