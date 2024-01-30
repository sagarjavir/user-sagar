const suggestionsEl = document.getElementById("suggestions");
const formEl = document.getElementById("form");
const itemTextarea = document.getElementById("item");

const { Client, Databases, ID } = Appwrite;

const client = new Client();
const DB_ID = "65b8c6d89b2df94abe96";
const COLLECTION_ID = "65b8c711e87ba5bd74d9";

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("65b8c652633c7004423f");

const databases = new Databases(client);

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
