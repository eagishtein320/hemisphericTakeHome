import React, { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";

export default function RandomUserCard({ handleClick, person }) {
  const [profilePhoto, setProfilePhoto] = useState(null)
  const fetchRandomUser = async () => {
    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      const user = data.results[0];
      setProfilePhoto(user.picture.large)
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);


  return (
    <Container 
    className="user-button-container">
      {person && (
        <Button
          key={person.id}
          variant="contained"
          onClick={() => handleClick(person)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "10px" }}
        >
          <img src={profilePhoto} alt="User" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
          {person.name}, {person.age}
        </Button>
      )}
    </Container>
  );
}
