// TODO:
// - figure out how to attach a user to a document
// - figure out how to only allow logged in user to create a document
// - change urls from localhost to vercel

const suggestionsEl = document.getElementById("suggestions");
const formEl = document.getElementById("form");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userEl = document.getElementById("user");
const itemTextarea = document.getElementById("item");

const { Client, Account, Databases, ID } = Appwrite;

const client = new Client();
const DB_ID = "65b8c6d89b2df94abe96";
const COLLECTION_ID = "65b8c711e87ba5bd74d9";

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("65b8c652633c7004423f");

const databases = new Databases(client);
const account = new Account(client);

let blocked = false;
let session = undefined;

getUser();
getSuggestions();

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (itemTextarea.value !== "" && session && !blocked) {
        await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
            text: itemTextarea.value,
            owner_name: session.name,
        });

        itemTextarea.value = "";
        blocked = true;

        setTimeout(() => {
            blocked = false;
        }, 15000);

        getSuggestions();
    }
});

loginBtn.addEventListener("click", () => {
    account.createOAuth2Session(
        "github",
        "http://localhost:5500",
        "http://localhost:5500",
        ["account"]
    );
});

logoutBtn.addEventListener("click", async () => {
    await account.deleteSession("current");
    getUser();
    location.reload();
});

async function getUser() {
    try {
        session = await account.get("current");
    } catch (e) {
        console.log(e);
    }
    if (session) {
        formEl.classList.remove("hidden");
        loginBtn.classList.add("hidden");
        userEl.classList.remove("hidden");
        userEl.classList.add("flex");
        userEl.querySelector("span").innerText = session.name;
    } else {
        formEl.classList.add("hidden");
        loginBtn.classList.remove("hidden");
        userEl.classList.add("hidden");
    }
}

async function getSuggestions() {
    suggestionsEl.innerHTML = "";

    const res = await databases.listDocuments(DB_ID, COLLECTION_ID);

    if (res.documents.length === 0) {
        suggestionsEl.innerHTML = "No suggestions yet";
    }

    res.documents.reverse().forEach((doc) => {
        const suggestionEl = document.createElement("li");

        console.log(doc, session);

        suggestionEl.className =
            "flex items-center border border-white/20 p-4 rounded shadow";

        suggestionEl.innerHTML = `<strong>${doc.owner_name}</strong>: ${doc.text}`;

        if (
            doc.$permissions.includes(`delete("user:${session.$id}")`) ||
            session.labels.includes("admin")
        ) {
            const deleteBtn = document.createElement("button");

            deleteBtn.className = "text-red-500 ml-auto hover:text-red-800";

            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`;

            deleteBtn.addEventListener("click", async () => {
                await databases.deleteDocument(DB_ID, COLLECTION_ID, doc.$id);

                getSuggestions();
            });

            suggestionEl.appendChild(deleteBtn);
        }

        suggestionsEl.appendChild(suggestionEl);
    });
}
