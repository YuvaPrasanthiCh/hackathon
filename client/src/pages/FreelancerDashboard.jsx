import  { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search"; // Add this line
import { useNavigate } from "react-router";
import axios from "axios";
import "../static/css/pages/FreelancerDashboard.css";
import "../static/css/pages/ProducerDashboard.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Loading from "../components/Loading";
import ChatIcon from "@mui/icons-material/Chat";

const FreelancerDashboard = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem("role"));
    const [username, setUsername] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [appliedJobPosts, setAppliedJobPosts] = useState([]);
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

    useEffect(() => {
        axios
            .get("http://localhost:3000/details", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const role = response.data.user.payload.role;
                localStorage.setItem("role", role);
                setUserRole(role);
                setUsername(response.data.user.payload.username);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

        if (userRole === "PRODUCER") {
            navigate("/");
        }

        axios
            .get("http://localhost:3000/freelancer/get-job-posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setJobPosts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:3000/freelancer/get-applied-job-posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setAppliedJobPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    const handleProfileClick = () => {
        navigate(`/profile/${userRole}/${username}`);
    };

    const handleChatClick = () => {
        navigate(`/chat/${userRole}/${username}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Filtering job posts based on the search query
    const filteredJobPosts = jobPosts.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (token === null) {
        return (
            <div>
                <h1>
                    Unauthorized, Please Signin <a href="/signin">Here</a>
                </h1>
            </div>
        );
    } else if (userRole === "FREELANCER") {
        return (
            <>
                <div className="freelancer_navbar_container">
                    <div className="freelancer_navbar_left">
                        <a href="/freelancer-dashboard">
                            <span className="freelancer_nav_span_1" >
                               <b>FreeLance</b>
                            </span>
                            <span className="freelancer_nav_span_2">Sync</span>
                        </a>
                    </div>
                    <div className="freelancer_navbar_right">
                        <button
                            className="freelancer_chat_button"
                            onClick={handleChatClick}
                        >
                            <ChatIcon style={{ fontSize: "2rem", display: "none", }}  />
                        </button>
                        <button
                            className="freelancer_profile_button"
                            onClick={handleProfileClick}
                        >
                            <AccountCircleIcon style={{ fontSize: "2rem" }} />
                        </button>
                        <button
                            className="freelancer_logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="freelancer_dash_main_area">
                    
                    <div className="freelancer_dash_main_left_area">
                        <div className="freelancer_dash_main_left_head">
                            <span>Open Vacancies</span>
                            

<div style={{
    position: "relative", // Added relative positioning for container
    margin: "20px 0",
    display: "flex",
    justifyContent: "center",
}}>
    <input
        type="text"
        placeholder="Search for job titles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
            width: "80%",
            padding: "12px 20px 12px 40px", // Added left padding for icon space
            border: "1px solid #ccc",
            borderRadius: "25px",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onFocus={(e) => e.target.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.2)"}
        onBlur={(e) => e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"}
    />
    {/* Search Icon */}
    <SearchIcon
        style={{
            position: "absolute",
            left: "10%", // Adjust left position relative to input
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "20px",
            color: "#aaa",
        }}
    />
</div>


                        </div>
                        <div className="freelancer_dash_main_posts">
                            {filteredJobPosts.length ? (
                                filteredJobPosts.map((job) => {
                                    return (
                                        <div
                                            className="producer_dash_job_card"
                                            key={job._id}
                                            onClick={() =>
                                                navigate(`/job/${job._id}`)
                                            }
                                        >
                                            <div className="producer_dash_job_card_top">
                                                <span>{job.title}</span>
                                            </div>
                                            <div className="producer_dash_job_card_bottom">
                                                <div className="producer_dash_job_card_bottom_left">
                                                    <span>
                                                        {job.employmentType},{" "}
                                                        {job.location}
                                                    </span>
                                                </div>
                                                <div className="producer_dash_job_card_bottom_right">
                                                    <span>
                                                        Posted By{" "}
                                                        {job.producer.username}
                                                    </span>
                                                    <span>
                                                        On{" "}
                                                        {new Date(
                                                            job.postedDate
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : loading ? (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Loading />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    No Job Posts Yet
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="freelancer_dash_main_right_area">
                        <div className="freelancer_dash_main_right_head">
                            <span>Pending Connection Requests</span>
                        </div>
                        <div className="freelancer_dash_main_requests">
                            {loading ? (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Loading />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    No Pending Connection Requests
                                </div>
                            )}
                        </div>
                        <div className="freelancer_dash_main_right_head">
                            <span>Applied Jobs</span>
                        </div>
                        <div className="freelancer_dash_main_requests">
                            {appliedJobPosts.length ? (
                                appliedJobPosts.map((job) => {
                                    return (
                                        <div
                                            className="freelancer_dash_applied_jobs_cards"
                                            key={job._id}
                                            onClick={() =>
                                                navigate(`/job/${job._id}`)
                                            }
                                        >
                                            {job.title}
                                        </div>
                                    );
                                })
                            ) : loading ? (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Loading />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    No Applied Jobs Yet
                                </div>
                            )}
                        </div>
                        <div className="freelancer_dash_main_right_head">
                            <span></span>
                        </div>
                        <div className="freelancer_dash_main_requests blog">
                            {loading ? (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display:"flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      
                                    }}
                                >
                                    <Loading />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    No Blog Posts Available Right Now
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default FreelancerDashboard;






