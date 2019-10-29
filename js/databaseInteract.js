db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // multiple tabs
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // browser doesn't support indexdb feature
      console.log('persistance not available');
    }
  });

const loadDetailView = (id) => {
  console.log(id)
  db.collection('games').doc(id).get().then(doc =>{
    console.log("document data:", doc.data());
    data = doc.data()
    const color = data['color']
    const oppLevel = data['opponent_level']
    const gameDetail = document.querySelector('.gamedetail');
    const html = `
        <div class="side-page-body gamedetail" style="text-align: left!important; display: flex; flex-direction: column; justify-content: left;">
          <div style="margin-top: 2vh; display: flex;">
            <h5>Player Color:</h5>
            <h5><span title="edit content" id="colorDesc" style="color: grey; margin-left: 5px; display: inline-block" contentEditable="true"> ${color}</span></h5>
          </div>
          <div style="margin-top: .5vh; display: flex;">
            <h5>Opponent Level:</h5>
            <h5><span title="edit content" id="oppDesc" style="color: grey; margin-left: 5px; display: inline-block" contentEditable="true">${oppLevel} </span></h5>
          </div>
        </div>
        <img src="/img/${color}.jpg" alt="game piece" style="height: 205px; width: 110px; margin-top: 5vh;">
    `;
    gameDetail.innerHTML += html;
    //Add event listeners for editing and submitting
    const colorEdit = document.getElementById('colorDesc');
    const oppEdit = document.getElementById('oppDesc');
    colorEdit.addEventListener('input', function() {
        console.log('An edit input has been detected');
        let str = colorEdit.innerHTML.toString()
        let input = str.replace(/&nbsp;/g, '')
        console.log(input);
        updateDoc(input, 'color', id)
    });
    //prevent enter
    colorEdit.addEventListener('keypress', (e) => {
      if (e.which === 13) {
          e.preventDefault();
      }
    });
    
    oppEdit.addEventListener('input', function() {
      console.log('An edit input has been detected');
      let str = oppEdit.innerHTML.toString()
      let input = str.replace(/&nbsp;/g, '')
      console.log(input);
      updateDoc(input, 'opponent_level', id)
    });
    //prevent enter
    oppEdit.addEventListener('keypress', (e) => {
      if (e.which === 13) {
          e.preventDefault();
      }
    });

  }).catch(err => console.log(err));
}

const updateDoc = (input, field, id) => {
  if (field === 'opponent_level'){
    db.collection("games").doc(id).update({opponent_level: input});
  } else if (field === 'color' && (input.trim() === 'white' || input.trim() === 'black')) {
    db.collection("games").doc(id).update({color: input});
  }
  
}


db.collection('games').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type === 'added'){
        renderGame(change.doc.data(), change.doc.id);
      }
      if(change.type === 'removed'){
        deleteGame(change.doc.id);
      }
    });
  });



submitDocument = (evt) => {
    evt.preventDefault();
    
    const game = {
        color: form.color.value,
        opponent_level: form.opponentlevel.value
    };

    db.collection('games').add(game).then(x =>{
        //Close form or sidemenu for better UX/UI
        let width = document.documentElement.clientWidth;
        if (width > 992){
            console.log("wide")
            $('.modal').modal('close');
        } else{
            $('.side-form').sidenav('close');
            console.log("mobile")
        }
    }).catch(err => console.log(err));

    form.color.value = '';
    form.opponentlevel.value = '';

}

//global var for form
let form;
//Changes the form based on screen size
function changeForm() {
    if (form !== undefined){
        form.removeEventListener('submit', submitDocument);
    }
    let width = document.documentElement.clientWidth;
    if (width > 992){
      form = document.querySelector('#widescreen-form');
    } else{
      form = document.querySelector('#mobile-form');
    }
    console.log(form)
     // add new game
     form.addEventListener('submit', submitDocument);
  }

document.addEventListener("DOMContentLoaded", function(){
  const docUrl = document.location.href
  if (docUrl.indexOf('about.html') === -1 && docUrl.indexOf('instructions.html') === -1 && docUrl.indexOf('gameDetail.html') === -1){
    changeForm()
  }
});
window.addEventListener("resize", changeForm);


// remove a game
const gamesList = document.querySelector('.games');
gamesList.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('games').doc(id).delete();
  //send to detail view if clicked
  } else if (evt.target.getAttribute('specialval') === 'link'){
    //not great logic to navigate this tree so that regarldess of elem
    if(evt.target.id !== ''){
      console.log(evt.target.id)
      goToDetailView(evt.target.id)
    } else {
      if(evt.target.parentElement.id !== ''){
        console.log(evt.target.parentElement.id)
        goToDetailView(evt.target.parentElement.id)
      } else{
        console.log(evt.target.parentElement.parentElement.id)
        goToDetailView(evt.target.parentElement.parentElement.id)
      }
    }
    
  }
})

const goToDetailView = (id) => {
  location.assign('http://127.0.0.1:5500/gameDetail.html#' + id)
}


const gamesDetail = document.querySelector('.gamedetail');

