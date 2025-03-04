import React, { useState, useEffect } from "react";
import ButtonsContainer from "./ButtonsContainer";
import Chart from "./Chart";

export default function App() {
  const [persons, setPersons] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchPeople = async () => {

    console.log("fetching")
    const getPeopleUrl = "http://localhost:3001/api/people";
    const response = await fetch(getPeopleUrl);
    const people = await response.json();
    setPersons(people);
  };

  useEffect(() => {

    fetchPeople();

  }, []);

  async function handleClick(person) {
    setSelected(person)
  }

  return (
    <div className="app-wrapper">
      <ButtonsContainer persons={persons} handleClick={handleClick} />
      <div className="charts-wrapper">

        {selected && <Chart key={selected.id} person={selected}/>}
      </div>
    </div>
  );


}
