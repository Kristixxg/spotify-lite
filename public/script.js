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

let currentUserId = "";

// Event Handlers
loginButton.addEventListener("click", async () => {
  try {
    // const validationSchema = Yup.object().shape({
    //   username: Yup.string()
    //     .min(2, "Too Short!")
    //     .max(50, "Too Long!")
    //     .required("Username is required"),
    //   password: Yup.string()
    //     .min(2, "Too Short!")
    //     .max(50, "Too Long!")
    //     .required("Password is required"),
    // });
    // const data = {
    //   username: loginUsername.value,
    //   password: loginPassword.value,
    // };

    await validationSchema.validate(data, { abortEarly: false });

    const res = await fetch("/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      alert(`Login failed: ${res.status}`);
      return;
    }

    const dataJson = await res.json();

    currentUserId = dataJson.userId;
    console.log(dataJson.userId);
    const { token } = dataJson;

    window.localStorage.setItem("username", username);
    window.localStorage.setItem("token", token);

    switchScreen(mainScreen);
    renderLikedSongs(currentUserId);
    renderArtists(currentUserId);
  } catch (error) {
    console.error(`Login unsucessfully: ${error}`);
  }
});

signupButton.addEventListener("click", async () => {
  try {
    const data = {
      username: signupUsername.value,
      email: signupEmail.value,
      password: signupPassword.value,
    };

    await validationSchema.validate(data, { abortEarly: false });

    const res = await fetch("/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert("Cannot create User", res.status);
      return;
    }
    const dataJson = await res.json();
    console.log(dataJson);
    const { token } = dataJson;
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("username", username);
    switchScreen(loginScreen);
  } catch (error) {
    alert(`Sign up failed: ${error}`);
  }
});

goToSignup.addEventListener("click", () => switchScreen(signupScreen));
goToLogin.addEventListener("click", () => switchScreen(loginScreen));

logoutButton.addEventListener("click", async () => {
  try {
    const res = await fetch("/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      alert("Unable to logout");
      return;
    }

    const dataJson = await res.json();
    console.log(dataJson.message);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    switchScreen(loginScreen);
  } catch (error) {
    console.error(`Error occur: ${error.message}`);
  }
});

editSaveButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`/user/info/${currentUserId}`, {
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

    const dataJson = await response.json();
    console.log("response here", dataJson.message);
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
    if (currentUserId === "") {
      alert("Please Login First");
      return;
    }
    const response = await fetch(`/songs/${currentUserId}`, {
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

    renderLikedSongs(currentUserId);
  } catch (error) {
    console.error("Error in likeSong function:", error);
  }
};

const followArtist = async (artist) => {
  try {
    if (currentUserId === "") {
      alert("Please Login First");
      return;
    }
    // const userId = "67684b30419df48075106542";
    const response = await fetch(`/artists/${currentUserId}`, {
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

    renderArtists(currentUserId);
  } catch (error) {
    console.error("Error in likeSong function:", error);
  }
};

const renderLikedSongs = async (id) => {
  try {
    const response = await fetch(`/user/songs/${id}`);
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

const renderArtists = async (id) => {
  try {
    const response = await fetch(`/user/artists/${id}`);
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
