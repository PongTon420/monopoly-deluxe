import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ydembgafgkmhpnydqqyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1iZ2FmZ2ttaHBueWRxcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQwNTIsImV4cCI6MjA2ODk0MDA1Mn0.QnTKCsDAgM_AhtQGzxfN88qGyyMBKhk5-hmBnqdovoc";
const supabase = createClient(supabaseUrl, supabaseKey);

const nameInput = document.getElementById('changeName');
const changeNameButton = document.getElementById('changeNameBttn');
const resetButton = document.getElementById('resetButton')
const playerNameLabel = document.getElementById('playerNameLabel');

let showScreenId = 'roomSelection';
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
function showScreen(id) {
    document.getElementById('roomSelection').style.display = 'none';
    document.getElementById('waitingRoom').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById(id).style.display = 'block';
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
    OOSsmall.textContent = `You are out of sync! Please press Reset button`;
    resetButton.disabled = false;
    }
}

//run shit here:
initPlayer();
idExist();
showScreen(showScreenId);

nameInput.addEventListener('input', () => 
{   if (nameInput.value.trim() !== "") changeNameButton.disabled = false;
    else changeNameButton.disabled = true;
});

changeNameButton.addEventListener('click', changeName);
resetButton.addEventListener('click', () => {localStorage.clear(); 
    location.reload(); console.log("clear");});

//Room Selection section:

//Waiting Room section:

//Game board section:
