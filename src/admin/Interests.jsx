import {useState, useEffect} from "react";
import { format } from "date-fns"
import ConfirmModal from "../components/ConfirmModal";

const Interests = () => {
    const [interests, setInterests] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [topicId, setTopicId] = useState("")
    const [role, setRole] = useState("judges")
    const [currentInterestId, setCurrentInterestId] = useState("")
    const [email, setEmail] = useState('')
    const [consentMessage, setConsentMessage] = useState('')
    const [consentError, setConsentError] = useState('')
    const [sending, setSending] = useState(false)
    const loadInterests = async () => {
        const response = await fetch("https://9rbgl7kyu7.execute-api.eu-north-1.amazonaws.com/dev",
            {
                method: "GET",
                headers: { "Accept" : "application/json" }
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json()
        const sortedInterests = data.interests.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))
        console.log(sortedInterests)
        setInterests(sortedInterests);
        // setLoaded(false)
    }

    const requestConsent = async(e) => {
        e.preventDefault()
        if (sending) return
        setSending(true)
        setConsentMessage('')
        setConsentError('')
        const currentTime = new Date().toISOString()

        try {
            const res = await fetch("https://x12ex8za7c.execute-api.eu-north-1.amazonaws.com/dev/",
                {
                    method: "POST",
                    headers: { "Content-Type" : "application/json" },
                    body: JSON.stringify({interestId: currentInterestId, email: email, topicId: topicId.trim(), role: role, currentTime: currentTime})
                }
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setConsentMessage(data.message || "Consent form sent")
            setTopicId('')
            setRole('judges')
        } catch (err) {
            console.error("Error:", err)
            setConsentError("Something went wrong sending the consent form. Please try again.")
        } finally {
            setSending(false)
        }
    }

    useEffect(() =>{
        loadInterests();
    },[])

    return (
        <div className="surface-card mb-20">
            <section className="c-space py-10">
                <h3 className="head-text text-center">Interests</h3>
                <br/>

                <ConfirmModal isOpen={modalIsOpen}>
                    <button type="button" className="bg-red-500 font-medium text-white h-8 w-8 rounded-full flex items-center justify-center"
                        onClick={() => {
                            setModalIsOpen(false)
                            setCurrentInterestId('')
                            setTopicId('')
                            setRole('judges')
                            setEmail('')
                            setConsentMessage('')
                            setConsentError('')
                        }}
                    >
                        x
                    </button>
                    <form className="mt-12 flex flex-col space-y-7 z-10 relative">
                        {consentMessage && <p className="text-green-500">{consentMessage}</p>}
                        {consentError && <p className="text-red-500">{consentError}</p>}
                        <label className="space-y-3">
                            <p className="field-label">Topic ID <span className='text-red-500'>*</span></p>
                            <input type="text" name="id" value={topicId} onChange={(e) => setTopicId(e.target.value)} required
                                className="field-input" placeholder="ex., 5 (see the Topics tab for the number)"/>
                        </label>

                        <label className="space-y-3">
                            <p className="field-label">Role <span className='text-red-500'>* </span></p>
                            <select
                                name="role" value={role} onChange={(e) => setRole(e.target.value)} required
                                className="field-input"
                            >
                                <option value="judges">Judge</option>
                                <option value="contestants">Contestant</option>
                                <option value="castMembers">Cast Member</option>
                                <option value="crew">Crew</option>
                            </select>
                        </label>

                        <p className="text-white">Are you sure you want to send the consent form?</p>
                        <button type="submit" className="btn" onClick={requestConsent} disabled={sending}>
                            {sending ? 'Sending...' : 'Yes'}
                        </button>
                    </form>
                </ConfirmModal>

                {interests.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-black-500">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr>
                                        <th className="table-head-cell">Send Consent form?</th>
                                        <th className="table-head-cell">S/N</th>
                                        <th className="table-head-cell">Full Name</th>
                                        <th className="table-head-cell">Time Applied</th>
                                        <th className="table-head-cell">Age</th>
                                        <th className="table-head-cell">Email</th>
                                        <th className="table-head-cell">Phone Number</th>
                                        <th className="table-head-cell">Social(s)</th>
                                        <th className="table-head-cell">Allergies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interests.map((interest, index) => {
                                    const { interestId, timestamp, fullName, age, email, phoneNumber, social, allergies} = interest;
                                    return (
                                        <tr key={interestId || index}>
                                            <td className="table-cell">
                                                <div className="flex justify-center">
                                                    <button className="btn m-0 hover:bg-black-500"
                                                        onClick={() => {
                                                            setCurrentInterestId(interestId)
                                                            setModalIsOpen(true)
                                                            setEmail(email)
                                                        }}
                                                    >Cast?</button>
                                                </div>
                                            </td>

                                            <td className="table-cell">{index+1}</td>
                                            <td className="table-cell">{fullName}</td>
                                            <td className="table-cell">
                                                {format(new Date(timestamp), "eeee, MMM d, yyyy, HH:mm:ss")}
                                            </td>
                                            <td className="table-cell">{age}</td>
                                            <td className="table-cell">
                                                <a className="table-link" href={`mailto:${email}`}>
                                                    {email}
                                                </a>
                                            </td>
                                            <td className="table-cell">{phoneNumber}</td>
                                            <td className="table-cell">
                                                {social ?
                                                    <a href={social} target="_blank" rel="noreferrer" className="table-link">link</a>
                                                :
                                                    ''
                                                }
                                            </td>
                                            <td className="table-cell">{allergies}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )
                }
                {interests.length < 1 && (
                    <p className="text-white-600 text-3xl">Loading...</p>
                )}
            </section>
        </div>
    )
}

export default Interests;