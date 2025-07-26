// Supabase:
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ydembgafgkmhpnydqqyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1iZ2FmZ2ttaHBueWRxcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQwNTIsImV4cCI6MjA2ODk0MDA1Mn0.QnTKCsDAgM_AhtQGzxfN88qGyyMBKhk5-hmBnqdovoc";
const supabase = createClient(supabaseUrl, supabaseKey);

//-----------------Ket noi database o tren, ke no di wee-----------------//

const nameInput = document.getElementById('changeName');
const changeNameButton = document.getElementById('changeNameBttn');
const playerNameLabel = document.getElementById('playerNameLabel');

let showScreenId = 'roomSelection';
let playerId = localStorage.getItem('player_id');
let playerName = localStorage.getItem('player_name');

//Dat ten bien lai theo ten thanh pho
const start = 0;
const land1 = 1;
const land2 = 2;
const land3 = 3;
const land4 = 4;
const land5 = 5;
const land6 = 6;
const land7 = 7;
const land8 = 8;
const land9 = 9;
const land10 = 10;
const land11 = 11;
const land12 = 12;
const land13 = 13;
const land14 = 14;
const land15 = 15;
const land16 = 16;
//...-> land39


//function:
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

async function changeName() {
    console.log("change button pressed");
    changeNameButton.disabled = true;
    nameInput.disabled = true;
    let newName = nameInput.value.trim();
    if (newName === "")
        newName = playerName;
    
    const { error } = await supabase
    .from('Players')
    .update({ player_name: newName })
    .eq('player_id', playerId)

    if (error)
        console.error('Failed to update name:', error);

    
    playerNameLabel.innerHTML = `<span class="label-text">Player's name:</span> <span class="player-namejs">${newName}</span>`;
    localStorage.setItem('player_name', newName);
    playerName = newName;
    nameInput.value = null;
    changeNameButton.disabled = false;
    nameInput.disabled = false;
    console.log("Successfully changed name to:", newName);
};

function showScreen(id) {
    document.getElementById('roomSelection').style.display = 'none';
    document.getElementById('waitingRoom').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById(id).style.display = 'block';
};

function SelectRoom()
{
    const roomSelectionCanvas = document.getElementById('roomSelectionCanvas');
    const ctx = roomSelectionCanvas.getContext("2d");
    roomSelectionCanvas.width = 700;
    roomSelectionCanvas.height = 500;
}

//run shit here:
initPlayer();
showScreen(showScreenId);
changeNameButton.addEventListener('click', changeName);
window.addEventListener('load', SelectRoom);
