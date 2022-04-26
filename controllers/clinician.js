// handle dashboard data
const getDashboardData = (req, res) => {
    const clinician_id = req.params.clinician_id
    console.log("clinician_id is ", clinician_id)
    res.render('clinician/dashboard.hbs', { layout: 'clinician-layout.hbs' });
}

module.exports = {
    getDashboardData
}