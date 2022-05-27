const description = document.getElementById('description');
const detailing = document.getElementById('detailing');
const contentErrand = document.getElementById('content-errand');

axios.defaults.baseURL = 'https://growdev-scrapbook-postgres.herokuapp.com/';

async function loadErrands() {
    const { data } = await axios.get('/errands');
    showErrands(data);
};

loadErrands();

async function onSaveErrand(event) {
    event.preventDefault();
    const descriptionError = document.getElementById('description-error');
    const detailingError = document.getElementById('detailing-error');
    descriptionError.innerHTML = "";
    detailingError.innerHTML = "";
    description.classList.remove('error');
    detailing.classList.remove('error');
    
    try {
        const { status } = await axios.get('/errands');
        const id = document.getElementById('errand-id');
        const successStatus = 300;
    
        const errand = {
                    description: description.value,
                    detailing: detailing.value
        };

        if (status < successStatus) {
            if (id.value) {
                await axios.put(`/errands/${id.value}`, errand);
        
            } else {
                await axios.post('/errands', errand);
            }

            description.value = '';
            detailing.value = '';
            id.value = '';
            console.log(id.value);
        }
        
    } catch(error) {

        if (!description.value) {
        descriptionError.innerHTML = 'Campo obrigatório.';
        description.classList.add('error');
        }

        if (!detailing.value) {
        detailingError.innerHTML = 'Campo obrigatório.';
        detailing.classList.add('error');
        }
    }
    loadErrands();
};

function showErrands(errands) {
    contentErrand.innerHTML = '';
    
    return errands.map(errandSaved => {
        const position = errands.indexOf(errandSaved);
        contentErrand.innerHTML += `
                 <td>${position + 1}</td>
                 <td>${errandSaved.description}</td> 
                 <td>${errandSaved.detailing}</td> 
                 <td>
                     <input type="submit" value="Editar" 
                     class="button-edit" onclick="editErrand(${errandSaved.id})">
                     <input type="submit" value="Apagar" 
                     class="button-delete" onclick="deleteErrand(${errandSaved.id})" >
                 </td>
             `;
    })
}

async function deleteErrand(id) {
await axios.delete(`/errands/${id}`)

    loadErrands();
}

async function editErrand(id) {
    const { data } = await axios.get('/errands');
    const uploadErrand = data.find(errand => errand.id === id);

    const errand = {
        id: document.getElementById('errand-id').value = uploadErrand.id,
        description: document.getElementById('description').value = uploadErrand.description,
        detailing: document.getElementById('detailing').value = uploadErrand.detailing
    };
    
    await axios.put(`/errands/${id}`, errand)
    
    loadErrands();
}

