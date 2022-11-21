/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2004-GHP-NY-WEB-FTcn';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


const fetchAllPlayers = async () => {
    try {
      const response = await fetch(`${APIURL}/players`);
      const result = await response.json();
      if (result.error) {
          throw result.error;
          
      }
     return result.data.players;
    } catch (error) {
    console.log("ops, something went wrong!", error);
}
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch (`${APIURL}/players/${playerId}`);
        const result = await response.json();
    if (result.error) {
        throw result.error;
    } return result.data.players;
    } catch (error) {
        console.error("Sorry, could not fetch player", error);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch (`${APIURL}players`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(playerObj)
        })
        const result = await response.json()
        return result.data.player
    } catch (error){
        console.log("Sorry, could not add a player", error);
    }
};

const removePlayer = async (playerId) => {
    try{
    const response = await fetch (`${APIURL}players/${playerId}`, {
        method: 'DELETE',
    });
    const result = await response.json();
    if (result.error) throw result.error;
    return;
}catch (error) {
    console.log(`Sorry, could not remove player ${playerId}`, error);
}
};


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
      
        const player = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(button.dataset.id);
      renderSinglePlayer(player);
      
    });
  }

  let removeButtons = [...document.getElementsByClassName('remove-button')];
  for (let i = 0; i < removeButtons.length; i++) {
    const button = removeButtons[i];
    button.addEventListener('click', async () => {
      await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);

      const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
      renderAllPlayers(players);
    });
  }
};


const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;
};
let seeAllButton = document.getElementById('see-all');
seeAllButton.addEventListener('click', async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
  renderAllPlayers(players);
});


const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {

      event.preventDefault();
      

      let playerData = {
        name: form.elements.name.value,
        breed: form.elements.breed.value,
      };
      await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(playerData);
      const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
      renderAllPlayers(players);
      form.elements.name.value = '';
      form.elements.breed.value = '';
    });
  };


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)()
  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players)

  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)()
}

