import {useState, useEffect} from "react";
import { format } from "date-fns"

const Topics = () => {
    const [topics, setTopics] = useState([]);
    const [loaded, setLoaded] = useState(false)
    const loadTopics = async (e) => {
        const response = await fetch("https://m0umxkjpy6.execute-api.eu-north-1.amazonaws.com/dev",
            {
                method: "GET",
                headers: { "Accept" : "application/json" }
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json()
        const sortedTopics = data.topics.sort((a,b) => new Number(a.serialNumber) - new Number(b.serialNumber))
        console.log(sortedTopics)
        setTopics(sortedTopics);
        setLoaded(true)
    }

    useEffect(() =>{
        loadTopics();
    },[])

    return (
        <div className="surface-card mb-20">
            <section className="c-space py-10">
                <h3 className="head-text text-center">Topics</h3>
                <br/>
                {topics.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-black-500">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr>
                                        <th className="table-head-cell">S/N</th>
                                        <th className="table-head-cell">Topic</th>
                                        <th className="table-head-cell">Special</th>
                                        <th className="table-head-cell">Shot</th>
                                        <th className="table-head-cell">Location</th>
                                        <th className="table-head-cell">Time</th>
                                        <th className="table-head-cell">Uploaded</th>
                                        <th className="table-head-cell">Judges</th>
                                        <th className="table-head-cell">Contestants</th>
                                        <th className="table-head-cell">Crew</th>
                                        <th className="table-head-cell">Special Members</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics.map((topicParam, index) => {
                                    const {serialNumber, Topic, Special, Shot, Location, Time, Uploaded, judges, contestants, crew, castMembers} = topicParam;

                                    return (
                                        <tr key={serialNumber || index}>
                                            <td className="table-cell">{serialNumber}</td>
                                            <td className="table-cell">{Topic}</td>
                                            <td className="table-cell">{Special ? 'Yes' : 'No'}</td>
                                            <td className="table-cell">{Shot ? 'Yes' : 'No'}</td>

                                            <td className="table-cell">
                                                {Location ? `${Location}`
                                                : 'Location TBC'
                                                }
                                            </td>
                                            <td className="table-cell">
                                                {Time ? `${format(new Date(Time), "eeee, MMM d, yyyy, HH:mm:ss")}`
                                                : 'Time TBC'
                                                }
                                            </td>
                                            <td className="table-cell">{Uploaded ? 'Yes' : 'No'}</td>

                                            {/* CREWMATES AND CASTING INFORMATION */}
                                            <td className="table-cell">
                                                {judges?.length > 0 ? (
                                                    judges?.map((name, index) => <p key={index}>{name},</p>)
                                                ) : (
                                                    <p>No judges casted</p>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                {contestants?.length > 0 ? (
                                                    contestants?.map((name, index) => <p key={index}>{name},</p>)
                                                ) : (
                                                    <p>No contestants casted</p>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                {crew.length > 0 ? (
                                                    crew.map((name, index) => <p key={index}>{name},</p>)
                                                ) : (
                                                    <p>No crew</p>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                {castMembers?.length > 0 ? (
                                                    castMembers?.map((name, index) => <p key={index}>{name},</p>)
                                                ) : (
                                                    <p>No special members casted</p>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )
                }
                {topics.length < 1 && !loaded && (
                    <p className="text-white-600 text-3xl">Loading...</p>
                )} 
                {topics.length < 1 && loaded && (
                    <p className="text-white-600 text-3xl">No topics found</p>
                )} 
            </section>
        </div>
    )
}

export default Topics;