const handlebars = require('handlebars')

// handle dashboard data
const getDashboardData = (req, res) => {
    const clinicianId = req.params.clinician_id
    const clinicianName = "PLACEHOLDER_CLINICIAN_NAME"
    const dateAndTime = getDateAndTime()
    console.log("clinician_id is ", clinicianId)
    res.render('clinician/dashboard.hbs', { 
        layout: 'clinician-layout.hbs', 
        tableData: getTableData(clinicianName),
        clinicianName: clinicianName,
        date: dateAndTime.date,
        time: dateAndTime.time
    });
}

const getTableData = (clinicianId) => {
    // Placeholder data
    // TODO: Generate from MongoDB
    patient_data = [
        {
            id: "placeholder_id_1",
            name: "John Doe",
            status: "ok",
            blood_glucose: {
                status: null,
                value: 135
            },
            weight: {
                status: null,
                value: 91
            },
            insulin_doses: {
                status: null,
                value: null
            },
            step_counts: {
                status: null,
                value: 5000
            }
        },
        {
            id: "placeholder_id_2",
            name: "Jack Smith",
            status: "warning",
            blood_glucose: {
                status: "warning",
                value: 221
            },
            weight: {
                status: null,
                value: 72
            },
            insulin_doses: {
                status: null,
                value: null
            },
            step_counts: {
                status: null,
                value: 10000
            }
        },
        {
            id: "placeholder_id_3",
            name: "Adam Jerry",
            status: "unknown",
            blood_glucose: {
                status: "unknown",
                value: null
            },
            weight: {
                status: "unknown",
                value: null
            },
            insulin_doses: {
                status: "unknown",
                value: null
            },
            step_counts: {
                status: null,
                value: 500
            }
        },
    ]

    return patient_data
}

const getDateAndTime = () => {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ' ' + Intl.DateTimeFormat().resolvedOptions().timeZone;
    var date = days[today.getDay()] + ', ' + today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
    return {
        time,
        date
    }
}

const getColourByStatus = (status) => {
    switch (status) {
        case "ok":
            return "#2b7a3d"
        case "unknown":
            return "#9b7509"
        case "warning":
            return "#b42424"
    }
}

const getIconByStatus = (status) => {
    switch (status) {
        case "ok":
            return "fa-check-circle"
        case "unknown":
            return "fa-question-circle"
        case "warning":
            return "fa-exclamation-circle"
    }
}

const statusIsUnknown = (status) => {
    if (status === "unknown") {
        return status
    }
    return null
}

handlebars.registerHelper('getColourByStatus', getColourByStatus)
handlebars.registerHelper('getIconByStatus', getIconByStatus)
handlebars.registerHelper('statusIsUnknown', statusIsUnknown)

module.exports = {
    getDashboardData,
}