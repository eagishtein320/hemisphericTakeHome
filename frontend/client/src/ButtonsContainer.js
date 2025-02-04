import UserCard from "./UserCard"
import { Typography } from "@mui/material";

export default function ButtonsContainer({persons, handleClick}){
    
    return <div className="buttons-container">
        <Typography className="buttons-container-header" variant="h3">Users</Typography>
        {persons.map((person)=> <UserCard person={person} handleClick={handleClick} key={person.id}/>
        )}
    </div>
}