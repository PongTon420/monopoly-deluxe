import { supabase } from "./supabaseClient.js";

const nameInput = document.getElementById('changeName');
const changeNameButton = document.getElementById('changeNameBttn');
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

//run shit here:
initPlayer();
showScreen(showScreenId);

nameInput.addEventListener('input', () => 
{   if (nameInput.value.trim() !== "") changeNameButton.disabled = false;
    else changeNameButton.disabled = true;
});

changeNameButton.addEventListener('click', changeName);


//Room Selection section:

//Waiting Room section:

//Game board section:
