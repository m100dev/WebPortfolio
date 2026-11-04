// "2026-11-04" -> "Nov 4, 2026". Noon local time so the date never slips a day across time zones.
const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export default formatDate
