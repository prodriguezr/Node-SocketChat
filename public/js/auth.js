const myForm = document.querySelector('form');

const isDev = window.location.hostname.includes('localhost');

const url = (isDev 
    ? 'http://localhost:8082/api/auth/' 
    : 'https://prodrigu-rest-node.herokuapp.com/api/auth/');

myForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {};

    for (let element of myForm.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(r => {   
        if (r.status === 200) {
            localStorage.setItem('token', r.data.token);
            window.location = './chat.html';
        } else {
            console.log(r.msg);     
        }
    })
    .catch(console.log);
});

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {
        localStorage.removeItem('token');
    });
}

function onSignIn(googleUser) {
     var id_token = googleUser.getAuthResponse().id_token;

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token })
    })
    .then(resp => resp.json())
    .then(({token}) => {
        localStorage.setItem('token', token);
        window.location = './chat.html';
    })
    .catch(console.log);
}
