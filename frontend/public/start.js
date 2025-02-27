fetch('http://localhost:3000/api/stores')
.then(res => res.json())
.then(stores => {
    const ul = document.getElementById('store-list');
    stores.forEach(store =>{
        const li = document.createElement("li")
        li.innerHTML = `${store.name} - Website: <a href=${store.url || 'Not Available'}> - District: ${store.district || "Not Available"}`
        ul.appendChild(li);
    });
})
.catch(err => console.error("Error fetching stores",err.stack));