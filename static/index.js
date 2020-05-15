if (!localStorage.getItem('username'))
    localStorage.setItem ('username', "user")
let username = localStorage.getItem('username');

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    document.querySelector('#submit2').disabled = true;
    document.querySelector('#new_message').onkeyup = () => {
      if (document.querySelector('#new_message').value.length > 0)
          document.querySelector('#submit2').disabled = false;
      else
          document.querySelector('#submit2').disabled = true;
    };

    document.querySelector('#submit3').disabled = true;
    document.querySelector('#new_shout').onkeyup = () => {
      if (document.querySelector('#new_shout').value.length > 0)
          document.querySelector('#submit3').disabled = false;
      else
          document.querySelector('#submit3').disabled = true;
    };

    socket.on('connect', () => {
        document.querySelector('#form2').onsubmit = (e) => {
            const msg = document.querySelector('#new_message').value;
            const channel_id = window.location.pathname.split("/").pop()
            socket.emit('submit new message', { 'msg': msg, 'username': username, 'channel': `${channel_id}` });
            document.querySelector('#form2').value = '';
            e.preventDefault()
            document.querySelector('#new_message').value = '';
            document.querySelector('#submit2').disabled = true;
        };
        document.querySelector('#form3').onsubmit = (e) => {
          const msg = document.querySelector('#new_shout').value;
          socket.emit('submit new shout', { 'msg': msg, 'username': username });
          document.querySelector('#form3').value = '';
          e.preventDefault()
          document.querySelector('#new_shout').value = '';
          document.querySelector('#submit3').disabled = true;
        };
    });
    socket.on('announce new message', data => {
      const channel_id = data["channel"]
      if (Number(window.location.pathname.split("/").pop()) === data["channel"]) {
        var li = document.createElement('li');
        var div = document.createElement('div');
        var name = document.createElement('h4');
        var cont = document.createElement('p');
        var time = document.createElement('p');
        name.innerHTML = data["user"]
        cont.innerHTML = data["mg"]
        time.innerHTML = data["dt2"]
        time.setAttribute("class", "timestamp")
        div.appendChild(name);
        div.appendChild(cont);
        div.appendChild(time);
        li.appendChild(div);
        document.querySelector('#messages').appendChild(li);
      };
    });
    socket.on('announce new message2', data => {
        var list = document.getElementById("messages");
        list.removeChild(list.childNodes[0]);
        const channel_id = data["channel"]
        if (Number(window.location.pathname.split("/").pop()) ===  data["channel"]) {
          var li = document.createElement('li');
          var div = document.createElement('div');
          var name = document.createElement('h4');
          var cont = document.createElement('p');
          var time = document.createElement('p');
          name.innerHTML = data["user"]
          cont.innerHTML = data["mg"]
          time.innerHTML = data["dt2"]
          time.setAttribute("class", "timestamp")
          div.appendChild(name);
          div.appendChild(cont);
          div.appendChild(time);
          li.appendChild(div);
          document.querySelector('#messages').appendChild(li);
        };
    });

    socket.on('shout', data => {
        var li = document.createElement('li');
        var div = document.createElement('div');
        var name = document.createElement('h4');
        var cont = document.createElement('p');
        var time = document.createElement('p');
        name.innerHTML = data["user"]
        cont.innerHTML = data["mg"]
        time.innerHTML = data["dt2"]
        time.setAttribute("class", "timestamp")
        li.setAttribute("class", "shout")
        div.appendChild(name);
        div.appendChild(cont);
        div.appendChild(time);
        li.appendChild(div);
        document.querySelector('#messages').appendChild(li);
    });
});
