if (!localStorage.getItem('username'))
    localStorage.setItem ('username', "user")
if (!localStorage.getItem('last_channel'))
    localStorage.setItem ('last_channel', "http://127.0.0.1:5000/")

console.log(localStorage.getItem('last_channel'));

if (localStorage.getItem('last_channel') !== "http://127.0.0.1:5000/" ) {
  window.location.replace(localStorage.getItem('last_channel'));
  localStorage.setItem ('last_channel', "http://127.0.0.1:5000/");
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#form').onsubmit = () => {
     const username = document.querySelector('#username').value;
     document.querySelector('#username').innerHTML = username;
     localStorage.setItem('username', username)
    };
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ch').forEach(link => {
    link.onclick = () => {
      localStorage.setItem('last_channel', link.href)
    };
  });
});
let username = localStorage.getItem('username')
var names = [];

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    let counter = document.querySelectorAll("#channels li").length;

    document.querySelector('#submit').disabled = true;
    document.querySelector('#new_channel').onkeyup = () => {
      if (document.querySelector('#new_channel').value.length > 0)
          document.querySelector('#submit').disabled = false;
      else
          document.querySelector('#submit').disabled = true;
    };

    socket.on('connect', () => {
        document.querySelector('#form1').onsubmit = (e) => {
            const name = document.querySelector('#new_channel').value;
            socket.emit('submit channel', { 'name': name, 'counter': `${counter}` });
            document.querySelector('#form1').value = '';
            e.preventDefault()
            document.querySelector('#new_channel').value = '';
            document.querySelector('#submit').disabled = true;
        };
    });

    socket.on('announce new channel', data => {
        var li = document.createElement('li');
        var a = document.createElement('a');
        if (names.includes(data['name'])) {
          alert('Channel name already exists. Try another name.');
        }
        else {
          a.textContent = data['name'];
          a.setAttribute('href', "/" + counter);
          a.setAttribute('class', "ch")
          counter ++;
          li.appendChild(a);
          names.push(data["name"]);
          document.querySelector('#channels').append(li);
        }
    });

    socket.on('error', () => {
      alert('Channel name already exists. Try another name.')
    });
});
