//Grabbing elements
const message = document.querySelector('#message');
const serverText = document.querySelector('.serverText');
const submit = document.getElementById('submit');
const edit = document.getElementById('edit');
const pre = document.getElementById('pre');


const userName = document.getElementById('nameId');
const userEmail = document.getElementById('emailId');
const userDesignation = document.getElementById('desId');

//initial values
let userSelection = false;
edit.style.display = 'none';
pre.style.display = 'none';


// <==# CRUD Operations #==>


//Fetching data from server
const showCard = async () => {
    try {
        const response = await fetch("http://localhost:2500/api/d1/sjApi");
        const data = await response.json();
        const info = data.getEmp;

        if(info.length<1){
            message.innerHTML = `<h2>Currently the list is empty</h2>`
            return;
        }

        const cards = info.map((card) =>{
            const {_id,name,email,designation} = card;
            return ` <div class="box">
                         <div class="card">
                             <h3>${name}</h3>
                             <h4>${email}</h4>
                            <span>${designation}</span>
                             <div class="icons">
                             <button type="button" class="btn edit-btn" id="editBtn" data-id="${_id}">Edit</button>
                             <button type="button" class="btn del-btn" id="dele" data-id="${_id}" onclick="confirming();">Delete</button>
                             </div>
                        </div>
                     </div>`
        }).join('')

        message.innerHTML = cards;

    } catch (error) {
        message.innerHTML = `<h4>something went wrong,, please try again later</h4>`
        
    }
}

//Getting data from server
showCard()

//Adding function
const postCard = async (e) =>{
    e.preventDefault();
    try {
        const sendData = await fetch("http://localhost:2500/api/d1/sjApi",{
            method:'POST',
            headers:{
                'content-type': 'application/json' 
            },
            body: JSON.stringify({
                name: userName.value,
                email: userEmail.value,
                designation:userDesignation.value
            })
        });
        const data = await sendData.json();

        console.log(data.msg)
        serverText.classList.add('active');
        serverText.innerHTML = `<small>${data.msg}</small>`;
        
        showCard();
        userName.value = '';
        userEmail.value = '';
        userDesignation.value = '';
        
    } catch (error) {
        serverText.classList.add('active');
        serverText.innerHTML = `<small>${error.msg}</small>`;
    }
    
    setTimeout(()=>{
        serverText.classList.remove('active');
    },3000);
    

}

//Posting data to server
submit.addEventListener('click',postCard)



//User decision
const confirming = () =>{
    userSelection = confirm(`are you sure?`)
    return userSelection;
}

//Delete function
const deleteOperation = async (e) => {
    const confirmInfo = userSelection;
    if (confirmInfo) {
        const id = e.target.dataset.id;

        try {
            res = await fetch(`http://localhost:2500/api/d1/sjApi/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json'
                }
            });
            data = await res.json();
            console.log(data.msg)
            serverText.classList.add('active');
            serverText.innerHTML = `<small>${data.msg}</small>`;
            showCard()

        } catch (error) {
            serverText.classList.add('active');
            serverText.innerHTML = `<small>${error.msg}</small>`;
        }

        setTimeout(() => {
            serverText.classList.remove('active');
        }, 3000);

        userSelection = false;
    }

}


//Filling single userData function
const fillData = async (e)=>{
    const id = e.target.dataset.id;
    try {
        const res = await fetch(`http://localhost:2500/api/d1/sjApi/${id}`,{
            method:'GET',
            headers:{
                'content-type':'application/json'
            }
        })
        const {singleEmp} = await res.json();
        // console.log(singleEmp);
        userName.value = singleEmp.name;
        userEmail.value = singleEmp.email;
        userDesignation.value = singleEmp.designation;
        
    } catch (error) {
        serverText.classList.add('active');
        serverText.innerHTML = `<small>${error.msg}</small>`;
    }
    setTimeout(() => {
        serverText.classList.remove('active');
    }, 3000);
}


//To determine EDIT or DELETE
message.addEventListener('click', async (e) => {
    if (e.target.classList.contains('del-btn')) {
       deleteOperation(e);
    }

    if (e.target.classList.contains('edit-btn')) {
        submit.style.display = 'none';
        edit.style.display = 'inline-block';
        pre.style.display = 'inline-block';
        console.log("edit");
        // Single userData
        fillData(e);
    }
})


const previous = () => {
    edit.style.display = 'none';
    pre.style.display = 'none';
    submit.style.display = 'block';
    location.reload();
}


pre.addEventListener('click' , previous)