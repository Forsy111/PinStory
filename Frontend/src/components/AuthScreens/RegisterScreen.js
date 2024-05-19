import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css/Register.css"
const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 8000);
      return setError("Пароли не совпадают");
    }
    try {
      const { data } = await axios.post(
        "/auth/register",
        {
          username,
          email,
          password,
        }
      );
      localStorage.setItem("authToken", data.token);

      setTimeout(() => {
        navigate('/');
      }, 1800)
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 6000);
    }
  };

  return (

    <div className="Inclusive-register-page">
      <div className="register-big-wrapper">
        <div className="register-banner-section ">
          <img src="register.png" alt="banner" width="490px" />
        </div>
        <div className="section-wrapper">
          <div className="top-suggest_login">
            <span> У вас есть аккаунт? </span>
            <a href="/login">Войти</a>
          </div>
          <div className="top-register-explain">
            <h2>Приветствуем в PinStory </h2>
            {/* <p>
              It's easy and free to post your thinking on any topic and connect with thounsands of readers.
            </p> */}
          </div>
          <form onSubmit={registerHandler} >
            {error && <div className="error_message">{error}</div>}
            <div className="input-wrapper">
              <input
                type="text"
                required
                id="name"
                placeholder="Введите ваше имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="name">Имя</label>
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                required
                id="email"
                placeholder="example@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                tabIndex={1}
              />
              <label htmlFor="email">E-mail</label>
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                required
                id="password"
                autoComplete="true"
                placeholder="6+ символов"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                tabIndex={2}
              />
              <label htmlFor="password">
                Пароль
              </label>
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                required
                id="confirmpassword"
                autoComplete="true"
                placeholder="Подтвердите пароль"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmpassword">Подтвердите пароль</label>
            </div>
            <button type="submit" >
              Регистрация
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;