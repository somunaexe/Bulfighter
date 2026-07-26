import {useState, useEffect} from "react";
import { format } from "date-fns"

const Consents = () => {
    const [consents, setConsents] = useState([]);
    const [loaded, setLoaded] = useState([])
    const loadConsents = async (e) => {
        const response = await fetch("https://9llxstbhji.execute-api.eu-north-1.amazonaws.com/dev",
            {
                method: "GET",
                headers: { "Accept" : "application/json" }
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json()
        setConsents(data.consents);
        setLoaded(true)
    }

    useEffect(() =>{
        loadConsents();
    },[])
    return (
        <div className="surface-card mb-20">
            <section className="c-space py-10">
                <h3 className="head-text text-center">Consents</h3>
                <br/>
                {consents.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-black-500">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr>
                                        <th className="table-head-cell">S/N</th>
                                        <th className="table-head-cell">Full Name</th>
                                        <th className="table-head-cell">Time Consented</th>
                                        <th className="table-head-cell">Role</th>
                                        <th className="table-head-cell">Age</th>
                                        <th className="table-head-cell">Email</th>
                                        <th className="table-head-cell">Phone Number</th>
                                        <th className="table-head-cell">Social(s)</th>
                                        <th className="table-head-cell">Allergies</th>

                                        {/* GUARDIAN INFORMATION */}
                                        <th className="table-head-cell">Guardian&apos;s Name</th>
                                        <th className="table-head-cell">Guardian&apos;s Age</th>
                                        <th className="table-head-cell">Guardian&apos;s Email</th>
                                        <th className="table-head-cell">Guardian&apos;s Phone Number</th>
                                        <th className="table-head-cell">Guardian&apos;s Allergies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consents.map((consent, index) => {
                                    const { consentId, timestamp, fullName, age, email, phoneNumber, social, allergies, guardianName, guardianAge, guardianEmail, guardianPhoneNumber, guardianAllergies, role} = consent;

                                    return (
                                        <tr key={consentId || index}>
                                            <td className="table-cell">{index+1}</td>
                                            <td className="table-cell">{fullName}</td>
                                            <td className="table-cell">
                                                {format(new Date(timestamp), "eeee, MMM d, yyyy, HH:mm:ss")}
                                            </td>
                                            <td className="table-cell">{role}</td>
                                            <td className={`table-cell ${Number(age) < 18 ? '!text-red-500' : ''}`}>{age}
                                            </td>
                                            <td className="table-cell">
                                                <a className="table-link" href={`mailto:${email}`}>
                                                    {email}
                                                </a>
                                            </td>
                                            <td className="table-cell">{phoneNumber}</td>
                                            <td className="table-cell">
                                                {social ?
                                                    <a href={social} target="_blank" rel="noreferrer" className="table-link">social</a>
                                                :
                                                    <p>Not Provided</p>
                                                }
                                            </td>
                                            <td className="table-cell">
                                                {allergies}
                                            </td>
                                            <td className="table-cell">
                                                {guardianName}
                                            </td>
                                            <td className={`table-cell ${Number(guardianAge) < 18 ? '!text-red-500' : '!text-green-500'}`}>{guardianAge}
                                            </td>
                                            <td className="table-cell">
                                                <a className="table-link" href={`mailto:${guardianEmail}`}>
                                                    {guardianEmail}
                                                </a>
                                            </td>
                                            <td className="table-cell">
                                                {guardianPhoneNumber}
                                            </td>
                                            <td className="table-cell">
                                                {guardianAllergies}
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )
                }
                {consents.length < 1 && !setLoaded &&(
                    <p className="text-white-600 text-3xl">Loading...</p>
                )}

                {consents.length < 1 && setLoaded &&(
                    <p className="text-white-600 text-3xl">No consents found</p>
                )}
            </section>
        </div>
    )
}

export default Consents;