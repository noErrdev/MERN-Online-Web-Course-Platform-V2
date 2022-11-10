import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosConfig from "../../util/axiosConfig";
import "./CoursePage.css";

export default function CoursePage({ isAuth }) {
  const { courseid } = useParams();
  const [courseInfo, setCourseInfo] = useState([]);
  const [courseStart, setCourseStart] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const bookCourse = async () => {
    /// check ob user eingelogged ist
    // true:
    if (isAuth) {
      // id params -(learningDeskId)
      // body course_id
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const url = "/user";
        const jwt = localStorage.getItem("jwt");
        if (userId && jwt) {
          const userData = await axiosConfig.get(`${url}/${userId}`, {
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          });
          const learningDeskId = userData.data.myLearningDesk._id;
          console.log("learningDeskId", learningDeskId);
          if (learningDeskId) {
            const lDeskData = await axiosConfig.patch(
              `/mylearningdesk/${learningDeskId}`,
              { courseId: courseid },
              {
                headers: {
                  authorization: `Bearer ${jwt}`,
                },
              }
            );
            console.log("lDeskData", lDeskData);
            //navigate('/dashboard');
            navigate("/"); // TODO dashboard
          }
          setLoading(false);
          setHasError(false);
          console.log("book new course");
        }
      } catch (error) {
        setLoading(false);
        setHasError(true);
      }
    } else {
      // to do save courseId????
      navigate("/login");
    }
  };

  const getInfo = async (url) => {
    try {
      setLoading(true);
      const apiData = await axiosConfig.get(`${url}/${courseid}`);
      setCourseInfo(apiData.data);
      const calcDate = new Date(apiData.data.dateOfStart);
      const day = calcDate.getUTCDate();
      const months = calcDate.getUTCMonth() + 1;
      const year = calcDate.getFullYear();
      const startDate = `${day.toString().length === 1 ? `0${day}` : day}.${
        months.toString().length === 1 ? `0${months}` : months
      }.${year}`;
      setCourseStart(startDate);
      setLoading(false);
      setHasError(false);
    } catch (error) {
      setLoading(false);
      setHasError(true);
    }
  };

  useEffect(() => {
    getInfo("/courses");
  }, []);
  return (
    <div className="coursePageWrapper-body">
      {loading ? (
        <div id="load" data-testid="loading">
          <div>G</div>
          <div>N</div>
          <div>I</div>
          <div>D</div>
          <div>A</div>
          <div>O</div>
          <div>L</div>
        </div>
      ) : hasError ? (
        <div className="error-message"></div>
      ) : (
        <div className="coursePageWrapper">
          <div className="coursePageTopWrapper">
            <div className="coursePageCard">
              <div className="cardPageHeader">
                <img
                  className="cardPageIcon"
                  src={courseInfo.courseIcon}
                  alt={courseInfo.courseName}
                />
                <div className="cardPageTextHeader">
                  <h3 className="coursePageNameCard">
                    {courseInfo.courseName}
                  </h3>
                  <h5 className="coursePageDurationCard">{`${courseInfo.courseType} | ${courseInfo.courseDuration} months`}</h5>
                </div>
              </div>
              <p className="coursePageTextCard">
                {courseInfo.courseDescription}
              </p>
              <div className="buy-btn-wrapper" onClick={() => bookCourse()}>
                <p>book now</p>
                <div className="buy-btn-icon">
                  <svg
                    width="35"
                    height="40"
                    viewBox="0 0 35 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 17.5H5V15H7.5V17.5ZM25 17.5H10V15H25V17.5ZM5 22.5H7.5V25H5V22.5ZM10 22.5H25V25H10V22.5ZM7.5 10H5V7.5H7.5V10ZM25 10H10V7.5H25V10ZM35 32.5V35H30V40H27.5V35H22.5V32.5H27.5V27.5H30V32.5H35ZM2.5 32.5H20V35H0V0H30V25H27.5V2.5H2.5V32.5Z"
                      fill="#5382A1"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="coursePagePicture">
              <img src={courseInfo.courseImage} alt={courseInfo.courseName} />
            </div>
          </div>
          <div className="coursePageBottomWrapper">
            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">01 | Start date</p>
                <p className="courseDetailsText">{courseStart}</p>
              </div>
            </div>

            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">02 | Costs</p>
                <p className="courseDetailsText">
                  An education voucher can be used for this course.
                </p>
              </div>
            </div>

            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">03 | Requirements</p>
                <p className="courseDetailsText">
                  No coding experience required.
                </p>
              </div>
            </div>

            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">04 | Duration</p>
                <p className="courseDetailsText">
                  {`${courseInfo.courseDuration} months`}
                </p>
              </div>
            </div>

            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">05 | Place</p>
                <p className="courseDetailsText">
                  Throughout Germany - courses take place online
                </p>
              </div>
            </div>

            <div className="courseDetailsItem">
              <div className="courseDetailsIcon"></div>
              <div className="courseDetailsDescr">
                <p className="courseDetailsTitle">06 | Language</p>
                <p className="courseDetailsText">
                  English or German - minimum level B1
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