init()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELFdBQVc7OztBQUcvRDtBQUNQO0FBQ0Esc0NBQXNDLE9BQU87QUFDN0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSx5Q0FBeUMsT0FBTyxXQUFXLFNBQVM7QUFDcEU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLHlDQUF5QyxPQUFPO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0EscUNBQXFDLE9BQU8sVUFBVSxTQUFTO0FBQy9EO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrREFBa0QsU0FBUztBQUMzRDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRDZGOztBQUU3RjtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDLG1DQUFtQyxPQUFPO0FBQzFDO0FBQ0Esb0JBQW9CLGFBQWEsa0JBQWtCLFNBQVM7QUFDNUQsZ0RBQWdELE9BQU87QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QiwrREFBaUI7QUFDOUM7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBO0FBQ0EsWUFBWSwwREFBWTs7QUFFeEIsNEJBQTRCLDZEQUFlO0FBQzNDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7OztBQUdPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGVBQWU7QUFDOUMsaUNBQWlDLGFBQWE7QUFDOUM7QUFDQSxpQkFBaUIsb0RBQW9EO0FBQ3JFLGtCQUFrQixnQkFBZ0I7QUFDbEMsa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNkRBQWU7QUFDdkM7QUFDQSxDQUFDOzs7QUFHTTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwwREFBWTtBQUN4Qiw0QkFBNEIsNkRBQWU7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7O1VDdkhBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ042QztBQUN3Qjs7QUFFckU7QUFDQSx3QkFBd0IsNkRBQWU7QUFDdkMsRUFBRSxpRUFBZ0I7O0FBRWxCLEVBQUUsb0VBQW1CO0FBQ3JCOztBQUVBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFkZCB5b3VyIGNvaG9ydCBuYW1lIHRvIHRoZSBjb2hvcnROYW1lIHZhcmlhYmxlIGJlbG93LCByZXBsYWNpbmcgdGhlICdDT0hPUlQtTkFNRScgcGxhY2Vob2xkZXJcbmNvbnN0IGNvaG9ydE5hbWUgPSAnMjAwNC1HSFAtTlktV0VCLUZUY24nO1xuLy8gVXNlIHRoZSBBUElVUkwgdmFyaWFibGUgZm9yIGZldGNoIHJlcXVlc3RzXG5jb25zdCBBUElVUkwgPSBgaHR0cHM6Ly9mc2EtcHVwcHktYm93bC5oZXJva3VhcHAuY29tL2FwaS8ke2NvaG9ydE5hbWV9L2A7XG5cblxuZXhwb3J0IGNvbnN0IGZldGNoQWxsUGxheWVycyA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9L3BsYXllcnNgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgICAgXG4gICAgICB9XG4gICAgIHJldHVybiByZXN1bHQuZGF0YS5wbGF5ZXJzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coXCJvcHMsIHNvbWV0aGluZyB3ZW50IHdyb25nIVwiLCBlcnJvcik7XG59XG59O1xuXG5leHBvcnQgY29uc3QgZmV0Y2hTaW5nbGVQbGF5ZXIgPSBhc3luYyAocGxheWVySWQpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoIChgJHtBUElVUkx9L3BsYXllcnMvJHtwbGF5ZXJJZH1gKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgIH0gcmV0dXJuIHJlc3VsdC5kYXRhLnBsYXllcnM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNvcnJ5LCBjb3VsZCBub3QgZmV0Y2ggcGxheWVyXCIsIGVycm9yKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkTmV3UGxheWVyID0gYXN5bmMgKHBsYXllck9iaikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2ggKGAke0FQSVVSTH1wbGF5ZXJzYCx7XG4gICAgICAgICAgICBtZXRob2Q6J1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6SlNPTi5zdHJpbmdpZnkocGxheWVyT2JqKVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhLnBsYXllclxuICAgIH0gY2F0Y2ggKGVycm9yKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJTb3JyeSwgY291bGQgbm90IGFkZCBhIHBsYXllclwiLCBlcnJvcik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZVBsYXllciA9IGFzeW5jIChwbGF5ZXJJZCkgPT4ge1xuICAgIHRyeXtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoIChgJHtBUElVUkx9cGxheWVycy8ke3BsYXllcklkfWAsIHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICB9KTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgIHJldHVybjtcbn1jYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhgU29ycnksIGNvdWxkIG5vdCByZW1vdmUgcGxheWVyICR7cGxheWVySWR9YCwgZXJyb3IpO1xufVxufTtcbiIsImltcG9ydCB7YWRkTmV3UGxheWVyLCBmZXRjaEFsbFBsYXllcnMsIGZldGNoU2luZ2xlUGxheWVyLCByZW1vdmVQbGF5ZXJ9IGZyb20gJy4vYWpheEhlbHBlcnMnO1xuXG5jb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxsLXBsYXllcnMtY29udGFpbmVyJyk7XG5jb25zdCBuZXdQbGF5ZXJGb3JtQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1wbGF5ZXItZm9ybScpO1xuXG5leHBvcnQgY29uc3QgcmVuZGVyQWxsUGxheWVycyA9IChwbGF5ZXJMaXN0KSA9PiB7XG4gIC8vIEZpcnN0IGNoZWNrIGlmIHdlIGhhdmUgYW55IGRhdGEgYmVmb3JlIHRyeWluZyB0byByZW5kZXIgaXQhXG4gIGlmICghcGxheWVyTGlzdCB8fCAhcGxheWVyTGlzdC5sZW5ndGgpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gJzxoMz5ObyBwbGF5ZXJzIHRvIGRpc3BsYXkhPC9oMz4nO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIExvb3AgdGhyb3VnaCB0aGUgbGlzdCBvZiBwbGF5ZXJzLCBhbmQgY29uc3RydWN0IHNvbWUgSFRNTCB0byBkaXNwbGF5IGVhY2ggb25lXG4gIGxldCBwbGF5ZXJDb250YWluZXJIVE1MID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHB1cCA9IHBsYXllckxpc3RbaV07XG4gICAgbGV0IHB1cEhUTUwgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwic2luZ2xlLXBsYXllci1jYXJkXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxuICAgICAgICAgIDxwIGNsYXNzPVwicHVwLXRpdGxlXCI+JHtwdXAubmFtZX08L3A+XG4gICAgICAgICAgPHAgY2xhc3M9XCJwdXAtbnVtYmVyXCI+IyR7cHVwLmlkfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxpbWcgc3JjPVwiJHtwdXAuaW1hZ2VVcmx9XCIgYWx0PVwicGhvdG8gb2YgJHtwdXAubmFtZX0gdGhlIHB1cHB5XCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJkZXRhaWwtYnV0dG9uXCIgZGF0YS1pZD0ke3B1cC5pZH0+U2VlIGRldGFpbHM8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gICAgcGxheWVyQ29udGFpbmVySFRNTCArPSBwdXBIVE1MO1xuICB9XG5cbiAgLy8gQWZ0ZXIgbG9vcGluZywgZmlsbCB0aGUgYHBsYXllckNvbnRhaW5lcmAgZGl2IHdpdGggdGhlIEhUTUwgd2UgY29uc3RydWN0ZWQgYWJvdmVcbiAgcGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9IHBsYXllckNvbnRhaW5lckhUTUw7XG5cbiAgLy8gTm93IHRoYXQgdGhlIEhUTUwgZm9yIGFsbCBwbGF5ZXJzIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBET00sXG4gIC8vIHdlIHdhbnQgdG8gZ3JhYiB0aG9zZSBcIlNlZSBkZXRhaWxzXCIgYnV0dG9ucyBvbiBlYWNoIHBsYXllclxuICAvLyBhbmQgYXR0YWNoIGEgY2xpY2sgaGFuZGxlciB0byBlYWNoIG9uZVxuICBsZXQgZGV0YWlsQnV0dG9ucyA9IFsuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXRhaWwtYnV0dG9uJyldO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRldGFpbEJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBidXR0b24gPSBkZXRhaWxCdXR0b25zW2ldO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8qXG4gICAgICAgIFlPVVIgQ09ERSBIRVJFXG4gICAgICAqL1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSBhd2FpdCBmZXRjaFNpbmdsZVBsYXllcihidXR0b24uZGF0YXNldC5pZCk7XG4gICAgICByZW5kZXJTaW5nbGVQbGF5ZXIocGxheWVyKTtcbiAgICAgIFxuICAgIH0pO1xuICB9XG5cbiAgbGV0IHJlbW92ZUJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVtb3ZlLWJ1dHRvbicpXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gcmVtb3ZlQnV0dG9uc1tpXTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCByZW1vdmVQbGF5ZXIoYnV0dG9uLmRhdGFzZXQuaWQpO1xuXG4gICAgICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XG4gICAgICByZW5kZXJBbGxQbGF5ZXJzKHBsYXllcnMpO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbmV4cG9ydCBjb25zdCByZW5kZXJTaW5nbGVQbGF5ZXIgPSAocGxheWVyT2JqKSA9PiB7XG4gIGlmICghcGxheWVyT2JqIHx8ICFwbGF5ZXJPYmouaWQpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCI8aDM+Q291bGRuJ3QgZmluZCBkYXRhIGZvciB0aGlzIHBsYXllciE8L2gzPlwiO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwdXBIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLXZpZXdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC10aXRsZVwiPiR7cGxheWVyT2JqLm5hbWV9PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwbGF5ZXJPYmouaWR9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8cD5UZWFtOiAke3BsYXllck9iai50ZWFtID8gcGxheWVyT2JqLnRlYW0ubmFtZSA6ICdVbmFzc2lnbmVkJ308L3A+XG4gICAgICA8cD5CcmVlZDogJHtwbGF5ZXJPYmouYnJlZWR9PC9wPlxuICAgICAgPGltZyBzcmM9XCIke3BsYXllck9iai5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke1xuICAgIHBsYXllck9iai5uYW1lXG4gIH0gdGhlIHB1cHB5XCI+XG4gICAgICA8YnV0dG9uIGlkPVwic2VlLWFsbFwiPkJhY2sgdG8gYWxsIHBsYXllcnM8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gcHVwSFRNTDtcbn07XG5sZXQgc2VlQWxsQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlZS1hbGwnKTtcbnNlZUFsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGF3YWl0IGZldGNoQWxsUGxheWVycygpO1xuICByZW5kZXJBbGxQbGF5ZXJzKHBsYXllcnMpO1xufSk7XG5cblxuZXhwb3J0IGNvbnN0IHJlbmRlck5ld1BsYXllckZvcm0gPSAoKSA9PiB7XG4gIGxldCBmb3JtSFRNTCA9IGBcbiAgICA8Zm9ybT5cbiAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZTo8L2xhYmVsPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiAvPlxuICAgICAgPGxhYmVsIGZvcj1cImJyZWVkXCI+QnJlZWQ6PC9sYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJicmVlZFwiIC8+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICA8L2Zvcm0+XG4gIGA7XG4gIG5ld1BsYXllckZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gZm9ybUhUTUw7XG5cbiAgbGV0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXBsYXllci1mb3JtID4gZm9ybScpO1xuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChldmVudCkgPT4ge1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgXG5cbiAgICAgIGxldCBwbGF5ZXJEYXRhID0ge1xuICAgICAgICBuYW1lOiBmb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUsXG4gICAgICAgIGJyZWVkOiBmb3JtLmVsZW1lbnRzLmJyZWVkLnZhbHVlLFxuICAgICAgfTtcbiAgICAgIGF3YWl0IGFkZE5ld1BsYXllcihwbGF5ZXJEYXRhKTtcbiAgICAgIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcbiAgICAgIHJlbmRlckFsbFBsYXllcnMocGxheWVycyk7XG4gICAgICBmb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUgPSAnJztcbiAgICAgIGZvcm0uZWxlbWVudHMuYnJlZWQudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtmZXRjaEFsbFBsYXllcnN9IGZyb20gJy4vYWpheEhlbHBlcnMnXG5pbXBvcnQge3JlbmRlckFsbFBsYXllcnMsIHJlbmRlck5ld1BsYXllckZvcm19IGZyb20gJy4vcmVuZGVySGVscGVycydcblxuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGF3YWl0IGZldGNoQWxsUGxheWVycygpXG4gIHJlbmRlckFsbFBsYXllcnMocGxheWVycylcblxuICByZW5kZXJOZXdQbGF5ZXJGb3JtKClcbn1cblxuaW5pdCgpXG4iXSwic291cmNlUm9vdCI6IiJ9