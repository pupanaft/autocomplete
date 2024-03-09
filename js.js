let input = document.querySelector(".auto-complete__text");
let autoCompleteResult = document.querySelector(".auto-complete__result");
let whiteList = document.querySelector(".whitelist");
let notFounder = document.querySelector(".auto-complete__not-found");

function createItem( element, tegClass) {
    let teg = document.createElement(element);
    if (tegClass) {
        teg.classList.add(tegClass);
    }
    return teg;
}

const debounce = (fn, debounceTime) => {
    let debounceTimer;
    return function pup() {
        clearTimeout(debounceTimer);
        debounceTimer  = setTimeout(() => fn(), debounceTime);
    }
}

let debaunceSerchUser =  debounce(serchUsers,600);

input.addEventListener('input', debaunceSerchUser);

function forFiveItem(array) {
   if (array.length === 0) {
        notFounder.textContent = 'not-found';
        return;
   }
    for (let i = 0; i < 5 ; i++) {
        let list = createItem('li', "result__item");
        let text = createItem('span','result__text');

        list.append(text);
        autoCompleteResult.append(list);

        text.textContent = array[i].name;
        list.addEventListener('click', e =>{
            autoCompleteResult.innerHTML = '';
            input.value = '';

            let whiteListItem = createItem('li', "whitelist__item");
            let whiteListText = createItem('span', "whitelist__text");
            let whiteListButton = createItem('button', "whitelist__button");
            
            whiteListItem.append(whiteListText);
            whiteListItem.append(whiteListButton);
            whiteList.append(whiteListItem);
            
            whiteListText.textContent = `Name: ${array[i].name}\nOwner: ${array[i].owner.login}\nStars: ${array[i].stargazers_count}`;
            
            whiteListButton.addEventListener('click',(e) => {
                e.target.parentElement.remove();
            },{once:true})
        },{once:true})
    }
}

async function serchUsers() {
    notFounder.textContent = '';
    autoCompleteResult.innerHTML = '';
    if( input.value === '' || input.value === ' ') return;
    return await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
    .then(response => {
        if (response.status != 200) {
          console.log(response);
        } else {
          response.json().then(response => {
              forFiveItem(response.items);
          })
        }
    },
        failResponse => {
           console.log(failResponse);
    })
}
