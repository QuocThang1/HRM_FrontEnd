import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // click, select...

const DashboardCalendar = ({
  events = [],
  initialView = "dayGridMonth",
  height = "auto",
  locale = "vi",
  headerToolbar = {
    left: "prev,today,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin],
  selectable = false,
  onDateClick = undefined,
  onEventClick = undefined,
  onSelect = undefined,
  className = "",
}) => {
  return (
    <div className={`p-4 bg-white rounded-xl shadow ${className}`.trim()}>
      <FullCalendar
        plugins={plugins}
        initialView={initialView}
        locale={locale}
        headerToolbar={headerToolbar}
        height={height}
        events={events}
        selectable={selectable}
        dateClick={onDateClick}
        eventClick={onEventClick}
        select={onSelect}
      />
    </div>
  );
};

export default DashboardCalendar;
