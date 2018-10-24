import axios from 'axios';
import Mustache from 'mustache';
import { format, addDays } from 'date-fns';
import calendarTemplate from '../calendar.partial.html';

function getEvents() {
    const timeMin = new Date().toISOString();
    const timeMax = addDays(new Date(), 30).toISOString();
    const url = `https://clients6.google.com/calendar/v3/calendars/timgradyemail@gmail.com/events?calendarId=timgradyemail@gmail.com&singleEvents=true&timeZone=America%2FChicago&maxResults=250&sanitizeHtml=true&timeMin=${timeMin}&timeMax=${timeMax}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs&orderBy=startTime`;
    return axios.get(url);
}

function formatEvents(events) {
    return events.map(event => {
        return {
            date: format(event.start.dateTime, 'MM-DD'),
            label: event.summary
        }
    })
}

(() => {
    const calendarDiv = document.getElementById('calendar');
    getEvents().then(response => {
        const events = formatEvents(response.data.items);
        
        if (events.length) {
            const renderedTemplate = Mustache.render(calendarTemplate, {events});
            calendarDiv.innerHTML =renderedTemplate;
        } else {
            calendarDiv.innerHTML = '<p>No shows at the moment, check back soon!</p>';
        }
    }).catch(err => {
        calendarDiv.innerHTML = 'Whoops! An error occurred loading the schedule...check back soon!';
    });
})();