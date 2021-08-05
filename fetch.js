const message = document.querySelector('#message')
const serverText = document.querySelector('.serverText')
const submit = document.getElementById('submit')

const userName = document.getElementById('nameId');
const userEmail = document.getElementById('emailId');
const userDesignation = document.getElementById('desId');





const showCard = async () => {
    try {
        const response = await fetch("http://localhost:2500/api/d1/sjApi");
        const data = await response.json();
        const info = data.getEmp;
        console.log(info);

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
                                <a href="#" class="links">Edit</a>
                                <a href="#" class="links">Delete</a>
                             </div>
                        </div>
                     </div>`
        }).join('')

        message.innerHTML = cards;

    } catch (error) {
        console.log(error)
        message.innerHTML = `<h4>something went wrong,, please try again later</h4>`
        
    }
}

showCard()

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
        serverText.innerHTML = `<small>${data.msg}</small>`;
        showCard();
        userName.value = '';
        userEmail.value = '';
        userDesignation.value = '';

    } catch (error) {
        console.log(error.msg);
        serverText.innerHTML = `<small>${error.msg}</small>`;
    }

}

submit.addEventListener('click',postCard)