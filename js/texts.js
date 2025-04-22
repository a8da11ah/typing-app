fetch('http://random-word-api.herokuapp.com/word?number=10')
    .then(response => response.json())
    .then(words => {
        if (localStorage.getItem('words')==null){
            localStorage.setItem('words', JSON.stringify(words));
        }else{
            console.log("words already exist in local storage");
            // localStorage.setItem('words', JSON.stringify(words));

        }
    })
    .catch(error => {
        console.error("Error fetching words:", error);
    });
