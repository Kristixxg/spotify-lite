const loginScreen = document.getElementById("login-screen");
const signupScreen = document.getElementById("signup-screen");
const mainScreen = document.getElementById("main-screen");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const goToSignup = document.getElementById("go-to-signup");
const goToLogin = document.getElementById("go-to-login");
const logoutButton = document.getElementById("logout-button");
const editSaveButton = document.getElementById("edit-save-button");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const editUsername = document.getElementById("edit-username");
const editEmail = document.getElementById("edit-email");
const editPassword = document.getElementById("edit-password");
const userNameDisplay = document.getElementById("user-name");
const searchInput = document.getElementById("search-input");
const searchGenreInput = document.getElementById("search-genre");
const searchLanguageInput = document.getElementById("search-language");
const searchButton = document.getElementById("search-button");
const resultsList = document.getElementById("results-list");
const likedSongsList = document.getElementById("liked-songs-list");
const followedArtistsList = document.getElementById("followed-artists-list");

const users = [
  {
    username: "test",
    email: "test@gmail.com",
    password: "Testtest1!",
    id: "67684b30419df48075106542",
  },
];
let currentUser = users[0];

// Event Handlers
loginButton.addEventListener("click", () => {
  const username = loginUsername.value;
  const password = loginPassword.value;

  if (currentUser) {
    // userNameDisplay.textContent = currentUser.username;
    switchScreen(mainScreen);
    renderLikedSongs();
    renderArtists();
  } else {
    alert("Invalid email or password");
  }
});

signupButton.addEventListener("click", () => {
  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;

  if (users.find((u) => u.email === email)) {
    alert("Email already registered");
    return;
  }

  users.push({ username, email, password });
  alert("Signup successful! Please login.");
  switchScreen(loginScreen);
});

goToSignup.addEventListener("click", () => switchScreen(signupScreen));
goToLogin.addEventListener("click", () => switchScreen(loginScreen));

logoutButton.addEventListener("click", () => {
  currentUser = null;
  switchScreen(loginScreen);
});

editSaveButton.addEventListener("click", async () => {
  if (editUsername.value) currentUser.username = editUsername.value;
  if (editEmail.value) currentUser.email = editEmail.value;
  if (editPassword.value) currentUser.password = editPassword.value;
  userNameDisplay.textContent = currentUser.username;

  try {
    const response = await fetch(`/user/info/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: editUsername.value,
        email: editEmail.value,
        password: editPassword.value,
      }),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    const updatedInfo = await response.json();
    // console.log("response here", updatedInfo);
    alert("Profile updated successfully");
  } catch (error) {
    console.error(error);
  }
});

function switchScreen(screenToShow) {
  [loginScreen, signupScreen, mainScreen].forEach((screen) => {
    screen.style.display = "none";
  });
  screenToShow.style.display = "block";
}

//search songs, like songs and follow artists

async function searchSongs() {
  const searchQuery = searchInput.value.toLowerCase();
  const genre = searchGenreInput.value.toLowerCase();
  const language = searchLanguageInput.value.toLowerCase();

  try {
    const response = await fetch("/songs");

    if (!response.ok) {
      throw new Error("error status: ", response.status);
    }

    const songs = await response.json();
    const filteredSongs = songs.filter((song) => {
      const matchesQuery = searchQuery
        ? song.title.toLowerCase().includes(searchQuery) ||
          song.artist.toLowerCase().includes(searchQuery)
        : true;
      const matchesGenre = genre
        ? song.genre.toLowerCase().includes(genre)
        : true;
      const matchesLanguage = language
        ? song.language.toLowerCase().includes(language)
        : true;
      return matchesQuery && matchesGenre && matchesLanguage;
    });

    renderSearchResults(filteredSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Render Search Results
function renderSearchResults(songs) {
  resultsList.innerHTML = songs
    .map(
      (song) => `
        <tr>
            <td>${song.title}</td>
            <td>${song.artist}</td> 
            <td>${song.genre}</td>
            <td>${song.language}</td>
            <td>
                <button onclick="likeSong('${song._id}')">Like</button>
                <button onclick="followArtist('${song.artist}')">Follow</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Like a Song
const likeSong = async (songId) => {
  try {
    const userId = "67684b30419df48075106542";
    const response = await fetch(`/songs/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error: ${response.status} - ${errorText}`);
    }

    const newlyAddedSong = await response.json();
    // console.log("Newly added song:", newlyAddedSong);

    renderLikedSongs();
  } catch (error) {
    console.error("Error in likeSong function:", error);
  }
};

const followArtist = async (artist) => {
  try {
    const userId = "67684b30419df48075106542";
    const response = await fetch(`/artists/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error: ${response.status} - ${errorText}`);
    }

    const newlyAddedArtist = await response.json();
    console.log("Newly added artist:", newlyAddedArtist);

    renderArtists();
  } catch (error) {
    console.error("Error in likeSong function:", error);
  }
};

const renderLikedSongs = async () => {
  try {
    const response = await fetch(`/user/songs/${currentUser.id}`);
    if (!response.ok) {
      throw new Error("error status: ", response.status);
    }

    const user = await response.json();
    const likedSongs = user.likedSongs;

    const likedSongsList = document.getElementById("liked-songs-list");
    likedSongsList.innerHTML = likedSongs
      .map(
        (song) => `
        <tr>
            <td>${song.title}</td>
            <td>${song.genre}</td>
            <td>${song.artist}</td>
            <td>${song.language}</td>
        </tr>
    `
      )
      .join("");
  } catch (error) {
    console.error(error);
  }
};

const renderArtists = async () => {
  try {
    const response = await fetch(`/user/artists/${currentUser.id}`);
    if (!response.ok) {
      throw new Error("error status: ", response.status);
    }

    const user = await response.json();
    const followedArtists = user.followedArtists;
    // console.log(followedArtists); //array[]
    followedArtistsList.innerHTML = "";

    followedArtists.forEach((artist) => {
      const li = `
      <li>${artist}</li>`;

      followedArtistsList.innerHTML += li;
    });
  } catch (error) {
    console.error(error);
  }
};

// Event Listeners
searchButton.addEventListener("click", searchSongs);
