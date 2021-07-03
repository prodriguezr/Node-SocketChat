const isDev = window.location.hostname.includes('localhost');

const url = (isDev 
    ? 'http://localhost:8082/api/auth/' 
    : 'https://prodrigu-rest-node.herokuapp.com/api/auth/');

let user = null;
let socket = null;

// HTML Ref's
const hdnUid     = document.querySelector('#hdnUid');
const txtUid     = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers    = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogOut  = document.querySelector('#btnLogOut');

const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('Token does not exist on the server');
    }

    const resp = await fetch(url, {
        headers: { 'x-keyapp': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);

    user = userDB;

    document.title = `Socket Chat - User: ${user.name}`;

    await connectSocket();

    txtMessage.focus();
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    event.preventDefault();

    if (keyCode != 13) { return; }

    if (txtMessage.value.trim().length === 0) { return; }
    //if (txtUid.value.trim().length === 0) { return; }

    const message = txtMessage.value.trim(); 
    const uid = txtUid.value.trim();

    const payload = {
        uid,
        message,
    }

    socket.emit('send-message', payload);

    txtMessage.value = '';
    txtMessage.focus();
});

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-keyapp': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('receive-messages', drawMessages);
    socket.on('active-users', drawUsers);

    socket.on('private-message', (payload) => {
        console.log('Private:', payload);
    });
}

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const pm = (uid, name) => {
    console.log(`UID: ${uid} - Name: ${name}`);
    hdnUid.setAttribute('uid', uid);
    hdnUid.innerHTML = name;

    //console.log(uid);
}

const drawUsers = (users = []) => {
    let htmlUsers = '';
    
    users.forEach( ({ uid, name }) => {   
        htmlUsers += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    
    ulUsers.innerHTML = htmlUsers;
}

const drawMessages = (messages = []) => {
    let htmlMessages = '';

    messages.forEach( ({ name, message }) => {
        htmlMessages += `
            <li>
                <p>
                    <span class="text-primary">${name}</span>
                    <span>${message}</span>
                </p>
            </li>
        `;
    });

    ulMessages.innerHTML = htmlMessages;
}

const main = async() => {
    await validateJWT();
}

main();