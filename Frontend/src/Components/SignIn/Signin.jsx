import { tostifyError } from "../Tostify";
import actions from "../../redux/user/actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [passshow, setpassShow] = useState(false);
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

    if (email?.length < 3 || !emailRegex.test(email)) {
      tostifyError("Please Enter a valid email");
      isValid = false;
    } else if (password?.length < 3) {
      tostifyError("Please Enter a valid password");
      isValid = false;
    }

    return isValid;
  };

  async function handleClick(e) {
    e.preventDefault();
    const err = await Validations();
    if (err == true) {
      await dispatch({
        type: actions.SIGN_IN,
        payload: { email, password },
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
        <form className="w-full" onSubmit={handleClick}>
          <div className="md:w-full max-w-sm">
            <div>
              <input
                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
                type="email"
                onChange={(e) => setemail(e.target.value)}
                value={email}
                placeholder="Email Address"
                required="true"
              />
            </div>
            <div className="relative">
              <input
                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                type={passshow ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setpassword(e.target.value)}
                value={password}
                required="true"
              />
              {passshow ? (
                <EyeSlashIcon
                  onClick={() => setpassShow(!passshow)}
                  className="w-5 absolute cursor-pointer right-2 top-[1.6rem]"
                />
              ) : (
                <EyeIcon
                  onClick={() => setpassShow(!passshow)}
                  className="w-5 absolute right-2  cursor-pointer top-[1.6rem]"
                />
              )}
            </div>
            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase w-full rounded text-xs tracking-wider"
                type="submit"
              >
                Login
              </button>
            </div>
            <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
              Don&apos;t have an account?{" "}
              <Link
                className="text-red-600 hover:underline hover:underline-offset-4"
                to="/signup"
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SignIn;
