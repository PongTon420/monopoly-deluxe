import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ydembgafgkmhpnydqqyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1iZ2FmZ2ttaHBueWRxcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQwNTIsImV4cCI6MjA2ODk0MDA1Mn0.QnTKCsDAgM_AhtQGzxfN88qGyyMBKhk5-hmBnqdovoc";
const supabase = createClient(supabaseUrl, supabaseKey);

const nameInput = document.getElementById('changeName');
const changeNameButton = document.getElementById('changeNameBttn');
const syncButton = document.getElementById('syncButton')
const playerNameLabel = document.getElementById('playerNameLabel');

let playerId = localStorage.getItem('player_id');
let playerName = localStorage.getItem('player_name');

async function createNewGuest()
{
    const Pang = ["PangDia", "PangSai", "PangPhui"];
    const randomNumber09 = Math.floor(Math.random() * 10); //0-9
    const randomTag = Pang[Math.floor(Math.random() * Pang.length)];
    const defaultName = `Guest${randomTag}${randomNumber09}`;
    const id = crypto.randomUUID();

    const { error } = await supabase
    .from('Players')
    .insert({ player_id: id, player_name: defaultName });

    if (error) //log error thui DX
    {
        console.error('Error creating player:', error);
        return;
    }

    localStorage.setItem('player_id', id);
    localStorage.setItem('player_name', defaultName);
    playerId = id;
    playerName = defaultName;

};
async function initPlayer() 
{
    playerId = localStorage.getItem('player_id');
    playerName = localStorage.getItem('player_name');

    if (!playerId || !playerName) //== NULL -> true
    {
        await createNewGuest();
    }
    playerNameLabel.innerHTML = `Player's name: <span class="player-namejs">${playerName}</span>`;
};
async function changeName() 
{
    console.log("change button pressed");
    changeNameButton.disabled = true;
    nameInput.disabled = true;

    const clickSound = new Audio("sound/AmongUsIndian.mp3");
    clickSound.play();

    let newName = nameInput.value.trim();
    if (newName === "")
        newName = playerName; //Chắc ăn là ko điền khoảng trống dc
    
    const { error } = await supabase
    .from('Players')
    .update({ player_name: newName })
    .eq('player_id', playerId)

    if (error)
        console.error('Failed to update name:', error);
    
    playerNameLabel.innerHTML = `Player's name: <span class="player-namejs">${newName}</span>`;
    localStorage.setItem('player_name', newName);
    playerName = newName;

    nameInput.value = null;
    changeNameButton.disabled = true;
    nameInput.disabled = false;
    console.log("Successfully changed name to:", newName);
};

function hideButton(className)
{
    console.log(className);
    const buttons = document.getElementsByClassName('hiddenBtn');
    for (let i = 0; i < buttons.length; i++) 
    {
        buttons[i].style.display = 'none';
    }
};

function showButton(className)
{
    const buttons = document.getElementsByClassName(className);
    for (let i = 0; i < buttons.length; i++) 
    {
        buttons[i].style.display = 'block';
    }
};

async function idExist() 
{
    playerId = localStorage.getItem('player_id');
    const { data, error } = await supabase
    .from('Players')
    .select('*')
    .eq('player_id', playerId);
    if (error) {
    console.error("Supabase error:", error);
    } else if (data.length > 0) {
    console.log("Player exists:", data[0]);
    } else {
    console.log("Player not found.");
    const OOSsmall = document.getElementById('outOfSync');
    OOSsmall.textContent = `You are out of sync! Please press Sync button`;
    resetButton.disabled = false;
    }
}

//run shit here:
initPlayer();
idExist();

nameInput.addEventListener('input', () => 
{   if (nameInput.value.trim() !== "") changeNameButton.disabled = false;
    else changeNameButton.disabled = true;
});

changeNameButton.addEventListener('click', changeName);
syncButton.addEventListener('click', () => {localStorage.clear(); 
    location.reload(); console.log("clear");});

//Room Selection section:
const createButton = document.getElementById('createRoomBtn');
createButton.addEventListener('click', createRoom);
checkPlayerInRoom();

async function removeRoomList(room)
{
    const { error } = await supabase
    .from('Rooms')
    .delete()
    .eq('room_id', room.id);
    const roomDiv = document.getElementById(`room-${room.id}`);
    if (roomDiv) roomDiv.remove();
}
async function createRoom()
{
    console.log("createRoomButton pressed")
    document.getElementById('createRoomBtn').disabled = true;
    const roomNameInput = document.getElementById('roomName');
    const roomIdInput = document.getElementById('roomId');
    let roomName = roomNameInput.value.trim();
    let roomId = roomIdInput.value.trim();
    let hostId = playerId;
    const { error } = await supabase
    .from('Rooms')
    .insert([
        { room_id: roomId, room_name: roomName, host_id: playerId },
    ])
    .select();
    if (error) console.log("create room error");

    const { error: room_players_error } = await supabase
    .from('room_players')
    .insert([
        { room_id: roomId, player_id: hostId, is_host: true },
    ])
    .select();
    location.reload()
}

async function updateRoomList() {
    const roomListDiv = document.getElementById('roomList');
    roomListDiv.innerHTML = '';

    const { data: rooms, error: roomError } = await supabase
        .from('Rooms')
        .select('room_id, room_name, status');
    if (roomError) {
        console.error('Failed to fetch rooms:', roomError);
        return;
    }

    const { data: roomPlayers, error: rpError } = await supabase
    .from('room_players')
    .select('room_id');

    if (rpError) {
        console.error('Failed to fetch room_players:', rpError);
        return;
    }

    const playerCounts = {};
    roomPlayers.forEach(rp => {
        playerCounts[rp.room_id] = (playerCounts[rp.room_id] || 0) + 1;
    });

     rooms.forEach(room => {
        const row = document.createElement('div');
        row.className = 'roomRow';
        row.id = `room-${room.room_id}`;

        const nameCol = document.createElement('div');
        nameCol.className = 'roomListCol';
        nameCol.textContent = room.room_name;

        const playerCol = document.createElement('div');
        playerCol.className = 'roomListCol';
        playerCol.textContent = playerCounts[room.room_id] || 0;

        const statusCol = document.createElement('div');
        statusCol.className = 'roomListCol';
        statusCol.textContent = room.status;

        row.appendChild(nameCol);
        row.appendChild(playerCol);
        row.appendChild(statusCol);

        roomListDiv.appendChild(row);
    });
}

async function checkPlayerInRoom()
{
console.log("check_player");
const { data, error } = await supabase
  .from("room_players")
  .select("*")
  .eq("player_id", playerId); // replace with your actual variable
if (data.length > 0)
    {
        showButton('hiddenBtn');
        //document.getElementById('createRoomBtn').disabled = true; //Bật này lên khi ko còn test nx
        document.getElementById('leaveBtn').disabled = false;
        document.getElementById('playBtn').disabled = false;
    }
else hideButton('hiddenBtn');
}

window.onload = updateRoomList;

//Game board section:
