let percentage = document.querySelectorAll('#change')

percentage.forEach((number) => {
    if (Number(number.innerText) > 0) {
        number.parentElement.style.color = "green"

    } else if (Number(number.innerText) == 0) {
        number.parentElement.style.color = "black"
    }
    else {
        number.parentElement.style.color = 'red'
    } 

    
})


let percentageColor = document.querySelectorAll('#changeWatchlist')

percentageColor.forEach((number) => {
    if (Number(number.innerText) > 0) {
        number.parentElement.style.color = "green"

    } else if (Number(number.innerText) == 0) {
        number.parentElement.style.color = "black"
    }
    else {
        number.parentElement.style.color = 'red'

    } 

    
})
