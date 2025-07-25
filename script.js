// Supabase wee:
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://ydembgafgkmhpnydqqyw.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1iZ2FmZ2ttaHBueWRxcXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjQwNTIsImV4cCI6MjA2ODk0MDA1Mn0.QnTKCsDAgM_AhtQGzxfN88qGyyMBKhk5-hmBnqdovoc";
const supabase = createClient(supabaseUrl, supabaseKey);

//-----------------Ket noi database o tren, ke no di wee-------------------------

const nameInput = document.getElementById('changeName');
const changeNameButton = document.getElementById('changeNameBttn');

let playerId = localStorage.getItem('player_id');
let playerName = localStorage.getItem('player_name');

//function:
async function createNewGuest() 
{
    const Pang = ["PangDia", "PangSai", "PangPhui"];
    const randomNumber09 = Math.floor(Math.random() * 10); //0-9
    const randomTag = Pang[Math.floor(Math.random() * Pang.length)];
    const name = `Guest${randomTag}${randomNumber09}`;
    const id = crypto.randomUUID();

    const { error } = await supabase
    .from('Players')
    .insert({ player_id: id, player_name: name });

    if (error) //alert error thui DX
    {
        console.error('Error creating player:', error);
        alert('Failed to create player.');
        return;
    }

    localStorage.setItem('player_id', id);
    localStorage.setItem('player_name', name);
    playerId = id;
    playerName = name;
};

async function initPlayer() 
{
    playerId = localStorage.getItem('player_id');
    playerName = localStorage.getItem('player_name');

    if (!playerId || !playerName) //== NULL -> true
    {
        await createNewGuest();
    }
    const playerNameLabel = document.getElementById('playerNameLabel');
    playerNameLabel.textContent = `Player: ${playerName}`;
};

async function changeName() {
    console.log("change button pressed");
    console.log("playerId:", playerId);

    let newName = nameInput.value.trim();
    if (newName === "")
        newName = "blank";

    const { data, error } = await supabase
    .from('Players')
    .update({ player_name: newName })
    .eq('player_id', playerId)

    if (error)
        console.error('Failed to update name:', error);

    const playerNameLabel = document.getElementById('playerNameLabel');
    playerNameLabel.textContent = `Player: ${newName}`;
    localStorage.setItem('player_name', newName);
    playerName = newName;

    console.log("Successfully changed name to:", newName);
};

//run shit here:
initPlayer();
changeNameButton.addEventListener('click', changeName);
