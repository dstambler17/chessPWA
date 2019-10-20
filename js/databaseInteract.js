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
    changeForm()
    
   
});
window.addEventListener("resize", changeForm);




// remove a game
const gamesList = document.querySelector('.games');
gamesList.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('games').doc(id).delete();
  }
})