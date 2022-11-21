import { renderNewPlayerForm } from "./renderHelpers";

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2204-FTB-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


export const fetchAllPlayers = async () => {
    try { const response = await fetch(`${APIURL}/players`); 
    const result = await response.json(); 
    if (result.error) throw result.error; 
    return result.data.players; } 
    catch (err) { 
        console.error('Uh oh, trouble fetching players!', err); 
    }
};

export const fetchSinglePlayer = async (playerId) => {
    try{
        const response = await fetch(`${APIURL}/players/${playerId}`)
        const result = await response.json();
        if (result.error) throw result.error;
        return result.data.player
    } catch(err) {
        console.err("Trouble fetching single player", err)
    }
};

export const addNewPlayer = async (playerObj) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...playerObj }),
    };
    console.log(options);
    try {
      const response = await fetch(`${APIURL}players/`, options);
      const result = await response.json();
      if (result.error) throw result.error;
      return result.data.player;
    } catch (err) {
      console.error("Request Failed", err);
    }
  };

  export const removePlayer = async (playerId) => {
    try {
      const response = await fetch(`${APIURL}players/${playerId}`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.error) throw result.error;
      return result.data.player;
    } catch (err) {
      console.error("Request Failed", err);
    }
  };
