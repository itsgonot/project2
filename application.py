import os
import requests
import json

from flask import Flask, render_template, request, url_for, jsonify
from flask_socketio import SocketIO, emit
from datetime import datetime
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}
messages = {}
shouts = []


@app.route("/")
def index():
    return render_template("index.html", channels=channels)

@socketio.on("submit channel")
def channel(data):
    counter = len(channels)
    name = data["name"]

    if name not in channels:
        channels[name] = counter
        messages[counter] = []
        emit("announce new channel", {"name": name}, broadcast=True)
    elif name in channels:
        emit("error")

@socketio.on("submit new message")
def message(data):
    mg = data["msg"]
    user = data["username"]
    channel = int(data["channel"])
    list_of_messages = messages[channel]
    dt2 = datetime.now().strftime('%d-%m-%Y-%H:%M')
    msg = {"user": user, "content": mg, "datetime": dt2}
    counter = len(list_of_messages) - len(shouts)

    if counter < 101:
        list_of_messages.append(msg)
        emit("announce new message", {"mg": mg, "dt2": dt2, "user": user, "channel": channel }, broadcast=True)
    else:
        del list_of_messages[0]
        list_of_messages.append(msg)
        emit("announce new message2", {"mg": mg, "dt2": dt2, "user": user, "channel": channel }, broadcast=True)

@socketio.on("submit new shout")
def shout(data):
    mg = data["msg"]
    user = data["username"]
    dt2 = datetime.now().strftime('%d-%m-%Y-%H:%M')
    msg = {"user": user, "content": mg, "datetime": dt2}
    shouts.append(msg)
    lists_of_messages = list(messages.values())
    print(lists_of_messages)
    for i in lists_of_messages:
        if (len(i) - len(shouts)) < 101:
            i.append(msg)
        else:
            del i[0]
            i.append(msg)
    emit("shout", {"mg": mg, "dt2": dt2, "user": user}, broadcast = True)

@app.route("/<int:channel_id>", methods=['GET'])
def channel(channel_id):
    channels2 = {}
    list_of_messages = messages[channel_id]

    for key, value in channels.items():
        channels2[value] = key
    channel = channels2[channel_id]
    return render_template("channel.html", channel=channel, list_of_messages=list_of_messages)

if __name__ == '__main__':
    socketio.run(app, debug=True)
