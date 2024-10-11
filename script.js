import {renderTournamentTable, startGame} from "./js/game.js";
import {initModal} from "./js/modals.js";
import {initMusic} from "./js/music.js";

window.addEventListener('load', () => {
  startGame();
  renderTournamentTable();
  initModal();
  initMusic();
});
