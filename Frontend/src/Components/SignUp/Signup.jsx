import { tostifyError } from "../Tostify";
import actions from "../../redux/user/actions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function Signup() {
  const [email, setemail] = useState("");
  const [fullname, setfullname] = useState("");
  const [password, setpassword] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const dispatch = useDispatch();

  const Validations = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    if (fullname?.length < 3) {
      tostifyError("Please Enter Your Full Name");
      isValid = false;
    } else if (email?.length < 3 || !emailRegex.test(email)) {
      tostifyError("Please Enter a valid email");
      isValid = false;
    } else if (password?.length < 3) {
      tostifyError("Please Enter a valid password");
      isValid = false;
    }

    return isValid;
  };

  async function handlesubmit(e) {
    e.preventDefault();
    const err = await Validations();
    if (err == true) {
      await dispatch({
        type: actions.CREATE_USER,
        payload: { email, password, fullName: fullname },
      });
    }
  }

  return (
    <div className="flex justify-center h-screen">
      <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-full max-w-sm">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Sample image"
          />
        </div>
        <form className="w-full" onSubmit={handlesubmit}>
          <div className="md:w-full max-w-sm">
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
              type="text"
              placeholder="Full Name"
              required="true"
              onChange={(e) => setfullname(e.target.value)}
              value={fullname}
            />
            <input
              className="text-sm w-full px-4 py-2 border mt-4 border-solid border-gray-300 rounded"
              type="text"
              placeholder="Email Address"
              required="true"
              onChange={(e) => setemail(e.target.value)}
              value={email}
            />
            <input
              className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
              type="text"
              required="true"
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            <div className="mt-4 font-semibold text-sm">
              <p>Already Have an Account ? </p>
              <Link
                className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
                to="/signin"
              >
                Login
              </Link>
            </div>
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase w-full rounded text-xs tracking-wider"
                type="submit"
              >
                Create Account
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Signup;
