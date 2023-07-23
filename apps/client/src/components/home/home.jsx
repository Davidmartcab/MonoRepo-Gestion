import React, { useEffect, useState } from "react";
import "../../styles/home.scss";

function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [error, setError] = useState("");
  const [newPay, setNewPay] = useState({
    title: "",
    payer: "",
    amount: 0,
    debtors: [],
  });
  const [auxDebtor, setAuxDebtor] = useState("");

  useEffect(() => {
    const context = JSON.parse(localStorage.getItem("context"));
    if (!context || !context.T || !context.C) {
      window.location.href = "/";
    }
    setCode(context.C);
    fetch("/api/names", {
      headers: {
        token: context.T,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.data) {
          window.location.href = "/";
          return;
        }
        setNames(data.data);
      })
      .then(() => setLoading(false));
  }, []);

  const handleGoBack = () => {
    window.location.href = "/";
  };

  const handleAddDebtor = () => {
    setError("");
    if (auxDebtor === "") {
      setError("Debe seleccionar un nombre");
      return;
    }

    if (newPay.debtors.includes(auxDebtor)) {
      setAuxDebtor("");
      return;
    }
    setNewPay({ ...newPay, debtors: [...newPay.debtors, auxDebtor] });
    setAuxDebtor("");
  };

  const handleRemoveName = (name) => {
    setNewPay({ ...newPay, debtors: newPay.debtors.filter((n) => n != name) });
  };

  const handleCreatePay = () => {
    setError("");
    if (newPay.title === "") {
      setError("Debe ingresar un titulo");
      return;
    }
    if (newPay.payer === "") {
      setError("Debe seleccionar un pagador");
      return;
    }
    if (newPay.amount <= 0) {
      setError("Debe ingresar una cantidad");
      return;
    }
    if (newPay.debtors.length === 0) {
      setError("Debe seleccionar al menos un moroso");
      return;
    }
    const context = JSON.parse(localStorage.getItem("context"));
    setLoading(true);
    fetch("/api/items", {
      method: "POST",
      headers: {
        token: context.T,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPay),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.token) {
          window.location.href = "/";
          return;
        }
        setNewPay({ title: "", payer: "", amount: 0, debtors: [] });
        setAuxDebtor("");
        setError("Ingresado correctamente");
      })
      .then(() => setLoading(false));
  };

  return (
    <div>
      <div className="home">
        {loading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <header className="home__header">
              <div className="home__header__title">
                Cuenta:{" "}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                  }}
                >
                  {code}
                </span>
              </div>
              <img
                className="home__header__button"
                src="./go-back.svg"
                alt="add"
                onClick={() => handleGoBack()}
              />
            </header>
            <div className="home__container">
              <div className="home__container__input">
                <label>Titulo</label>
                <input
                  type="text"
                  placeholder="Titulo"
                  value={newPay.title}
                  onChange={(e) =>
                    setNewPay({ ...newPay, title: e.target.value })
                  }
                />
              </div>
              <div className="home__container__listinput">
                <label>Pagador</label>
                <select
                  value={newPay.payer}
                  onChange={(e) =>
                    setNewPay({ ...newPay, payer: e.target.value })
                  }
                >
                  <option value=""></option>
                  {names.map((name, key) => (
                    <option value={name} key={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="home__container__input">
                <label>Cantidad</label>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={newPay.amount}
                  onChange={(e) =>
                    setNewPay({ ...newPay, amount: e.target.value })
                  }
                />
              </div>
              <div className="home__container__listinput">
                <label>Morosos</label>
                <div className="home__container__listinput__subconteiner">
                  <select
                    value={auxDebtor}
                    onChange={(e) => setAuxDebtor(e.target.value)}
                  >
                    <option value=""></option>
                    {names.map((name, key) => (
                      <option value={name} key={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <img
                    className="create__container__forNames__button"
                    src="./add-icon.svg"
                    alt="add"
                    onClick={() => handleAddDebtor()}
                  />
                </div>
              </div>
              <div className="home__container__list">
                {newPay.debtors.map((debtor, key) => (
                  <div className="home__container__list__item" key={key}>
                    <div className="home__container__list__item__name">
                      {debtor}
                    </div>
                    <img
                      className="home__container__list__item__button"
                      src="./delete-icon.svg"
                      alt="add"
                      onClick={() => handleRemoveName(debtor)}
                    />
                  </div>
                ))}
              </div>
              <div className="home__container__error">{error}</div>
              <button
                className="home__container__button"
                onClick={() => handleCreatePay()}
              >
                Crear
              </button>
            </div>
            <button className="home__button">Ver Pagos / Deudas</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
