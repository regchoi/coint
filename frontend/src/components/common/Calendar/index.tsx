import React from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface MyEvent extends Event {
    title: string;
}

const MyCalendar: React.FC = () => {
    const events: MyEvent[] = [
        {
            start: moment().toDate(),
            end: moment().add(4, "days").toDate(),
            title: "Some title"
        }
    ];

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                defaultDate={new Date()}
                defaultView="month"
                events={events}
                style={{ height: "100%" }}
            />
        </div>
    );
};

export default MyCalendar;
