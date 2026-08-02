import { useRef, useState, useEffect } from 'react'
import DVDLogo from '../components/DVDLogo.jsx';
// import base64Orders from '../components/FoodOrders.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { createInterest } from '../api/interests.js'

const Contact = () => {
    const formRef = useRef();
    const join = document.getElementById("join");

    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [spotify, setSpotify] = useState([])
    const [uploadingItems, setUploadingItems] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadedPerc, setUploadedPerc] = useState(0)
    const [dots, setDots] = useState(1);

    const [form, setForm] = useState({
        name: '',
        age: '',
        email: '',
        phoneNumber: '',
        social: '',
        allergies: '',
        takes: '',
    })

    const orderInputRef = useRef(null);
    const spotifyInputRef = useRef(null);

    const handleChange = ({ target: { name, value }}) => {
        setForm({ ...form, [name]: value })
    }

    const handleOrderChange = (e) => {
        const orderArray = Array.from(e.target.files)
        setOrders(orderArray)
        console.log(orders)
    }

    const handleSpotifyChange = (e) => {
        const spotifyArray = Array.from(e.target.files)
        setSpotify(spotifyArray)
        console.log(spotify)
    }

    const handleFileUpload = async (urls, fileSec) => {
        setUploading(true)

        await Promise.all (
            urls.map(async ({ fileName, url })=> {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    xhr.open("PUT", url);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percent = Math.round((event.loaded / event.total) * 100);
                            setUploadedPerc(percent);
                        }
                    };

                    xhr.onload = () => {
                        setUploadedPerc(0);  // reset bar for next file
                        resolve(true);        // 🔥 NOW the Promise finishes properly
                    };

                    xhr.onerror = () => {
                        alert("Upload failed.");
                    };

                    let file = null
                    if (fileSec == 'orders') {
                        file = orders.find(f => f.name === fileName);
                        setUploadingItems('orders 🍕')
                    } else if (fileSec == 'spotify'){ 
                        file = spotify.find(f => f.name === fileName) 
                        setUploadingItems('spotify wrapped 🎶')
                    }
                    xhr.send(file);
                })
            })
        )
        
        

        // await Promise.all(
        //     urls.map(async ({ fileName, url }, index) => {
        //         let file = null

        //         if (fileSec == 'orders') {
        //             file = orders.find(f => f.name === fileName);
        //         } else if (fileSec == 'spotify'){ 
        //             file = spotify.find(f => f.name === fileName) 
        //         }
        //         await fetch(url, {
        //             method: "PUT",
        //             body: file
        //         });
        //         setUploadedPerc(Math.floor(((index + 1)/ urls.length) * 100))
        //     })
        // );
        setUploading(false)
        setUploadedPerc(0)
    }

    useEffect(() => {
        if (uploading) { // animate only while ConfirmModal is open
            const interval = setInterval(() => {
            setDots(prev => (prev === 3 ? 1 : prev + 1)); // cycles 1 → 2 → 3 → 1
            }, 500); // change dots every 500ms

            return () => clearInterval(interval); // cleanup when uploading stops
        } else {
            setDots(1); // reset when modal closes
        }
        }, [uploading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
        console.log(orders)
        setLoading(true);
        setMessage({});
        
        const enquiry = {
            fullName: form.name.trim(),
            age: form.age.toString().trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
            social: form.social.trim() || '',
            allergies: form.allergies.trim() || '',
            takes: form.takes.trim() || '',
        }
        let payload = {}

        const baseTheOrder = async() => {

            payload = {
                ...enquiry,
                orderNames: orders.map(order => order.name),
                spotifyNames: spotify.map(spot => spot.name),
            }
        }
        await baseTheOrder()

        const data = await createInterest(payload);
        console.log(data)

        if (data.orderUrlsKey.length > 0) await handleFileUpload(data.orderUrlsKey, 'orders')
        if (data.spotifyUrlsKey.length > 0) await handleFileUpload(data.spotifyUrlsKey, 'spotify')

        if (!uploading) {
            setMessage(
                typeof data === "string" 
                ? { message: data } 
                : data
            );
            join?.scrollIntoView()
        }
        // reset form fields
        setForm({
            name: "",
            age: "",
            email: "",
            phoneNumber: "",
            social: "",
            allergies: "",
            takes: "",
        });

        setOrders([])
        setSpotify([])
        if (orderInputRef.current) orderInputRef.current.value = "";
        if (spotifyInputRef.current) spotifyInputRef.current.value = "";
        setLoading(false);
    }

  return (
    <section className="c-space my-20" id="join">

        <div className='relative py-10 flex justify-center items-center flex-row max-w-full overflow-hidden'>
            <video width="600" autoPlay muted loop playsInline webkit-playsinline >
                <source src="assets/website-comp.mp4" type="video/mp4"/>
            </video>
            <img src="assets/orange-name-nobg.png" alt="name" className='absolute flex-shrink min-w-0 w-full md:w-1/2 h-auto'/>
            {/* <DVDLogo /> */}
        </div>
        
        <ConfirmModal isOpen={uploading} interestKey={0}>
            <>
                <p className='text-white-800'>Uploading {uploadingItems}{'.'.repeat(dots)} Please don&apos;t leave the website</p>
                <div className="w-full bg-gray-700 h-2 rounded">
                    <div
                        className="bg-green-500 h-2 rounded"
                        style={{ width: `${uploadedPerc}%` }}
                    />
                </div>
            </>
        </ConfirmModal>

        <div className="relative min-h-screen flex items-center justify-center flex-col py-10 bg-black-300/90 rounded-lg shadow-2xl backdrop-blur-md">
            <div className="contact-container">
                <h3 className="head-text">Join Us</h3>
                <p className="text-lg text-white-600 mt-3">
                    If you would like to be part of the Bulfighter show, please fill the form below❗️
                </p><br></br>
                <p className='text-white-600'>If you haven&apos;t read the onboarding sheet, please <a className='link-accent' href='https://docs.google.com/document/d/1iujC1jHTHEVaA7ThfKiUDzcZGGab2137IpTxAjiGhHE/edit?tab=t.0#heading=h.fxnb7f3ekm4h' target='_blank' rel="noreferrer">click here</a> so you know what to expect and how to apply properly.</p>
                {/* CONFIRMATION OR FAILURE MESSAGE */}
                {message && (
                    <p id="message" className={`text-lg ${"message" in message ? "text-green-500" : "text-red-500"} mt-3 font-semibold`}>{message.message || message.error || ""}</p>
                )}
                
                <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col space-y-7 z-10 relative">
                    <label className="space-y-3">
                        <p className="field-label">Full Name <span className='text-red-500'>*</span></p>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required 
                            className="field-input" placeholder="ex., John Doe"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label">Age <span className='text-red-500'>*</span></p>
                        <input type="text" name="age"  value={form.age} onChange={handleChange} onInput={(e) => {e.target.value = e.target.value.replace(/\D/g, '')}}required 
                            className="field-input" placeholder="ex., 00"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label">Email address <span className='text-red-500'>*</span></p>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required 
                            className="field-input" placeholder="ex., johndoe@gmail.com"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label">Phone Number <span className='text-red-500'>* </span>(include the country code)</p>
                        <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required rows={5} 
                            className="field-input" placeholder="ex., +44 1234 1234"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label">Social(s)</p>
                        <input type="url" name="social" value={form.social} onChange={handleChange} rows={5} 
                            className="field-input" placeholder="ex., https://www.social.com/user"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label">Allergies</p>
                        <input type="text" name="allergies" value={form.allergies} onChange={handleChange} rows={5} 
                            className="field-input" placeholder="ex., nuts"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label"><b>Hot takes</b></p>
                        <textarea type="text" name="takes" value={form.takes} onChange={handleChange} rows={5} 
                            className="field-input" 
                            placeholder="Please write your 3 hot takes, each on a new line"
                        />
                    </label>

                    <label className="space-y-3">
                        <p className="field-label"><b>Food Order History </b></p>
                        <p className='field-label'>Please upload screenshots of your 10 most recent orders from Uber Eats, Deliveroo, and/or Just Eat.<br></br>If it fails to upload, please send it to rankandmatch@gmail.com</p>
                        <input type="file" accept="image/*,video/*" multiple name="orders" onChange={handleOrderChange} ref={orderInputRef} className="field-input" />
                    </label>

                    {/* <label className="space-y-3">
                        <p className="field-label"><b>Spotify Wrapped </b></p>
                        <p className='field-label'>Please upload your Spotify Wrapped recording and Wrapped Top List.<br></br>If it fails to upload, please send it to rankandmatch@gmail.com</p>
                        <input type="file" accept="image/*,video/*" multiple name="spotify" onChange={handleSpotifyChange} ref={spotifyInputRef} className="field-input" />
                    </label> */}

                    <button className="field-btn hover:bg-[rgb(var(--theme-accent))] transition-colors" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : uploading ? 'Uploading files' : 'Show your interest'}
                        <img src="/assets/arrow-up.png" alt="arrow-up" className="field-btn_arrow"/>
                    </button>
                </form>
            </div>
        </div>
    </section>
  )
}

export default Contact