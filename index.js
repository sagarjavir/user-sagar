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

let session = undefined;

getUser();

let promise = databases.listDocuments(DB_ID, COLLECTION_ID);

promise.then(
    (res) => {
        res.documents.reverse().forEach((doc) => {
            const suggestionEl = document.createElement("li");

            suggestionEl.className =
                "border border-white/20 p-4 rounded shadow";

            suggestionEl.innerText = doc.text;

            suggestionsEl.appendChild(suggestionEl);
        });
    },
    (err) => console.log(err)
);

form.addEventListener("submit", (e) => {
    if (itemTextarea.value !== "") {
        databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
            text: itemTextarea.value,
        });

        itemTextarea.value = "";
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
    session = await account.get("current");

    if (session) {
        loginBtn.classList.add("hidden");
        userEl.classList.remove("hidden");
        userEl.classList.add("flex");
        userEl.querySelector("span").innerText = session.name;
    } else {
        loginBtn.classList.remove("hidden");
        userEl.classList.add("hidden");
    }
}
