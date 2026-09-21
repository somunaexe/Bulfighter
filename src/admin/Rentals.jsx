import { useState, useEffect } from "react";
import { format } from "date-fns"
import { getRentalRequests } from "../api/equipmentRentals.js"
import { EQUIPMENT_CATALOG } from "../constants/rentals.js"

const equipmentNameById = new Map(EQUIPMENT_CATALOG.map((item) => [item.id, item.name]))

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loaded, setLoaded] = useState(false)

    const loadRentals = async () => {
        const rentals = await getRentalRequests()
        const sorted = rentals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        setRentals(sorted);
        setLoaded(true)
    }

    useEffect(() => {
        loadRentals();
    }, [])

    return (
        <div className="surface-card mb-20">
            <section className="c-space py-10">
                <h3 className="head-text text-center">Equipment Rental Requests</h3>
                <br/>
                {rentals.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-black-500">
                        <table className="table-auto border-collapse w-full">
                            <thead>
                                <tr>
                                    <th className="table-head-cell">Requested</th>
                                    <th className="table-head-cell">Full Name</th>
                                    <th className="table-head-cell">Email</th>
                                    <th className="table-head-cell">Phone Number</th>
                                    <th className="table-head-cell">Equipment</th>
                                    <th className="table-head-cell">Pickup</th>
                                    <th className="table-head-cell">Return</th>
                                    <th className="table-head-cell">Notes</th>
                                    <th className="table-head-cell">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentals.map((rental, index) => {
                                    const { rentalId, timestamp, fullName, email, phoneNumber, equipmentIds, startDate, endDate, notes, status } = rental;
                                    return (
                                        <tr key={rentalId || index}>
                                            <td className="table-cell">
                                                {format(new Date(timestamp), "eeee, MMM d, yyyy, HH:mm:ss")}
                                            </td>
                                            <td className="table-cell">{fullName}</td>
                                            <td className="table-cell">
                                                <a className="table-link" href={`mailto:${email}`}>{email}</a>
                                            </td>
                                            <td className="table-cell">{phoneNumber}</td>
                                            <td className="table-cell">
                                                {(equipmentIds ?? []).map((id) => (
                                                    <p key={id}>{equipmentNameById.get(id) ?? id}</p>
                                                ))}
                                            </td>
                                            <td className="table-cell">{format(new Date(startDate), "eee, MMM d, yyyy")}</td>
                                            <td className="table-cell">{format(new Date(endDate), "eee, MMM d, yyyy")}</td>
                                            <td className="table-cell">{notes || '-'}</td>
                                            <td className="table-cell">{status}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                {rentals.length < 1 && !loaded && (
                    <p className="text-white-600 text-3xl">Loading...</p>
                )}
                {rentals.length < 1 && loaded && (
                    <p className="text-white-600 text-3xl">No rental requests yet</p>
                )}
            </section>
        </div>
    )
}

export default Rentals;
