document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menu, {edge: 'left'});

    const form = document.querySelectorAll('.side-form');
    M.Sidenav.init(form, {edge: 'right'})

    const modal = document.querySelectorAll('.modal');
    M.Modal.init(modal, {});

    var mobileSelect = document.querySelectorAll('.mobile-select');
    M.FormSelect.init(mobileSelect, {});

    var widescreenSelect = document.querySelectorAll('.window-select');
    M.FormSelect.init(widescreenSelect, {});
});

//Change modal button or sidenav button depending on what is happening
function changeButtons() {
  let width = document.documentElement.clientWidth;
  if (width > 992){
    this.document.getElementById('is-large-screen-button').style.display = 'block'
    this.document.getElementById('is-mobile-button').style.display = 'none'
  } else{
    this.document.getElementById('is-large-screen-button').style.display = 'none'
    this.document.getElementById('is-mobile-button').style.display = 'block'
  }
}

const games = document.querySelector('.games');
const renderGame = (data, id) => {

  const html = `
    <div class="card-panel game white row" id="${id}" specialval="link">
      <img src="/img/${data.color}.jpg" alt="game piece" specialval="link">
      <div class="game-details" specialval="link">
        <div class="game-player-color" specialval="link">${data.color}</div>
        <div class="game-opponent-level" specialval="link">${data.opponent_level}</div>
      </div>
      <div class="game-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;
  games.innerHTML += html;
};



document.addEventListener("DOMContentLoaded", function(){
  const docUrl = document.location.href
  if (docUrl.indexOf('about.html') === -1 && docUrl.indexOf('instructions.html') === -1 && docUrl.indexOf('gameDetail.html') === -1){
    changeButtons()
  }
  if (docUrl.indexOf("gameDetail") > -1){
    id = document.location.hash.substr(1)
    loadDetailView(id)
  }
  
});
window.addEventListener("resize", changeButtons);


//For deleting game
const deleteGame = (id) => {
  const game = document.getElementById(`${id}`);
  game.remove();
};







