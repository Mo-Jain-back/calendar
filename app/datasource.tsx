import dayjs from "dayjs"


export const eventsData = [
    { 
        id: "1",
        title: "Event1",
        startDate: new Date("01/01/2025"),
        endDate: new Date("01/01/2025"),
        description: "first event",
        startTime: "01:00",
        endTime:"10:00",
        allDay:false
    },
    { 
        id: "2",
        title: "Event2",
        startDate: new Date("01/05/2025"),
        endDate: new Date("01/05/2025"),
        description: "second event" ,
        startTime: "01:00",
        endTime:"10:00",
        allDay:false
    },
    { 
        id: "3",
        title: "Event3",
        startDate: new Date("01/08/2025"),
        endDate: new Date("01/08/2025"),
        description: "third event" ,
        startTime: "01:00",
        endTime:"10:00",
        allDay:false
    },
    { 
        id: "4",
        title: "Event4",
        startDate: new Date("01/12/2025"),
        endDate: new Date("01/12/2025"),
        description: "forth event" ,
        startTime: "01:00",
        endTime:"10:00",
        allDay:false
    },
    { 
        id: "5",
        title: "Event5",
        startDate: new Date("1/12/2025"),
        endDate: new Date("01/15/2025"),
        description: "forth event" ,
        startTime: "02:00",
        endTime:"20:00",
        allDay:true
    },
    { 
        id: "6",
        title: "Event6",
        startDate: new Date("1/16/2025"),
        endDate: new Date("01/16/2025"),
        description: "fifth event" ,
        startTime: "04:00",
        endTime:"10:30",
        allDay:false
    },
    { 
        id: "7",
        title: "Event7",
        startDate: new Date("1/12/2025"),
        endDate: new Date("01/16/2025"),
        description: "fifth event" ,
        startTime: "03:00",
        endTime:"12:00",
        allDay:true
    },
    { 
        id: "8",
        title: "Event8",
        startDate: new Date("1/12/2025"),
        endDate: new Date("01/12/2025"),
        description: "eighth event" ,
        startTime: "03:30",
        endTime:"16:00",
        allDay:true
    },
    { 
        id: "9",
        title: "Event9",
        startDate: new Date("1/12/2025"),
        endDate: new Date("01/12/2025"),
        description: "nine event" ,
        startTime: "6:30",
        endTime:"13:00",
        allDay:false
    },
    { 
        id: "10",
        title: "Event10",
        startDate: new Date("1/16/2025"),
        endDate: new Date("01/16/2025"),
        description: "nine event" ,
        startTime: "6:30",
        endTime:"13:00",
        allDay:false
    },
    { 
        id: "11",
        title: "Event11",
        startDate: new Date("1/14/2025"),
        endDate: new Date("01/22/2025"),
        description: "eleventh event" ,
        startTime: "6:30",
        endTime:"13:00",
        allDay:false
    },
    { 
        id: "12",
        title: "Event12",
        startDate: new Date("1/16/2025"),
        endDate: new Date("01/16/2025"),
        description: "twelvth event" ,
        startTime: "6:30",
        endTime:"13:00",
        allDay:false
    },
    { 
        id: "13",
        title: "Event13",
        startDate: new Date("1/19/2025"),
        endDate: new Date("01/19/2025"),
        description: "twelvth event" ,
        startTime: "6:30",
        endTime:"13:00",
        allDay:false
    }
]

const temp ={ 
    id: "9",
    title: "Event9",
    startDate: new Date("1/12/2025"),
    description: "nine event" ,
    startTime: "6:30",
    endTime:"13:00",
    allDay:false,
    color:"#00ff00",
    isStart:true,
    isEnd:false,
    isMultiDay:false
}

const startDate = new Date("1/12/2025")
const endDate = new Date("1/16/2025")
const temp1 =  dayjs(startDate).diff(dayjs(endDate), "days")