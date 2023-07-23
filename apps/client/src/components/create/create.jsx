import React, { useEffect, useState } from "react";
import "../../styles/create.scss";
import { useGlobalContext } from "../../context/globalContext";

function Create() {
  const [validationToken, setValidationToken] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [stateStatus, setStateStatus] = useState(0);
  const [names, setNames] = useState([]);
  const [auxName, setAuxName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const context = useGlobalContext();
  const { updateContext } = useGlobalContext();

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setValidationToken(data.validationToken);
        context.VT = data.validationToken;
        updateContext(context);
      })
      .then(() => setLoading(false));
  }, []);

  const handleJoin = () => {
    setError("");
    fetch("/api/connect", {
      method: "POST",
      headers: {
        validationToken: validationToken,
        code: code,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.token) {
          setError("Código incorrecto");
          return;
        }
        updateContext({ T: data.token, C: data.code });
        window.location.href = "/home";
      });
  };

  const handleCreate = () => {
    setError("");
    if (names.length < 2) {
      setError("Debe haber al menos dos personas");
      return;
    }
    fetch("/api/create", {
      method: "POST",
      headers: {
        validationToken: validationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ names: names, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.token) {
          console.log("Error:", data.message);
          return;
        }
        updateContext({ T: data.token, C: data.code });
        window.location.href = "/home";
      });
  };

  const handleAddName = () => {
    if (auxName.length > 2) {
      if (names.includes(auxName)) return;

      setNames([...names, auxName]);
      setAuxName("");
    }
  };

  const handleRemoveName = (name) => {
    setNames(names.filter((n) => n != name));
  };

  const handleReturnState = () => {
    setError("");
    setCode("");
    setNames([]);
    setAuxName("");
    setPassword("");
    setStateStatus(0);
  };

  return (
    <div>
      {loading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="create">
          {stateStatus == 0 ? (
            <>
              <header className="create__header">
                <div className="create__header__title">Bienvenido</div>
              </header>
              <div className="create__container">
                <button
                  className="create__container__button"
                  onClick={() => setStateStatus(1)}
                >
                  Crear una cuenta
                </button>
                <button
                  className="create__container__button"
                  onClick={() => setStateStatus(2)}
                >
                  Unir a cuenta
                </button>
              </div>
            </>
          ) : stateStatus == 1 ? (
            <>
              <header className="create__header">
                <div className="create__header__title">Crear una cuenta</div>
                <img
                  className="create__header__button"
                  src="./go-back.svg"
                  alt="add"
                  onClick={() => handleReturnState()}
                />
              </header>
              <div className="create__container">
                <input
                  className="create__container__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="create__container__forNames">
                  <input
                    className="create__container__input"
                    placeholder="Nombre"
                    value={auxName}
                    onChange={() => setAuxName(event.target.value)}
                  />
                  <img
                    className="create__container__forNames__button"
                    src="./add-icon.svg"
                    alt="add"
                    onClick={() => handleAddName()}
                  />
                </div>
                <div className="create__container__names">
                  {names.map((name, key) => (
                    <div className="create__container__names__name" key={key}>
                      <div className="create__container__names__name__text">
                        {name.length > 10
                          ? name.substring(0, 10) + "..."
                          : name}
                      </div>
                      <img
                        className="create__container__names__name__button"
                        src="./delete-icon.svg"
                        alt="add"
                        onClick={() => handleRemoveName(name)}
                      />
                    </div>
                  ))}
                </div>
                <div className="create__container__error">{error}</div>
                <button
                  className="create__container__button"
                  onClick={() => handleCreate()}
                >
                  Crear una cuenta
                </button>
              </div>
            </>
          ) : (
            <>
              <header className="create__header">
                <div className="create__header__title">Unir a una cuenta</div>
                <img
                  className="create__header__button"
                  src="./go-back.svg"
                  alt="add"
                  onClick={() => handleReturnState()}
                />
              </header>
              <div className="create__container">
                <input
                  className="create__container__input"
                  placeholder="Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="create__container__error">{error}</div>
                <button
                  className="create__container__button"
                  onClick={() => handleJoin()}
                >
                  Unir a cuenta
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Create;
