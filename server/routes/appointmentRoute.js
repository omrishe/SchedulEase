
async function insertAppointment(data) {
    if (!data.date || !data.email) throw new Error("Missing fields");
    return insert(data, "appointments");
  }