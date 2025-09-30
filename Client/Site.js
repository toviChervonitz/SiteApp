let siteArr = [];

function getData() {
    fetch('/sites')
        .then(res => res.json())
        .then(data => {
            siteArr = data;
            displayData(siteArr);
        })
        .catch(err => {
            console.error(err);
            document.getElementById("container").innerHTML =
                "<p>no information to show</p>";
        });
}

function deleteSite(id) {
    fetch(`/sites/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            siteArr = siteArr.filter(site => site._id !== id);
            displayData(siteArr);
        })
        .catch(err => console.error(err));
}

function updateSite(id) {
    const site = siteArr.find(site => site._id === id);
    if (!site) return;
    const name = prompt("Enter new name:", site.name);
    const url = prompt("Enter new URL:", site.url);
    const image = prompt("Enter new image URL:", site.image);
    const score = prompt("Enter new score (0-10):", site.score);
    if (name && url && image && score !== null) {
        const updatedSite = { name, url, image, score: Number(score) };
        fetch(`/sites/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSite),
        })
            .then(res => res.json())
            .then(data => {                
                const index = siteArr.findIndex(site => site._id === id);
                siteArr[index] = updatedSite;
                displayData(siteArr);
            })
            .catch(err => console.error(err));
    }
}

function displayData(data) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    if (!data.length) {
        container.innerHTML = "<p>no information to show</p>";
        return;
    }

    const table = document.createElement("table");
    table.id = "sitesTable";

    table.innerHTML = `
    <thead>
      <tr>
        <th>name</th>
        <th>image</th>
        <th>link</th>
        <th>score</th>
        <th>delete</th>
        <th>update</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

    const tbody = table.querySelector("tbody");

    data.forEach(item => {
        const { name, url, image, score, _id } = item;

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${name}</td>
      <td><img src="${image}" alt="${name}" width="60" height="60"></td>
      <td><a href="${url}" target="_blank" rel="noreferrer">${url}</a></td>
      <td>${score ?? 0}/10</td>
      <td><button class="btn-del">Delete</button></td>
      <td><button class="btn-upd">Update</button></td>
    `;
        tr.querySelector('.btn-del').addEventListener('click', () => deleteSite(_id));
        tr.querySelector('.btn-upd').addEventListener('click', () => updateSite?.(_id));
        tbody.appendChild(tr);
    });

    container.appendChild(table);
}


window.onload = getData;