import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./login.module.scss"
import google from "../../assets/google.svg"
import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/workflow");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (


    
<div className={style.loginContainer}>
      <div className={style.subContainer}>
        <p className={style.welcome}>WELCOME BACK!</p>
        <span className={style.login}>Log In to your Account</span>
      </div>
      <div className={style.loginModule}>
      <form className={style.loginModule} onSubmit={handleLogin}>
        <div className={style.loginEmail}>
        <label htmlFor="email">Email</label>
          <input className={style.input} type="email" placeholder="Type here.." value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={style.loginEmail}>
        <label htmlFor="email">Password</label>
          <input  className={style.input} type="password" placeholder="Type here.." value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
    <div className={style.forgot}>
    <div>
    <label className={style.checkboxcontainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className={style.checkboxInput}
      />
      <span className={style.checkboxlabel}>Remember Me</span>
    </label>
  </div>
      <span>forgot password</span>
      </div>      
  
    <button className={style.LoginButton} type="submit">Login</button>
      </form>
</div>
 <div className={style.sociallogincontainer}>
      <div className={style.divider}>
        <span>Or</span>
      </div>
      <button className={style.socialbutton}>
      <img src={google}  alt="Google" />


        Log-In with Google
      </button>
      <button className={style.socialbutton}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
        Log-In with Facebook
      </button>
      <button className={style.socialbutton}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
        Log-In with Apple
      </button>
      {/* <p className={style.signup-text}>
        New User?
      </p> */}
    </div>
    
    </div>
  );
};

export default Login;
